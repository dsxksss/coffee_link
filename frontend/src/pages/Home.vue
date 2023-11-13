<script setup lang="ts">
// import { useToast } from "vue-toastification";
// const toast = useToast();
import Nav from '../components/Nav.vue';
import LinkCard from '../components/LinkCard.vue';
import linkApi from '../api/links';
import { onMounted,ref } from 'vue';
import { useToast } from "vue-toastification";

const toast = useToast();
const links = ref([]);

async function fetchData(){
    const result = await linkApi.getAllCoffeeLinks();
    const objData = JSON.parse(result.data);
    const data = objData.data;
    const msg = objData.msg;

     if (result.status != 200) {
        return toast.error(msg);
    }
    
    links.value = data;
} 

onMounted(()=>{
    fetchData();
})

</script>

<template>
    <main class="flex flex-col justify-start items-start h-screen w-screen bg-[#121419] overflow-hidden">
        <Nav></Nav>
        <div class="px-8 grid lg:grid-cols-3 xl:grid-cols-4 w-screen sm:grid-cols-2 h-full grid-cols-1 justify-start 2xl:justify-items-center overflow-y-scroll scroll-smooth">
            <LinkCard v-for="link in links" :link-title="link['title']"></LinkCard>
        </div>
    </main>
</template>