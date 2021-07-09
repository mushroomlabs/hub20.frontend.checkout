import Decimal from 'decimal.js-light'
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import {store, api, filters} from 'hub20-vue-sdk'

export const STORE_SET = 'STORE_SET'
export const STORE_SET_OPENED = 'STORE_SET_OPENED'
export const STORE_SET_CLOSED = 'STORE_SET_CLOSED'

export const CHARGE_SET_DATA = 'CHARGE_SET_DATA'
export const CHECKOUT_SET_DATA = 'CHECKOUT_SET_DATA'
export const CHECKOUT_SET_OPTIONAL_HANDLERS = 'CHECKOUT_SET_OPTIONAL_HANDLERS'
export const CHECKOUT_RESET = 'CHECKOUT_RESET'
export const CHECKOUT_SET_CANCELED = 'CHECKOUT_SET_CANCELED'
export const CHECKOUT_SET_PAYMENT_SENT = 'CHECKOUT_SET_PAYMENT_SENT'
export const CHECKOUT_SET_PAYMENT_RECEIVED = 'CHECKOUT_SET_PAYMENT_RECEIVED'
export const CHECKOUT_SET_PAYMENT_CONFIRMED = 'CHECKOUT_SET_PAYMENT_CONFIRMED'
export const CHECKOUT_SET_EXPIRED = 'CHECKOUT_SET_EXPIRED'
export const CHECKOUT_WEBSOCKET_OPEN = 'CHECKOUT_WEBSOCKET_OPEN'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const initialState = () => ({
  merchantStore: null,
  checkout: null,
  handlers: null,
  charge: null,
  websocket: null,
})

const getters = {
  isLoaded: state => Boolean(state.merchantStore),
  isReady: (state, getters) => getters.isLoaded && Boolean(state.checkout),
  storeId: state => state.merchantStore && state.merchantStore.id,
  onCheckoutCanceled: state => state.handlers && state.handlers.onCheckoutCanceled,
  onCheckoutFinished: state => state.handlers && state.handlers.onCheckoutFinished,
  checkoutId: state => state.checkout && state.checkout.id,
  chargeCurrencyCode: state => state.charge && state.charge.currencyCode,
  chargeAmount: state => state.charge && state.charge.amount,
  externalIdentifier: state => state.charge && state.charge.externalIdentifier,
  payments: state => state.checkout && state.checkout.payments,
  paymentToken: (state, getters, _, rootGetters) => {
    let tokenUrl = state.checkout && state.checkout.token
    return tokenUrl && rootGetters['tokens/tokensByUrl'][tokenUrl]
  },
  tokenPayments: (state, getters) => {
    let token = getters.paymentToken
    return (
      (token &&
        getters.payments.filter(payment => payment.currency.address == token.address)) ||
      []
    )
  },
  totalAmountPaid: (state, getters) =>
    getters.payments.reduce((acc, payment) => acc + payment.amount, 0),
  isPaid: (state, getters) => getters.totalAmountPaid >= getters.tokenAmountDue,
  isExpired: state => state.checkout && state.checkout.status === 'expired',
  isFinalized: state => state.checkout && state.checkout.status !== 'open',
  tokenAmountDue: (state, getters, _, rootGetters) => token => {
    let exchangeRate = rootGetters['coingecko/exchangeRate'](token)
    let tokenAmount = getters.chargeAmount && getters.chargeAmount / exchangeRate
    return tokenAmount && Decimal(tokenAmount).toDecimalPlaces(token.decimals)
  },
  pendingAmountDue: (state, getters) => {
    if (!state.checkout) return null
    if (!state.checkout.amount) return null

    const received = getters.tokenPayments.reduce(
      (acc, payment) => acc.add(Decimal(payment.amount)),
      Decimal(0)
    )
    return Decimal(state.checkout.amount).minus(received)
  },
  acceptedTokens: (state, getters, rootState) => {
    let allTokens = rootState.tokens.tokens
    let tokenUrls = state.merchantStore && state.merchantStore.accepted_currencies
    return tokenUrls && allTokens && allTokens.filter(t => tokenUrls.includes(t.url))
  },
}

const mutations = {
  [STORE_SET](state, storeData) {
    state.merchantStore = storeData
  },
  [CHARGE_SET_DATA](state, chargeData) {
    state.charge = chargeData
  },
  [CHECKOUT_SET_DATA](state, checkoutData) {
    state.checkout = checkoutData
  },
  [CHECKOUT_SET_OPTIONAL_HANDLERS](state, options) {
    state.handlers = {
      onCheckoutFinished: options && options.onComplete,
      onCheckoutCanceled: options && options.onCancel
    }
  },
  [CHECKOUT_RESET](state) {
    state.checkout = null

    if (state.websocket) {
      state.websocket.close()
    }
  },
  [CHECKOUT_WEBSOCKET_OPEN](state, websocket) {
    state.websocket = websocket
  },
}

const actions = {
  setServer({dispatch}, url) {
    return dispatch('server/setUrl', url)
  },
  setStore({commit}, storeId) {
    return api.stores.get(storeId).then(({data}) => commit(STORE_SET, data))
  },
  startCheckout({commit, dispatch, getters, state}, token) {
    let tokenAmount = getters.tokenAmountDue(token)

    return api.checkout
      .create({
        storeData: state.merchantStore,
        externalIdentifier: getters.externalIdentifier,
        token,
        tokenAmount,
      })
      .then(({data}) => {
        commit(CHECKOUT_SET_DATA, data)
        dispatch('listenCheckoutWebSocket', data.id)
      })
  },
  leaveCheckout({commit, getters, state}) {
    if (getters.onCheckoutCanceled) {
      getters.onCheckoutCanceled(state.checkout)
    }
    commit(CHECKOUT_RESET)
  },
  listenCheckoutWebSocket({commit, dispatch, getters, rootGetters}, checkoutId) {
    const ws = new WebSocket(rootGetters['server/checkoutEventWebsocketUrl'](checkoutId))
    const eventHandler = evt => {
      let eventTypes = store.EVENT_TYPES
      const message = JSON.parse(evt.data)
      const eventData = message.data
      switch (message.event) {
        case eventTypes.BLOCKCHAIN_BLOCK_CREATED:
          commit('network/NETWORK_SET_ETHEREUM_CURRENT_BLOCK', message.block)
          break
        case eventTypes.BLOCKCHAIN_DEPOSIT_BROADCAST:
          commit('notifications/ADD_NOTIFICATION', {
            message: 'Blockchain transaction sent',
            type: 'info',
          })
          break
        case eventTypes.RAIDEN_ROUTE_EXPIRED:
        case eventTypes.BLOCKCHAIN_ROUTE_EXPIRED:
          commit('notifications/ADD_NOTIFICATION', {
            message: 'Payment route expired. Any payment received through it may be ignored',
            type: 'danger',
          })
          break
        case eventTypes.ETHEREUM_NODE_UNAVAILABLE:
          commit('notifications/ADD_NOTIFICATION', {
            message: 'Server reported loss of connection with ethereum network',
            type: 'danger',
          })
          break
        case eventTypes.ETHEREUM_NODE_OK:
          commit('notifications/ADD_NOTIFICATION', {
            message: 'Server connection with ethereum network established',
            type: 'success',
          })
          break
        case eventTypes.BLOCKCHAIN_DEPOSIT_RECEIVED:
          dispatch('funding/fetchDeposit', eventData.depositId)
          commit('notifications/ADD_NOTIFICATION', {
            message: 'Deposit received via blockchain',
            type: 'success',
          })
          break
        default:
          console.log(evt)
      }
      dispatch('fetchCheckout', checkoutId)
    }

    ws.onmessage = eventHandler
    commit(CHECKOUT_WEBSOCKET_OPEN, ws)
  },
  fetchCheckout({commit, dispatch}, checkoutId) {
    return api.checkout.fetch(checkoutId).then(({data}) => commit(CHECKOUT_SET_DATA, data))
  },
  initialize({commit, dispatch, getters}, {serverUrl, storeId, charge, options}) {
    return dispatch('coingecko/fetchCoingeckoTokenList')
      .then(() => dispatch('coingecko/setBaseCurrency', charge.currencyCode))
      .then(() => dispatch('setServer', serverUrl))
      .then(() => dispatch('network/initialize'))
      .then(() => dispatch('setStore', storeId))
      .then(() => dispatch('tokens/initialize'))
      .then(() => commit(CHARGE_SET_DATA, charge))
      .then(() => commit(CHECKOUT_SET_OPTIONAL_HANDLERS, options))
      .then(() => dispatch('refresh'))
  },
  refresh({dispatch, getters}) {
    getters.acceptedTokens.forEach(token => dispatch('coingecko/fetchRate', token))

    if (getters.checkoutId) {
      dispatch('fetchCheckout', getters.checkoutId)
    }

    dispatch('network/refresh')
  },
}

export default new Vuex.Store({
  modules: store,
  state: initialState(),
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  actions,
  getters,
  mutations,
})
