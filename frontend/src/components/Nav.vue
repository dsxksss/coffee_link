<script setup lang="ts">
import FavoritesPopver from "./FavoritesPopver.vue";
import LoginDailog from "./LoginDailog.vue";
import RegisterDailog from "./RegisterDailog.vue";
import { onMounted, ref, watch } from "vue"

const loginDialogOpen = ref(false);
const registerDialogOpen = ref(false);
const favoritesPopverOpen = ref(false);

const isLogin = ref(false);

const emit = defineEmits(['authUpdate'])
watch(isLogin,()=>{
    emit('authUpdate');
})

onMounted(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        isLogin.value = true;
    }
})

function logOut() {
    isLogin.value = false;
    localStorage.removeItem('authToken');
    emit('authUpdate');
}

</script>

<template>
    <div class="flex w-full justify-between items-center h-20 px-8 select-none">
        <div class="space-x-2 text-[#fff0dd]">
            <font-awesome-icon icon="fa-solid fa-mug-hot" class="h-10 w-10" />
            <span class="text-3xl font-bold">Coffee Links</span>
        </div>

        <div class="space-x-4 flex items-center">

            <div v-if="isLogin" class="flex space-x-6 items-center">
                <FavoritesPopver>
                    <button @click="() => { favoritesPopverOpen = true }" class="flex btn btn-ghost btn-square items-center border-[2px] border-[#242427] rounded-lg">
                        <font-awesome-icon icon="fa-solid fa-disease" class="text-orange-300  h-6 w-6" />
                    </button>
                </FavoritesPopver>
                <button @click="logOut" class="flex items-center text-[#fff0dd] btn-error btn rounded-lg px-6 py-2">
                    <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="h-6 w-6" />
                    <span class="text-[14px] font-bold">Sign Out</span>
                </button>
            </div>

            <div v-else class="flex space-x-2 items-center">
                <LoginDailog :open="loginDialogOpen" @onClose="loginDialogOpen = false" @onSubmitSuccess="isLogin = true">
                    <button @click="() => { loginDialogOpen = true }"
                        class="flex items-center text-[#fff0dd] bg-[#1d2129] hover:bg-[#1d2129]/50 btn rounded-lg">
                        <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="h-6 w-6" />
                        <span class="text-[14px] font-bold">Log In</span>
                    </button>
                </LoginDailog>
            
                <RegisterDailog :open="registerDialogOpen" @onClose="registerDialogOpen = false" @onSubmitSuccess="isLogin = true" >
                    <button @click="() => { registerDialogOpen = true }"
                        class="flex items-center text-[#fff0dd] bg-[#3dafa5] hover:bg-[#3dafa5]/50 btn rounded-lg px-6 py-2">
                        <font-awesome-icon icon="fa-solid fa-door-open" class="h-6 w-6" />
                        <span class="text-[14px] font-bold">Sign Up</span>
                    </button>
                </RegisterDailog>
            </div>

            
        </div>
    </div>
</template>