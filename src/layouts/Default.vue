<template>
    <div class="main">
        <div class="cont">
            <div class="grid row">
                <section class="col">
                    <!-- Actions -->
                    <Actions />
                </section>

                <section class="col_main">
                    <!-- Router view -->
                    <RouterView />
                </section>
            </div>
        </div>
    </div>
</template>


<script setup>
    // Components
    import Actions from '@/components/Actions.vue'
</script>


<style scoped>
    .grid
    {
        align-content: stretch;
        align-items: stretch;
        justify-content: space-between;

        padding: 40px 0;
    }


    .col
    {
        width: 353px;
        max-width: 100%;
    }


    .col_main
    {
        width: calc(100% - 393px);
    }
</style>
