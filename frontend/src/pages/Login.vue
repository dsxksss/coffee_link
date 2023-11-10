<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const name = ref("管理员");
const password = ref("");

const handleSubmit = () => {
    if (name.value != "" && password.value != "") {
        if (name.value == "管理员" && password.value == "666666") {
            localStorage.setItem("isLogin", "true");
            router.push("/");
        } else {
            alert("登陆失败！账号密码错误")
        }
    }
}

</script>

<template>
    <div class="hero min-h-screen">
        <div class="hero-content flex-col lg:flex-row-reverse ">

            <div class="card flex-shrink-0 w-full shadow-2xl bg-base-100 p-20">
                <h1 class="text-5xl font-bold text-center">登录博客系统</h1>
                <form @submit.prevent="handleSubmit" class="card-body">
                    <div class="form-control">
                        <input v-model="name" id="email" placeholder="账号" name="email" type="text" autocomplete="email" required=""
                            class="text-center px-16 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                    <div class="form-control">

                        <input v-model="password" id="email" placeholder="密码" name="email" type="text" autocomplete="email" required=""
                            class="text-center px-16 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        
                    </div>
                    <div class="form-control mt-6">
                        <button type="submit" class="btn btn-primary">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style ></style>