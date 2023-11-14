<script setup lang="ts">
// import { useToast } from "vue-toastification";
// const toast = useToast();
import Nav from '../components/Nav.vue';
import LinkCard from '../components/LinkCard.vue';
import linkApi from '../api/links';
import { onMounted, ref, provide } from 'vue';
import { useToast } from "vue-toastification";
import { Link } from '../interfaces/link';
import { bayesianRating } from '../utils/bayesian';
import { checkAuthToken } from '../utils/checkAuth';
import favoritesAPI from '../api/favorites';

const toast = useToast();
const links = ref([]);

const auth = ref(false);
const favorites = ref([]);
provide('favorites', favorites);
provide('auth', {auth, authStatusUpdate });

async function fetchCoffeeLinksData() {
    const result = await linkApi.getAllCoffeeLinks();
    const objData = JSON.parse(result.data);
    const data = objData.data;
    const msg = objData.msg;

    if (result.status != 200) {
        return toast.error(msg);
    }

    links.value = data;
}

async function fetchMemberFavoritesData() {
    const result = await favoritesAPI.getMemberFavorites();
    const objData = JSON.parse(result.data);
    const data = objData.data as Array<never>;
    const msg = objData.msg;

    if (result.status != 200) {
        return toast.error(msg);
    }
    favorites.value = data;
}


(async () => {
    await fetchMemberFavoritesData();
})()


function sortLinks(links: Array<any>): void {
    links.sort((a, b) => {
        const aBayesian = calculateBayesianRating(a);
        const bBayesian = calculateBayesianRating(b);
        return bBayesian - aBayesian;
    });
}

function calculateBayesianRating(link: any): number {
    const { averageRatingScore, totalMembersOfRating, globalAverageRating, totalRatingMembers } = link;
    return bayesianRating({
        averageRatingScore,
        totalMembersOfRating,
        globalAverageRating,
        totalRatingMembers,
    });
}

function authStatusUpdate() {
    auth.value = checkAuthToken();
}


onMounted(async () => {
    authStatusUpdate();
    await fetchCoffeeLinksData();
    sortLinks(links.value);
})

</script>

<template>
    <main class="flex flex-col justify-start items-start h-screen w-screen bg-[#121419] overflow-hidden">
        <Nav @authUpdate="authStatusUpdate"></Nav>
        <div v-if="links.length > 0"
            class="px-8 pt-8 grid lg:grid-cols-3 xl:grid-cols-4 w-screen sm:grid-cols-2 h-full grid-cols-1 justify-start 2xl:justify-items-center overflow-y-scroll scroll-smooth">
            <LinkCard v-for="link in links" :key="link['linkID']" :link="new Link({
                linkID: link['linkID'],
                linkURL: link['linkURL'],
                linkTitle: link['linkTitle'],
                linkDescription: link['linkDescription'],
                creator: link['creator'],
                hidden: link['hidden'],
                createdAt: link['createdAt']
            })" :points="link['points']" :averageRatingScore="link['averageRatingScore']"
                :totalMembersOfRating="link['totalMembersOfRating']">
            </LinkCard>
        </div>
        <div v-else class="
        w-screen flex justify-center pt-52 text-4xl text-[#fff0dd]">
            There is no coffee link here, please add it
        </div>

        <button class="fixed bottom-10 right-10 bg-base-100 btn btn-circle btn-ghost btn-lg">
            <font-awesome-icon icon="fa-solid fa-pencil" class="w-8 h-8 text-orange-400" />
        </button>
    </main>
</template>