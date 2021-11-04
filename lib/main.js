import Vue from 'vue'

import Checkout from '@/components/Checkout'
import store from '@/store'

var CURRENT_CHECKOUT = null

function checkout(selector, {serverUrl, storeId, charge, options}) {
  let container = document.querySelector(selector)
  if (!container) {
    throw `${selector} is not a valid document selector`
  }

  if (CURRENT_CHECKOUT) {
    CURRENT_CHECKOUT.$el.remove()
  }

  let VueCheckout = Vue.extend(Checkout)

  const props = {
    onCheckoutCompleted: options.onComplete,
    onCheckoutExpired: options.onExpired,
    onCheckoutCanceled: options.onCanceled,
    onOpen: options.onOpen,
    onClose: options.onClose,
  }

  this._checkout = new VueCheckout({store, props})
  this._checkout.$store.dispatch('initialize', {
    serverUrl,
    storeId,
    charge,
  })
  this._checkout.$mount()
  container.appendChild(this._checkout.$el)

  CURRENT_CHECKOUT = this._checkout
}

export {checkout}
