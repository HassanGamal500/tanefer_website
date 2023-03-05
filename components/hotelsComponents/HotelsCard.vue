<template>
  <div>
    <div v-for="hotel in hotels.Hotels" :key="hotel.HotelIndex" class="hotel-result-block">
      <div class="hotel-result-pic">
        <div class="result-img-holder">
          <v-img :src="hotel.HotelPicture" class="hotel-result-img" />
        </div>
      </div>
      <div class="hotel-result-info">
        <div class="hoterl-result-name">
          {{ hotel.HotelName }}
        </div>
        <div :class="`stars-bar _${hotel.stars}-star`" />
        <div class="hotel-result-address">
          <img src="../../assets/images/location-icon.png" loading="lazy" alt="">
          <div class="hotel-address-txt">
            {{ hotel.HotelAddress }}
          </div>
        </div>
      </div>
      <div class="hotel-result-price">
        <div class="_w-md-50-sm100">
          <div class="result-review-block">
            <div class="result-review-block-number">
              {{ hotel.TripAdviserRating }}
            </div>
          </div>
          <div class="trip-atv-row">
            <img src="../../assets/images/trip-advisor-icon.png" loading="lazy" alt="">
            <div class="tripatv-rating">
              <div class="tripatv-rating">
                <div v-for="n in parseInt(hotel.TripAdviserRating)" :key="n" class="tripatv-circle-outer">
                  <div class="tripatv-circle-inner" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="_w-md-50-sm100">
          <div class="hotel-totlal-price">
            ${{ hotel.pricingInfo.totalPrice }}
          </div>
          <div class="room-price-info">
            {{ getNights() }} Night(s)| {{ $store.state.hotelSearch.guestsInfo.length }} Room(s)| {{ hotels.roomGuests.Adults }} Adult(s), {{ hotels.roomGuests.Children }} Children
          </div>
          <div
            class="select-hotel"
            @click="select(hotel.HotelIndex, hotel.HotelName, hotel.HotelCode, $store.state.hotelSearch.guestsInfo.length)"
          >
            Select
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['hotels', 'session', 'resetTimer'],
  data () {
    return {
      now: null
    }
  },
  watch: {
    resetTimer (val) {
      if (val) { this.now = Date.now() }
    }
  },
  created () {
    this.now = Date.now()
  },
  methods: {
    getNights () {
      const checkIn = new Date(this.$store.state.hotelSearch.checkInDate)
      const checkOut = new Date(this.$store.state.hotelSearch.checkOutDate)
      const DifferenceInTime = checkOut.getTime() - checkIn.getTime()
      return DifferenceInTime / (1000 * 3600 * 24)
    },
    select (index, name, code, rooms) {
      const spentTime = Date.now() - this.now
      const timer = (20 * 60 * 1000) - spentTime
      localStorage.setItem('hotelsTimer', timer)
      this.$store.dispatch('setHotelParams', { sessionId: this.session, hotelIndex: index, hotelCode: code, roomsNo: rooms })
      this.$router.push({ name: 'hotels-city-hotel', params: { hotel: name }, query: { sessionId: this.session, hotelIndex: index, hotelCode: code, roomsNo: rooms } })
    }
  }
}
</script>
