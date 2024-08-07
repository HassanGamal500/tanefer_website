<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
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
            </v-row>
          </v-card-text>

          <v-card-subtitle>Additional Information</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="additionalData.title"
                  :items="titles"
                  label="Title"
                  item-text="text"
                  item-value="value"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="additionalData.gender"
                  :items="genders"
                  label="Gender"
                  item-text="text"
                  item-value="value"
                />
              </v-col>
              <v-col cols="12" md="6">
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
                <v-text-field
                  v-model="additionalData.birthday"
                  label="Birthday"
                  type="date"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="additionalData.passportNumber"
                  label="Passport Number"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="additionalData.passportExpiryDate"
                  label="Passport Expiry Date"
                  type="date"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="additionalData.issuingCountry"
                  label="Issuing Country"
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
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span class="headline">Reservation History</span>
          </v-card-title>
          <v-card-text>
            <!-- to be added later -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import clientAPI from '../services/axiosConfig'

export default {
  data () {
    return {
      profileData: {
        username: '',
        email: '',
        phone: ''
      },
      additionalData: {
        title: '',
        gender: '',
        firstName: '',
        lastName: '',
        birthday: '',
        passportNumber: '',
        passportExpiryDate: '',
        issuingCountry: ''
      },
      titles: [
        { text: 'Mr', value: 'mr' },
        { text: 'Miss', value: 'miss' },
        { text: 'Mrs', value: 'mrs' },
        { text: 'Ms', value: 'ms' }
      ],
      genders: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' }
      ]
    }
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
    }
  }
}
</script>

<style scoped>
.headline {
  font-weight: bold;
}
.v-card {
  margin: 20px;
}
.v-card-text {
  padding: 20px;
}
.outline-button {
  border: 2px solid #4F3316;
  color: #4F3316;
}
.outline-button:hover {
  background-color: #4F3316;
  color: white;
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
