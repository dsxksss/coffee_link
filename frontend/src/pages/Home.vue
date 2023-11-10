<script setup>
import { ref, onMounted ,watch} from "vue";
import { ArrowPathIcon,MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import BlogDialogView from "../components/BlogDialogView.vue";
import blogAPI from "../api/blog";
import avatarAPI from "../api/avatar";

async function getAvatar() {
    const result = await avatarAPI.getCats(50);
    imgs.value = result.data
}

onMounted(() => {
    fetchData();
    getAvatar();
})

const blogs = ref([])
const imgs = ref([])
const searchText = ref("")
const loading = ref(true)

async function fetchData() {
    loading.value = true;

    const result = await blogAPI.getAllBlogs();
    if (result.status === 200) {
        blogs.value = result.data;
        loading.value = false;
        console.log(blogs.value);
    }
}


function fuzzySearch() {
    if (searchText.value != "") {
        const filteredData = blogs.value.filter(item => {
            const title = item.title.toLowerCase();
            const searchQuery = searchText.value.toLowerCase();
            return title.includes(searchQuery);
        });
        if (filteredData.length > 0) {
            blogs.value = filteredData;
        }
    }else{
        fetchData()
    }
}

watch(searchText,fuzzySearch)

</script>

<template>
    <div v-if="loading.value" class="flex space-x-2 justify-center">
        加载中请稍后......
    </div>
    <div v-else-if="!blogs.length" class="flex space-x-2 justify-center">
        <div class="flex justify-center items-center space-x-1 pt-5">
            这里空空如也,快去发表博客吧
        </div>
    </div>
    <div v-else class="space-y-6 flex flex-col justify-center">
            <div class="space-x-4 pt-5 flex justify-center">
                <input v-model="searchText" type="text" class="input input-primary input-sm" placeholder="输入搜索内容">
                <button @click="fuzzySearch" class="btn btn-sm btn-ghost">
                    <MagnifyingGlassIcon class="w-5 h-5"></MagnifyingGlassIcon>
                </button>
            </div>
        <div class="grid lg:grid-cols-3 xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 justify-start 2xl:justify-items-center">
            <BlogDialogView v-for="(blog, index) in blogs" :title="blog.title" :content="blog.content"
                :authorName="blog.author.name" :createdAt="blog.createdAt" :img="imgs[index].url">
            </BlogDialogView>
        </div>

    </div>
</template>