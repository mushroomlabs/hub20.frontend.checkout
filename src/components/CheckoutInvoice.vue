<template>
  <div class="checkout-invoice">
    <Invoice :paymentRequest="checkout" />
  </div>
</template>

<script>
import {mapState} from 'vuex'

import {components as hub20Components} from 'hub20-vue-sdk'

export default {
  name: 'checkout-invoice',
  components: {
    Invoice: hub20Components.Payment.Invoice,
  },
  computed: {
    ...mapState('checkout', ['checkout', 'merchantStore']),
  },
}
</script>
