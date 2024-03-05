<template>
    <section class="actions">
        <div class="list">
            <router-link to="/multisend" class="item" :class="{ active: store.currentAction == 'multisend' }">Multisend</router-link>
        </div>
    </section>
</template>


<script setup>
    import { useGlobalStore } from '@/stores'

    const store = useGlobalStore()
</script>


<style scoped>
    .actions
    {
        position: sticky;
        top: 24px;

        padding: 14px;

        border-radius: 20px;
        background: #0d0d0d;
    }


    .actions .list > * + *
    {
        margin-top: 4px;
    }


    .actions .item
    {
        font-size: 18px;
        font-weight: 500;
        line-height: 100%;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        width: 100%;
        padding: 20px;

        transition: background .2s linear;
        text-align: left;
        text-decoration: none;

        color: currentColor;
        border-radius: 14px;
    }


    .actions .item:hover,
    .actions .item.active
    {
        background: #141414;
    }
</style>