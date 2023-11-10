<script setup>
import "./index.css";
import { useRouter } from "vue-router";
import NavBar from './components/NavBar.vue';
import PageContent from "./components/PageContent.vue"

const router = useRouter();


</script>


<template>
  <main class="w-screen overflow-hidden rounded-box">
    <!-- 导航栏 -->
    <NavBar v-if="router.currentRoute.value.path !== '/login'"  class="z-10 fixed px-5 border-b-slate-700 border-b-[1px]"></NavBar>
    <!-- 页面容器 -->
    <PageContent :class="`overflow-scroll ${router.currentRoute.value.path != '/login'?'pt-20':null}`"></PageContent>
  </main>
</template>