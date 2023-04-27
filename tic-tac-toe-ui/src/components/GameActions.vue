<script lang="ts">
export default {
  props: ["status"],
  methods: {
    goToHome() {
      this.$router.push(`/`);
    }
  }
}
</script>

<template>
  <div class="text-center">
    <v-btn color="primary" v-if="status === 'running'" @click="$emit('requestBack')">
      &lt; Request one step back
    </v-btn>
    <v-btn color="primary" v-if="status !== 'running'" @click="goToHome()">Go to Home</v-btn>
  </div>
</template>

<style scoped></style>
