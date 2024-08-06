<template>
  <div ref="root" class="d-flex flex-column gap-2 bg-dark" :class="{ 'p-1': isFullscreen }">
    <div class="row flex-wrap gx-1">
      <Resource v-model="data.resources.MegaCredits" @change="addHistory">
        <template v-slot:icon>
          <img src="./resources/megacredit.png" class="img-fluid">
        </template>
      </Resource>
      <Resource v-model="data.resources.Steel" @change="addHistory">
        <template v-slot:icon>
          <img src="./resources/steel.png" class="img-fluid">
        </template>
      </Resource>
      <Resource v-model="data.resources.Titanium" @change="addHistory">
        <template v-slot:icon>
          <img src="./resources/titanium.png" class="img-fluid">
        </template>
      </Resource>
      <Resource v-model="data.resources.Plants" @change="addHistory">
        <template v-slot:icon>
          <img src="./resources/plant.png" class="img-fluid">
        </template>
      </Resource>
      <Resource v-model="data.resources.Energy" @change="addHistory">
        <template v-slot:icon>
          <img src="./resources/power.png" class="img-fluid">
        </template>
      </Resource>
      <Resource v-model="data.resources.Heat" @change="addHistory">
        <template v-slot:icon>
          <img src="./resources/heat.png" class="img-fluid">
        </template>
      </Resource>
      <Resource v-model="data.TerraformRating" @change="addHistory">
        <template v-slot:icon>
          <img src="./resources/tr.png" class="img-fluid">
        </template>
      </Resource>
    </div>
    <div class="d-flex justify-content-center gap-1">
      <btn class="btn-sm" theme="secondary" @click="toggleFullscreen()">Toggle fullscreen</btn>
      <btn class="btn-sm" theme="secondary" @click="clearLocalStorage()">Clear local storage</btn>
    </div>
    <div>
      <h3>History</h3>
      <data-table class="table-sm" v-model="history" :columns="historyColumns"></data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen, useLocalStorage } from '@vueuse/core'

const initialData = {
  TerraformRating: {
    name: 'TR',
    current: 20,
    color: "linear-gradient(to bottom, #FF7F50, #FF4500)" // Orange
  },
  resources: {
    MegaCredits: {
      name: 'Credits',
      description: "The primary currency used for most actions.",
      current: 0,
      production: 0,
      color: "linear-gradient(to bottom, #FFD700, #FFA500)" // Gold
    },
    Steel: {
      name: 'Steel',
      description: "Used to reduce the cost of building cards with the building tag.",
      conversionRate: "1 Steel = 2 MC",
      current: 0,
      production: 0,
      color: "linear-gradient(to bottom, #B0C4DE, #778899)" // Light Steel Blue
    },
    Titanium: {
      name: 'Titanium',
      description: "Used to reduce the cost of space cards.",
      conversionRate: "1 Titanium = 3 MC",
      current: 0,
      production: 0,
      color: "linear-gradient(to bottom, #708090, #2F4F4F)" // Slate Gray
    },
    Plants: {
      name: 'Plants',
      description: "Accumulated and converted into greenery tiles.",
      current: 0,
      production: 0,
      color: "linear-gradient(to bottom, #32CD32, #228B22)" // Lime Green
    },
    Energy: {
      name: 'Energy',
      description: "Used for various card effects and converted into heat at the end of each generation.",
      conversionRate: "1 Energy = 1 Heat",
      current: 0,
      production: 0,
      color: "linear-gradient(to bottom, #4B0082, #800080)" // Indigo
    },
    Heat: {
      name: 'Heat',
      description: "Used to raise the temperature on Mars.",
      current: 0,
      production: 0,
      color: "linear-gradient(to bottom, #FF7F50, #FF6347)" // Orange Red
    }
  }
}

const data = useLocalStorage('board', window.structuredClone(initialData))

const clearLocalStorage = () => {
  localStorage.clear()
  data.value = window.structuredClone(initialData)
}

const root = ref()
const { toggle: toggleFullscreen, isFullscreen } = useFullscreen(root)

const history = ref([])
const historyColumns = [
  { field: 'name' },
  { field: 'type' },
  { field: 'change' },
  { field: 'resources' },
]
const addHistory = (type: string, change: number, entry: any) => {
  history.value.unshift({
    type,
    change,
    name: entry.name,
    resources: entry.current
  })
}
</script>

<style scoped></style>