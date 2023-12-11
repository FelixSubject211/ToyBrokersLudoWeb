<script setup>
import Dice from './components/Dice.vue'
import Snackbar from './components/Snackbar.vue'
import GameBorad from "@/components/GameBorad.vue";
import Navbar from "@/components/Navbar.vue";
</script>
<template>
  <header>

    <div class="wrapper">
      <GameBorad />
    </div>
  </header>

  <main>
    <div style="padding: 1em">
      <Navbar />
    </div>
    <div style="padding: 1em">
      <Snackbar />
    </div>
    <div style="padding: 1em">
      <Dice />
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
