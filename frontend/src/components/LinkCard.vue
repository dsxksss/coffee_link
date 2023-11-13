<script setup lang="ts">
const props = defineProps({
    linkID:String,
    linkURL:String,
    linkTitle:String,
    linkDescription:String,
    creator:String,
    hidden:Boolean,
    createdAt:String,
    points:Number,
    averageRatingScore:Number,
    totalMembersOfRating:Number,
});
</script>

<template>
    <div class="card w-72 bg-base-100 shadow-xl mr-4 mb-4">
      <figure><img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
      <div class="$$card-body">
        <h2 class="$$card-title">
          {{ linkTitle }}
          <div class="$$badge $$badge-secondary">{{ linkURL }}</div>
        </h2>
        <p>{{ linkDescription }}</p>
        <div class="$$card-actions justify-end">
          <div class="$$badge $$badge-outline">Fashion</div> 
          <div class="$$badge $$badge-outline">Products</div>
        </div>
      </div>
    </div>
</template>