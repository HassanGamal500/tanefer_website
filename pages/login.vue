<template>
  <div class="page-wrapper">
    <div class="background-color" />
    <div class="auth-page-wrapper">
      <div class="auth-wrapper">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <div class="input-row">
            <input v-model="email" type="email" placeholder="Email" required>
            <input v-model="password" type="password" placeholder="Password" required>
          </div>
          <button type="submit">
            Login
          </button>
        </form>
        <p>
          Don't have an account? <router-link to="/register">
            Register
          </router-link>
        </p>
        <div class="social-login">
          <button class="facebook-btn">
            <i class="fab fa-facebook-f" /> Login with Facebook
          </button>
          <button class="google-btn">
            <i class="fab fa-google" /> Login with Google
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
      email: '',
      password: ''
    }
  },
  methods: {
    async login () {
      try {
        const response = await clientAPI('http://localhost:8000/api/v2/auth/login').post('', {
          email: this.email,
          password: this.password
        })

        // const token = response.data.token
        // localStorage.setItem('authToken', token) // Store the token
        // alert(token)
        // alert('logged in successfully!')

        const token = response.data.data.token
        localStorage.setItem('authToken', token) // Store the token
        alert('Logged in successfully!')

      // Redirect or perform other actions here
      } catch (error) {
        if (error.response && error.response.status === 422) {
        // Extract and store validation error messages
          this.validationErrors = error.response.data.errors
        } else {
          alert('Login failed. Please try again.' + error)
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
    border: 1px solid #ccc;
    border-radius: 10px;
    background: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  h2 {
    margin-bottom: 20px;
  }

  .input-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .input-row input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    font-size: 14px;
    color: #333;
  }

  .input-row input::placeholder {
    color: #aaa;
  }

  button {
    padding: 10px 20px;
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
  </style>

  <!-- Add the following to your index.html to include FontAwesome icons -->
  <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"> -->
