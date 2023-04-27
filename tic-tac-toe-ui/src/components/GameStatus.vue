<script lang="ts">
export default {
  props: ["game", "player"],
  data() {
    return {
      countdown: 0,
      interval: 0
    };
  },
  updated() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.countdown = 10 - Math.round((Date.now() - this.game.lastActivity)/1000);
      if(this.countdown < 0 || this.game.status === 'completed') {
        this.countdown = 0;
        clearInterval(this.interval);
      }
    }, 1000);
  },
  methods: {
    nextMove() {
      if(this.game.status === 'completed') return "None";
      const stateLength = this.game.state.length;
      const sign = (stateLength % 2 === 0? "X": "O");
      const signAndPlayer = sign + (sign === this.player.sign? " (You)": " (Oponent)");
      return signAndPlayer;
    },
    winningPlayer() {
      if(this.game.win === "O") return "Player O won."
      if(this.game.win === "X") return "Player X won."
      return "Draw.";
    }
  }
}
</script>

<template>
  <div class="m-5">
    <v-card class="card">
            <v-card-text class="fill-height">
              <h2>Next move: {{ nextMove() }}</h2>
              <h2>Next move in {{ countdown }}s</h2>
              <h2 v-if="game.status === 'completed'">Game end: {{ winningPlayer() }}</h2>
            </v-card-text>
        </v-card>
  </div>
</template>

<style scoped>
.card {
  min-height: 100px;
}
.m-5 {
    margin: 20px;
}
</style>
