<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <abc />

      <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/game">Game</RouterLink>
        </nav>
      </div>
    </header> -->


  <div class="card-main">
    <RouterView />
  </div>
</template>

<style scoped>
.card-main {
  margin: 30px;
}
</style>
