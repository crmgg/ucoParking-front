<template>
  <div v-if="isLoading" class="app-loading">Cargando…</div>
  <router-view v-else />
</template>

<script setup>
import { watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { setAuth0TokenGetter } from '@/services/auth0Token'

const { isLoading, getAccessTokenSilently } = useAuth0()

watch(
  isLoading,
  (loading) => {
    if (!loading) {
      setAuth0TokenGetter((options) => getAccessTokenSilently(options))
    }
  },
  { immediate: true }
)
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
