<template>
  <div>
    <div class="t-container">
      <!-- cities slider -->
      <cities-slider module="trips" />

      <div class="title-center">
        <div class="subtitle-line">
          <h2 class="section-title">
            Top Egypt tours
            <a href="https://www.inspirock.com/tour-link?tourService=viatorTourService&amp;tourId=2484_14" target="_blank"><br></a>
          </h2>
          <div class="section-title-lable">
            Top Chosen trips
          </div>
        </div>
      </div>

      <!-- top tours -->
      <div v-if="tours.length" class="city-row">
        <div
          v-for="item in tours"
          :key="item.packageID"
          class="city-block"
          @click="$router.push({name: 'trips-city-slug', params: {city: item.packageStartCity.cityName, slug: item.packageSlug || item.packageTitle}})"
        >
          <div class="city-inner-block">
            <img
              :src="item.packageImage"
              width="100%"
              height="300"
              loading="lazy"
              alt=""
              class="sm-big-img"
            >
            <div class="trips-price-bg">
              <div class="trips-price">
                <div class="trip-block-name">
                  {{ item.packageTitle }}
                </div>
                <div class="d-flex-m-trip-price">
                  <div class="s-trip-nights">
                    {{ item.packageDuration }} Nights
                  </div>
                  <div class="pricr-rangr-txt">
                    From $ {{ item.expected_price }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tripsServices from '../../services/tripsServices'

export default {
  data () {
    return {
      tours: []
    }
  },

  //  get top tours
  async fetch () {
    const res = tripsServices.getTopTours()
    const results = await res
    this.tours = results.data.data
  },

  head () {
    return {
      title: 'Package Cities'
    }
  }
}
</script>

<style>
.city-block {
    cursor: pointer;
}
</style>
