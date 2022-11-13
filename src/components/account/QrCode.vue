<!--
 * @Description: 
 * @Date: 2022-09-04 14:55:46
 * @Author: 
 * @LastEditTime: 2022-09-04 21:44:01
-->
<template>
    <div>
        <vue-qr :text="props.url" class="vue-qr" :margin="0"></vue-qr>
    </div>
</template>

<script lang='ts' setup>
import VueQr from 'vue-qr/src/packages/vue-qr.vue';

const props = defineProps<{
    url: string,
    size: number,
}>();

</script>

<style lang='less' scoped>
.vue-qr {
    width: 2rem;
    height: 2rem;
}
</style>