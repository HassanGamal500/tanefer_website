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
export default {
  methods: {
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
