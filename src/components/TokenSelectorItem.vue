<template>
  <li v-if="token" v-on:click="selectToken" class="token-selector-item">
    <span class="token-name">{{ token.name }}</span>
    <img v-if="tokenLogo" :src="tokenLogo" :alt="token.name" />
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

      return this.baseAmount / this.tokenExchangeRate
    },
    tokenLogo() {
      return this.tokenLogoByAddress(this.token.address)
    },
    ...mapGetters('coingecko', ['exchangeRate', 'tokenLogoByAddress']),
  },
  methods: {
    ...mapActions('checkout', ['startCheckout']),
    ...mapActions('coingecko', ['fetchTokenLogoUrl']),
    selectToken: function() {
      this.startCheckout(this.token)
    },
  },
  mounted() {
    this.fetchTokenLogoUrl(this.token)
  },
}
</script>
