<script setup>
import { ref, onMounted } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { BookmarkSquareIcon } from '@heroicons/vue/24/solid';
import userAPI from '../api/user';
import blogAPI from '../api/blog';

const open = ref(false)
const users = ref([])
const currentTitle = ref('')
const currentContent = ref('')
const currentAuthor = ref('')
const emit = defineEmits(['createSuccess'])


onMounted(() => {
    fetchData();
})

async function fetchData() {
    const result = await userAPI.getAllUsers();
    if (result.status === 200) {
        users.value = result.data;
    }
}

function clearCurrent() {
    currentTitle.value = "";
    currentContent.value = "";
    currentAuthor.value = "";
}

function validCurrentData() {
    let can = true;
    if (currentTitle.value.trim() === "") {
        can = false;
    }
    if (currentContent.value.trim() === "") {
        can = false;
    }
    if (currentAuthor.value.trim() === "") {
        can = false;
    }
    return can;
}

async function checkHisUser() {
    await fetchData();
    if (users.value.length <= 0) {
        
        alert("请先创建用户再创建博客")
        return setopen(false);
    }
    return setopen(true);
}

async function createBlog() {
    if (!validCurrentData()) {
        alert("填写完整")
        return;
    }

    await blogAPI.createBlog({
        title: currentTitle.value,
        content: currentContent.value,
        author: currentAuthor.value
    })

     alert("创建成功")
   

    emit('createSuccess')
    clearCurrent();
    open.value = false;
}

function setopen(value) {
    open.value = value
}

</script>

<template>
    <div>
        <button class="btn btn-ghost space-x-2" @click="checkHisUser()">
            <BookmarkSquareIcon class="w-5 h-5" />
            <div>发布博客</div>
        </button>

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
                                class="relative bg-slate-100 h-[75vh] w-[90vw] transform overflow-hidden rounded-lg shadow-xl transition-all">
                                <div class=" px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div class=" space-y-6">

                                        <div class="flex items-center justify-between">

                                            <div class="flex space-x-6">
                                                <div class="space-y-2">
                                                    <div class="text-2xl">博客标题:</div>
                                                    <input type="text" name="name" v-model="currentTitle" placeholder="博客标题"
                                                        class="font-bold text-sm input input-bordered input-md w-full max-w-xs" />
                                                </div>
                                                <div class="space-y-2">
                                                    <div class="text-2xl">发布用户:</div>
                                                    <select v-model="currentAuthor"
                                                        class="select select-bordered w-full max-w-xs">
                                                        <option disabled selected>请选择发布用户</option>
                                                        <option v-for="user in users" :value="user._id">{{ user.name }}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class="flex flex-row justify-end p-6 space-x-4">
                                                <button class="btn btn-ghost" @click="createBlog()">创建</button>
                                                <button class="btn btn-ghost" @click="open = false">取消</button>
                                            </div>

                                        </div>


                                        <div>
                                            <v-md-editor v-model="currentContent" height="500px"></v-md-editor>
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
