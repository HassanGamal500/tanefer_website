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
    <v-img v-if="!flight && loaded" max-width="200" class="blink-2 mx-auto my-5" src="../../assets/tanfer.png" />
    <p v-if="!flight && !loaded" class="text-center my-5">
      Sorry, Couldn't fetch the flight details
    </p>
    <div v-if="flight && !loaded" class="t-container">
      <div class="steps-booking">
        <div class="book-steg">
          <div :class="travellersPhase ? 'setp-title current' : 'setp-title'">
            Traveller Details<br>
          </div>
        </div>
        <div class="book-steg">
          <div :class="paymentPhase ? 'setp-title current' : 'setp-title'">
            Payment<br>
          </div>
        </div>
        <div class="book-steg">
          <div :class="confirmationPhase ? 'setp-title current' : 'setp-title'">
            Confirmation<br>
          </div>
        </div>
      </div>
      <v-btn v-show="paymentPhase && !confirmationPhase" color="late" text @click="backTo()">
        <v-icon left>
          mdi-chevron-left
        </v-icon>Back To previous phase
      </v-btn>
      <div v-if="!confirmationPhase" class="flight-book-flex">
        <div v-show="!paymentPhase && !confirmationPhase && travellersPhase" class="col-75">
          <div class="w-form">
            <travellers-data :travellers="numberOfPassenger" :loading="loading" @dataReady="submitTravellersData" />
          </div>
        </div>
        <div v-show="paymentPhase && !confirmationPhase" class="col-75">
          <div class="w-form">
            <div class="d-flex" style="justify-content: space-between">
              <v-btn :loading="loading" class="brown white--text py-5 mt-5 px-12" @click="book">
                Pay ${{ bookFor === 'flight' ? flight.pricingInfo.TotalFare : packagePrice }}
              </v-btn>
              <v-btn class="brown white--text py-5 mt-5 px-12" @click="goTo('travellers')">
                Back
              </v-btn>
            </div>
          </div>
        </div>
        <aside class="price-sumery">
          <div v-if="$route.params.module === 'trip'" class="flight-review-border stiky">
            <div class="summry-title">
              Trip Summary<br>
            </div>
            <div v-if="packageDetails">
              <h3>{{ packageDetails.name }}</h3>
              <h4>{{ packageDetails.start_date }}</h4>
              <div v-if="packageDetails.cities.length > 0">
                <span v-for="(city, index) in packageDetails.cities" :key="index + '_city'">
                  {{ city.cityName }}
                  <span v-if="index != (packageDetails.cities.length - 1)">-</span>
                </span>
              </div>
            </div>
            <div class="summry-total-box">
              <div class="total-title">
                Total<br>
              </div>
              <div>${{ bookFor === 'flight' ? flight.pricingInfo.TotalFare : packagePrice }}<br></div>
            </div>
            <div v-if="!travellersPhase && !paymentPhase && !confirmationPhase" class="flight-book-bt" @click="goTo('travellers')">
              Continue to checkout
            </div>
          </div>
          <div v-else-if="$route.params.module === 'adventure'" class="flight-review-border stiky">
            <div v-for="(item) in selectedAdventures" :key="item.activity_id" class="d-flex justify-space-between">
              <div class="body-1">
                {{ item.activityTitle }}
              </div>
            </div>
            <v-divider class="my-2" />
            <div class="d-flex justify-space-between">
              <div class="room-price-cell">
                Total<br>
              </div>
              <div class="late--text font-weight-bold ml-3">
                ${{ adventuresTotalPrice() }}<br>
              </div>
            </div>
          </div>

          <div v-else class="flight-review-border stiky">
            <div v-for="(item, i) in $store.state.cruiseReserveData.rooms" :key="i" class="d-flex justify-space-between">
              <div class="body-1">
                {{ item.type }}
              </div>
              <div class="body-1">
                {{ item.quantity }}
              </div>
            </div>
            <v-divider class="my-2" />
            <div class="d-flex justify-space-between">
              <div class="body-1">
                From
              </div>
              <div class="body-1">
                {{ $store.state.cruiseReserveData.start_date }}
              </div>
            </div>
            <div class="d-flex justify-space-between">
              <!-- <div class="body-1">
                To
              </div> -->
              <!-- <div class="body-1">
                {{ $store.state.cruiseReserveData.end_date }}
              </div> -->
            </div>
            <v-divider class="my-2" />
            <div class="d-flex justify-space-between">
              <div class="room-price-cell">
                Total<br>
              </div>
              <div class="late--text font-weight-bold ml-3">
                ${{ $store.state.cruiseReserveData.totalPrice }}<br>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div v-if="confirmationPhase" class="tickit-box">
        <div v-if="$route.params.module === 'trip'" class="flight-review-border">
          <div class="airline-head">
            <div class="airline-head-title">
              Your trip was booked successfully
            </div>
          </div>
          <div v-if="packageDetails">
            <h2>{{ packageDetails.name }}</h2>
            <h5>Start on: <strong>{{ packageDetails.start_date }}</strong> for <strong>{{ packageDetails.night_numbers }}</strong> Days</h5>
            <h5 class="mb-5">
              Price: <strong>${{ packagePrice }}</strong>
            </h5>
            <div v-for="(city, index) in packageDetails.cities" :key="index + '_packageDetailsCities'" class="mb-5">
              <h4>{{ index + 1 }} - {{ city.cityName }}</h4>
              <h5>Activities:</h5>
              <div v-for="(activity, index1) in city.cityActivities" :key="index1 + '_packageDetailsCitiesActivities'">
                <div v-for="(act, index3) in city.cityActivities[index1]" :key="index3 + '_packageDetailsCitiesActs'" class="ml-5">
                  <h5>- {{ act.activity.activityTitle }}</h5>
                </div>
              </div>
              <h5>Hotels:</h5>
              <div v-for="(hotel, index2) in city.cityHotels" :key="index2 + '_packageDetailsCitiesHotels'" class="ml-5">
                <h5>- {{ hotel.hotelName }} Hotel</h5>
              </div>
            </div>
          </div>
          <NuxtLink to="/trips">
            <v-btn class="brown white--text py-5 mt-5 mr-5 px-12">
              Check Trips
            </v-btn>
          </NuxtLink>
        </div>
        <div v-if="$route.params.module === 'adventure'" class="flight-review-border">
          <div v-if="succesfullPayment">
            <v-card-title class="late--text">
              Booked Activities
            </v-card-title>
            <table border="2" width="100%">
              <thead>
                <tr>
                  <th class="text-left brown--text pl-5">
                    Activity
                  </th>
                  <th class="brown--text">
                    Date
                  </th>
                  <th class="brown--text">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedAdventures" :key="item.activity_id">
                  <td class="text-left pl-5">
                    {{ item.activityTitle }}
                  </td>
                  <td class="text-center">
                    {{ new Date(item.date).toDateString() }}
                  </td>
                  <td class="text-center">
                    ${{ item.price }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left font-weight-bold brown--text pl-5">
                    Total Price
                  </td>
                  <td />
                  <td class="text-center font-weight-bold brown--text">
                    ${{ adventuresTotalPrice() }}
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <NuxtLink to="/adventures">
                <v-btn class="brown white--text py-5 mt-5 mr-5 px-12">
                  Check Adventures
                </v-btn>
              </NuxtLink>
            </div>
          </div>
        </div>
        <NuxtLink to="/">
          <v-btn class="brown white--text py-5 mt-5 mr-5 px-12">
            Continue Browsing
          </v-btn>
        </NuxtLink>
      </div>
    </div>

    <form id="payment-form" method="POST" action="" />
  </div>
</template>

<script>
import tripsServices from '~/services/tripsServices'
import adventureServices from '~/services/activitiesServies'
import cruisesServices from '~/services/cruisesServices'

export default {
  data () {
    return {
      bookFor: 'package',
      packagePrice: '0',
      packageID: '',
      packageDetails: null,
      adults: 1,
      childre1: 0,
      priceSessionId: '',
      flightsTimeOut: null,
      flightsOverlay: false,
      snackbar: false,
      color: '',
      text: '',
      flight: null,
      loaded: true,
      travellersPhase: false,
      paymentPhase: false,
      confirmationPhase: false,
      store: {},
      travellersData: null,
      contactInfo: null,
      zip: '',
      requiredRule: [
        v => !!v || 'Field is required'
      ],
      address: '',
      cardExpireDate: '',
      cardNum: '',
      cvv: '',
      cardCode: '',
      loading: false,
      bookingData: {},
      random: Math.random(),
      numberOfPassenger: { adults: 1, children: 0, solo: 0 },
      succesfullPayment: true,
      selectedAdventures: []
    }
  },
  head () {
    return {
      title: 'Booking ' + this.$route.params.module
    }
  },
  beforeMount () {
    this.bookFor = localStorage.getItem('bookFor')
    this.packagePrice = localStorage.getItem('packagePrice')
    this.packageID = localStorage.getItem('packageID')
    this.packageDetails = JSON.parse(localStorage.getItem('package'))
    this.adults = localStorage.getItem('adults')
    this.children = localStorage.getItem('children')
    if (this.$route.params.module === 'cruise') {
      this.priceSessionId = this.$store.state.cruiseReserveData.session
    } else { this.priceSessionId = localStorage.getItem('priceSessionId') }
  },
  created () {
    this.store = this.$store.state
    this.travellersPhase = true
    this.loaded = false
    this.flight = {}
    if (this.$route.params.module === 'adventure') {
      if (this.$store.state.selectedAdventures && this.$store.state.travellersNumber.adults) {
        this.selectedAdventures = this.$store.state.selectedAdventures
        this.numberOfPassenger = this.$store.state.travellersNumber
        this.noData = false
        this.loaded = false
        if (this.$route.query.amount) {
          this.confirmPhase = true
          if (this.$route.query.response_message === 'Success') {
            this.succesfullPayment = true
          } else { this.succesfullPayment = false }
        }
      } else {
        this.noData = true
        this.loaded = false
      }
    } else if (this.$route.module === 'cruise') {
      this.numberOfPassenger = this.$store.state.cruiseGuests
      this.noData = false
      this.loaded = false
      if (this.$route.query.response_message && this.$route.query.response_message === 'Success') {
        this.confirmBooking()
        this.confirmPhase = true
        this.succesfullPayment = true
      } else if (this.$route.query.response_message) {
        this.snackbar = true
        this.color = 'error'
        this.text = this.$route.query.response_message
      }
    }
    if (this.$route.query.response_message && this.$route.query.response_message === 'Success') {
      this.confirmBooking()
      this.goTo('confirm')
    } else if (this.$route.query.response_message) {
      this.snackbar = true
      this.color = 'error'
      this.text = this.$route.query.response_message
    }
  },
  methods: {
    adventuresTotalPrice () {
      return this.$store.state.travellersNumber.totalPrice
    },
    generateTravellersLabel () {
      let passengersLabel = `${this.store.passengers.adults} ${this.store.passengers.adults > 1 ? 'Adults' : 'Adult'}`
      if (this.store.passengers.children > 0) { passengersLabel += `, ${this.store.passengers.children} ${this.store.passengers.children > 1 ? 'Children' : 'Child'}` }
      if (this.store.passengers.infants > 0) { passengersLabel += ` and ${this.store.passengers.infants} ${this.store.passengers.infants > 1 ? 'Infants' : 'Infant'}` }
      return passengersLabel
    },
    goTo (phase) {
      switch (phase) {
        case 'travellers':
          this.travellersPhase = true
          this.paymentPhase = false
          document.title = 'travellers Details'
          break
        case 'payment':
          this.paymentPhase = true
          document.title = 'flight payment'
          break
        case 'confirm':
          this.confirmationPhase = true
          this.paymentPhase = true
          document.title = 'flight done'
          break
      }
    },
    backTo () {
      if (this.paymentPhase && this.travellersPhase) {
        this.paymentPhase = false
        document.title = 'travellers Details'
      } else if (!this.paymentPhase && this.travellersPhase) {
        this.travellersPhase = false
        document.title = 'flight Details'
      }
    },
    submitTravellersData (travellers, contactInfo) {
      this.travellersData = travellers
      this.contactInfo = contactInfo
      this.book()
    },
    async book () {
      this.loading = true
      let body
      if (this.$route.params.module === 'trip') {
        body = {
          passengerDetails: this.travellersData,
          bookingDetails: {
            contact_name: this.contactInfo.name,
            contact_phone: this.contactInfo.phone.formattedNumber,
            contact_email: this.contactInfo.email
          }
        }
      } else if (this.$route.params.module === 'adventure') {
        body = {
          contact_email: this.contactInfo.email,
          contact_phone: this.contactInfo.phone.e164,
          passengerDetails: this.travellersData,
          solo: this.numberOfPassenger.solo,
          total_price: this.adventuresTotalPrice(),
          activities: this.$store.state.selectedAdventures,
          adults: this.numberOfPassenger.adults,
          children: this.numberOfPassenger.children
        }
      } else if (this.$route.params.module === 'cruise') {
        body = {
          contact_email: this.contactInfo.email,
          contact_phone: this.contactInfo.phone.e164,
          passengerDetails: this.travellersData,
          session_id: this.$store.state.cruiseReserveData.session,
          start_date: this.$store.state.cruiseReserveData.start_date,
          end_date: this.$store.state.cruiseReserveData.end_date,
          roomGuests: this.$store.state.cruiseRooms
        }
      }
      try {
        const form = document.getElementById('payment-form')
        form.setAttribute('action', 'https://be.tanefer.com/payment')
        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="sessionId" value="${this.priceSessionId}">`)
        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="email" value="${this.contactInfo.email}">`)
        let bookingData = null
        if (this.$route.params.module === 'trip') {
          await tripsServices.bookTrip(localStorage.getItem('bookingId'), body)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="price" value="${this.packagePrice}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="url" value="${window.location.origin + '/bookig/trip'}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="bookingId" value="${localStorage.getItem('bookingId')}">`)
          form.submit()
        } else if (this.$route.params.module === 'adventure') {
          const promise = adventureServices.bookAdventure(body)
          const response = await promise
          bookingData = response.data.data
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="bookingId" value="${bookingData.booking_id}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="price" value="${this.adventuresTotalPrice()}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="url" value="${window.location.origin + '/booking/adventure'}">`)
          form.submit()
        } else if (this.$route.params.module === 'cruise') {
          const promise = cruisesServices.bookCruise(this.$store.state.cruiseReserveData.cruiseId, body)
          const response = await promise
          bookingData = response.data.data
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="bookingId" value="${bookingData.booking_id}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="price" value="${this.$store.state.cruiseReserveData.totalPrice}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="url" value="${window.location.origin + '/booking/cruise'}">`)
          form.submit()
        }
      } catch (error) {
        this.loading = false
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong please try again in few minutes'
      }
    },
    confirmBooking () {
      const query = this.$route.fullPath.split('?')[1] + '&url=' + window.location.href
      tripsServices.confirmTripBooking(query)
    }
  }
}
</script>

  <style>
      .inactivePhase {
          border-bottom: 5px solid #e5e3e8;
      }
      .currentPhase {
          border-bottom: 5px solid #BD9468;
      }
      .summ {
          position: sticky;
          top: 0px;
      }
  </style>
