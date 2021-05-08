import Decimal from 'decimal.js-light'
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import {store, api} from 'hub20-vue-sdk'

export const STORE_SET = 'STORE_SET'
export const STORE_PAYMENT_TOKEN_SELECTED = 'STORE_PAYMENT_TOKEN_SELECTED'
export const STORE_SET_OPENED = 'STORE_SET_OPENED'
export const STORE_SET_CLOSED = 'STORE_SET_CLOSED'

export const CHARGE_SET_DATA = 'CHARGE_SET_DATA'
export const CHECKOUT_SET_DATA = 'CHECKOUT_SET_DATA'
export const CHECKOUT_RESET = 'CHECKOUT_RESET'
export const CHECKOUT_SET_CANCELED = 'CHECKOUT_SET_CANCELED'
export const CHECKOUT_SET_PAYMENT_SENT = 'CHECKOUT_SET_PAYMENT_SENT'
export const CHECKOUT_SET_PAYMENT_RECEIVED = 'CHECKOUT_SET_PAYMENT_RECEIVED'
export const CHECKOUT_SET_PAYMENT_CONFIRMED = 'CHECKOUT_SET_PAYMENT_CONFIRMED'
export const CHECKOUT_SET_EXPIRED = 'CHECKOUT_SET_EXPIRED'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const initialState = () => ({
  merchantStore: null,
  selectedToken: null,
  checkout: null,
  extraOptions: null,
  isFinalized: false,
  charge: null,
})

const getters = {
  isLoaded: state => Boolean(state.merchantStore),
  isReady: (state, getters) => getters.isLoaded && Boolean(state.checkout),
  storeId: state => state.merchantStore && state.merchantStore.id,
  onCheckoutCanceled: state => state.extraOptions && state.extraOptions.onCheckoutCanceled,
  onCheckoutFinished: state => state.extraOptions && state.extraOptions.onCheckoutFinished,
  checkoutId: state => state.checkout && state.checkout.id,
  chargeCurrencyCode: state => state.charge && state.charge.currencyCode,
  chargeAmount: state => state.charge && state.charge.amount,
  externalIdentifier: state => state.charge && state.charge.externalIdentifier,
  tokenAmountDue: (state, getters, _, rootGetters) => token => {
    let exchangeRate = rootGetters['coingecko/exchangeRate'](token)
    let tokenAmount = getters.chargeAmount && (getters.chargeAmount / exchangeRate)
    return tokenAmount && Decimal(tokenAmount).toDecimalPlaces(token.decimals)
  },
  acceptedTokens: (state, getters, rootState) => {
    let allTokens = rootState.tokens.tokens
    let tokenUrls = state.merchantStore && state.merchantStore.accepted_currencies
    return tokenUrls && allTokens && allTokens.filter(t => tokenUrls.includes(t.url))
  }
}

const mutations = {
  [STORE_SET](state, storeData) {
    state.merchantStore = storeData
  },
  [STORE_SET_OPENED](state) {
    state.running = true
  },
  [STORE_SET_CLOSED](state) {
    state.running = false
  },
  [CHARGE_SET_DATA](state, chargeData) {
    state.charge = chargeData
  },
  [CHECKOUT_SET_DATA](state, checkoutData) {
    state.checkout = checkoutData
  },
  [CHECKOUT_RESET](state) {
    state.checkout = null
    state.selectedToken = null
    state.isFinalized = false
  },
  [CHECKOUT_SET_CANCELED](state) {
    state.isFinalized = true
  },
  [STORE_PAYMENT_TOKEN_SELECTED](state, token) {
    state.selectedToken = token
  },
}

const actions = {
  setServer({dispatch}, url) {
    return dispatch('server/setUrl', url)
  },
  setStore({commit}, storeId) {
    return api.stores.get(storeId).then(({data}) => commit(STORE_SET, data))
  },
  startCheckout({commit, state, getters}, token) {
    let tokenAmount = getters.tokenAmountDue(token)

    return api.checkout
              .create({storeData: state.merchantStore, externalIdentifier: getters.externalIdentifier, token, tokenAmount})
              .then(({data}) => commit(CHECKOUT_SET_DATA, data))
  },
  fetchCheckout({commit}, checkoutId) {
    return api.stores.fetchCheckout(checkoutId).then(({data}) => commit(CHECKOUT_SET_DATA, data))
  },
  initialize({commit, dispatch, getters}, {serverUrl, storeId, charge}) {
    return dispatch('coingecko/fetchCoingeckoTokenList')
      .then(() => dispatch('coingecko/setBaseCurrency', charge.currencyCode))
      .then(() => dispatch('setServer', serverUrl))
      .then(() => dispatch('setStore', storeId))
      .then(() => dispatch('tokens/initialize'))
      .then(() => commit(CHARGE_SET_DATA, charge))
      .then(() => dispatch('refresh'))
  },
  refresh({dispatch, getters}) {
    getters.acceptedTokens.forEach(token => dispatch('coingecko/fetchRate', token))

    if (getters.checkoutId) {
      dispatch('fetchCheckout', getters.checkoutId)
    }
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
