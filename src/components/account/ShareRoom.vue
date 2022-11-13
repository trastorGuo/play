<template>
<van-overlay :show="showShareContent">
    <div class="toast-wrap">
        <div class="toast">
            <div class="close" @click="showShareContent = false"></div>
            <div class="toast-title">微信扫描二维码进入</div>
            <div class="house-num">房号：1234</div>
            <qrcode class="qr-code" url="https://juejin.cn/"></qrcode>
            <div class="share-desc">也可以通过”转发“让好友加入</div>
            <div class="toast-btn-wrap">
                <div class="toast-btn" @click="showShareContent = false">知道了</div>
                <div class="toast-btn toast-second-btn">转发好友</div>
            </div>
        </div>
    </div>
</van-overlay>
</template>

<script lang='ts' setup>
import Qrcode from './QrCode.vue';
import { showShareContent } from '../../hooks/account';
</script>

<style lang='less' scoped>


.share-desc {
    padding-bottom: .08rem;
    font-size: .12rem;
    color: #CCC;
}

.house-num {
    padding-top: .04rem;
    font-weight: bold;
    font-size: .22rem;
}

.qr-code {
    width: 2rem;
    height: 2rem;
    margin: .08rem 0;
}
</style>