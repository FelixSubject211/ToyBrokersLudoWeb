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

const handleTokenClick  = async (token: Token) => {
  try {
    const response = await fetch('http://localhost:9000/game/possibleMoves');
    if (response.ok) {
      let responseJson: [string] = await response.json()
      let index = responseJson.findIndex(item => item === token.color + token.number )
      if (index !== -1) {
        await doMove(index)
      } else {
        throw new Error('Illegal move');
      }
    } else {
      throw new Error('Cant move');
    }
  } catch (error) {
    alert(error);
  }
};

const doMove = async (index) => {
  try {
    const response = await fetch('http://localhost:9000/game/move/' + index, { method: 'PATCH' });
    if (response.ok) {
      emitter.emit('reload game')
    } else {
      throw new Error('Cant move');
    }
  } catch (error) {
    alert(error);
  }
};

const model = ref<Stone[][]>();

onMounted(() => {
  reloadGame()
  emitter.on('reload game', reloadGame)
});

</script>


<template>
  <table class="game-table">
    <tbody>
    <tr v-for="(row, rowIndex) in model" :key="rowIndex">
      <td v-for="(stone, stoneIndex) in row" :key="stoneIndex" class="stone">
        <p v-if="stone.isAPlayField">
          <p v-if="stone.token != null" @click="handleTokenClick(stone.token)">
            <p v-if="stone.token.color == 'G'"><div class="token green-player">{{stone.token.number}}</div></p>
            <p v-else-if="stone.token.color == 'R'"><div class="token red-player">{{stone.token.number}}</div></p>
            <p v-else-if="stone.token.color == 'B'"><div class="token blue-player">{{stone.token.number}}</div></p>
            <p v-else-if="stone.token.color == 'Y'"><div class="token yellow-player">{{stone.token.number}}</div></p>
          </p>
          <p v-else>
            <p v-if="[70, 71, 72, 73].indexOf(stone.index) != -1"><div class="token green-end-field"></div></p>
            <p v-else-if="[74, 75, 76, 77].indexOf(stone.index) != -1"><div class="token red-end-field"></div></p>
            <p v-else-if="[78, 79, 80, 81].indexOf(stone.index) != -1"><div class="token blue-end-field"></div></p>
            <p v-else-if="[82, 83, 84, 85].indexOf(stone.index) != -1"><div class="token yellow-end-field"></div></p>
            <p v-else><div class="token empty-field"></div></p>
          </p>
        </p>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>

.game-table {
  padding: 1em;
  animation: gradientBG 15s ease infinite;
  border-radius: 20px;
  background: linear-gradient(45deg, orange, moccasin);
  background-size: 150% 150%;
}

.token {
  height: 5.5vh;
  width: 5.5vh;
  text-align: center;
  font-weight: bold;
  user-select: none;
  border-radius: 3em;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 5.5vh;
}

.green-player {
  background-color: green;
}

.green-end-field {
  background-color: green;
}

.red-player {
  background-color: red;
}

.red-end-field {
  background-color: red;
}

.blue-player {
  background-color: blue;
}

.blue-end-field {
  background-color: blue;
}

.yellow-player {
  background-color: yellow;
}

.yellow-end-field {
  background-color: yellow;
}

.green-player:hover,
.red-player:hover,
.blue-player:hover,
.yellow-player:hover {
  border-radius: 0.75em;
}

.empty-field {
  background-color: darkgray;
}

</style>

