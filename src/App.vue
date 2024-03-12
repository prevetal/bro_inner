<template>
    <component :is="layout" />


    <notifications width="280px" group="default">
        <template #body="props">
            <div class="notification">
                <div class="icon green" v-if="props.item.type == 'success'">
                    <svg><use xlink:href="@/assets/sprite.svg#ic_notification_success"></use></svg>
                </div>

                <div class="icon red" v-if="props.item.type == 'error'">
                    <svg><use xlink:href="@/assets/sprite.svg#ic_notification_error"></use></svg>
                </div>

                <div class="icon" v-if="!props.item.type">
                    <svg><use xlink:href="@/assets/sprite.svg#ic_notification_progress"></use></svg>
                </div>

                <div v-if="props.item.data.chain && props.item.data.tx_type">
                    <div class="chain">{{ props.item.data.chain }}</div>
                    <div class="tx_type">{{ props.item.data.tx_type }}</div>
                </div>

                <div class="title">{{ props.item.title }}</div>

                <div class="text" v-html="props.item.text" v-if="props.item.text"></div>

                <div class="explorer" v-if="props.item.data.tx_hash">
                    <a :href="`https://www.mintscan.io/cosmos/txs/${props.item.data.tx_hash}`" target="_blank" rel="noopener nofollow">
                        <span>{{ $t('message.notification_explorer_link') }}</span>
                        <svg><use xlink:href="@/assets/sprite.svg#ic_link_arrow"></use></svg>
                    </a>
                </div>
            </div>
        </template>
    </notifications>
</template>


<script setup>
    import { computed, onBeforeMount, inject, watch } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { useRoute } from 'vue-router'
    import { useTitle } from '@vueuse/core'
    import { createKeplrOfflineSinger } from '@/utils'


    const store = useGlobalStore(),
        i18n = inject('i18n'),
        route = useRoute(),
        title = useTitle(),
        layout = computed(() => route.meta.layout || 'default-layout')


    onBeforeMount(() => {
        // Set title
        title.value = i18n.global.t('message.page_title')


        // Change Keplr account
        window.addEventListener('keplr_keystorechange', () => {
            // Reload page
            window.location.reload()
        })
  })


    watch(computed(() => store.currentNetwork), async () => {
        // Keplr connect
        await createKeplrOfflineSinger(store.networks[store.currentNetwork].chainId)
    })
</script>
