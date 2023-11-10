<script setup>
import { ArrowPathIcon, PlusCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
import userAPI from '../api/user';
import { ref, onMounted } from "vue";
import timeFormatted from '../tools/timeFormatted';
import UserManagerYesOrNo from '../components/UserManagerYesOrNo.vue';
import avatarAPI from "../api/avatar";

onMounted(() => {
    fetchData();
    getPageMaxCount();
    getAvatar();
})

const users = ref([])
const imgs = ref([])
const loading = ref(true)
const isEditOpen = ref(false)
const isCreateOpen = ref(false)
const currentName = ref("")
const currentEmail = ref("")
const currentPassword = ref("")
const pageCount = ref(1)
const pageMaxCount = ref(0)

async function getPageMaxCount() {
    const maxCount = await userAPI.getPageMaxCount()
    pageMaxCount.value = maxCount;
}

async function fetchData(page = 1) {
    if (!openCheck()) return;

    await getPageMaxCount();

    loading.value = true;
    const result = await userAPI.getUsers(page);
    if (result.status === 200) {
        users.value = result.data;
        loading.value = false;
        console.log(users.value);
    }
}

async function fetchNextData() {
    if (!openCheck()) return;
    await getPageMaxCount();
    if (pageCount.value >= pageMaxCount.value) {
       
        return;
    }

    loading.value = true;
    pageCount.value += 1;
    const result = await userAPI.getUsers(pageCount.value)
    if (result.status === 200) {
        users.value = result.data;
        loading.value = false;
        console.log(users.value);
    }
}

async function fetchBackData() {
    if (!openCheck()) return;
    await getPageMaxCount();

    if (pageCount.value <= 1) {
       
        return;
    }

    loading.value = true;
    pageCount.value -= 1;
    const result = await userAPI.getUsers(pageCount.value)
    if (result.status === 200) {
        users.value = result.data;
        loading.value = false;
        console.log(users.value);
    }
}

async function fetchEndData() {
    if (!openCheck()) return;
    await getPageMaxCount();
    loading.value = true;
    pageCount.value = pageMaxCount.value
    const result = await userAPI.getUsers(pageCount.value)
    if (result.status === 200) {
        users.value = result.data;
        loading.value = false;
        console.log(users.value);
    }
}

async function getAvatar() {
    const result = await avatarAPI.getCats(100);
    imgs.value = result.data
}

function validCurrentData() {
    let can = true;

    if (currentName.value.trim() === "") {
        can = false;
    }
    if (currentEmail.value.trim() === "") {
        can = false;
    }
    if (currentPassword.value.trim() === "") {
        can = false;
    }

    return can;
}

async function hisEmail() {
    const result = await userAPI.getAllUsers()
    const emailList = result.data.map(user => user.email);
    return emailList.includes(currentEmail.value)
}

function clearCurrent() {
    currentName.value = ""
    currentEmail.value = ""
    currentPassword.value = ""
}

function openCheck() {
    if (isEditOpen.value || isCreateOpen.value) {
        alert("请编辑完当前用户");
        return false;
    }
    return true;
}

function openCreate() {
    if (!openCheck()) return;
    users.value.push({
        name: "",
        email: "",
        password: "",
        edit: true,
    })
    loading.value = false;
    isCreateOpen.value = true;
    isEditOpen.value = true;
}

function closeCreate() {
    isEditOpen.value = false;
    isCreateOpen.value = false;
    fetchData(pageCount.value)
    closeEdit()
}

async function createUser() {
    await getPageMaxCount();

    if (!validCurrentData()) {
        alert("请填写完整")
        return;
    }

    if (await hisEmail()) {
        alert("该邮箱已使用!!!")
        return;
    }

    await userAPI.createUser({
        name: currentName.value,
        email: currentEmail.value,
        password: currentPassword.value
    })

    alert("创建成功")

    closeCreate();
    clearCurrent()
    fetchEndData()
}

async function deleteUser(id) {
    const result = confirm("你确定要删除这个用户吗?")
    if (result) {
       await getPageMaxCount();
        await userAPI.deleteUser(id);
        if (users.value.length === 1) {
            if (pageCount.value > 1) {
                pageCount.value -= 1;
            }
        }
        fetchData(pageCount.value);
        alert("删除成功");
    }
}

function openEdit(id) {
    if (!openCheck()) return;

    const index = users.value.findIndex(u => u._id == id);
    users.value[index].edit = true;
    isEditOpen.value = true;

    currentName.value = users.value[index].name;
    currentEmail.value = users.value[index].email;
    currentPassword.value = users.value[index].password;
}


function closeEdit(id) {
    const index = users.value.findIndex(u => u._id == id);
    users.value[index].edit = false;
    isEditOpen.value = false;
}

async function updateUser(id) {
    await getPageMaxCount();

    const result = await userAPI.updateUser(id, {
        name: currentName.value,
        email: currentEmail.value,
        password: currentPassword.value
    });

    if (result.data != null || result.data != undefined) {
        alert("修改成功")
    }

    closeEdit(id)
    fetchData(pageCount.value)
}


</script>

<template>
    <div>
        <div v-if="loading.value" class="flex space-x-2 justify-center">
            加载中请稍后......
        </div>
        <div v-else-if="!users.length" class="flex space-x-2 justify-center">
            <div class="flex justify-center items-center space-x-1">
                <div class="flex justify-center items-center space-x-1">
                            <span class="text-xl mr-2">这里空空如也</span>
                        </div><button class="btn btn-ghost space-x-2" @click="openCreate()">
                    <PlusCircleIcon class="w-7 h-7" />
                    <div>添加用户</div>
                </button>
                
            </div>
        </div>
        <div v-else class="flex flex-col h-[80vh] space-y-8 justify-center items-center">
            <div class="space-x-2 flex flex-row justify-center ">
                 <div class="overflow-x-auto flex lg:justify-center shadow-2xl border rounded-xl p-8">
                            <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th class="bg-base-100">用户</th>
                                <th class="bg-base-100">邮箱</th>
                                <th class="bg-base-100">密码</th>
                                <th class="bg-base-100" v-if="!isCreateOpen.value">创建时间</th>
                                <th class="bg-base-100">
                                    <button class="btn btn-ghost space-x-2" @click="openCreate()">
                                        <PlusCircleIcon class="w-5 h-5" />
                                        <div>添加</div>
                                    </button>
                                   
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in users" :key="user._id">
                                <td>
                                    <div class="flex items-center">

                                        <!-- name -->
                                        <div v-if="user.edit">
                                            <input type="text" name="name" v-model="currentName"
                                                class="font-bold text-sm input input-bordered input-sm w-full max-w-xs" />
                                        </div>
                                        <div v-else>
                                            <div class="font-bold">{{ user.name }}</div>
                                        </div>
                                    </div>
                                </td>
                                <!-- email -->
                                <td v-if="user.edit">
                                    <input type="text" name="email" v-model="currentEmail"
                                        class="font-bold text-sm input input-bordered input-sm w-full max-w-xs" />
                                </td>
                                <td v-else>
                                    {{ user.email }}
                                </td>
                                <!-- password -->
                                <td v-if="user.edit">
                                    <input type="text" name="password" v-model="currentPassword"
                                        class="font-bold text-sm input input-bordered input-sm w-full max-w-xs" />
                                </td>
                                <td v-else>
                                    {{ user.password }}
                                </td>
                                <!-- createdAt -->
                                <td v-if="user.createdAt">
                                    {{ timeFormatted(user.createdAt) }}
                                </td>
                                <td v-else>
                                    待创建...
                                </td>
                                <th class="space-x-2 ml-4">
                                    <button v-if="!user.edit" class="btn btn-ghost btn-sm"
                                        @click="openEdit(user._id)">编辑用户</button>
                                    <button v-if="!user.edit" class="btn btn-error btn-sm text-white"
                                        @click="() => { if (!openCheck()) return; deleteUser(user._id) }">删除用户</button>
                                    <button v-if="user.edit" class="btn btn-success btn-sm text-white"
                                        @click="isCreateOpen ? createUser() : updateUser(user._id)">{{ isCreateOpen ?
                                            "创建用户" : "保存数据" }}</button>
                                    <button v-if="user.edit" class="btnbtn-ghost btn-sm"
                                        @click="isCreateOpen ? closeCreate() : closeEdit(user._id)">{{ isCreateOpen ? "取消创建"
                                            :
                                            "取消编辑" }}</button>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="fixed bottom-20  join space-x-4 flex justify-center">
                <button :disabled="pageCount > 1 ? null : 'disabled'" class="join-item btn btn-ghost"
                    @click="fetchBackData()">
                    <ChevronLeftIcon class="w-6 h-6" />
                </button>
                <div class="join-item btn btn-ghost font-bold">{{ `${pageCount}` }}</div>
                <button :disabled="pageCount < pageMaxCount ? null : 'disabled'" class="join-item btn-ghost btn"
                    @click="fetchNextData()">
                    <ChevronRightIcon class="w-6 h-6" />
                </button>
            </div>
        </div>
    </div>
</template>