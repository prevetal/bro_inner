import { useGlobalStore } from '@/stores'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { SigningStargateClient } from '@cosmjs/stargate'
import { fromBech32, toBech32 } from '@cosmjs/encoding'


// Generate address
export const generateAddress = (prefix, address) => {
    return toBech32(prefix, fromBech32(address).data)
}


// Denom traces
export const denomTraces = async string => {
    let store = useGlobalStore(),
        result = {},
        hash = string.split('/')

    if (hash[0] == 'ibc') {
        try {
            // Request
            await fetch(`${store.networks[store.currentNetwork].lcd_api}/ibc/apps/transfer/v1/denom_traces/${hash[1]}`)
                .then(response => response.json())
                .then(response => result =  response.denom_trace)
        } catch (error) {
            console.error(error)
        }
    } else {
        result.base_denom = string
    }

    return result
}


// Formating token name
export const formatTokenName = (tokenName) => {
    let store = useGlobalStore(),
        newTokenName = ''

    if (store.formatableTokens.find(el => el.tokenName == tokenName.toUpperCase())) {
        newTokenName = store.formatableTokens.find(el => el.tokenName == tokenName.toUpperCase()).formatTokenName
    }

    return newTokenName.length ? newTokenName : tokenName
}


// Formating token amount
export const formatTokenAmount = (amount, tokenName) => {
    let store = useGlobalStore(),
        formatAmount = 0,
        formatableToken = store.formatableTokens.find(el => el.tokenName == tokenName.toUpperCase())

    // formatableToken
    //     ? formatAmount = amount / Math.pow(10, formatableToken.exponent)
    //     : formatAmount = amount / Math.pow(10, store.prices.find(el => el.symbol == tokenName.toUpperCase()).exponent)

    formatAmount = amount

    return formatAmount
}


// Create Keplr offline singer
export const createKeplrOfflineSinger = async chainId => {
    let store = useGlobalStore()

    // Get Keplr network enable
    await window.keplr.enable(chainId)

    // Set Offline Singer
    store.Keplr.offlineSinger = await window.getOfflineSignerAuto(chainId)

    // Set Keplr account
    let accounts = await store.Keplr.offlineSinger.getAccounts()
    store.Keplr.account = accounts[0]

    // Set Keplr key~
    store.Keplr.key = await window.keplr.getKey(chainId)

    // Set Keplr connected status
    store.isKeplrConnected = true
}



// Prepare Tx
export const prepareTx = async (msg, gasSimulate = true, chain = store.currentNetwork) => {
    let store = useGlobalStore(),
        gasUsed = 0

    // Create request
    let offlineSigner = await window.getOfflineSignerAuto(store.networks[chain].chainId)

    Object.assign(offlineSigner, {
        signAmino: offlineSigner.signAmino ?? offlineSigner.sign
    })

    // RPC endpoint
    let rpcEndpoint = store.networks[chain].rpc_api

    // Client
    let client = await SigningStargateClient.connectWithSigner(rpcEndpoint, offlineSigner)

    // Simulate gas
    if (gasSimulate) {
        gasUsed = await client.simulate(store.Keplr.account.address, msg)
    }

    let fee = {
        amount: [{
            denom: store.networks[chain].denom,
            amount: '0'
        }],
        gas: gasSimulate ? Math.round(gasUsed * 1.3).toString() : '100000'
    }

    // MENO
    let memo = store.ref ? `bro.${store.ref}` : 'bro.app'

    // Sign transaction
    let txRaw = await client.sign(store.Keplr.account.address, msg, fee, memo)

    return { txRaw, client }
}



// Send Tx
export const sendTx = async ({ txRaw, client }) => {
    // Encode TxRaw
    let txBytes = TxRaw.encode(txRaw).finish()

    // Broadcast Tx
    let result = await client.broadcastTx(txBytes, client.broadcastTimeoutMs, client.broadcastPollIntervalMs)

    return result
}