import { useLocalStorage } from '@vueuse/core'
import { Ref } from 'vue'

export const modes = [{
  name: 'Default'
}, {
  name: 'Corporate Era'
}]

export const expansions: { name: string, toggle?: Ref<boolean> }[] = [{
  name: 'Turmoil'
}]

export const info = {
  maxPlayers: 6
}

const defaultConfig = {
  mode: modes[1].name,
  expansions: [],
  players: 2
}

export const config = useLocalStorage('config', defaultConfig)

export const resetConfig = () => {
  config.value = defaultConfig
}

for (const x of expansions) {
  x.toggle = computed({
    get() {
      return config.value.expansions.includes(x.name)
    },
    set(value) {
      if (value) {
        config.value.expansions.push(x.name)
      }
      else {
        config.value.expansions = config.value.expansions.filter(e => e != x.name)
      }
    }
  })
}