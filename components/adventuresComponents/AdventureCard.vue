<template>
  <!-- <v-container class="grey lighten-5"> -->
  <v-row>
    <v-col cols="12" md="12">
      <div>
        <v-card class="mb-5" style="border-radius: 15px;">
          <v-card-text>
            <v-row class="">
              <v-col v-if="adventure.activityImages.length" cols="12" md="4" class="pt-4">
                <v-img
                  :src="adventure.activityImages[0][0]"
                  class="rounded-lg adventure-img adventure-img-mobile"
                />
              </v-col>
              <v-col cols="10" :md="adventure.activityImages.length ? 6 : 10">
                <div class="cruise-result-trip justify-space-between pt-4">
                  <div>
                    <h5 class="text-h5 font-weight-bold">
                      {{ adventure.activityTitle }}
                    </h5>
                  </div>
                  <div class="black--text">
                    <p class="subtitle-1 font-weight-bold">
                      Start from ${{ adventure.activityPricePerPerson }} per person
                    </p>
                  </div>
                </div>
              </v-col>
              <!-- <v-col cols="2" md="2">
                  <div class="rounded-circle mt-6" style="border: 2px solid #757575;width: 50px;height: 50px;line-height: 50px;text-align: center;">
                    <v-icon style="font-size: 33px;">mdi-heart-outline</v-icon>
                  </div>
                </v-col> -->
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <!-- <div class="mb-3" v-html="adventure.activityOverview" /> -->
                <v-tabs
                  v-model="tab"
                  color="font-weight-black accent-4"
                >
                  <v-tab href="#intro">
                    Intro
                  </v-tab>
                  <v-tab href="#itinerary">
                    Itinerary
                  </v-tab>
                  <v-tab href="#notes">
                    Notes
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                  <v-tab-item :value="'intro'">
                    <v-card flat>
                      <v-card-text>
                        <div class="mb-3" v-html="adventure.activityIntro" />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item :value="'itinerary'">
                    <v-card flat>
                      <v-card-text>
                        <div class="mb-3" v-html="adventure.activityItinerary" />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item :value="'notes'">
                    <v-card flat>
                      <v-card-text>
                        <div class="mb-3" v-html="adventure.activityOverview" />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
                <div class="trips-cityname" style="margin: 10px 0;">
                  <v-expansion-panels>
                    <v-expansion-panel v-if="adventure.activityIncludes.length">
                      <v-expansion-panel-header>
                        Includes
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <!-- Show list on mobile -->
                            <ul v-if="isMobile" class="list">
                              <li v-for="(include, i) in adventure.activityIncludes" :key="i" class="list-item pl-2">
                                - {{ include }}
                              </li>
                            </ul>
                            <!-- Show chips on larger screens -->
                            <div v-else>
                              <span v-for="(include, i) in adventure.activityIncludes" :key="i">
                                <v-chip
                                  dense
                                  label
                                  large
                                  color="#F6F6F6"
                                  class="my-1 px-4 ma-2 py-2 text-truncate"
                                >
                                  <span class="text-xs">{{ include }}</span>
                                </v-chip>
                              </span>
                            </div>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>

                <div>
                  <v-expansion-panels>
                    <v-expansion-panel v-if="adventure.activityExcludes.length">
                      <v-expansion-panel-header>
                        Excludes
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <!-- Show list on mobile -->
                            <ul v-if="isMobile" class="list">
                              <li v-for="(exclude, i) in adventure.activityExcludes" :key="i" class="list-item pl-2">
                                - {{ exclude }}
                              </li>
                            </ul>
                            <div v-else>
                              <span v-for="(exclude, i) in adventure.activityExcludes" :key="i">
                                <v-chip
                                  dense
                                  label
                                  large
                                  color="#F6F6F6"
                                  class="my-1 px-4 ma-2 py-2 text-truncate"
                                >
                                  <span class="text-xs">{{ exclude }}</span>
                                </v-chip>
                              </span>
                            </div>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider class="mb-2" />
          <v-card-actions class="mb-0 pb-0">
            <v-row>
              <v-col cols="12" md="5">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Adventure Date"
                      prepend-inner-icon="mdi-calendar"
                      append-inner-icon="mdi-pencil"
                      readonly
                      outlined
                      :rules="[v => !!v || 'Date is required!']"
                      v-bind="attrs"
                      persistent-hint
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="date"
                    color="late"
                    :allowed-dates="allowedDates"
                    :min="new Date().toISOString().substr(0, 10)"
                    @input="menu = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" md="7">
                <v-btn
                  v-if="!selected"
                  color="success"
                  block
                  elevation="4"
                  x-large
                  :loading="loadingSelectedAdventure"
                  @click="addAdventureToSelected"
                >
                  <v-icon class="mx-2">
                    mdi-plus-box-multiple
                  </v-icon>
                  Add Adventure
                </v-btn>
                <v-btn
                  v-else
                  color="error"
                  block
                  elevation="4"
                  x-large
                  :loading="loadingSelectedAdventure"
                  @click="removeAdventureFromSelected"
                >
                  <v-icon class="mx-2">
                    mdi-minus-box-multiple
                  </v-icon>
                  Remove Adventure
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
          <p class="mx-4 mt-0 pb-3 text-left">
            {{ getDateHint(adventure) }}
          </p>
        </v-card>
      </div>
    </v-col>
  </v-row>
  <!-- </v-container> -->
</template>

<script>
import adventureServices from '~/services/activitiesServies'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['adventure', 'index', 'price', 'selectedAdventures', 'isValidateSelected', 'selectedStatusFalse'],
  data () {
    return {
      menu: false,
      date: null,
      selected: this.selectedStatusFalse,
      tab: null,
      availabilityId: null,
      loadingSelectedAdventure: false,
      isMobile: false
      // selectedDates: this.selectedAdventures
    }
  },
  mounted () {
    this.checkIfMobile()
    window.addEventListener('resize', this.checkIfMobile)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkIfMobile)
  },

  methods: {
    checkIfMobile () {
      this.isMobile = window.innerWidth <= 600
    },
    allowedDates (val) {
      const date = new Date(val.replaceAll('-', '/'))
      // const today = new Date()
      const days = this.adventure.start_days.filter(item => !!item)
      const availabilities = this.adventure.availabilities
      let allowedDay = false
      let allowedDate = false
      // let allowedDateSelected = true

      // Check if the date falls within any of the availabilities
      for (const availability of availabilities) {
        const fromDate = new Date(availability.from_date.replaceAll('-', '/'))
        const toDate = new Date(availability.to_date.replaceAll('-', '/'))
        if (date >= fromDate && date <= toDate) {
          allowedDate = true
          this.availabilityId = availability.id
          break
        }
      }

      // for (const selectedAdventures of this.selectedAdventures) {
      //   // console.log(selectedAdventures.date)
      //   const selectedDateFormat = new Date(selectedAdventures.date.replaceAll('-', '/'))
      //   console.log(selectedDateFormat)
      //   if (+date === +selectedDateFormat) {
      //     allowedDateSelected = false
      //     // break
      //   }
      // }

      // if (days.includes(date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()) || !days.length) { allowedDay = true }
      // return allowedDay && allowedDate

      // if (
      //   !date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() &&
      //   (days.includes(date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()) || !days.length)
      // ) {
      //   allowedDay = true
      // }

      // Check if the date is not today and matches the allowed days
      if (
        !this.isToday(date) &&
        (days.includes(date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()) || !days.length)
      ) {
        allowedDay = true
      }
      return allowedDay && allowedDate
    },
    getDateHint () {
      let text = 'You can choose from allowed dates :'
      for (let index = 0; index < this.adventure.start_days.filter(item => !!item).length; index++) {
        if (this.adventure.start_days[index]) { text += this.adventure.start_days[index] + ',' }
      }
      if (!this.adventure.start_days.filter(item => !!item).length) { text = '' }
      return text
    },
    async addAdventureToSelected () {
      this.loadingSelectedAdventure = true
      if (this.date) {
        const body = {
          activities: []
        }
        body.activities.push({
          activity_id: this.adventure.activityID,
          from_date: this.date
        })
        this.selectedAdventures.forEach((item) => {
          body.activities.push({
            activity_id: item.activity_id,
            from_date: item.date
          })
        })
        try {
          const promise = adventureServices.validateTimeTour(body)
          const response = await promise
          const results = response.data
          if (results.status === 200) {
            this.selected = true
            this.$emit('addAdventure', { activityTitle: this.adventure.activityTitle, activity_id: this.adventure.activityID, date: this.date, price: this.price, availabilityId: this.availabilityId })
          } else {
            this.$emit('error', results.errors, 'error')
          }
        } catch (error) {
          this.$emit('error', 'Something went wrong', 'error')
        }
        // console.log(this.isValidateSelected)
        // if (this.isValidateSelected === 'enableSelect') {
        //   this.selected = true
        //   this.$emit('addAdventure', { activityTitle: this.adventure.activityTitle, activity_id: this.adventure.activityID, date: this.date, price: this.price, availabilityId: this.availabilityId })
        // }
      } else {
        this.$emit('error', 'Please select start date!', 'warning')
      }
      this.loadingSelectedAdventure = false
    },
    removeAdventureFromSelected () {
      this.selected = false
      this.$emit('removeAdventure', this.adventure.activityID)
    },
    isToday (someDate) {
      const today = new Date()
      return (
        someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
      )
    }
  }
}
</script>
<style scoped>
.non-visiable {
  visibility: hidden;
}
.my-chip {
  max-width: 100%; /* Set a maximum width if needed */
}
.adventure-img {
  height: 350px;
  width: 250px;
}
.text-truncate {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: normal !important;
}
.list {
  padding: 0;
  list-style-type: none;
}

.list-item {
  margin-bottom: 10px;
  font-size: 14px;
}
@media only screen and (max-width: 722px) {
  .adventure-img-mobile {
    width: 100%;
    height: 250px;
  }

.v-tabs-bar {
  padding-left: 0 !important;
}
::v-deep .v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev {
  display: none !important;
}

}
</style>
