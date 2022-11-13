<template>
    <div class="btn-wrap">
        <div class="main-btn" @click="openHouse">我要开房</div>
        <div class="main-btn scan-btn">扫码进房</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { get, post } from '../../common/lib/axios';

const showOpenHouseRes = ref(false);
function openHouse() {
    showOpenHouseRes.value = true;
}
onMounted(async () => {
    const res = await get('http://localhost:6015/room?roomId=8');
    const res2 = await post('http://localhost:6015/room/create', { userId: "trastor" });
});
</script>

<style lang='less' scoped>
.btn-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
}

.main-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.2rem;
    height: 1.2rem;
    font-size: .2rem;
    border-radius: 50%;
    color: #FFF;
    background-color: #ff7f50;
    box-shadow: 0 0 .03rem .06rem #ff7f50;
    transition: all .5s;

    &:active {
        transform: translate(0, .04rem);
        box-shadow: 0 0 0 0 #ff7f50;
    }  
}

.scan-btn {
    margin-top: .3rem;
    box-shadow: 0 0 .03rem .06rem #70a1ff;
    background-color: #70a1ff;

    &:active {
        transform: translate(0, .04rem);
        box-shadow: 0 0 0 0 #70a1ff;
    }
}

</style>