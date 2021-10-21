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

  this._checkout = new VueCheckout({store})
  this._checkout.$store.dispatch('initialize', {
    serverUrl, storeId, charge, options
  })
  this._checkout.$mount()
  container.appendChild(this._checkout.$el)

  CURRENT_CHECKOUT = this._checkout

  this.close = function () {
    this._checkout.$store.actions.close()
  }

  this.open = function () {
    this._checkout.$store.actions.open()
  }
}

export {checkout}
