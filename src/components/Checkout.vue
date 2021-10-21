<template>
  <div v-if="isLoaded" id="hub20-checkout">
    <span class="store">{{ merchantStore.name }}</span>
    <div class="charge-details-display">
      <span class="charge-amount-text">Total Due:</span>
      <span class="charge-amount-value">{{ chargeAmount | formattedCurrency(chargeCurrencyCode) }}</span>
    </div>
    <TokenSelector v-if="!checkout" />
    <CheckoutPaymentToken v-if="paymentToken" :token="paymentToken" />
    <CheckoutPaymentSummary v-if="checkout" />
    <Invoice v-if="checkout && !isFinalized" :paymentRequest="checkout" />
    <CheckoutActionPanel />
  </div>
</template>

<script>
import Vue from 'vue'
import {mapActions, mapGetters, mapState} from 'vuex'
import VuePluralize from 'vue-pluralize'

import {components as hub20Components, filters as hub20filters} from 'hub20-vue-sdk'

import CheckoutReceipt from './CheckoutReceipt'
import CheckoutActionPanel from './CheckoutActionPanel'
import CheckoutPaymentSummary from './CheckoutPaymentSummary'
import CheckoutPaymentToken from './CheckoutPaymentToken'
import TokenSelector from './TokenSelector'

Vue.use(VuePluralize)

export default {
  name: 'checkout',
  components: {
    CheckoutActionPanel,
    CheckoutPaymentSummary,
    CheckoutPaymentToken,
    CheckoutReceipt,
    TokenSelector,
    Invoice: hub20Components.Payment.Invoice,
    PaymentTracker: hub20Components.Payment.requests.PaymentTracker,
    TokenLogo: hub20Components.TokenLogo,
  },
  filters: {
    formattedCurrency: hub20filters.formattedCurrency,
  },
  props: {
    debug: Boolean,
  },
  data() {
    return {
      timerId: null,
    }
  },
  computed: {
    ...mapState('checkout', ['checkout', 'merchantStore']),
    ...mapGetters('checkout', [
      'isLoaded',
      'isFinalized',
      'payments',
      'chargeCurrencyCode',
      'chargeAmount',
      'externalIdentifier',
      'paymentToken',
      'pendingAmountDue',
    ]),
  },
  methods: {
    ...mapActions(['refresh']),
  },
  mounted() {
    this.timerId = setInterval(this.refresh, 15 * 1000)
  },
}
</script>
