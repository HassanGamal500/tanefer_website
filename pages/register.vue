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
            <MobileInput @update:phone="assignPhone" />
            <input v-model="password" type="password" placeholder="Password" required>
            <input
              v-model="password_confirmation"
              type="password"
              placeholder="Confirm Password"
              required
            >
          </div>
          <div class="terms-checkbox">
            <input id="terms" v-model="agreedToTerms" type="checkbox">
            <label for="terms">
              I agree to the
              <router-link to="/termsAndConditions">terms and conditions</router-link>.
            </label>
          </div>
          <button type="submit">
            Register
          </button>
          <div v-if="message" :class="{ 'success-message': isSuccess, 'error-message': !isSuccess }" class="message-box">
            {{ message }}
          </div>
        </form>
        <p class="no-account">
          Already have an account? <router-link to="/login">
            Login
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MobileInput from '../components/MobileInput.vue'

export default {
  components: {
    MobileInput
  },
  data () {
    return {
      username: '',
      email: '',
      password: '',
      phone: '',
      password_confirmation: '',
      validationErrors: {},
      message: '',
      isSuccess: true,
      agreedToTerms: false
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
    assignPhone (phone) {
      this.phone = phone
    },
    async register () {
      if (!this.agreedToTerms) {
        this.message = 'Please agree to the terms and conditions.'
        this.isSuccess = false
        return
      }

      try {
        const response = await axios.post('https://api.tanefer.com/api/v2/auth/register', {
          username: this.username,
          email: this.email,
          phone: this.phone.e164,
          password: this.password,
          password_confirmation: this.password_confirmation
        })

        if (response.status === 201) {
          const token = response.data.data.token

          localStorage.setItem('authToken', token)

          axios.defaults.headers.common.Authorization = `Bearer ${token}`

          this.message = 'Registered successfully!'
          this.isSuccess = true

          window.location.href = '/'
        } else {
          this.handleErrors(response.data.data)
        }
      } catch (error) {
        if (error.response) {
          this.handleErrors(error.response.data.data || 'An error occurred during registration. Please try again.')
        } else {
          this.message = 'An unexpected error occurred. Please check your network connection and try again.'
          this.isSuccess = false
        }
      }
    },

    handleErrors (message) {
      this.message = message
      this.isSuccess = false
    }
  }
}
</script>

<style scoped>
.page-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-color {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  z-index: -1;
}

.auth-page-wrapper {
  position: relative;
  padding: 80px 10px 10px;
}

.auth-wrapper {
  max-width: 400px;
  margin: 20px auto;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
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
  width: 100%;
}

button:hover {
  color: black;
  background-color: #cfb0a1;
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

.terms-checkbox {
  margin: 20px 0;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
}

.terms-checkbox input {
  margin: 0;
}

.terms-checkbox label {
  font-size: 14px;
}

.no-account {
  margin-top: 20px;
}
</style>
