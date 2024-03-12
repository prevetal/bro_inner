import { defineStore } from 'pinia'
import { createKeplrOfflineSinger, denomTraces } from '@/utils'

// Networks
import cosmoshub from '@/stores/networks/cosmoshub'

const networks = {
    cosmoshub
}


export const useGlobalStore = defineStore('global', {
    state: () => ({
        currentNetwork: 'cosmoshub',
        currentAction: '',

        Keplr: {},
        isKeplrConnected: false,

        balances: [],

        networks,

        prices: null,

        formatableTokens: [
            {
                tokenName: 'BOOT',
                formatTokenName: 'MBOOT',
                exponent: 6
            },
            {
                tokenName: 'HYDROGEN',
                formatTokenName: 'MHYDROGEN',
                exponent: 6
            }
        ],
    }),


    actions: {
        // Currencies price
        // async getCurrenciesPrice() {
        //     try {
        //         // Request
        //         await fetch('https://rpc.bronbro.io/price_feed_api/tokens/')
        //             .then(response => response.json())
        //             .then(data => this.prices = data)
        //     } catch (error) {
        //         console.error(error)
        //     }
        // },


        // Init APP
        async initApp() {
            if (window.keplr) {
                // Keplr connect
                await createKeplrOfflineSinger(this.networks[this.currentNetwork].chainId)

                // Get network balance
                await this.getNetworkBalance()

                // Get formated balances
                for (const balance of this.balances) {
                    let result = await denomTraces(balance.denom)

                    balance.base_denom = result.base_denom
                }
            }
        },


        // Get network balance
        async getNetworkBalance() {
            try {
                // Request
                await fetch(`${this.networks[this.currentNetwork].lcd_api}/cosmos/bank/v1beta1/balances/${this.Keplr.account.address}`)
                    .then(response => response.json())
                    .then(async response => {
                        this.balances = response.balances

                        // for (let i = response.balances.length - 1; i >= 0; i--) {
                        //     // Get denom
                        //     let denom = await denomTraces(response.balances[i].denom)

                        //     // Only tokens in price feed api
                        //     if (this.prices.find(el => el.symbol == denom.base_denom.toUpperCase())) {
                        //         this.balances.push(response.balances[i])
                        //     }
                        // }
                    })
            } catch (error) {
                console.error(error)
            }
        },
    }
})
