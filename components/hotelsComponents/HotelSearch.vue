<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="5000"
      top
    >
      <v-row>
        {{ text }}
        <v-spacer />
        <v-icon small color="white" class="ml-3" @click="snackbar = false">
          mdi-close
        </v-icon>
      </v-row>
    </v-snackbar>
    <v-form ref="form" v-model="valid">
      <div>
        <v-row justify="end">
          <v-col cols="12" :md="$route.name === 'hotels' ? '4' : '3'" class="py-0">
            <cities-autoComplete />
          </v-col>
          <v-col cols="12" :md="$route.name === 'hotels' ? '4' : '4'" class="py-0">
            <v-row no-gutters>
              <v-col cols="6">
                <dates-input type="checkIn" />
              </v-col>
              <v-col cols="6">
                <dates-input type="checkOut" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" :md="$route.name === 'hotels' ? '4' : '3'" class="py-0">
            <rooms-and-guests />
          </v-col>
          <v-col v-if="$route.name !== 'hotels'" class="py-0" cols="12" sm="4" md="2">
            <v-btn
              color="brown white--text"
              height="60"
              :block="$vuetify.breakpoint.smAndDown"
              elevation="4"
              class="px-10"
              :large="$vuetify.breakpoint.mdAndUp"
              :disabled="!valid"
              @click="search"
            >
              <span class="body-1 text-capitalize font-weight-light">Search</span>
            </v-btn>
          </v-col>
        </v-row>
        <div v-if="$route.name === 'hotels'" class="py-0">
          <v-row justify="space-between" align="center">
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete
                id="nationality-autocomplete"
                v-model="guestNationality"
                :items="countries"
                item-text="name"
                item-value="code"
                placeholder="Nationality"
                :rules="[v => !!v || 'Item is required']"
                outlined
                prepend-inner-icon="mdi-flag"
                hide-no-data
                color="brown"
                hide-details
                autocomplete="off"
                dense
                height="52"
                return-object
              />
            </v-col>
            <v-btn
              color="brown white--text"
              :block="$vuetify.breakpoint.smAndDown"
              elevation="4"
              height="45"
              class="px-10 mr-5"
              :large="$vuetify.breakpoint.mdAndUp"
              :disabled="!valid"
              @click="search"
            >
              <span class="body-1 text-capitalize font-weight-light">Search</span>
            </v-btn>
          </v-row>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CitiesAutoComplete from '~/components/hotelsComponents/HotelsCities.vue'
import datesInput from '~/components/hotelsComponents/DatesInput.vue'

export default {
  components: {
    CitiesAutoComplete,
    datesInput
  },
  data () {
    return {
      sizes: null,
      snackbar: false,
      color: '',
      text: '',
      valid: true,
      guestNationality: { code: 'US', name: 'United States' }
    }
  },
  computed: {
    ...mapState(['countries'])
  },
  watch: {
    guestNationality (val) {
      if (val) { this.$store.dispatch('setCountryCode', val.code) } else { this.$store.dispatch('setCountryCode', 'US') }
    }
  },
  created () {
    this.sizes = this.$vuetify.breakpoint
    this.guestNationality = this.countries.find(item => item.code === this.$store.state.countryCode)
  },
  methods: {
    search () {
      this.$refs.form.validate()
      if (this.valid) {
        const hotelSearch = this.$store.state.hotelSearch
        const checkInDate = hotelSearch.checkInDate
        const checkOutDate = hotelSearch.checkOutDate
        const name = hotelSearch.destination.name
        const code = hotelSearch.destination.code
        const isHotel = hotelSearch.destination.isHotel
        const countryCode = this.guestNationality.code
        const length = hotelSearch.guestsInfo.length
        if (new Date(hotelSearch.checkInDate).getTime() > new Date().getTime() || hotelSearch.checkInDate === new Date().toISOString().substr(0, 10)) {
          if (new Date(hotelSearch.checkInDate).getTime() < new Date(hotelSearch.checkOutDate).getTime()) {
            let term = `checkIn=${checkInDate}&checkOut=${checkOutDate}&name=${name}&code=${code}&isHotel=${isHotel}&guestNationality=${countryCode}&starRating=All&numberOfRooms=${length}`
            for (let i = 0; i < hotelSearch.guestsInfo.length; i++) {
              term = term + `&roomGuests[${i + 1}][adults]=${hotelSearch.guestsInfo[i].adults}`
              if (hotelSearch.guestsInfo[i].children > 0) {
                term = term + `&roomGuests[${i + 1}][children]=${hotelSearch.guestsInfo[i].children}`
                for (let n = 0; n < hotelSearch.guestsInfo[i].children; n++) {
                  term = term + `&roomGuests[${i + 1}][childAge][]=${hotelSearch.guestsInfo[i].childrenAges[n]}`
                }
              }
            }
            this.$store.dispatch('setHotelTimeOut', false)
            if (this.$store.state.hotelSearchTimeOutFunction !== null) { this.$store.dispatch('clearHotelSearchTimeoutFunction') }
            if (this.$store.state.hotelTimeOutFunction) { this.$store.dispatch('clearHotelTimeoutFunction') }
            this.$store.dispatch('removeHotelsResults')
            this.$store.dispatch('setHotelSearchQuery', term)
            if (this.$route.name !== 'hotels-city') {
              this.$router.push({ name: 'hotels-city', params: { city: hotelSearch.destination.name }, query: { search: term } })
            } else { this.$emit('addHotels', term) }
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Please checkout date after the checkin date'
          }
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Please choose checkin date after today'
        }
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please fill all fields'
      }
    }
  }
}
</script>
