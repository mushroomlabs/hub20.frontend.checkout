# Hub20 Checkout

## Intro

[Hub20](https://gitlab.com/mushroomlabs/hub20) is a self-hosted online payment solution allowing users to collect payments in Ethereum and any ERC20 token.

[Checkout20](https://github.com/mushroomlabs/hub20/checkout20) is the frontend Javascript SDK, meant to run in any modern browser.

## Usage

First you need to have an account at your Hub20 instance and define your store. To initiate a checkout:


```(html)

    <div id="hub20 store"></div>

    <script type="text/javascript">
     window.addEventListener('load', function() {
       new Hub20.checkout("#store", {
         serverUrl: "https://your.hub20.example.com",
         storeId: "your-store-id-uuid",
         charge: {
             currency: "USD",  // You can use any currency code
             amount: "2.50",
             externalIdentifier: "John Doe invoice #20"
         },
         options: {
             onPaymentReceived: function(payment, checkout) {
                console.log("TODO")
             },
             onPaymentSent: function(payment, checkout) {
                console.log("TODO")
             },
             onPaymentConfirmed: function(payment, checkout) {
                 console.log("TODO")
             },
             onComplete: function(checkout) {
                console.log("You get all information about the checkout: routes, payments, etc")
             },
             onCanceled: function(checkout) {
                 console.log("User has left this checkout")
             },
             onError: function(error, message) {
                 console.error("Oh, Jimmy...")
             }
         }
       })
     })
    </script>
```

If you have access to the backend of your web application and want to
check the status of the payment, you can do so - just check the
documentation of Hub20's API. However, if your website which
integrates Hub20 relies on the voucher's provided by Hub20 to verify
payment, you need to implement the `onPayment` functions described below:


 - `onPaymentSent`: this function is called when a transaction done to
   the payment address is created, but before being mined.

 - `onPaymentReceived`: this function will be called when any
   transaction with the payment is mined and Hub20 could verify that
   it is the recipient of the transfer

 - `onPaymentConfirmed`: this function will be called whenever a
   payment can not be reverted (i.e, it was received on Raiden or the
   number of confirmations is hgher than the minimum required by the
   store definition)
