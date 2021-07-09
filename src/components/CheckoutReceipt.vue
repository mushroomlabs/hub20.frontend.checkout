<template>
<div class='checkout-receipt'>
  <slot>Payment Completed!</slot>
</div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
    name: 'CheckoutReceipt',
    computed: {
        ...mapGetters(['onCheckoutFinished', 'paymentOrder']),
        ...mapState(['checkout'])
    },
  mounted() {
    if (this.onCheckoutFinished) {
      this.onCheckoutFinished(this.checkout)
    }
  }
}
</script>
