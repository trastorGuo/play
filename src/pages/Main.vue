<template>
    <div class="content"></div>
    <div class="copyright">版权©trastor <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备19005837号</a></div>
</template>

<script lang='ts' setup>
</script>

<style lang='less' scoped>
.content {
    height: 100%;
    background-size: contain;
    background-color: #e9e9e9;
    background-image: url("@/assets/img/main_bg.png");
}

.copyright {
    position: absolute;
    bottom: 14px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 16px;
}

a {
    color: black;
}
</style>