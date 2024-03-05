<template>
    <div class="title">{{ $t('message.networks_title') }}</div>

    <div class="row">
        <div>
            <router-link to="/multisend/cosmoshub" class="link">
                <div class="logo">
                    <img src="@/assets/cosmoshub_logo.png" alt="">
                </div>

                <div>
                    <div class="name">{{ store.networks.cosmoshub.name }}</div>
                    <div class="token">{{ store.networks.cosmoshub.token_name }}</div>
                </div>
            </router-link>
        </div>
    </div>
</template>


<script setup>
    import { useGlobalStore } from '@/stores'

    const store = useGlobalStore()
</script>


<style scoped>
    .title
    {
        font-size: 20px;

        margin-bottom: 20px;
    }


    .row
    {
        align-content: stretch;
        align-items: stretch;

        margin-bottom: -10px;
        margin-left: -10px;
    }

    .row > *
    {
        order: 100;

        width: calc(33.333% - 10px);
        margin-bottom: 10px;
        margin-left: 10px;
    }


    .link
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        width: 100%;
        padding: 10px;

        transition: background .2s linear;
        text-align: left;
        text-decoration: none;

        color: currentColor;
        border-radius: 14px;
        background: #141414;
    }


    .link .logo
    {
        position: relative;

        display: flex;
        overflow: hidden;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        width: 40px;
        height: 40px;

        border-radius: 50%;
    }


    .link .logo img
    {
        position: absolute;
        top: 0;
        left: 0;

        display: block;

        width: 100%;
        height: 100%;

        border-radius: 50%;

        object-fit: cover;
    }


    .link .logo + *
    {
        width: calc(100% - 54px);
        margin-left: auto;
    }


    .link .name
    {
        font-size: 18px;
        font-weight: 500;
        line-height: 100%;
    }


    .link .token
    {
        font-size: 12px;
        line-height: 15px;

        margin-top: 6px;

        color: #555;
    }


    .link:hover
    {
        background: #0d0d0d;
    }
</style>