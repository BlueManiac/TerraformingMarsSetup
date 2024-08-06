<template>
  <div class="col-md-4 col-xl-3">
    <div class="mb-1">
      <span class="icon">
        <slot name="icon"></slot>
      </span>
      {{ modelValue?.name }}
    </div>
    <div class="card">
      <div class="card-body d-flex flex-column gap-1 p-1">
        <div class="d-flex gap-1">
          <div class="current bg-dark text-center rounded" v-if="modelValue?.current !== undefined">
            <span class="fw-bold">{{ modelValue.current }}</span>
            <div class="note rounded-bottom">{{ modelValue?.name }}</div>
          </div>
          <btn theme="danger" @click="changeResources(-1)">-1</btn>
          <btn theme="success" @click="changeResources(1)">+1</btn>
          <btn theme="danger" @click="changeResources(-5)">-5</btn>
          <btn theme="success" @click="changeResources(5)">+5</btn>
          <btn theme="danger" @click="changeResources(-10)">-10</btn>
          <btn theme="success" @click="changeResources(10)">+10</btn>
        </div>
        <div class="d-flex gap-1" v-if="modelValue?.production !== undefined">
          <div class="production bg-dark text-center rounded">
            <span class="fw-bold">{{ productionText }}</span>
            <div class="note rounded-bottom">Production</div>
          </div>
          <btn theme="danger" @click="changeProduction(-1)">-1</btn>
          <btn theme="success" @click="changeProduction(1)">+1</btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<any>()
const emit = defineEmits<{
  change: [type: string, change: number, entry: object]
}>()

const productionText = computed(() => {
  if (modelValue.value.production > 0)
    return "+" + modelValue.value.production

  return modelValue.value.production
})

const changeResources = (change: number) => {
  modelValue.value.current += change
  emit('change', 'resources', change, modelValue.value)
}
const changeProduction = (change: number) => {
  modelValue.value.production += change
  emit('change', 'production', change, modelValue.value)
}

const backgroundColor = computed(() => modelValue.value?.color)
</script>

<style scoped>
.icon :deep(img) {
  max-height: 20px;
}

.card {
  background: v-bind(backgroundColor);
}

.production,
.current {
  width: 50px;

  .note {
    font-size: 0.5rem;
  }
}

:deep(button) {
  font-weight: bold;
  width: 40px;
  padding: 0.3rem 0.1rem;
}
</style>