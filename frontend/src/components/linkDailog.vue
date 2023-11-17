<script setup lang="ts">
import {
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogContent,
} from 'radix-vue';

import { extractDateTime } from '../utils/extractDateTime';
import { inject, ref, watch } from 'vue';
import { useToast } from "vue-toastification";
import UpdateLinkDailog from './UpdateLinkDailog.vue';
import { Link } from '../interfaces/link';
import { jwtDecode } from "jwt-decode";
import ToastYseOrNo from './ToastYseOrNo.vue';
import linksAPI from '../api/links';
import RatingPopver from './RatingPopver.vue';


const props = defineProps({
    open: Boolean
})
const emit = defineEmits(['onClose', 'onSubmitSuccess'])

const updateLinkDailogOpen = ref(false)

const [auth, _] = inject('auth', ref<any>([]));
const homeDataRefresh = inject('homeDataRefresh', () => { });
const link = inject<any>('currentLink');

const linkURL = ref('');
const linkTitle = ref('');
const linkDescription = ref('');
const points = ref('');
const averageRatingScore = ref('')
const hidden = ref(false);

watch(link, () => { linkUpdate() })

function linkUpdate() {
    linkURL.value = link.value.linkURL;
    linkTitle.value = link.value.linkTitle;
    linkDescription.value = link.value.linkDescription;
    points.value = link.value.points;
    averageRatingScore.value = link.value.averageRatingScore;
    hidden.value = link.value.hidden;
}

function checkSelf(): boolean {
    if (localStorage.getItem('authToken') == undefined) {
        return false;
    }
    return jwtDecode<any>(localStorage.getItem("authToken")!).memberName === link.value.creator
}

const toast = useToast();

function confirm(linkID: string) {
    toast.error({
        component: ToastYseOrNo,
        props: {
            "message": "Are you sure you want to delete this link?"
        },
        listeners: {
            clickYse: () => {
                handleLinkDelete(linkID);
                emit('onClose');
                toast.dismiss("deleteLink")
            },
            clickNo: () => { toast.dismiss("deleteLink") }
        },
    }, {
        closeOnClick: false,
        timeout: false,
        showCloseButtonOnHover: false,
        closeButton: false,
        // 根据该id来决定toast的身份
        id: "deleteLink"
    });

}

async function handleLinkDelete(linkID: string) {
    const result = await linksAPI.deleteLink(linkID);
    const objData = JSON.parse(result.data);
    const msg = objData.msg;

    if (result.status != 200) {
        return toast.error(msg);
    }

    emit('onClose');
    emit('onSubmitSuccess')
    homeDataRefresh();
    toast.success(msg);
}

</script>

<template>
    <DialogRoot :open="props.open">
        <slot />
        <DialogPortal>
            <DialogOverlay @click.self="emit('onClose')"
                class="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0">
                <DialogContent
                    class="relative bg-base-100 shadow-2xl max-h-[500px] max-w-[800px] data-[state=open]:animate-contentShow  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl focus:outline-none">

                    <div class="w-full flex flex-col md:flex-row rounded-lg">
                        <img class="max-w-[400px] max-h-[500px] rounded-lg"
                            src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Linea_doubleespresso.jpg"
                            alt="Album" />

                        <div class="p-5 max-w-[400px] min-w-[400px] max-h-[500px] space-y-4">
                            <div class="flex justify-between items-center max-w-full">
                                <div><a :href="link.linkURL" target="_blank" class="truncate text-xl link">Coffee Link</a></div>
                                
                                <span class="space-x-3 max-w-[220px] flex justify-between items-end">
                                    <div class="space-x-1 flex items-end">
                                        <span>
                                            <font-awesome-icon icon="fa-solid fa-fire"
                                                class="w-[25px] h-[25px] text-red-400" />
                                        </span>
                                        <span class="text-2xl">{{ points }}</span>
                                    </div>
                                    <RatingPopver :linkID="link.linkID" @on-submit-success="() => homeDataRefresh()">
                                        <button>
                                            <div class="space-x-1 flex items-center">
                                                <font-awesome-icon icon="fa-solid fa-star"
                                                    :class="`w-[24px] h-[24px] ${parseFloat(averageRatingScore) <= 0.0 ? ' text-gray-400' : 'text-orange-400'}`" />
                                                <span class="text-2xl">{{ parseFloat(averageRatingScore) <= 0.0 ? '0.0' :
                                                    averageRatingScore }}</span>
                                            </div>
                                        </button>
                                    </RatingPopver>
                                </span>
                            </div>
                            <p class="h-[32px] max-w-[400px] overflow-y-auto break-words text-2xl text-[#fff0dd]">{{ linkTitle }}</p>
                            <p class="indent-8 h-[200px] max-w-[400px] overflow-y-auto break-words">{{ linkDescription
                            }}</p>
                            <div class="flex justify-between">
                                <div class="flex flex-col items-end space-y-5 pt-5">
                                    <div v-if="checkSelf()" class="flex space-x-4 items-center">
                                        <UpdateLinkDailog :open="updateLinkDailogOpen"
                                            @onClose="updateLinkDailogOpen = false"
                                            @on-submit-success="() => { homeDataRefresh(); emit('onSubmitSuccess'); }" :link="new Link({
                                                linkID: link['linkID'],
                                                linkURL: linkURL,
                                                linkTitle: linkTitle,
                                                linkDescription: linkDescription,
                                                creator: link['creator'],
                                                hidden: hidden,
                                                createdAt: link['createdAt']
                                            })">
                                            <button @click="() => {
                                                if (auth) {
                                                    updateLinkDailogOpen = true;
                                                } else {
                                                    toast.error('Please Login First!');
                                                }
                                            }" class="bg-base-100 btn btn-circle btn-ghost btn-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>

                                            </button>
                                        </UpdateLinkDailog>
                                        <button @click="() => confirm(link.linkID)"
                                            class="bg-base-100 btn btn-circle btn-ghost btn-lg btn-error">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end space-y-5 pt-5">
                                    <div>
                                        <span class="text-lg truncate badge badge-success text-white">{{
                                            `${link!.creator.substring(0, 10)}${link.creator.length > 10 ? '...' : ''}`
                                        }}</span>
                                    </div>
                                    <div>
                                        <span class="truncate text-lg text-gray-500">{{ extractDateTime(link!.createdAt)
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </DialogContent>
            </DialogOverlay>
        </DialogPortal>
    </DialogRoot>
</template>