<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import { inject } from 'vue'

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
  <div>
    {{ snackbarResult }}
  </div>
</template>
