<template>
  <div v-if="!appReady" class="app-loading">Cargando…</div>
  <router-view v-else />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { setAuth0TokenGetter } from '@/services/auth0Token'
import { hasTabAuth } from '@/services/tabAuthSession'

const appReady = ref(false)
const { isLoading, isAuthenticated, logout, getAccessTokenSilently } = useAuth0()

watch(
  [isLoading, isAuthenticated],
  async ([loading, authenticated]) => {
    if (loading) return

    if (authenticated && !hasTabAuth()) {
      await logout({ openUrl: false })
    }

    if (!authenticated || hasTabAuth()) {
      if (hasTabAuth()) {
        setAuth0TokenGetter((options) => getAccessTokenSilently(options))
      }
      appReady.value = true
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
