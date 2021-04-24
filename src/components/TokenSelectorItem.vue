l<template>
<li v-if="token" v-on:click='selectToken' class='token-selector-item'>
  <span class='token-name'>{{ token.name }}</span>
  <img v-if='tokenLogo' :src='tokenLogo' :alt='token.name' />
  <TokenExchangeRate :token='token' />
</li>
</template>


<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import {mixins, api} from 'hub20-vue-sdk'

import TokenExchangeRate from './TokenExchangeRate'

export default {
    name: 'TokenSelectorItem',
    mixins: [
        mixins.TokenMixin
    ],
    components: {
        TokenExchangeRate
    },
    props: {
        tokenAddress: String,
    },
    computed: {
        token() {
            return this.getToken(this.tokenAddress)
        },
        tokenLogo() {
            return this.tokenLogoByAddress(this.tokenAddress)
        },
        ...mapGetters('coingecko', ['tokenLogoByAddress'])
    },
    methods: {
        selectToken: function() {
            // this.$store.commit('selectToken', this.token)
            // this.$store.dispatch('makeCheckout', this.token)

            console.log('token selected')
        },
        ...mapActions('coingecko', ['fetchTokenLogoUrl'])
    },
    mounted() {
        this.fetchTokenLogoUrl(this.token)
    }
}
</script>
