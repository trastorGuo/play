<!--
 * @Description: 
 * @Date: 2022-08-14 16:22:30
 * @Author: 
 * @LastEditTime: 2022-09-18 23:14:52
-->
<template>
    <div class="router-wrap">
        <router-view></router-view>
    </div>
</template>

<!-- <script lang='ts' setup>
</script> -->

<style lang='less'>
@import './assets/css/app.css';

* {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    box-sizing: border-box;
}

#app {
    height: 100%;
}

body,
html {
    height: 100%;
    margin: 0;
}

.text-wrap {
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;
}

.router-wrap {
    height: 100%;
}

.toast-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
}

.toast {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    width: 3rem;
    // height: 3.8rem;
    border-radius: .18rem;
    padding: .24rem;
    font-size: .18rem;
    background-color: #FFF;

    .close {
        position: absolute;
        top: .12rem;
        right: .12rem;
        width: .22rem;
        height: .22rem;
        background-image: url("./assets/img/close.png");
        background-size: 100% 100%;
    }

    .toast-title {
        font-size: .18rem;
    }

    .toast-btn-wrap {
        display: flex;
        width: 100%;
        justify-content: space-around;
    }

    .toast-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: .36rem;
        width: 1rem;
        border-radius: .08rem;
        font-size: .16rem;
        background-color: #bdc3c7;
    }

    .toast-second-btn {
        color: #FFF;
        background-color: #35CDB6;
    }
}

.van-overlay {
    background-color: rgba(#000, .6);
}
</style>