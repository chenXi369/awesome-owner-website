<template>
  <div v-if="authStore.isAuthenticated" class="user-nav">
    <v-menu location="bottom end">
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          class="user-btn"
          v-bind="props"
        >
          <v-avatar size="32" class="mr-2">
            <v-icon>mdi-account</v-icon>
          </v-avatar>
          <span class="username">{{ authStore.userInfo?.username }}</span>
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-title class="text-subtitle-2">
            {{ authStore.userInfo?.email || authStore.userInfo?.phone }}
          </v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="handleLogout">
          <v-list-item-title class="text-body-2">
            <v-icon size="small" class="mr-2">mdi-logout</v-icon>
            退出登录
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
  
  <div v-else class="auth-buttons">
    <v-btn
      variant="text"
      color="primary"
      to="/auth/login"
      class="mr-2"
    >
      登录
    </v-btn>
    <v-btn
      variant="outlined"
      color="primary"
      to="/auth/register"
    >
      注册
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.user-nav {
  display: flex;
  align-items: center;
}

.user-btn {
  text-transform: none;
  font-weight: 500;
}

.username {
  margin: 0 8px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-buttons {
  display: flex;
  align-items: center;
}

@media (max-width: 600px) {
  .username {
    display: none;
  }
  
  .auth-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .auth-buttons .mr-2 {
    margin-right: 0 !important;
  }
}
</style>