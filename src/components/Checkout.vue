<template>
  <div id="hub20-checkout">
    <Spinner v-if="selectedToken && !checkout" message="Loading payment options..." />
    <TokenSelector v-if="!checkout" />
    <PaymentRequest v-if="checkout && !isFinalized" :paymentRequest="checkout" />
    <CheckoutReceipt v-if="checkout && isFinalized" />
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

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
  props: {
    settings: Object,
  },
  data() {
    return {
      timerId: null
    }
  },
  computed: {
    ...mapState(['checkout', 'selectedToken', 'isFinalized']),
  },
  methods: {
    ...mapActions('refresh')
  },
  mounted() {
    this.timerId = setInterval(this.refresh, 15 * 1000);
  }
}
</script>
