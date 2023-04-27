<script setup lang="ts">
import CreateGame from "@/components/CreateGame.vue";
import GamesList from "@/components/GamesList.vue";
</script>

<template>
  <div class="d-flex align-center flex-column">
    <v-card class="cards" title="Create a new game">
      <v-card-text>
        <CreateGame />
      </v-card-text>
    </v-card>
    <v-card class="cards" title="Games list">
      <v-card-text>
        <GamesList />
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.cards {
  margin: 30px;
  width: 900px;
}
</style>