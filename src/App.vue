<template>
    <component :is="layout" />
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
