<template>
  <v-container>
    <div class="mb-5">
      <h3 class="font-weight-bold" style="font-size: 24px;">
        {{ gtaHotelDetails?.HotelName || 'Hotel Name' }}
      </h3>

      <div>
        <p class="grey--text">
          <v-icon color="red" small>
            mdi-map-marker
          </v-icon>
          {{ gtaHotelDetails?.Address?.Address || 'Address not available' }}
        </p>
        <p>
          <v-rating
            :value="gtaHotelDetails?.HotelCategory ? parseInt(gtaHotelDetails.HotelCategory._) : 0"
            active-color="yellow-accent-4"
            dense
            readonly
          />
          <span> {{ gtaHotelDetails?.HotelCategory ? gtaHotelDetails.HotelCategory._ : " " }}</span>
        </p>
      </div>
    </div>

    <v-carousel hide-delimiters height="200" show-arrows>
      <v-carousel-item
        v-for="(imageGroup, index) in chunkImages(gtaHotelDetails?.Images?.Image.filter(img => img.Type === 'BIG') || [], 4)"
        :key="index"
      >
        <v-row>
          <v-col
            v-for="(img, imgIndex) in imageGroup"
            :key="imgIndex"
            cols="3"
          >
            <v-img
              :src="img.FileName || 'https://source.unsplash.com/user/c_v_r/1900x800'"
              height="200"
              contain
              @click="openImageModal(img.FileName)"
            />
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>

    <v-dialog v-model="imageDialog" max-width="800px" z-index="600">
      <v-img :src="dialogImage" @click.stop />
    </v-dialog>

    <v-card class="mt-4">
      <v-card-title>
        <h3>Room Options</h3>
      </v-card-title>
      <v-card-text>
        <v-col v-for="(room, index) in gtaHotelDetails?.HotelRooms?.HotelRoom || []" :key="index" cols="12">
          <v-card class="mb-3">
            <v-card-title>{{ room.Name || 'Room Name' }}</v-card-title>
            <v-row>
              <v-col cols="12" md="6">
                <v-img
                  :src="room.Images?.[0]?.FileName || 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'"
                  height="150px"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-card-text>
                  <p class="grey--text justify-center">
                    {{ room.Description || 'Room description not available' }}
                  </p>
                  <v-btn class="float-right v-btn-brown justify-end" @click="bookRoom(room.Code)">
                    Book
                  </v-btn>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>
        <h3>Hotel Description</h3>
      </v-card-title>
      <v-card-text>
        <p>
          <strong>Description:</strong>
          <span>{{ gtaHotelDetails?.Descriptions?.Description[0]?. _ || 'Description not available' }}</span>
        </p>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>
        <h3>Hotel Services</h3>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-chip
            v-for="(feature, index) in gtaHotelDetails?.Features?.Feature || []"
            :key="index"
            class="ma-1"
          >
            {{ feature._ || 'Feature not available' }}
          </v-chip>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>
        <h3>Additional Information</h3>
      </v-card-title>
      <v-card-text>
        <p>
          <strong>Rating:</strong> {{ gtaHotelDetails?.Rating || 'Rating not available' }}
        </p>
        <p>
          <strong>Cancellation Policy:</strong>
          <!-- {{ gtaHotelDetails?.HotelOptions?.HotelOption[0]?.CancellationPolicy?.Description || 'Policy not available' }} -->
          {{ cancellationPolicy }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import hotelsServices from '~/services/HotelsServices'

export default {
  data () {
    return {
      gtaHotelDetails: null,
      imageDialog: false,
      dialogImage: '',
      cancellationPolicy: null
    }
  },
  async mounted () {
    const hotelCode = this.$route.query.hotelCode
    this.cancellationPolicy = this.$route.query.cancellationPolicy
    if (hotelCode) {
      try {
        const response = await hotelsServices.getGtaHotelDetails(hotelCode)
        this.gtaHotelDetails = response.data.ContentRS.Contents.HotelContent

        if (this.gtaHotelDetails.Images && this.gtaHotelDetails.Images.Image) {
          this.gtaHotelDetails.Images.Image = this.gtaHotelDetails.Images.Image.filter(image => image.Type === 'BIG')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching hotel details:', error)
      }
    }
  },
  methods: {
    bookRoom (roomCode) {
      // Implement booking logic
      // eslint-disable-next-line no-console
      console.log('Booking room:', roomCode)
    },
    openImageModal (imageSrc) {
      this.dialogImage = imageSrc
      this.imageDialog = true
    },
    chunkImages (images, chunkSize) {
      const result = []
      for (let i = 0; i < images.length; i += chunkSize) {
        result.push(images.slice(i, i + chunkSize))
      }
      return result
    }
  }
}
</script>

<style>
/* ::v-deep button.v-icon {
  color: gold !important;
} */
::v-deep .v-application .primary--text {
  color: gold !important;
}
.v-btn-brown {
  background-color: #8B4513 !important; /* Brown color */
  color: white !important;
}

.v-btn-brown:hover {
  background-color: #A0522D !important; /* Lighter brown on hover */
}
</style>
