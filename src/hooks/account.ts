import { ref } from 'vue';
import { PersonInfo } from '../interface/account';
import { Notify } from 'vant';

export const showShareContent = ref(false);
export const showFillInName = ref(false);
export const myInfo = ref<PersonInfo>({
    name: ""
});

export function getMyInfo() {
    const myName = localStorage.getItem("trastor-name");
    if(myName) {
        myInfo.value.name = myName;
        Notify({ type: 'success', message: myInfo.value.name + '，欢迎您回来' });
    } else {
        showFillInName.value = true;
    }
}

export async function setMyInfo(name: string) {
    if(!name) {
        return;
    }
    if(myInfo.value.name) {
        // await updateMyInfo();
        Notify({ type: 'success', message: myInfo.value.name + '，昵称修改成功' });
    } else {
        // await setMyInfo();
        Notify({ type: 'success', message: myInfo.value.name + '，欢迎您' });
    }
    localStorage.setItem("trastor-name", name);
    myInfo.value.name = name;
}