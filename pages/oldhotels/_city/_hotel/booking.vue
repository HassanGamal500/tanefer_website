<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <v-form
      v-if="bookingSubmit"
      id="frm"
      method="POST"
      :action="bookingSubmit.redirectUrl"
      name="frm"
      @submit="onSubmit"
    >
      <input v-for="(value, name, index) in bookingSubmit.requestParams" :key="index" type="hidden" :name="name" :value="value">
      <input type="submit" hidden value="hiiii">
    </v-form>
    <searchTimedOut v-if="hotelsOverlay" />
    <div v-if="loaded" class="text-center my-10">
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <img max-width="200" class="blink-2" src="../../../../assets/images/tanfer.png" />
    </div>
    <v-snackbar v-model="snackbar" :color="color" top :timeout="5000">
      <v-row justify="space-between">
        <p class="white--text">
          {{ text }}
        </p>
        <v-btn icon @click="snackbar = false">
          <v-icon color="white">
            mdi-close
          </v-icon>
        </v-btn>
      </v-row>
    </v-snackbar>
    <p v-if="!loaded && !dataReady" class="font-weight-bold body-1 text-center">
      The room or rooms you want aren't available any more <small id="returnBtn" class="body-1 blue--text" @click="$router.push({ name: 'hotels' })">Search again</small>
    </p>
    <div v-if="!loaded && dataReady" class="t-container">
      <div v-if="availability.AvailableForBook" class="room-boking-row">
        <div class="room-reserv-block">
          <div class="room-bookink-hed">
            <img :src="hotel.images[0]" loading="lazy" height="200" alt="" class="room-bokink-img">
            <div class="room-bookink-title">
              <div class="hotel-page-head-name-block">
                <h1 class="hotel-page-name-h1">
                  {{ hotel.HotelName }}<br>
                </h1>
                <div class="stars-bar _5-star" />
              </div>
              <div class="room-page-score">
                <div class="hotel-page-address col">
                  <img src="../../../../assets/images/location-icon.png" loading="lazy" alt="" class="small-map-icon">
                  <div class="hotel-address-txt">
                    {{ hotel.HotelAddress }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="room-border-block mt-5">
            <h2 class="room-booking-room-name">
              Standard Room with Garden View<br>
            </h2>
            <div class="room-booking-info">
              <div class="room-booking-info-block">
                <div class="room-booking-info-lable">
                  CHECK-IN
                </div>
                <div class="room-booking-info-valu">
                  <date-display :date="hotel.checkInDate" />
                </div>
              </div>
              <div class="room-booking-info-block">
                <div class="room-booking-info-lable">
                  CHECK-out
                </div>
                <div class="room-booking-info-valu">
                  <date-display :date="hotel.CheckOutDate" />
                </div>
              </div>
              <div class="room-booking-info-block">
                <div class="room-booking-info-lable">
                  nights
                </div>
                <div class="room-booking-info-valu">
                  {{ getNights() }} nights
                </div>
              </div>
            </div>
            <div class="small-option-row">
              <div v-html="uniqueRooms[0].description" />
              <br>
            </div>
          </div>
          <div class="room-border-block mt-5">
            <h2 class="room-booking-block-title">
              Guest Details<br>
            </h2>
            <div class="w-form">
              <v-form ref="form" v-model="valid">
                <v-card class="pa-5" outlined elevation="0">
                  <p class="headline font-weight-regular">
                    Contact Person Details
                  </p>
                  <v-row>
                    <v-col cols="12" md="6" class="py-0">
                      <mobile-input class="mb-5" :phone="phone.nationalNumber" @update="assignPhone" />
                    </v-col>
                    <v-col cols="12" md="6" class="py-0">
                      <v-text-field
                        v-model="email"
                        outlined
                        :rules="[v => !!v || 'E-mail is required', v => /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(v) || 'E-mail must be valid']"
                        label="E-mail"
                        required
                        color="blue"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-for="(room, i) in rooms" :key="i" class="px-5">
                    <v-col cols="12" class="px-0">
                      <p class="headline font-weight-regular">
                        Room {{ i + 1 }} Guests Details
                      </p>
                    </v-col>
                    <v-divider />
                    <v-row v-for="n in $store.state.hotelSearch.guestsInfo[i].adults" :key="(n * 100) + previousNumber('adult', i)">
                      <v-col cols="12" class="body-1 font-weight-bold">
                        Adult {{ n }}
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-select
                          v-model="guestTitles[(n - 1) + (i) + (previousNumber('adult', i))]"
                          :items="['Mr', 'Mrs', 'Ms', 'Miss']"
                          label="Title"
                          outlined
                          required
                          :rules="[v => !!v || 'Item is required']"
                          color="blue"
                        >
                          <template #selection="{ item }">
                            <span class="primary--text caption">{{ item }}</span>
                          </template>
                        </v-select>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="adultFirstNames[(n - 1) + (i) + (previousNumber('adult', i))]"
                          outlined
                          :rules="nameRule"
                          label="First name"
                          required
                          color="blue"
                          autocomplete="off"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="adultLastNames[(n - 1) + (i) + (previousNumber('adult', i))]"
                          outlined
                          :rules="nameRule"
                          label="Last name"
                          required
                          color="blue"
                          autocomplete="off"
                        />
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-row justify="space-around">
                          <p class="ma-0 mt-3">
                            Leader
                          </p>
                          <input
                            v-model="isLeader"
                            type="radio"
                            style="width: 19px; height: 50px;"
                            :value="(n - 1) + (i) + (previousNumber('adult', i))"
                          >
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row v-for="n in $store.state.hotelSearch.guestsInfo[i].children" :key="(n) + previousNumber('child', i)">
                      <v-col cols="12" class="body-1 font-weight-bold">
                        Child {{ n }}
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-select
                          v-model="childrenTitles[(n - 1) + (i) + (previousNumber('child', i))]"
                          :items="['Mr', 'Miss']"
                          label="Title"
                          outlined
                          required
                          :rules="[v => !!v || 'Item is required']"
                          color="blue"
                        >
                          <template #selection="{ item }">
                            <span class="primary--text caption">{{ item }}</span>
                          </template>
                        </v-select>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="childrenFirstNames[(n - 1) + (i) + (previousNumber('child', i))]"
                          outlined
                          :rules="nameRule"
                          label="First name"
                          required
                          color="blue"
                          autocomplete="off"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="childrenLastNames[(n - 1) + (i) + (previousNumber('child', i))]"
                          outlined
                          :rules="nameRule"
                          label="Last name"
                          required
                          color="blue"
                          autocomplete="off"
                        />
                      </v-col>
                    </v-row>
                  </v-row>
                </v-card>
                <v-card class="pa-5 my-5" outlined elevation="0">
                  <p class="headline font-weight-regular">
                    Payment
                  </p>
                  <v-expansion-panels class="elevation-0">
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        <span class="body-1 font-weight-bold">Hotel policy</span>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <div>
                          <div v-for="(policy, n) in availability.HotelPolicies" :key="n">
                            <div v-html="policy" />
                          </div>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        <span class="body-1 font-weight-bold">Cancelation</span>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <div>
                          <p class="body-2">
                            {{ availability.DefaultPolicy }}
                          </p>
                          <p v-if="availability.lastCancellationDeadLine">
                            Cancellation DeadLine: <date-display :date="availability.lastCancellationDeadLine" />
                          </p>
                          <div v-if="availability.cancelPolicies && availability.cancelPolicies.length > 0">
                            <p v-for="(policy, i) in availability.cancelPolicies" :key="i">
                              {{ policy.roomType }} From <date-display :date="policy.fromDate" /> to <date-display :date="policy.toDate" /> cancelation charge {{ policy.chargeType === 'Fixed' ? '$' : '%' }}{{ policy.cancellationCharge }}
                            </p>
                          </div>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <!-- <credit class="mt-5" @card="setCardData" @expire="setCardExpiry" @cvv="setCVV" /> -->
                  <v-checkbox v-model="acceptCancellation" :rules="[v => !!v || 'Please accept cancilation policies to continue']" label="I Accept cancellation policies" />
                </v-card>
              </v-form>
            </div>
          </div>
          <v-btn block :disabled="!valid" :loading="loading" class="late white--text text-capetalize my-5 py-2" @click="prepareBooking">
            Complete Booking
          </v-btn>
        </div>
        <div class="room-price-summary">
          <div class="price-details-block">
            <div class="price-details-title">
              Price details<br>
            </div>
            <v-alert
              v-model="alert"
              border="left"
              color="warning"
              dark
              dismissible
            >
              {{ alertText }}
            </v-alert>
            <div class="room-price-row">
              <div class="room-price-cell">
                Base<br>
              </div>
              <div class="room-price-cell-price">
                ${{ changeRoomsPrice().summary.baseFare * $store.state.hotelSearch.guestsInfo.length }}<br>
              </div>
            </div>
            <div class="room-price-row">
              <div class="room-price-cell">
                Services<br>
              </div>
              <div class="room-price-cell-price">
                ${{ changeRoomsPrice().summary.ServiceTax * $store.state.hotelSearch.guestsInfo.length }}<br>
              </div>
            </div>
            <div class="room-price-row">
              <div class="room-price-cell">
                Tax<br>
              </div>
              <div class="room-price-cell-price">
                ${{ changeRoomsPrice().summary.tax * $store.state.hotelSearch.guestsInfo.length }}<br>
              </div>
            </div>
            <div class="room-price-row totlal-price">
              <div class="room-price-cell">
                Total<br>
              </div>
              <div>${{ changeRoomsPrice().price }}<br></div>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="font-weight-bold body-1 text-center">
        The room or rooms you want aren't available any more <small id="returnBtn" class="body-1 blue--text" @click="$router.push({ name: 'hotelDetails' })">Return</small>
      </p>
    </div>
    <v-dialog
      v-model="priceChangeDialog"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title
          class="headline secondary"
          primary-title
        >
          Price Change
        </v-card-title>

        <v-card-text>
          Please note that some rooms' prices have been changeda and the new price is <span class="body-1 primary--text font-weight-bold">${{ getNewPrice() }}</span>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="priceChangeDialog = false; $router.push({ name: 'hotelsResults' })"
          >
            Back To Results
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="priceChangeDialog = false; book()"
          >
            Book
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- autosubmit form -->
  </div>
</template>

<script>
import HotelsServices from '~/services/HotelsServices'

export default {
  data () {
    return {
      loaded: true,
      dataReady: false,
      alert: false,
      alertText: '',
      acceptCancellation: true,
      searchTerms: {},
      hotel: {},
      rooms: [],
      nameRule: [v => (!!v && v.length > 1) || 'Item is required at least 2 characters',
        v => /^[A-Za-z][A-Za-z]*$/.test(v) || 'Name Must be letters only with no spaces'
      ],
      valid: true,
      snackbar: false,
      text: '',
      color: '',
      loading: false,
      isLeader: 0,
      guestTitles: [],
      childrenTitles: [],
      adultFirstNames: [],
      adultLastNames: [],
      childrenFirstNames: [],
      childrenLastNames: [],
      email: '',
      phone: '',
      cardNum: '',
      cardCode: '',
      creditType: '',
      cardExpireDate: '',
      availability: {},
      supplements: [],
      uniqueRooms: [],
      bookingNo: '',
      guestsData: [],
      priceChangeDialog: false,
      hotelsTimeOut: null,
      hotelsOverlay: false,
      bookingSubmit: {}
    }
  },
  head () {
    return {
      title: 'Booking ' + this.$route.params.hotel
    }
  },
  created () {
    this.searchTerms = this.$store.state.roomsParams ? this.$store.state.roomsParams : this.$route.query
    if (this.searchTerms.rooms && Array.isArray(this.searchTerms.rooms)) {
      this.hotel = this.searchTerms.hotel
      this.rooms = this.searchTerms.rooms
      this.uniqueRooms = this.getUniqueRooms(this.rooms)
      this.supplements = this.searchTerms.supplementsd
      let term = `sessionId=${this.searchTerms.sessionId}&hotelIndex=${this.searchTerms.hotelIndex}&hotelCode=${this.searchTerms.hotelCode}`
      if (this.searchTerms.rooms) {
        const rooms = this.searchTerms.rooms.sort((a, b) => { return a.roomIndex - b.roomIndex })
        rooms.forEach((room) => {
          term = term + `&roomIndex[]=${room.roomIndex}`
        })
        HotelsServices.checkHotelAvailablity(term).then((res) => {
          if (res.data.status === false) {
            this.loaded = false
            this.dataReady = false
          } else {
            this.loaded = false
            this.dataReady = true
            this.availability = res.data.data
          }
        }, () => {
          this.loaded = false
          this.dataReady = false
        })
      } else {
        this.loaded = false
        this.dataReady = false
      }
    } else {
      this.loaded = false
      this.dataReady = false
    }
  },
  methods: {
    assignPhone (phone) {
      this.phone = phone
    },
    setCardData (number, type) {
      this.cardNum = number
      switch (type) {
        case 'visa':
          this.creditType = 'VI'
          break
        case 'mastercard':
          this.creditType = 'CA'
          break
        case 'american-express':
          this.creditType = 'AX'
          break
        case 'discover':
          this.creditType = 'DS'
          break
        case 'diners-club':
          this.creditType = 'DN'
          break
        default:
          this.creditType = type
          break
      }
    },
    setCardExpiry (date) {
      this.cardExpireDate = date
    },
    setCVV (cvv) {
      this.cardCode = cvv
    },
    changeRoomsPrice () {
      let price = 0
      if (this.availability.priceChanged || this.availability.priceChanged === 'true') {
        for (let i = 0; i < this.rooms.length; i++) {
          this.rooms[i].rateSummary = this.availability.rooms[i].rateSummary
        }
        let text = 'Please notice that the rooms prices has changed as follows'
        this.rooms.forEach((room) => {
          price = price + room.rateSummary.totalFare
        })
        for (let i = 0; i < this.rooms.length; i++) {
          text += ` room number ${i + 1} price is $${this.rooms[i].rateSummary.totalFare} `
        }
        this.alert = true
        this.alertText = text
      } else {
        this.rooms.forEach((room) => {
          price = price + Number(room.rateSummary.totalFare)
        })
      }
      return { price: price.toFixed(2), summary: this.rooms[0].rateSummary }
    },
    getNewPrice () {
      let price = 0
      this.rooms.forEach((room) => {
        price = price + room.rateSummary.totalFare
      })
      return price.toFixed(2)
    },
    previousNumber (type, i) {
      if (type === 'adult') {
        if (i > 0) {
          let number = 0
          for (let n = 0; n < i; n++) {
            number = number + this.$store.state.hotelSearch.guestsInfo[n].adults
          }
          return number
        } else { return 0 }
      } else if (i > 0) {
        let number = 0
        for (let n = 0; n < i; n++) {
          number = number + this.$store.state.hotelSearch.guestsInfo[n].children
        }
        return number
      } else { return 0 }
    },
    prepareBooking () {
      this.$refs.form.validate()
      if (this.valid) {
        this.loading = true
        const fullNames = []
        for (let index = 0; index < this.adultFirstNames.length; index++) {
          if (this.adultFirstNames[index] && this.adultLastNames[index]) { fullNames.push(`${this.adultFirstNames[index]} ${this.adultLastNames[index]}`) }
        }
        for (let index = 0; index < this.childrenFirstNames.length; index++) {
          if (this.childrenFirstNames[index] && this.childrenLastNames[index]) { fullNames.push(`${this.childrenFirstNames[index]} ${this.childrenLastNames[index]}`) }
        }
        if (new Set(fullNames).size === fullNames.length) {
          if (this.phone && this.phone.isValid) {
            this.prepareGuestsData()
            this.book()
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Please provide a valid phone number'
            this.loading = false
          }
        } else {
          this.snackbar = true
          this.color = 'warning'
          this.text = 'Please avoid using similar names for guests'
          this.loading = false
        }
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please fill all fields to cotinue'
      }
    },
    getNights () {
      const checkIn = new Date(this.hotel.checkInDate)
      const checkOut = new Date(this.hotel.CheckOutDate)
      const DifferenceInTime = checkOut.getTime() - checkIn.getTime()
      return DifferenceInTime / (1000 * 3600 * 24)
    },
    prepareGuestsData () {
      this.guestsData = []
      for (let i = 0; i < this.$store.state.hotelSearch.guestsInfo.length; i++) {
        for (let n = 0; n < this.$store.state.hotelSearch.guestsInfo[i].adults; n++) {
          const guest = {
            isLead: this.isLeader === ((this.previousNumber('adult', i)) + i + n) ? 1 : 0,
            title: this.guestTitles[(this.previousNumber('adult', i)) + i + n],
            firstName: this.adultFirstNames[(this.previousNumber('adult', i)) + i + n],
            lastName: this.adultLastNames[(this.previousNumber('adult', i)) + i + n],
            guestType: 'Adult',
            InRoom: i + 1
          }
          this.guestsData.push(guest)
        }
        for (let n = 0; n < this.$store.state.hotelSearch.guestsInfo[i].children; n++) {
          const guest = {
            isLead: 0,
            title: this.childrenTitles[(this.previousNumber('child', i)) + i + n],
            firstName: this.childrenFirstNames[(this.previousNumber('child', i)) + i + n],
            lastName: this.childrenLastNames[(this.previousNumber('child', i)) + i + n],
            guestType: 'Child',
            InRoom: i + 1,
            childAge: this.$store.state.hotelSearch.guestsInfo[i].childrenAges[n]
          }
          this.guestsData.push(guest)
        }
      }
    },
    book () {
      this.loading = true
      const body = {
        guestNationality: this.$store.state.countryCode,
        sessionId: this.searchTerms.sessionId,
        numberOfRooms: this.rooms.length,
        hotelIndex: this.searchTerms.hotelIndex,
        hotelCode: this.searchTerms.hotelCode,
        hotelName: this.hotel.HotelName,
        lastCancellationDeadLine: this.availability.lastCancellationDeadLine,
        phoneNumber: this.phone.nationalNumber,
        countryIsoCode: this.phone.countryCode,
        email: this.email,
        guests: this.guestsData,
        rooms: []
      }
      // add room supplements to rooms & add rooms to body
      for (let i = 0; i < this.rooms.length; i++) {
        const supplements = []
        if (this.rooms[i].supplements) {
          this.rooms[i].supplements.forEach((sup) => {
            if (sup.isMandatory) {
              supplements.push({
                id: sup.id,
                chargeType: sup.chargeType,
                price: sup.price,
                isSelected: 1
              })
            } else {
              this.supplements.forEach((selectedSup) => {
                if (sup.id === selectedSup.id && this.rooms[i].roomIndex === selectedSup.room) {
                  selectedSup.accept
                    ? supplements.push({
                      id: sup.id,
                      chargeType: sup.chargeType,
                      price: sup.price,
                      isSelected: 1
                    })
                    : supplements.push({
                      id: sup.id,
                      chargeType: sup.chargeType,
                      price: sup.price,
                      isSelected: 0
                    })
                }
              })
            }
          })
        }
        const room = {
          roomType: this.rooms[i].roomName,
          roomIndex: this.rooms[i].roomIndex,
          roomCode: this.rooms[i].roomCode,
          ratePlanCode: this.rooms[i].ratePlanCode,
          roomFare: this.rooms[i].rateSummary.baseFare,
          currency: this.rooms[i].rateSummary.currency,
          roomTax: this.rooms[i].rateSummary.tax,
          totalFare: this.rooms[i].rateSummary.totalFare,
          supplements
        }
        body.rooms.push(room)
      }
      HotelsServices.bookHotel(body).then((response) => {
        this.loading = false
        if (response.data.status === false) {
          this.text = response.data.message
          this.color = 'error'
          this.snackbar = true
        } else if (response.data.status === 406) {
          this.priceChangeDialog = true
          this.rooms = response.data.data.NotBooked.rooms
        } else {
          this.hotelsOverlay = false
          this.bookingSubmit = response.data.data
          this.$router.push({ name: 'hotels-city-hotel-bookingConfirm', query: { bookingInfo: response.data.data, hotel: this.hotel } })
        }
      }, () => {
        this.loading = false
        this.text = 'Something went wrong, please try again in a few minutes'
        this.color = 'error'
        this.snackbar = true
      })
    },
    onSubmit (x) {
      // this.$router.push({ name: 'confirmHotelBooking', params: { hotel: this.hotel } })
    },
    getUniqueRooms (rooms) {
      const uniqueRooms = rooms.reduce((acc, current) => {
        const x = acc.find(item => item.roomName === current.roomName && item.rateSummary.totalFare === current.rateSummary.totalFare)
        if (!x) {
          return acc.concat([current])
        } else {
          return acc
        }
      }, [])
      return uniqueRooms
    }
  }
}
</script>

<style>
    #returnBtn:hover {
        cursor: pointer;
    }
</style>
