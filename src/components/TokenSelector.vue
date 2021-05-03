<template>
  <div class="token-selector">
    <h6 class="token-selector-payment-info">
      Select one of the following tokens to initiate a transfer equivalent to
      {{ chargeAmount | formattedCurrency(chargeCurrencyCode) }}
    </h6>
    <ul class="token-selector-options">
      <TokenSelectorItem v-for="token in acceptedTokens" :key="token.address" :token="token" />
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {filters as hub20filters} from 'hub20-vue-sdk'

import TokenSelectorItem from './TokenSelectorItem.vue'

export default {
  name: 'TokenSelector',
  filters: {
    formattedCurrency: hub20filters.formattedCurrency,
  },
  components: {
    TokenSelectorItem,
  },
  computed: {
    ...mapGetters(['chargeCurrencyCode', 'chargeAmount', 'acceptedTokens']),
  },
}
</script>
