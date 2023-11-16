<script setup lang="ts">
import {
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogContent,
} from 'radix-vue';

import linksAPI from '../api/links';
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import ToastYseOrNo from './ToastYseOrNo.vue';


const props = defineProps({
    open: Boolean
})

const emit = defineEmits(['onClose', 'onSubmitSuccess'])

const toast = useToast();
const linkURL = ref('');
const linkTitle = ref('');
const linkDescription = ref('');
const hidden = ref(false);

function clearData() {
    linkURL.value = '';
    linkTitle.value = '';
    linkDescription.value = '';
    hidden.value = false;
}

function checkCacheData() {
    const hasCache = linkURL.value.length != 0 || linkTitle.value.length != 0 || linkDescription.value.length != 0;
    if (hasCache) {
        toast.error({
            component: ToastYseOrNo,
            props:{
                "message":"Do you need to keep the content already filled out?"
            },
            listeners: {
                clickYse: () => { emit('onClose'); toast.dismiss("checkCacheData") },
                clickNo: () => { clearData(); emit('onClose'); toast.dismiss("checkCacheData") }
            },
        }, {
            closeOnClick: false,
            timeout: false,
            showCloseButtonOnHover:false,
            closeButton:false,
            // 根据该id来决定toast的身份
            id: "checkCacheData"
        });
    }else{
        emit('onClose');
    }
}

async function handleAddLink() {
    const result = await linksAPI.createLink(linkURL.value, linkTitle.value, linkDescription.value, hidden.value);
    const objData = JSON.parse(result.data);
    const msg = objData.msg;

    if (result.status != 200) {
        return toast.error(msg);
    }

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
            <DialogOverlay @click.self="checkCacheData"
                class="z-10 bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0">
                <DialogContent
                    class="relative flex flex-col z-20 data-[state=open]:animate-contentShow top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] py-5 px-10 translate-y-[-50%] rounded-[6px] bg-[#1d2129] focus:outline-none">
                    <div class="space-x-4 text-[#fff0dd]">
                        <span class="text-3xl font-bold">New CoffeeLink</span>
                    </div>
                    <form class="flex flex-col items-center select-none pt-4" @submit.prevent="handleAddLink">
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text font-bold">Link URL</span>
                            </label>
                            <input v-model="linkURL" required type="text" placeholder="" maxlength=""
                                class="input border-gray-500 border-2 w-full" />
                        </div>
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text font-bold">Title</span>
                            </label>
                            <input v-model="linkTitle" required type="text" placeholder="" maxlength=""
                                class="input border-gray-500 border-2 w-full" />
                        </div>

                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text font-bold">Description</span>
                            </label>
                            <textarea required v-model="linkDescription"
                                class="border-gray-500 border-2 max-h-[45vh] px-2 py-1 textarea textarea-bordered textarea-lg w-full"></textarea>
                            <label class="label">
                            </label>
                        </div>
                        <div class="absolute top-5 right-5 space-x-4 flex">
                            <label class="swap">
                                <!-- this hidden checkbox controls the state -->
                                <input v-model="hidden" type="checkbox" />
                                <font-awesome-icon icon="fa-solid fa-eye" class="swap-off w-7 h-7" />
                                <font-awesome-icon icon="fa-solid fa-eye-slash" class="swap-on w-7 h-7" />
                            </label>

                            <button type="submit"
                                class="flex items-center text-[#fff0dd] bg-[#3dafa5] hover:bg-[#3dafa5]/50 btn btn-sm rounded-lg px-6 py-2 ">
                                <span class="text-[14px] font-bold">Add</span>
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </DialogOverlay>
        </DialogPortal>
    </DialogRoot>
</template>