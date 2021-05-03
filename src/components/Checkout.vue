<template>
  <div id="hub20-checkout">
    <Spinner v-if="selectedToken && !checkout" message="Loading payment options..." />
    <TokenSelector v-if="!checkout" />
    <PaymentOrder v-if="checkout && !isFinalized" />
    <CheckoutReceipt v-if="checkout && isFinalized" />
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

import CheckoutReceipt from './CheckoutReceipt'
import TokenSelector from './TokenSelector'
import PaymentOrder from './PaymentOrder'
import Spinner from './Spinner'

export default {
  name: 'checkout',
  components: {
    CheckoutReceipt,
    TokenSelector,
    PaymentOrder,
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
