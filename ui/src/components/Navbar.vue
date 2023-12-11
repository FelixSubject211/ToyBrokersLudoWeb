<script setup>
import { ref } from 'vue';

import Toolbar from 'primevue/toolbar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';



const selectedCity = ref();
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
]);
</script>

<template>
  <Toolbar>
    <template #start>
      <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City" class="w-full md:w-14rem" />
      <span style="padding: 1em">
        <Button label="Undo" class="mr-2" />
      </span>
      <Button label="Redo" class="mr-2" />
    </template>

    <template #center></template>

    <template #end>
      <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText placeholder="Search" />
      </span>
      <div style="padding: 1em">
        <Button label="Submit" />
      </div>
    </template>
  </Toolbar>
</template>
