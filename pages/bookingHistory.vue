<template>
  <v-container fluid>
    <v-row>
      <SideBar />
      <v-col cols="12" md="9" class="main-content">
        <v-card>
          <v-card-title>
            <span class="headline">Booking History</span>
          </v-card-title>
          <v-card-text>
            <table class="booking-history-table">
              <thead>
                <tr>
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
                <tr v-for="(booking, index) in bookings" :key="index">
                  <td>{{ booking.type }}</td>
                  <td>{{ booking.title }}</td>
                  <td>{{ booking.orderDate }}</td>
                  <td>{{ booking.duration }}</td>
                  <td>{{ booking.totalFees }}</td>
                  <td>{{ booking.status }}</td>
                  <td>
                    <button class="details-btn" @click="openDetails(booking)">
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
                <p><strong>Order Date:</strong> {{ selectedBooking.orderDate }}</p>
                <p><strong>Duration:</strong> {{ selectedBooking.duration }}</p>
                <p><strong>Total Fees:</strong> {{ selectedBooking.totalFees }}</p>
                <p><strong>Status:</strong> {{ selectedBooking.status }}</p>
                <h4>Customer Info</h4>
                <p><strong>Name:</strong> {{ userInfo.name }}</p>
                <p><strong>Email:</strong> {{ userInfo.email }}</p>
                <p><strong>Phone:</strong> {{ userInfo.phone }}</p>
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

export default {

  data () {
    return {
      selectedBooking: null,
      bookings: [
        { type: 'Hotel', title: 'Luxor Hotel Stay', orderDate: '2024-08-01', duration: '3 days', totalFees: '$500', status: 'Confirmed' },
        { type: 'Trip', title: 'Cairo City Tour', orderDate: '2024-07-25', duration: '1 day', totalFees: '$100', status: 'Completed' },
        { type: 'Cruise', title: 'Nile River Cruise', orderDate: '2024-07-15', duration: '5 days', totalFees: '$1200', status: 'Cancelled' }
      ],
      userInfo: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+123456789'
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    openDetails (booking) {
      this.selectedBooking = booking
    },
    closeDetails () {
      this.selectedBooking = null
    }
  }
}
</script>

  <style scoped>
  .main-content {
    margin-left: 240px; /* Same width as sidebar to avoid overlap */
    padding: 20px;
  }

  .booking-history-table {
    width: 100%;
    border-collapse: collapse;
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
    z-index: 2000; /* Ensure it appears above the navbar */
  }

  .popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    max-width: 80%;
    z-index: 2001; /* Ensure it appears above the overlay */
  }

  .details-btn {
    margin-top: 10px;
    padding: 10px;
    background-color: #4F3316; /* Brown color */
    color: white;
    border: none;
    cursor: pointer;
  }

  .details-btn:hover {
    background-color: #3c2d1c; /* Darker brown color on hover */
  }
  </style>
