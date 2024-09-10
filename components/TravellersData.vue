<template>
  <div>
    <v-snackbar v-model="snackbar" :color="color" top :timeout="5000">
      <v-row>
        {{ text }}
        <v-spacer />
        <v-btn
          dark
          icon
          @click="snackbar = false"
        >
          <v-icon color="white">
            mdi-close
          </v-icon>
        </v-btn>
      </v-row>
    </v-snackbar>
    <v-form ref="form" v-model="travellersFormValid" class="travellers-form">
      <p class="body-1 font-weight-bold text-h5">
        Contact person details
      </p>
      <v-card class="pa-9 mb-5 rounded-xl" elevation="6">
        <v-row>
          <v-col class="py-0 py-sm-1 py-md-1" cols="12" sm="6" md="6">
            <v-text-field
              v-model="name"
              outlined
              :rules="[v => (!!v && v.length > 2) || 'Item is required at least 3 characters', v => /^[_A-z]*((-|\s)*[_A-z])*$/.test(v) || 'Name Must be letters only with no spaces']"
              label="Full Name"
              required
              color="blue"
              class="rounded-lg"
            />
          </v-col>
          <v-col class="py-0" cols="12" sm="6" md="6">
            <v-text-field
              v-model="email"
              outlined
              :rules="emailRules"
              label="E-mail"
              required
              color="blue"
              class="rounded-lg"
            />
          </v-col>
          <v-col class="py-0" cols="12" sm="6" md="6">
            <phoneinputBooking
              :country-code="country_code"
              :phone-number-value="phone_number"
              @update-country-code="updateCountryCode"
              @update-phone-number="updatePhoneNumber"
            />
          </v-col>
        </v-row>
      </v-card>
      <p class="body-1 font-weight-bold text-h5">
        Traverller Details
      </p>
      <v-expansion-panels v-model="panelExpandedTraveller" focusable class="mb-5">
        <v-expansion-panel v-model="panelExpandedTraveller" style="border-radius: 18px;">
          <v-expansion-panel-header color="#4C4C4C" class="white--text font-weight-bold text-h6 change-icon-style" style="border-radius: 18px; line-height: 2;">
            Traveller Contacts
          </v-expansion-panel-header>
          <v-expansion-panel-content class="my-8">
            <v-row>
              <v-col cols="12" sm="6" class="py-0 my-0">
                <v-select
                  v-model="passengerGender"
                  :items="['Male', 'Female']"
                  label="Gender"
                  outlined
                  required
                  class="pa-0 rounded-lg"
                  height="56px"
                  color="blue"
                  :menu-props="{ zIndex: 9999 }"
                />
              </v-col>
              <v-col cols="12" sm="6" class="my-0 py-0">
                <v-combobox
                  v-model="passengerTitle"
                  :items="['Mr', 'Mrs', 'Ms', 'Miss']"
                  :search-input.sync="search"
                  hide-selected
                  hint="Add title and press enter to append it"
                  label="Title"
                  outlined
                  :rules="requiredRule"
                  class="pa-0 rounded-lg"
                  height="56px"
                  color="blue"
                  :menu-props="{ zIndex: 9999 }"
                >
                  <template #no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0" cols="12" sm="6">
                <v-text-field
                  v-model="passengerFirstName"
                  outlined
                  :rules="nameRules"
                  label="First name"
                  required
                  color="blue"
                  class="rounded-lg"
                />
              </v-col>
              <v-col class="py-0" cols="12" sm="6">
                <v-text-field
                  v-model="passengerLastName"
                  outlined
                  :rules="nameRules"
                  label="Last name"
                  required
                  color="blue"
                  class="rounded-lg"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0" cols="12" sm="6">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="290px"
                  :z-index="9999"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-model="dateOfBirthText"
                      label="Birthday"
                      readonly
                      color="blue"
                      outlined
                      class="rounded-lg"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="dateOfBirth"
                    :max="new Date().toISOString().substr(0, 10)"
                    color="brown"
                    @input="menu1 = false, formatDate(dateOfBirth, 1, 'birthDate')"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" class="my-0 py-0">
                <v-text-field
                  v-model="passNum"
                  label="Passport number"
                  outlined
                  color="blue"
                  class="rounded-lg"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" class="my-0 py-0">
                <v-menu
                  v-model="passportMenus"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="290px"
                  :z-index="9999"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-model="passExpireDateText"
                      outlined
                      label="Passport expire date"
                      readonly
                      color="late"
                      class="rounded-lg"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="passExpireDate"
                    color="late"
                    :min="minExpireDate"
                    type="date"
                    @input="passportMenus = false, formatDate(passExpireDate, 1, 'passport')"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" class="my-0 py-0">
                <v-autocomplete
                  v-model="issueCountry"
                  :rules="[() => !!issueCountry || 'This field is required']"
                  :items="countries"
                  item-text="name"
                  item-value="code"
                  placeholder="Issuing Country"
                  name="issue-country-for-passports"
                  required
                  outlined
                  hide-no-data
                  color="blue"
                  autocomplete="off"
                  :menu-props="{ auto: true, maxWidth: 200, overflowY: true, zIndex: 9999 }"
                  class="rounded-lg"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" sm="5" class="my-0 py-0">
                <v-btn
                  class="white--text text-capitalize"
                  color="#A4713C"
                  elevation="6"
                  x-large
                  block
                  raised
                  @click="submit"
                >
                  Next
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels v-model="panelExpandedPayNow" focusable class="mb-5">
        <v-expansion-panel v-model="panelExpandedPayNow" style="border-radius: 18px;">
          <v-expansion-panel-header color="#4C4C4C" class="white--text font-weight-bold text-h6 change-icon-style" style="border-radius: 18px; line-height: 2;">
            Payment
          </v-expansion-panel-header>
          <v-expansion-panel-content class="my-8">
            <v-row>
              <v-col cols="12" sm="12" class="my-0 py-0">
                <v-btn
                  class="white--text text-capitalize"
                  color="#A4713C"
                  elevation="6"
                  x-large
                  block
                  raised
                  :loading="loading"
                  :disabled="!enablePayNow"
                  @click="nextSteps('pay')"
                >
                  <span v-if="module === 'cruise' || (module === 'trip' && hasCruise === true)">Book Now</span>
                  <span v-else>Pay Now</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script>
import clientAPI from '../services/axiosConfig'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['travellers', 'loading', 'openConfirmButton', 'module', 'hasCruise'],
  data () {
    return {
      menu1: null,
      passportMenus: null,
      travellersFormValid: true,
      name: '',
      nameRules: [v => (!!v && v.length > 1) || 'Item is required at least 2 characters',
        v => /^[A-Za-z][A-Za-z]*$/.test(v) || 'Name Must be letters only with no spaces'
      ],
      country_code: '',
      phone_number: '',
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(v) || 'E-mail must be valid'
      ],
      passengerTitle: null,
      passengerGender: null,
      search: null,
      passengerFirstName: null,
      passengerLastName: null,
      dateOfBirth: null,
      dateOfBirthText: null,
      passExpireDate: null,
      passExpireDateText: null,
      minExpireDate: null,
      passNum: null,
      issueCountry: null,
      travellersData: null,
      passengers: null,
      requiredRule: [
        v => !!v || 'Field is required'
      ],
      snackbar: false,
      color: '',
      text: '',
      openPaymentPanel: false,
      openConfirmationPanel: false,
      enablePayNow: false,
      enableConfirmation: false,
      panelExpandedTraveller: 0,
      panelExpandedPayNow: null
    }
  },
  computed: {
    countries () {
      return this.$store.state.countries
    },
    adultsNum () {
      return Number(this.passengers.adults)
    },
    childrenNum () {
      return Number(this.passengers.children)
    },
    infantsNum () {
      return Number(this.passengers.infants)
    },
    passengersNum () {
      return Number(this.passengers.adults) + Number(this.passengers.children) + Number(this.passengers.infants)
    },
    adultsMaxDate () {
      const today = new Date()
      const year = new Date().getFullYear()
      const max = today.setFullYear(year - 13)
      return new Date(max).toISOString().substr(0, 10)
    },
    childrenMaxDate () {
      const today = new Date()
      const year = new Date().getFullYear()
      const max = today.setFullYear(year - 2)
      return new Date(max).toISOString().substr(0, 10)
    },
    childrenMinDate () {
      const today = new Date()
      const year = new Date().getFullYear()
      const min = today.setFullYear(year - 13)
      return new Date(min).toISOString().substr(0, 10)
    },
    infantsMinDate () {
      const today = new Date()
      const year = new Date().getFullYear()
      const min = today.setFullYear(year - 2)
      return new Date(min).toISOString().substr(0, 10)
    },
    isMobile () {
      return window.innerWidth <= 768
    }
  },
  mounted () {
    this.loadTravellerData()
  },
  created () {
    this.passengers = this.travellers
      ? {
          adults: this.travellers.adults,
          children: this.travellers.children,
          infants: 0
        }
      : this.$store.state.passengers
    this.passportMenus = false
    this.menu1 = false
    this.dateOfBirth = null
    this.passNum = null
  },
  methods: {
    // assignPhone (phone) {
    //   this.phone = phone
    // },
    formatDateForDisplay (date) {
      if (!date) { return null }
      const options = { day: '2-digit', month: 'short', year: 'numeric' }
      return new Date(date).toLocaleDateString('en-GB', options)
    },
    async loadTravellerData () {
      try {
        const token = localStorage.getItem('authToken')
        const response = await clientAPI('https://api.tanefer.com/api/v2/auth').get('/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.status) {
          // eslint-disable-next-line camelcase
          const { username, email, phone, code, passenger_title, passenger_gender, passenger_first_name, passenger_last_name, date_of_birth, pass_expire_date, pass_num, issue_country } = response.data.data
          this.name = username
          this.email = email
          this.phone_number = phone
          this.country_code = code
          // eslint-disable-next-line camelcase
          this.passengerTitle = passenger_title
          // eslint-disable-next-line camelcase
          this.passengerGender = passenger_gender
          // eslint-disable-next-line camelcase
          this.passengerFirstName = passenger_first_name
          // eslint-disable-next-line camelcase
          this.passengerLastName = passenger_last_name
          // eslint-disable-next-line camelcase
          this.dateOfBirthText = this.formatDateForDisplay(date_of_birth)
          // eslint-disable-next-line camelcase
          this.passExpireDateText = this.formatDateForDisplay(pass_expire_date)
          // eslint-disable-next-line camelcase
          this.passNum = pass_num
          // eslint-disable-next-line camelcase
          this.issueCountry = issue_country
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching traveller data:', error)
      }
    },
    formatDate (date, i, type) {
      if (!date) { return null }
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const newDate = `${day} ${months[month - 1]} ${year}`
      if (type === 'passport') { this.passExpireDateText = newDate }
      if (type === 'birthDate') { this.dateOfBirthText = newDate }
    },

    getProperDate (n) {
      if (!this.dateOfBirth[n - 1]) {
        if (this.adultsNum >= (n)) {
          this.dateOfBirth[n - 1] = this.adultsMaxDate
        } else if (this.childrenNum >= (n - this.adultsNum)) {
          this.dateOfBirth[n - 1] = this.childrenMaxDate
        } else if (this.infantsNum >= (n - (this.adultsNum + this.childrenNum))) {
          this.dateOfBirth[n - 1] = this.infantsMinDate
        }
      }
    },
    addValue (n) {
      this.passNum[n] = ''
    },
    expire (n) {
      const today = new Date()
      today.setMonth(today.getMonth() + 6)
      today.setDate(today.getDate() + 1)
      this.passExpireDate[n] = today.toISOString().substring(0, 10)
      this.minExpireDate = today.toISOString().substring(0, 10)
    },
    prepareTravellersData () {
      this.travellersData = null
      this.travellersData = {
        passengerType: 'ADT',
        passengerTitle: this.passengerTitle,
        passengerGender: this.passengerGender ? (this.passengerGender === 'Male' ? 'male' : 'female') : '',
        passengerFirstName: this.passengerFirstName,
        passengerLastName: this.passengerLastName,
        date_of_birth: this.getYmdFormat(this.dateOfBirthText),
        passport_number: this.passNum,
        passport_expire_date: this.getYmdFormat(this.passExpireDateText),
        passport_issue_country: this.issueCountry
        // contact_phone: `${this.code}${this.phone}`
      }
    },
    getBirthdate (date) {
      let newDate = ''
      const segments = date.replace(/\//g, '-').split('-')
      if (segments[0].length === 1) { segments[0] = `0${segments[0]}` }
      if (segments[1].length === 1) { segments[1] = `0${segments[1]}` }
      newDate = `${segments[2]}-${segments[1]}-${segments[0]}`
      return newDate
    },
    submit () {
      // this.$refs.form.validate()
      if (this.travellersFormValid) {
        if (this.phone !== '') {
          this.snackbar = false
          this.prepareTravellersData()
          const contactInfo = {
            name: this.name,
            email: this.email,
            phone: `${this.code}${this.phone}`
          }
          this.$emit('dataReady', this.travellersData, contactInfo)
          this.enablePayNow = true
          this.panelExpandedPayNow = 0
          this.panelExpandedTraveller = null
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Please provide a valid phone number'
        }
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please fill all fields to cotinue'
      }
    },
    nextSteps (step) {
      // this.openPaymentPanel = true
      // Additional logic for other steps, if needed
      if (step === 'pay') {
        this.$emit('submitPayment')
        this.enablePayNow = false
        this.enableConfirmation = true
      } else {
        this.$emit('submitConfirmation')
        this.enableConfirmation = false
      }
    },
    updateCountryCode (newCode) {
      this.country_code = newCode
    },
    updatePhoneNumber (newNumber) {
      this.phone_number = newNumber
    },
    getYmdFormat (dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  }
}
</script>

<style scoped>
.travellers-form {
  width: 710px;
}

@media (max-width: 768px) {
  .travellers-form {
  max-width: 100%;
  width: 360px;
  margin-left: 8px;
}
 }
</style>
