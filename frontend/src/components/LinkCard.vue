<script setup lang="ts">
import { Link } from '../interfaces/Link'

const props = defineProps({
  link: Link,
  points: Number,
  averageRatingScore: Number,
  totalMembersOfRating: Number,
});

const a = 21.2131;

// import imageData from "../api/imageData";
// function getRandomImage() {
//   const randomIndex = Math.floor(Math.random() * imageData.length);
//   return imageData[randomIndex];
// }

</script>

<template>
  <div class="relative card w-60 bg-base-100 shadow-xl h-80 mr-4 mb-4 flex flex-col">
    <figure>
      <img class="w-full h-44 object-cover"
        src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Linea_doubleespresso.jpg" alt="Shoes" /></figure>

    <div class="absolute w-full h-44 right-0 opacity-0 hover:opacity-100 duration-200 transition-all">
      <button class="btn bg-gray-700 hover:bg-slate-600 btn-ghost btn-circle absolute top-1 right-1">
        <font-awesome-icon icon="fa-heart" class="h-5 w-5" />
      </button>
      <button class="btn bg-gray-700 hover:bg-slate-600 btn-ghost btn-circle absolute top-14 right-1">
        <font-awesome-icon icon="fa-disease" class="h-5 w-5" />
      </button>
    </div>

    <div class="relative w-full h-[40%] ">
      <span class="absolute top-2 right-2 space-x-1">
        <span class="text-[20px]">{{ averageRatingScore }}</span>
        <font-awesome-icon icon="fa-solid fa-star" class="w-5 h-5 text-orange-400" />
      </span>

      <div class="relative w-40 overflow-hidden text-ellipsis p-2">
        <span class="font-bold text-xl  ">{{ props.link.linkTitle }}</span>
      </div>

    </div>



  </div>
</template>