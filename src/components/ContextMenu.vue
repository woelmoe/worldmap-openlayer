<template>
  <div class="ContextMenu" :style="style" v-show="isVisible" @click="clear">
    Clear
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue'

interface IEmit {
  (e: 'clear'): void
}
const emit = defineEmits<IEmit>()
const style = ref({})
const isVisible = ref(false)
function setPosition(e: MouseEvent): void {
  isVisible.value = true
  e.preventDefault()
  style.value = {
    left: e.clientX + 'px',
    top: e.clientY + 'px'
  }
}
function clear() {
  if (!isVisible.value) return
  emit('clear')
  setTimeout(() => {
    isVisible.value = false
  })
}
addEventListener('contextmenu', setPosition, false)
addEventListener('click', clear, false)

onUnmounted(() => {
  removeEventListener('contextmenu', setPosition)
  removeEventListener('click', clear)
})
</script>

<style lang="scss" scoped>
* {
  user-select: none;
}
.ContextMenu {
  position: fixed;
  width: 100px;
  height: 30px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid black;
  border-radius: 5px;
  z-index: 9999;
}
</style>
