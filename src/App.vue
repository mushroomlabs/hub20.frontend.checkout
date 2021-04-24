<template>
  <div>
    <div>
      <div><label>Server URL</label> <input type="text" v-model="serverUrl" /></div>
      <div><label>Store ID</label><input type="text" v-model="storeId" /></div>
      <div><label>Amount (USD)</label><input type="number" v-model="amount" /></div>
      <button v-on:click="startCheckout">Start Checkout</button>
    </div>
    <hr />
    <Checkout v-if="isLoaded" />
  </div>
</template>

<script>
import Checkout from '@/components/Checkout'
import {mapGetters} from 'vuex'
import {settings} from './settings'

export default {
  components: {
    Checkout,
  },
  data() {
    return settings
  },
  computed: {...mapGetters(['isLoaded'])},
  methods: {
    startCheckout() {
      this.$store.dispatch('initialize', {
        serverUrl: this.serverUrl,
        storeId: this.storeId,
        charge: {amount: this.amount, currencyCode: 'USD'},
      })
    },
  },
}
</script>
