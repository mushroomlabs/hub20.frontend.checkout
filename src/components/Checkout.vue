<template>
  <div id="hub20-checkout">
    <a v-if="checkout && debug" :href="checkout.url" target="_blank">Checkout API</a>
    <button v-on:click="exit">Close</button>
    <Spinner v-if="!merchantStore" message="Loading payment options..." />
    <TokenSelector v-if="merchantStore && !checkout" />
    <div v-if="merchantStore && checkout">
      <h1>
        Payment to <span class="store">{{ merchantStore.name }}</span>
      </h1>
      <PaymentRequest v-if="!isFinalized" :paymentRequest="checkout" />
      <CheckoutReceipt v-if="isFinalized" />
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'

import {components as hub20Components} from 'hub20-vue-sdk'

import CheckoutReceipt from './CheckoutReceipt'
import TokenSelector from './TokenSelector'
import Spinner from './Spinner'

export default {
  name: 'checkout',
  components: {
    PaymentRequest: hub20Components.PaymentRequest,
    CheckoutReceipt,
    TokenSelector,
    Spinner,
  },
  data() {
    return {
      timerId: null,
    }
  },
  computed: {
    ...mapState(['checkout', 'merchantStore']),
    ...mapGetters(['isFinalized', 'payments']),
    debug: () => process.env.NODE_ENV === 'development',
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
