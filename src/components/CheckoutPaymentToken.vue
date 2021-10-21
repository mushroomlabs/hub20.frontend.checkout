<template>
  <div class="payment-token-display" v-if="token">
    <span class="payment-token-text">Pay with:</span>
    <span class="payment-token-value">
      <span class="token-name">{{ token.name }}</span>
      <span class="token-code">{{ token.code }}</span>
      <TokenLogo :token="token" />
    </span>
  </div>
</template>

<script>
import {components as hub20Components, filters as hub20filters} from 'hub20-vue-sdk'

export default {
  name: 'checkout-payment-token',
  components: {
    TokenLogo: hub20Components.TokenLogo,
  },
  props: {
    token: Object,
  },
}
</script>
