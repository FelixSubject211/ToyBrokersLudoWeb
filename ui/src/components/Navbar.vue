<script setup>
import {inject, ref, onMounted} from 'vue';

import Toolbar from 'primevue/toolbar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';


const emitter = inject('emitter')

const saveGames = ref([
  { name: 'New York' },
  { name: 'Rome' },
  { name: 'London' },
  { name: 'Istanbul' },
  { name: 'Paris' }
]);

const searchText = ref('');

const updateSearchText = (event) => {
  searchText.value = event.target.value;
};

const handleUndo  = async () => {
  try {
    const response = await fetch('http://localhost:9000/game/undo', { method: 'PATCH' });
    if (response.ok) {
      emitter.emit('reload game')
      emitter.emit('reload snackbar')
      emitter.emit('reload dice')
    } else {
      throw new Error('Cant undo');
    }
  } catch (error) {
    alert(error);
  }
};

const handleRedo  = async () => {
  try {
    const response = await fetch('http://localhost:9000/game/redo', { method: 'PATCH' });
    if (response.ok) {
      emitter.emit('reload game')
      emitter.emit('reload snackbar')
      emitter.emit('reload dice')
    } else {
      throw new Error('Cant undo');
    }
  } catch (error) {
    alert(error);
  }
};

const saveGame  = async () => {
  try {
    const response = await fetch('http://localhost:9000/game/save/' + searchText.value, { method: 'PATCH' });
    if (response.ok) {
      searchText.value = ''
      await loadSaveGameNames()
    } else {
      throw new Error('Cant save');
    }
  } catch (error) {
    alert(error);
  }
};

const loadSaveGameNames  = async () => {
  try {
    const response = await fetch('http://localhost:9000/game/saveGames');
    if (response.ok) {
      let data = JSON.parse(await response.text())
      saveGames.value = []
      for (let i = 0; i < data.length; i++) {
        saveGames.value.push({ name: data[i] });
      }

    } else {
      throw new Error('Cant save');
    }
  } catch (error) {
    alert(error);
  }
};

const loadGame = async (name) => {
  try {
    const response = await fetch('http://localhost:9000/game/load/' + name.value.name, { method: 'PATCH' });
    if (response.ok) {
      emitter.emit('reload game')
      emitter.emit('reload snackbar')
      emitter.emit('reload dice')
    } else {
      throw new Error('Cant load');
    }
  } catch (error) {
    alert(error);
  }
};

onMounted(loadSaveGameNames);


</script>

<template>
  <Toolbar>
    <template #start>
      <Dropdown :options="saveGames" optionLabel="name" placeholder="Load Game" class="w-full md:w-14rem" @change="loadGame" />
      <span style="padding: 1em">
        <Button @click="handleUndo" label="Undo" class="mr-2"/>
      </span>
      <Button @click="handleRedo" label="Redo" class="mr-2" />
    </template>

    <template #center></template>

    <template #end>
      <span>
            <i class="pi pi-search" />
            <InputText v-model="searchText" placeholder="Name for Savegame" @input="updateSearchText" />
      </span>
      <div style="padding: 1em">
        <Button label="Save" @click="saveGame" />
      </div>
    </template>
  </Toolbar>
</template>
