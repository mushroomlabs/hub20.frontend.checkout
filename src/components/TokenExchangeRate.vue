<template>
  <div v-if="token" class="token-exchange-rate">
    <div class="rate">Current rate: {{ exchangeRateFormatted }}</div>
    <div class="due">
      Total to Pay:
      <TokenAmountDisplay
        :token="token"
        :amount="this.chargeAmount"
        :max-significant-digits="6"
      />
    </div>
  </div>
</template>

<script>
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
    exchangeRateFormatted: function () {
      let exchangeRate = this.exchangeRate(this.token)
      let formatter = new Intl.NumberFormat([], {
        style: 'currency',
        currency: this.chargeCurrencyCode
      })
      return `${formatter.format(exchangeRate)} / ${this.token.code}`
    },
    ...mapGetters('coingecko', ['exchangeRate']),
    ...mapGetters(['chargeCurrencyCode', 'chargeAmount']),
  },
  methods: {
    ...mapActions('coingecko', ['fetchRate']),
  },
  mounted() {
    this.fetchRate(this.token)
  }
}
</script>
