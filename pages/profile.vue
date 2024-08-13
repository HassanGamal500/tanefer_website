<template>
  <v-container fluid>
    <v-row>
      <SideBar />
      <v-col cols="12" md="9" class="main-content">
        <v-card>
          <v-card-title>
            <span class="headline">Profile Information</span>
          </v-card-title>
          <v-card-subtitle>Basic Information</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profileData.username"
                  label="Username"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profileData.email"
                  label="Email"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profileData.phone"
                  label="Phone"
                />
              </v-col>
              <!-- Additional fields -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="additionalData.gender"
                  :items="['Male', 'Female']"
                  label="Gender"
                  :menu-props="{ zIndex: 9999 }"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-combobox
                  v-model="additionalData.title"
                  :items="['Mr', 'Mrs', 'Ms', 'Miss']"
                  :search-input.sync="search"
                  hide-selected
                  hint="Add title and press enter to append it"
                  label="Title"
                  :menu-props="{ zIndex: 9999 }"
                />
              </v-col>            <v-col cols="12" md="6">
                <v-text-field
                  v-model="additionalData.firstName"
                  label="First Name"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="additionalData.lastName"
                  label="Last Name"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="290px"
                  :z-index="9999"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="additionalData.birthday"
                      label="Birthday"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="additionalData.birthday"
                    :max="new Date().toISOString().substr(0, 10)"
                    color="late"
                    @input="menu1 = false"
                  />
                </v-menu>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="additionalData.passportNumber"
                  label="Passport Number"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-menu
                  v-model="passportMenus"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="290px"
                  :z-index="9999"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="additionalData.passExpireDateText"
                      label="Passport Expire Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="additionalData.passExpireDate"
                    color="late"
                    :min="minExpireDate"
                    @input="passportMenus = false, formatDate(passExpireDate, 1, 'passport')"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="additionalData.issuingCountry"
                  :items="countries"
                  item-text="name"
                  item-value="code"
                  placeholder="Issuing Country"
                  hide-no-data
                  autocomplete="off"
                  :menu-props="{ auto: true, maxWidth: 200, overflowY: true, zIndex: 9999 }"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              variant="outlined"
              rounded="lg"
              size="x-large"
              class="custom-outline-button"
              block
              @click="saveProfile"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import clientAPI from '../services/axiosConfig'

export default {
  middleware: 'auth',
  data () {
    return {
      menu1: null,
      passportMenus: null,
      minExpireDate: null,
      profileData: {
        username: '',
        email: '',
        phone: ''
      },
      additionalData: {
        gender: '',
        title: '',
        firstName: '',
        lastName: '',
        birthday: '',
        passportNumber: '',
        passExpireDateText: '',
        passExpireDate: '',
        issuingCountry: ''
      }
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    countries () {
      return this.$store.state.countries
    }
  },
  created () {
    // this.menu1 = false
    // this.passportMenus = false
  },
  async mounted () {
    try {
      const token = localStorage.getItem('authToken')
      const response = await clientAPI('https://api.tanefer.com/api/v2/auth').get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.status) {
        const { email, phone, username } = response.data.data
        this.profileData.email = email
        this.profileData.phone = phone
        this.profileData.username = username
      }
    } catch (error) {
      alert('Error fetching profile:', error)
    }
  },
  methods: {
    async saveProfile () {
      try {
        const token = localStorage.getItem('authToken')
        const payload = {
          ...this.profileData,
          ...this.additionalData
        }
        const response = await clientAPI('https://api.tanefer.com/api/v2/auth').post('/profile', payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.status) {
          alert('Profile updated successfully.')
        } else {
          alert('Failed to update profile.')
        }
      } catch (error) {
        alert('An error occurred while updating the profile.')
      }
    },
    uploadAvatar () {
      // Logic to handle avatar upload
    },
    formatDate (date, i, type) {
      if (!date) { return null }
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const newDate = `${day} ${months[month - 1]} ${year}`
      if (type === 'passport') { this.passExpireDateText = newDate }
      if (type === 'birthDate') { this.birthday = newDate }
    },
    expire (n) {
      const today = new Date()
      today.setMonth(today.getMonth() + 6)
      today.setDate(today.getDate() + 1)
      this.passExpireDate[n] = today.toISOString().substring(0, 10)
      this.minExpireDate = today.toISOString().substring(0, 10)
    }
  }

}
</script>

<style scoped>
.sidebar {
  position: absolute;
  width: 240px; /* Adjust the width as needed */
  height: 100%;
  top: 0;
  left: 0;
  background-color: #CFB9A1; /* Light brown background */
  padding-top: 20px;
  padding-left: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Optional shadow for better visual separation */
  z-index: 1000; /* Ensure it stays above other content */
}

.main-content {
  margin-left: 240px; /* Same width as sidebar to avoid overlap */
  padding: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ccc; /* Placeholder color */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.username {
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: bold;
}

.sidebar-list {
  background-color: #CFB9A1; /* Match sidebar color */
}

.custom-outline-button {
  border: 2px solid #4F3316;
  color: #4F3316;
}

.custom-outline-button:hover {
  background-color: #4F3316;
  color: white;
}
</style>
