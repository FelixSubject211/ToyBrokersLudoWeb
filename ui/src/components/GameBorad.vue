<script setup lang="ts">
import { onMounted, ref} from 'vue';
import { inject } from 'vue'

const emitter = inject('emitter')

interface Token {
  color: string
  number: string
}

interface Stone {
  isAPlayField: boolean
  token: Token | null
  index: number
}

const stone1: Stone = {
  isAPlayField: true,
  token: null,
  index: 1
};

const stone2: Stone = {
  isAPlayField: false,
  token: null,
  index: 2
};


const reloadGame = async () => {
  try {
    const response = await fetch('http://localhost:9000/game/reloadGame');
    if (response.ok) {
      const data = await response.text();
      model.value = JSON.parse(data)
    } else {
      throw new Error('Cant reload game field');
    }
  } catch (error) {
    alert(error);
  }
};

const model = ref<Stone[][]>(
    [[stone1, stone2]]
);

onMounted(() => {
  reloadGame()
  emitter.on('reload game', reloadGame)
});

</script>

<template>
  <table>
    <tbody>
    <tr v-for="(row, rowIndex) in model" :key="rowIndex">
      <td v-for="(stone, stoneIndex) in row" :key="stoneIndex" class="stone">
        <p v-if="stone.isAPlayField">
          {{ stone.token ? `Token Color: ${stone.token.color}, Number: ${stone.token.number}` : 'No token' }}
        </p>
        <p v-else>
          `<div class="token empty-field"></div>`
        </p>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>

</style>

