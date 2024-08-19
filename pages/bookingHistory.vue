<template>
  <v-container fluid>
    <v-row>
      <SideBar />
      <v-col cols="12" md="9" class="main-content">
        <v-card class="booking-history-card">
          <v-card-title>
            <span class="headline">Booking History</span>
          </v-card-title>
          <v-card-text>
            <table class="booking-history-table">
              <thead>
                <tr class="text-center">
                  <th>Type</th>
                  <th>Title</th>
                  <th>Order Date</th>
                  <th>Duration</th>
                  <th>Total Fees</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in bookings" :key="booking.id">
                  <td>{{ booking.type }}</td>
                  <td>{{ booking.title }}</td>
                  <td>{{ booking.date }}</td>
                  <td>{{ booking.duration || 'N/A' }}</td>
                  <td>{{ booking.total | currency }}</td>
                  <td>{{ booking.status }}</td>
                  <td>
                    <button class="details-btn" @click="fetchBookingDetails(booking.id)">
                      Get Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="selectedBooking" class="popup-overlay" @click="closeDetails">
              <div class="popup-content" @click.stop>
                <h3>Booking Details</h3>
                <p><strong>Type:</strong> {{ selectedBooking.type }}</p>
                <p><strong>Title:</strong> {{ selectedBooking.title }}</p>
                <p><strong>Order Date:</strong> {{ selectedBooking.date }}</p>
                <p><strong>Duration:</strong> {{ selectedBooking.duration || 'N/A' }}</p>
                <p><strong>Status:</strong> {{ selectedBooking.status }}</p>
                <p><strong>Accommodation Price:</strong> {{ selectedBooking.details.accommodation_price || 'N/A' }}</p>
                <p><strong>Adults:</strong> {{ selectedBooking.details.adults }}</p>
                <p><strong>Children:</strong> {{ selectedBooking.details.children }}</p>
                <button class="details-btn" @click="closeDetails">
                  Close
                </button>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import clientAPI from '../services/axiosConfig'

export default {
  filters: {
    currency (value) {
      if (!value) { return '' }
      return `$${value.toFixed(2)}`
    }
  },
  data () {
    return {
      selectedBooking: null,
      bookings: [],
      userInfo: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  async mounted () {
    try {
      const token = localStorage.getItem('authToken')
      const response = await clientAPI('https://api.tanefer.com/api/v2/booking').get('/histories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.status === 200) {
        const responseData = response.data.data
        this.bookings = responseData.historyList
        this.userInfo = responseData.user
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching booking histories:', error)
      alert('Error fetching booking histories.')
    }
  },
  methods: {
    async fetchBookingDetails (id) {
      try {
        const token = localStorage.getItem('authToken')
        const response = await clientAPI('https://api.tanefer.com/api/v2/booking').get(`/history-details/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.status === 200) {
          this.selectedBooking = response.data.data
        } else {
        // Handle unexpected status codes
          // eslint-disable-next-line no-console
          console.error('Unexpected response status:', response.status)
          alert('Unexpected error occurred while fetching booking details.')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching booking details:', error)
        alert('Error fetching booking details.')
      }
    },
    closeDetails () {
      this.selectedBooking = null
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: absolute;
  width: 240px;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #CFB9A1;
  padding-top: 20px;
  padding-left: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.main-content {
  margin-left: 240px;
  padding: 20px;
}

.booking-history-table {
  width: 100%;
  border-collapse: collapse;
}

.booking-history-card {
  height: 400px;
}

.booking-history-table th, .booking-history-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.booking-history-table th {
  background-color: #f2f2f2;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 80%;
  z-index: 2001;
}

.details-btn {
  margin-top: 10px;
  padding: 10px;
  background-color: #4F3316;
  color: white;
  border: none;
  cursor: pointer;
}

.details-btn:hover {
  background-color: #3c2d1c;
}

.text-center {
  text-align: center;
}
</style>
