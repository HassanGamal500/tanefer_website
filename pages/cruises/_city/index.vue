<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container fluid>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="5000"
      top
    >
      <v-row>
        <span v-html="text" />
        <v-spacer />
        <v-icon small color="white" class="ml-3" @click="snackbar = false">
          mdi-close
        </v-icon>
      </v-row>
    </v-snackbar>
    <v-container>
      <template v-if="!loading && cruises.length">
        <v-card v-for="item in cruises" :key="item.id" max-width="1200" class="mb-5 px-3 mx-auto">
          <v-row>
            <v-col cols="12" md="4">
              <v-img :src="item.master_image" height="250" class="rounded" />
            </v-col>
            <v-col cols="12" md="8" class="d-flex flex-column justify-space-between">
              <v-card-title class="d-flex justify-space-between flex-wrap align-cener px-0 py-0">
                {{ item.name }}
                <v-rating
                  background-color="green lighten-2"
                  color="warning"
                  dense
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  length="5"
                  readonly
                  size="10"
                  :value="item.stars"
                />
              </v-card-title>
              <v-card-subtitle class="py-0 px-0 my-1">
                Cruise Line: {{ item.cruise_line }} / Ship: {{ item.ship_name }} / Nights: {{ item.number_of_nights }}
              </v-card-subtitle>
              <div class="more-text">
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <p v-html="item.description"></p>
              </div>
              <div>
                <v-btn
                  color="blue"
                  dark
                  text
                  x-small
                  class="px-0 mb-5"
                  @click="textDialog = true; description = item.description"
                >
                  show Full Description
                </v-btn>
              </div>

              <v-expansion-panels v-if="item.available_dates.length">
                <v-expansion-panel>
                  <v-expansion-panel-header class="pa-1">
                    <h6>This Crusise is available to book during the following dates:</h6>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div v-for="(season, k) in item.available_dates" :key="k">
                      <p><strong>From</strong> {{ season.start_date }} <strong>To</strong> {{ season.end_date }} </p>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-card-actions class="pb-0">
                <v-btn color="primary white--text px-5" elevation="0" :loading="showDetailsLoading" @click="getCruise(item.id)">
                  View Details
                </v-btn>
                <v-spacer />
                <v-btn color="lightBrown white--text px-10" elevation="0" :disabled="selectLoading" @click="selectCruise(item.id, item.name)">
                  Select
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </template>
      <template v-else-if="!loading && !cruises.length">
        <p class="text-center text-h6">
          No Cruises Found!
        </p>
      </template>
      <template v-else>
        <v-progress-linear
          indeterminate
          color="yellow darken-2"
        />
      </template>
    </v-container>

    <v-dialog v-if="cruise" v-model="showCruiseDialog" max-width="1200">
      <v-card class="mx-auto" max-width="1200">
        <v-card-title class="lightBrown white--text">
          {{ cruise.name }}
        </v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-img :src="image" height="200" width="100%" class="rounded" />
            </v-col>
            <v-col cols="12" class="d-flex flex-wrap">
              <v-img
                v-for="(item, i) in cruise.images"
                :key="i"
                :src="item.image"
                height="70"
                width="70"
                class="rounded ma-1 gallery-image"
                @click="image = item.image"
              />
            </v-col>
          </v-row>
          <v-card-title class="d-flex justify-space-between flex-wrap align-cener px-0 py-0">
            {{ cruise.name }}
            <v-rating
              background-color="green lighten-2"
              color="warning"
              dense
              empty-icon="mdi-star-outline"
              full-icon="mdi-star"
              length="5"
              readonly
              size="15"
              :value="cruise.stars"
            />
          </v-card-title>
          <v-card-subtitle class="py-0 px-0 my-1">
            Cruise Line: {{ cruise.cruise_line }} / Ship: {{ cruise.ship_name }} / Nights: {{ cruise.number_of_nights }} / Cities:
            <span v-for="(item, i) in cruise.cities" :key="i">{{ item.name + ', ' }}</span>
          </v-card-subtitle>
          <v-card-text class="px-0">
            <!-- eslint-disable-next-line vue/html-self-closing -->
            <div v-html="cruise.description"></div>
          </v-card-text>
          <div v-if="cruise.available_dates.length">
            <h6>This Crusise is available to book during the following dates:</h6>
            <div v-for="(season, k) in cruise.available_dates" :key="k">
              <p><strong>From</strong> {{ new Date(season.start_date.replaceAll('-', '/')).toDateString() }} <strong>To</strong> {{ new Date(season.end_date.replaceAll('-', '/')).toDateString() }} </p>
            </div>
          </div>
          <div v-if="cruise.includes.length">
            <p class="text-h6">
              Includes
            </p>
            <v-chip v-for="(item, i) in cruise.includes" :key="i" class="ma-1">
              {{ item }}
            </v-chip>
          </div>
          <div v-if="cruise.excludes.length">
            <p class="text-h6">
              Excludes
            </p>
            <v-chip v-for="(item, i) in cruise.excludes" :key="i" class="ma-1">
              {{ item }}
            </v-chip>
          </div>
          <div v-if="cruise.facilities.length">
            <p class="text-h6">
              Facilities
            </p>
            <v-chip v-for="(item, i) in cruise.facilities" :key="i" class="ma-1">
              {{ item }}
            </v-chip>
          </div>
          <div v-if="cruise.policies.length">
            <p class="text-h6">
              Policies
            </p>
            <v-chip v-for="(item, i) in cruise.policies" :key="i" class="ma-1">
              {{ item }}
            </v-chip>
          </div>
          <div v-if="cruise.start_days.length">
            <p class="text-h6">
              Start Days
            </p>
            <v-chip v-for="(item, i) in cruise.start_days" :key="i" class="ma-1">
              {{ item }}
            </v-chip>
          </div>
          <v-card-actions class="pb-0">
            <v-spacer />
            <v-btn color="lightBrown white--text px-10" elevation="0" :disabled="selectLoading" @click="selectCruise(cruise.id, cruise.name)">
              Select
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="textDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Cruise Overview
        </v-card-title>

        <v-card-text>
          <p v-html="description" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import cruisesServices from '~/services/cruisesServices'

export default {
  beforeRouteUpdate (to) {
    this.$route.query.page = to.query.page
    this.getCruises(to.query.page)
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['page'],
  data () {
    return {
      cruises: [],
      cruise: null,
      city: {},
      totalPages: 1,
      currentPage: 1,
      loading: true,
      showCruiseDialog: false,
      showDetailsLoading: false,
      image: '',
      color: '',
      snackbar: false,
      text: '',
      selectLoading: false,
      textDialog: false,
      description: ''
    }
  },
  async fetch () {
    await this.getCruises(this.$route.query.page)
  },
  head () {
    return {
      title: 'Nile cruises in ' + this.$route.params.city
    }
  },
  computed: {
    ...mapState(['tripsCity', 'cities'])
  },
  methods: {
    selectCruise (id, name) {
      // eslint-disable-next-line no-console
      console.log(id, name)
      this.$router.push({ name: 'cruises-city-id', params: { id, city: this.$route.params.city }, query: { cruise: name } })
    },
    async getCruises (page) {
      try {
        let cityId
        this.$route.query.cityId ? cityId = this.$route.query.cityId : cityId = this.cities.find(city => city.CityName === this.$route.params.city).CityID
        const promise = cruisesServices.getCityCruises(cityId, parseInt(page) || 1, 10)
        const response = await promise
        const results = response.data
        // eslint-disable-next-line no-console
        console.log(results.data.cruiseList)
        if (results.data.cruiseList.length > 0) {
          this.cruises = results.data.cruiseList
        } else { this.loading = false }
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
      } finally {
        this.loading = false
      }
    },
    async getCruise (id) {
      try {
        const promise = cruisesServices.getCruiseDetails(id)
        const response = await promise
        const results = response.data
        this.cruise = results.data
        this.image = results.data.master_image
        this.showCruiseDialog = true
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
        this.loading = false
      } finally {
        this.showDetailsLoading = false
      }
    },
    changePage (page) {
      this.$router.push({ name: 'cruisesResults', query: { page } })
    }
  }
}
</script>

<style>
.anchor[data-v-45f35f38] {
  text-align: left;
  padding: 0;
  font-size: smaller;
}
.gallery-image {
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}
.gallery-image:hover {
  transform: scale(1.1);
}
.w-nav {
  z-index: 200;
}
</style>
