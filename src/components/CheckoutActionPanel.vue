<template>
  <div class="checkout-action-panel">
    <button v-if="isOpen" @click="reset">Back</button>
    <button v-if="isFinalized" @click="close">Close</button>
    <button v-if="hasPartialPayment" @click="leave">Leave</button>
    <div v-if="prompted" @class="confirmation - prompt">
      <span>{{ actionMessagePrompt }}</span>
      <button class="cancel-action" @click="reject">No</button>
      <button class="confirm-action" @click="confirm">Yes</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'

const DEFAULT_MESSAGE_CONFIRMATION = 'Are you sure?'

export default {
  name: 'checkout-action-panel',
  computed: {
    ...mapState('checkout', ['checkout']),
    ...mapGetters('checkout', ['hasPartialPayment', 'isOpen', 'isFinalized']),
  },
  data() {
    return {
      prompted: false,
      action: null,
      actionMessagePrompt: DEFAULT_MESSAGE_CONFIRMATION,
    }
  },
  methods: {
    ...mapActions(['close']),
    ...mapActions('checkout', ['reset']),
    leave() {
      this.prompted = true
      this.action = this.reset
      this.actionMessagePrompt =
        'Your payments are not enough to complete the purchase. Leave anyway?'
    },
    reject() {
      this.prompted = false
      this.action = null
      this.actionMessagePrompt = DEFAULT_MESSAGE_CONFIRMATION
    },
    confirm() {
      if (this.action) {
        this.action()
      }
      this.prompted = false
      this.action()
      this.actionMessagePrompt = DEFAULT_MESSAGE_CONFIRMATION
    },
  },
}
</script>
