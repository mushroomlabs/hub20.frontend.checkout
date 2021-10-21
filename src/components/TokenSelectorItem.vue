<template>
  <li v-if="token" v-on:click="selectToken" class="token-selector-item">
    <span class="token-name">{{ token.name }}</span>
    <TokenLogo :token="token" />
    <div class="token-exchange-rate">
      <span class="rate">
        Current Rate:
        <span class="value"
          >{{ tokenExchangeRate | formattedCurrency(baseCurrencyCode) }} / {{ token.code }}
        </span>
      </span>
      <span class="token-amount"
        >Total to Pay:
        <span class="value">{{ tokenAmount | formattedAmount(token, 5) }}</span></span
      >
    </div>
  </li>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {filters as hub20filters, mixins, components} from 'hub20-vue-sdk'

export default {
  name: 'TokenSelectorItem',
  mixins: [mixins.TokenMixin],
  components: {
    TokenLogo: components.TokenLogo,
  },
  filters: {
    formattedCurrency: hub20filters.formattedCurrency,
    formattedAmount: hub20filters.formattedAmount,
  },
  props: {
    token: Object,
    baseAmount: [Number, Object],
    baseCurrencyCode: String,
  },
  computed: {
    tokenExchangeRate() {
      return this.exchangeRate(this.token)
    },
    tokenAmount() {
      if (!this.baseAmount || !this.tokenExchangeRate) {
        return 0
      }

      return Number(this.baseAmount / this.tokenExchangeRate).toFixed(this.token.decimals)
    },
    ...mapGetters('coingecko', ['exchangeRate']),
  },
  methods: {
    ...mapActions('checkout', {startCheckout: 'start'}),
    selectToken: function() {
      this.startCheckout({token: this.token, tokenAmount: this.tokenAmount})
    },
  },
}
</script>
