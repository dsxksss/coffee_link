<script setup lang="ts">
import {
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogContent,
} from 'radix-vue';

import linksAPI from '../api/links';
import { extractDateTime } from '../utils/extractDateTime';
import { inject, onMounted, ref, watch } from 'vue';
import { useToast } from "vue-toastification";
import ToastYseOrNo from './ToastYseOrNo.vue';


const props = defineProps({
    open: Boolean
})

const ratingSelect = ref('')

const link = inject<any>('currentLink', {});
const emit = defineEmits(['onClose', 'onSubmitSuccess'])

watch(link, () => {
    ratingSelect.value = '';
})

const toast = useToast();

function clearData() {
}


</script>

<template>
    <DialogRoot :open="props.open">
        <slot />
        <DialogPortal>
            <DialogOverlay @click.self="emit('onClose')"
                class="z-10 bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0">
                <DialogContent
                    class="relative bg-base-100 shadow-2xl z-20 max-h-[500px] max-w-[800px]  data-[state=open]:animate-contentShow  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl focus:outline-none">

                    <div class="w-full flex flex-col md:flex-row rounded-lg">
                        <img class="max-w-[50%] max-h-[500px] rounded-lg"
                            src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Linea_doubleespresso.jpg"
                            alt="Album" />

                        <div class="p-5 max-w-[50%] max-h-[500px] space-y-4">
                            <div class="flex justify-between">
                                <p class="truncate w-[50%] text-2xl text-[#fff0dd]">{{ link.linkTitle }}</p>
                                <span class="space-x-3 flex items-center">
                                    <div class=" space-x-1 flex items-center">
                                        <span>
                                            <font-awesome-icon icon="fa-solid fa-fire" class="w-7 h-7 text-red-400" />
                                        </span>
                                        <span class="text-2xl">{{ link.points }}</span>
                                    </div>
                                    <div class="space-x-1 flex items-center">
                                        <font-awesome-icon icon="fa-solid fa-star"
                                            :class="`w-7 h-7 ${parseFloat(link.averageRatingScore) <= 0.0 ? ' text-gray-400' : 'text-orange-400'}`" />
                                        <span class="text-2xl">{{ parseFloat(link.averageRatingScore) <= 0.0 ? '0.0' :
                                            link.averageRatingScore }}</span>
                                    </div>
                                </span>
                            </div>
                            <div><a :href="link.linkURL" target="_blank" class="truncate text-xl link">Coffee Link</a></div>
                            <p class="indent-8 h-[200px] overflow-y-auto break-words">{{ link.linkDescription }}</p>
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

                </DialogContent>
            </DialogOverlay>
        </DialogPortal>
    </DialogRoot>
</template>