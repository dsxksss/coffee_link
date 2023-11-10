<script setup>
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
import { ref, onMounted } from "vue";
import userAPI from "../api/user";
import blogAPI from "../api/blog";
import timeFormatted from '../tools/timeFormatted';
import BlogManagerYesOrNo from '../components/BlogManagerYesOrNo.vue';
import CreateBlogDialog from '../components/CreateBlogDialog.vue';
import UpdateBlogDialog from '../components/UpdateBlogDialog.vue';

const users = ref([])
const blogs = ref([])
const loading = ref(true)
const isCreateOpen = ref(false)
const currentName = ref("")
const currentEmail = ref("")
const currentPassword = ref("")
const pageCount = ref(1)
const pageMaxCount = ref(0)

onMounted(() => {
    getAllUsers();
    fetchData();
    getPageMaxCount();
})


async function getAllUsers() {
    const result = await userAPI.getUsers();
    if (result.status === 200) {
        users.value = result.data;
    }
}

async function getPageMaxCount() {
    const maxCount = await blogAPI.getPageMaxCount()
    pageMaxCount.value = maxCount;
}

async function fetchData(pageCount = 1) {
    await getPageMaxCount();

    loading.value = true;
    const result = await blogAPI.getBlogs(pageCount);
    if (result.status === 200) {
        blogs.value = result.data;
        loading.value = false;
        console.log(blogs.value);
    }
}

async function fetchNextData() {
    await getPageMaxCount();
    if (pageCount.value >= pageMaxCount.value) {
       
        return;
    }

    loading.value = true;
    pageCount.value += 1;
    const result = await blogAPI.getBlogs(pageCount.value)
    if (result.status === 200) {
        blogs.value = result.data;
        loading.value = false;
        console.log(blogs.value);
    }
}

async function fetchBackData() {
    await getPageMaxCount();

    if (pageCount.value <= 1) {
      
        return;
    }

    loading.value = true;
    pageCount.value -= 1;
    const result = await blogAPI.getBlogs(pageCount.value)
    if (result.status === 200) {
        blogs.value = result.data;
        loading.value = false;
        console.log(blogs.value);
    }
}

async function fetchEndData() {
    await getPageMaxCount();
    loading.value = true;
    pageCount.value = pageMaxCount.value
    const result = await blogAPI.getBlogs(pageCount.value)
    if (result.status === 200) {
        blogs.value = result.data;
        loading.value = false;
        console.log(blogs.value);
    }
}

async function deleteBlog(id) {
    const result = confirm("你确定要删除此博客吗?")
    if(result) {
        await blogAPI.deleteBlog(id);
        if (blogs.value.length === 1) {
            if (pageCount.value > 1) {
                pageCount.value -= 1;
            }
        }
        fetchData(pageCount.value);
        alert("删除成功");
    }
}
</script>

<template>
    <div>

        <div>
            <div v-if="loading.value" class="flex space-x-2 justify-center">
                加载中请稍后......
            </div>
            <div v-else-if="!blogs.length" class="flex space-x-2 justify-center">
                <div class="flex justify-center items-center space-x-1 pt-5">
                   <div class="flex justify-center items-center space-x-1">
                        <span class="text-xl mr-2">这里空空如也</span>
                    </div>

                    <CreateBlogDialog @createSuccess="() => fetchEndData()" />
                </div>
            </div>
            <div v-else class="flex flex-col h-[80vh] space-y-8 justify-center items-center">
                <div class="space-x-2 flex flex-row justify-center ">
                    <div class="overflow-x-auto flex lg:justify-center shadow-2xl border rounded-xl p-8">
                        <table class="table table-xs table-zebra">
                            <thead>
                                <tr>
                                    <th class="bg-base-100">标题</th>
                                    <th class="bg-base-100">作者</th>
                                    <th class="bg-base-100">邮箱</th>
                                    <th class="bg-base-100" v-if="!isCreateOpen.value">日期</th>
                                    <th class="bg-base-100">
                                        <div class="flex flex-row">
                                            <CreateBlogDialog @createSuccess="() => fetchEndData()" />
                                            <button class="btn btn-ghost space-x-2" @click="fetchData(pageCount.value)">
                                                
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="blog in blogs" :key="blog._id">

                                    <!-- title -->
                                    <td v-if="blog.edit">
                                        <input type="text" name="name" v-model="currentName"
                                            class="font-bold text-sm input input-bordered input-sm w-full max-w-xs" />
                                    </td>
                                    <td v-else>
                                        <div class="font-bold">{{ blog.title }}</div>
                                    </td>

                                    <!-- name -->
                                    <td v-if="blog.edit">
                                        <input type="text" name="email" v-model="currentEmail"
                                            class="font-bold text-sm input input-bordered input-sm w-full max-w-xs" />
                                    </td>
                                    <td v-else>
                                        {{ blog.author.name }}
                                    </td>

                                    <!-- email -->
                                    <td v-if="blog.edit">
                                        <input type="text" name="password" v-model="currentPassword"
                                            class="font-bold text-sm input input-bordered input-sm w-full max-w-xs" />
                                    </td>
                                    <td v-else>
                                        {{ blog.author.email }}
                                    </td>

                                    <!-- createdAt -->
                                    <td v-if="blog.createdAt">
                                        {{ timeFormatted(blog.createdAt) }}
                                    </td>
                                    <td v-else>
                                        待创建...
                                    </td>


                                    <th class="space-x-2">
                                        <UpdateBlogDialog :title="blog.title" :content="blog.content"
                                            :authorName="blog.author.name" :blogId="blog._id" />

                                        <button v-if="!blog.edit" class="btn btn-error btn-sm text-white"
                                            @click="deleteBlog(blog._id)">删除博客</button>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="fixed bottom-20 join space-x-4 flex justify-center">
                    <button :disabled="pageCount > 1 ? null : 'disabled'" class="join-item btn btn-ghost"
                        @click="fetchBackData()">
                        <ChevronLeftIcon class="w-6 h-6" />
                    </button>
                <div class="join-item btn btn-ghost font-bold">{{ `${pageCount}` }}</div>
                    <button :disabled="pageCount < pageMaxCount ? null : 'disabled'"
                        class="join-item btn-ghost btn" @click="fetchNextData()">
                        <ChevronRightIcon class="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>


    </div>
</template>