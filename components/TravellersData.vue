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
      <v-card outlined class="pa-5 mb-5">
        <p class="body-1 font-weight-bold late--text">
          Contact person details
        </p>
        <v-row>
          <v-col class="py-0" cols="12" sm="4" md="3">
            <v-text-field
              v-model="name"
              outlined
              :rules="[v => (!!v && v.length > 2) || 'Item is required at least 3 characters', v => /^[_A-z]*((-|\s)*[_A-z])*$/.test(v) || 'Name Must be letters only with no spaces']"
              label="Full Name"
              required
              color="blue"
            />
          </v-col>
          <v-col class="py-0" cols="12" sm="4" md="5">
            <mobile-input @update="assignPhone" />
          </v-col>
          <v-col class="py-0" cols="12" sm="4" md="4">
            <v-text-field
              v-model="email"
              outlined
              :rules="emailRules"
              label="E-mail"
              required
              color="blue"
            />
          </v-col>
        </v-row>
      </v-card>
      <v-card v-for="n in passengersNum" :key="n" class="mb-5 pa-5" outlined>
        <p class="body-1 late--text">
          Traveller {{ n }} <span>({{ adultsNum >= n ? 'Adult' : (childrenNum >= ( n - adultsNum) ? 'Child' : (infantsNum >= (n - (adultsNum + childrenNum)) ? 'Infant' : null)) }})</span>
        </p>
        <v-row>
          <v-col cols="12" :sm="adultsNum >= n ? 6 : 12" class="py-0 my-0">
            <v-select
              v-model="passengerGender[n-1]"
              :items="['Male', 'Female']"
              label="Gender"
              outlined
              prepend-inner-icon="mdi-gender-male-female"
              required
              class="pa-0"
              height="56px"
              color="blue"
            >
              <template #selection="{ item }">
                <span class="primary--text caption">{{ item }}</span>
              </template>
            </v-select>
          </v-col>
          <v-col v-if="adultsNum >= n" cols="12" sm="6" class="my-0 py-0">
            <v-combobox
              v-model="passengerTitle[n-1]"
              :items="['Mr', 'Mrs', 'Ms', 'Miss']"
              :search-input.sync="search[n-1]"
              hide-selected
              hint="Add title and press enter to append it"
              label="Title"
              outlined
              prepend-inner-icon="mdi-card-account-details"
              :rules="requiredRule"
              class="pa-0"
              height="56px"
              color="blue"
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
          <v-col class="py-0" cols="12" sm="4">
            <v-text-field
              v-model="passengerFirstName[n-1]"
              outlined
              prepend-inner-icon="mdi-account"
              :rules="nameRules"
              label="First name"
              required
              color="blue"
            />
          </v-col>
          <v-col class="py-0" cols="12" sm="4">
            <v-text-field
              v-model="passengerLastName[n-1]"
              outlined
              prepend-inner-icon="mdi-account"
              :rules="nameRules"
              label="Last name"
              required
              color="blue"
            />
          </v-col>
          <v-col class="py-0" cols="12" sm="4">
            <v-menu
              ref="menu1"
              v-model="menu1[n-1]"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="dateOfBirthText[n-1]"
                  prepend-inner-icon="mdi-calendar"
                  label="Birthday"
                  readonly
                  color="blue"
                  outlined
                  :rules="[() => !!dateOfBirth[n-1] || 'This field is required']"
                  v-on="on"
                  @focus="getProperDate(n)"
                />
              </template>
              <v-date-picker
                ref="picker"
                v-model="dateOfBirth[n-1]"
                :max="adultsNum >= n ? adultsMaxDate : ((childrenNum >= (n - adultsNum)) ? childrenMaxDate : new Date().toISOString().substr(0, 10))"
                :min="adultsNum >= n ? '1950-01-01' : ((childrenNum >= (n - adultsNum)) ? childrenMinDate : infantsMinDate)"
                color="brown"
                @input="menu1[n-1] = false, formatDate(dateOfBirth[n-1] , n - 1, 'birthDate')"
              />
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4" class="my-0 py-0">
            <v-text-field
              v-model="passNum[n-1]"
              label="Passport number"
              prepend-inner-icon="mdi-passport"
              :rules="[() => !!passNum[n-1] || 'This field is required', () => /^[a-z0-9A-Z0-9]*$/.test(passNum[n-1]) || 'No special characters allowed', () => passNum[n-1].length >= 5 || 'Passport number must be at least 5 characters', () => passNum[n-1].length <= 15 || 'Passport number must be at most 15 characters']"
              outlined
              color="blue"
              @focus="addValue(n-1)"
            />
          </v-col>
          <v-col cols="12" sm="4" class="my-0 py-0">
            <v-menu
              v-model="passportMenus[n-1]"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="passExpireDateText[n-1]"
                  outlined
                  label="Passport expire date"
                  readonly
                  prepend-inner-icon="mdi-calendar"
                  :rules="[() => !!passExpireDate[n-1] || 'This field is required']"
                  color="blue"
                  v-on="on"
                  @focus="expire(n-1)"
                />
              </template>
              <v-date-picker
                v-model="passExpireDate[n-1]"
                color="late"
                :rules="[() => !!passExpireDate[n-1] || 'This field is required']"
                :min="minExpireDate"
                type="date"
                @input="passportMenus[n-1] = false, formatDate(passExpireDate[n-1] , n-1, 'passport')"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" sm="4" class="my-0 py-0">
            <v-autocomplete
              v-model="issueCountry[n-1]"
              :rules="[() => !!issueCountry[n-1] || 'This field is required']"
              :items="countries"
              item-text="name"
              item-value="code"
              placeholder="Issuing Country"
              name="issue-country-for-passports"
              required
              outlined
              prepend-inner-icon="mdi-flag"
              hide-no-data
              color="blue"
              autocomplete="off"
              :menu-props="{ auto: true, maxWidth: 200, overflowY: true }"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-form>
    <v-btn v-if="travellers" block :loading="loading" class="late px-12 py-5 white--text" @click="submit">
      book now
    </v-btn>
    <v-btn v-else class="brown px-12 py-5 white--text" @click="submit">
      Continue to payment
    </v-btn>
  </div>
</template>

<script>

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['travellers', 'loading'],
  data () {
    return {
      menu1: [],
      passportMenus: [],
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
      passengerTitle: [],
      passengerGender: [],
      search: [],
      passengerFirstName: [],
      passengerLastName: [],
      dateOfBirth: [],
      dateOfBirthText: [],
      passExpireDate: [],
      passExpireDateText: [],
      minExpireDate: '',
      passNum: [''],
      issueCountry: [],
      travellersData: [],
      passengers: null,
      requiredRule: [
        v => !!v || 'Field is required'
      ],
      snackbar: false,
      color: '',
      text: ''
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
    const passengersNum = Number(this.passengers.adults) + Number(this.passengers.children) + Number(this.passengers.infants)
    for (let i = 0; i < passengersNum; i++) {
      this.passportMenus[i] = false
      this.menu1[i] = false
      this.dateOfBirth.push('')
      this.passNum.push('')
    }
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
      if (type === 'passport') { this.passExpireDateText[i] = newDate }
      if (type === 'birthDate') { this.dateOfBirthText[i] = newDate }
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
      this.travellersData = []
      for (let index = 0; index < this.passengersNum; index++) {
        let type
        let title
        let gender
        if (this.passengerGender[index]) {
          this.passengerGender[index] === 'Male' ? gender = 'M' : gender = 'F'
        }
        if (this.adultsNum >= (index + 1)) {
          type = 'ADT'
          title = this.passengerTitle[index]
          if (this.passengerGender[index] === undefined) {
            if (title === 'Mr') {
              this.passengerGender[index] = 'M'
              gender = 'M'
            } else if (['Mrs', 'Ms', 'Miss'].includes(title)) {
              this.passengerGender[index] = 'F'
              gender = 'F'
            }
          }
        } else if (this.childrenNum >= ((index + 1) - this.adultsNum)) {
          type = 'CNN'
          title = 'CHD'
        } else if (this.infantsNum >= ((index + 1) - (this.adultsNum + this.childrenNum))) {
          type = 'INF'
          title = 'INF'
        }
        this.travellersData.push({
          passengerType: type,
          passengerTitle: title,
          passengerGender: gender,
          passengerFirstName: this.passengerFirstName[index],
          passengerLastName: this.passengerLastName[index],
          date_of_birth: this.dateOfBirth[index],
          passport_number: this.passNum[index],
          passport_expire_date: this.passExpireDate[index],
          passport_issue_country: this.issueCountry[index]
        })
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
      this.$refs.form.validate()
      if (this.travellersFormValid) {
        const fullNames = []
        for (let index = 0; index < this.passengerFirstName.length; index++) {
          fullNames.push(`${this.passengerFirstName[index]} ${this.passengerLastName[index]}`)
        }
        if (new Set(fullNames).size === fullNames.length) {
          if (this.phone.isValid) {
            this.snackbar = false
            this.prepareTravellersData()
            const contactInfo = {
              name: this.name,
              email: this.email,
              phone: this.phone
            }
            this.$emit('dataReady', this.travellersData, contactInfo)
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Please provide a valid phone number'
          }
        } else {
          this.snackbar = true
          this.color = 'warning'
          this.text = 'Please avoid using similar names for passengers'
          return false
        }
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please fill all fields to cotinue'
      }
    }
  }
}
</script>
