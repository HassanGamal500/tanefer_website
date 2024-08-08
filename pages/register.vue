<template>
  <div class="page-wrapper">
    <div class="background-color" />
    <div class="auth-page-wrapper">
      <div class="auth-wrapper">
        <h2>Register</h2>
        <form @submit.prevent="register">
          <div class="input-row">
            <input v-model="username" type="text" placeholder="Username" required>
            <input v-model="email" type="email" placeholder="Email" required>
          </div>
          <div class="input-row">
            <input v-model="phone" type="tel" placeholder="Phone Number" required>
            <input v-model="password" type="password" placeholder="Password" required>
            <input v-model="password_confirmation" type="password" placeholder="Confirm Password" required>
          </div>
          <button type="submit">
            Register
          </button>
          <div v-if="message" :class="{'success-message': isSuccess, 'error-message': !isSuccess}" class="message-box">
            {{ message }}
          </div>
        </form>
        <p v-if="Object.keys(validationErrors).length">
          <span v-for="(messages, field) in validationErrors" :key="field">
            <strong>{{ field }}:</strong> {{ messages.join(', ') }}
          </span>
        </p>
        <p>
          Already have an account? <router-link to="/login">
            Login
          </router-link>
        </p>
        <div class="social-login">
          <!-- Buttons are invisible but still in the DOM -->
          <button class="facebook-btn" style="display: none;">
            <i class="fab fa-facebook-f" /> Register with Facebook
          </button>
          <button class="google-btn" style="display: none;">
            <i class="fab fa-google" /> Register with Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clientAPI from '../services/axiosConfig'

export default {
  data () {
    return {
      username: '',
      email: '',
      password: '',
      phone: '',
      password_confirmation: '',
      validationErrors: {},
      message: '',
      isSuccess: true
    }
  },

  head () {
    return {
      title: 'Register Page',
      meta: [
        { hid: 'description', name: 'description', content: 'Register a new account' }
      ]
    }
  },

  methods: {
    async register () {
      try {
        const response = await clientAPI('https://api.tanefer.com/api/v2/auth').post('/register', {
          username: this.username,
          email: this.email,
          phone: this.phone,
          password: this.password,
          password_confirmation: this.password_confirmation
        })

        const token = response.data.token
        localStorage.setItem('authToken', token)

        this.message = 'Registered successfully!'
        this.isSuccess = true

        this.$router.push('/login')
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            this.message = (error.response.data.data || 'Please check your input.')
            this.isSuccess = false
          } else if (error.response.status === 404) {
            this.message = 'Endpoint not found. Please try again later.'
            this.isSuccess = false
          } else {
            this.message = 'Registration failed. Please try again.'
            this.isSuccess = false
          }
        } else {
          this.message = 'Network error. Please try again later.'
          this.isSuccess = false
        }
      }
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
  /* background: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
  text-align: center;
}

h2 {
  margin-bottom: 20px;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Increased gap */
  margin-bottom: 20px;
}

.input-row input {
  padding: 15px; /* Increased padding */
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  font-size: 16px; /* Increased font size */
  color: #333;
}

.input-row input::placeholder {
  color: #aaa;
}

button {
  padding: 15px 20px; /* Increased padding */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #16404F;
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  color: black;
  background-color: #A1C2CF;
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
  display: none; /* Make buttons invisible */
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
</style>
