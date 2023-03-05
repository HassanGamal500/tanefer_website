<template>
  <div>
    <div v-if="hotel" class="hotel-confirm-container">
      <h1 class="hotel-confirm-page-title">
        Your booking at {{ hotel.HotelName }} is being processed.<em><br></em>
      </h1>
      <h3 class="display-1 font-weight-thin my-5 primary--text text-center">
        Your Details have been submitted successfully; An agent will contact you shortly to complete your booking!
      </h3>
      <v-img :src="hotel.images[0]" class="my-4" :height="$vuetify.breakpoint.smAndDown ? 250 : 400" />
      <GMap
        ref="gMap"
        language="en"
        :center="center"
        :zoom="16 "
        style="width:100%;"
        class="mt-5"
      >
        <GMapMarker
          v-for="(m, i) in markers"
          :key="i"
          :position="m.position"
          @click="center=m.position"
        />
      </GMap>
      <h3 class="hotel-confirm-h3">
        Reservation details<br>
      </h3>
      <div class="mb-5 hotel-confirm-block">
        <div class="hotel-confirm-row">
          <div class="hotel-confirm-title">
            <div>Check-in<br></div>
          </div>
          <div class="hotel-confirm-value">
            <div class="text-block-12">
              <date-display :date="hotel.checkInDate" />
            </div>
          </div>
        </div>
        <div class="hotel-confirm-row">
          <div class="hotel-confirm-title">
            <div>Check-out<br></div>
          </div>
          <div class="hotel-confirm-value">
            <div><date-display :date="hotel.CheckOutDate" /></div>
          </div>
        </div>
        <div class="hotel-confirm-row">
          <div class="hotel-confirm-title">
            <div>Your reservation<br></div>
          </div>
          <div class="hotel-confirm-value">
            <div>{{ getNights() }} nights, {{ $store.state.hotelSearch.guestsInfo.length }} rooms</div>
          </div>
        </div>
        <div class="hotel-confirm-row">
          <div class="hotel-confirm-title">
            <div>Location<br></div>
          </div>
          <div class="hotel-confirm-value">
            <div>{{ hotel.HotelAddress }}</div>
          </div>
        </div>
        <div class="hotel-confirm-row">
          <div class="hotel-confirm-title">
            <div>Phone<br></div>
          </div>
          <div class="hotel-confirm-value">
            <div>
              {{ hotel.HotelPhone }}
            </div>
          </div>
        </div>
        <div class="hotel-confirm-row">
          <div class="hotel-confirm-title">
            <div>Fax<br></div>
          </div>
          <div class="hotel-confirm-value">
            <div>
              {{ hotel.HotelFax }}
            </div>
          </div>
        </div>
      </div>

      <div class="text-center my-5">
        <nuxt-link to="/hotels" class="ma-5">
          Search Again
        </nuxt-link>
        <nuxt-link to="/" class="ma-5">
          Back Home
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      info: null,
      hotel: null,
      center: {
        lat: 0,
        lng: 0
      },
      markers: []
    }
  },
  head () {
    return {
      title: 'Confirming ' + this.$route.params.hotel + ' Booking'
    }
  },
  async created () {
    if (!this.$route.query.hotel) {
      this.$router.push({ name: 'hotels' })
    } else {
      this.hotel = await this.$route.query.hotel
      // eslint-disable-next-line
      console.log(this.hotel)
      this.center.lat = parseFloat(this.hotel.map.Latitude)
      this.center.lng = parseFloat(this.hotel.map.Longitude)
      this.markers.push({ position: this.center })
    }
  },
  methods: {
    getNights () {
      const checkIn = new Date(this.hotel.checkInDate)
      const checkOut = new Date(this.hotel.CheckOutDate)
      const DifferenceInTime = checkOut.getTime() - checkIn.getTime()
      return DifferenceInTime / (1000 * 3600 * 24)
    }
  }
}
</script>
