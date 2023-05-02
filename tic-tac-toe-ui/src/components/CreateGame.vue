<script lang="ts">
import { GET_LATEST_GAMES_LIST } from '../store/types';

export default {
    data: function() {
        return {
            gameName: "",
        }
    },
    methods: {
        async createGame() {
            const gameName = this.gameName;
            const data = { gameName };
            const req = await fetch("http://localhost:8000/games", {
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                method: "POST",
            });
            const ret = await req.json();
            console.log(ret);
            this.gameName = "";
            (this as any).$store.dispatch(GET_LATEST_GAMES_LIST);
        }
    }
}
</script>

<template>
    <div>
        <p class="mtb-20">
            Please provide a name for the game and click on the create botton to create a new game.
            After creating a new game it should be available in the game list.
        </p>
        <v-text-field class="mtb-20" label="Game Name" v-model="gameName"></v-text-field>
        <v-btn color="blue-darken-4" block @click="createGame">Create Game</v-btn>
    </div>
</template>

<style scoped>
.mtb-20 {
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>
