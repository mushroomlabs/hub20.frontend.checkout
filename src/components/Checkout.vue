<template>
  <div v-if="isLoaded && isOpen" :class="{minimized: isMinimized}" id="hub20-checkout">
    <span class="store">{{ merchantStore.name }}</span>
    <div class="charge-details-display">
      <span class="charge-amount-text">Total Due:</span>
      <span class="charge-amount-value">{{ chargeAmount | formattedCurrency(chargeCurrencyCode) }}</span>
    </div>
    <TokenSelector v-if="!checkout" />
    <div v-if="checkout" class="checkout-payment-display">
      <CheckoutPaymentToken v-if="paymentToken" :token="paymentToken" />
      <CheckoutPaymentSummary v-if="checkout" />
      <Invoice v-if="!isPaid" :paymentRequest="checkout" />
      <CheckoutReceipt v-if="isPaid || isFinalized" :onClose="close"/>
    </div>
    <div v-if="checkout">
      <CheckoutActionPanel :onClose="close" :onCancel="cancel" />
    </div>
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
    onCheckoutComplete: {
      type: Function,
      required: false,
      default: null
    },
    onCheckoutExpired: {
      type: Function,
      required: false,
      default: null
    },
    onCheckoutCanceled: {
      type: Function,
      required: false,
      default: null
    },
    onOpen: {
      type: Function,
      required: false,
      default: null
    },
    onClose: {
      type: Function,
      required: false,
      default: null
    },
    onMinimize: {
      type: Function,
      required: false,
      default: null
    },
  },
  data() {
    return {
      timerId: null,
      isOpen: true,
      isMinimized: false
    }
  },
  computed: {
    ...mapState('checkout', ['checkout', 'merchantStore']),
    ...mapGetters('checkout', [
      'isLoaded',
      'isFinalized',
      'isPaid',
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
    ...mapActions('checkout', ['reset']),
    cancel() {
      if (this.onCheckoutCanceled) {
        this.onCheckoutCanceled(this.checkout)
      }

      this.reset()
    },
    close() {
      this.isOpen = false
      this.isMinimized = false

      if (this.onClose) {
        this.onClose(this.checkout)
      }
    },
    minimize() {
      this.isMinimized = true

      if (this.onMinimize) {
        this.onMinimize(this.checkout)
      }
    },
    open() {
      this.isOpen = true
      this.isMinimized = false

      if (this.onOpen) {
        this.onOpen(this.checkout)
      }
    }

  },
  mounted() {
    this.timerId = setInterval(this.refresh, 15 * 1000)
  },
}
</script>
