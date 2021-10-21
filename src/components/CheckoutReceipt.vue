<template>
<div class='checkout-receipt' :class='{confirmed: isConfirmed, expired: isExpired, pending: isProcessing}'>
  <div class="status-message" :class='{success: isConfirmed, warning: isExpired}'>
    <slot v-if="isProcessing" name="pending-message">
      Your payment is being processed. You can close this window if you want.
    </slot>
    <slot v-if="isConfirmed" name="confirm-message">
      Your payment is now confirmed. Thank you!
    </slot>
    <slot v-if="isExpired" name="expiration-message">
      The available payment routes are expired. Any payment received now <em>WILL NOT</em> be processed.
    </slot>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'checkout-receipt',
  computed: {
    ...mapGetters('checkout', ['onCheckoutFinished', 'isConfirmed', 'isExpired', 'isProcessing']),
  }
}
</script>
