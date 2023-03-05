<template>
  <div>
    <div class="filfer-block">
      <div class="aside-title">
        price<span class="small-text"> /per night</span>
      </div>
      <v-row v-if="min < max" justify="space-between">
        <v-subheader color="secondary">
          ${{ min }}
        </v-subheader>
        <v-subheader color="secondary">
          ${{ max }}
        </v-subheader>
      </v-row>
      <v-row v-else justify="space-between">
        <v-subheader color="secondary text-center">
          ${{ min }}
        </v-subheader>
      </v-row>
      <v-range-slider
        v-if="min < max"
        v-model="prices"
        :min="min"
        :max="max"
        color="pink"
        class="align-center"
        thumb-label
        height="40"
        @change="applyFilters"
      />
    </div>
    <div class="filfer-block">
      <div class="aside-title">
        Star Rating<br>
      </div>
      <v-checkbox
        v-for="n in 5"
        :key="n"
        v-model="selectedStars"
        :value="6 - n"
        class="my-0"
        dense
        @change="applyFilters"
      >
        <!-- eslint-disable-next-line vue/no-lone-template, vue/v-slot-style -->
        <template v-slot:label>
          <span for="" :class="`stars-bar _${6 - n}-star w-form-label`" />
        </template>
      </v-checkbox>
      <v-checkbox v-model="selectedStars" dense value="unrated" label="Unrated" class="my-0" />
    </div>
    <div class="filfer-block">
      <div class="aside-title">
        Tripadvisor Rating<br>
      </div>
      <v-checkbox
        v-for="n in 5"
        :key="n + '+'"
        v-model="selectedRates"
        class="my-0"
        dense
        :value="6 - n"
        @change="applyFilters"
      >
        <template #label>
          <div class="tripatv-rating">
            {{ 6 - n }}+
            <div v-for="i in 5" :key="i" class="tripatv-circle-outer mt-1">
              <div v-if="i <= 6 - n" class="tripatv-circle-inner" />
            </div>
          </div>
        </template>
      </v-checkbox>
    </div>

    <div class="filfer-block">
      <div class="aside-title">
        Hotel Area<br>
      </div>
      <v-text-field
        v-model="area"
        label="Hotel Area"
        placeholder="ex. Dubai Mall"
        outlined
        @change="applyFilters"
      />
    </div>

    <div class="filfer-block-last">
      <div class="aside-title">
        Hotel Names<br>
      </div>
      <!-- <v-checkbox class="my-0" @change="applyFilters" dense v-for="hotel in hotelNames" :key="hotel" v-model="selectedHotels" :value="hotel">
            <template v-slot:label>
              <div>{{hotel}}</div>
            </template>
          </v-checkbox> -->
      <v-autocomplete
        v-model="selectedHotels"
        :items="hotelNames"
        outlined
        dense
        small-chips
        label="Hotel Name"
        multiple
        @change="applyFilters"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      min: null,
      max: null,
      prices: [],
      hotels: [],
      rates: [],
      hotelsCount: 0,
      loading: false,
      selectedStars: [],
      selectedRates: [],
      hotelNames: [],
      selectedHotels: [],
      area: ''
    }
  },
  created () {
    this.min = Math.floor(this.$store.state.hotels.minPrice)
    this.max = Math.floor(this.$store.state.hotels.maxPrice)
    this.prices = [this.min, this.max]
    this.rates = this.$store.state.hotels.tripAdviserRatingFilter
    this.hotels = [...this.$store.state.hotels.Hotels]
    this.hotelNames = this.$store.state.hotels.hotelsNames
    this.hotelsCount = this.hotels.length
  },
  methods: {
    applyFilters () {
      const priceMatched = this.matchPrices()
      let starsMatched
      let rateMatched
      let nameMatched
      let areaMatched
      if (this.selectedStars.length > 0) {
        starsMatched = this.matchStars(priceMatched)
      } else { starsMatched = priceMatched }
      if (this.selectedRates.length > 0) {
        rateMatched = this.matchRates(starsMatched)
      } else { rateMatched = starsMatched }
      if (this.selectedHotels.length > 0) {
        nameMatched = this.matchNames(rateMatched)
      } else { nameMatched = rateMatched }
      if (this.area) {
        areaMatched = this.matchArea(nameMatched)
      } else { areaMatched = nameMatched }
      this.getUniqueArray(areaMatched)
    },
    matchPrices () {
      const priceMatched = []
      this.hotels.forEach((hotel) => {
        if (Math.floor(hotel.pricingInfo.totalPrice) >= Math.floor(this.prices[0]) && Math.floor(hotel.pricingInfo.totalPrice) <= Math.floor(this.prices[1])) {
          priceMatched.push(hotel)
        }
      })
      return priceMatched
    },
    matchStars (hotels) {
      const starsMatched = []
      hotels.forEach((hotel) => {
        this.selectedStars.forEach((selected) => {
          if (hotel.stars === selected || (selected === 'unrated' && !hotel.stars)) {
            starsMatched.push(hotel)
          }
        })
      })
      return starsMatched
    },
    matchRates (hotels) {
      const rateMatched = []
      hotels.forEach((hotel) => {
        this.selectedRates.forEach((rate) => {
          if (hotel.TripAdviserRating >= rate && hotel.TripAdviserRating < parseInt(rate) + 1) {
            rateMatched.push(hotel)
          }
        })
      })
      return rateMatched
    },
    matchNames (hotels) {
      const nameMatched = []
      hotels.forEach((hotel) => {
        if (this.selectedHotels.includes(hotel.HotelName)) { nameMatched.push(hotel) }
      })
      return nameMatched
    },
    matchArea (hotels) {
      const areaMatched = []
      hotels.forEach((hotel) => {
        if (hotel.HotelAddress.includes(this.area)) { areaMatched.push(hotel) }
      })
      return areaMatched
    },
    getUniqueArray (hotels) {
      let uniqueHotels
      if (hotels.length > 1) {
        uniqueHotels = hotels.reduce((acc, current) => {
          const x = acc.find(item => item.HotelIndex === current.HotelIndex)
          if (!x) {
            return acc.concat([current])
          } else {
            return acc
          }
        }, [])
      } else { uniqueHotels = hotels }
      this.hotelsCount = uniqueHotels.length
      this.$emit('filterd', uniqueHotels)
    }
  }
}
</script>

<style>
    .filter-container {
        position: relative;
    }
    .filter-header {
        position: sticky;
        top: 0px;
        background-color: white;
        z-index: 9;
    }
    @media screen and (max-width: 960px) {
        .filter-container {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9;
            overflow-Y: auto;
            height: 100vh;
        }
        .card-title__filter {
            position: sticky;
            top: 0px;
            background-color: white;
            z-index: 9;
        }
    }
</style>
