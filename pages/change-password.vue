<template>
  <v-container fluid class="cp-container">
    <v-row>
      <SideBar />
      <v-col cols="12" md="9" class="main-content">
        <v-card class="change-password-card">
          <v-card-title>
            Change Password
          </v-card-title>
          <v-alert
            v-if="showSuccessAlert"
            type="success"
            class="mb-4"
            dismissible
            @input="showSuccessAlert = false"
          >
            {{ successMessage }}
          </v-alert>

          <v-alert
            v-if="showErrorAlert"
            type="error"
            class="mb-4"
            dismissible
            @input="showErrorAlert = false"
          >
            {{ errorMessage }}
          </v-alert>

          <v-card-text>
            <v-form ref="form">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentPassword"
                  label="Current Password"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  :append-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  required
                  @click:append="toggleShowCurrentPassword"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newPassword"
                  label="New Password"
                  :type="showNewPassword ? 'text' : 'password'"
                  :append-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  required
                  @click:append="toggleShowNewPassword"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newPasswordConfirm"
                  label="Confirm New Password"
                  :type="showNewPasswordConfirm ? 'text' : 'password'"
                  :append-icon="showNewPasswordConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                  :error="confirmPasswordTouched && passwordsDoNotMatch"
                  :error-messages="passwordErrorMessages"
                  @click:append="toggleShowNewPasswordConfirm"
                  @input="confirmPasswordTouched = true"
                />
              </v-col>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              variant="outlined"
              rounded="lg"
              class="custom-outline-button"
              block
              @click="changePassword"
            >
              Change Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import clientAPI from '../services/axiosConfig'

export default {
  middleware: 'auth',
  data () {
    return {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      showCurrentPassword: false,
      showNewPassword: false,
      showNewPasswordConfirm: false,
      confirmPasswordTouched: false,
      showSuccessAlert: false,
      showErrorAlert: false,
      successMessage: '',
      errorMessage: ''
    }
  },
  computed: {
    passwordsDoNotMatch () {
      return this.newPassword && this.newPasswordConfirm && this.newPassword !== this.newPasswordConfirm
    },
    passwordErrorMessages () {
      return this.passwordsDoNotMatch ? 'Passwords do not match.' : ''
    }
  },
  methods: {
    async changePassword () {
      if (this.passwordsDoNotMatch) {
        this.showErrorAlert = true
        this.errorMessage = 'Passwords do not match.'
        return
      }

      try {
        const token = localStorage.getItem('authToken')
        const payload = {
          current_password: this.currentPassword,
          new_password: this.newPassword,
          new_password_confirmation: this.newPasswordConfirm
        }

        const response = await clientAPI('https://api.tanefer.com/api/v2/auth').post('/profile/update-password', payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.status) {
          this.showSuccessAlert = true
          this.successMessage = 'Password updated successfully.'
          this.showErrorAlert = false
        } else {
          this.showErrorAlert = true
          this.errorMessage = response.data.message || 'Failed to update password.'
          this.showSuccessAlert = false
        }
      } catch (error) {
        this.showErrorAlert = true
        this.errorMessage = 'An error occurred while updating the password.'
        this.showSuccessAlert = false
      }
    },
    toggleShowCurrentPassword () {
      this.showCurrentPassword = !this.showCurrentPassword
    },
    toggleShowNewPassword () {
      this.showNewPassword = !this.showNewPassword
    },
    toggleShowNewPasswordConfirm () {
      this.showNewPasswordConfirm = !this.showNewPasswordConfirm
    }
  }
}
</script>

  <style scoped>
  /* .sidebar {
    position: absolute;
    width: 240px;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #CFB9A1;
    padding-top: 20px;
    padding-left: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  } */

  .main-content {
    margin-left: 240px;
    padding: 20px;
    padding-bottom: 100px;
  }

  .change-password-card {
    padding-bottom: 30px;
    height:100%;
  }

  .v-card {
    max-width: 100%;
  }

  .custom-outline-button {
    border: 2px solid #4F3316;
    color: #4F3316;
  }

  .custom-outline-button:hover {
    background-color: #4F3316;
    color: white;
  }

  .cp-container {
    height: 600px;
  }
  </style>
