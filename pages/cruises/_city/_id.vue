<!-- eslint-disable no-console -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
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
      <div v-if="cruise && !cruiseLoading" class="cruise-body">
        <v-container>
          <v-alert
            v-if="showAlertBar"
            border="left"
            colored-border
            type="error"
            elevation="2"
            dismissible
          >
            {{ alertText }}
          </v-alert>
          <v-row>
            <v-col cols="12" md="3">
              <v-card class="pa-2">
                <v-card-title class="body-1 font-weight-bold px-0">
                  Dates & Occupancy
                </v-card-title>
                <v-menu
                  v-model="startDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="290px"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-model="startDate"
                      outlined
                      label="Cruise Start Date"
                      readonly
                      prepend-inner-icon="mdi-calendar"
                      color="late"
                      persistent-hint
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    color="late"
                    :allowed-dates="allowedDates"
                    :min="new Date().toISOString()"
                    type="date"
                    @input="startDateMenu = false"
                  />
                </v-menu>

                <rooms-and-guests @save="setGuests" />

                <!-- <h6 class="body-1 font-weight-bold">
                  Price: $ {{ initialPrice }}
                </h6> -->

                <v-btn class="mb-5 lightBrown white--text" block :loading="selectLoading" @click="getCruiseRooms">
                  Check Availablity
                </v-btn>
              </v-card>
            </v-col>
            <v-col cols="12" md="9">
              <v-card class="pa-3">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-img :src="image" height="200" class="rounded" />
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex flex-wrap">
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
                <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
                <v-card-text class="px-0" v-html="cruise.description" />
                <!-- <div v-if="cruise.available_dates.length">
                  <h6>This Crusise is available to book during the following dates:</h6>
                  <div v-for="(season, k) in cruise.available_dates" :key="k">
                    <p><strong>From</strong> {{ new Date(season.start_date.replaceAll('-', '/')).toDateString() }} <strong>To</strong> {{ new Date(season.end_date.replaceAll('-', '/')).toDateString() }} </p>
                  </div>
                </div> -->
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
              </v-card>
            </v-col>
          </v-row>

          <!-- rooms segments -->
          <div id="cruise-rooms">
            <div v-if="cruiseRoomsResults.length">
              <div class="hidden">
                {{ selectedRoom }}
              </div>
              <v-card
                v-for="(item, i) in cruiseRoomsResults"
                :key="i"
                class="mt-5 pa-5"
                elevation="8"
              >
                <v-card-title class="pa-0 pb-3 brown--text">
                  Room {{ (i+1) }}
                </v-card-title>
                <v-slide-group
                  show-arrows
                >
                  <v-slide-item
                    v-for="(room, j) in item[`room_${i+1}`]"
                    :key="j"
                  >
                    <v-card
                      class="mx-5 my-1"
                      width="350"
                    >
                      <v-card-title class="body-1 late--text d-flex flex-wrap justify-space-between">
                        <div>{{ room.type }}, {{ room.occupancy }}</div>
                        <v-icon v-if="isRoomSelected(room.id, i)" color="success">
                          mdi-check-circle
                        </v-icon>
                      </v-card-title>
                      <v-card-subtitle><span v-for="category in room.categories" :key="category">{{ category }} ,</span></v-card-subtitle>
                      <v-card-subtitle class="pt-0">
                        Maximum Adults {{ room.max_num_adult }} / Maximum children {{ room.max_num_children }}
                      </v-card-subtitle>
                      <v-card-text>
                        <div v-if="room.inclusions.length">
                          <p class="text-h6">
                            Includes
                          </p>
                          <v-chip v-for="inc in room.inclusions" :key="inc" class="ma-1">
                            {{ inc }}
                          </v-chip>
                        </div>
                        <div v-if="room.amenities.length">
                          <p class="text-h6">
                            Amenities
                          </p>
                          <v-chip v-for="amen in room.amenities" :key="amen" class="ma-1">
                            {{ amen }}
                          </v-chip>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <h6 class="body-1 font-weight-bold">
                          USD {{ room.price_per_day }}<small>/Night</small>
                        </h6>
                        <v-spacer />
                        <v-btn v-if="!isRoomSelected(room.id, i)" color="lightBrown white--text px-5" elevation="0" @click="selectRoom(i, room)">
                          Select
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>
              </v-card>
              <v-btn v-if="selectedRooms.length === cruiseRoomsResults.length" color="lightBrown white--text px-15 d-block mx-auto mt-5" :loading="reserveLoading" elevation="0" @click="reserve">
                Reserve
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>
      <template v-else-if="!cruise || cruiseLoading">
        <v-progress-linear
          indeterminate
          color="yellow darken-2"
        />
      </template>
      <p v-else class="text-center">
        No Rooms Available!
      </p>

      <v-dialog v-if="(confirmData && reservationData)" v-model="showPricingDialog" width="500">
        <!-- <v-dialog v-if="(initialPrice && reservationData)" v-model="showPricingDialog" width="500"> -->
        <v-card max-width="500">
          <v-card-title class="px-3 lightBrown white--text">
            Cruise Total price
          </v-card-title>
          <v-card-text class="pt-5">
            <table class="confirmation-table">
              <thead>
                <th>Room</th>
                <th>Quantity</th>
              </thead>
              <tbody>
                <tr v-for="(room, i) in reservationData.rooms" :key="i">
                  <td>{{ room.type }} ({{ room.occupancy }})</td>
                  <td>{{ room.quantity }}</td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
          <v-divider />
          <v-card-actions class="px-3">
            <h6 class="body-1 font-weight-bold">
              USD {{ confirmData.totalPrice }}
            </h6>
            <!-- <h6 class="body-1 font-weight-bold">
              USD {{ initialPrice }}
            </h6> -->
            <v-spacer />
            <v-btn color="lightBrown white--text px-5" @click="proceedToBook">
              Proceed
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import cruisesServices from '~/services/cruisesServices'

export default {
  // asyncData ({ params }) {
  //   // Clear the component's data when entering the page
  //   return {
  //     rooms: 1,
  //     guests: [
  //       {
  //         adults: 1,
  //         children: 0
  //       }
  //     ]
  //   }
  // },
  // beforeRouteEnter (to, from, next) {
  //   // Clear the component's data when entering the route
  //   next((vm) => {
  //     vm.clearData()
  //   })
  // },
  // beforeRouteUpdate (to, from, next) {
  //   // Clear the component's data when the route is updated
  //   this.clearData()
  //   next()
  // },
  data () {
    return {
      cruiseLoading: true,
      cruise: null,
      image: '',
      selectedRooms: [],
      selectedRoom: null,
      reserveLoading: false,
      confirmData: null,
      reservationData: null,
      showPricingDialog: false,
      rooms: 1,
      guests: [
        {
          adults: 1,
          children: 0
        }
      ],
      adults: 1,
      children: 0,
      startDateMenu: false,
      startDate: new Date().toISOString().substring(0, 10),
      endDateMenu: false,
      endDate: '',
      selectLoading: false,
      snackbar: false,
      text: '',
      color: '',
      showAlertBar: false,
      alertText: '',
      initialPrice: 0
    }
  },
  // watch: {
  //   startDate: 'calculateAllPrice'
  // },
  async fetch () {
    try {
      // eslint-disable-next-line no-console
      console.log(this.$route.query)
      const promise = cruisesServices.getCruiseDetails(this.$route.params.id)
      const response = await promise
      this.cruise = response.data.data
      this.image = this.cruise.master_image
    } catch (err) {
      this.showAlert(err.response.data.error, 'error')
    } finally {
      this.cruiseLoading = false
    }
    this.$store.dispatch('setCruiseRoomsResults', [])
  },
  head () {
    return {
      title: this.$route.query.cruise
    }
  },
  computed: {
    ...mapState(['cruiseRoomsResults', 'cruiseChosenDate'])
  },
  methods: {
    clearData () {
      this.rooms = 1
      this.guests = [
        {
          adults: 1,
          children: 0
        }
      ]
    },
    setGuests (guests) {
      console.log(guests)
      this.rooms = guests.length
      this.guests = guests
      // await this.calculateAllPrice()
      this.$store.dispatch('setCruiseGuests', guests)
    },
    async getCruiseRooms () {
      if (this.startDate && this.guests[0].adults) {
        let searchTerms = `start_date=${this.startDate}`
        searchTerms += `&cruise_id=${this.$route.params.id}`
        this.guests.forEach((element, i) => {
          searchTerms += `&roomGuests[${i}][adults]=${element.adults}`
          searchTerms += `&roomGuests[${i}][children]=${element.children}`

          if (element.childrenAges) {
            if (element.childrenAges.length > 0) {
              element.childrenAges.forEach((getAge, index) => {
                searchTerms += `&roomGuests[${i}][child_ages][${index}][child_count]=1`
                searchTerms += `&roomGuests[${i}][child_ages][${index}][age]=${getAge}`
              })
            }
          }
        })
        this.selectLoading = true
        try {
          const promise = cruisesServices.checkCruiseAvailablity(this.$route.params.id, searchTerms)
          const response = await promise
          const results = response.data
          // eslint-disable-next-line no-console
          console.log(results)
          if (results.length) {
            this.$store.dispatch('setCruiseRoomsResults', results)
            this.$store.dispatch('setCruiseChosenDate', this.startDate)
            results.forEach((element, i) => {
              if (element[`room_${i + 1}`].length === 1) {
                this.selectedRooms[i] = element[`room_${i + 1}`][0]
                this.selectRoom = element[`room_${i + 1}`][0]
              }
            })
            document.getElementById('cruise-rooms').scrollIntoView()
          } else {
            this.showAlertBar = true
            this.alertText = 'This cruise is not available under your search terms!'
            setTimeout(() => {
              this.showAlertBar = false
            }, 3500)
          }
        } catch (err) {
          console.log(err)
          this.showAlertBar = true
          this.alertText = err.response.data.error
          setTimeout(() => {
            this.showAlertBar = false
          }, 3500)
        } finally {
          this.selectLoading = false
        }
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please fill all search fields!'
      }
    },
    selectRoom (index, room) {
      console.log(index, room)
      this.selectedRooms[index] = room
      this.selectedRoom = room
    },
    isRoomSelected (id, index) {
      if (this.selectedRooms[index]) {
        return this.selectedRooms[index].id === id
      } else { return false }
    },
    allowedDates (val) {
      const date = new Date(val.replaceAll('-', '/'))
      let days = this.cruise.start_days.filter(item => !!item)
      days = days.map(v => v.toLowerCase())
      const seasons = this.cruise.available_dates
      let allowedDay = false
      if (days.includes(date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()) || !days.length) { allowedDay = true }
      let allowedSeason = false
      if (seasons.length) {
        // for (let index = 0; index < seasons.length; index++) {
        //   if (date.getTime() >= new Date(seasons[index].start_date.replaceAll('-', '/')).getTime() && date.getTime() <= new Date(seasons[index].end_date.replaceAll('-', '/')).getTime()) { allowedSeason = true }
        // }
        // Check if the date falls within any of the availabilities
        for (const season of seasons) {
          const startDate = new Date(season.start_date.replaceAll('-', '/'))
          const endDate = new Date(season.end_date.replaceAll('-', '/'))
          // Get today's date and set the time to 00:00:00 to represent the start of the day
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          // Adjust endDate to make it inclusive of the end of the day
          endDate.setHours(23, 59, 59, 999)
          if (date > today && date >= startDate && date <= endDate) {
            allowedSeason = true
            break
          }
        }
      } else { allowedSeason = true }
      return allowedDay && allowedSeason
    },
    reserve () {
      if (this.selectedRooms.length === this.cruiseRoomsResults.length) {
        const rooms = []
        this.selectedRooms.forEach((el) => {
          el.quantity = 1
          // if (rooms.length) {
          //   if (rooms.find(item => item.id === el.id)) {
          //     rooms.find(item => item.id === el.id).quantity++
          //   }
          // } else {
          //   el.room_id = el.id
          //   rooms.push(el)
          // }
          el.room_id = el.id
          rooms.push(el)
        })
        const payload = {
          start_date: this.cruiseChosenDate,
          // end_date: this.cruiseChosenDates[1],
          adults: this.$store.state.cruiseGuests.adults,
          children: this.$store.state.cruiseGuests.children,
          price: this.initialPrice,
          rooms
        }
        this.reserveLoading = true
        cruisesServices.calculateCruisePrice(this.$route.params.id, payload).then((response) => {
          // eslint-disable-next-line no-console
          console.log(response.data)
          this.confirmData = response.data
          this.reservationData = payload
          this.reservationData.totalPrice = response.data.totalPrice
          // this.reservationData.totalPrice = this.initialPrice
          this.reservationData.cruiseId = this.$route.params.id
          this.reservationData.session = response.data.session_id
          this.showPricingDialog = true
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err)
          this.showAlert(err.message, 'error')
        }).finally(() => {
          this.reserveLoading = false
        })
      }
    },
    proceedToBook () {
      this.$store.dispatch('setCruiseReserveData', this.reservationData)
      this.$router.push({ name: 'booking-module', params: { module: 'cruise' } })
    },
    showAlert (text, color) {
      this.snackbar = true
      this.color = color
      this.text = text
    },
    async calculateAllPrice () {
      const formData = new FormData()
      formData.append('date', this.startDate)

      // Update formData with new guest array
      this.guests.forEach((guest, guestIndex) => {
        formData.append(`sesson[${guestIndex}][adult]`, guest.adults)
        formData.append(`sesson[${guestIndex}][child]`, guest.children)

        if (guest.childrenAges) {
          if (guest.childrenAges.length > 0) {
            guest.childrenAges.forEach((getAge, index) => {
              formData.append(`sesson[${guestIndex}][child_ages][${index}][child_count]`, 1)
              formData.append(`sesson[${guestIndex}][child_ages][${index}][age]`, getAge)
            })
          }
        }
      })

      try {
        const promise = cruisesServices.calculateCruiseAllPrice(this.$route.params.id, formData)
        const response = await promise
        const results = response.data
        console.log(results)
        if (results.status === 200) {
          this.initialPrice = results.total_price
        } else {
          this.initialPrice = 0
          this.snackbar = true
          this.color = 'error'
          this.text = results.errors
          this.loaded = false
        }
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
        this.loaded = false
      }
    }
  }
}
</script>

<style>
.cruise-body {
  scroll-behavior: smooth;
}
.confirmation-table {
    width: 100%;
    text-align: center;
    border: 0.5px solid;
}
.confirmation-table td, .confirmation-table th {
    border: 0.5px solid;
}
.hidden {
    display: none;
}
</style>
