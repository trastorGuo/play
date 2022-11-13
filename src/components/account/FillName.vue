<template>
<van-overlay :show="showFillInName">
    <div class="toast-wrap">
        <div class="toast">
            <div class="toast-title">请输入昵称</div>
            <div class="person-icon" v-html="multiavatar(myName)"></div>
            <input class="input" v-model="myName" placeholder="请输入昵称" />
            <div class="toast-ok" @click="commit">确认</div>
        </div>
    </div>
</van-overlay>
</template>

<script lang='ts' setup>
import { setMyInfo, showFillInName } from '../../hooks/account';
import { ref } from 'vue';
import { Notify } from 'vant';
import multiavatar from '@multiavatar/multiavatar';

const myName = ref("");

function commit() {
    if(!myName.value) {
        Notify({ type: 'warning', message: '昵称不能为空' });
        return;
    }
    setMyInfo(myName.value);
}
</script>

<style lang='less' scoped>
.person-icon {
    width: .54rem;
    height: .54rem;
    margin: .16rem 0;
    border-radius: 50%;
    background-color: rgba(#000, .1);
}

.input {
    width: 2rem;
    height: .38rem;
    border-radius: .2rem;
    border: #35CDB6 solid .01rem;
    text-align: center;
    font-size: .16rem;

    &::placeholder {
        text-align: center;
        font-size: .1rem;
        color: rgba(#000, .6);
    }
}

.toast-ok {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: .38rem;
    border-radius: .2rem;
    margin-top: .16rem;
    color: #FFF;
    background-color: #35CDB6;
}
</style>