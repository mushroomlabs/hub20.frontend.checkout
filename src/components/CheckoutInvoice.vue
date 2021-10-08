<template>
  <div class="checkout-invoice">
    <h1>
      <slot>
        Payment to <span class="store">{{ merchantStore.name }}</span>
      </slot>
    </h1>
    <PaymentRequest :paymentRequest="checkout" />
  </div>
</template>

<script>
import {mapState} from 'vuex'

import {components as hub20Components} from 'hub20-vue-sdk'

export default {
  name: 'checkout-invoice',
  components: {
    PaymentRequest: hub20Components.PaymentRequest,
  },
  computed: {
    ...mapState('checkout', ['checkout', 'merchantStore']),
  },
}
</script>
