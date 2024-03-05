<template>
    <div class="page_title">
        {{ $t('message.multisend_form_page_title', { network : store.networks[store.currentNetwork].name }) }}
    </div>

    <Loader v-if="loading" />

    <form v-else action="" class="form">
        <div class="item" v-for="(item, itemIndex) in data" :key="itemIndex">
            <div class="columns">
                <div class="line">
                    <div class="label">
                        {{ $t('message.multisend_form_to_address_label') }}
                    </div>

                    <div class="field">
                        <input type="text" v-model="item.to" class="input">
                    </div>
                </div>

                <div class="line amount width1of4">
                    <div class="label">
                        {{ $t('message.multisend_form_amount_label') }}
                    </div>

                    <div class="field">
                        <input type="text" v-model="item.amount" class="input" @input="setAmount" placeholder="0">

                        <button type="button" class="max_btn" @click.prevent="setMaxAmount">
                            {{ $t('message.btn_max') }}
                        </button>
                    </div>
                </div>

                <div class="line from width1of4" ref="target">
                    <div class="label">
                        {{ $t('message.multisend_form_from_label') }}
                    </div>

                    <div class="field">
                        <input type="text" v-model="item.from" class="input" @focus.self="$event.target.classList.add('active')">

                        <div class="arr">
                            <svg><use xlink:href="@/assets/sprite.svg#ic_arr_down"></use></svg>
                        </div>

                        <div class="dropdown">
                            <div class="scroll">
                                <div v-for="(balance, balanceIndex) in store.balances" :key="balanceIndex">
                                    <button type="button" class="btn" @click.prevent="setBalance(itemIndex, balance.base_denom)">
                                        <div class="denom">{{ formatTokenName(balance.base_denom) }}</div>

                                        <div class="amount">{{ formatTokenAmount(balance.amount, balance.base_denom) }}</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" class="delete_btn" v-if="itemIndex" @click="deleteItem(itemIndex)">
                <svg><use xlink:href="@/assets/sprite.svg#ic_close"></use></svg>
            </button>
        </div>


        <div class="line add_items">
            <input type="number" v-model="add_amount" class="input">

            <button type="button" class="btn" @click="addItems()">
                {{ $t('message.btn_add') }}
            </button>
        </div>


        <div class="submit">
            <button type="submit" class="btn submit_btn">
                {{ $t('message.btn_send') }}
            </button>
        </div>
    </form>
</template>


<script setup>
    import { reactive, ref, onBeforeMount } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { onClickOutside } from '@vueuse/core'
    import { denomTraces, formatTokenAmount, formatTokenName, prepareTx, sendTx } from '@/utils'

    // Components
    import Loader from '@/components/Loader.vue'


    const store = useGlobalStore(),
        loading = ref(true),
        target = ref(null),
        add_amount = ref(1),
        data = reactive([
            {
                to: '',
                amount: '',
                from: store.networks[store.currentNetwork].denom
            },
        ])


    onBeforeMount(async () => {
        // Init APP
        if (!store.isKeplrConnected) {
            await store.initApp()
        }

        // Get network balance
        await store.getNetworkBalance()

        // Get formated balances
        for (const balance of store.balances) {
            let result = await denomTraces(balance.denom)

            balance.base_denom = result.base_denom
        }

        // Hide loader
        loading.value = false
    })


    // Set amount
    function setAmount(event) {
        // if (parseFloat(event.target.value.replace(',', '.')) > availabel_tokens.value - 0.01) {
        //     amount.value = (availabel_tokens.value - 0.01).toString()
        // }
    }


    // Set max. amount
    function setMaxAmount() {
        // amount.value = availabel_tokens.value < 0.01 ? 0 : (availabel_tokens.value - 0.01).toString()
    }


    // Set to balance
    function setBalance(itemindex, denom) {
        data[itemindex].from = denom

        // Hide dropdown
        hideDropdown()
    }


    // Add items
    function addItems() {
        for (var i = 0; i < add_amount.value; i++) {
            data.push({
                to: '',
                amount: '',
                from: store.networks[store.currentNetwork].denom
            })
        }
    }


    // Delete item
    function deleteItem(index) {
        data.splice(index, 1)
    }


    // Hide dropdown
    function hideDropdown() {
        let inputs = document.querySelectorAll('.from .input')

        inputs.forEach(input => input.classList.remove('active'))
    }


    // Сlick element outside
    // onClickOutside(target, () => hideDropdown())
</script>


<style scoped>
.loader_wrap
{
    position: relative;

    padding: 40px;

    background: none;
}


.item
{
    position: relative;
    padding-right: 52px;
}

.item + .item
{
    margin-top: 20px;
}


.delete_btn
{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    width: 32px;
    height: 32px;
    margin: auto 0;
    margin-left: 20px;

    transition: .2s linear;

    border: 1px solid #950fff;
    border-radius: 50%;
}


.delete_btn svg
{
    display: block;

    width: 20px;
    height: 20px;
}


.delete_btn:hover
{
    background: #950fff;
}



</style>