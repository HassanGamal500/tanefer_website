<template>
  <div>
    <v-container>
      <LoadingScreen v-if="isLoading" />
      <div v-if="hotelDetails && !confirmedSelectedRoom && !isChoiceConfirmed">
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
            <v-btn icon class="scroll-btn-left" @click="prevImage">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon class="scroll-btn-right" @click="nextImage">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>

          <!-- Thumbnails Row -->
          <!-- <div class="thumbnails-container">
            <v-img
              v-for="(image, index) in gtaHotelDetails.Images.Image"
              :key="index"
              :src="image.FileName"
              class="thumbnail"
              @click="selectImage(index)"
            />
          </div> -->
          <!-- Thumbnails Row within Row and Col for Better Containment -->
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
            <v-col cols="12" md="8">
              <p class="subtitle">
                <v-icon color="brown" class="">
                  mdi-calendar
                </v-icon>
                {{ getHotelSearchData.startDate }} to {{ getHotelSearchData.endDate }}
                <v-icon color="brown" class="">
                  mdi-home
                </v-icon>
                {{ room_count }} Room(s)
                <v-icon color="brown" class="">
                  mdi-account
                </v-icon>
                {{ getHotelSearchData.travellers }} adult(s) & {{ getHotelSearchData.children }} childrens
              </p>
            </v-col>
          </v-card-title>
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
                        {{ roomOption.Board?._ || 'Board not available' }}
                      </span>
                    </p>
                  </v-col>

                  <v-col cols="4" class="d-flex align-start">
                    <!-- Non-refundable Button -->
                    <v-btn small text :color="nonRefundableStatus(roomOption) ? 'red' : 'green'" class="text-decoration-underline" @click="toggleCancellationPolicy(index)">
                      {{ nonRefundableStatus(roomOption) ? 'Non-refundable' : 'Cancellation Available' }}
                      <v-icon small class="ml-1">
                        {{ showFullCancellationPolicy[h] && showFullCancellationPolicy[h][index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
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
      </div>
      <v-row>
        <!-- Left Column (Booking Form + Additional Information) -->
        <v-col cols="12" md="8" :style="isMobile ? { marginTop: '102px' } : {}">
          <!-- <v-row>
            <v-col cols="12" md="4">
              <v-btn v-if="!showSearch && confirmedSelectedRoom && !isChoiceConfirmed" class="mt-5 justify-end" color="primary" @click="toggleSearch">
                Change Search
              </v-btn>
            </v-col>
          </v-row> -->
          <!-- Additional Information Card -->
          <v-card v-if="confirmedSelectedRoom && !isChoiceConfirmed" class="pa-4 mt-4" elevation="6">
            <v-row>
              <v-col cols="12">
                <p class="text-h6 late--text font-weight-bold">
                  Important Information:
                </p>
                <p class="text-body-1" v-html="formattedComment" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <!-- Right Column (Booking Confirmation) -->
        <v-col cols="12" md="4">
          <v-card v-if="confirmedSelectedRoom && !isChoiceConfirmed" ref="targetDiv" class="pa-4 mb-12" elevation="6">
            <!-- Hotel Name -->
            <v-row>
              <v-col cols="12">
                <p class="text-h5 font-weight-bold">
                  {{ selectedHotelOption.PriceInformation.HotelContent.HotelName }}
                </p>
                <p class="text-subtitle-1 grey--text">
                  <v-rating
                    v-if="selectedHotelOption.PriceInformation.HotelContent.HotelCategory._"
                    :value="parseInt(selectedHotelOption.PriceInformation.HotelContent.HotelCategory._)"
                    readonly
                    empty-icon="mdi-star-outline"
                    full-icon="mdi-star"
                  />
                </p>
              </v-col>
            </v-row>

            <!-- Address and Contact Info -->
            <v-row>
              <v-col cols="12">
                <p class="text-subtitle-1 font-weight-bold grey--text">
                  <v-icon small color="red">
                    mdi-map-marker
                  </v-icon>
                  {{ selectedHotelOption.PriceInformation.HotelContent.Address.Address }}
                </p>
              </v-col>
            </v-row>

            <!-- Room Names -->
            <v-row>
              <v-col cols="12">
                <ul>
                  <li v-for="(room, index) in groupedRooms" :key="index" class="text-subtitle-1">
                    {{ room.name }} <span v-if="room.count > 1">x{{ room.count }} ROOMS</span>
                  </li>
                </ul>
              </v-col>
            </v-row>
            <!-- Price Information -->
            <v-row>
              <v-col cols="12">
                <p class="text-body-1">
                  <span class="font-weight-bold">Board Type:</span>
                  <span class="ml-3" style="color: gray;">{{ selectedHotelOption.PriceInformation.Board._ || '' }}</span>
                  <br>
                  <br>
                  <span class="font-weight-bold">Total Price:</span>
                  <span class="ml-5 font-weight-bold" style="color: black">$ {{ selectedHotelOption.PriceInformation.Prices.Price.TotalFixAmounts.Gross || '' }}</span>
                </p>
              </v-col>
            </v-row>
            <!-- Confirm Button -->
            <v-row>
              <v-col cols="12" class="text-right">
                <v-btn color="primary" @click="confirmChoice">
                  Confirm my Choice
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center">
        <v-col cols="10" md="10" justify="center" class="d-flex justify-center">
          <!-- Booking Form -->
          <v-card v-if="isChoiceConfirmed" class="pa-4 mb-4" elevation="6" justify="center">
            <v-row>
              <v-col cols="12">
                <p class="text-h5 font-weight-bold late--text">
                  Booking Holder Information
                </p>
                <p class="text-caption grey--text">
                  Insert contact information to receive communications.
                </p>
              </v-col>

              <!-- Title, Name, Surname -->
              <v-col cols="12" sm="2">
                <v-combobox
                  v-model="title"
                  :items="['Mr', 'Mrs', 'Ms', 'Miss']"
                  label="Title"
                  outlined
                  color="blue"
                  dense
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field
                  v-model="name"
                  label="Name*"
                  outlined
                  color="blue"
                  dense
                  class="rounded-lg"
                  :rules="[v => (!!v && v.length > 2) || 'Name is required at least 3 characters']"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field
                  v-model="surname"
                  label="Surname*"
                  outlined
                  color="blue"
                  dense
                  class="rounded-lg"
                  :rules="[v => (!!v && v.length > 2) || 'Surname is required at least 3 characters']"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="age"
                  outlined
                  label="Age"
                  required
                  dense
                  color="blue"
                  class="rounded-lg"
                />
              </v-col>

              <!-- Phone, Email -->
              <v-col cols="12" sm="4">
                <mobile-input @update="assignPhone" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="email"
                  label="E-mail*"
                  outlined
                  color="blue"
                  dense
                  class="rounded-lg"
                  :rules="emailRules"
                />
              </v-col>

              <!-- ID / Passport, Issuing Country -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="identification_document_pax"
                  label="ID / Passport Number"
                  outlined
                  color="blue"
                  dense
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="issueCountry"
                  :items="countries"
                  item-text="name"
                  item-value="code"
                  label="Issuing Country"
                  outlined
                  color="blue"
                  dense
                  class="rounded-lg"
                />
              </v-col>
              <!-- Travellers Section -->
              <v-col v-for="(traveller, t) in otherTravellers" :key="t" cols="12">
                <p class="text-subtitle-2 grey--text">
                  ADULT {{ traveller.id }}
                </p>
                <v-row>
                  <v-col cols="12" md="4" sm="4">
                    <v-text-field
                      v-model="bNames[t]"
                      label="Name"
                      outlined
                      color="blue"
                      dense
                      class="rounded-lg"
                      :rules="[v => (!!v && v.length > 2) || 'Name is required at least 3 characters']"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-text-field
                      v-model="bSurnames[t]"
                      label="Surname"
                      outlined
                      color="blue"
                      dense
                      class="rounded-lg"
                      :rules="[v => (!!v && v.length > 2) || 'Surname is required at least 3 characters']"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-text-field
                      v-model="bAges[t]"
                      label="Age"
                      outlined
                      color="blue"
                      dense
                      class="rounded-lg"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <!-- Children Section -->
              <v-col v-for="(children, c) in otherChildren" :key="c" cols="12">
                <p class="text-subtitle-2 grey--text">
                  CHILD {{ children.id }}
                </p>
                <v-row>
                  <v-col cols="12" md="4" sm="4">
                    <v-text-field
                      v-model="bNamesChild[c]"
                      label="Name"
                      outlined
                      color="blue"
                      dense
                      class="rounded-lg"
                      :rules="[v => (!!v && v.length > 2) || 'Name is required at least 3 characters']"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-text-field
                      v-model="bSurnamesChild[c]"
                      label="Surname"
                      outlined
                      color="blue"
                      dense
                      class="rounded-lg"
                      :rules="[v => (!!v && v.length > 2) || 'Surname is required at least 3 characters']"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="4">
                    <v-text-field
                      v-model="bAgesChild[c]"
                      label="Age"
                      outlined
                      color="blue"
                      dense
                      class="rounded-lg"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <!-- Book Button -->
              <v-col cols="12">
                <v-btn
                  class="white--text text-capitalize justify-center v-btn-brown"
                  color="#4f3316"
                  elevation="6"
                  large
                  block
                  :disabled="!isButtonEnabledFormValidation || isBooked"
                  @click="finalBookHotel"
                >
                  <span>finalise Booking</span>
                  <!-- <span v-else>Booked Successfully</span> -->
                </v-btn>
                <v-btn
                  class="white--text text-capitalize justify-center v-btn-brown mt-2"
                  color="#4f3316"
                  elevation="6"
                  large
                  block
                  @click="processHotelBooking"
                >
                  <span>Proceed to checkout</span>
                  <!-- <span v-else>Booked Successfully</span> -->
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <form ref="paymentForm" method="POST" action="" />
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import clientAPI from '~/services/axiosConfig'
import hotelsServices from '~/services/HotelsServices'

export default {
  props: {
    hotel: {
      type: Object,
      required: false,
      default: () => ({}) // Default to an empty object
    }
  },
  data () {
    return {
      gtaHotelDetails: null,
      currentImageIndex: 0,
      imageDialog: false,
      dialogImage: '',
      cancellationPolicy: null,
      isLoading: true,
      roomOptions: [],
      showFullCancellationPolicy: {},
      travellersData: [],
      selectedRatings: [],
      ratingOptions: [],
      selectedPointOfInterest: null,
      showSearch: true,
      comingSoon: false,
      showMoreOptions: false,
      metaData: {
        page_name: null,
        seo_title: null,
        seo_description: null,
        featured_image: null,
        slug: null
      },
      dates: [],
      adventures: [],
      selectedAdventures: [],
      city: null,
      travellers: 1,
      children: 0,
      activitiesList: [],
      totalPrice: 0,
      singleSupplement: false,
      solo: false,
      showCheckout: false,
      snackbar: false,
      color: '',
      text: '',
      counterChild: 0,
      counterAdult: 0,
      ages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      ageSelects: [],
      durations: [],
      selectedDuration: null,
      selectedSearchText: null,
      ageSelect: [],
      showAgesSelects: false,
      selectedDates: [],
      isValidateSelected: 'disableSelect',
      durationTypeList: ['hour', 'day', 'week'],
      selectedDurationType: null,
      loadingDeleteItem: false,
      selectedStatusFalse: false,
      openProceed: false,
      room_count: 1,
      rooms: [
        { travelers: 1, children: 0, ageSelects: [] }
      ],
      hotels: [],
      gtaCountries: [],
      gtaCities: [],
      selectedCountry: null,
      selectedCity: null,
      gtaHotels: [],
      gtaZones: [],
      // selectedZone: null,
      gtaHotelName: '',
      gtaHotelCatgories: [],
      gtaHotelTypeCatgories: [],
      gtaCatgories: [],
      selectedHotelName: '',
      selectedHotelCategory: 'all',
      selectedHotelTypeCategory: 'all',
      selectedCategory: 'all',
      gtaBoards: [],
      selectedBoard: 'all',
      menuStartDate: null,
      menuEndDate: null,
      hotelStartDateText: null,
      hotelStartDate: null,
      hotelEndDateText: null,
      hotelEndDate: null,
      isAvailable: false,
      hotelAvailsArray: [],
      hotelAvails: null,
      checkResponseCode: false,
      showHotelGtaDetails: false,
      showRoomsDialog: false,
      hotelPrices: 0,
      selectedRoomGtaArray: [],
      getRatePlanCodeArray: [],
      selectedHotelCodeArray: [],
      selectedHotelJPCodeArray: [],
      selectedHotelJPDCodeArray: [],
      selectedRoomGta: null,
      getRatePlanCode: null,
      selectedHotelCode: null,
      selectedHotelJPCode: null,
      selectedHotelJPDCode: null,
      confirmedSelectedRoom: false,
      getbookingRuleArray: [],
      getbookingRule: null,
      isBooked: false,
      name: '',
      nameRules: [v => (!!v && v.length > 1) || 'Item is required at least 2 characters',
        v => /^[A-Za-z][A-Za-z]*$/.test(v) || 'Name Must be letters only with no spaces'
      ],
      phone: '',
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(v) || 'E-mail must be valid'
      ],
      title: null,
      surname: null,
      age: null,
      issueCountry: null,
      search: null,
      requiredRule: [
        v => !!v || 'Field is required'
      ],
      getBookingCode: null,
      getBookingCodeArray: [],
      otherTravellers: [],
      otherChildren: [],
      bNames: [],
      bSurnames: [],
      bAges: [],
      bNamesChild: [],
      bSurnamesChild: [],
      bAgesChild: [],
      priceSessionId: null,
      finalBookHotelFormData: null,
      identification_document_pax: '',
      address_pax: '',
      city_pax: '',
      country_pax: '',
      postal_code_pax: '',
      searchTerm: '',
      gtaCountriesCopy: [],
      listGtaHotelDetails: [],
      gtaHotelAvailDetails: '',
      query: '',
      results: [],
      filteredZones: [],
      menu: false,
      isSelecting: false,
      selectedZone: null,
      perZoneHotels: [],
      filters: [],
      destination: '',
      selectedDate: '',
      // rooms: 1,
      roomOccupancy: '',
      priceRange: [null, null],
      defaultPriceRange: [null, null],
      minPrice: null,
      maxPrice: null,
      selectedPOI: null,
      hotelName: '',
      pointsOfInterest: ['city1', 'city2', 'city3'],
      categories: ['Luxury', 'Budget', 'Family', 'Business'],
      selectedCategories: [],
      activeRoomIndex: null,
      filteredHotels: [],
      selectedNationality: '',
      selectedHotelOption: null,
      isChoiceConfirmed: false,
      showAllRooms: false,
      minDate: this.getToday(),
      showAllRoomsForHotel: {},
      selectedBoards: [],
      boardOptions: [],
      loading: false,
      activatorWidth: 0,
      hotelCodeJP: '',
      hotelDetails: true,
      hotelImages: [],
      currentImage: ''
    }
  },
  head () {
    return {
      title: this.metaData.seo_title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaData.seo_description
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.metaData.seo_title
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.metaData.seo_description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.metaData.featured_image
        }
      ]
    }
  },
  computed: {
    nonRefundableStatus () {
    // Returns an object with roomIndex as the key and a boolean indicating non-refundable status
      return (roomOption) => {
        const description = roomOption?.CancellationPolicy?.Description || ''
        return !/0(?:\s|&nbsp;)+usd/i.test(description)
      }
    },
    currentMainImage () {
      return this.gtaHotelDetails.Images.Image[this.currentImageIndex]?.FileName || 'default-image-url'
    },
    groupedRooms () {
      let rooms = this.selectedHotelOption.PriceInformation.HotelRooms.HotelRoom
      rooms = Array.isArray(rooms) ? rooms : [rooms]

      const roomCounts = {}

      rooms.forEach((room) => {
        const name = room.Name
        if (roomCounts[name]) {
          roomCounts[name] += 1
        } else {
          roomCounts[name] = 1
        }
      })

      return Object.keys(roomCounts).map((name) => {
        return {
          name,
          count: roomCounts[name]
        }
      })
    },
    formattedComment () {
      const comment = this.selectedHotelOption?.OptionalElements?.Comments?.Comment?._
      if (!comment) {
        return ''
      }

      const placeholderComment = comment.replace(/\bi\s*\.\s*e\s*\./gi, 'ie-placeholder')

      const formattedComment = placeholderComment.replace(/\.\s*/g, '.<br>')

      return formattedComment.replace(/ie-placeholder/g, 'i.e.')
    },
    countries () {
      return this.$store.state.countries
    },

    isButtonEnabledFormValidation () {
      const getPhone = this.phone
      const checkPhoneExist = getPhone !== null ? getPhone.formattedNumber : null
      let checkValidate = false
      if (this.title !== null && this.name !== null && this.surname !== null && checkPhoneExist !== null && this.email !== null && this.age !== null && this.issueCountry !== null) {
        checkValidate = true
      } else {
        checkValidate = false
      }
      if (this.bNames.length === this.otherTravellers.length && this.bSurnames.length === this.otherTravellers.length && this.bAges.length === this.otherTravellers.length) {
        checkValidate = true
      } else {
        checkValidate = false
      }
      if (this.bNamesChild.length === this.otherChildren.length && this.bSurnamesChild.length === this.otherChildren.length && this.bAgesChild.length === this.otherChildren.length) {
        checkValidate = true
      } else {
        checkValidate = false
      }
      return checkValidate
    },
    totalTravelers () {
      return this.rooms.reduce((sum, room) => sum + room.travelers, 0)
    },
    totalChildren () {
      return this.rooms.reduce((sum, room) => sum + room.children, 0)
    },
    roomCategoriesWithAll () {
      return [{ _: 'All', Type: 'all' }, ...this.roomCategories]
    },
    boardsWithAll () {
      return [{ _: 'All', Type: 'all' }, ...this.boards]
    },
    truncatedDescriptions () {
      return this.listGtaHotelDetails.map((hotel) => {
        const description = hotel.HotelInfo.Description || 'Hotel Description'
        return description.length > 200 ? description.substring(0, 200) + '...' : description
      })
    },
    truncatedCancellationPolicy () {
      const policyText = this.roomOption?.CancellationPolicy?.Description || ''
      return policyText.length > 100 ? policyText.substring(0, 100) + '...' : policyText
    },
    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
    },
    ...mapGetters(['getHotelSearchData'])
  },
  watch: {
    hotelStartDate (newDate) {
      if (newDate) {
        const nextDay = new Date(newDate)
        nextDay.setDate(nextDay.getDate() + 1)
        this.hotelEndDate = nextDay.toISOString().substr(0, 10)
        this.formatDate(this.hotelEndDate, 1, 'hotelEndDate')
      }
    },
    priceRange: {
      handler (newVal) {
      // Ensure min and max values are properly set and filter only when priceRange is valid
        if (newVal[0] !== null && newVal[1] !== null) {
          this.applyCombinedFilters()
        }
      },
      deep: true // Ensure nested array changes are tracked
    },
    menu (val) {
      if (val) {
        this.$nextTick(() => {
          const activatorEl = this.$el.querySelector('.v-text-field')
          if (activatorEl) {
            this.activatorWidth = activatorEl.clientWidth
          }
        })
      }
    },
    filteredHotels () {
      this.calculatePriceRange()
      this.calculateBoardOptions()
      this.calculateRatingOptions()
    },
    hotelName (newVal) {
      this.debouncedApplyCombinedFilters()
    },
    selectedRatings (newVal) {
      this.debouncedApplyCombinedFilters()
    },
    selectedBoards (newVal) {
      this.debouncedApplyCombinedFilters()
    },
    query (newQuery) {
      if (this.isSelecting) {
        return
      }
      this.handleInput()
    },
    hotel: {
      immediate: true,
      handler (newHotel) {
        if (newHotel) {
          this.fetchHotelImages()
        }
      }
    }
  },
  async mounted () {
    // this.fetchHotelImages()
    const hotelCode = this.$route.query.hotelCode
    if (hotelCode) {
      try {
        this.isLoading = true

        // Fetch hotel data
        const response = await hotelsServices.getGtaHotelDetails(hotelCode)
        this.gtaHotelDetails = response?.data?.ContentRS?.Contents?.HotelContent

        // Check the hotel availability using the stored data
        await this.checkSingleHotelAvailability(this.getHotelSearchData)

        // Filter images
        if (this.gtaHotelDetails?.Images?.Image) {
          this.gtaHotelDetails.Images.Image = this.gtaHotelDetails.Images.Image.filter(
            image => image.Type === 'BIG'
          )
        }

        console.log('Hotel details:', this.gtaHotelDetails) // Debug log
      } catch (error) {
        console.error('Error fetching hotel details or availability:', error)
      } finally {
        this.isLoading = false
      }
    } else {
      this.isLoading = false // Stop loading if no hotelCode
    }
    window.addEventListener('popstate', this.handleBackButton)
    this.priceSessionId = localStorage.getItem('priceSessionId')
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.handleBackButton)
  },
  async created () {
    await this.getMetaData()
    // await this.getGtaCountries()
    // await this.getGtaCities()
    // await this.getGtaHotelCategories()
    // await this.getGtaHotelTypeCategories()
    // await this.getGtaCategories()
    // await this.getGtaBoards()
    this.debouncedApplyPriceFilter = _.debounce(this.applyPriceFilter, 300)
    this.debouncedApplyCombinedFilters = _.debounce(this.applyCombinedFilters, 300)
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
    fetchHotelImages () {
      // Retrieve all images, filtering and formatting with getHotelImageSrc
      if (this.hotel.Images && this.hotel.Images.length > 0) {
        this.hotelImages = this.hotel.Images.filter(img => img.Type === 'THB').map(img => img.FileName)
      }

      // Set initial main image
      this.currentImage = this.hotelImages.length > 0 ? this.hotelImages[0] : this.getHotelImageSrc(this.hotel)
    },
    getHotelImageSrc (hotel) {
      if (hotel.Images && hotel.Images.length > 0) {
        const image = hotel.Images.find(img => img.Type === 'THB')
        return image ? image.FileName : 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      } else if (hotel.HotelInfo && hotel.HotelInfo.Images) {
        return hotel.HotelInfo.Images.Image || 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
      return 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    setCurrentImage (img) {
      this.currentImage = img
    },
    toggleCancellationPolicy (index) {
      this.$set(this.showFullCancellationPolicy, index, !this.showFullCancellationPolicy[index])
    },
    formatCancellationPolicy (description) {
      if (typeof description !== 'string') {
        return 'No cancellation policy available'
      }

      const normalizeText = (text) => {
        return text.trim()
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
    },
    async processHotelBooking () {
      this.isLoading = true

      try {
        // Step 1: Save the booking first and get formDataId
        const formDataId = await this.finalBookHotel() // Save booking, get booking ID

        if (!formDataId) {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Something went wrong during booking registration.'
          this.isLoading = false
          return
        }

        // Step 2: Prepare the form for payment
        const priceInfo = this.selectedHotelOption?.PriceInformation?.Prices?.Price
        const totalPrice = priceInfo.TotalFixAmounts.Gross
        const taxesAndFees = priceInfo.TotalFixAmounts.Service.Amount
        const currency = priceInfo.Currency

        const form = this.$refs.paymentForm

        form.setAttribute('action', 'https://api.tanefer.com/payment')

        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="email" value="${this.email}">`)
        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="sessionId" value="${this.priceSessionId}">`)
        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="price" value="${totalPrice}">`)
        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="final_price" value="${totalPrice}">`)
        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="taxes_and_fees" value="${taxesAndFees}">`)
        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="currency" value="${currency}">`)

        // Use a static success URL for the signature to work correctly
        form.insertAdjacentHTML(
          'beforeend',
      `<input type="hidden" name="url" value="${window.location.origin}/payment-success">`
        )

        // Pass formDataId as a separate hidden field (merchant_extra is used in your backend for bookingId)
        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="bookingId" value="${formDataId}">`)

        // Step 3: Submit the form for payment processing
        form.submit()

        this.isLoading = false
      } catch (error) {
        console.error('Error during hotel booking:', error)
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong while processing your booking.'
        this.isLoading = false
      }
    },
    async finalBookHotel () {
      this.isLoading = true

      try {
        if (!this.selectedHotelOption || !this.getbookingRule) {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Please select a room before proceeding with the booking.'
          this.isLoading = false
          return
        }

        // Calculate total travelers and children
        const adults = this.rooms.reduce((total, room) => total + room.travelers, 0)
        const children = this.rooms.reduce((total, room) => total + room.children, 0)

        // Get price information and booking details
        const priceInfo = this.selectedHotelOption?.PriceInformation?.Prices?.Price
        const totalPrice = priceInfo.TotalFixAmounts.Gross
        const taxesAndFees = priceInfo.TotalFixAmounts.Service.Amount
        const currency = priceInfo.Currency

        // Generate the payload with sensible defaults for pax details
        const body = {
          bookingCode: this.selectedHotelOption?.BookingCode?._,
          startDate: this.hotelStartDate,
          endDate: this.hotelEndDate,
          HotelCode: this.selectedHotelOption?.PriceInformation.HotelContent?.Code,
          minimumPrice: totalPrice.toFixed(2),
          maximumPrice: (totalPrice + taxesAndFees).toFixed(2),
          currency,
          phone_number: this.phone.formattedNumber || this.phone.e164,
          title: this.title || 'Mr',
          name: this.name || 'Guest',
          surname: this.surname || 'Unknown',
          age: this.age || '30',
          email: this.email || 'guest@example.com',
          nationality: this.issueCountry || 'EG', // Ensure consistency
          CountryOfResidence: this.issueCountry || 'EG', // Ensure consistency with nationality
          board: this.selectedBoard || 'all',
          hotel_name: this.selectedHotelName || 'Hotel Default',
          hotel_category: this.selectedHotelCategory || '3-star',
          hotel_type_category: this.selectedHotelTypeCategory || 'all',
          identification_document_pax: this.identification_document_pax || 'ID123456789',
          address_pax: this.address_pax || '123 Default St',
          city_pax: this.city_pax || 'Cairo',
          country_pax: this.country_pax || 'EG',
          postal_code_pax: this.postal_code_pax || '12345',
          book_after_payment: '0',
          rooms: this.rooms.map(room => ({
            travellers: room.travelers.toString(),
            children: room.children.toString(),
            category: this.selectedCategory || 'all'
          })),
          adults, // Number of adults calculated from rooms
          children // Number of children calculated from rooms
        }

        // Send booking request to register it
        const bookingResponse = await hotelsServices.finalBookHotel(body)
        const resultFormData = bookingResponse.data.formDataId

        this.finalBookHotelFormData = resultFormData
        this.isBooked = true
        this.isLoading = false

        console.log('Booking confirmed with payload:', body)

        return resultFormData
      } catch (error) {
        console.error('Error during hotel booking:', error)
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong while processing your booking.'
        this.isLoading = false
      }
    },
    generateTravellerDetails () {
      // First, map the booking holder (main traveler) to the backend's expected structure
      const bookingHolder = {
        passengerTitle: this.title, // Mapping title to passengerTitle
        passengerFirstName: this.name, // Mapping name to passengerFirstName
        passengerLastName: this.surname, // Mapping surname to passengerLastName
        date_of_birth: this.age, // Mapping age to date_of_birth
        email: this.email, // Email field as per your existing structure
        phone: this.phone, // Phone field as per your existing structure
        nationality: this.selectedNationality, // Nationality mapped to backend
        passport_number: this.identification_document_pax, // Mapping identification_document to passport_number
        passport_issue_country: this.issueCountry, // Mapping issueCountry to passport_issue_country
        passengerType: 'Adult' // Assuming the booking holder is an adult
      }

      // Map the other adult travellers (if any) to match backend structure
      const otherTravellers = this.otherTravellers.map((traveller, index) => ({
        passengerFirstName: this.bNames[index], // Mapping first name
        passengerLastName: this.bSurnames[index], // Mapping surname
        date_of_birth: this.bAges[index], // Mapping age as date_of_birth
        passengerType: 'Adult' // Assuming otherTravellers are adults
      }))

      // Map the children travellers (if any) to match backend structure
      const otherChildren = this.otherChildren.map((child, index) => ({
        passengerFirstName: this.bNamesChild[index], // Mapping child's first name
        passengerLastName: this.bSurnamesChild[index], // Mapping child's surname
        date_of_birth: this.bAgesChild[index], // Mapping child's age as date_of_birth
        passengerType: 'Child' // Children are marked as 'Child'
      }))

      // Return the booking holder, other travellers, and children in a single array
      return [bookingHolder, ...otherTravellers, ...otherChildren]
    },
    populateTravellersData () {
      this.travellersData = []

      const bookingHolder = {
        title: this.title,
        name: this.name,
        surname: this.surname,
        age: this.age,
        email: this.email,
        phone: this.phone,
        nationality: this.selectedNationality,
        idDocument: this.identification_document_pax,
        issueCountry: this.issueCountry
      }
      this.travellersData.push(bookingHolder)

      this.otherTravellers.forEach((traveller, index) => {
        const otherTraveller = {
          name: this.bNames[index],
          surname: this.bSurnames[index],
          age: this.bAges[index],
          type: 'adult'
        }
        this.travellersData.push(otherTraveller)
      })

      // Add children
      this.otherChildren.forEach((child, index) => {
        const otherChild = {
          name: this.bNamesChild[index],
          surname: this.bSurnamesChild[index],
          age: this.bAgesChild[index],
          type: 'child'
        }
        this.travellersData.push(otherChild)
      })
    },
    getHotelPrice (hotel) {
      return (Array.isArray(hotel?.HotelOptions?.HotelOption)
        ? hotel.HotelOptions.HotelOption[0]?.Prices.Price.TotalFixAmounts.Gross
        : hotel.HotelOptions.HotelOption?.Prices.Price.TotalFixAmounts.Gross)
    },
    disableStartDate (date) {
    // This will disable the exact start date for selection
      return date !== this.hotelStartDate
    },
    calculateRatingOptions () {
      const ratingCounts = {}
      this.filteredHotels.forEach((hotel) => {
        const category = hotel?.HotelInfo?.HotelCategory?._ || 'Uncategorized'
        if (ratingCounts[category]) {
          ratingCounts[category]++
        } else {
          ratingCounts[category] = 1
        }
      })
      const ratingArray = Object.keys(ratingCounts).map(rating => ({
        label: rating,
        value: this.extractNumericRating(rating),
        count: ratingCounts[rating]
      }))

      this.ratingOptions = ratingArray.sort((a, b) => {
        const aIsNumeric = !isNaN(a.value)
        const bIsNumeric = !isNaN(b.value)

        if (aIsNumeric && bIsNumeric) {
          return a.value - b.value
        } else if (aIsNumeric) {
          return -1
        } else if (bIsNumeric) {
          return 1
        } else {
          return a.label.localeCompare(b.label)
        }
      })
    },
    isNumericRating (value) {
      return !isNaN(parseInt(value)) && /^\d+$/.test(value)
    },
    handleBackButton () {
      if (window.location.pathname !== '/hotels') {
        window.location.href = '/hotels'
      } else {
        window.location.reload()
      }
    },
    calculateBoardOptions () {
      const boardCounts = {}

      this.filteredHotels.forEach((hotel) => {
        let hotelOptions = hotel.HotelOptions.HotelOption

        if (!Array.isArray(hotelOptions)) {
          hotelOptions = [hotelOptions]
        }

        hotelOptions.forEach((roomOption) => {
          const board = roomOption.Board?._ || 'Board not available'
          if (boardCounts[board]) {
            boardCounts[board]++
          } else {
            boardCounts[board] = 1
          }
        })
      })

      this.boardOptions = Object.keys(boardCounts).map(board => ({
        label: `${board} (${boardCounts[board]})`,
        value: board
      }))
    },
    applyBoardFilter () {
      if (this.selectedBoards.length === 0) {
        this.filteredHotels = this.listGtaHotelDetails
      } else {
        this.filteredHotels = this.listGtaHotelDetails.filter((hotel) => {
          let hotelOptions = hotel.HotelOptions.HotelOption

          if (!Array.isArray(hotelOptions)) {
            hotelOptions = [hotelOptions]
          }

          return hotelOptions.some((roomOption) => {
            return this.selectedBoards.includes(roomOption.Board?._)
          })
        })
      }
    },
    calculatePriceRange () {
      if (this.listGtaHotelDetails.length > 0) {
        const prices = this.listGtaHotelDetails
          .map((hotel) => {
            const price = parseFloat(hotel.HotelOptions.HotelOption[0]?.Prices.Price.TotalFixAmounts.Gross || 0)
            return price > 0 ? price : null
          })
          .filter(price => price !== null)

        if (prices.length > 0) {
          this.minPrice = Math.min(...prices).toFixed(2)
          this.maxPrice = Math.max(...prices).toFixed(2)
        } else {
          this.minPrice = 0
          this.maxPrice = 0
        }

        if (this.priceRange[0] === null && this.priceRange[1] === null) {
          this.priceRange = [parseFloat(this.minPrice), parseFloat(this.maxPrice)]
        }
      }
    },
    onSliderInput () {
      if (this.priceRange[0] !== null && this.priceRange[1] !== null) {
        this.applyPriceFilter()
      }
    },

    applyPriceFilter () {
      if (this.priceRange[0] === null || this.priceRange[1] === null) {
        this.filteredHotels = this.listGtaHotelDetails
      } else {
        this.filteredHotels = this.listGtaHotelDetails.filter((hotel) => {
          let hotelOptions = hotel.HotelOptions.HotelOption

          if (!Array.isArray(hotelOptions)) {
            hotelOptions = [hotelOptions]
          }

          return hotelOptions.some((roomOption) => {
            const price = parseFloat(roomOption?.Prices?.Price?.TotalFixAmounts?.Gross || 0)
            return price >= this.priceRange[0] && price <= this.priceRange[1]
          })
        })
      }

      this.applyCombinedFilters()
    },

    applyCombinedFilters () {
      let filtered = [...this.listGtaHotelDetails]
      if (this.hotelName) {
        filtered = filtered.filter((hotel) => {
          return hotel?.HotelInfo?.Name?.toLowerCase().includes(this.hotelName.toLowerCase())
        })
      }
      if (this.selectedRatings.length > 0) {
        filtered = filtered.filter((hotel) => {
          const hotelCategory = hotel?.HotelInfo?.HotelCategory?._
          const numericRating = this.extractNumericRating(hotelCategory)
          const matchesNumericRating = numericRating && this.selectedRatings.includes(numericRating)
          const matchesDescriptiveCategory = this.selectedRatings.includes(hotelCategory)
          return matchesNumericRating || matchesDescriptiveCategory
        })
      }
      if (this.selectedBoards.length > 0) {
        filtered = filtered.filter((hotel) => {
          let hotelOptions = hotel?.HotelOptions?.HotelOption
          if (!Array.isArray(hotelOptions)) {
            hotelOptions = [hotelOptions]
          }
          return hotelOptions.some(roomOption => this.selectedBoards.includes(roomOption?.Board?._))
        })
      }
      if (this.priceRange[0] !== null && this.priceRange[1] !== null) {
        filtered = filtered.filter((hotel) => {
          let hotelOptions = hotel?.HotelOptions?.HotelOption
          if (!Array.isArray(hotelOptions)) {
            hotelOptions = [hotelOptions]
          }

          return hotelOptions.some((roomOption) => {
            const price = parseFloat(roomOption?.Prices?.Price?.TotalFixAmounts?.Gross || 0)
            console.log(`Price: ${price} Min: ${this.priceRange[0]} Max: ${this.priceRange[1]}`) // Debugging the price filter
            return price >= this.priceRange[0] && price <= this.priceRange[1]
          })
        })
      }

      this.filteredHotels = filtered
    },

    toggleRoomDisplay (hotelIndex) {
      this.$set(this.showAllRoomsForHotel, hotelIndex, !this.showAllRoomsForHotel[hotelIndex])
    },
    getToday () {
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    },
    displayedRooms (roomOptions) {
      return this.showAllRooms ? roomOptions : roomOptions.slice(0, 2)
    },
    hiddenRoomCount (roomOptions) {
      return roomOptions.length - 2
    },
    confirmChoice () {
      this.isChoiceConfirmed = true
    },
    handleNationalitySelected (nationality) {
      this.selectedNationality = nationality
      // eslint-disable-next-line no-console
      console.log('Selected Nationality:', nationality)
    },
    applyHotelNameFilter () {
      if (this.hotelName.trim()) {
        this.filteredHotels = this.listGtaHotelDetails.filter((hotel) => {
          return hotel.HotelInfo.Name.toLowerCase().includes(this.hotelName.toLowerCase())
        })
      } else {
        this.filteredHotels = this.listGtaHotelDetails
      }
    },

    applyPointOfInterestFilter () {
      this.filteredHotels = this.listGtaHotelDetails.filter((hotel) => {
        return !this.selectedPointOfInterest || hotel.PointsOfInterest.includes(this.selectedPointOfInterest)
      })
    },
    // extractNumericRating (category) {
    //   const match = category.match(/(\d)/)
    //   return match ? parseInt(match[1], 10) : null
    // },
    extractNumericRating (category) {
      const match = category.match(/\d+/)
      return match ? parseInt(match[0]) : category
    },
    applyRatingFilter () {
      if (this.selectedRatings.length === 0) {
        this.filteredHotels = this.listGtaHotelDetails
      } else {
        this.filteredHotels = this.listGtaHotelDetails.filter((hotel) => {
          const category = hotel?.HotelInfo?.HotelCategory?._ || 'Uncategorized'
          const numericCategory = this.extractNumericRating(category)
          return this.selectedRatings.includes(numericCategory)
        })
      }
    },
    clearFilters () {
      this.hotelName = ''
      this.selectedPointOfInterest = null
      this.priceRange = [this.minPrice, this.maxPrice]
      this.selectedRatings = []
      this.filteredHotels = this.listGtaHotelDetails
    },
    toggleRoomDetails (index) {
      this.activeRoomIndex = this.activeRoomIndex === index ? null : index
    },
    getRatingFromCategory (category) {
      const categoryRatings = {
        '1 Star': 1,
        '2 Stars': 2,
        '3 Stars': 3,
        '4 Stars': 4,
        '5 Stars': 5
      }

      return categoryRatings[category] || 0
    },
    formatAddress (address) {
      if (address) {
        const parts = address.split(',')

        const lastPart = parts.pop().replace(/\d+$/, '').trim()
        const secondLastPart = parts.pop()

        return secondLastPart ? `${secondLastPart},${lastPart}` : lastPart
      }
      return 'Location'
    },
    // getHotelImageSrc (hotel) {
    //   if (hotel.Images && hotel.Images.length > 0) {
    //     const image = hotel.Images.find(img => img.Type === 'THB')
    //     return image ? image.FileName : 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //   } else if (hotel.HotelInfo && hotel.HotelInfo.Images) {
    //     return hotel.HotelInfo.Images.Image || 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //   }
    //   return 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    // },
    toggleSearch () {
      this.showSearch = !this.showSearch
    },
    clearPreviousResults () {
      this.hotelAvailsArray = []
      this.listGtaHotelDetails = []
      this.isLoading = false
    },
    handleInput: _.debounce(async function () {
      // Prevent the input handler from running if a selection is being made
      if (this.isSelecting) {
        return
      }

      if (this.query.length >= 3) {
        this.loading = true
        this.menu = true // Only open the menu if not in selecting mode
        await this.searchZones()
        this.loading = false
      } else {
        this.loading = false
        this.filteredZones = []
        this.menu = false
      }
    }, 300),

    async searchZones () {
      try {
        const response = await clientAPI('https://api.tanefer.com/api/v2').get('/packages/search-zones', {
          params: {
            query: this.query
          }
        })
        this.filteredZones = response.data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    },
    // handleZoneSelection (zone) {
    //   this.selectZone(zone)
    //   this.menu = false
    //   if (zone.area_type === 'CTY') {
    //     this.getCityIdByJpdCode(zone.jpd_code).then((cityId) => {
    //       this.getGtaHotelsPerCity(cityId)
    //     })
    //   } else if (zone.area_type === 'REG' || zone.area_type === 'LOC') {
    //     this.searchHotelsByAddress(zone.name)
    //   } else {
    //     this.getGtaHotelsPerZone(zone.id)
    //   }
    // },
    handleZoneSelection (zone) {
      this.isSelecting = true // Set the flag to indicate selection is in progress

      this.selectZone(zone) // Set the selected zone and close the menu

      if (zone.area_type === 'CTY') {
        this.getCityIdByJpdCode(zone.jpd_code).then((cityId) => {
          this.getGtaHotelsPerCity(cityId)
        })
      } else if (zone.area_type === 'REG' || zone.area_type === 'LOC') {
        this.searchHotelsByAddress(zone.name)
      } else {
        this.getGtaHotelsPerZone(zone.id)
      }

      // After selection, reset the flag to allow future searches
      this.$nextTick(() => {
        this.isSelecting = false
      })
    },
    async getCityIdByJpdCode (jpdCode) {
      try {
        const response = await hotelsServices.getCityByJpdCode(jpdCode)
        return response.data.city_id
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching city ID:', error)
      }
    },

    async getGtaHotelsPerCity (cityId) {
      try {
        const response = await hotelsServices.getGtaHotelsByCity(cityId)
        this.gtaHotels = response.data.data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching hotels by city:', error)
      }
    },

    async searchHotelsByAddress (addressFragment) {
      try {
        const response = await hotelsServices.searchHotelsByAddress(addressFragment)
        this.gtaHotels = response.data.data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching hotels by address:', error)
      }
    },

    async getGtaHotelsPerZone (zoneId) {
      try {
        const response = await hotelsServices.getGtaHotelsPerZone(zoneId)
        this.gtaHotels = response.data.data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching hotels by zone:', error)
      }
    },
    selectZone (zone) {
      this.menu = false
      this.$refs.queryInput.blur()
      this.selectedZone = zone
      this.query = zone.name
    },
    toggleOptions () {
      this.showMoreOptions = !this.showMoreOptions
    },
    setGuests (rooms) {
      // eslint-disable-next-line no-console
      console.log(rooms)
      this.room_count = rooms.length
      // Assuming rooms is an array of objects
      this.rooms = rooms.map((room) => {
        return {
          travelers: room.adults,
          children: room.children,
          ageSelects: room.childrenAges || []
        }
      })
      // eslint-disable-next-line no-console
      console.log(rooms)
      this.travellers = this.totalTravelers
      this.children = this.totalChildren
      // await this.calculateAllPrice(this.packageStartDay)
      this.otherTravellers = []
      this.otherChildren = []
      for (let x = 1; x <= this.totalTravelers - 1; x++) {
        this.otherTravellers.push({ id: x })
      }
      this.otherTravellers = this.onlyUniqueObjectsId(this.otherTravellers)
      for (let y = 1; y <= this.totalChildren; y++) {
        this.otherChildren.push({ id: y })
      }
      this.otherChildren = this.onlyUniqueObjectsId(this.otherChildren)
    },
    formatDate (date, i, type) {
      if (!date) { return null }
      const [year, month, day] = date.split('-')
      const newDate = `${day}-${month}-${year}`
      if (type === 'packageStartDay') { this.packageStartDayText = newDate }
      if (type === 'hotelStartDate') { this.hotelStartDateText = newDate }
      if (type === 'hotelEndDate') { this.hotelEndDateText = newDate }
    },
    getTodayDate () {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    async getMetaData () {
      try {
        const promise = hotelsServices.getMetaData(7)
        const response = await promise
        const results = response.data
        if (results.data) {
          this.metaData = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    },
    async getGtaCountries () {
      try {
        const promise = hotelsServices.getGtaCountries()
        const response = await promise
        const results = response.data
        if (results.status === 200) {
          this.gtaCountries = results.data
          this.gtaCountriesCopy = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    },
    async getGtaCities (index) {
      try {
        const promise = hotelsServices.getGtaCities(this.selectedCountry)
        const response = await promise
        const results = response.data
        if (results.status === 200) {
          this.gtaCities = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    },
    async getGtaHotelCategories () {
      try {
        const promise = hotelsServices.getGtaHotelCategories()
        const response = await promise
        const results = response.data
        if (results.status === 200) {
          this.gtaHotelCatgories = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    },
    async getGtaHotelTypeCategories () {
      try {
        const promise = hotelsServices.getGtaHotelTypeCategories()
        const response = await promise
        const results = response.data
        if (results.status === 200) {
          this.gtaHotelTypeCatgories = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    },
    async getGtaCategories () {
      try {
        const promise = hotelsServices.getGtaCategories()
        const response = await promise
        const results = response.data
        if (results.status === 200) {
          this.gtaCatgories = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    },
    async getGtaBoards () {
      try {
        const promise = hotelsServices.getGtaBoards()
        const response = await promise
        const results = response.data
        if (results.status === 200) {
          this.gtaBoards = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    },
    showHotelDetailsObject (hotelIndex) {
      const getHotelGtaDetails = this.filteredHotels[hotelIndex]
      const hotelCode = getHotelGtaDetails.Code
      // const cancellationPolicy = getHotelGtaDetails.HotelOptions.HotelOption[0]?.CancellationPolicy?.Description || 'No cancellation policy available.'

      const url = this.$router.resolve({
        path: '/hotels/hotelInfo',
        query: {
          hotelCode
        }
      }).href

      window.open(url, '_blank')
    },
    async checkHotelAvailability () {
      this.destination = this.query
      this.clearPreviousResults()
      this.$store.commit('setHotelSearchData', {
        startDate: this.hotelStartDate,
        endDate: this.hotelEndDate,
        travellers: this.travellers,
        children: this.children || 0,
        board: this.selectedBoard || '',
        hotelCategory: this.selectedHotelCategory || '',
        hotelTypeCategory: this.selectedHotelTypeCategory || ''
      })

      if (this.travellers === 0) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select Number of Adults'
        this.loaded = false
        return
      } else if (this.hotelStartDate === null || this.hotelEndDate === null) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select Start Date and End Date'
        this.loaded = false
        return
      }
      this.isLoading = true
      // Simulate loading by waiting for 5 seconds before starting the actual process
      await new Promise(resolve => setTimeout(resolve, 10000)) // Wait for 5 seconds

      this.hotelAvailsArray = []
      this.hotelAvails = null
      this.selectedRoomGtaArray = []
      this.getRatePlanCodeArray = []
      this.selectedHotelCodeArray = []
      this.selectedHotelJPCodeArray = []
      this.selectedHotelJPDCodeArray = []
      this.selectedRoomGta = null
      this.getRatePlanCode = null
      this.hotelPrices = null
      this.selectedHotelCode = null
      this.selectedHotelJPCode = null
      this.selectedHotelJPDCode = null
      this.getbookingRuleArray = []
      this.confirmedSelectedRoom = false

      const formData = new FormData()
      formData.append('start_date', this.hotelStartDate)
      formData.append('end_date', this.hotelEndDate)
      formData.append('board', this.selectedBoard || '')
      formData.append('hotel_name', this.selectedHotelName || '')
      formData.append('hotel_category', this.selectedHotelCategory || '')
      formData.append('hotel_type_category', this.selectedHotelTypeCategory || '')

      const hotels = this.gtaHotels || []
      let page = 1
      const pageSize = 100
      let totalPages = 1

      try {
        do {
          const start = (page - 1) * pageSize
          const end = start + pageSize
          const hotelsForPage = hotels.slice(start, end)

          for (let i = 0; i < hotelsForPage.length; i++) {
            formData.append(`hotels[${i}]`, hotelsForPage[i].Jpd_code)
          }

          formData.append('adults', this.travellers)
          formData.append('children', this.children || 0)

          if (this.ageSelects.length > 0) {
            for (let x = 0; x < this.ageSelects.length; x++) {
              formData.append(`ages[${x}]`, this.ageSelects[x].age)
            }
          }

          if (this.rooms && this.rooms.length > 0) {
            for (let r = 0; r < this.rooms.length; r++) {
              formData.append(`rooms[${r}][travellers]`, this.rooms[r].travelers || 1)
              formData.append(`rooms[${r}][children]`, this.rooms[r].children || 0)
              if (this.rooms[r].ageSelects && this.rooms[r].ageSelects.length > 0) {
                for (let rx = 0; rx < this.rooms[r].ageSelects.length; rx++) {
                  formData.append(`rooms[${r}][ages][${rx}]`, this.rooms[r].ageSelects[rx])
                }
              }
              formData.append(`rooms[${r}][category]`, this.selectedCategory || '')
            }
          }

          const response = await hotelsServices.checkHotelAvailabilities(formData, page, pageSize)

          const availabilityRS = response?.data?.data?.AvailabilityRS

          if (!availabilityRS || availabilityRS?.Errors !== undefined) {
            console.error('Error in availabilityRS:', availabilityRS?.Errors)
            this.snackbar = true
            this.color = 'error'
            this.text = availabilityRS?.Errors?.Error?.Text || 'Unfortunately, there is currently no availability found.'
            this.loaded = false
            this.isLoading = false
            break
          } else {
            this.isAvailable = true

            let results = availabilityRS?.Results?.HotelResult
            // eslint-disable-next-line no-console
            console.log(results)
            if (results && !Array.isArray(results)) {
              results = [results]
            }

            if (results.length > 0) {
              this.hotelAvailsArray.push(...results)
              this.listGtaHotelDetails = [...this.listGtaHotelDetails, ...results]
              this.filteredHotels = [...this.listGtaHotelDetails]

              this.calculatePriceRange()
              this.applyCombinedFilters()

              this.showSearch = false
            } else {
              console.log('No matching hotels found.')
              this.filteredHotels = []
            }

            totalPages = availabilityRS?.pagination?.total_pages || 1
          }

          page++

          if (page > totalPages) {
            this.checkResponseCode = true
            this.isLoading = false
          }
        } while (page <= totalPages)
      } catch (error) {
        console.error('Error fetching availability:', error)
        this.snackbar = true
        this.color = 'error'
        this.text = 'An error occurred while fetching availability.'
        this.loaded = false
        this.checkResponseCode = false
        this.isLoading = false
      }
    },
    showHotelDetails (hotelIndex) {
      this.gtaHotelDetails = this.listGtaHotelDetails[hotelIndex]
      this.showHotelGtaDetails = true
    },
    async showRooms (HotelIndex) {
      if (this.listGtaHotelDetails.length > 1) {
        this.hotelAvails = this.hotelAvailsArray[HotelIndex]
        const hotelJPCode = this.hotelAvails.JPCode
        // eslint-disable-next-line no-console
        console.log(hotelJPCode)
        if (hotelJPCode) {
          if (this.travellers === 0) {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Please select Number of Adult'
            this.loaded = false
          } else if (this.hotelStartDate === null || this.hotelEndDate === null) {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Please select Start Date and End Date'
            this.loaded = false
          } else {
            this.isLoading = true
            this.hotelAvails = null
            this.selectedRoomGtaArray = []
            this.getRatePlanCodeArray = []
            this.selectedHotelCodeArray = []
            this.selectedHotelJPCodeArray = []
            this.selectedHotelJPDCodeArray = []
            this.selectedRoomGta = null
            this.getRatePlanCode = null
            this.hotelPrices = null
            this.selectedHotelCode = null
            this.selectedHotelJPCode = null
            this.selectedHotelJPDCode = null
            this.getbookingRuleArray = []
            this.confirmedSelectedRoom = false

            const formData = new FormData()
            formData.append('start_date', this.hotelStartDate)
            formData.append('end_date', this.hotelEndDate)
            formData.append('board', this.selectedBoard)
            formData.append('hotel_name', this.selectedHotelName)
            formData.append('hotel_category', this.selectedHotelCategory)
            formData.append('hotel_type_category', this.selectedHotelTypeCategory)
            formData.append('hotels[' + 0 + ']', hotelJPCode)
            formData.append('adults', this.travellers)
            formData.append('children', this.children)
            if (this.ageSelects.length > 0) {
              for (let x = 0; x < this.ageSelects.length; x++) {
                formData.append('ages[' + x + ']', this.ageSelects[x].age)
              }
            }
            if (this.rooms.length > 0) {
              for (let r = 0; r < this.rooms.length; r++) {
                formData.append('rooms[' + r + '][travellers]', this.rooms[r].travelers)
                formData.append('rooms[' + r + '][children]', this.rooms[r].children)
                if (this.rooms[r].ageSelects.length > 0) {
                  for (let rx = 0; rx < this.rooms[r].ageSelects.length; rx++) {
                    formData.append('rooms[' + r + '][ages][' + rx + ']', this.rooms[r].ageSelects[rx])
                  }
                }
                formData.append('rooms[' + r + '][category]', this.selectedCategory)
              }
            }
            try {
              const promise = hotelsServices.checkHotelAvailabilities(formData)
              const response = await promise
              const results = response.data.AvailabilityRS
              if (results.Errors !== undefined) {
                this.snackbar = true
                this.color = 'error'
                this.text = results.Errors.Error.Text
                this.loaded = false
                this.checkResponseCode = false
                this.isLoading = false
              } else {
                this.isAvailable = true
                const hotelResults = results.Results.HotelResult
                if (hotelResults.length > 1) {
                  for (let index = 0; index < hotelResults.length; index++) {
                    this.hotelAvailsArray.push(hotelResults[index])
                    this.selectedHotelStartDate = this.hotelStartDate
                    this.selectedHotelEndDate = this.hotelEndDate
                  }
                  this.listGtaHotelDetails = hotelResults
                  this.filteredHotels = this.listGtaHotelDetails
                  this.hotelAvails = hotelResults[0]
                } else {
                  this.hotelAvails = hotelResults
                }
                this.checkResponseCode = true
                this.isLoading = false
                if (this.hotelAvails !== null) {
                  this.showRoomsDialog = true
                }
              }
            } catch (error) {
              this.snackbar = true
              this.color = 'error'
              this.text = 'Something went wrong'
              this.loaded = false
              this.checkResponseCode = false
              this.isLoading = false
            }
          }
        }
      }
    },
    showRoomsObject (code) {
      if (this.hotelAvails !== null) {
        this.showRoomsDialog = true
      }
    },
    async bookRoom (roomOption) {
      this.hotelDetails = false
      try {
        this.isLoading = true

        // Extract startDate and endDate from Vuex getter
        const { startDate, endDate } = this.getHotelSearchData

        // Check if the dates are available, otherwise show an error
        if (!startDate || !endDate) {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Please select a valid start and end date.'
          this.isLoading = false
          return
        }

        const hotelCode = this.hotelCodeJP
        const formData = new FormData()
        formData.append('RatePlanCode', roomOption.RatePlanCode)
        formData.append('StartDate', startDate) // Use startDate from the store
        formData.append('EndDate', endDate) // Use endDate from the store
        formData.append('HotelCode', hotelCode)

        const promise = hotelsServices.getBookingRules(formData)
        const response = await promise

        // Handle the response here
        const results = response?.data?.BookingRulesRS
        if (results?.Errors) {
          this.snackbar = true
          this.color = 'error'
          this.text = results.Errors.Error.Text
          this.loaded = false
          this.checkResponseCode = false
        } else if (results?.Results?.HotelResult) {
          this.getbookingRule = results.Results.HotelResult
          this.selectedHotelOption = this.getbookingRule?.HotelOptions?.HotelOption
          this.confirmedSelectedRoom = true

          this.$nextTick(() => {
            if (this.confirmedSelectedRoom && this.$refs.targetDiv) {
              const targetEl = this.$refs.targetDiv.$el
              if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' })
              }
            }
          })
        }
      } catch (error) {
        console.error('Error during booking:', error)
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong while booking the room.'
      } finally {
        this.isLoading = false
      }
    },
    // async bookRoom (roomOption) {
    //   try {
    //     this.isLoading = true
    //     const hotelCode = this.hotelCodeJP
    //     const formData = new FormData()
    //     formData.append('RatePlanCode', roomOption.RatePlanCode)
    //     formData.append('StartDate', this.hotelStartDate)
    //     formData.append('EndDate', this.hotelEndDate)
    //     formData.append('HotelCode', hotelCode)

    //     const promise = hotelsServices.getBookingRules(formData)
    //     const response = await promise
    //     // eslint-disable-next-line no-console
    //     console.log(response)
    //     const results = response.data.BookingRulesRS

    //     if (results.Errors !== undefined) {
    //       this.snackbar = true
    //       this.color = 'error'
    //       this.text = results.Errors.Error.Text
    //       this.loaded = false
    //       this.checkResponseCode = false
    //     } else {
    //       this.getbookingRule = results.Results.HotelResult
    //       this.selectedHotelOption = results.Results.HotelResult.HotelOptions.HotelOption
    //       // eslint-disable-next-line no-console
    //       console.log(this.getbookingRule)
    //       this.confirmedSelectedRoom = true

    //       this.$nextTick(() => {
    //         if (this.confirmedSelectedRoom && this.$refs.targetDiv) {
    //           const targetEl = this.$refs.targetDiv.$el
    //           if (targetEl) {
    //             targetEl.scrollIntoView({ behavior: 'smooth' })
    //           }
    //         }
    //       })
    //     }
    //   } catch (error) {
    //     // eslint-disable-next-line no-console
    //     console.error('Error during booking:', error)
    //     this.snackbar = true
    //     this.color = 'error'
    //     this.text = 'Something went wrong while booking the room.'
    //   } finally {
    //     this.isLoading = false
    //   }
    // },
    selectRoomHotelGta (AvailIndex) {
      console.log('AvailIndex = ' + AvailIndex)
      if (Array.isArray(this.hotelAvails.HotelOptions.HotelOption)) {
        this.selectedRoomGta = this.hotelAvails.HotelOptions.HotelOption[AvailIndex]
        this.selectedRoomGtaArray.push(this.hotelAvails.HotelOptions.HotelOption[AvailIndex])
        this.getRatePlanCode = this.hotelAvails.HotelOptions.HotelOption[AvailIndex].RatePlanCode
        this.hotelPrices = this.hotelAvails.HotelOptions.HotelOption[AvailIndex].Prices.Price.TotalFixAmounts.Nett
      } else {
        this.selectedRoomGta = this.hotelAvails.HotelOptions.HotelOption
        this.selectedRoomGtaArray.push(this.hotelAvails.HotelOptions.HotelOption)
        this.getRatePlanCode = this.hotelAvails.HotelOptions.HotelOption.RatePlanCode
        this.hotelPrices = this.hotelAvails.HotelOptions.HotelOption.Prices.Price.TotalFixAmounts.Nett
      }
      this.selectedHotelCode = this.hotelAvails.Code
      this.selectedHotelJPCode = this.hotelAvails.JPCode
      this.selectedHotelJPDCode = this.hotelAvails.JPDCode
      // }
      this.showRoomsDialog = false
      document.getElementById('selectedRoomtargetDiv').scrollIntoView()
    },
    async confirmSelectedRoom () {
      this.isLoading = true
      if (this.getRatePlanCodeArray.length > 0) {
        for (let x = 0; x < this.getRatePlanCodeArray.length; x++) {
          const formData = new FormData()
          formData.append('RatePlanCode', this.getRatePlanCodeArray[x])
          formData.append('StartDate', this.hotelStartDate)
          formData.append('EndDate', this.hotelEndDate)
          formData.append('HotelCode', this.selectedHotelJPCodeArray[x])
          try {
            const promise = hotelsServices.getBookingRules(formData)
            const response = await promise
            console.log(response)
            const results = response.data.BookingRulesRS
            if (results.Errors !== undefined) {
              this.snackbar = true
              this.color = 'error'
              this.text = results.Errors.Error.Text
              this.loaded = false
              this.checkResponseCode = false
              this.isLoading = false
            } else {
              this.getbookingRuleArray.push(results.Results.HotelResult)
              this.confirmedSelectedRoom = true
              this.isLoading = false
            }
          } catch (error) {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Something went wrong'
            this.loaded = false
            this.checkResponseCode = false
            this.isLoading = false
          }
        }
      }
      if (this.getRatePlanCodeArray.length === 0 && this.getRatePlanCode) {
        const formData = new FormData()
        formData.append('RatePlanCode', this.getRatePlanCode)
        formData.append('StartDate', this.hotelStartDate)
        formData.append('EndDate', this.hotelEndDate)
        formData.append('HotelCode', this.selectedHotelJPCode)
        try {
          const promise = hotelsServices.getBookingRules(formData)
          const response = await promise
          console.log(response)
          const results = response.data.BookingRulesRS
          if (results.Errors !== undefined) {
            this.snackbar = true
            this.color = 'error'
            this.text = results.Errors.Error.Text
            this.loaded = false
            this.checkResponseCode = false
            this.isLoading = false
          } else {
            this.getbookingRule = results.Results.HotelResult
            this.confirmedSelectedRoom = true
            this.isLoading = false
          }
        } catch (error) {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Something went wrong'
          this.loaded = false
          this.checkResponseCode = false
          this.isLoading = false
        }
      }
    },
    assignPhone (phone) {
      this.phone = phone
    },
    // async finalBookHotel () {
    //   this.isLoading = true
    //   if (this.getbookingRuleArray.length > 0) {
    //     for (let x = 0; x < this.getbookingRuleArray.length; x++) {
    //       const formData = new FormData()
    //       const bookingCode = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.BookingCode._
    //       const startDate = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Start
    //       const endDate = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.End
    //       const HotelCode = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.HotelCode
    //       const minimumPrice = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Minimum
    //       const maximumPrice = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Maximum
    //       const currency = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Currency
    //       formData.append('bookingCode', bookingCode)
    //       formData.append('startDate', startDate)
    //       formData.append('endDate', endDate)
    //       formData.append('HotelCode', HotelCode)
    //       formData.append('minimumPrice', minimumPrice)
    //       formData.append('maximumPrice', maximumPrice)
    //       formData.append('currency', currency)
    //       formData.append('phone_number', this.phone.formattedNumber)
    //       formData.append('title', this.title)
    //       formData.append('name', this.name)
    //       formData.append('surname', this.surname)
    //       formData.append('age', this.age)
    //       formData.append('email', this.email)
    //       formData.append('nationality', this.issueCountry)
    //       formData.append('board', this.selectedBoard)
    //       formData.append('hotel_name', this.selectedHotelName)
    //       formData.append('hotel_category', this.selectedHotelCategory)
    //       formData.append('hotel_type_category', this.selectedHotelTypeCategory)
    //       formData.append('identification_document_pax', this.identification_document_pax)
    //       formData.append('address_pax', this.address_pax)
    //       // formData.append('city_pax', this.city_pax)
    //       // formData.append('country_pax', this.country_pax)
    //       formData.append('postal_code_pax', this.postal_code_pax)
    //       formData.append('book_after_payment', '1')
    //       if (this.rooms.length > 0) {
    //         for (let r = 0; r < this.rooms.length; r++) {
    //           formData.append('rooms[' + r + '][travellers]', this.rooms[r].travelers)
    //           formData.append('rooms[' + r + '][children]', this.rooms[r].children)
    //           if (this.rooms[r].ageSelects.length > 0) {
    //             for (let rx = 0; rx < this.rooms[r].ageSelects.length; rx++) {
    //               formData.append('rooms[' + r + '][ages][' + rx + ']', this.rooms[r].ageSelects[rx].age)
    //             }
    //           }
    //           // formData.append('rooms[' + r + '][category]', this.rooms[r].roomCategory.Type)
    //           formData.append('rooms[' + r + '][category]', this.selectedCategory)
    //         }
    //       }
    //       if (this.bNames.length > 0) {
    //         for (let x = 0; x < this.bNames.length; x++) {
    //           formData.append('names[' + x + ']', this.bNames[x])
    //         }
    //       }
    //       if (this.bSurnames.length > 0) {
    //         for (let y = 0; y < this.bSurnames.length; y++) {
    //           formData.append('surnames[' + y + ']', this.bSurnames[y])
    //         }
    //       }
    //       if (this.bAges.length > 0) {
    //         for (let z = 0; z < this.bAges.length; z++) {
    //           formData.append('ages[' + z + ']', this.bAges[z])
    //         }
    //       }
    //       if (this.bNamesChild.length > 0) {
    //         for (let xx = 0; xx < this.bNamesChild.length; xx++) {
    //           formData.append('namesChild[' + xx + ']', this.bNamesChild[xx])
    //         }
    //       }
    //       if (this.bSurnamesChild.length > 0) {
    //         for (let yy = 0; yy < this.bSurnamesChild.length; yy++) {
    //           formData.append('surnamesChild[' + yy + ']', this.bSurnamesChild[yy])
    //         }
    //       }
    //       if (this.bAgesChild.length > 0) {
    //         for (let zz = 0; zz < this.bAgesChild.length; zz++) {
    //           formData.append('agesChild[' + zz + ']', this.bAgesChild[zz])
    //         }
    //       }

    //       try {
    //         const promise = hotelsServices.finalBookHotel(formData)
    //         const response = await promise
    //         console.log(response)
    //         // const results = response.data.BookingRS
    //         const resultFormData = response.data.formDataId
    //         this.finalBookHotelFormData = resultFormData
    //         this.finalBookHotelsFormData[x] = resultFormData
    //         this.isBooked = true
    //         this.isLoading = false
    //       } catch (error) {
    //         this.snackbar = true
    //         this.color = 'error'
    //         this.text = 'Something went wrong'
    //         this.loaded = false
    //         this.checkResponseCode = false
    //         this.isLoading = false
    //       }
    //     }
    //   }
    //   if (this.getbookingRuleArray.length === 0 && this.getbookingRule) {
    //     const formData = new FormData()
    //     const bookingCode = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.BookingCode._
    //     const startDate = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Start
    //     const endDate = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.End
    //     const HotelCode = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.HotelCode
    //     const minimumPrice = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Minimum
    //     const maximumPrice = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Maximum
    //     const currency = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Currency
    //     formData.append('bookingCode', bookingCode)
    //     formData.append('startDate', startDate)
    //     formData.append('endDate', endDate)
    //     formData.append('HotelCode', HotelCode)
    //     formData.append('minimumPrice', minimumPrice)
    //     formData.append('maximumPrice', maximumPrice)
    //     formData.append('currency', currency)
    //     formData.append('phone_number', this.phone.formattedNumber)
    //     formData.append('title', this.title)
    //     formData.append('name', this.name)
    //     formData.append('surname', this.surname)
    //     formData.append('age', this.age)
    //     formData.append('email', this.email)
    //     formData.append('nationality', this.issueCountry)
    //     formData.append('board', this.selectedBoard)
    //     formData.append('hotel_name', this.selectedHotelName)
    //     formData.append('hotel_category', this.selectedHotelCategory)
    //     formData.append('hotel_type_category', this.selectedHotelTypeCategory)
    //     formData.append('identification_document_pax', this.identification_document_pax)
    //     formData.append('address_pax', this.address_pax)
    //     formData.append('city_pax', this.city_pax)
    //     formData.append('country_pax', this.country_pax)
    //     formData.append('postal_code_pax', this.postal_code_pax)
    //     formData.append('book_after_payment', '1')
    //     if (this.rooms.length > 0) {
    //       for (let r = 0; r < this.rooms.length; r++) {
    //         formData.append('rooms[' + r + '][travellers]', this.rooms[r].travelers)
    //         formData.append('rooms[' + r + '][children]', this.rooms[r].children)
    //         if (this.rooms[r].ageSelects.length > 0) {
    //           for (let rx = 0; rx < this.rooms[r].ageSelects.length; rx++) {
    //             formData.append('rooms[' + r + '][ages][' + rx + ']', this.rooms[r].ageSelects[rx].age)
    //           }
    //         }
    //         // formData.append('rooms[' + r + '][category]', this.rooms[r].roomCategory.Type)
    //         formData.append('rooms[' + r + '][category]', this.selectedCategory)
    //       }
    //     }
    //     if (this.bNames.length > 0) {
    //       for (let x = 0; x < this.bNames.length; x++) {
    //         formData.append('names[' + x + ']', this.bNames[x])
    //       }
    //     }
    //     if (this.bSurnames.length > 0) {
    //       for (let y = 0; y < this.bSurnames.length; y++) {
    //         formData.append('surnames[' + y + ']', this.bSurnames[y])
    //       }
    //     }
    //     if (this.bAges.length > 0) {
    //       for (let z = 0; z < this.bAges.length; z++) {
    //         formData.append('ages[' + z + ']', this.bAges[z])
    //       }
    //     }
    //     if (this.bNamesChild.length > 0) {
    //       for (let xx = 0; xx < this.bNamesChild.length; xx++) {
    //         formData.append('namesChild[' + xx + ']', this.bNamesChild[xx])
    //       }
    //     }
    //     if (this.bSurnamesChild.length > 0) {
    //       for (let yy = 0; yy < this.bSurnamesChild.length; yy++) {
    //         formData.append('surnamesChild[' + yy + ']', this.bSurnamesChild[yy])
    //       }
    //     }
    //     if (this.bAgesChild.length > 0) {
    //       for (let zz = 0; zz < this.bAgesChild.length; zz++) {
    //         formData.append('agesChild[' + zz + ']', this.bAgesChild[zz])
    //       }
    //     }

    //     try {
    //       const promise = hotelsServices.finalBookHotel(formData)
    //       const response = await promise
    //       console.log(response)
    //       // const results = response.data.BookingRS
    //       const resultFormData = response.data.formDataId
    //       this.finalBookHotelFormData = resultFormData
    //       this.isBooked = true
    //       this.isLoading = false
    //       // if (results.Errors !== undefined) {
    //       //   this.snackbar = true
    //       //   this.color = 'error'
    //       //   this.text = results.Errors.Error.Text
    //       //   this.loaded = false
    //       //   this.checkResponseCode = false
    //       //   this.isBooked = true
    //       //   this.isLoading = false
    //       // } else {
    //       //   this.getBookingCode = results
    //       //   this.finalBookHotelFormData = resultFormData
    //       //   this.isBooked = true
    //       //   this.isLoading = false
    //       // }
    //     } catch (error) {
    //       this.snackbar = true
    //       this.color = 'error'
    //       this.text = 'Something went wrong'
    //       this.loaded = false
    //       this.checkResponseCode = false
    //       this.isLoading = false
    //     }
    //   }
    // },
    changeCounterRoom (index, type, value) {
      if (!this.hotelStartDate) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select start date to custom your trip'
        this.loaded = false
      } else if (this.hotelStartDate) {
        if (type === 'rooms') {
          this.room_count += +value
          if (this.room_count > 0) {
            if (value > 0) {
              this.rooms.push({ travelers: 0, children: 0, ageSelects: [] })
            } else {
              this.rooms.splice(-1, 1)
            }
          } else {
            this.room_count = 0
            this.rooms = []
          }
        } else {
          const newValue = Math.max(0, this.rooms[index][type] + value)
          this.$set(this.rooms, index, {
            ...this.rooms[index],
            [type]: newValue
          })

          if (type === 'children') {
            this.addAgeSelection(index, value)
            this.showAgesSelects = true
          }
        }
        this.travellers = this.totalTravelers
        this.children = this.totalChildren
        this.otherTravellers = []
        this.otherChildren = []
        for (let x = 1; x <= this.totalTravelers - 1; x++) {
          this.otherTravellers.push({ id: x })
        }
        this.otherTravellers = this.onlyUniqueObjectsId(this.otherTravellers)
        for (let y = 1; y <= this.totalChildren; y++) {
          this.otherChildren.push({ id: y })
        }
        this.otherChildren = this.onlyUniqueObjectsId(this.otherChildren)
      }
    },
    onlyUniqueObjectsId (array) {
      const key = 'id'
      const arrayUniqueByKey = [...new Map(array.map(item => [item[key], item])).values()]
      return arrayUniqueByKey
    },
    selectHotel (code, name) {
      // eslint-disable-next-line no-console
      console.log(code, name)
      this.$router.push({ name: 'hotel-id', params: { code } })
    },
    addAgeSelection (index, value) {
      if (!this.rooms[index].ageSelects) {
        this.$set(this.rooms[index], 'ageSelects', [])
      }

      if (value === 1) {
        this.rooms[index].ageSelects.push({ age: null })
      } else {
        this.rooms[index].ageSelects.splice(-1, 1)
      }
    },
    getRoomAgeSelectErrorMessages (roomIndex, childIndex) {
      if (!this.showAgesSelects) {
        return [] // Skip error messages if age selects are hidden
      }
      const ageSelect = this.rooms[roomIndex].ageSelects[childIndex]
      if (ageSelect && ageSelect.age === null) {
        return ['This field is required']
      }
      return []
    },
    checkoutPayment () {
      this.loaded = true
      this.openProceed = true
      this.showCheckout = true
    },
    bookAdventures () {
      this.$store.dispatch('setTravellersNumber', {
        adults: this.travellers,
        children: this.children,
        totalPrice: this.hotelPrices,
        packageStartDay: this.packageStartDay,
        packageDetails: this.hotelAvails,
        priceSessionId: this.priceSessionId,
        ratePlanCode: this.RatePlanCode,
        bookingRule: this.getbookingRule,
        bookingInfo: this.getBookingCode,
        hotelStartDate: this.hotelStartDate,
        hotelEndDate: this.hotelEndDate,
        finalBookHotelFormData: this.finalBookHotelFormData
      })
      this.$router.push({ name: 'booking-module', params: { module: 'hotel' } })
    },
    searchCountries () {
      console.log(this.searchTerm)
      if (!this.searchTerm) {
        this.gtaCountries = this.gtaCountriesCopy
      }
      console.log(this.gtaCountriesCopy)
      this.gtaCountries = this.gtaCountriesCopy.filter((country) => {
        console.log(country.name, this.searchTerm.toLowerCase())
        return country.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      })
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

.scroll-btn-left,
.scroll-btn-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  transition: background-color 0.2s ease-in-out;
}

.scroll-btn-left:hover,
.scroll-btn-right:hover {
  background-color: rgba(0, 0, 0, 0.7); /* Darker shade on hover */
}

.scroll-btn-left {
  left: 5px;
}

.scroll-btn-right {
  right: 5px;
}

/* Centered Thumbnails Container with Fixed Width */
/* Centered Thumbnails Container */
.thumbnails-container {
  display: flex;
  justify-content: center; /* Center the thumbnails within the container */
  gap: 10px; /* Add spacing between thumbnails */
  margin-top: 10px;
  overflow-x: auto; /* Add horizontal scroll if needed */
  padding: 0 10px;
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
