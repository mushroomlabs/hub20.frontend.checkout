<template>
  <div id="hub20-checkout">
    <a v-if="checkout && debug" :href="checkout.url" target="_blank">Checkout API</a>
    <button v-on:click="exit">Close</button>
    <Spinner v-if="!merchantStore" message="Loading payment options..." />
    <TokenSelector v-if="merchantStore && !checkout" />
    <CheckoutInvoice v-if="merchantStore && checkout && !isFinalized" />
    <CheckoutReceipt v-if="merchantStore && checkout && isFinalized" :checkout="checkout" />
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'

import CheckoutInvoice from './CheckoutInvoice'
import CheckoutReceipt from './CheckoutReceipt'
import TokenSelector from './TokenSelector'
import Spinner from './Spinner'

export default {
  name: 'checkout',
  components: {
    CheckoutInvoice,
    CheckoutReceipt,
    TokenSelector,
    Spinner,
  },
  props: {
    debug: Boolean,
  },
  data() {
    return {
      timerId: null,
    }
  },
  computed: {
    ...mapState('checkout', ['checkout', 'merchantStore']),
    ...mapGetters('checkout', ['isFinalized', 'payments']),
  },
  methods: {
    ...mapActions(['refresh', 'leaveCheckout']),
    exit() {
      const isOpen = this.checkout && this.payments.length > 0 && !this.isFinalized

      if (
        !isOpen ||
        confirm('You already made transfers in the current checkout. Leave anyway?')
      ) {
        this.leaveCheckout()
      }
    },
  },
  mounted() {
    this.timerId = setInterval(this.refresh, 15 * 1000)
  },
}
</script>
