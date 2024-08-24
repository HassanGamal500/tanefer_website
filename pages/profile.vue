<template>
  <v-container fluid>
    <v-row>
      <SideBar />
      <v-col cols="12" md="9" class="main-content">
        <v-card>
          <v-card-title>
            Profile Information
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

          <v-card-subtitle>Basic Information</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="profileData.username" label="Username" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="profileData.email" label="Email" disabled />
              </v-col>

              <!-- Phone Input Component -->
              <v-col cols="12" md="6">
                <phone-input
                  :country-code="profileData.country_code"
                  :phone-number-value="profileData.phone_number"
                  @update-country-code="updateCountryCode"
                  @update-phone-number="updatePhoneNumber"
                />
              </v-col>

              <!-- Traveller Data Fields -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="travellerData.passengerGender"
                  :items="['Male', 'Female']"
                  label="Gender"
                  :menu-props="{ zIndex: 9999 }"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-combobox
                  v-model="travellerData.passengerTitle"
                  :items="['Mr', 'Mrs', 'Ms', 'Miss']"
                  label="Title"
                  :menu-props="{ zIndex: 9999 }"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="travellerData.passengerFirstName" label="First Name" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="travellerData.passengerLastName" label="Last Name" />
              </v-col>
              <v-col cols="12" md="6">
                <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" min-width="290px">
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="travellerData.dateOfBirth"
                      label="Birthday"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="travellerData.dateOfBirth"
                    color="late"
                    :max="new Date().toISOString().substr(0, 10)"
                    @input="menu1 = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="travellerData.passNum" label="Passport Number" />
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
                      v-model="travellerData.passExpireDate"
                      label="Passport Expire Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="travellerData.passExpireDate"
                    color="late"
                    :min="minExpireDate"
                    @input="passportMenus = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="travellerData.issueCountry"
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
              rounded
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
      minExpireDate: this.getTodayDate(),
      profileData: {
        username: '',
        email: '',
        country_code: '+1',
        phone_number: ''
      },
      travellerData: {
        passengerTitle: '',
        passengerGender: '',
        passengerFirstName: '',
        passengerLastName: '',
        dateOfBirth: '',
        passExpireDate: '',
        passNum: '',
        issueCountry: ''
      },
      showSuccessAlert: false,
      showErrorAlert: false,
      successMessage: '',
      errorMessage: ''
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      travellerDataFromStore: 'travellers/travellerData'
    }),
    countries () {
      return this.$store.state.countries
    }
  },

  mounted () {
    this.loadProfile()
  },

  methods: {
    async loadProfile () {
      try {
        const token = localStorage.getItem('authToken')
        const profileResponse = await clientAPI('https://api.tanefer.com/api/v2/auth').get('/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (profileResponse.data.status) {
          const { email, phone, code, username } = profileResponse.data.data

          this.profileData.email = email
          this.profileData.phone_number = phone || ''
          this.profileData.country_code = code || '+1'
          this.profileData.username = username

          const travellerResponse = await this.$store.dispatch('travellers/fetchTravellerData', this.user.id)
          if (travellerResponse.success) {
            this.travellerData = { ...this.travellerDataFromStore }
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching profile:', error)
      }
    },

    async saveProfile () {
      try {
        const token = localStorage.getItem('authToken')

        const profilePayload = {
          username: this.profileData.username,
          phone: this.profileData.phone_number,
          code: this.profileData.country_code
        }

        const profileUpdateResponse = await clientAPI('https://api.tanefer.com/api/v2/auth').post('/profile', profilePayload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!profileUpdateResponse.data.status) {
          throw new Error('Failed to update profile data.')
        }

        const userId = profileUpdateResponse.data.data.id
        const travellerPayload = {
          passenger_title: this.travellerData.passengerTitle,
          passenger_gender: this.travellerData.passengerGender,
          passenger_first_name: this.travellerData.passengerFirstName,
          passenger_last_name: this.travellerData.passengerLastName,
          date_of_birth: this.travellerData.dateOfBirth,
          pass_expire_date: this.travellerData.passExpireDate,
          pass_num: this.travellerData.passNum,
          issue_country: this.travellerData.issueCountry
        }

        const travellerResponse = await clientAPI('https://api.tanefer.com/api/v2/auth').post(`/users/save-traveller-data?user_id=${userId}`, travellerPayload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (travellerResponse.data.status) {
          this.showSuccessAlert = true
          this.successMessage = travellerResponse.data.message
          await this.$store.dispatch('travellers/saveTravellerData', travellerPayload)
          this.showErrorAlert = false
        } else {
          throw new Error('Failed to update traveller data.')
        }
      } catch (error) {
        this.showSuccessAlert = true
        this.successMessage = 'Traveller data updated successfully.'
      }
    },

    getTodayDate () {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    updateCountryCode (newCode) {
      this.profileData.country_code = newCode
    },
    updatePhoneNumber (newNumber) {
      this.profileData.phone_number = newNumber
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
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ccc;
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
  background-color: #CFB9A1;
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
