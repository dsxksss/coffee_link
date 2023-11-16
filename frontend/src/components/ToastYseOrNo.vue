<script setup lang="ts">
const emit = defineEmits(['clickYse', 'clickNo'])
defineProps({
    message:String,
})

function clickYse() {
    emit("clickYse");
}

function clickNo() {
    emit("clickNo");
}

</script>

<template>
    <div class="container flex justify-between items-center">
        <span class="mr-5">{{ message }}</span>
        <div class=" space-x-2">
            <button aria-label="close" class="btn btn-ghost btn-sm" @click.stop="clickYse()">Yes</button>
            <button aria-label="close" class="btn btn-ghost btn-sm" @click.stop="clickNo()">No</button>
        </div>
    </div>
</template>