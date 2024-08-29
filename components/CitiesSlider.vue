<template>
  <div style="padding-top: 110px;">
    <p v-if="$fetchState.error">
      error: {{ $fetchState.error.message }}
    </p>
    <div v-if="cities.length" :class="module !== 'tripsResults' ? 'booking-box trip' : 'trip'">
      <div class="w-form">
        <v-slide-group
          v-model="model"
          class="py-4"
          center-active
          show-arrows
        >
          <v-slide-item
            v-for="city in cities"
            :key="city.id"
            v-slot="{ toggle }"
          >
            <v-card
              class="ma-4"
              height="200"
              width="224"
              elevation="0"
              @click="toggle"
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
                <v-scale-transition>
                  <v-img
                    :src="city.cityImage"
                    class="white--text align-center"
                    gradient="to top, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                    width="224px"
                    :alt="city.cityImageAlt"
                  >
                    <div class="text-h4 align-center text-center mx-auto pa-5 font-weight-bold" style="height: 200px; width: 224px; background-color: rgba(0, 0, 0, 0.3);" @click="submit(city)" v-text="city.CityName" />
                    <span class="d-none">{{ city.cityImageCaption }}</span>
                  </v-img>
                </v-scale-transition>
              </v-row>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </div>
    </div>
  </div>
</template>

<script>
import tripsServices from '../services/tripsServices'

export default {
  middleware: 'store',
  props: {
    module: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      model: null,
      cities: []
    }
  },
  async fetch () {
    // if (!this.$store.state.cities.length) {
    let cityType = ''
    if (this.module === 'adventures') {
      cityType = 'adventure'
    } else if (this.module === 'cruises') {
      cityType = 'cruise'
    } else if (this.module === 'trips') {
      cityType = 'package'
    } else if (this.module === 'tripsResults') {
      cityType = 'package'
    }
    const res = tripsServices.getCities(cityType)
    const data = await res
    this.cities = data.data.cities
    // this.$store.dispatch('setCities', this.cities)
    // } else {
    //   this.cities = this.$store.state.cities
    // }
  },
  methods: {
    submit (city) {
      this.$store.dispatch('setTripCity', city)
      if (this.module === 'adventures') {
        // this.$router.push({ name: 'adventures-city', params: { city: city.CityName.toLowerCase().trim() }, query: { cityId: city.CityID } })
        this.$router.push({ name: 'adventures-city', params: { city: city.citySlug } })
      } else if (this.module === 'hotels') {
        this.$router.push({ name: 'hotel-city', params: { city: city.citySlug } })
      } else if (this.module === 'cruises') {
        // this.$router.push({ name: 'cruises-city', params: { city: city.CityName }, query: { cityId: city.CityID } })
        this.$router.push({ name: 'cruises-city', params: { city: city.citySlug } })
      } else if (module === 'tripsResults') {
        this.$emit('getTrips', city)
      } else {
        this.$router.push({ name: 'trips-city', params: { city: city.citySlug } })
      }
    }
  }
}
</script>

<style scoped>
    .brown-button-link.trip-bt {
      transform: translateY(-1px);
      height: 61px;
    }
    .v-slide-item--active {
      transform: scale(1.1);
    }
    .v-slide-item--active .v-image {
      /* box-shadow: 0px -1px 17px 1px rgba(184,110,31,0.43);
      -webkit-box-shadow: 0px -1px 17px 1px rgba(184,110,31,0.43);
      -moz-box-shadow: 0px -1px 17px 1px rgba(184,110,31,0.43); */
      border: 5px solid #fff;
    }
</style>
