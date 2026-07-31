<template>
  <div class="m3-list">
    <slot />
  </div>
</template>

<style scoped>
.m3-list {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
}
</style>
