<template>
  <div>
    <div v-if="isAuthenticated">
      <p>Welcome, {{ user.username }}</p>
      <button @click="logout">
        Logout
      </button>
    </div>
    <div v-else>
      <nuxt-link to="/login">
        Login
      </nuxt-link>
      <nuxt-link to="/register">
        Register
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated () {
      return this.$store.getters['auth/isAuthenticated']
    },
    user () {
      return this.$store.getters['auth/user']
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>
