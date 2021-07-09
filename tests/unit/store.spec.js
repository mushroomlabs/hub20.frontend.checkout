import Decimal from 'decimal.js-light'
import {createLocalVue} from '@vue/test-utils'
import Vuex, {mapGetters, mapState} from 'vuex'

import {store as hub20_store} from 'hub20-vue-sdk'
import {CHARGE_SET_DATA, CHECKOUT_SET_DATA, STORE_SET} from '@/store/index'

import {coingeckoData} from '../fixtures/coingecko'
import {tokenList} from '../fixtures/tokens'

const {EXCHANGE_RATE_SET_BASE_CURRENCY, EXCHANGE_RATE_SET_COINGECKO_LIST, EXCHANGE_RATE_SET_COINGECKO_RATE} = hub20_store.coingecko

const EXTERNAL_IDENTIFIER = "CHECKOUT UNIT TEST"
const CURRENCY = 'USD'
const TOKEN = 'DAI'
const AMOUNT = Decimal('0.01')
const INSUFFICIENT_PAYMENT_AMOUNT = AMOUNT.div(10)
const CHECKOUT_ID = 'abc'
const SERVER_API = 'http://example.com'
const CHAIN_ID = 5

const STORE_ID = 'deadbeef-dead-dead-dead-deadbeefbeef'
const STORE_URL = `${SERVER_API}/stores/${STORE_ID}`
const BLOCKCHAIN_TX = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'
const TOKEN_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
const STARTING_BLOCK = 2700000

const TOKEN_URL = `${SERVER_API}/tokens/token/${TOKEN_ADDRESS}`


const MERCHANT_STORE = {
  "id": STORE_ID,
  "url": STORE_URL,
  "name": "Test Shop",
  "site_url": "http://shop.example.com",
  "public_key": "-----BEGIN PUBLIC KEY-----\n\n-----END PUBLIC KEY-----",
  "accepted_currencies": [
    `${SERVER_API}/tokens/token/0x0000000000000000000000000000000000000000`,
    `${SERVER_API}/tokens/token/0x1C36690810Ad06fB15552657C7a8FF653eB46f76`,
    `${SERVER_API}/tokens/token/0xA9cad81fD505DBD678599F2541D0101dd01fc94E`,
    `${SERVER_API}/tokens/token/0x95B2d84De40a0121061b105E6B54016a49621B44`,
    `${SERVER_API}/tokens/token/0x59105441977ecD9d805A4f5b060E34676F50F806`,
    `${SERVER_API}/tokens/token/0x709118121A1ccA0f32FC2C0c59752E8FEE3c2834`
  ]
}

const CHARGE_DATA = {
  amount: AMOUNT,
  currencyCode: CURRENCY,
  externalIdentifier: EXTERNAL_IDENTIFIER
}

const CHECKOUT = {
  url: `${SERVER_API}/${CHECKOUT_ID}`,
  id: CHECKOUT_ID,
  created: '1970-01-01T00:00:00.000000Z',
  store: STORE_ID,
  external_identifier: EXTERNAL_IDENTIFIER,
  token: TOKEN_URL,
  amount: AMOUNT.toNumber(),
  routes: [
    {
      address: TOKEN_ADDRESS,
      network_id: CHAIN_ID,
      start_block: STARTING_BLOCK,
      expiration_block: STARTING_BLOCK + 100,
      type: 'blockchain',
    },
  ],
  payments: []
}

describe('store', () => {

  let store

  beforeEach(() => {
    createLocalVue().use(Vuex)

    const storeConfig = createStoreConfig()
    store = new Vuex.Store(storeConfig)

    console.log("TOKEN SET", hub20_store.tokens.TOKEN_COLLECTION_SET)
    store.commit(`tokens/${hub20_store.tokens.TOKEN_COLLECTION_SET}`, tokenList)
    store.commit(`coingecko/${EXCHANGE_RATE_SET_BASE_CURRENCY}`, CURRENCY)
    store.commit(`coingecko/${EXCHANGE_RATE_SET_COINGECKO_LIST}`, coingeckoData.tokens)
    store.commit(`coingecko/${EXCHANGE_RATE_SET_COINGECKO_RATE}`, coingeckoData.exchangeRates)
    store.commit(STORE_SET, MERCHANT_STORE)
    store.commit(CHARGE_SET_DATA, CHARGE_DATA)
    store.commit(CHECKOUT_SET_DATA, CHECKOUT)
  })

  it('should be ready to accept payments', () => {
    expect(store.getters.isLoaded).toBe(true)
  })

  it('checkout should be open', () => {
    expect(store.getters.isPaid).toBe(false)
  })

  it('should have a checkout', () => {
    expect(store.state.checkout).toBeTruthy()
  })

  it('checkout should have a token', () => {
    expect(store.state.checkout.token).toBe(TOKEN_URL)
  })

  it('should get token amount due', () => {
    expect(store.getters.paymentToken).not.toBe(undefined)
  })

  it('should be charging the correct amount', () => {
    const token = store.getters.paymentToken
    const dueAmount = store.getters.tokenAmountDue(token)
    expect(dueAmount.toDecimalPlaces(token.decimals)).toBe(AMOUNT.to_decimal_places(token.decimals))
    })
})
