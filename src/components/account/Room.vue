<template>
   <div class="room-wrap">
      <div class="person-list-wrap">
         <div class="person-list-box">
            <div class="person-wrap person-add" @click="showShare">
               <div class="person-icon"></div>
               <div class="person-name text-wrap">邀请</div>
            </div>
            <div v-for="item in personList" class="person-wrap" @click="clickPerson(item)">
               <div class="person-icon" v-html="multiavatar(item)"></div>
               <div class="person-name text-wrap">{{ item }}</div>
            </div>
         </div>
      </div>
      <div ref="turnoverRef" class="turnover">
         <TransitionGroup name="list">
            <div v-for="item in items" :key="item" class="turnover-item">
               {{ item }}
            </div>
         </TransitionGroup>
      </div>
      <div class="btn-wrap">
         <!-- <div class="room-btn out">
            <div class="room-btn-icon"></div>
            <div class="room-btn-txt">支出</div>
         </div> -->
         <div class="room-btn settlement">
            <div class="room-btn-icon"></div>
            <div class="room-btn-txt">结算</div>
         </div>
      </div>
   </div>
   <van-overlay :show="showOut">
      <div class="toast-wrap">
         <div class="toast">
               <div class="close" @click="showOut = false"></div>
               <div class="out-person-wrap">
                  <div class="person-wrap">
                     <div class="person-icon" v-html="multiavatar(myInfo.name)"></div>
                     <div class="person-name text-wrap">{{ myInfo.name }}</div>
                  </div>
                  <div class="out-to">=></div>
                  <div class="person-wrap">
                     <div class="person-icon" v-html="multiavatar(outPerson)"></div>
                     <div class="person-name text-wrap">{{ outPerson }}</div>
                  </div>
               </div>
               <input v-model="outValue" type="number" placeholder="请输入金额" />
               <div class="toast-out-btn" @click="commitOut">支出</div>
         </div>
      </div>
   </van-overlay>
</template>

<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import multiavatar from '@multiavatar/multiavatar';
import { showShareContent, myInfo, showFillInName } from '../../hooks/account';
import { Notify } from 'vant';

const personList = ref(['郭钊', '1111', 'test', '122322', '5555']);
const items = ref(["1", "2", "3"]);
const turnoverRef = ref<HTMLElement>();
const touching = ref(false);
const showOut = ref(false);
const outPerson = ref("");
const outValue = ref("");

function showShare() {
   showShareContent.value = true;
}

function commitOut() {
   if(Number(outValue.value) <= 0 ) {
      Notify({ type: 'warning', message: '金额需大于0' });
      return;
   }
   showOut.value = false;
}

onMounted(() => {
   if(turnoverRef.value) {
      turnoverRef.value.addEventListener("touchstart", () => changeTouching(true), false);
      turnoverRef.value.addEventListener("touchend", () => changeTouching(false), false);
   };
});

function changeTouching(isTouch: boolean) {
   touching.value = isTouch;
}

function clickPerson(person: string) {
   if(person === myInfo.value.name) {
      showFillInName.value = true;
   } else {
      outPerson.value = person;
      showOut.value = true;
   }
}

setInterval(() => {
   items.value.push(items.value.length + "郭钊支出3元给过于");
   !touching.value && turnoverRef.value && turnoverRef.value.scrollTo({
      top: turnoverRef.value.scrollHeight,
      behavior: "smooth"
   });
}, 200);

</script>

<style lang='less' scoped>
.room-wrap {
   display: flex;
   flex-direction: column;
   align-items: center;
   height: 100%;
}

:deep(.van-notice-bar) {
   height: .3rem !important;
   border-radius: .15rem;

   .van-notice-bar__content {
      font-size: .1rem;
   }
}

.person-list-wrap {
   flex-shrink: 0;
   position: relative;
   overflow-x: scroll;
   max-width: 4.14rem;
   height: 1.5rem;
   padding: .12rem;
}

.person-list-box{
   display: flex;
   align-items: center;
   justify-content: center;
   width: max-content;
   height: 1.1rem;

   &::-webkit-scrollbar {
      display: none;
   }
}

.person-wrap {
   display: flex;
   flex-direction: column;
   align-items: center;
   margin: .1rem;
}

.person-icon {
   display: flex;
   width: .64rem;
   height: .64rem;
   border-radius: 50%;
}

.person-name {
   max-width: .64rem;
   padding-top: .04rem;
   font-size: .16rem;
}

.person-add {
   .person-icon {
      border: #8a8a8a solid .01rem;
      background-image: url("../../assets/img/add.png");
      background-size: 50% 50%;
   }
}

.btn-wrap {
   flex-shrink: 0;
   position: relative;
   display: flex;
   justify-content: space-around;
   width: 100%;
   height: .6rem;
   font-size: .24rem;

   &::after {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      transform: translateY(-50%);
      height: .005rem;
      width: 100%;
      background-color: #8a8a8a;
   }
}

.room-btn {
   flex: 1;
   display: flex;
   justify-content: center;
   align-items: center;
   font-size: .18rem;

   .room-btn-icon {
      width: .3rem;
      height: .3rem;
      margin-right: .04rem;
      background-image: url("../../assets/img/out.png");
   }

   &:first-child {
      position: relative;

      &::after {
         content: "";
         position: absolute;
         right: 0;
         top: 0;
         transform: translateX(50%);
         width: .005rem;
         height: 100%;
         background-color: #8a8a8a;
      }
   }
}

.settlement {
   .room-btn-icon {
      background-image: url("../../assets/img/settlement.png");
   }
}

.turnover {
   display: flex;
   flex-direction: column;
   align-items: center;
   overflow-y: scroll;
   overflow-x: hidden;
   flex: 1;
   width: 100%;
   padding: .24rem 0;
   border-top: #35CDB6 solid .02rem;
   font-size: .12rem;

   .turnover-item {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: .1rem;
      height: .2rem;
      width: max-content;
      min-width: 2rem;
      padding: .04rem;
      margin-top: .06rem;
      color: #FFF;
      background-color: rgba(#000, .25);
   }
}

.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
   transition: all .5s ease;
}

.list-enter-from,
.list-leave-to {
   opacity: 0;
   transform: translateX(100%);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
   position: absolute;
}


.out-person-wrap {
   display: flex;
   align-items: center;

   .out-to {
      color: #9c9c9c;
   }
}

input {
   border: #9c9c9c solid .01rem;
   width: 2.2rem;
   height: .4rem;
   border-radius: .1rem;
   font-size: .16rem;
   text-align: center;

   &::placeholder {
      text-align: center;
      font-size: .14rem;
      color: rgba(#000, .6);
   }
}

.toast-out-btn {
   display: flex;
   justify-content: center;
   align-items: center;
   width: 2.2rem;
   height: .4rem;
   border-radius: .1rem;
   margin-top: .12rem;
   color: #FFF;
   background-color: #35CDB6;
}
</style>