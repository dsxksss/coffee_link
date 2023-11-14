<script setup lang="ts">
import favoritesAPI from '../api/favorites';
import { useToast } from "vue-toastification";
import { onMounted, ref } from 'vue';
import { Link } from '../interfaces/Link';

const props = defineProps({
  link: Link,
  points: Number,
  auth: Boolean,
  averageRatingScore: String,
  totalMembersOfRating: String,
});

const toast = useToast();
const isFavorite = ref(false);

onMounted(async () => {
  await fetchData();
})

async function fetchData() {
  if (props.auth) {
    const result = await favoritesAPI.getMemberFavorites();
    const objData = JSON.parse(result.data);
    const data = objData.data;
    if (result.status == 200) {
      const exist = data.find((favorite: any) => favorite.linkID == props.link?.linkID) ? true : false;
      isFavorite.value = exist;
    }
  }
}

// import imageData from "../api/imageData";
// function getRandomImage() {
//   const randomIndex = Math.floor(Math.random() * imageData.length);
//   return imageData[randomIndex];
// }

async function addFavorite() {
  const result = await favoritesAPI.addFavorite(props.link!.linkID);
  const objData = JSON.parse(result.data);
  const msg = objData.msg;

  if (result.status != 200) {
    return toast.error(msg);
  }

  isFavorite.value = true;
}

async function deleteFavorite() {
  const result = await favoritesAPI.deleteFavorite(props.link!.linkID);
  const objData = JSON.parse(result.data);
  const msg = objData.msg;

  if (result.status != 200) {
    return toast.error(msg);
  }

  isFavorite.value = false;
}

async function handleFavorites() {
  if (!isFavorite.value) {
    await addFavorite();
  } else {
    await deleteFavorite();
  }
}

</script>

<template>
  <div class="relative card w-60 bg-base-100 shadow-xl h-80 mr-4 mb-4 flex flex-col">
    <figure>
      <img class="w-full h-44 object-cover"
        src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Linea_doubleespresso.jpg" alt="Shoes" />
    </figure>

    <div v-if="auth" class="absolute w-full h-44 right-0 opacity-0 hover:opacity-100 duration-200 transition-all">
      <button @click="handleFavorites"
        class="btn bg-gray-700 hover:bg-slate-600 btn-ghost btn-circle absolute top-1 right-1">
        <font-awesome-icon icon="fa-disease" :class="`h-5 w-5 ${isFavorite ? 'text-orange-300' : null}`" />
      </button>
    </div>

    <div class="relative w-full h-[40%] ">
      <span class="absolute top-2 right-2 space-x-1">
        <span class="text-[20px]">{{ parseFloat(averageRatingScore!) <= 0.0 ? '' : averageRatingScore }}</span>
            <font-awesome-icon icon="fa-solid fa-star"
              :class="`w-5 h-5 ${parseFloat(averageRatingScore!) <= 0.0 ? ' text-gray-400' : 'text-orange-400'}`" />
        </span>

        <div class="relative w-40 overflow-hidden text-ellipsis p-2">
          <span class="font-bold text-xl  ">{{ link!.linkTitle }}</span>
        </div>
    </div>

  </div>
</template>