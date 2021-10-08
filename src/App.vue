<template>
  <div>
    <Checkout v-if="isLoaded" :debug="debug" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Checkout from '@/components/Checkout'
import {settings} from './settings'

export default {
  components: {
    Checkout,
  },
  data() {
    return {
      serverUrl: settings.serverUrl,
      storeId: settings.storeId,
      amount: settings.amount,
      currency: settings.currency,
      debug:
        typeof settings.debug === 'undefined'
          ? process.env.NODE_ENV === 'development'
          : settings.debug,
    }
  },
  computed: {
    ...mapGetters('checkout', ['isLoaded']),
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
          onComplete: checkout => console.log(`${checkout.id} completed`),
        },
      })
    },
  },
  mounted() {
    this.initializeCheckout()
  },
}
</script>

<style lang="scss">
@import './assets/styles/materialize.scss';
</style>
