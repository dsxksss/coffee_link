<script setup lang="ts">

import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import ratingsAPI from '../api/ratings';
import { inject } from 'vue';

const emit = defineEmits(['onClose', 'onSubmitSuccess'])
const props = defineProps({
    linkID: String
})

const seleteRatingScore = ref('5');
const [auth, _] = inject('auth', ref<any>([]));

const toast = useToast();

async function handleRatingLink(linkID: string, ratingScore: number){
    if (auth.value) {
        await ratingLink(linkID, ratingScore);
    } else {
        return toast.error('Please Login First!');
    }
}

async function ratingLink(linkID: string, ratingScore: number) {
    const result = await ratingsAPI.linkRating(linkID, ratingScore);
    const objData = JSON.parse(result.data);
    const msg = objData.msg;

    if (result.status != 200) {
        return toast.error(msg);
    }

    toast.success(msg);
    emit('onSubmitSuccess')
}

</script>

<template>
    <PopoverRoot>
        <PopoverTrigger aria-label="Update dimensions">
            <slot></slot>
        </PopoverTrigger>
        <PopoverPortal>
            <PopoverContent side="bottom" :side-offset="0" :align-offset="0" align="end"
                class="rounded-lg p-5 max-h-[50vh] h-auto w-max-[800px] bg-base-300 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade">
                <div class="flex-col space-y-4 w-[150px]">
                    <div class="flex justify-between items-center">
                        <p class="text-[20px] leading-[19px] font-semibold">
                            Rating Link
                        </p>
                        <button @click="handleRatingLink(props.linkID!,parseInt(seleteRatingScore))" class="btn btn-circle btn-sm btn-success">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </button>
                    </div>
                    <div class="rating">
                        <input type="radio" v-model="seleteRatingScore" value="1" name="rating-2"
                            class="mask mask-star-2 bg-orange-400" />
                        <input type="radio" v-model="seleteRatingScore" value="2" name="rating-2"
                            class="mask mask-star-2 bg-orange-400" />
                        <input type="radio" v-model="seleteRatingScore" value="3" name="rating-2"
                            class="mask mask-star-2 bg-orange-400" />
                        <input type="radio" v-model="seleteRatingScore" value="4" name="rating-2"
                            class="mask mask-star-2 bg-orange-400" />
                        <input type="radio" v-model="seleteRatingScore" value="5" name="rating-2"
                            class="mask mask-star-2 bg-orange-400" checked />
                    </div>
                </div>

            </PopoverContent>
        </PopoverPortal>
    </PopoverRoot>
</template>