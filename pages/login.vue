<template>
  <div class="page-wrapper">
    <div class="background-color" />
    <div class="auth-page-wrapper">
      <div class="auth-wrapper">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <div class="input-row">
            <input v-model="email" type="email" placeholder="Email">
            <input v-model="password" type="password" placeholder="Password">
          </div>
          <button type="submit">
            Login
          </button>
          <div v-if="message.length" :class="{'success-message': isSuccess, 'error-message': !isSuccess}" class="message-box">
            <div v-for="msg in message" :key="msg">
              {{ msg }}
            </div>
          </div>
        </form>
        <p class="no-account">
          Don't have an account? <router-link :to="{ path: '/register', query: { redirect: $route.query.redirect || '/' } }">
            Register
          </router-link>
        </p>
        <div class="social-login">
          <button class="facebook-btn" style="display: none;">
            <i class="fab fa-facebook-f" /> Login with Facebook
          </button>
          <button class="google-btn" style="display: none;">
            <i class="fab fa-google" /> Login with Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import clientAPI from '../services/axiosConfig'

export default {
  data () {
    return {
      email: '',
      password: '',
      message: [],
      isSuccess: true
    }
  },
  methods: {
    async login () {
      const result = await this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password
      })

      if (result.success) {
        this.message = ['Logged in successfully!']
        this.isSuccess = true
        // this.$router.push('/').then(() => {
        //   this.$nuxt.refresh()
        // })
        const redirectTo = this.$route.query.redirect
        if (redirectTo) {
          // this.$router.push(redirectTo)
          window.location.href = redirectTo
        } else {
          window.location.href = '/'
        }
      } else {
        this.handleErrors(result.message)
      }
    },

    handleErrors (message) {
      this.message = [message]
      this.isSuccess = false
    }
  }

}
</script>

<style scoped>
.page-wrapper {
  position: relative;
  min-height: 100vh;
}

.background-color {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #CFB9A1;
  z-index: -1;
}

.auth-page-wrapper {
  position: relative;
  padding: 80px 10px 10px;
}

.auth-wrapper {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.input-row input {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  font-size: 16px;
  color: #333;
}

.input-row input::placeholder {
  color: #aaa;
}

button {
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #764322;
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  color: black;
  background-color: #cfb0a1;
}

.social-login {
  margin-top: 20px;
}

.social-login button {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  display: none;
}

.facebook-btn {
  background-color: #3b5998;
  color: #fff;
}

.google-btn {
  background-color: #db4a39;
  color: #fff;
}

.facebook-btn:hover,
.google-btn:hover {
  color: black;
}

.fab {
  font-size: 20px;
}

.message-box {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.no-account {
  margin-top: revert;
}
</style>
