<script lang="ts">
import { GET_LATEST_GAMES_LIST } from '../store/types';

export default {
    methods: {
        joinGame(game: any) {
            this.$router.push({
                name: 'game',
                params: {
                    uuid: game.uuid
                }
            });
        },
        playersInGame(game: any) {
            return 0 + ( game.player1? 1: 0) + ( game.player2? 1: 0);
        },
        gameStatus(status: string) {
            if(status === "created") return "Open"; 
            if(status === "running") return "In progress";
            return "Completed"; 
        }
    },
    computed: {
        games() {
            return (this as any).$store.state.games;
        }
    },
    mounted: function() {
        (this as any).$store.dispatch(GET_LATEST_GAMES_LIST);
    }
}
</script>

<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">
                    Name
                </th>
                <th class="text-left w-15">
                    Status
                </th>
                <th class="text-left w-15">
                    Player in
                </th>
                <th class="text-left w-15">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="game in (games as any[])" :key="game.name">
                <td>{{ game.name }}</td>
                <td>{{ gameStatus(game.status) }}</td>
                <td >{{ playersInGame(game) }}</td>
                <td>
                    <v-btn color="blue-darken-4" @click="joinGame(game)" :disabled="playersInGame(game) === 2">Join</v-btn>
                </td>
            </tr>
            <div v-if="games.length == 0">No game is available.</div>
        </tbody>
    </v-table>
</template>

<style scoped>
.w-15 {
    width: 15%;
}
</style>
