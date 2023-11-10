<script setup>
const emit = defineEmits(['clickYse', 'clickNo'])

function clickYse() {
    emit("clickYse");
}

function clickNo() {
    emit("clickNo");
}
</script>

<template>
    <div class="container">
        <span class="mr-5">你确定要删除这个博客吗?</span>
        <button aria-label="close" class="btn btn-ghost btn-sm" @click.stop="clickYse()">确定</button>
        <button aria-label="close" class="btn btn-ghost btn-sm" @click.stop="clickNo()">取消</button>
    </div>
</template>
