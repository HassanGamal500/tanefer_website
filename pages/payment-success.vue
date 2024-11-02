<template>
  <div class="payment-success-page">
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12" md="8" class="text-center">
          <!-- Success Icon or Image -->
          <v-img
            src="https://cdn.pixabay.com/photo/2012/11/21/10/24/building-66789_1280.jpg"
            alt="Success Image"
            class="success-image"
            height="300"
          />
          <!-- Heading -->
          <h1 class="display-2 mt-5">
            Payment Successful
          </h1>
          <p class="text-h5">
            Your booking has been confirmed!
          </p>
          <p class="text-h6 mt-3">
            Have a wonderful trip and safe travels. We are excited to be part of your journey!
          </p>
          <!-- Button to return to home or another page -->
          <v-btn
            class="white--text mt-5"
            color="primary"
            large
            @click="goHome"
          >
            Return to Homepage
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import hotelsServices from '~/services/HotelsServices'
// import tripsServices from '~/services/tripsServices'

export default {
  async mounted () {
    const urlParams = new URLSearchParams(window.location.search)
    const formDataId = urlParams.get('merchant_extra') // Fetch formDataId from 'merchant_extra'

    if (formDataId) {
      console.log('formDataId (merchant_extra) found:', formDataId) // Verify formDataId is retrieved
      try {
      // Prepare the payload to send to the backend
        const body = {
          formDataId,
          book_after_payment: '1' // Tell the backend to finalize the booking
        }

        console.log('Sending request to finalize booking with body:', body)

        // Call the backend to finalize the booking
        await hotelsServices.saveHotel(body)
        // this.confirmBooking()
        this.snackbar = true
        this.color = 'success'
        this.text = 'Booking successfully finalized!'
      } catch (error) {
        console.error('Error during final booking confirmation:', error)
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong while finalizing your booking.'
      }
    } else {
      console.log('No formDataId found in URL parameters.')
    }
  },
  methods: {
    // confirmBooking () {
    //   // ?amount=110000&response_code=14000&card_number=****************&card_holder_name=****&signature=365e3f128cd3229c8908fc2f3e2da63ea1b18b1b309652b5ee492e4e79cd0d7c&merchant_identifier=CwCfehEU&access_code=Xnx4srzFskSSrNGkxlr8&payment_option=VISA&expiry_date=****&customer_ip=**************&language=en&eci=ECOMMERCE&fort_id=169996200010637834&command=PURCHASE&merchant_extra=5&response_message=Success&merchant_reference=TANEFER-5805816523&authorization_code=736332&customer_email=***********************&currency=USD&status=14
    //   // console.log(window.location.href)
    //   const query = this.$route.fullPath.split('?')[1] + '&url=' + window.location.href
    //   tripsServices.confirmTripBooking(query)
    // },
    goHome () {
      this.$router.push('/')
    }
  }

}
</script>

  <style scoped>
  .payment-success-page {
    background-color: #f7f7f7;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .success-image {
    border-radius: 15px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-weight: 700;
    color: #2e7d32;
  }

  p {
    color: #424242;
  }

  .v-btn {
    background-color: #4caf50;
    font-size: 18px;
  }
  </style>
