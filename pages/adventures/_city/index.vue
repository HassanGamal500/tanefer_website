<template>
  <v-container>
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
    <div v-if="!$fetchState.pending && adventures.length">
      <div class="adventure-controller pa-2 mb-5">
        <div class="d-flex justify-space-between align-center mb-5">
          <h2 class="brown--text">
            {{ $route.params.city }} Adventures
          </h2>
          <v-badge
            v-if="$route.name !== 'cruisesResults'"
            bordered
            color="error"
            :content="selectedAdventures.length"
            :value="selectedAdventures.length"
            left
            overlap
          >
            <v-btn
              class="white--text"
              color="brown"
              depressed
              :disabled="!selectedAdventures.length"
              @click="checkoutTotalPrice"
            >
              Checkout Adventures
            </v-btn>
          </v-badge>
        </div>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="travellers"
              class="mx-1"
              hide-details=""
              label="Adults Number"
              outlined
              type="number"
              :max="50"
              :min="1"
              prepend-inner-icon="mdi-account-multiple"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="children"
              :disabled="solo"
              class="mx-1"
              label="Children Number"
              outlined
              type="number"
              :min="0"
              prepend-inner-icon="mdi-account-multiple"
            />
          </v-col>
        </v-row>
      </div>
      <div class="results ma-1">
        <div v-for="(item, n) in adventures" :key="item.activityID" class="mb-5">
          <adventure-card
            :adventure="item"
            :price="adventurePrice(item)"
            :index="n"
            @error="handleError"
            @addAdventure="addSelectedAdventure"
            @removeAdventure="removeSelectedAdventure"
          />
        </div>
      </div>
    </div>
    <h4 v-else-if="!$fetchState.pending && !adventures.length" class="my-5 text-center">
      No published adventures available now!
    </h4>
    <div v-else>
      <v-img max-width="200" class="blink-2 mx-auto" src="~/assets/images/tanfer.png" />
    </div>
    <v-dialog v-model="showCheckout" max-width="700">
      <v-card>
        <v-card-title class="late white--text">
          Adventures Summary
        </v-card-title>
        <v-card-text>
          <v-simple-table class="rounded-xl">
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">
                    Adults Number
                  </th>
                  <th class="text-left">
                    Children Number
                  </th>
                  <!-- <th v-if="travellers == 1" class="text-left">
                      Solo Traveller
                    </th> -->
                  <!-- <th v-if="travellers > 1" class="text-left">
                      Single Supplment added
                    </th> -->
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ travellers }}</td>
                  <td>{{ children }}</td>
                  <!-- <td v-if="travellers == 1">{{ solo ? 'Yes' : 'No' }}</td> -->
                  <!-- <td v-if="travellers > 1">{{ singleSupplement ? 'Yes' : 'No' }}</td> -->
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-divider class="my-3" />

          <div class="d-flex justify-space-between late--text mb-3">
            <div class="text-h5">
              Adventure
            </div>
            <div class="text-h5">
              Total adventure price
            </div>
          </div>
          <div v-for="(item, i) in activitiesList" :key="i" class="d-flex justify-space-between">
            <div class="body-1">
              {{ item.activityTitle }}
            </div>
            <div class="body-1">
              ${{ item.price }}
            </div>
          </div>
          <v-divider class="my-3" />
          <div class="d-flex justify-space-between late--text">
            <div class="text-h5">
              Grand Total
            </div>
            <div class="text-h5">
              ${{ totalPrice }}
            </div>
          </div>
        </v-card-text>

        <v-divider class="my-3" />

        <v-card-actions>
          <v-btn text color="warning" @click="showCheckout = false">
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn tile elevation="0" dark color="late" @click="bookAdventures">
            Proceed
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import adventureServices from '~/services/activitiesServies'
import adventureCard from '~/components/adventuresComponents/AdventureCard'

export default {
  components: {
    adventureCard
  },
  data () {
    return {
      dates: [],
      adventures: [],
      selectedAdventures: [],
      city: null,
      travellers: 2,
      children: 0,
      activitiesList: [],
      totalPrice: 0,
      singleSupplement: false,
      solo: false,
      showCheckout: false,
      snackbar: false,
      color: '',
      text: ''
    }
  },
  async fetch () {
    await this.getAdventures()
  },
  head () {
    return {
      title: 'Adventures in ' + this.$route.params.city
    }
  },
  computed: {
    ...mapState(['tripsCity', 'cities'])
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
  methods: {
    handleError (text, color) {
      this.snackbar = true
      this.color = color
      this.text = text
    },
    addSelectedAdventure (adventure) {
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
        const body = {
          adults: this.travellers,
          children: this.children,
          solo: false,
          singleSupplement: false,
          activities: []
        }
        this.selectedAdventures.forEach((item) => {
          body.activities.push({ activity_id: item.activity_id })
        })
        const promise = adventureServices.calculateAdventurePrice(body)
        const response = await promise
        this.activitiesList = response.data.data.activities
        this.totalPrice = response.data.data.totalPrice
        localStorage.setItem('ActivityPriceSessionId', response.data.data.sessionId)
      } else { this.totalPrice = 0 }
      this.showCheckout = true
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
        this.$route.query.cityId ? cityId = this.$route.query.cityId : cityId = this.cities.find(city => city.CityName === this.$route.params.city).CityID
        // eslint-disable-next-line no-console
        console.log(cityId)
        const promise = adventureServices.getCityAdventures(cityId, 0)
        const response = await promise
        const results = response.data
        if (results.data.ActivityList.length > 0) {
          this.adventures = results.data.ActivityList
          this.adventures.forEach((item) => {
            item.selected = false
            item.start_days = item.start_days.filter(data => !!data)
          })
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
        totalPrice: this.totalPrice
      })
      this.$router.push({ name: 'booking-module', params: { module: 'adventure' } })
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
</style>
