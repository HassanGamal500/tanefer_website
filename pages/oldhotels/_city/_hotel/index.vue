<!-- eslint-disable vue/no-template-shadow -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div v-if="loaded" class="text-center my-10">
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <img max-width="200" class="blink-2" src="../../../../assets/images/tanfer.png" />
    </div>
    <v-snackbar v-model="snackbar" :color="color" top :timeout="5000">
      <v-row justify="space-between">
        {{ text }}
        <v-btn
          dark
          icon
          @click="snackbar = false"
        >
          <v-icon color="white">
            mdi-close
          </v-icon>
        </v-btn>
      </v-row>
    </v-snackbar>
    <v-container v-if="noData">
      <p class="body-1 font-weight-bold text-center">
        Sorry, We couldn't get any result <router-link to="/hotels" style="color: blue; margin-left: 5px;">
          Search again
        </router-link>
      </p>
    </v-container>
    <div v-if="data" class="t-container">
      <div class="hotel-page-head">
        <div class="hotel-page-head-name-block">
          <h1 class="hotel-page-name-h1">
            {{ hotel.HotelName }}<br>
          </h1>
          <div :class="`stars-bar _${hotel.HotelStars}-star`" />
          <div class="hotel-page-address">
            <img src="../../../../assets/images/location-icon.png" loading="lazy" alt="" class="small-map-icon">
            <div class="hotel-address-txt">
              {{ hotel.HotelAddress }} ( <span class="show-hotel-map" @click="openMap(hotel.HotelIndex, hotel.map)">Show on map</span> )
            </div>
          </div>
        </div>
      </div>
      <ul role="list" class="hotel-menu w-list-unstyled">
        <li>
          <span :class="isIntersectingOverview ? 'hotel-menu-link w--current' : 'hotel-menu-link'">Overview</span>
        </li>
        <li>
          <span :class="isIntersectingRooms ? 'hotel-menu-link w--current' : 'hotel-menu-link'">Rooms</span>
        </li>
        <li>
          <span :class="isIntersectingDesc ? 'hotel-menu-link w--current' : 'hotel-menu-link'">Facilities</span>
        </li>
      </ul>
      <div id="hotel-overview" v-intersect="onIntersectOverview">
        <div class="hotel-imgs-block">
          <v-gallery :images="images" :index="index" @close="index = null" />
          <template v-for="(image, imageIndex) in images">
            <div
              v-if="imageIndex < 2"
              :id="`image-${imageIndex}`"
              :key="imageIndex"
              class="image"
              :style="{ backgroundImage: 'url(' + image + ')' }"
              @click="index = imageIndex"
            >
              <div v-if="imageIndex === 1" class="gallery">
                <div class="images-show">
                  <img src="../../../../assets/images/img-icon.png" loading="lazy" alt="" class="all-img-icon">
                  <div> See all {{ images.length }} photos</div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <h2 class="hotel-page-h2">
          Overview
        </h2>
        <div class="hotel-verview-flex">
          <div>
            <div id="hotel-rooms" v-intersect="onIntersectRooms">
              <div class="hotel-over-p" v-html="hotel.HotelDescription" />
              <div>
                <h2 class="hotel-page-h2">
                  Choose your room<br>
                </h2>
                <v-expansion-panels accordion>
                  <template v-if="$store.state.hotelSearch.guestsInfo.length === 1">
                    <!-- eslint-disable-next-line vue/no-template-shadow -->
                    <v-expansion-panel v-for="room in uniqueRooms" :key="room.roomCode">
                      <v-expansion-panel-header>{{ room.roomName }}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="my-5">
                          <v-card-title class="grey lighten-4 black--text">
                            {{ room.roomName }}
                          </v-card-title>
                          <room-card :room="room" show-prices="show" />
                          <v-card-actions>
                            <v-spacer />
                            <v-btn color="late" dark large class="px-5" @click="selectedRooms.push(room); reserve()">
                              Reserve
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </template>
                  <template v-else>
                    <v-expansion-panel v-for="(compination, i) in compinations" :key="`compination-${i}`">
                      <v-expansion-panel-header>{{ getAvailableRooms(compination).unique[0].roomName }}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="my-5">
                          <v-card-title class="grey lighten-4 black--text">
                            {{ getAvailableRooms(compination).unique[0].roomName }}
                          </v-card-title>
                          <div>
                            <roomCard v-for="room in getAvailableRooms(compination).unique" :key="room.roomCode" :room="room" :show-prices="getAvailableRooms(compination).unique.length === 1 ? 'show' : 'hide'" />
                          </div>
                          <v-row v-if="getAvailableRooms(compination).unique.length > 1" class="px-5">
                            <v-expansion-panels class="elevation-0">
                              <v-expansion-panel v-for="(room, i) in getAvailableRooms(compination).available" :key="`roomPrice-${i}`">
                                <v-expansion-panel-header>
                                  Room-{{ i }} Day Rates
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                  <p v-for="(rate, j) in room.daysRate" :key="j" class="body-1 black--text">
                                    ${{ rate.baseFare }} on <dateDisplay :date="rate.date" />
                                  </p>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                          </v-row>
                          <v-card-actions>
                            <v-spacer />
                            <v-btn color="late" dark large class="px-5" @click="selectMultiRooms(compination);">
                              Reserve {{ $store.state.hotelSearch.guestsInfo.length }} Rooms
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </template>
                </v-expansion-panels>
              </div>
            </div>
          </div>

          <div class="hotel-top-facilities">
            <div class="hotel-top-facilities-inner">
              <h4 class="hotel-h5">
                Most popular facilities<br>
              </h4>
              <div v-for="(item, i) in hotel.HotelFacilities" :key="i" class="facility-row">
                <div class="facility-icon">
                  <v-icon color="late" small>
                    mdi-circle
                  </v-icon>
                </div>
                <div>{{ item }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="hotel-facilities" v-intersect="onIntersectDesc">
        <h2 class="hotel-page-h2">
          More information about {{ hotel.HotelName }}<br>
        </h2>
        <div class="hotel-facitlities">
          <div class="h-facility-block">
            <h5>
              <v-icon color="late">
                mdi-phone
              </v-icon>
              {{ hotel.HotelPhone }}
              <v-icon color="late">
                mdi-fax
              </v-icon>
              {{ hotel.HotelFax }}
            </h5>
          </div>
          <h4>Near By Places</h4>
          <div class="roomd-details-f-row">
            <div v-html="hotel.nearByPlaces" />
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="dialog"
      max-width="80%"
      style="z-index: 10000;"
    >
      <GMap
        ref="gMap"
        language="en"
        :center="center"
        :zoom="16 "
      >
        <GMapMarker
          v-for="(m, i) in markers"
          :key="i"
          :position="m.position"
          @click="center=m.position"
        />
      </GMap>
    </v-dialog>
  </div>
</template>

<script>
// import VueGallery from 'vue-gallery'
import hotelsServices from '~/services/HotelsServices'
import roomCard from '~/components/hotelsComponents/RoomCard'

export default {
  title: 'Hotel Details',
  components: {
    // gallery: VueGallery,
    roomCard
  },
  data () {
    return {
      loaded: true,
      snackbar: false,
      room: 1,
      color: '',
      text: '',
      noData: false,
      data: false,
      hotel: {},
      hotelRooms: [],
      length: null,
      images: [],
      index: null,
      allrooms: [],
      availableRooms: [],
      selectedRooms: [],
      uniqueRooms: [],
      supplements: [],
      compinations: [],
      hotelsTimeOut: null,
      hotelsOverlay: false,
      now: null,
      prevTime: null,
      center: {
        lat: 0,
        lng: 0
      },
      markers: [],
      dialog: false,
      imageDialog: false,
      onboarding: 0,
      isIntersectingOverview: false,
      isIntersectingRooms: false,
      isIntersectingDesc: false
    }
  },
  head () {
    return {
      title: this.$route.params.hotel
    }
  },
  created () {
    // eslint-disable-next-line
    console.log('in', this.$store.state.hotelParams, this.$route.query)
    if (this.$store.state.hotelParams || this.$route.query) {
      const params = this.$store.state.hotelParams || this.$route.query
      this.getHotel(params)
    } else {
      // eslint-disable-next-line
      console.log('out')
      // this.$router.push({ name: 'hotels' })
    }
  },
  methods: {
    getHotel (params) {
      hotelsServices.getHotelDetails(params.sessionId, params.hotelIndex, params.hotelCode).then((res) => {
        // eslint-disable-next-line
        console.log(res)
        if (res.data.status === true) {
          this.loaded = false
          this.data = true
          this.hotel = res.data.data.Hotel
          this.length = res.data.data.Hotel.images.length
          this.images = res.data.data.Hotel.images
          this.allrooms = res.data.data.HotelRooms
          this.compinations = res.data.data.OptionsForBooking.RoomCombination
          this.uniqueRooms = this.getUniqueRooms(this.allrooms)
          let roomIndex = ''
          if (typeof this.allrooms !== 'string') {
            this.allrooms.forEach((room) => {
              if (room.supplements) {
                room.supplements.forEach((sup) => {
                  if (sup.isMandatory) { this.supplements.push({ sup: sup.id, room: room.roomIndex, accept: true }) }
                })
              }
              if (room.roomIndex !== roomIndex) {
                roomIndex = room.roomIndex
                this.hotelRooms.push(room)
              } else { roomIndex = room.roomIndex }
            })
            this.getAvailableRooms(this.hotelRooms[0].roomIndex, this.hotelRooms[0].roomCombination ? this.hotelRooms[0].roomCombination : [])
          }
        } else {
          this.loaded = false
          this.noData = true
        }
      }, () => {
        this.loaded = false
        this.noData = true
      })
    },
    onIntersectOverview (entries, observer) {
      this.isIntersectingOverview = entries[0].isIntersecting
    },
    onIntersectRooms (entries, observer) {
      this.isIntersectingRooms = entries[0].isIntersecting
    },
    onIntersectDesc (entries, observer) {
      this.isIntersectingDesc = entries[0].isIntersecting
    },
    openMap (index, position) {
      this.dialog = !this.dialog
      this.center.lat = parseFloat(position.Latitude)
      this.center.lng = parseFloat(position.Longitude)
      this.markers.push({ position: this.center })
    },
    getAvailableRooms (compination) {
      const indexes = [...new Set(compination.RoomIndex)]
      const availableRooms = []
      this.allrooms.forEach((room) => {
        indexes.forEach((index) => {
          if (room.roomIndex === index) { availableRooms.push(room) }
        })
      })
      const uniqueRooms = this.getUniqueRooms(availableRooms)
      return { unique: uniqueRooms, available: availableRooms }
    },
    getUniqueRooms (rooms) {
      const uniqueRooms = rooms.reduce((acc, current) => {
        // const x = acc.find(item => item.roomName === current.roomName && item.rateSummary.totalFare === current.rateSummary.totalFare)
        const x = acc.find(item => item === current)
        if (!x) {
          return acc.concat([current])
        } else {
          return acc
        }
      }, [])
      return uniqueRooms
    },
    selectMultiRooms (compination) {
      const rooms = this.getAvailableRooms(compination).available
      for (let i = 0; i < this.$store.state.hotelSearch.guestsInfo.length; i++) {
        this.selectedRooms.push(rooms[i])
      }
      this.reserve()
    },
    reserve () {
      const reservationParams = {
        sessionId: this.$route.query.sessionId,
        hotelIndex: this.$route.query.hotelIndex,
        hotelCode: this.$route.query.hotelCode,
        rooms: this.selectedRooms,
        hotel: this.hotel,
        supplements: this.supplements
      }
      this.$store.dispatch('setRoomsParams', reservationParams)
      this.$router.push({ name: 'hotels-city-hotel-booking', query: reservationParams })
    }
  }
}
</script>

  <style>
    .image {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      border: 5px solid #fff;
      width: '25%';
      cursor: pointer;
      height: '200px';
      /* margin-bottom: 5px; */
    }
    #image-0 {
      height: 300px;
      width: 75%;
    }
    #image-1 {
      height: 300px;
      width: 25%;
      padding: 2px;
      position: relative;
    }
    .images-show {
      position: absolute;
      bottom: 5px;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      padding: 5px 7px;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
  </style>
