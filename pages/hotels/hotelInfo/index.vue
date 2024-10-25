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
        v-for="(imageGroup, index) in chunkImages(gtaHotelDetails?.Images?.Image.filter(img => img.Type === 'BIG') || [], isMobile ? 1 : 2)"
        :key="index"
      >
        <v-row>
          <v-col
            v-for="(img, imgIndex) in imageGroup"
            :key="imgIndex"
            :cols="isMobile ? 12 : 6"
          >
            <v-img
              :src="img.FileName || 'https://source.unsplash.com/user/c_v_r/1900x800'"
              height="500px"
              width="100%"
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
      <v-card-text>
        <v-row v-for="(roomOption, index) in roomOptions" :key="index" class="room-card">
          <v-col cols="12">
            <v-row justify="space-between">
              <v-col cols="12" md="6">
                <!-- Room Name -->
                <h5 class="mb-0 brown--text text-decoration-underline">
                  {{ roomOption.HotelRooms?.HotelRoom?.Name || 'Room Name Not Available' }}
                </h5>
              </v-col>
            </v-row>

            <v-row class="d-flex align-center justify-space-between" no-gutters>
              <v-col cols="4">
                <!-- Board Type -->
                <p class="mb-0 font-weight-medium">
                  <span class="grey--text">
                    {{ roomOption.Board?._ || 'Board not available' }} ({{ roomOption.Board?.Type || 'N/A' }})
                  </span>
                </p>
              </v-col>

              <v-col cols="4" class="d-flex align-start">
                <!-- Non-refundable Button -->
                <v-btn small text color="red" class="text-decoration-underline" @click="toggleCancellationPolicy(index)">
                  Non-refundable
                  <v-icon small class="ml-1">
                    {{ showFullCancellationPolicy[index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </v-btn>
              </v-col>

              <v-col cols="4" class="d-flex justify-end">
                <!-- Price -->
                <p class="mr-3 font-weight-bold text-subtitle-1">
                  $ {{ roomOption.Prices?.Price?.TotalFixAmounts?.Gross || 'Price not available' }}
                </p>
                <v-btn small class="mr-2 px-8 py-4 no-wrap v-btn-brown" @click="bookRoom(roomOption)">
                  Book
                </v-btn>
              </v-col>
            </v-row>

            <!-- Cancellation Policy -->
            <v-row v-if="showFullCancellationPolicy[index]">
              <v-col cols="12">
                <table width="100%" style="border-collapse: collapse; margin-top: 10px;">
                  <tr style="background-color: #eaeaea;">
                    <td style="padding: 10px;">
                      <strong>Cancellation Charges:</strong>
                    </td>
                  </tr>
                  <tr style="background-color: rgb(255,239.5,193);">
                    <td style="padding: 10px; color: rgb(134.5,100.875,0);">
                      <v-icon color="rgb(134.5,100.875,0)" class="mr-1">
                        mdi-alert
                      </v-icon>
                      Booking subject to cancellation charges
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px;">
                      <span class="grey--text">
                        <span v-html="formatCancellationPolicy(roomOption.CancellationPolicy?.Description)" />
                      </span>
                    </td>
                  </tr>
                </table>
              </v-col>
            </v-row>
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
import { mapGetters } from 'vuex'
import hotelsServices from '~/services/HotelsServices'

export default {
  data () {
    return {
      gtaHotelDetails: null,
      imageDialog: false,
      dialogImage: '',
      cancellationPolicy: null,
      isLoading: true,
      roomOptions: [],
      showFullCancellationPolicy: {}
    }
  },
  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
    },
    ...mapGetters(['getHotelSearchData'])
  },
  async mounted () {
    const hotelCode = this.$route.query.hotelCode

    if (hotelCode) {
      try {
        this.isLoading = true

        // Get the hotel details
        const response = await hotelsServices.getGtaHotelDetails(hotelCode)
        this.gtaHotelDetails = response.data.ContentRS.Contents.HotelContent

        // Check the hotel availability using the stored data
        await this.checkSingleHotelAvailability(this.getHotelSearchData)

        if (this.gtaHotelDetails.Images && this.gtaHotelDetails.Images.Image) {
          this.gtaHotelDetails.Images.Image = this.gtaHotelDetails.Images.Image.filter(image => image.Type === 'BIG')
        }
      } catch (error) {
        console.error('Error fetching hotel details or availability:', error)
      } finally {
        this.isLoading = false
      }
    }
  },

  methods: {
    toggleCancellationPolicy (index) {
      this.$set(this.showFullCancellationPolicy, index, !this.showFullCancellationPolicy[index])
    },
    formatCancellationPolicy (description) {
      if (typeof description !== 'string') {
        return 'No cancellation policy available'
      }

      const normalizeText = (text) => {
        return text.toLowerCase().trim()
      }

      const percentagePattern = /\d{1,3}(?:\.\d+)?\s*%\s*of\s*total\s*amount/i
      const pricePattern = /\b\d+(?:\.\d+)?\s+usd\b/i
      const nightPattern = /\b\d+\s+night\b/i
      const mostExpensiveNightPattern = /\bmost\s*expensive\s*night\b/i

      const wrapRed = match => `<span style="color: red;">${match.replace(/\s*usd\b/i, '$')}</span>`

      return description
        .replace(/\*/g, '\n')
        .split('\n')
        .map((line) => {
          const normalizedLine = normalizeText(line)
          const highlightedLine = normalizedLine
            .replace(percentagePattern, wrapRed)
            .replace(pricePattern, wrapRed)
            .replace(nightPattern, wrapRed)
            .replace(mostExpensiveNightPattern, wrapRed)

          return `<span style="color: grey;">${highlightedLine.trim()}</span>`
        })
        .join('<br>')
    },
    bookRoom (roomOption) {
      // Implement booking logic
      // eslint-disable-next-line no-console
      console.log('Booking room:', roomOption)
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
    },
    async checkSingleHotelAvailability (searchData) {
      let hotelCode = this.$route.query.hotelCode

      // Ensure the hotelCode is an array (if handling multiple hotels)
      hotelCode = Array.isArray(hotelCode) ? hotelCode : [hotelCode]

      const formData = new FormData()

      formData.append('start_date', searchData.startDate)
      formData.append('end_date', searchData.endDate)
      formData.append('board', searchData.board || 'all')
      formData.append('hotel_category', searchData.hotelCategory || 'all')
      formData.append('hotel_type_category', searchData.hotelTypeCategory || 'all')

      // Append hotel codes
      hotelCode.forEach((code, index) => {
        formData.append(`hotels[${index}]`, code)
      })

      // Append travelers and children
      formData.append('adults', searchData.travellers)
      formData.append('children', searchData.children || 0)

      // Append the rooms array properly
      if (this.rooms && this.rooms.length > 0) {
        this.rooms.forEach((room, index) => {
          formData.append(`rooms[${index}][travellers]`, room.travelers || 1)
          formData.append(`rooms[${index}][children]`, room.children || 0)
          formData.append(`rooms[${index}][category]`, room.category || 'all')
        })
      } else {
        // If no rooms data is available, add at least one default room entry
        formData.append('rooms[0][travellers]', searchData.travellers || 1)
        formData.append('rooms[0][children]', searchData.children || 0)
        formData.append('rooms[0][category]', 'all')
      }

      try {
        const response = await hotelsServices.checkHotelAvailabilitySingleHotel(formData)
        const availabilityRS = response?.data?.data?.AvailabilityRS

        if (!availabilityRS || availabilityRS?.Errors !== undefined) {
          console.error('Error in availabilityRS:', availabilityRS?.Errors)
          this.snackbar = true
          this.color = 'error'
          this.text = availabilityRS?.Errors?.Error?.Text || 'No availability found for this hotel.'
        } else {
          this.isAvailable = true
          let results = availabilityRS?.Results?.HotelResult
          this.roomOptions = results?.HotelOptions?.HotelOption
          console.log(this.roomOptions)
          if (results && !Array.isArray(results)) {
            results = [results]
          }

          if (results.length > 0) {
            this.hotelAvailsArray = results
            this.showSearch = false
          } else {
            console.log('No matching rooms found for the hotel.')
          }
        }
      } catch (error) {
        console.error('Error fetching single hotel availability:', error)
        this.snackbar = true
        this.color = 'error'
        this.text = 'An error occurred while fetching availability for this hotel.'
      }
    },
    getRoomOptions (roomOptions) {
      return Array.isArray(roomOptions) ? roomOptions : [roomOptions]
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

.room-card {
  border-bottom: 1px solid #d6b682;
}
</style>
