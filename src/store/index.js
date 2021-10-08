import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import {store, api} from 'hub20-vue-sdk'


const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)


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
      .then(() => commit('checkout/CHECKOUT_SET_OPTIONAL_HANDLERS', options))
      .then(() => dispatch('refresh'))
  },
  refresh({dispatch, rootGetters}) {
    let acceptedTokens = rootGetters['checkout/acceptedTokens']
    let checkoutId = rootGetters['checkout/checkoutId']

    acceptedTokens.forEach(token => dispatch('coingecko/fetchRate', token))

    if (checkoutId) {
      dispatch('checkout/fetchCheckout', checkoutId)
    }

    dispatch('network/refresh')
  },
}

export default new Vuex.Store({
  modules: store,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  actions,
})
