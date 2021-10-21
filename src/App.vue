<template>
<div class="demo">

</div>
</template>

<script>
import {settings} from './settings'

import {checkout} from '../lib/main'

export default {
  methods: {
    initializeCheckout() {
      new checkout('div.demo', {
        serverUrl: settings.serverUrl,
        storeId: settings.storeId,
        charge: {
          amount: settings.amount,
          currencyCode: settings.currency,
          externalIdentifier: 'Demo App',
        },
        options: {
          onComplete: checkout => console.log(`${checkout.id} completed`),
          onExpired: checkout => console.log(`${checkout.id} expired`),
          onClose: () => console.log(`${checkout.id} closed`),
          onOpen: () => console.log(`${checkout.id} opened`),
          onCancel: checkout => console.log(`${checkout.id} canceled!`),
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
