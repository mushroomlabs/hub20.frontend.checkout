<template>
  <div>
    <Checkout v-if="isLoaded" />
  </div>
</template>

<script>
import Checkout from '@/components/Checkout'
import {mapGetters} from 'vuex'
import {settings} from './settings'

export default {
  components: {
    Checkout
  },
  data() {
    return settings
  },
  computed: {
    ...mapGetters(['isLoaded']),
  },
  methods: {
    initializeCheckout() {
      this.$store.dispatch('initialize', {
        serverUrl: this.serverUrl,
        storeId: this.storeId,
        charge: {
          amount: this.amount,
          currencyCode: this.currency,
          externalIdentifier: 'Demo App',
        },
        options: {
          onComplete: checkout => console.log(`${checkout.id} completed`)
        }
      })
    },
  },
  mounted() {
    this.initializeCheckout()
  }
}
</script>
