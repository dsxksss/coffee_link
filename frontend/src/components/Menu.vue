<script setup>
import { useRouter } from "vue-router"
import menuItems from "../data/menuItems"
import { ref } from "vue";
const router = useRouter()
const items = ref(menuItems);

</script>

<template>
    <ul class="menu menu-horizontal  flex rounded-box p-2 space-x-4">
            <li v-for="item in items" :key="item.path">
                <RouterLink :to="item.path" :class="item.path == router.currentRoute.value.path ? 'border-b-2 border-black' : 'link link-info'">
                   <span>{{ item.title }}</span>
                </RouterLink>
            </li>
        </ul>
</template>