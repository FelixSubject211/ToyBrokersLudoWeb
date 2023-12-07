<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import { inject } from 'vue'

const emitter = inject('emitter')

const diceResult = ref(6);

const reloadDice = async () => {
  try {
    const response = await fetch('http://localhost:9000/game/reloadDice');
    if (response.ok) {
      const data = await response.json();
      diceResult.value = data;
    } else {
      throw new Error('Fehler beim Laden des Würfelergebnisses');
    }
  } catch (error) {
    alert(error);
  }
};

const rollDice = async () => {
  try {
    const response = await fetch('http://localhost:9000/game/dice', { method: 'PATCH' });
    if (response.ok) {
      setTimeout(() => {
        diceResult.value = Math.floor(Math.random() * 6) + 1
      }, 100);

      setTimeout(() => {
        diceResult.value = Math.floor(Math.random() * 6) + 1
      }, 150);

      setTimeout(() => {
        diceResult.value = Math.floor(Math.random() * 6) + 1
      }, 300);

      setTimeout(() => {
        emitter.emit('reload dice');
      }, 500);
    } else {
      alert('You cant dice now')
    }
  } catch (error) {
    alert(error);
  }
};

onMounted(() => {
  reloadDice()
  emitter.on('reload dice', reloadDice)
});

</script>

<template>
  <div>
    <div @click="rollDice">
      <div v-if="diceResult === 1">
        <div class="dice first-face">
          <span class="dot"></span>
        </div>
      </div>
      <div v-else-if="diceResult === 2">
        <div class="dice second-face">
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
      <div v-else-if="diceResult === 3">
        <div class="dice third-face">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
      <div v-else-if="diceResult === 4">
        <div class="dice fourth-face">
          <div class="column">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="column">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
      <div v-else-if="diceResult === 5">
        <div class="dice fifth-face">
          <div class="column">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="column">
            <span class="dot"></span>
          </div>
          <div class="column">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
      <div v-else-if="diceResult === 6">
        <div class="dice sixth-face">
          <div class="column">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="column">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.dice {
  padding: 4px;
  background-color: tomato;
  width: 4em;
  height: 4em;
  border-radius: 10%;
  margin-right : 2em;
  transition: transform 0.1s ease-in-out;
}
.dot{
  display: block;
  width: 0.9em;
  height: 0.9em;
  border-radius: 50%;
  background-color:white;
}

.dice:hover {
  animation: toggle 0.5s ease-in-out;
}

.first-face {
  display: flex;
  justify-content: center;
  align-items: center;
}

.second-face{
  display: flex ;
  justify-content: space-between;
}

.second-face .dot:nth-of-type(2) {
  align-self: flex-end;
}

.third-face {
  display: flex;
  justify-content: space-between;
}

.third-face .dot:nth-of-type(1) {
  align-self :flex-end;
}

.third-face .dot:nth-of-type(2) {
  align-self :center;
}


.fourth-face , .sixth-face, .fifth-face{
  display: flex;
  justify-content: space-between;
}

.fourth-face .column , .sixth-face .column, .fifth-face .column{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.fifth-face .column:nth-of-type(2) {
  justify-content: center;
}
</style>

