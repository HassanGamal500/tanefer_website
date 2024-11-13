<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      top
      :timeout="5000"
      auto-height
      vertical
    >
      <v-row>
        <h4>{{ text }}</h4>
        <v-spacer />
        <v-btn
          dark
          icon
          @click="snackbar = false"
        >
          <v-icon color="white">
            mdi-close
          </v-icon>
        </v-btn>
      </v-row>
    </v-snackbar>
    <v-img v-if="!flight && loaded" max-width="200" class="blink-2 mx-auto my-5" src="../../assets/tanfer.png" />
    <p v-if="!flight && !loaded" class="text-center my-5">
      Sorry, Couldn't fetch the flight details
    </p>
    <div v-if="flight && !loaded" class="t-container pt-8">
      <!-- <v-btn v-show="paymentPhase && !confirmationPhase" color="late" text @click="backTo()">
        <v-icon left>
          mdi-chevron-left
        </v-icon>Back To previous phase
      </v-btn> -->
      <!-- <div v-if="!confirmationPhase && showTravellerData" class="flight-book-flex"> -->
      <div v-if="!confirmationPhase && showTravellerData" class="">
        <v-row>
          <div
            v-show="!paymentPhase && !confirmationPhase && travellersPhase"
            cols="12"
            lg="8"
            md="8"
            sm="8"
            xs="12"
            class="order-last order-md-first order-sm-last order-xs-last"
          >
            <div class="w-form">
              <travellers-data
                :travellers="numberOfPassenger"
                :loading="loading"
                :open-confirm-button="openConfirmButton"
                :module="$route.params.module"
                :has-cruise="checkHasCruise"
                @dataReady="submitTravellersData"
                @submitPayment="submitPayment"
                @submitConfirmation="submitConfirmation"
              />
            </div>
          </div>

          <!-- <div v-show="paymentPhase && !confirmationPhase" class="col-60">
            <div class="w-form">
              <div class="d-flex" style="justify-content: space-between">
                <v-btn :loading="loading" class="brown white--text py-5 mt-5 px-12" @click="book">
                  Pay ${{ bookFor === 'flight' ? flight.pricingInfo.TotalFare : packagePrice }}
                </v-btn>
                <v-btn class="brown white--text py-5 mt-5 px-12" @click="goTo('travellers')">
                  Back
                </v-btn>
              </div>
            </div>
          </div> -->
          <!-- <aside v-if="succesfullPayment" class="price-sumery pt-12" style="flex: 0 0 30% !important;max-width: 30% !important;"> -->
          <aside
            v-if="succesfullPayment"
            class="price-sumery py-12 order-first order-md-last order-sm-first order-xs-first"
            cols="12"
            lg="4"
            md="4"
            sm="4"
            xs="12"
          >
            <div v-if="$route.params.module === 'trip'" class="flight-review-border stiky">
              <div class="summry-title">
                <span v-if="packageActivities">
                  <h3>{{ packageActivities.packageTitle }} - {{ packageActivities.packageDuration }} Days / {{ packageActivities.packageNightsNumber }} Nights</h3>
                </span>
              </div>
              <div v-if="packageActivities">
                <v-card class="" style="border-radius: 15px;">
                  <v-card-text>
                    <p class="font-weight-bold">
                      <v-icon>mdi-account</v-icon>
                      {{ numberOfPassenger.adults }} Adults
                    </p>
                    <p class="font-weight-bold">
                      <v-icon>mdi-account</v-icon>
                      {{ numberOfPassenger.children }} Children
                    </p>
                    <p class="font-weight-bold">
                      <v-icon>mdi-calendar</v-icon>
                      Start in {{ formatDate(packageStartDay) }}
                    </p>
                    <v-divider class="mb-4" />
                    <div>
                      <v-timeline v-for="(city, index) in packageActivities.activities" :key="index + '_city'" align-left dense style="padding-top:10px;">
                        <v-timeline-item
                          color="grey"
                          icon-color="grey lighten-2"
                          small
                          style="padding-top:0px;padding-bottom:5px"
                        >
                          {{ city.cityname }}
                        </v-timeline-item>
                      </v-timeline>
                    </div>
                    <v-divider class="mb-4" />
                    <div class="d-flex justify-space-between">
                      <div class="room-price-cell text text-h6 font-weight-bold">
                        Total Price
                      </div>
                      <div class="late--text text-h6 font-weight-bold ml-3">
                        <!-- ${{ packageTotalPrice }}<br> -->
                        ${{ packageTotalAllPrice.toFixed(2) }}<br>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
              <!-- <div class="summry-total-box">
                <div class="total-title">
                  Total<br>
                </div>
                <div>${{ bookFor === 'flight' ? flight.pricingInfo.TotalFare : packageTotalPrice }}<br></div>
              </div> -->
              <div v-if="!travellersPhase && !paymentPhase && !confirmationPhase" class="flight-book-bt" @click="goTo('travellers')">
                Continue to checkout
              </div>
            </div>
            <div v-else-if="$route.params.module === 'adventure'" class="stiky">
              <v-card class="" style="border-radius: 15px;">
                <v-card-text>
                  <h6 class="text-h6 black--text" color="black">
                    <span v-for="(item) in selectedAdventures" :key="item.activity_id">
                      {{ item.activityTitle }} <br>
                      <p class="">
                        <v-icon>mdi-calendar</v-icon>
                        {{ item.date.split("-").reverse().join("-") }}
                      </p>
                      <v-divider class="mb-4" />
                    </span>
                  </h6>
                  <p class="font-weight-bold">
                    <v-icon>mdi-account</v-icon>
                    {{ numberOfPassenger.adults }} Adults
                  </p>
                  <p class="font-weight-bold">
                    <v-icon>mdi-account</v-icon>
                    {{ numberOfPassenger.children }} Children
                  </p>
                  <v-divider class="mb-4" />
                  <div class="d-flex justify-space-between">
                    <div class="room-price-cell text text-h6 font-weight-bold">
                      Total Price
                    </div>
                    <div class="late--text text-h6 font-weight-bold ml-3">
                      ${{ adventuresTotalPrice() }}<br>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
            <div v-else-if="$route.params.module === 'hotel'" class="flight-review-border stiky">
              <div class="summry-title">
                <span v-if="packageActivities">
                  <h3>{{ packageActivities.HotelInfo?.Name }}</h3>
                </span>
              </div>
              <div v-if="packageActivities">
                <v-card class="" style="border-radius: 15px;">
                  <v-card-text>
                    <p class="font-weight-bold">
                      <v-icon>mdi-account</v-icon>
                      {{ numberOfPassenger.adults }} Adults
                    </p>
                    <p class="font-weight-bold">
                      <v-icon>mdi-account</v-icon>
                      {{ numberOfPassenger.children }} Children
                    </p>
                    <v-divider class="mb-4" />
                    <div class="d-flex justify-space-between">
                      <div class="room-price-cell text text-h6 font-weight-bold">
                        Total Price
                      </div>
                      <div class="late--text text-h6 font-weight-bold ml-3">
                        ${{ packageTotalPrice }}<br>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
              <div v-if="!travellersPhase && !paymentPhase && !confirmationPhase" class="flight-book-bt" @click="goTo('travellers')">
                Continue to checkout
              </div>
            </div>
            <div v-else class="flight-review-border stiky">
              <div v-for="(item, i) in $store.state.cruiseReserveData.rooms" :key="i" class="d-flex justify-space-between">
                <div class="body-1">
                  {{ item.type }}
                </div>
                <div class="body-1">
                  {{ item.quantity }}
                </div>
              </div>
              <v-divider class="my-2" />
              <div class="d-flex justify-space-between">
                <div class="body-1">
                  From
                </div>
                <div class="body-1">
                  {{ $store.state.cruiseReserveData.start_date }}
                </div>
              </div>
              <div class="d-flex justify-space-between">
                <!-- <div class="body-1">
                  To
                </div> -->
                <!-- <div class="body-1">
                  {{ $store.state.cruiseReserveData.end_date }}
                </div> -->
              </div>
              <v-divider class="my-2" />
              <div class="d-flex justify-space-between">
                <div class="room-price-cell">
                  Total<br>
                </div>
                <div class="late--text font-weight-bold ml-3">
                  ${{ $store.state.cruiseReserveData.totalPrice }}<br>
                </div>
              </div>
            </div>
          </aside>
        </v-row>
      </div>
      <div v-if="confirmationPhase && !showTravellerData" class="tickit-box">
        <div v-if="$route.params.module === 'trip'" class="flight-review-border">
          <div class="airline-head">
            <div class="airline-head-title">
              Your trip was booked successfully
            </div>
          </div>
          <div v-if="packageActivities">
            <h2>
              Package Name: <strong>{{ packageActivities.packageTitle }}</strong>
            </h2>
            <h5>Start on: <strong>{{ packageStartDay }}</strong> for <strong>{{ packageActivities.packageDuration }}</strong> Days / <strong>{{ packageActivities.packageNightsNumber }}</strong> Nights</h5>
            <h5 class="mb-5">
              <!-- Price: <strong>${{ packageTotalPrice }}</strong> -->
              Price: <strong>${{ packageTotalAllPrice }}</strong>
            </h5>
            <div v-for="(activity, i) in packageActivities.activities" :key="i">
              <v-expansion-panels v-model="panelExpandedActivities[i]" focusable class="mb-5">
                <v-expansion-panel style="border-radius: 18px;">
                  <v-expansion-panel-header class="font-weight-bold text-h6 change-icon-style" style="border-radius: 8px;">
                    <v-row v-if="activity.type === 'adventure'">
                      <v-col lg="6" md="6" sm="6">
                        {{ activity.cityname }}
                      </v-col>
                      <v-col lg="6" md="6" sm="6">
                        <span style="float: right;">
                          <span class="quantity text-center font-weight-bold">{{ activity.days_number }} days</span>
                        </span>
                      </v-col>
                    </v-row>
                    <v-row v-else>
                      <v-col cols="12">
                        {{ activity.cityname }}
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="my-8">
                    <div v-if="activity.type === 'adventure'">
                      <v-card v-for="(day, x) in activity.days" :key="x" class="my-2">
                        <v-card-title class="white--text" style="background-color: #4f3316;">
                          Day <span v-if="day.start_day !== null"> {{ day.start_day }}</span> <span v-if="day.start_text_day !== null" class="ml-4">{{ day.start_text_day }}</span>
                        </v-card-title>
                        <v-card-text class="pt-4">
                          <v-row>
                            <v-col cols="12">
                              <div v-if="day.days.length > 0">
                                <div v-for="(adventures, adventureIndex) in day.days" :key="adventureIndex">
                                  <div v-if="adventures.adventrue">
                                    <v-row>
                                      <v-col cols="12">
                                        {{ adventures.adventrue.activityTitle }}
                                      </v-col>
                                    </v-row>
                                  </div>
                                  <v-divider class="my-2" />
                                </div>
                              </div>
                              <div v-else>
                                You Have Free Time
                              </div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </div>
                    <div v-else>
                      <v-card class="my-2">
                        <v-card-title class="white--text" style="background-color: #4f3316;display: flow-root;">
                          <span class="float-left">Day {{ activity.package_day }}</span> <span v-if="packageStartDay !== null" class="ml-4">{{ activity.package_text_day }}</span> <span class="float-right">Nile Cruise</span>
                        </v-card-title>
                        <v-card-text class="pt-4">
                          <v-row>
                            <v-col cols="12">
                              <div v-for="(cruise, c) in activity.cruise" :key="c">
                                <v-row class="">
                                  <v-col v-if="cruise.master_image" cols="12" md="4" class="pt-4">
                                    <v-img
                                      max-height="350"
                                      :src="cruise.master_image"
                                      max-width="250"
                                      class="rounded-lg"
                                    />
                                  </v-col>
                                  <v-col cols="10" :md="cruise.master_image ? 6 : 10">
                                    <div class="cruise-result-trip justify-space-between pt-4">
                                      <div>
                                        <h5 class="text-h5 font-weight-bold">
                                          {{ cruise.name }}
                                        </h5>
                                      </div>
                                    </div>
                                  </v-col>
                                </v-row>
                              </div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <div v-if="numberOfPassenger.hotelJPCode !== NULL && numberOfPassenger.bookingRule">
              <v-expansion-panels v-model="numberOfPassenger.hotelJPCode" focusable class="mb-5">
                <v-expansion-panel style="border-radius: 18px;">
                  <v-expansion-panel-header class="font-weight-bold text-h6 change-icon-style" style="border-radius: 8px;">
                    <v-row>
                      <v-col cols="12">
                        Accommodation
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="my-8">
                    <v-card class="my-2">
                      <v-card-title class="white--text" style="background-color: #4f3316;">
                        <span v-if="numberOfPassenger.bookingRule"> {{ numberOfPassenger.bookingRule.HotelOptions.HotelOption.PriceInformation.HotelContent.HotelName }} </span>
                      </v-card-title>
                      <v-card-text class="pt-4">
                        <v-row>
                          <v-col cols="12">
                            <v-row>
                              <!-- <v-col cols="12">
                                Number of Adults: <strong>{{ numberOfPassenger.adults }}</strong>
                              </v-col>
                              <v-col cols="12">
                                Number of Children: <strong>{{ numberOfPassenger.children }}</strong>
                              </v-col> -->
                              <v-col cols="12">
                                Check In: <strong>{{ numberOfPassenger.hotelStartDate }}</strong>
                              </v-col>
                              <v-col cols="12">
                                Check Out: <strong>{{ numberOfPassenger.hotelEndDate }}</strong>
                              </v-col>
                              <!-- <v-col cols="12">
                                Price: <strong>${{ numberOfPassenger.bookingRule.HotelOptions.HotelOption.PriceInformation.Prices.Price.TotalFixAmounts.Nett }}</strong>
                              </v-col> -->
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
          <div>If you want to book flight click here</div>
          <v-btn
            class="brown white--text py-5 mt-5 mr-5 px-12"
            @click="openBookFlight"
          >
            Book Flight
          </v-btn>
          <br>
          <!-- <NuxtLink to="/trips"> -->
          <v-btn class="brown white--text py-5 mt-5 mr-5 px-12" @click="redirectPageTrips">
            Check Trips
          </v-btn>
          <!-- </NuxtLink> -->
        </div>
        <div v-if="$route.params.module === 'adventure'" class="flight-review-border">
          <div v-if="succesfullPayment">
            <v-card-title class="late--text">
              Booked Activities
            </v-card-title>
            <table border="2" width="100%">
              <thead>
                <tr>
                  <th class="text-left brown--text pl-5">
                    Activity
                  </th>
                  <th class="brown--text">
                    Date
                  </th>
                  <th class="brown--text">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedAdventures" :key="item.activity_id">
                  <td class="text-left pl-5">
                    {{ item.activityTitle }}
                  </td>
                  <td class="text-center">
                    {{ new Date(item.date).toDateString() }}
                  </td>
                  <td class="text-center">
                    ${{ item.subTotalPrice }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left font-weight-bold brown--text pl-5">
                    Total Price
                  </td>
                  <td />
                  <td class="text-center font-weight-bold brown--text">
                    ${{ adventuresTotalPrice() }}
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <!-- <NuxtLink to="/adventures" > -->
              <v-btn class="brown white--text py-5 mt-5 mr-5 px-12" @click="handleLinkClick('adventures')">
                Check Adventures
              </v-btn>
              <!-- </NuxtLink> -->
            </div>
          </div>
        </div>
        <!-- <NuxtLink to="/"> -->
        <div v-if="$route.params.module === 'cruise'" class="flight-review-border">
          <div v-if="succesfullPayment">
            <v-card-title class="late--text">
              Booked Cruises
            </v-card-title>
            <table border="2" width="100%">
              <thead>
                <tr>
                  <th class="text-left brown--text pl-5">
                    Cruise
                  </th>
                  <th class="brown--text">
                    Adults
                  </th>
                  <th class="brown--text">
                    Children
                  </th>
                  <th class="brown--text">
                    Date
                  </th>
                  <th class="brown--text">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedAdventures" :key="item.activity_id">
                  <td class="text-left pl-5">
                    {{ item.activityTitle }}
                  </td>
                  <td class="text-center">
                    {{ new Date(item.date).toDateString() }}
                  </td>
                  <td class="text-center">
                    ${{ item.subTotalPrice }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left font-weight-bold brown--text pl-5">
                    Total Price
                  </td>
                  <td class="text-center">
                    {{ selectReservedCruise.adults }}
                  </td>
                  <td class="text-center">
                    {{ selectReservedCruise.children }}
                  </td>
                  <td class="text-center">
                    {{ new Date(selectReservedCruise.start_date).toDateString() }}
                  </td>
                  <td class="text-center font-weight-bold brown--text">
                    ${{ selectReservedCruise.totalPrice }}
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <!-- <NuxtLink to="/adventures" > -->
              <v-btn class="brown white--text py-5 mt-5 mr-5 px-12" @click="handleLinkClick('adventures')">
                Check Adventures
              </v-btn>
              <!-- </NuxtLink> -->
            </div>
          </div>
        </div>
        <div v-if="$route.params.module === 'hotel'">
          <div>
            <v-card class="mx-auto pa-5" max-width="800" outlined>
              <!-- Removed background with outlined -->
              <v-row align="center">
                <v-col cols="12">
                  <h2 class="text-h4 font-weight-bold text-center mb-5">
                    Hotel Booking Confirmation
                  </h2>
                </v-col>
                <v-col cols="12" md="8">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    Your Hotel was booked successfully!
                  </v-card-title>
                  <v-card-subtitle>
                    Thank you for choosing Tanefer. You will receive an email with the confirmation code shortly.
                  </v-card-subtitle>
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-h6 font-weight-bold">
                        Details
                      </th> <!-- Vuetify utility classes -->
                      <th class="text-h6 font-weight-bold">
                        Information
                      </th> <!-- Vuetify utility classes -->
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Hotel Information -->
                    <tr>
                      <td>
                        <v-icon class="mr-2" small>
                          mdi-hotel
                        </v-icon> <strong>Hotel Name</strong>
                      </td>
                      <td>{{ packageActivities.HotelInfo?.Name || 'N/A' }}</td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon class="mr-2" small>
                          mdi-map-marker
                        </v-icon> <strong>Address</strong>
                      </td>
                      <td>{{ bookingResponse.address || 'N/A' }}</td>
                    </tr>

                    <!-- Number of Passengers and Dates -->
                    <tr>
                      <td>
                        <v-icon class="mr-2" small>
                          mdi-account-multiple
                        </v-icon> <strong>Number of Adults</strong>
                      </td>
                      <td>{{ numberOfPassenger.adults }}</td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon class="mr-2" small>
                          mdi-baby-face-outline
                        </v-icon> <strong>Number of Children</strong>
                      </td>
                      <td>{{ numberOfPassenger.children }}</td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon class="mr-2" small>
                          mdi-calendar-check
                        </v-icon> <strong>Arrival Time</strong>
                      </td>
                      <td>{{ $store.state.travellersNumber.hotelStartDate }}</td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon class="mr-2" small>
                          mdi-calendar-check
                        </v-icon> <strong>Departure Time</strong>
                      </td>
                      <td>{{ $store.state.travellersNumber.hotelEndDate }}</td>
                    </tr>

                    <!-- Room and Pricing Information -->
                    <tr>
                      <td>
                        <v-icon class="mr-2" small>
                          mdi-currency-usd
                        </v-icon> <strong>Total Price</strong>
                      </td>
                      <td>${{ packageTotalPrice }}</td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon class="mr-2" small>
                          mdi-bed
                        </v-icon> <strong>Room Type</strong>
                      </td>
                      <td>{{ bookingResponse.roomType || 'N/A' }}</td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon class="mr-2" small>
                          mdi-star
                        </v-icon> <strong>Board</strong>
                      </td>
                      <td>{{ bookingResponse.board || 'N/A' }}</td>
                    </tr>
                    <!-- Cancellation Policy -->
                    <!-- <tr>
                        <td>
                          <v-icon class="mr-2" small>
                            mdi-information-outline
                          </v-icon> <strong>Cancellation Policy</strong>
                        </td>
                        <td>{{ bookingResponse.cancellationPolicy || 'N/A' }}</td>
                      </tr> -->

                    <!-- Comments -->
                    <tr>
                      <td>
                        <v-icon class="mr-2" small>
                          mdi-comment-text-outline
                        </v-icon> <strong>Others</strong>
                      </td>
                      <td>
                        <div v-html="bookingResponse.comments" />
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <v-divider class="my-4" />

              <v-col cols="12" class="text-center">
                <p>Thank you for choosing Tanefer! We hope you have a pleasant stay.</p>
              </v-col>

              <v-btn class="brown white--text py-5 mt-5 mr-5 px-12" outlined color="primary" @click="redirectPageHotels">
                Check More Hotels
              </v-btn>
            </v-card>

            <!-- <v-container class="py-10">
              <v-card class="mx-auto pa-5 elevation-2" max-width="800">
                <v-row align="center">
                  <v-col cols="12">
                    <h2 class="text-h4 font-weight-bold text-center mb-5">
                      Hotel Booking Confirmation
                    </h2>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-card-title class="headline font-weight-bold">
                      Your Hotel was booked successfully!
                    </v-card-title>
                    <v-card-subtitle>
                      Thank you for booking with us. Here are your booking details.
                    </v-card-subtitle>
                  </v-col>
                </v-row>
                <v-divider class="my-4" />

                <v-row>
                  <v-col cols="12" md="6">
                    <v-icon class="mr-2">
                      mdi-hotel
                    </v-icon>
                    <strong>Hotel Name:</strong> {{ bookingResponse?.HotelContent?.HotelName || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-icon class="mr-2">
                      mdi-star
                    </v-icon>
                    <strong>Category:</strong> {{ bookingResponse?.HotelCategory?._ || 'N/A' }}
                  </v-col>
                  <v-col cols="12">
                    <v-icon class="mr-2">
                      mdi-map-marker
                    </v-icon>
                    <strong>Address:</strong> {{ bookingResponse?.Address?.Address || 'N/A' }}
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <v-row>
                  <v-col cols="12" md="6">
                    <v-icon class="mr-2">
                      mdi-currency-usd
                    </v-icon>
                    <strong>Total Price:</strong> ${{ bookingResponse?.Prices?.Price?.TotalFixAmounts?.Nett || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-icon class="mr-2">
                      mdi-bed
                    </v-icon>
                    <strong>Room Type:</strong> {{ bookingResponse?.HotelRooms?.HotelRoom?.Name || 'N/A' }}
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <v-row>
                  <v-col cols="12">
                    <v-icon class="mr-2">
                      mdi-information-outline
                    </v-icon>
                    <strong>Cancellation Policy:</strong> {{ bookingResponse?.CancellationPolicy?.Description || 'N/A' }}
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <v-btn
                  class="brown white--text py-5 mt-5 mr-5 px-12"
                  outlined
                  color="primary"
                  @click="redirectPageHotels"
                >
                  Check More Hotels
                </v-btn>
                <v-btn class="brown white--text py-5 mt-5 mr-5 px-12" @click="handleLinkClick('home')">
                  Continue Browsing
                </v-btn>
              </v-card>
            </v-container> -->
          </div>
        <!-- </NuxtLink> -->
        </div>
      </div>

      <form id="payment-form" method="POST" action="" />
    </div>
  </div>
</template>

<script>
import tripsServices from '~/services/tripsServices'
import adventureServices from '~/services/activitiesServies'
import cruisesServices from '~/services/cruisesServices'
import hotelsServices from '~/services/HotelsServices'

export default {
  middleware: 'auth',
  data () {
    return {
      bookFor: 'package',
      packagePrice: '0',
      packageID: '',
      packageDetails: [],
      adults: 1,
      childre1: 0,
      priceSessionId: '',
      flightsTimeOut: null,
      flightsOverlay: false,
      snackbar: false,
      color: '',
      text: '',
      flight: null,
      loaded: true,
      travellersPhase: false,
      paymentPhase: false,
      confirmationPhase: false,
      store: {},
      travellersData: null,
      contactInfo: null,
      zip: '',
      requiredRule: [
        v => !!v || 'Field is required'
      ],
      address: '',
      cardExpireDate: '',
      cardNum: '',
      cvv: '',
      cardCode: '',
      loading: false,
      bookingData: {},
      random: Math.random(),
      numberOfPassenger: { adults: 1, children: 0, solo: 0 },
      succesfullPayment: true,
      selectedAdventures: [],
      openConfirmButton: false,
      activitiesPrices: [],
      listPricesofActivities: [],
      packageActivities: null,
      packageStartDay: null,
      packageTotalPrice: 0,
      packageTotalAllPrice: 0,
      showTravellerData: false,
      panelExpandedActivities: [],
      selectReservedCruise: null,
      bookingIntCode: null,
      bookingLocator: null,
      hotelStartDate: null,
      hotelEndDate: null,
      finalBookHotelFormData: null,
      hotelJPCode: null,
      bookingIntCodes: [],
      bookingLocators: [],
      hotelStartDates: [],
      hotelEndDates: [],
      finalBookHotelsFormData: [],
      hotelJPCodes: [],
      checkHasCruise: false
    }
  },
  head () {
    return {
      title: 'Booking ' + this.$route.params.module
    }
  },
  computed: {
    bookingResponse () {
      return this.$store.getters['modules/booking/getBookingResponse']
    }
  },
  beforeMount () {
    this.bookFor = localStorage.getItem('bookFor')
    this.packagePrice = localStorage.getItem('packagePrice')
    this.packageID = localStorage.getItem('packageID')
    this.packageDetails = JSON.parse(localStorage.getItem('package'))
    this.adults = localStorage.getItem('adults')
    this.children = localStorage.getItem('children')
    this.activitiesPrices = localStorage.getItem('activitiesPrices')
    const arr = this.$route.fullPath.split('?')
    if (arr.length > 1 && arr[1] !== '') {
      // console.log('params found')
      this.showTravellerData = false
    } else {
      // console.log('params not found')
      this.showTravellerData = true
    }
    // if (this.$route.params.module === 'cruise') {
    //   this.priceSessionId = this.$store.state.cruiseReserveData.session
    // } else { this.priceSessionId = localStorage.getItem('priceSessionId') }
    // if (this.$route.query.response_message && this.$route.query.response_message === 'Success') {
    //   this.submitConfirmation()
    //   this.openConfirmButton = true
    // } else if (this.$route.query.response_message) {
    //   this.snackbar = true
    //   this.color = 'error'
    //   this.text = this.$route.query.response_message
    // }
  },
  mounted () {
    console.log('Stored booking response in Vuex:', this.$store.getters['modules/booking/getBookingResponse'])
    // const queryParams = this.$route.query
    // console.log(queryParams)
    if (this.$route.params.module === 'cruise') {
      this.priceSessionId = this.$store.state.cruiseReserveData.session
      this.selectReservedCruise = this.$store.state.cruiseReserveData
    } else { this.priceSessionId = localStorage.getItem('priceSessionId') }
    if (this.$route.query.response_message && this.$route.query.response_message === 'Success') {
      if (this.$route.params.module === 'trip') {
        this.submitConfirmation('packageDetails')
      } else {
        this.submitConfirmation()
      }
      this.openConfirmButton = true
    } else if (this.$route.query.response_message) {
      this.snackbar = true
      this.color = 'error'
      this.text = this.$route.query.response_message
    }
  },
  created () {
    this.store = this.$store.state
    this.travellersPhase = true
    this.loaded = false
    this.flight = {}
    if (this.$route.params.module === 'adventure') {
      if (this.$store.state.selectedAdventures && this.$store.state.travellersNumber.adults) {
        this.selectedAdventures = this.$store.state.selectedAdventures
        this.numberOfPassenger = this.$store.state.travellersNumber
        if (this.numberOfPassenger.activitiesPrices.length > 0) {
          const activitiesPrices = this.numberOfPassenger.activitiesPrices
          for (let x = 0; x < activitiesPrices.length; x++) {
            const activityPrice = activitiesPrices[x]
            // console.log(activityPrice)
            // listPricesofActivities.push(subTotalPrice)
            if (this.selectedAdventures.length > 0) {
              for (let y = 0; y < this.selectedAdventures.length; y++) {
                // console.log(this.selectedAdventures[y].activity_id === activityPrice.activity_id)
                if (this.selectedAdventures[y].activity_id === activityPrice.activity_id) {
                  const newProperty = { subTotalPrice: activityPrice.subTotalPrice }
                  // console.log(newProperty)
                  // this.selectedAdventures.splice(y, 0, { ...this.selectedAdventures[y], ...newProperty })
                  this.selectedAdventures[y] = { ...this.selectedAdventures[y], ...newProperty }
                }
              }
            }
          }
        }
        this.noData = false
        this.loaded = false
        if (this.$route.query.amount) {
          this.confirmPhase = true
          if (this.$route.query.response_message === 'Success') {
            this.succesfullPayment = true
          } else { this.succesfullPayment = false }
        }
      } else {
        this.noData = true
        this.loaded = false
      }
    } else if (this.$route.module === 'cruise') {
      this.numberOfPassenger = this.$store.state.cruiseGuests
      this.noData = false
      this.loaded = false
      if (this.$route.query.response_message && this.$route.query.response_message === 'Success') {
        this.confirmBooking()
        this.confirmPhase = true
        this.succesfullPayment = true
      } else if (this.$route.query.response_message) {
        this.snackbar = true
        this.color = 'error'
        this.text = this.$route.query.response_message
      }
    } else if (this.$route.params.module === 'trip') {
      if (this.$store.state.travellersNumber.adults) {
        this.numberOfPassenger = this.$store.state.travellersNumber
        this.numberOfPassenger.adults = this.$store.state.travellersNumber.adults
        this.numberOfPassenger.children = this.$store.state.travellersNumber.children
        this.packageActivities = this.$store.state.travellersNumber.packageDetails
        this.packageStartDay = this.$store.state.travellersNumber.packageStartDay
        this.packageTotalPrice = this.$store.state.travellersNumber.totalPrice
        this.packageTotalAllPrice = this.$store.state.travellersNumber.totalAllPrices
        this.priceSessionId = this.$store.state.travellersNumber.priceSessionId
        this.hotelJPCode = this.$store.state.travellersNumber.hotelJPCode
        this.finalBookHotelFormData = this.$store.state.travellersNumber.finalBookHotelFormData
        this.checkHasCruise = this.$store.state.travellersNumber.checkHasCruise
        // this.bookingIntCodes = this.$store.state.travellersNumber.bookingInfo.IntCode
        // this.bookingLocators = this.$store.state.travellersNumber.bookingInfo.Reservations.Reservation.Locator
        this.hotelJPCodes = this.$store.state.travellersNumber.hotelJPCodes
        this.hotelStartDates = this.$store.state.travellersNumber.hotelStartDates
        this.hotelEndDates = this.$store.state.travellersNumber.hotelEndDates
        this.finalBookHotelsFormData = this.$store.state.travellersNumber.finalBookHotelsFormData
        this.noData = false
        this.loaded = false
        if (this.$route.query.amount) {
          this.confirmPhase = true
          if (this.$route.query.response_message === 'Success') {
            this.succesfullPayment = true
          } else { this.succesfullPayment = false }
        }
      } else {
        this.noData = true
        this.loaded = false
      }
    } else if (this.$route.params.module === 'hotel') {
      if (this.$store.state.travellersNumber.adults) {
        this.numberOfPassenger = this.$store.state.travellersNumber
        this.numberOfPassenger.adults = this.$store.state.travellersNumber.adults
        this.numberOfPassenger.children = this.$store.state.travellersNumber.children
        this.packageActivities = this.$store.state.travellersNumber.packageDetails
        this.packageStartDay = this.$store.state.travellersNumber.packageStartDay
        this.packageTotalPrice = this.$store.state.travellersNumber.totalPrice
        this.priceSessionId = this.$store.state.travellersNumber.priceSessionId
        // this.bookingIntCode = this.$store.state.travellersNumber.bookingInfo.IntCode
        // this.bookingLocator = this.$store.state.travellersNumber.bookingInfo.Reservations.Reservation.Locator
        // this.hotelStartDate = this.$store.state.travellersNumber.hotelStartDate
        // this.hotelEndDate = this.$store.state.travellersNumber.hotelStartDate
        this.finalBookHotelFormData = this.$store.state.travellersNumber.finalBookHotelFormData
        this.finalBookHotelsFormData = this.$store.state.travellersNumber.finalBookHotelsFormData

        this.noData = false
        this.loaded = false
        if (this.$route.query.amount) {
          this.confirmPhase = true
          if (this.$route.query.response_message === 'Success') {
            this.succesfullPayment = true
          } else { this.succesfullPayment = false }
        }
      } else {
        this.noData = true
        this.loaded = false
      }
    }
    // if (this.$route.query.response_message && this.$route.query.response_message === 'Success') {
    //   // this.confirmBooking()
    //   // this.goTo('confirm')
    //   // console.log('confirm')
    //   this.submitConfirmation()
    //   this.openConfirmButton = true
    // } else if (this.$route.query.response_message) {
    //   this.snackbar = true
    //   this.color = 'error'
    //   this.text = this.$route.query.response_message
    // }
  },
  methods: {
    adventuresTotalPrice () {
      return this.$store.state.travellersNumber.totalPrice
    },
    adventuresTotalPricDetails () {
      return this.$store.state.travellersNumber.activitiesPrices
    },
    generateTravellersLabel () {
      let passengersLabel = `${this.store.passengers.adults} ${this.store.passengers.adults > 1 ? 'Adults' : 'Adult'}`
      if (this.store.passengers.children > 0) { passengersLabel += `, ${this.store.passengers.children} ${this.store.passengers.children > 1 ? 'Children' : 'Child'}` }
      if (this.store.passengers.infants > 0) { passengersLabel += ` and ${this.store.passengers.infants} ${this.store.passengers.infants > 1 ? 'Infants' : 'Infant'}` }
      return passengersLabel
    },
    goTo (phase) {
      // console.log(phase)
      switch (phase) {
        case 'travellers':
          this.travellersPhase = true
          this.paymentPhase = false
          document.title = 'travellers Details'
          break
        case 'payment':
          this.paymentPhase = true
          document.title = 'flight payment'
          break
        case 'confirm':
          this.confirmationPhase = true
          this.paymentPhase = true
          // document.title = 'flight done'
          break
        case 'packageDetails':
          this.confirmationPhase = true
          this.paymentPhase = true
          this.showTravellerData = false
          break
      }
    },
    backTo () {
      if (this.paymentPhase && this.travellersPhase) {
        this.paymentPhase = false
        document.title = 'travellers Details'
      } else if (!this.paymentPhase && this.travellersPhase) {
        this.travellersPhase = false
        document.title = 'flight Details'
      }
    },
    submitTravellersData (travellers, contactInfo) {
      this.travellersData = travellers
      this.contactInfo = contactInfo
      // this.book()
    },
    submitPayment () {
      this.book()
    },
    async book () {
      this.loading = true
      let body
      if (this.$route.params.module === 'trip') {
        const activitiesBody = this.packageActivities.activities.map((activity, index) => ({
          city_id: activity.city_id,
          type: activity.type,
          cruise_id: activity.cruise_id,
          days_number: activity.days_number,
          days: activity.days.map((day, dayIndex) => ({
            day_number: day.day_number,
            adventrues: day.days.map((adventure, adventureIndex) => ({
              adventrue_id: adventure.adventrue_id
            }))
          }))
        }))
        // check the request body for booking
        body = {
          passengerDetails: this.travellersData,
          bookingDetails: {
            contact_name: this.contactInfo.name,
            contact_phone: this.contactInfo.phone.formattedNumber,
            contact_email: this.contactInfo.email
          },
          start_date: this.packageStartDay,
          sessionId: this.$store.state.travellersNumber.priceSessionId,
          package_id: this.packageActivities.packageID,
          // total_price: this.packageTotalPrice,
          total_price: this.packageTotalPrice,
          final_price: this.packageTotalAllPrice,
          activities: activitiesBody,
          adults: this.numberOfPassenger.adults,
          children: this.numberOfPassenger.children,
          hotelIntCode: this.bookingIntCode,
          hotelLocator: this.bookingLocator,
          hotelJPCode: this.hotelJPCode,
          hotelStartDate: this.hotelStartDate,
          hotelEndDate: this.hotelEndDate,
          finalBookHotelFormData: this.finalBookHotelFormData,
          hotelIntCodes: this.bookingIntCodes,
          hotelLocators: this.bookingLocators,
          hotelJPCodes: this.hotelJPCodes,
          hotelStartDates: this.hotelStartDates,
          hotelEndDates: this.hotelEndDates,
          finalBookHotelsFormData: this.finalBookHotelsFormData,
          checkHasCruise: this.checkHasCruise
        }
      } else if (this.$route.params.module === 'adventure') {
        body = {
          contact_name: this.contactInfo.name,
          contact_email: this.contactInfo.email,
          contact_phone: this.contactInfo.phone.e164,
          passengerDetails: this.travellersData,
          solo: this.numberOfPassenger.solo,
          total_price: this.adventuresTotalPrice(),
          activities: this.$store.state.selectedAdventures,
          adults: this.numberOfPassenger.adults,
          children: this.numberOfPassenger.children
        }
      } else if (this.$route.params.module === 'cruise') {
        body = {
          contact_name: this.contactInfo.name,
          contact_email: this.contactInfo.email,
          contact_phone: this.contactInfo.phone.e164,
          passengerDetails: this.travellersData,
          session_id: this.$store.state.cruiseReserveData.session,
          start_date: this.$store.state.cruiseReserveData.start_date,
          end_date: this.$store.state.cruiseReserveData.end_date,
          // roomGuests: this.$store.state.cruiseRooms
          roomGuests: this.$store.state.cruiseReserveData.rooms
        }
      } else if (this.$route.params.module === 'hotel') {
        body = {
          passengerDetails: this.travellersData,
          bookingDetails: {
            contact_name: this.contactInfo.name,
            contact_phone: this.contactInfo.phone.formattedNumber,
            contact_email: this.contactInfo.email
          },
          start_date: this.packageStartDay,
          sessionId: this.$store.state.travellersNumber?.priceSessionId,
          package_id: this.packageActivities?.packageID,
          total_price: this.packageTotalPrice,
          final_price: this.packageTotalAllPrice,
          adults: this.numberOfPassenger.adults,
          children: this.numberOfPassenger.children,
          hotelIntCode: this.bookingIntCode,
          hotelLocator: this.bookingLocator,
          hotelJPCode: this.packageActivities.JPCode,
          hotelStartDate: this.hotelStartDate,
          hotelEndDate: this.hotelEndDate,
          finalBookHotelFormData: this.finalBookHotelFormData
        }
      }
      try {
        const form = document.getElementById('payment-form')
        // form.setAttribute('action', 'https://tanefer.nahrdev.com/payment')
        form.setAttribute('action', 'https://api.tanefer.com/payment')
        // form.insertAdjacentHTML('beforeend', `<input type="hidden" name="sessionId" value="${this.priceSessionId}">`)
        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="email" value="${this.contactInfo.email}">`)
        let bookingData = null
        if (this.$route.params.module === 'trip') {
          // await tripsServices.bookTrip(localStorage.getItem('bookingId'), body)
          const promise = tripsServices.saveTrip(body)
          const response = await promise
          bookingData = response.data.data
          // form.insertAdjacentHTML('beforeend', `<input type="hidden" name="price" value="${this.packagePrice}">`)
          // form.insertAdjacentHTML('beforeend', `<input type="hidden" name="url" value="${window.location.origin + '/bookig/trip'}">`)
          // form.insertAdjacentHTML('beforeend', `<input type="hidden" name="bookingId" value="${localStorage.getItem('bookingId')}">`)
          if (this.checkHasCruise === false) {
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="sessionId" value="${this.$store.state.travellersNumber.priceSessionId}">`)
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="price" value="${this.packageTotalPrice}">`)
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="final_price" value="${this.packageTotalPrice}">`)
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="url" value="${window.location.origin + '/booking/trip'}">`)
            form.insertAdjacentHTML('beforeend', `<input type="hidden" name="bookingId" value="${bookingData.booking_id}">`)
            form.submit()
          } else {
            const customTextMessage = bookingData.custom_text_message
            this.loading = false
            this.snackbar = true
            this.color = '#4f3316'
            this.text = customTextMessage
          }
        } else if (this.$route.params.module === 'adventure') {
          const promise = adventureServices.bookAdventure(body)
          const response = await promise
          bookingData = response.data.data
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="sessionId" value="${this.priceSessionId}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="bookingId" value="${bookingData.booking_id}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="price" value="${this.adventuresTotalPrice()}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="url" value="${window.location.origin + '/booking/adventure'}">`)
          form.submit()
        } else if (this.$route.params.module === 'cruise') {
          const promise = cruisesServices.bookCruise(this.$store.state.cruiseReserveData.cruiseId, body)
          const response = await promise
          bookingData = response.data.data
          const customTextMessage = bookingData.custom_text_message
          // form.insertAdjacentHTML('beforeend', `<input type="hidden" name="sessionId" value="${this.priceSessionId}">`)
          // form.insertAdjacentHTML('beforeend', `<input type="hidden" name="bookingId" value="${bookingData.booking_id}">`)
          // form.insertAdjacentHTML('beforeend', `<input type="hidden" name="price" value="${this.$store.state.cruiseReserveData.totalPrice}">`)
          // form.insertAdjacentHTML('beforeend', `<input type="hidden" name="url" value="${window.location.origin + '/booking/cruise'}">`)
          // form.submit()
          this.loading = false
          this.snackbar = true
          this.color = '#4f3316'
          // this.text = 'Cruise Booked Successfully so please wait for acceptance your booking from management and sent the acceptance to your email soon to pay online'
          this.text = customTextMessage
        } else if (this.$route.params.module === 'hotel') {
          const promise = hotelsServices.saveHotel(body)
          const response = await promise
          bookingData = response.data.data
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="sessionId" value="${this.$store.state.travellersNumber.priceSessionId}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="price" value="${this.packageTotalPrice}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="final_price" value="${this.packageTotalPrice}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="url" value="${window.location.origin + '/booking/hotel'}">`)
          form.insertAdjacentHTML('beforeend', `<input type="hidden" name="bookingId" value="${bookingData.booking_id}">`)
          form.submit()
        }
      } catch (error) {
        this.loading = false
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong please try again in few minutes'
      }
    },
    confirmBooking () {
      // ?amount=110000&response_code=14000&card_number=****************&card_holder_name=****&signature=365e3f128cd3229c8908fc2f3e2da63ea1b18b1b309652b5ee492e4e79cd0d7c&merchant_identifier=CwCfehEU&access_code=Xnx4srzFskSSrNGkxlr8&payment_option=VISA&expiry_date=****&customer_ip=**************&language=en&eci=ECOMMERCE&fort_id=169996200010637834&command=PURCHASE&merchant_extra=5&response_message=Success&merchant_reference=TANEFER-5805816523&authorization_code=736332&customer_email=***********************&currency=USD&status=14
      // console.log(window.location.href)
      const query = this.$route.fullPath.split('?')[1] + '&url=' + window.location.href
      tripsServices.confirmTripBooking(query)
    },
    submitConfirmation (goToText = 'confirm') {
      this.confirmBooking()
      this.goTo(goToText)
    },
    handleLinkClick (type) {
      // this.confirmationPhase = false
      // this.succesfullPayment = false

      // Dispatch an action to clear data in Vuex store
      // this.$store.dispatch('clearData')

      // Redirect to the home page
      // this.$router.push('/')
      // window.location.href = '/'

      this.confirmationPhase = false
      this.succesfullPayment = false
      setTimeout(() => {
        // this.$router.push('/adventures')
        if (type === 'home') {
          // this.$router.push('/')
          window.location.href = '/'
        } else {
          // this.$router.push('/adventures')
          window.location.href = '/adventures'
        }
      }, 1000) // Add a delay of 1 second (adjust as needed)
      // this.succesfullPayment = false
      // if (this.succesfullPayment === false) {
      //   this.$router.push('/adventures')
      // }
      // this.loadData().then(() => {
      //   if (type === 'home') {
      //     this.$router.push('/')
      //   } else {
      //     this.$router.push('/adventures')
      //   }
      // })
    },
    loadData () {
      return new Promise((resolve, reject) => {
        // Simulate an asynchronous data loading process
        setTimeout(() => {
          // Perform your data loading logic here
          this.confirmationPhase = false
          this.succesfullPayment = false
          // Once the data is loaded, call resolve()
          resolve()
        }, 2000) // Adjust the timeout as needed
      })
    },
    formatDate (date) {
      if (!date) { return null }
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const newDate = `${parseInt(day)} ${months[month - 1]} ${year}`
      return newDate
    },
    redirectPageTrips () {
      this.confirmationPhase = false
      this.succesfullPayment = false
      setTimeout(() => {
        window.location.href = '/trips'
      }, 1000)
    },
    redirectPageHotels () {
      this.confirmationPhase = false
      this.succesfullPayment = false
      setTimeout(() => {
        window.location.href = '/hotels'
      }, 1000)
    },
    openBookFlight () {
      window.open('https://flights.tanefer.com', '_blank')
    }
  }
}
</script>

  <style>
      .inactivePhase {
          border-bottom: 5px solid #e5e3e8;
      }
      .currentPhase {
          border-bottom: 5px solid #BD9468;
      }
      .summ {
          position: sticky;
          top: 0px;
      }
  </style>
