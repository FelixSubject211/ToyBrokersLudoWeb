<script setup>
import { onMounted, ref } from 'vue';
import { inject } from 'vue'
import Card from 'primevue/card';
import 'primevue/resources/themes/lara-dark-blue/theme.css'



const emitter = inject('emitter')

const snackbarResult = ref('game start');

const reloadSnackbar = async () => {
  try {
    const response = await fetch('http://localhost:9000/game/reloadSnackbar');
    if (response.ok) {
      const data = await response.json();
      snackbarResult.value = data;
    } else {
      throw new Error('Fehler beim Laden der Snackbar');
    }
  } catch (error) {
    alert(error);
  }
};

onMounted(() => {
  reloadSnackbar()
  emitter.on('reload snackbar', reloadSnackbar)
});

</script>

<template>
  <Card>
    <template #title></template>
    <template #content>
      <p class="m-0">
        {{ snackbarResult }}
      </p>
    </template>
  </Card>
</template>
