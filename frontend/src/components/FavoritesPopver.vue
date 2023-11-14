<script setup lang="ts">

import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { inject, ref } from 'vue';
import { useToast } from "vue-toastification";
import favoritesAPI from '../api/favorites';

const emit = defineEmits(['onClose', 'onSubmitSuccess'])

const toast = useToast();
const favorites = inject('favorites', ref([]));


async function deleteFavorite(linkID: string) {
  const result = await favoritesAPI.deleteFavorite(linkID);
  const objData = JSON.parse(result.data);
  const data = objData.data;
  const msg = objData.msg;

  if (result.status != 200) {
    return toast.error(msg);
  }

  favorites.value = data;
}

</script>

<template>
  <PopoverRoot>
    <PopoverTrigger aria-label="Update dimensions">
      <slot></slot>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent side="bottom" :side-offset="10" :align-offset="-20" align="end"
        class="rounded-lg p-5 overflow-hidden text-ellipsis w-[400px] bg-base-100 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade">
        <div class="flex flex-col gap-2.5">
          <p class="text-mauve12 text-[20px] leading-[19px] font-semibold">
            Favorites
          </p>
          <div v-if="favorites.length > 0" v-for="favorite in favorites"
            class="flex justify-between p-4 mt-5 hover:bg-base-300 transition-all duration-200 rounded-xl">
            <div class="flex flex-col justify-between">
              <p class="w-40 overflow-hidden text-ellipsis text-xl">{{ favorite['linkTitle'] }}</p>
              <p>{{ favorite['creator'] }}</p>
            </div>
            <button @click="deleteFavorite(favorite['linkID'])" class="btn btn-circle btn-ghost">
              <font-awesome-icon icon="fa-solid fa-heart-crack" class="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>