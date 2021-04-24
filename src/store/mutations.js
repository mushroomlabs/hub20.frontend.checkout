import Vue


export const mutations = {
    setup(state, setupData) {
        let timestamp = new Date().toISOString()

        state.apiRootUrl = setupData.apiRootUrl
        state.storeId = setupData.storeId
        state.pricingCurrency = String(setupData.currency).toUpperCase(),
            state.identifier = setupData.identifier || new Hashes.MD5().hex(timestamp)
        state.amountDue = setupData.amount
        state.waitForPaymentConfirmation = Boolean(setupData.waitForPaymentConfirmation) || false

        state.checkoutCreatedHandler = setupData.onCheckoutCreated
        state.checkoutCanceledHandler = setupData.onCheckoutCanceled
        state.checkoutFinishedHandler = setupData.onCheckoutFinished

        state.paymentSentHandler = setupData.onPaymentSent
        state.paymentReceivedHandler = setupData.onPaymentReceived
        state.paymentConfirmedHandler = setupData.onPaymentConfirmed
        state.paymentCanceledHandler = setupData.onPaymentCanceled

        state.contentCopiedHandler = setupData.onCopyToClipboard
        state.onErrorHandler = setupData.onError
        state.onNotificationHandler = setupData.onNotification
    },
    selectToken(state, token) {
        state.selectedTokenAddress = token.address
    },
        setStore(state, storeData) {
            state.store = storeData
        },
    setToken(state, tokenData) {
        Vue.set(state.tokens, tokenData.address, tokenData)
    },
    setTokenLogo(state, {token, url}) {
        Vue.set(state.tokenLogos, token.address, url)
    },
    setExchangeRate(state, payload) {
        let {token, rate} = payload

        if (token && token.address && rate) {
            Vue.set(state.exchangeRates, token.address, rate)
        }
    },
    setCheckout(state, checkoutData) {
        state.checkout = checkoutData
    },
    setCheckoutWebSocket(state, checkoutWebSocket) {
        state.checkoutWebSocket = checkoutWebSocket
    },
    reset(state) {
        state.checkout = null
        state.checkoutWebsocket = null
        state.selectedTokenAddress = null
        state.blockchainTransferMap = {}
        state.raidenTransferMap = {}
    },
    registerBlockchainTransfer(state, transferData) {
        if (!transferData || !transferData.identifier) {
            return
        }

        Vue.set(state.blockchainTransferMap, transferData.identifier, transferData)
    }
}
