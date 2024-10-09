<template>
  <v-container>
    <LoadingScreen v-if="isLoading" />
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

    <v-carousel hide-delimiters height="100%" show-arrows>
      <v-carousel-item
        v-for="(imageGroup, index) in chunkImages(gtaHotelDetails?.Images?.Image.filter(img => img.Type === 'BIG') || [], 2)"
        :key="index"
      >
        <v-row>
          <v-col
            v-for="(img, imgIndex) in imageGroup"
            :key="imgIndex"
            cols="6"
          >
            <v-img
              :src="img.FileName || 'https://source.unsplash.com/user/c_v_r/1900x800'"
              height="500px"
              width="100%"
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
        <h3>All Room Options</h3>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-for="(room, index) in gtaHotelDetails?.HotelRooms?.HotelRoom || []" :key="index" cols="12" md="6">
            <v-card class="mb-3">
              <v-card-title class="body-1 late--text d-flex flex-wrap justify-space-between">
                {{ room.Name || 'Room Name' }}
              </v-card-title>
              <v-row>
                <v-col cols="12">
                  <p class="grey--text justify-center ma-1">
                    Occupancy: {{ room.RoomOccupancy?.MaxAdults }} Adults, {{ room.RoomOccupancy?.MaxChildren }} Children
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>
        <h3>Hotel Description</h3>
      </v-card-title>
      <v-card-text>
        <p>
          <strong>Description:</strong>
          <span>{{ gtaHotelDetails?.Descriptions?.Description[0]?. _ || gtaHotelDetails?.Descriptions?.Description?. _ || 'Description not available' }}</span>
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
          <strong>Contact Information:</strong> <br>
          <v-icon>mdi-cellphone-basic</v-icon> Phone: {{ gtaHotelDetails?.ContactInfo?.PhoneNumbers?.PhoneNumber?._ || 'Currently not available' }} <br>
          <v-icon>mdi-mail</v-icon>Email: {{ gtaHotelDetails?.ContactInfo?.Emails?.Email?._ || 'Currently not available' }}
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
      cancellationPolicy: null,
      isLoading: true
    }
  },
  async mounted () {
    const hotelCode = this.$route.query.hotelCode
    this.cancellationPolicy = this.$route.query.cancellationPolicy

    if (hotelCode) {
      try {
        this.isLoading = true

        const response = await hotelsServices.getGtaHotelDetails(hotelCode)
        this.gtaHotelDetails = response.data.ContentRS.Contents.HotelContent

        if (this.gtaHotelDetails.Images && this.gtaHotelDetails.Images.Image) {
          this.gtaHotelDetails.Images.Image = this.gtaHotelDetails.Images.Image.filter(image => image.Type === 'BIG')
        }
      } catch (error) {
      // Handle error
        // eslint-disable-next-line no-console
        console.error('Error fetching hotel details:', error)
      } finally {
        this.isLoading = false
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
