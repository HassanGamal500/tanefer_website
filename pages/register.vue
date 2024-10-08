<template>
  <div class="page-wrapper">
    <div class="background-color" />
    <div class="auth-page-wrapper">
      <div class="auth-wrapper">
        <h2>Register</h2>
        <form @submit.prevent="register">
          <div class="input-row">
            <input
              v-model="username"
              type="text"
              :class="{'is-invalid': validationErrors.username}"
              placeholder="Username"
            >
            <small v-if="validationErrors.username" class="error-message">{{ validationErrors.username }}</small>
            <input
              v-model="email"
              :class="{'is-invalid': validationErrors.email}"
              type="email"
              placeholder="Email"
            >
            <small v-if="validationErrors.email" class="error-message">{{ validationErrors.email }}</small>
          </div>
          <div class="input-row">
            <phoneinputBooking
              :country-code="countryCode"
              :phone-number-value="phoneNumber"
              @update-country-code="updateCountryCode"
              @update-phone-number="updatePhoneNumber"
            />
            <small v-if="validationErrors.phone" class="error-message">{{ validationErrors.phone }}</small>
            <input
              v-model="password"
              :class="{'is-invalid': validationErrors.password}"
              type="password"
              placeholder="Password"
            >
            <small v-if="validationErrors.password" class="error-message">{{ validationErrors.password }}</small>
            <input
              v-model="password_confirmation"
              :class="{'is-invalid': validationErrors.password_confirmation}"
              type="password"
              placeholder="Confirm Password"
            >
          </div>
          <small v-if="validationErrors.password_confirmation" class="error-message">{{ validationErrors.password_confirmation }}</small>
          <div class="terms-checkbox">
            <input
              id="terms"
              v-model="agreedToTerms"
              type="checkbox"
            >
            <label for="terms">
              I agree to the
              <router-link to="/termsAndConditions">terms and conditions</router-link>.
            </label>
          </div>
          <button type="submit">
            Register
          </button>
          <br>
          <small v-if="validationErrors.terms" class="error-message">{{ validationErrors.terms }}</small>
          <br>
          <div v-if="message" :class="{'success-message': isSuccess, 'error-message': !isSuccess}" class="message-box">
            {{ message }}
          </div>
        </form>
        <p class="no-account">
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
      countryCode: '+1',
      phoneNumber: '',
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
    updateCountryCode (newCode) {
      this.countryCode = newCode
    },
    updatePhoneNumber (newPhone) {
      this.phoneNumber = newPhone
    },
    async register () {
      this.validationErrors = {}

      if (!this.username) {
        this.validationErrors.username = 'The username is required'
      }

      if (!this.email) {
        this.validationErrors.email = 'The email is required'
      }

      if (!this.phoneNumber) {
        this.validationErrors.phone = 'The phone is required'
      }

      if (!this.password) {
        this.validationErrors.password = 'The password is required'
      }

      if (!this.password_confirmation) {
        this.validationErrors.password_confirmation = 'The password confirmation is required'
      }

      if (!this.agreedToTerms) {
        this.validationErrors.terms = 'You must agree to the terms & conditions'
      }

      if (Object.keys(this.validationErrors).length > 0) {
        return
      }

      try {
        const response = await clientAPI('https://api.tanefer.com/api/v2/auth').post('/register', {
          username: this.username,
          email: this.email,
          phone: this.phoneNumber,
          code: this.countryCode,
          password: this.password,
          password_confirmation: this.password_confirmation
        })

        if (response.status === 201) {
          const token = response.data.data.token
          localStorage.setItem('authToken', token)
          clientAPI.defaults.headers.common.Authorization = `Bearer ${token}`

          this.message = 'Registered successfully!'
          this.isSuccess = true

          this.$store.commit('auth/setToken', token)
          await this.$store.dispatch('auth/fetchUser')
          window.location.href = '/'
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.handleErrors(error.response.data)
        } else {
          this.message = 'User Registered Successfully'
          this.isSuccess = true

          const redirectTo = this.$route.query.redirect
          if (redirectTo) {
            // this.$router.push(redirectTo)
            window.location.href = redirectTo
          } else {
            window.location.href = '/'
          }
        }
      }
    },

    handleErrors (data) {
      this.message = data.data || 'An error occurred. Please try again.'
      this.isSuccess = false

      if (data.data && typeof data.data === 'object') {
        Object.keys(data.data).forEach((field) => {
          this.validationErrors[field] = data.data[field]
        })
      }
    },

    assignPhone (phone) {
      this.phone = phone
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

.terms-checkbox {
  margin: 20px 0;
  text-align: left;
  display: flex;
  gap: 5px;
  align-items: flex-start;
}

.terms-checkbox input {
  margin-right: 10px;
}

.terms-checkbox label {
  font-size: 14px;
}

.no-account{
  margin-top: revert;
}

.is-invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
.mobile-input {
  margin-bottom: 10px !important;
}
</style>
