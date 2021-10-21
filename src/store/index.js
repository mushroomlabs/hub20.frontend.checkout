import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import {store, api} from 'hub20-vue-sdk'

const debug = process.env.NODE_ENV !== 'production'

export const CHECKOUT_OPENED = 'CHECKOUT_OPENED'
export const CHECKOUT_CLOSED = 'CHECKOUT_CLOSED'

Vue.use(Vuex)

const initialState = () => ({
  isOpen: false,
  onCheckoutCompletedHandler: null,
  onCheckoutExpiredHandler: null,
  onCheckoutCanceledHandler: null,
  onClosedHandler: null,
  onOpenedHandler: null,
})

const mutations = {
  [CHECKOUT_OPENED](state) {
    state.isOpen = true
  },
  [CHECKOUT_CLOSED](state) {
    state.isOpen = false
  },
}

const actions = {
  setServer({dispatch}, url) {
    return dispatch('server/setUrl', url)
  },
  setStore({commit}, storeId) {
    return api.stores.get(storeId).then(({data}) => commit('checkout/STORE_SET', data))
  },
  initialize({commit, dispatch}, {serverUrl, storeId, charge, options}) {
    return dispatch('coingecko/fetchCoingeckoTokenList')
      .then(() => dispatch('coingecko/setBaseCurrency', charge.currencyCode))
      .then(() => dispatch('setServer', serverUrl))
      .then(() => dispatch('network/initialize'))
      .then(() => dispatch('setStore', storeId))
      .then(() => dispatch('tokens/initialize'))
      .then(() => commit('checkout/CHARGE_SET_DATA', charge))
      .then(() => dispatch('refresh'))
  },
  refresh({dispatch, rootGetters}) {
    let acceptedTokens = rootGetters['checkout/acceptedTokens']
    let checkoutId = rootGetters['checkout/checkoutId']

    acceptedTokens.forEach(token => dispatch('coingecko/fetchRate', token))

    if (checkoutId) {
      dispatch('checkout/fetch', checkoutId)
    }

    dispatch('network/refresh')
  },
  cancel({dispatch, state, rootState}) {
    if (state.onCheckoutCanceledHandler){
      const checkout = rootState['checkout/checkout']
      state.onCheckoutCanceledHandler(checkout)
    }

    dispatch('checkout/reset')

  },
  close({commit}) {
    if (state.onClosedHandler){
      state.onClosedHandler()
    }
    commit(CHECKOUT_CLOSED)
  },
  open({commit, state}) {
    commit(CHECKOUT_OPENED)

    if (state.onOpenedHandler){
      state.onOpenedHandler()
    }
  },
}

export default new Vuex.Store({
  modules: store,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  state: initialState(),
  actions,
  mutations,
})
