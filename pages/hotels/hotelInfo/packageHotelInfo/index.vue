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
    <div v-if="gtaHotelDetails?.Images?.Image?.length" class="gallery-container">
      <!-- Main Image Display with Scroll Arrows -->
      <div class="main-image-container">
        <v-img :src="currentMainImage" class="main-image" contain />
        <v-btn
          icon
          :style="{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', zIndex: 10 }"
          class="scroll-btn-left"
          @click="prevImage"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          icon
          :style="{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }"
          class="scroll-btn-right"
          @click="nextImage"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      <v-row justify="center">
        <v-col cols="12" md="12">
          <!-- Contain within a specific width -->
          <div class="thumbnails-container">
            <v-img
              v-for="(image, index) in gtaHotelDetails.Images.Image"
              :key="index"
              :src="image.FileName"
              class="thumbnail"
              @click="selectImage(index)"
            />
          </div>
        </v-col>
      </v-row>
    </div>
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
          <ul>
            <li v-for="(feature, index) in gtaHotelDetails?.Features?.Feature || []" :key="index">
              {{ feature._ || 'Feature not available' }}
            </li>
          </ul>
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
      isLoading: true,
      currentImageIndex: 0
    }
  },
  computed: {
    currentMainImage () {
      return this.gtaHotelDetails.Images.Image[this.currentImageIndex]?.FileName || 'default-image-url'
    },
    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
    }
  },
  async mounted () {
    const hotelCode = this.$route.query.hotelCode
    // this.cancellationPolicy = this.$route.query.cancellationPolicy

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
    selectImage (index) {
      this.currentImageIndex = index
    },
    nextImage () {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.gtaHotelDetails.Images.Image.length
    },
    prevImage () {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.gtaHotelDetails.Images.Image.length) %
        this.gtaHotelDetails.Images.Image.length
    },
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

.gallery-container {
  max-width: 600px;
  margin: 0 auto;
}

.main-image-container {
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: #f3f3f3;
}

.main-image {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease-in-out;
  filter: blur(0.5px);
}

.main-image:hover {
  transform: scale(1.03); /* Slight zoom effect for smoothness */
}

.scroll-btn-left:hover,
.scroll-btn-right:hover {
  background-color: rgba(0, 0, 0, 0.7); /* Darker shade on hover */
}

.scroll-btn-left,
.scroll-btn-right {
  position: absolute;
  top: 50%;
  width: 40px; /* Set a fixed width */
  height: 40px; /* Set a fixed height */
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  z-index: 10;
  cursor: pointer;
  pointer-events: auto; /* Ensure they remain clickable */
}

.scroll-btn-left {
  left: 10px; /* Ensure visible within container */
}

.scroll-btn-right {
  right: 10px; /* Ensure visible within container */
}

/* Centered Thumbnails Container with Fixed Width */
/* Centered Thumbnails Container */
.thumbnails-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  overflow-x: auto;
  padding: 0 10px;
  scroll-behavior: smooth; /* Smooth scrolling for better experience */
}

/* Hide scrollbar in most browsers */
.thumbnails-container::-webkit-scrollbar {
  width: 8px; /* Slimmer scrollbar width */
  height: 8px;
}

.thumbnails-container::-webkit-scrollbar-track {
  background: transparent; /* Transparent background for scrollbar track */
}

.thumbnails-container::-webkit-scrollbar-thumb {
  background-color: #999; /* Custom color for scrollbar thumb */
  border-radius: 4px; /* Rounded edges */
}

.thumbnails-container::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* Darker shade on hover */
}

.thumbnail {
  cursor: pointer;
  width: 70px; /* Set a fixed width */
  height: 70px; /* Set a fixed height */
  object-fit: cover; /* Ensure the image fills the thumbnail area */
  border-radius: 4px;
  transition: transform 0.2s ease;
}

.thumbnail:hover {
  border: 2px solid #cc9900;
  transform: scale(1.05); /* Slightly enlarge on hover */
}

</style>
