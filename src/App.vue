<template>
  <div v-if="isLoading" class="app-loading">Cargando…</div>
  <router-view v-else />
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { setAccessTokenGetter } from '@/services/api'

const { isLoading, getAccessTokenSilently } = useAuth0()

onBeforeMount(() => {
  setAccessTokenGetter((options) => getAccessTokenSilently(options))
})
</script>

<style scoped>
.app-loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter, system-ui, sans-serif;
  color: #475569;
}
</style>
