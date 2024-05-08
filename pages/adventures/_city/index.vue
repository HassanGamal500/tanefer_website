<template>
  <div>
    <v-img
      :src="tripsCity.cityImage ? tripsCity.cityImage : require(`~/assets/images/${getCityImage(tripsCity.CityName)}`)"
      alt="img"
      class="image-fit"
      max-height="400"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          class="text-center"
          cols="12"
        >
          <h1 class="text-h1 white--text font-weight-bold my-12 set-line-height-responsive" style="line-height: 12rem;">
            {{ tripsCity.CityName }} Adventures
          </h1>
        </v-col>
      </v-row>
    </v-img>
    <v-container class="grey lighten-5" style="margin-top: -7rem;">
      <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        :color="color"
        top
      >
        {{ text }}

        <template #action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <div style="" class="px-0 my-5">
        <div>
          <v-card class="px-7 pt-7 pb-1" style="border-radius: 15px;">
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="selectedSearchText"
                  class="mx-1"
                  auto-select-first
                  clearable
                  outlined
                  label="Search"
                  hide-details
                  prepend-inner-icon="mdi-magnify-expand"
                />
              </v-col>
              <!-- <v-col cols="12" md="2">
                <v-select
                  ref="selectedCity"
                  :items="cities"
                  label="All Cities"
                  outlined
                  clearable
                  item-text="CityName"
                  item-value="CityID"
                  prepend-inner-icon="mdi-map-marker"
                ></v-select>
              </v-col> -->
              <!-- <v-col cols="12" md="4">
                <v-select
                  v-model="selectedPrice"
                  :items="prices"
                  label="All started prices per person"
                  outlined
                  clearable
                  item-text="price"
                  item-value="id"
                  hide-details
                  prepend-inner-icon="mdi-cash-multiple"
                ></v-select>
              </v-col> -->
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedCategory"
                  :items="categories"
                  label="Categories"
                  outlined
                  clearable
                  hide-details
                  prepend-inner-icon="mdi-apps"
                />
              </v-col>
              <!-- </v-row>
            <v-row> -->
              <v-col cols="12" md="2">
                <v-select
                  v-model="selectedDurationType"
                  :items="durationTypeList"
                  label="Duration Type"
                  outlined
                  clearable
                  prepend-inner-icon="mdi-calendar-range"
                  @change="getDurations"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="selectedDuration"
                  :items="durations"
                  label="All Durations"
                  outlined
                  clearable
                  item-text="duration"
                  item-value="duration"
                  prepend-inner-icon="mdi-calendar-range"
                />
              </v-col>
              <v-col cols="12" md="2" class="mb-4">
                <v-btn
                  class="white--text text-capitalize"
                  color="#575757"
                  elevation="6"
                  x-large
                  block
                  raised
                  rounded-lg
                  @click="applyFilter"
                >
                  Apply Filter
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </div>
      <div v-if="!$fetchState.pending && adventures.length">
        <!-- <div class="adventure-controller pa-2 mb-5"> -->
        <v-row>
          <v-col cols="12" md="8" class="order-last order-md-first order-sm-last order-xs-last">
            <div class="results ma-1">
              <div v-for="(item, n) in adventures" :key="item.activityID" class="mb-5">
                <adventure-card
                  :adventure="item"
                  :price="adventurePrice(item)"
                  :index="n"
                  :selected-adventures="selectedAdventures"
                  :is-validate-selected="isValidateSelected"
                  :selected-status-false="selectedStatusFalse"
                  @error="handleError"
                  @addAdventure="addSelectedAdventure"
                  @removeAdventure="removeSelectedAdventure"
                />
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="order-first order-md-last order-sm-first order-xs-first">
            <div style="position: sticky;top: 1rem;margin-bottom: 40px;z-index: 2;">
              <v-card class="" style="border-radius: 15px;">
                <v-card-text>
                  <h4 class="text-h4 black--text" color="black">
                    Number of guests
                  </h4>
                  <p class="font-weight-bold">
                    Adults Number
                    <span style="float: right;">
                      <v-btn
                        style="background-color: transparent; border: 1px solid #4f3316;"
                        elevation="4"
                        icon
                        small
                        @click="changeCounterAdult('-1')"
                      >
                        <v-icon color="#4f3316">
                          mdi-minus
                        </v-icon>
                      </v-btn>

                      <span class="quantity px-2 font-weight-bold">{{ travellers }}</span>

                      <v-btn
                        style="background-color: #4f3316;"
                        color="#4f3316"
                        elevation="4"
                        icon
                        small
                        @click="changeCounterAdult('1')"
                      >
                        <v-icon color="#FFF">
                          mdi-plus
                        </v-icon>
                      </v-btn>
                    </span>
                  </p>
                  <v-divider class="my-2" />
                  <p class="font-weight-bold">
                    Children
                    <span style="float: right;">
                      <v-btn
                        style="background-color: transparent; border: 1px solid #4f3316;"
                        elevation="4"
                        icon
                        small
                        @click="changeCounterChild('-1')"
                      >
                        <v-icon color="#4f3316">
                          mdi-minus
                        </v-icon>
                      </v-btn>

                      <span class="quantity px-2 font-weight-bold">{{ children }}</span>

                      <v-btn
                        style="background-color: #4f3316;"
                        color="#4f3316"
                        elevation="4"
                        icon
                        small
                        @click="changeCounterChild('1')"
                      >
                        <v-icon color="#FFF">
                          mdi-plus
                        </v-icon>
                      </v-btn>
                    </span>
                  </p>
                  <div v-if="ageSelects.length > 0">
                    Children's Ages
                    <v-row>
                      <v-col v-for="(ageSelect, index) in ageSelects" :key="index" cols="4">
                        <v-select
                          v-model="ageSelect.age"
                          :items="ages"
                          required
                          :error-messages="getAgeSelectErrorMessages(index)"
                          label="0"
                          persistent-hint
                          return-object
                          single-line
                          dense
                          outlined
                        />
                      </v-col>
                    </v-row>
                  </div>
                  <v-divider class="mb-4" />
                  <v-badge
                    style="width: 100%;"
                    color="red"
                    bordered
                    left
                    overlap
                    :content="selectedAdventures.length"
                    :value="selectedAdventures.length"
                  >
                    <v-btn
                      class="white--text"
                      color="#4f3316"
                      elevation="6"
                      large
                      block
                      raised
                      :disabled="!selectedAdventures.length"
                      @click="checkoutTotalPrice"
                    >
                      Checkout
                    </v-btn>
                  </v-badge>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>
      <h4 v-else-if="!$fetchState.pending && !adventures.length" class="my-5 text-center">
        No published adventures available now!
      </h4>
      <div v-else>
        <v-img max-width="200" class="blink-2 mx-auto" src="~/assets/images/tanfer.png" />
      </div>
      <v-dialog v-model="showCheckout" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Adventure Summary
            <v-btn
              text
              color="white"
              style="background-color: transparent;border: 1px solid #fff;color: #fff;"
              elevation="4"
              icon
              small
              absolute
              right
              class="float-right"
              @click="showCheckout = false"
            >
              <v-icon color="white">
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="6" sm="2">
                <v-text-field
                  :value="travellers"
                  label="Adults"
                  prepend-inner-icon="mdi-account"
                  readonly
                />
              </v-col>

              <v-col cols="6" sm="2">
                <v-text-field
                  :value="children"
                  label="Children"
                  prepend-inner-icon="mdi-account"
                  readonly
                />
              </v-col>
            </v-row>
            <div>
              Adventures
              <v-row class="mt-4">
                <v-col v-for="(item, index) in activitiesList" :key="index" cols="12" md="12">
                  <v-card color="#F5F5F5" class="rounded-xl">
                    <v-card-title class="text-h5 black--text font-weight-bold">
                      <v-icon class="black--text" x-large>
                        mdi-circle-small
                      </v-icon>
                      {{ item.activityTitle }}
                      <v-row
                        align="center"
                        justify="end"
                        class="mr-1"
                      >
                        <a
                          class="float-right"
                          style="font-size: small;color: black;"
                          :loading="loadingDeleteItem"
                          @click="removeItemCart(item.activity_id)"
                        >
                          <v-icon class="mx-2" style="color: red;">
                            mdi-delete
                          </v-icon>
                          Delete
                        </a>
                      </v-row>
                    </v-card-title>

                    <v-spacer />
                    <v-card-subtitle>
                      <div>
                        <p>
                          <v-icon>mdi-account</v-icon>
                          Adults
                          <span class="float-right">${{ item.totalAdultPrice }}</span>
                        </p>
                      </div>
                      <div>
                        <p>
                          <v-icon>mdi-account</v-icon>
                          Children
                          <span class="float-right">${{ item.totalChildrenPrice }}</span>
                        </p>
                      </div>
                      <v-divider class="my-3" />
                      <div>
                        <p>
                          Sub total
                          <span class="float-right">$ {{ item.subTotalPrice }}</span>
                        </p>
                      </div>
                    </v-card-subtitle>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-card-actions class="dialog-cart-footer">
            <v-row align="center" justify="center" class="px-5">
              <v-col cols="12" md="6">
                <div>
                  <h5 class="text-h5">
                    Grand Total ({{ selectedAdventures.length }}) Adventures
                  </h5>
                </div>
                <div>
                  <h5 class="text-h5">
                    $ {{ totalPrice }}
                  </h5>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  class="rounded"
                  x-large
                  tile
                  elevation="0"
                  dark
                  color="#4f3316"
                  block
                  :disabled="!openProceed"
                  @click="bookAdventures"
                >
                  Proceed
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import SvgIcon from '@jamescoyle/vue-icon'
// import { mdiMagnifyExpand } from '@mdi/js'
import adventureServices from '~/services/activitiesServies'
import adventureCard from '~/components/adventuresComponents/AdventureCard'

export default {
  ssr: false,
  components: {
    adventureCard
  },
  data () {
    return {
      dates: [],
      adventures: [],
      selectedAdventures: [],
      city: null,
      travellers: 1,
      children: 0,
      activitiesList: [],
      totalPrice: 0,
      singleSupplement: false,
      solo: false,
      showCheckout: false,
      snackbar: false,
      color: '',
      text: '',
      counterChild: 0,
      counterAdult: 0,
      ages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      ageSelects: [],
      categories: [
        'sightseeing',
        'camping'
      ],
      selectedCategory: null,
      durations: [],
      selectedDuration: null,
      selectedSearchText: null,
      ageSelect: [],
      showAgesSelects: false,
      selectedDates: [],
      prices: [],
      selectedPrice: null,
      isValidateSelected: 'disableSelect',
      durationTypeList: ['hour', 'day', 'week'],
      selectedDurationType: null,
      loadingDeleteItem: false,
      selectedStatusFalse: false,
      openProceed: false,
      metaData: {
        page_name: null,
        seo_title: null,
        seo_description: null,
        featured_image: null,
        slug: null
      }
      // selectedCity: null // Initially set to null or an initial selected city ID
    }
  },
  async fetch () {
    // await this.getAdventures()
    await this.getDurations()
    await this.getPrices()
  },
  head () {
    return {
      // title: 'Adventures in ' + this.$route.params.city,
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
        // {
        //   hid: 'og:type',
        //   property: 'og:type',
        //   content: 'website'
        // },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.metaData.featured_image
        }
        // {
        //   hid: 'og:url',
        //   property: 'og:url',
        //   content: 'https://thenextbit.de/'
        // },
        // {
        //   property: 'og:locale',
        //   content: 'de_DE'
        // }
      ]
    }
  },
  computed: {
    ...mapState(['tripsCity', 'cities']),
    isAgesValid () {
      if (!this.showAgesSelects) {
        return true // Skip validation if age selects are hidden
      }
      return this.ageSelects.every(ageSelect => ageSelect.age !== null)
    }
  },
  watch: {
    solo (val) {
      if (val) { this.children = 0 }
    },
    travellers (val) {
      this.solo = false
      // this.singleSupplement = false
    }
  },
  async created () {
    await this.getMetaData()
    await this.getAdventures()
  },
  methods: {
    handleError (text, color) {
      this.snackbar = true
      this.color = color
      this.text = text
    },
    addSelectedAdventure (adventure) {
      // const body = {
      //   activities: []
      // }
      // body.activities.push({
      //   activity_id: adventure.activity_id,
      //   from_date: adventure.date
      // })
      // this.selectedAdventures.forEach((item) => {
      //   body.activities.push({
      //     activity_id: item.activity_id,
      //     activity_date: item.date
      //   })
      // })
      // try {
      //   const promise = adventureServices.validateTimeTour(body)
      //   const response = await promise
      //   const results = response.data
      //   if (results.status === 200) {
      //     this.selectedAdventures.push(adventure)
      //     if (this.$route.name === 'cruisesResults') { this.checkoutTotalPrice() }
      //     this.isValidateSelected = 'enableSelect'
      //   } else {
      //     this.snackbar = true
      //     this.color = 'error'
      //     this.text = results.errors
      //     this.loaded = false
      //     this.showCheckout = false
      //   }
      // } catch (error) {
      //   this.snackbar = true
      //   this.color = 'error'
      //   this.text = 'Something went wrong'
      //   this.loaded = false
      //   this.showCheckout = false
      // }
      this.selectedAdventures.push(adventure)
      if (this.$route.name === 'cruisesResults') { this.checkoutTotalPrice() }
      // this.calculatePrice()
    },
    removeSelectedAdventure (id) {
      this.selectedAdventures.splice(this.selectedAdventures.findIndex(a => a.activity_id === id), 1)
      // this.calculatePrice()
    },
    async checkoutTotalPrice () {
      this.totalPrice = 0
      if (this.selectedAdventures.length) {
        // console.log(this.children > 0, !this.isAgesValid)
        if (this.children > 0 && !this.isAgesValid) {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Children Ages is Required'
          this.loaded = false
          this.showCheckout = false
        } else {
          const body = {
            adults: this.travellers,
            children: this.children,
            solo: false,
            singleSupplement: false,
            activities: []
          }
          this.selectedAdventures.forEach((item) => {
            body.activities.push({
              activity_id: item.activity_id,
              activity_date: item.date,
              availability_id: item.availabilityId
            })
          })
          try {
            const promise = adventureServices.calculateAdventureTotalPrices(body)
            const response = await promise
            const results = response.data
            if (results.status === 200) {
              this.activitiesList = response.data.activities
              this.totalPrice = response.data.totalPrice
              // localStorage.setItem('ActivityPriceSessionId', response.data.sessionId)
              localStorage.setItem('priceSessionId', response.data.sessionId)
              localStorage.setItem('activitiesPrices', response.data.activities)
              this.openProceed = true
              this.showCheckout = true
            } else {
              this.snackbar = true
              this.color = 'error'
              this.text = results.errors
              this.loaded = false
              this.openProceed = false
              this.showCheckout = false
            }
          } catch (error) {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Something went wrong'
            this.loaded = false
            this.openProceed = false
            this.showCheckout = false
          }
        }
      } else {
        this.totalPrice = 0
        this.activitiesList = []
        this.openProceed = false
        this.showCheckout = false
      }
    },
    adventurePrice (item) {
      let price = 0
      const adults = Number(this.travellers)
      const children = Number(this.children)
      const travellers = adults + children
      const childPercentage = item.children_percentage ? item.children_percentage : 0
      if (travellers === 1 && this.solo) {
        price += Number(item.solo_price)
        price += item.solo_price * (childPercentage / 100) * children
      } else if (travellers === 1 && !this.solo) {
        price += Number(item.activityPricePerPerson)
        price += item.activityPricePerPerson * (childPercentage / 100) * children
      } else if (travellers === 2) {
        const travellersPrice = this.singleSupplement ? (Number(item.Limo_price) * adults) + (Number(item.Limo_price) * adults * (item.single_supplement_percentage / 100)) : Number(item.Limo_price) * adults
        price += Number(travellersPrice)
        price += item.Limo_price * (childPercentage / 100) * children
      } else if (adults >= 3 && adults <= 8) {
        const travellersPrice = this.singleSupplement ? (Number(item.HiAC_price) * adults) + (Number(item.HiAC_price) * adults * (item.single_supplement_percentage / 100)) : Number(item.HiAC_price) * adults
        price += travellersPrice
        price += item.HiAC_price * (childPercentage / 100) * children
      } else if (adults >= 9 && adults <= 18) {
        const travellersPrice = this.singleSupplement ? (Number(item.Caster_price) * adults) + (Number(item.Caster_price) * adults * (item.single_supplement_percentage / 100)) : Number(item.Caster_price) * adults
        price += travellersPrice
        price += item.Caster_price * (childPercentage / 100) * children
      } else if (adults > 18 && adults <= 50) {
        const travellersPrice = this.singleSupplement ? (Number(item.bus_price) * adults) + (Number(item.bus_price) * adults * (item.single_supplement_percentage / 100)) : Number(item.bus_price) * adults
        price += travellersPrice
        price += item.bus_price * (childPercentage / 100) * children
      }
      return price
    },
    async getAdventures () {
      try {
        let cityId
        this.$route.query.cityId ? cityId = this.$route.query.cityId : cityId = this.cities.find(city => city.citySlug === this.$route.params.city).CityID
        // eslint-disable-next-line no-console
        const promise = adventureServices.getCityAdventures(cityId, 1)
        const response = await promise
        const results = response.data
        if (results.data.ActivityList.length > 0) {
          this.adventures = results.data.ActivityList
          this.adventures.forEach((item) => {
            item.selected = true
            item.start_days = item.start_days.filter(data => !!data)
          })
        }
      } catch (error) {
        // this.snackbar = true
        // this.color = 'error'
        // this.text = 'Something went wrong'
        // this.loaded = false
      }
    },
    async getDurations () {
      try {
        const durationType = this.selectedDurationType
        const promise = adventureServices.getDurations(durationType)
        const response = await promise
        const results = response.data
        if (results.DurationList.length > 0) {
          this.durations = results.DurationList
        } else {
          this.durations = []
        }
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
        this.loaded = false
      }
    },
    async getPrices () {
      try {
        const promise = adventureServices.getPrices()
        const response = await promise
        const results = response.data
        if (results.priceList.length > 0) {
          this.prices = results.priceList
        }
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
        this.loaded = false
      }
    },
    bookAdventures () {
      this.$store.dispatch('setSelectedAdventures', this.selectedAdventures)
      this.$store.dispatch('setTravellersNumber', {
        adults: this.travellers,
        children: this.children,
        solo: this.solo,
        totalPrice: this.totalPrice,
        activitiesPrices: this.activitiesList
      })
      this.$router.push({ name: 'booking-module', params: { module: 'adventure' } })
    },
    changeCounterAdult (num) {
      this.travellers += +num
      if (!isNaN(this.travellers) && this.travellers > 0) {
        return this.travellers
      } else {
        this.travellers = 1
      }
    },
    changeCounterChild (num) {
      this.children += +num
      if (!isNaN(this.children) && this.children > 0) {
        if (num > 0) {
          // this.ageSelects.push(this.children)
          this.ageSelects.push({ age: null })
          this.showAgesSelects = true
        } else {
          this.ageSelects.splice(-1, 1)
        }
        return this.children
      } else {
        this.ageSelects = []
        this.children = 0
      }
    },
    async applyFilter (data) {
      // Retrieve the selected city
      // const selectedCity = this.$refs.selectedCity.selectedItems[0]
      // const cityID = selectedCity ? selectedCity.CityID : null
      // const cityName = selectedCity ? selectedCity.CityName : null
      const selectedSearchText = this.selectedSearchText
      const selectedCategory = this.selectedCategory
      const selectedDuration = this.selectedDuration
      // const selectedPrice = this.selectedPrice
      const selectedDurationType = this.selectedDurationType
      // Redirect or perform desired action after form submission
      // console.log(selectedCity, cityID, cityName)
      // if (cityID != null && cityName != null && selectedSearchText == null && selectedCategory == null && selectedDuration == null && selectedPrice == null) {
      //   const url = `/adventures/${cityName}?cityId=${cityID}`
      //   window.location.href = url
      // } else {
      let cityId
      this.$route.query.cityId ? cityId = this.$route.query.cityId : cityId = this.cities.find(city => city.CityName === this.$route.params.city).CityID
      // Construct the request body
      const requestBody = {
        title: selectedSearchText,
        // city_id: cityID != null ? cityID : cityId,
        city_id: cityId,
        type: selectedCategory,
        duration: selectedDuration,
        duration_type: selectedDurationType
        // price: selectedPrice
      }

      try {
        const promise = adventureServices.filterAdventure(requestBody)
        const response = await promise
        const results = response.data
        this.adventures = results.data.ActivityList
        this.adventures.forEach((item) => {
          item.selected = false
          item.start_days = item.start_days.filter(data => !!data)
        })
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
        this.loaded = false
      }
      // }
    },
    getCityImage (name) {
      let img = ''
      switch (name) {
        case 'Cairo':
          img = 'cairo-city.jpg'
          break
        case 'Giza':
          img = 'blog-img.jpg'
          break
        case 'Aswan':
          img = 'aswan.jpg'
          break
        case 'Luxor':
          img = '208568-p-800.png'
          break
        case 'Sharm El Sheikh':
          img = 'dahab9-p-500.jpeg'
          break
        case 'Hurghada':
          img = 'dahab7.jpg'
          break
        case 'Alexandria':
          img = 'alex.jpg'
          break
        case 'Dahab':
          img = 'dahab3.jpg'
          break
        default:
          img = 'egypt.jpg'
          break
      }
      return img
    },
    getAgeSelectErrorMessages (index) {
      if (!this.showAgesSelects) {
        return [] // Skip error messages if age selects are hidden
      }
      const ageSelect = this.ageSelects[index]
      if (ageSelect && ageSelect.age === null) {
        return ['This field is required']
      }
      return []
    },
    removeItemCart (id) {
      this.loadingDeleteItem = true
      this.selectedStatusFalse = true
      this.selectedAdventures.splice(this.selectedAdventures.findIndex(a => a.activity_id === id), 1)
      this.checkoutTotalPrice()
    },
    // async getMetaData () {
    //   try {
    //     const promise = adventureServices.getMetaData(7)
    //     const response = await promise
    //     const results = response.data
    //     // console.log(results)
    //     if (results.data) {
    //       this.metaData = results.data
    //     }
    //   } catch (error) {
    //     this.loaded = false
    //   }
    // }
    async getMetaData () {
      try {
        const getCityDetails = this.cities.find(city => city.citySlug === this.$route.params.city)
        if (getCityDetails) {
          this.metaData.seo_title = getCityDetails.citySEOTitle ? 'Best Adventures & ' + getCityDetails.citySEOTitle : null
          this.metaData.seo_description = getCityDetails.citySEODescription ? 'Best Adventures Trips & ' + getCityDetails.citySEODescription : null
          this.metaData.featured_image = getCityDetails.citySEOImage ? getCityDetails.citySEOImage : null
          this.metaData.slug = getCityDetails.citySlug
        } else if (this.$route.params.city) {
          const res = adventureServices.getCityDetails(this.$route.params.city)
          const results = await res
          const cityDetails = results.data.data
          this.metaData.seo_title = cityDetails.citySEOTitle ? 'Best Custom ' + cityDetails.citySEOTitle : null
          this.metaData.seo_description = cityDetails.citySEODescription ? 'Best Custom ' + cityDetails.citySEODescription : null
          this.metaData.featured_image = cityDetails.citySEOImage ? cityDetails.citySEOImage : null
          this.metaData.slug = cityDetails.citySlug
        } else {
          const promise = adventureServices.getMetaData(4)
          const response = await promise
          const results = response.data
          if (results.data) {
            this.metaData = results.data
          }
        }
      } catch (error) {
        this.loaded = false
      }
    }
  }
}
</script>

<style>
.adventure-controller {
  position: sticky;
  top: 0;
  z-index: 3;
  background-color: #fbfbfb;
  border: 1px solid #e0e0e0;
}

@media only screen and (max-width: 722px) {
  .set-line-height-responsive {
    line-height: unset !important;
  }
}
</style>
