<script setup lang="ts">
import favoritesAPI from '../api/favorites';
import { useToast } from "vue-toastification";
import { inject, onMounted, ref, watch } from 'vue';
import { extractDateTime } from '../utils/extractDateTime';
import { Link } from '../interfaces/link';

const props = defineProps({
  link: Link,
  points: Number,
  averageRatingScore: String,
  totalMembersOfRating: String,
});

const emit = defineEmits(['openDailogEmit']);

const toast = useToast();
const favorites = inject('favorites', ref([]));
const [auth, _] = inject('auth', ref<any>([]));
const isFavorite = ref(false);

function updateIsFavorite() {
  isFavorite.value = favorites.value.find((favorite: any) => favorite.linkID == props.link!.linkID) ? true : false;
}

watch(favorites, updateIsFavorite);

onMounted(() => {
  updateIsFavorite();
  setTimeout(updateIsFavorite, 500)
})


// import imageData from "../api/imageData";
// function getRandomImage() {
//   const randomIndex = Math.floor(Math.random() * imageData.length);
//   return imageData[randomIndex];
// }

async function addFavorite() {
  const result = await favoritesAPI.addFavorite(props.link!.linkID);
  const objData = JSON.parse(result.data);
  const data = objData.data;
  const msg = objData.msg;

  if (result.status != 200) {
    return toast.error(msg);
  }

  favorites.value = data;
  isFavorite.value = true;
}

async function deleteFavorite() {
  const result = await favoritesAPI.deleteFavorite(props.link!.linkID);
  const objData = JSON.parse(result.data);
  const data = objData.data;
  const msg = objData.msg;

  if (result.status != 200) {
    return toast.error(msg);
  }

  favorites.value = data;
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

    <div @click="emit('openDailogEmit', link!.linkID)" class="cursor-pointer relative w-full h-[50%]">
      <span class="absolute top-3 right-3 space-x-1">
        <font-awesome-icon icon="fa-solid fa-star"
          :class="`w-5 h-5 ${parseFloat(averageRatingScore!) <= 0.0 ? ' text-gray-400' : 'text-orange-400'}`" />
        <span class="text-[20px]">{{ parseFloat(averageRatingScore!) <= 0.0 ? null : averageRatingScore }}</span>
        </span>

        <div class="px-4 pt-3">
          <p class="w-32 truncate font-bold text-xl text-[#fff0dd]">{{ link!.linkTitle }}</p>
        </div>

        <div class="text-ellipsis overflow-hidden px-4 pt-2">
          <p class="text truncate break-all text-gray-500">{{ link!.linkDescription }}</p>
        </div>

        <div class="text-ellipsis px-4 pt-2">
          <span class=" truncate badge badge-success text-white">{{
            `${link!.creator.substring(0, 10)}${link!.creator.length > 10 ? '...' : ''}` }}</span>
        </div>

        <div class="absolute bottom-3 left-5">
          <font-awesome-icon icon="fa-solid fa-fire" />
          {{ points }}
        </div>

        <div class="absolute bottom-3 right-3">
          <span class="truncate text-sm text-gray-500">{{ extractDateTime(link!.createdAt) }}</span>
        </div>
    </div>

  </div>
</template>