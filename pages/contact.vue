<template>
  <div class="bg">
    <div class="overlay">
      <v-row
        no-gutters
        class="fill-height white--text px-5 py-10"
        align="center"
        justify="start"
      >
        <div>
          <div class="text-h1">
            Contact us
          </div>
          <v-divider />
          <h2>Leave a message</h2>
          <div class="white--text my-3 text-h6">
            <v-icon left color="white">
              mdi-email
            </v-icon>
            <span>info@tanefer.com</span>
          </div>
          <div class="white--text my-3 text-h6">
            <v-icon left color="white">
              mdi-email
            </v-icon>
            <span>online@tanefer.com</span>
          </div>
          <h2>Egypt</h2>
          <div class="white--text my-3 text-h6">
            <v-icon left color="white">
              mdi-map-marker
            </v-icon>
            <span>6066 Leesburg Pike Suite #430 Falls Church, VA 20141</span>
          </div>
          <div class="white--text my-3 text-h6">
            <v-icon left color="white">
              mdi-phone
            </v-icon>
            <span>+1-571-406-3055</span>
          </div>
          <h2>USA</h2>
          <div class="white--text my-3 text-h6">
            <v-icon left color="white">
              mdi-map-marker
            </v-icon>
            <span>75 Mosadaq St #5, Giza, Egypt</span>
          </div>
          <div class="white--text my-3 text-h6">
            <v-icon left color="white">
              mdi-phone
            </v-icon>
            <span>+20 3 3384000</span>
          </div>
        </div>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

  <style scoped>
    .bg {
      background: url('~/assets/contact.jpg') no-repeat;
      height: 100%;
    }
    .overlay {
      background-color: #00000050;
    }
  </style>
