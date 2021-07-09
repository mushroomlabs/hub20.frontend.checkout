export const baseState = {
  "merchantStore": {
    "id": "deadbeef-dead-dead-dead-deadbeefbeef",
    "url": "http://example.com/stores/deadbeef-dead-dead-dead-deadbeefbeef",
    "name": "Test Shop",
    "site_url": "http://localhost",
    "public_key": "-----BEGIN PUBLIC KEY-----\n\n-----END PUBLIC KEY-----",
    "accepted_currencies": [
      "http://example.com/tokens/token/0x0000000000000000000000000000000000000000",
      "http://example.com/tokens/token/0x1C36690810Ad06fB15552657C7a8FF653eB46f76",
      "http://example.com/tokens/token/0xA9cad81fD505DBD678599F2541D0101dd01fc94E",
      "http://example.com/tokens/token/0x95B2d84De40a0121061b105E6B54016a49621B44",
      "http://example.com/tokens/token/0x59105441977ecD9d805A4f5b060E34676F50F806",
      "http://example.com/tokens/token/0x709118121A1ccA0f32FC2C0c59752E8FEE3c2834"
    ]
  },
  "selectedToken": null,
  "checkout": null,
  "extraOptions": null,
  "isFinalized": false,
  "charge": {
    "amount": 10,
    "currencyCode": "USD",
    "externalIdentifier": "Test App"
  },
  "account": {
    "balances": [],
    "credits": [],
    "debits": [],
    "profile": null,
    "error": null
  },
  "audit": {
    "loadingBooks": false,
    "loadingWallets": false,
    "accountingBooks": null,
    "wallets": null,
    "error": null
  },
  "auth": {
    "authenticating": false,
    "error": false,
    "username": null,
    "token": null
  },
  "coingecko": {
    "tokens": [
      {
        "chainId": 1,
        "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
        "name": "Dai",
        "symbol": "DAI",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png?1574218774"
      },
      {
        "chainId": 1,
        "address": "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
        "name": "Basic Attention Tok",
        "symbol": "BAT",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/677/thumb/basic-attention-token.png?1547034427"
      },
      {
        "chainId": 1,
        "address": "0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6",
        "name": "Raiden Network Toke",
        "symbol": "RDN",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/1132/thumb/raiden-logo.jpg?1547035131"
      },
    ],
    "exchangeRates": {
      "USD": {
        "0xA9cad81fD505DBD678599F2541D0101dd01fc94E": 1.42,
        "0x1C36690810Ad06fB15552657C7a8FF653eB46f76": 1.00,
        "0x0000000000000000000000000000000000000000": 3887.35,
        "0x95B2d84De40a0121061b105E6B54016a49621B44": 1.01,
        "0x59105441977ecD9d805A4f5b060E34676F50F806": 1.01,
        "0x709118121A1ccA0f32FC2C0c59752E8FEE3c2834": 1.01
      }
    },
    "baseCurrency": "USD",
    "tokenLogoMap": {
    }
  },
  "events": {
    "websocket": null,
    "messageHandler": null
  },
  "funding": {
    "deposits": [],
    "transfers": [],
    "error": null
  },
  "network": {
    "ethereum": {
      "network": null,
      "synced": false,
      "online": false,
      "currentBlock": null
    }
  },
  "notifications": {
    "notifications": []
  },
  "password": {
    "emailCompleted": false,
    "emailError": false,
    "emailLoading": false,
    "resetCompleted": false,
    "resetError": false,
    "resetLoading": false
  },
  "server": {
    "rootUrl": "http://example.com/",
    "version": "0.2.2",
    "error": null,
    "processing": false
  },
  "signup": {
    "activationCompleted": false,
    "activationError": false,
    "activationLoading": false,
    "registrationCompleted": false,
    "registrationError": false,
    "registrationLoading": false
  },
  "stores": {
    "collection": {
      "data": [],
      "error": null
    },
    "edit": {
      "data": null,
      "error": null
    }
  },
  "tokens": {
    "tokens": [
      {
        "url": "http://example.com/tokens/token/0x0000000000000000000000000000000000000000",
        "code": "ETH",
        "name": "Ethereum",
        "address": "0x0000000000000000000000000000000000000000",
        "network_id": 5,
        "decimals": 18
      },
      {
        "url": "http://example.com/tokens/token/0x1C36690810Ad06fB15552657C7a8FF653eB46f76",
        "code": "DAI",
        "name": "Test DAI",
        "address": "0x1C36690810Ad06fB15552657C7a8FF653eB46f76",
        "network_id": 5,
        "decimals": 18
      },
      {
        "url": "http://example.com/tokens/token/0xA9cad81fD505DBD678599F2541D0101dd01fc94E",
        "code": "BAT",
        "name": "BAT",
        "address": "0xA9cad81fD505DBD678599F2541D0101dd01fc94E",
        "network_id": 5,
        "decimals": 18
      },
      {
        "url": "http://example.com/tokens/token/0x95B2d84De40a0121061b105E6B54016a49621B44",
        "code": "WIZ",
        "name": "WizardToken",
        "address": "0x95B2d84De40a0121061b105E6B54016a49621B44",
        "network_id": 5,
        "decimals": 18
      },
      {
        "url": "http://example.com/tokens/token/0x59105441977ecD9d805A4f5b060E34676F50F806",
        "code": "TTT",
        "name": "TestToken",
        "address": "0x59105441977ecD9d805A4f5b060E34676F50F806",
        "network_id": 5,
        "decimals": 18
      },
      {
        "url": "http://example.com/tokens/token/0x709118121A1ccA0f32FC2C0c59752E8FEE3c2834",
        "code": "SVT",
        "name": "ServiceToken",
        "address": "0x709118121A1ccA0f32FC2C0c59752E8FEE3c2834",
        "network_id": 5,
        "decimals": 18
      },
      {
        "url": "http://example.com/tokens/token/0xC563388e2e2fdD422166eD5E76971D11eD37A466",
        "code": "TTT",
        "name": "TestToken",
        "address": "0xC563388e2e2fdD422166eD5E76971D11eD37A466",
        "network_id": 5,
        "decimals": 18
      }
    ],
    "error": null
  },
  "users": {
    "users": [],
    "error": null
  },
  "web3": {
    "selectedAccount": null,
    "web3Browser": null,
    "connected": false,
    "transactions": [],
    "error": null
  },
  "EVENT_TYPES": {
  }
}
