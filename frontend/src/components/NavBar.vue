<script setup>
import { useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";
import Menu from './Menu.vue';

import menuItems from '../data/menuItems';
import { ExclamationTriangleIcon,BuildingLibraryIcon} from '@heroicons/vue/24/solid'

const router = useRouter();
const nowComponent = ref({});

const getNowComponent = () => {
    nowComponent.value = menuItems.find(item => item.path === router.currentRoute.value.path)
     nowComponent.value  = nowComponent.value ?? {
        title: "404没找到页面",
        iconColor: '',
        isActive: true,
        component: ExclamationTriangleIcon,
    };
}

const outLogin = () => {
    localStorage.removeItem("isLogin");
    router.push("/login");
}

onMounted(() => {
    getNowComponent();
})

watch(router.currentRoute, getNowComponent)

</script>
<template>
    <div class="navbar bg-base-100 z-50">
        <div class="flex-1 space-x-4">
            <BuildingLibraryIcon class="w-10 h-10"></BuildingLibraryIcon>
            <span class="text-2xl font-bold">BLOG System</span>
        </div>
        <div class="flex-none space-x-2">
                <Menu></Menu>
                <div  class="flex flex-row items-center space-x-2">
                    <button @click="outLogin" class="btn btn-error text-white">
                        退出系统
                    </button>
                </div>
            </div>
    </div>
</template>