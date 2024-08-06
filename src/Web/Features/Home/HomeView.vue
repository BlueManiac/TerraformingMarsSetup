<template>
  <div class="d-flex gap-2">
    <div class="col-4">
      <h3>Choose mode</h3>
      <div class="d-flex gap-2 mb-2">
        <radio v-for="item in modes" :value="item.name" v-model="config.mode">{{ item.name }}</radio>
      </div>

      <h3>Players</h3>
      <range min="1" :max="info.maxPlayers" v-model="config.players" />
      {{ config.players }}
      <span v-if="config.players == 1"> (Solo)</span>

      <h3>Choose expansions</h3>
      <div class="d-flex gap-2 mb-2">
        <checkbox v-for="item in expansions" v-model="item.toggle.value">{{ item.name }}</checkbox>
      </div>

      <btn @click="resetConfig" class="mt-2" theme="secondary">Reset</btn>
      <h6>Config</h6>
      {{ config }}
    </div>
    <div class="">
      <template v-if="!isSolo">
        <h6>First player</h6>
        The player who <b>most recently won a game</b> of Terraforming Mars takes the <b>First player marker</b>.
      </template>

      <h6>Starting resources</h6>
      <template v-if="!isCorporateEra">
        Players start with <b>1</b> production of each resource <b>except gold</b>.
        <br />
        Place player markers on <b>1</b> on all resource tracks on the player board.
      </template>
      <template v-else>
        Players start with <b>no</b> extra production of resources.
        <br />
        Place player markers on <b>zero</b> on all resource tracks.
      </template>

      <h6>Starting position</h6>
      <template v-if="!isCorporateEra">
        Place a player marker at the starting position <b>20</b> of the TR track
      </template>
      <template v-else>
        moar
      </template>

      <h6>Starting cards</h6>
      <h6>Starting player</h6>
      <h6>Phases</h6>
      <h6>End game rules</h6>
    </div>
  </div>
</template>

<script setup lang="ts">
import { config, expansions, info, modes, resetConfig } from './data'

const isCorporateEra = computed(() => config.value.mode == 'Corporate Era')
const isSolo = computed(() => config.value.players == 1)
</script>

<style>
h6:not(:first-child) {
  margin-top: calc(var(--bs-gutter-x) / 2)
}

b {
  color: var(--bs-primary)
}
</style>