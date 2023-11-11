<script setup lang="ts">
import {
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogContent,
} from 'radix-vue'

import { ref } from "vue"

const loginDialogOpen = ref(false);
</script>

<template>
    <div class="flex w-screen justify-between items-center h-20 mx-8 text-[#fff0dd]">
        <div class="space-x-2">
            <font-awesome-icon icon="fa-solid fa-mug-hot" class="h-6 w-6" />
            <span class="text-xl font-bold">Coffee Links</span>
        </div>
        
        <div class="space-x-4 flex items-center">
            <DialogRoot :open="loginDialogOpen">
                <button @click="()=>{loginDialogOpen = true}" class="flex items-center space-x-2 bg-[#1a1d24] rounded-lg px-6 py-2">
                    <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="h-4 w-4" />
                    <span class="text-[11px] font-bold">Log In</span>
                </button>
                <DialogPortal>
                    <DialogOverlay @click="() => { loginDialogOpen = false }" class="z-10 bg-gray-800/50 data-[state=open]:animate-overlayShow fixed inset-0">
                        <DialogContent class="z-20 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                            <h1>i am dialog</h1>
                        </DialogContent>
                    </DialogOverlay>
                </DialogPortal>
            </DialogRoot>

            <button class="flex items-center space-x-2 bg-[#3dafa5] rounded-lg px-6 py-2">
                <font-awesome-icon icon="fa-solid fa-door-open" class="h-4 w-4" />
                <span class="text-[11px] font-bold">Sign Up</span>
            </button>
            
            <button class="flex items-center space-x-2 border-[2px] border-[#242427] rounded-lg px-2 py-2">
                <font-awesome-icon icon="fa-solid fa-disease" class="h-4 w-4" />
            </button>
        </div>
    </div>
</template>