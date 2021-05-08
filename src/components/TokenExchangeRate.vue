<template>
  <div v-if="token" class="token-exchange-rate">
    <div class="rate">Current rate: {{ exchangeRateFormatted }}</div>
    <div class="due">
      Total to Pay:
      <TokenAmountDisplay
        :token="token"
        :amount="this.tokenAmountDue(token)"
        :max-significant-digits="6"
      />
    </div>
  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
import {mapGetters, mapActions} from 'vuex'

import TokenAmountDisplay from './TokenAmountDisplay.vue'

export default {
  name: 'TokenExchangeRate',
  components: {
    TokenAmountDisplay,
  },
  props: {
    token: Object,
  },
  computed: {
    currentRate() {
      return this.exchangeRate(this.token)
    },
    exchangeRateFormatted() {
      let formatter = new Intl.NumberFormat([], {
        style: 'currency',
        currency: this.chargeCurrencyCode
      })
      return `${formatter.format(this.currentRate)} / ${this.token.code}`
    },
    ...mapGetters('coingecko', ['exchangeRate']),
    ...mapGetters(['chargeCurrencyCode', 'chargeAmount', 'tokenAmountDue']),
  },
  methods: {
    ...mapActions('coingecko', ['fetchRate']),
  },
  mounted() {
    this.fetchRate(this.token)
  }
}
</script>
