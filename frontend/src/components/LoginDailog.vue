<script setup lang="ts">
import {
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogContent,
} from 'radix-vue';

import memberAPI from '../api/members';
import { ref } from 'vue';
import { useToast } from "vue-toastification";

const props = defineProps({
    open: Boolean
})

const emit = defineEmits(['onClose', 'onSubmitSuccess'])

const toast = useToast();
const memberName = ref('');
const password = ref('');

function clearData() {
    memberName.value = '';
    password.value = '';
}

async function handleLogin() {
    const result = await memberAPI.login(memberName.value, password.value);
    const objData = JSON.parse(result.data);
    const data = objData.data;
    const msg = objData.msg;

    if (result.status != 200) {
        return toast.error(msg);
    }

    localStorage.setItem('authToken', data.authToken);
    clearData();
    emit('onClose');
    emit('onSubmitSuccess')
    toast.success(msg);
}

</script>

<template>
    <DialogRoot :open="props.open">
        <slot />
        <DialogPortal>
            <DialogOverlay @click.self="()=>{emit('onClose');clearData();}"
                class="z-10 bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0">
                <DialogContent
                    class="relative flex flex-col items-center justify-start z-20 data-[state=open]:animate-contentShow top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#1d2129] p-[25px] focus:outline-none">
                    <form class="flex flex-col items-center select-none" @submit.prevent="handleLogin">
                        <div class="space-x-4 text-[#fff0dd] mt-6">
                            <font-awesome-icon icon="fa-solid fa-link" class="h-8 w-8" />
                            <span class="text-3xl font-bold">Coffee Links</span>
                            <font-awesome-icon icon="fa-solid fa-mug-hot" class="h-8 w-8" />
                        </div>
                        <div class="form-control w-full max-w-xs mt-7">
                            <label class="label">
                                <span class="label-text font-bold">Member Name</span>
                            </label>
                            <input v-model="memberName" required type="text" placeholder="" maxlength=""
                                class="input border-gray-500 border-2 w-full max-w-xs" />
                        </div>
                        <div class="form-control w-full max-w-xs mt-4">
                            <label class="label">
                                <span class="label-text font-bold">Password</span>
                            </label>
                            <input v-model="password" required type="password" placeholder="" maxlength=""
                                class="input border-gray-500 border-2 w-full max-w-xs" />
                            <label class="label">
                            </label>
                        </div>
                        <button type="submit"
                            class="flex mt-6 items-center text-[#fff0dd] bg-[#3dafa5] hover:bg-[#3dafa5]/50 btn rounded-lg px-6 py-2">
                            <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="h-6 w-6" />
                            <span class="text-[14px] font-bold">Log In</span>
                        </button>
                        <button @click="() => { emit('onClose'); clearData(); }" class="btn btn-sm btn-square btn-ghost absolute top-1 right-1">
                            <font-awesome-icon icon="fa-solid fa-close" class="h-6 w-6" />
                        </button>
                    </form>
                </DialogContent>
            </DialogOverlay>
        </DialogPortal>
    </DialogRoot>
</template>