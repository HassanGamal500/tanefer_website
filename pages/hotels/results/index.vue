<!-- eslint-disable no-console -->
<template>
  <v-container>
    <!-- First Row -->
    <v-row>
      <!-- Left Column: "Hotels in *Destination*" -->
      <v-col cols="12" md="6">
        <h1>Hotels in {{ destination }}</h1>
        <p class="subtitle">
          Date: {{ selectedDate }} | Rooms: {{ rooms }} | Occupancy: {{ roomOccupancy }}
        </p>
      </v-col>
    </v-row>

    <!-- Second Row: Sidebar and Main Content -->
    <v-row>
      <!-- Sidebar (col-4) -->
      <v-col cols="12" md="3">
        <v-card class="pa-3">
          <h3>Filters</h3>
          <!-- Add dynamic sidebar content -->
          <v-list>
            <v-list-item v-for="(filter, index) in filters" :key="index">
              <v-list-item-title>{{ filter.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Main Content (col-8) -->
      <v-col cols="12" md="9">
        <v-card class="pa-3">
          <h3>Available Hotels</h3>
          <!-- <v-list v-if="hotels.length">
            <v-list-item v-for="(hotel, index) in hotels" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ hotel.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ hotel.address }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div v-else>
            <p>No hotels available for the selected criteria.</p>
          </div> -->
          <!-- hotel card -->
          <v-card class="hotel-card" max-width="650px" elevation="2">
            <v-row no-gutters>
              <!-- Hotel Image -->
              <v-col cols="4">
                <v-img
                  src="https://images.unsplash.com/photo-1576671084238-28aa401bd1e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fGhvdGVsfGVufDB8fHx8MTYxODMwMjQ0Ng&ixlib=rb-1.2.1&q=80&w=1080"
                  alt="Hotel Image"
                  height="180px"
                  class="hotel-image"
                />
              </v-col>

              <!-- Hotel Info -->
              <v-col cols="8" class="pa-3">
                <!-- Hotel Name and Location -->
                <div class="d-flex justify-space-between align-center mb-1">
                  <div>
                    <h4 class="mb-0 font-weight-bold">
                      Helnan Palace Hotel
                    </h4> <!-- Replace with dynamic hotel name -->
                    <v-icon color="red" class="mr-1">
                      mdi-map-marker
                    </v-icon>
                    <span class="grey--text">Alexandria, Egypt - <a href="#">Map</a></span>
                  </div>
                </div>

                <!-- Hotel Description (with adjusted padding to avoid overlap) -->
                <div class="grey--text text-justify description">
                  Helnan Palace Hotel - Adults Only features a seasonal outdoor swimming pool, garden, terrace, and restaurant in Alexandria. <!-- Replace with dynamic hotel description -->
                </div>

                <!-- Price and Rating moved to top-right above the description -->
                <div class="price-wrapper text-right">
                  <v-rating value="4" color="gold" dense readonly /> <!-- Gold rating -->
                  <small class="grey--text">6.0 - Good</small>
                  <br>
                  <small class="grey--text">Best stay price</small>
                  <div class="font-weight-bold text-h5">
                    $935.20
                  </div> <!-- Replace with dynamic price -->
                </div>
              </v-col>
            </v-row>

            <!-- Buttons (Info, Compare, Share) at the bottom with brown color -->
            <v-row no-gutters>
              <v-col cols="12" class="pa-3">
                <div class="mt-2 d-flex justify-space-between align-center">
                  <div>
                    <v-btn small outlined color="brown" class="mr-2 no-wrap">
                      Info
                    </v-btn>
                    <v-btn small outlined color="brown" class="mr-2 no-wrap">
                      Compare
                    </v-btn>
                    <v-btn small outlined icon color="brown" class="mr-2 no-wrap">
                      <v-icon>mdi-share-variant</v-icon>
                    </v-btn>
                  </div>
                  <v-btn small color="brown">
                    Options
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      destination: '', // Destination passed dynamically (e.g., from route)
      selectedDate: '', // Date input
      rooms: 1, // Number of rooms
      roomOccupancy: '', // Room occupancy
      filters: [], // Dynamic filters (e.g., fetched from API)
      hotels: [] // Dynamic hotel list (fetched from API)
    }
  },
  async created () {
    // Fetch destination and search parameters from route query or some other dynamic source
    this.destination = this.$route.query.destination || 'Cairo' // Example
    this.selectedDate = this.$route.query.date || '2024-09-15' // Example default date
    this.rooms = this.$route.query.rooms || 1
    this.roomOccupancy = this.$route.query.occupancy || 'Double'

    // Fetch dynamic filters (if needed)
    await this.fetchFilters()

    // Fetch available hotels based on the search criteria
    await this.fetchHotels()
  },
  methods: {
    // Fetch available hotels based on the search criteria
    async fetchHotels () {
      try {
        const response = await this.$axios.get('/api/hotels', {
          params: {
            destination: this.destination,
            date: this.selectedDate,
            rooms: this.rooms,
            occupancy: this.roomOccupancy
          }
        })
        this.hotels = response.data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching hotels:', error)
        this.hotels = []
      }
    },

    // Fetch dynamic filters for the sidebar (e.g., amenities, price ranges)
    async fetchFilters () {
      try {
        const response = await this.$axios.get('/api/hotel-filters')
        this.filters = response.data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching filters:', error)
        this.filters = []
      }
    }
  }
}
</script>
<style scoped>
.hotel-card {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.hotel-image {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.price-wrapper {
  position: absolute;
  top: 15px;
  right: 15px;
}

.font-weight-bold {
  font-weight: 600 !important;
}

.description {
  margin-right: 140px; /* Add margin to the right to avoid overlapping with the price */
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mb-1 {
  margin-bottom: 4px !important;
}

.mb-2 {
  margin-bottom: 8px !important;
}

.mr-2 {
  margin-right: 8px !important;
}

.text-justify {
  text-align: justify;
}

/* Styling for brown buttons */
.v-btn {
  background-color: #8B4513 !important; /* Brown color */
  color: white !important;
}

.v-btn:hover {
  background-color: #A0522D !important; /* Lighter brown on hover */
}

.v-icon {
  color: #fff !important; /* Ensure icon inside button matches brown color */
}

.no-wrap {
  border: none !important;
}

</style>
