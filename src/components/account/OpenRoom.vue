<template>
    <div class="wrap">
        <img class="top" src="@/assets/img/account/top1.jpg"/>
        <div class="content">
            <div class="content-item" @click="openHouse">
                <div class="icon open-room"></div>
                <div class="primary-name">我要开房</div>
                <div class="desc">一键开房 再邀好友</div>
            </div>
            <div class="content-item">
                <div class="icon"></div>
                <div class="primary-name">扫码进房</div>
                <div class="desc">扫码二维码 直接进房</div>
            </div>
        </div>
    </div>
    <loading :show="showLoading"></loading>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Loading from '@/common/components/Loading.vue';
import { createRoom } from '@/api';

const showLoading = ref(false);

async function openHouse() {
    showLoading.value = true;
    await createRoom("");
    showLoading.value = false;
}

onMounted(async () => {
    // const res = await get('http://localhost:6015/room?roomId=8');
});
</script>

<style lang='less' scoped>
.top {
    object-fit: cover;
    width: 4.14rem;
    height: 3rem;
}

.content {
    position: relative;
    display: flex;
    align-items: center;
    position: relative;
    width: 3.9rem;
    height: 3.6rem;
    border-radius: .06rem;
    margin: -.4rem auto 0;
    background-color: #F6F6F6;

    .content-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;

        .icon {
            width: .48rem;
            height: .48rem;
            background-image: url("@/assets/img/account/scan.png");
        }

        .open-room {
            background-image: url("@/assets/img/account/open_room.png");
        }

        .primary-name {
            margin-top: .2rem;
            font-size: .18rem;
            color: #222;
        }

        .desc {
            padding-top: .06rem;
            font-size: .12rem;
            color: #9C9C9C;
        }
    }

    &::before {
        content: "";
        position: absolute;
        width: .01rem;
        height: 50%;
        background-color: rgba(#9C9C9C, .15);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

// .btn-wrap {
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     width: 100vw;
//     height: 100vh;
// }

// .main-btn {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 1.2rem;
//     height: 1.2rem;
//     font-size: .2rem;
//     border-radius: 50%;
//     color: #FFF;
//     background-color: #ff7f50;
//     box-shadow: 0 0 .03rem .06rem #ff7f50;
//     transition: all .5s;

//     &:active {
//         transform: translate(0, .04rem);
//         box-shadow: 0 0 0 0 #ff7f50;
//     }  
// }

// .scan-btn {
//     margin-top: .3rem;
//     box-shadow: 0 0 .03rem .06rem #70a1ff;
//     background-color: #70a1ff;

//     &:active {
//         transform: translate(0, .04rem);
//         box-shadow: 0 0 0 0 #70a1ff;
//     }
// }

</style>