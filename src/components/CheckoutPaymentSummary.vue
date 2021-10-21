<template>
<div v-if="hasPayments" class="payment-summary-display" :class="{expanded: isExpanded}" v-on:click="toggleView">
  <span class="summary-text">Payment Summary:</span>
  <span class="summary-value">{{ payments.length }} {{ 'payment' | pluralize(payments.length) }} received</span>
  <PaymentTracker :paymentRequest="checkout" :pendingAmountDue="pendingAmountDue" />
</div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {components as hub20Components, filters as hub20filters} from 'hub20-vue-sdk'

export default {
  name: 'checkout-payment-summary',
  components: {
    PaymentTracker: hub20Components.Payment.requests.PaymentTracker,
  },
  data() {
    return {
      isExpanded: true
    }
  },
  computed: {
    ...mapState('checkout', ['checkout']),
    ...mapGetters('checkout', ['pendingAmountDue', 'payments']),
    hasPayments() {
      return this.payments.length > 0;
    }
  },
  methods: {
    toggleView() {
      this.isExpanded = !this.isExpanded
    },
  },
}
</script>
