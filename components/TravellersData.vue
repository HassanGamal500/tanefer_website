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
    <v-form ref="form" v-model="travellersFormValid">
      <p class="body-1 font-weight-bold text-h5">
        Contact person details
      </p>
      <v-card class="pa-9 mb-5 rounded-xl" elevation="6">
        <v-row>
          <v-col class="py-0" cols="12" sm="6" md="6">
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
            <mobile-input @update="assignPhone" />
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
                      :rules="[() => !!dateOfBirth || 'This field is required']"
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
                  :rules="[() => !!passNum || 'This field is required', () => /^[a-z0-9A-Z0-9]*$/.test(passNum) || 'No special characters allowed', () => passNum != null && passNum.length >= 5 || 'Passport number must be at least 5 characters', () => passNum != null && passNum.length <= 15 || 'Passport number must be at most 15 characters']"
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
                      :rules="[() => !!passExpireDate || 'This field is required']"
                      color="blue"
                      class="rounded-lg"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="passExpireDate"
                    color="late"
                    :rules="[() => !!passExpireDate || 'This field is required']"
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
      <!-- <v-expansion-panels focusable class="mb-5">
        <v-expansion-panel style="border-radius: 18px;">
          <v-expansion-panel-header color="#4C4C4C" class="white--text font-weight-bold text-h6 change-icon-style" style="border-radius: 18px; line-height: 2;">
            Confirmation
          </v-expansion-panel-header>
          <v-expansion-panel-content class="my-8">
            <v-row>
              <v-col cols="12" sm="12" class="my-0 py-0">
                <v-btn class="white--text text-capitalize"
                  color="#A4713C"
                  elevation="6"
                  x-large
                  block
                  raised
                  :loading="loading"
                  @click="nextSteps('confirm')"
                  :disabled="!openConfirmButton"
                >
                Confirm Booking
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels> -->
    </v-form>
    <!-- <v-btn v-if="travellers" block :loading="loading" class="late px-12 py-5 white--text" @click="submit">
      book now
    </v-btn>
    <v-btn v-else class="brown px-12 py-5 white--text" @click="submit">
      Continue to payment
    </v-btn> -->
  </div>
</template>

<script>

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
      phone: '',
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
    }
  },
  created () {
    this.passengers = this.travellers
      ? {
          adults: this.travellers.adults,
          children: this.travellers.children,
          infants: 0
        }
      : this.$store.state.passengers
    // const passengersNum = Number(this.passengers.adults) + Number(this.passengers.children) + Number(this.passengers.infants)
    // for (let i = 0; i < passengersNum; i++) {
    //   this.passportMenus[i] = false
    //   this.menu1[i] = false
    //   this.dateOfBirth.push('')
    //   this.passNum.push('')
    // }
    this.passportMenus = false
    this.menu1 = false
    this.dateOfBirth = null
    this.passNum = null
    // this.dateOfBirth.push('')
    // this.passNum.push('')
    // }
  },
  methods: {
    assignPhone (phone) {
      this.phone = phone
    },
    formatDate (date, i, type) {
      if (!date) { return null }
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const newDate = `${day} ${months[month - 1]} ${year}`
      // if (type === 'passport') { this.passExpireDateText[i] = newDate }
      // if (type === 'birthDate') { this.dateOfBirthText[i] = newDate }
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
      // const type
      // const title
      // const gender
      // if (this.passengerGender) {
      //   this.passengerGender === 'Male' ? gender = 'M' : gender = 'F'
      // }
      // type = 'ADT'
      // title = this.passengerTitle
      this.travellersData = {
        passengerType: 'ADT',
        passengerTitle: this.passengerTitle,
        // passengerGender: this.passengerGender ? (this.passengerGender === 'Male' ? 'M' : 'F') : '',
        passengerGender: this.passengerGender ? (this.passengerGender === 'Male' ? 'male' : 'female') : '',
        passengerFirstName: this.passengerFirstName,
        passengerLastName: this.passengerLastName,
        date_of_birth: this.dateOfBirth,
        passport_number: this.passNum,
        passport_expire_date: this.passExpireDate,
        passport_issue_country: this.issueCountry
      }
      // for (let index = 0; index < this.passengersNum; index++) {
      //   if (this.adultsNum >= (index + 1)) {
      //     type = 'ADT'
      //     title = this.passengerTitle[index]
      //     if (this.passengerGender[index] === undefined) {
      //       if (title === 'Mr') {
      //         this.passengerGender[index] = 'M'
      //         gender = 'M'
      //       } else if (['Mrs', 'Ms', 'Miss'].includes(title)) {
      //         this.passengerGender[index] = 'F'
      //         gender = 'F'
      //       }
      //     }
      //   } else if (this.childrenNum >= ((index + 1) - this.adultsNum)) {
      //     type = 'CNN'
      //     title = 'CHD'
      //   } else if (this.infantsNum >= ((index + 1) - (this.adultsNum + this.childrenNum))) {
      //     type = 'INF'
      //     title = 'INF'
      //   }
      //   this.travellersData.push({
      //     passengerType: type,
      //     passengerTitle: title,
      //     passengerGender: gender,
      //     passengerFirstName: this.passengerFirstName[index],
      //     passengerLastName: this.passengerLastName[index],
      //     date_of_birth: this.dateOfBirth[index],
      //     passport_number: this.passNum[index],
      //     passport_expire_date: this.passExpireDate[index],
      //     passport_issue_country: this.issueCountry[index]
      //   })
      // }
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
      this.$refs.form.validate()
      if (this.travellersFormValid) {
        if (this.phone.isValid) {
          this.snackbar = false
          this.prepareTravellersData()
          const contactInfo = {
            name: this.name,
            email: this.email,
            phone: this.phone
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
    }
  }
}
</script>
