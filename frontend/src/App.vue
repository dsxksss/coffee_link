<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useToast } from "vue-toastification";

// Get toast interface
const toast = useToast();

function showToast() {
  toast("I'm a toast!")
}

</script>

<template>
  <div>
    <font-awesome-icon icon="fa-solid fa-user-secret" />
    <Button @click="showToast">Click me</Button>
  </div>
</template>