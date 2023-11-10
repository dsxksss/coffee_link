<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import timeFormatted from '../tools/timeFormatted';

const props = defineProps({
    title: String,
    content: String,
    authorName: String,
    createdAt: Date,
    img: String,
})

const open = ref(false)
const emit = defineEmits(['updateSuccess'])

function setopen(value) {
    open.value = value
}

</script>

<template>
    <div>
        <div class="card card-compact shadow-xl shadow-slate-200 w-64 m-4" @click="setopen(true)">
            <figure class="bg-cover h-40 bg-bottom">
                <img :src="image || '/overlapping-circles.svg'" :alt="title" />
            </figure>
            <div class="card-body text-ellipsis">
                <h2 class="card-title">{{ title || "没有标题" }}</h2>
                <div class="text-lg font-medium ml-1"> {{ timeFormatted(props.createdAt) }}</div>
                <div class="card-actions pt-2 justify-center items-center">
                    <div class="flex flex-row w-full justify-end">
                        <button class="btn btn-ghost text-lg">浏览更多</button>
                    </div>
                </div>
            </div>
        </div>


        <TransitionRoot class="z-50" as="template" :show="open">
            <Dialog as="div" class="relative z-10" @close="open = false">

                <div class="fixed inset-0 z-10 overflow-y-auto">
                    <div class="flex min-h-full items-end justify-center p-4  sm:items-center sm:p-0">
                        <TransitionChild as="template" enter="ease-out"
                            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                            leave-from="opacity-100 translate-y-0 sm:scale-100"
                            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <DialogPanel
                                class="relative overflow-scroll  bg-slate-100 scroll-smooth h-[84vh] w-[90vw] transform rounded-lg shadow-xl transition-all">

                                <div class=" px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div class="space-y-6">
                                        <div>
                                            <v-md-preview :text="props.content" height="500px"></v-md-preview>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

    </div>
</template>
