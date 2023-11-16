<script setup lang="ts">

import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { inject, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { extractDateTime } from '../utils/extractDateTime';
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
        class="rounded-lg p-5 overflow-auto scroll-smooth max-h-[50vh] h-auto w-max-[400px] bg-base-100 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade">
        <div class="overflow-auto scroll-smooth">
          <p class="text-[20px] leading-[19px] font-semibold">
            Favorites
          </p>

          <div v-if="favorites.length > 0" v-for="favorite in favorites"
            class="flex relative justify-between px-4 py-5 mt-10 hover:bg-base-300 transition-all duration-200 rounded-xl">
            <div class="flex flex-col justify-betwee w-40 overflow-hidden">
              <div class="w-40 overflow-hidden text-ellipsis text-lg"> {{ favorite['linkTitle'] }}</div>
              <div class="overflow-hidden text-ellipsis text-gray-500"> {{ extractDateTime(favorite['createdAt']) }}
              </div>
            </div>
            <div
              class="absolute -top-3 right-0 bg-orange-500 rounded-full w-full overflow-hidden px-3 text-white flex justify-between items-center">
              <div class="w-20 overflow-hidden text-ellipsis"> {{ favorite['creator'] }} </div>
              <div>
                <font-awesome-icon icon="fa-solid fa-fire" />
                {{ favorite['points'] }}
              </div>
            </div>
            <button @click="deleteFavorite(favorite['linkID'])" class="btn btn-circle btn-ghost mt-2">
              <font-awesome-icon icon="fa-solid fa-heart-crack" class="w-5 h-5 text-red-400" />
            </button>
          </div>

          <div v-else>
            Empty ...
            <font-awesome-icon icon="fa-solid fa-link-slash" />
          </div>

        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>