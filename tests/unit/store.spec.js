import Decimal from 'decimal.js-light'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

import store from '@/store/index'

const localVue = createLocalVue()

localVue.use(Vuex)


const CURRENCY = 'USD'
const TOKEN = 'TOK'
const AMOUNT = Decimal('0.01')
const INSUFFICIENT_PAYMENT_AMOUNT = AMOUNT.div(10)
const CHECKOUT_ID = 'abc'
const SERVER_API = 'http://example.com'
const CHAIN_ID = 5

const STORE_ID = 'xyz'
const BLOCKCHAIN_TX = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
const TOKEN_ADDRESS = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
const STARTING_BLOCK = 2700000

const CHECKOUT = {
    url: `${SERVER_API}/${CHECKOUT_ID}`,
    id: CHECKOUT_ID,
    created:'1970-01-01T00:00:00.000000Z',
    store: STORE_ID,
    external_identifier: 'test checkout',
    currency: TOKEN,
    amount: AMOUNT.toNumber(),
    routes: [
        {
            address: TOKEN_ADDRESS,
            network_id: CHAIN_ID,
            start_block: STARTING_BLOCK,
            expiration_block: STARTING_BLOCK + 100,
            type: "blockchain"
        }
    ]
}

describe('store', () => {
    beforeEach(() => {
        let setupData = {
            apiRootUrl: SERVER_API,
            storeId: STORE_ID,
            currency: CURRENCY,
            amount: AMOUNT.toNumber()
        }

        store.commit('setup', setupData)
        store.commit('setCheckout', CHECKOUT)
    })

    it('blockchain pending transfers should be an array', () => {

        let pendingTransfers = store.getters.blockchainPendingTransfers

        expect(Array.isArray(pendingTransfers)).toBe(true)
    }),

    it('pending amount should be zero', () => {

        let pendingAmount = store.getters.tokenAmountPending

        expect(pendingAmount.toNumber()).toBe(0)
    })

    it('should keep open after insufficient payment', () => {

        let transfer = {
            "identifier": BLOCKCHAIN_TX,
            "token": TOKEN,
            "amount": INSUFFICIENT_PAYMENT_AMOUNT.toNumber(),
            "status":"sent"
        }

        store.commit('registerBlockchainTransfer', transfer)

        expect(store.getters.isPaid).toBe(false)
    })

    it('should be paid after sufficient payment', () => {

        let transfer = {
            "identifier": BLOCKCHAIN_TX,
            "token": TOKEN,
            "amount": AMOUNT.toNumber(),
            "status":"sent"
        }

        store.commit('registerBlockchainTransfer', transfer)

        expect(store.getters.isPaid).toBe(true)
    })

})
