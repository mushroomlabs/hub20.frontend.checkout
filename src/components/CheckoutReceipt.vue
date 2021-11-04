<template>
<div class='checkout-receipt' :class='{confirmed: isConfirmed, expired: isExpired, pending: isProcessing}'>
  <div class="status-display">
    <span v-if="isProcessing">
      Your payment is being processed. You can close this window if you want.
    </span>
    <span v-if="isConfirmed">
      Your payment is now confirmed. Thank you!
    </span>
    <span v-if="isExpired">
      The available payment routes are expired. Any payment received now <em>WILL NOT</em> be processed.
    </span>
  </div>
  <div class="button-bar">
    <button @click="onClose">Close</button>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'checkout-receipt',
  props: {
    onClose: {
      type: Function,
      default: () => this.$emit('checkout-closed')
    }
  },
  computed: {
    ...mapGetters('checkout', ['isConfirmed', 'isExpired', 'isProcessing']),
  }
}
</script>
