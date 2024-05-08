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
          @click="$router.push({name: 'trips-city-slug', params: {city: 'cairo', slug: item.packageSlug || item.packageTitle}})"
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
      tours: [],
      metaData: {
        page_name: null,
        seo_title: null,
        seo_description: null,
        featured_image: null,
        slug: null
      }
    }
  },
  //  get top tours
  async fetch () {
    // await this.getMetaData()
    const res = tripsServices.getTopTours()
    const results = await res
    this.tours = results.data.data
  },
  // ssr: false,
  head () {
    return {
      // title: 'Package Cities'
      title: this.metaData.seo_title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaData.seo_description
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.metaData.seo_title
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.metaData.seo_description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.metaData.featured_image
        }
      ]
    }
  },
  async created () {
    await this.getMetaData()
  },
  methods: {
    async getMetaData () {
      try {
        const promise = tripsServices.getMetaData(6)
        const response = await promise
        const results = response.data
        // console.log(results)
        if (results.data) {
          this.metaData = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    }
  }
}
</script>

<style>
.city-block {
    cursor: pointer;
}
</style>
