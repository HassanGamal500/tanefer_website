<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <LoadingScreen v-if="isLoading" />
    <v-img
      :src="packageDetails.packageImage ? packageDetails.packageImage : require(`~/assets/images/${getCityImage('')}`)"
      alt="img"
      class="image-fit"
      max-height="400"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          class="text-center"
          cols="12"
        >
          <h1
            :class="{
              'text-h1': $vuetify.breakpoint.mdAndUp,
              'text-h4': $vuetify.breakpoint.xs
            }"
            class="white--text font-weight-bold my-4 non-visiable"
            :style="{
              'line-height': $vuetify.breakpoint.mdAndUp ? '8rem' : '2rem'
            }"
          >
            {{ packageDetails.packageTitle }}
          </h1>
        </v-col>
      </v-row>
      <v-btn
        v-if="galleries.length > 0"
        rounded
        color="#4f3316"
        style="background-color: #4f3316;border: 1px solid #fff;color: #fff;"
        dark
        absolute
        right
        :disabled="galleries.length === 0"
        @click="openGallery"
      >
        <v-icon color="white">
          mdi-image-multiple
        </v-icon>
        Gallery
      </v-btn>
    </v-img>

    <v-container class="grey lighten-5" style="margin-top: -7rem;">
      <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        :color="color"
        top
      >
        {{ text }}

        <template #action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <div style="" class="px-0 my-2">
        <div class="package-overview-date">
          <v-card class="px-4 pt-7" style="border-radius: 15px;">
            <v-row>
              <v-col class="pa-1" cols="12" md="12">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-model="packageStartDayText"
                      label="Package Start Day"
                      prepend-inner-icon="mdi-calendar-range"
                      append-inner-icon="mdi-pencil"
                      readonly
                      outlined
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="packageStartDay"
                    :allowed-dates="allowedDates"
                    color="late"
                    @input="menu = false, formatDate(packageStartDay, 1, 'packageStartDay')"
                  />
                </v-menu>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </div>
      <div>
        <v-row>
          <v-col cols="12" md="8" class="order-last order-md-first order-sm-last order-xs-last">
            <div class="results ma-1">
              <v-stepper v-model="e1" color="#F6F6F6">
                <v-stepper-header>
                  <v-stepper-step
                    :complete="e1 > 1"
                    step="1"
                  >
                    Activity
                  </v-stepper-step>

                  <v-divider />

                  <v-stepper-step
                    :complete="e1 > 2"
                    step="2"
                  >
                    Acomidation
                  </v-stepper-step>

                  <v-divider />

                  <v-stepper-step step="3">
                    Trip Summary
                  </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content step="1">
                    <v-card
                      class="mb-12"
                    >
                      <p class="font-weight-bold" style="background-color: transparent;">
                        Trip Route
                      </p>
                      <div v-for="(activity, i) in packageDetails.activities" :key="i">
                        <v-expansion-panels v-model="panelExpandedActivities[i]" focusable class="mb-5">
                          <v-expansion-panel style="border-radius: 18px;">
                            <v-expansion-panel-header class="font-weight-bold text-h6 change-icon-style" style="border-radius: 8px;">
                              <v-row v-if="activity.type === 'adventure'" justify="center">
                                <v-col cols="12" lg="8" md="4" sm="4" xs="12">
                                  {{ activity.cityname }}
                                </v-col>
                                <v-col cols="12" lg="4" md="8" sm="8" xs="12">
                                  <span style="float: right;">
                                    <v-row class="align-center">
                                      <template v-if="activity.type !== 'cruise' && (packageDetails.activities[i + 1] ? packageDetails.activities[i + 1].type !== 'cruise' : true)">
                                        <v-col cols="auto" class="d-inline-flex align-center">
                                          <v-btn
                                            style="background-color: transparent; border: 1px solid #4f3316;"
                                            elevation="4"
                                            icon
                                            small
                                            class="d-none d-sm-flex"
                                            @click="changeDayNumber(i, '-1')"
                                          >
                                            <v-icon color="#4f3316">
                                              mdi-minus
                                            </v-icon>
                                          </v-btn>
                                          <v-btn
                                            style="background-color: transparent; border: 1px solid #4f3316; font-size: 0.8em;"
                                            elevation="4"
                                            icon
                                            small
                                            class="d-flex d-sm-none"
                                            @click="changeDayNumber(i, '-1')"
                                          >
                                            <v-icon color="#4f3316">
                                              mdi-minus
                                            </v-icon>
                                          </v-btn>
                                        </v-col>

                                        <v-col class="d-inline-flex align-center px-2">
                                          <span class="quantity text-center font-weight-bold" :style="{ fontSize: $vuetify.breakpoint.xsOnly ? '0.8em' : '1em' }">
                                            {{ activity.days_number }} days
                                          </span>
                                        </v-col>

                                        <v-col cols="auto" class="d-inline-flex align-center">
                                          <v-btn
                                            style="background-color: #4f3316;"
                                            color="#4f3316"
                                            elevation="4"
                                            icon
                                            small
                                            class="d-none d-sm-flex"
                                            @click="changeDayNumber(i, '1')"
                                          >
                                            <v-icon color="#FFF">
                                              mdi-plus
                                            </v-icon>
                                          </v-btn>
                                          <v-btn
                                            style="background-color: #4f3316; font-size: 0.8em;"
                                            color="#4f3316"
                                            elevation="4"
                                            icon
                                            small
                                            class="d-flex d-sm-none"
                                            @click="changeDayNumber(i, '1')"
                                          >
                                            <v-icon color="#FFF">
                                              mdi-plus
                                            </v-icon>
                                          </v-btn>
                                        </v-col>
                                      </template>
                                    </v-row>
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
                                    <v-row>
                                      <v-col cols="12">
                                        Day <span v-if="day.start_day !== null"> {{ day.start_day }}</span> <span v-if="packageStartDay !== null" class="ml-4 mp-3">{{ day.start_text_day }}</span>
                                        <v-btn
                                          text
                                          color="white"
                                          style="background-color: transparent;border: 1px solid #fff;color: #fff;"
                                          elevation="4"
                                          icon
                                          small
                                          absolute
                                          right
                                          class="float-right"
                                          @click="addNewAdventureToActivity(i, x, activity.city_id, day.start_format_day, day.days)"
                                        >
                                          <v-icon color="white">
                                            mdi-plus
                                          </v-icon>
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                  </v-card-title>
                                  <v-card-text class="pt-4">
                                    <v-row>
                                      <v-col cols="12">
                                        <div v-if="day.days.length > 0">
                                          <div v-for="(adventures, adventureIndex) in day.days" :key="adventureIndex">
                                            <div v-if="adventures.adventrue">
                                              <v-row>
                                                <v-col cols="10">
                                                  <p class="activity-title">
                                                    {{ adventures.adventrue.activityTitle }}
                                                  </p>
                                                </v-col>
                                                <v-col cols="2">
                                                  <v-menu offset-y>
                                                    <template #activator="{ on, attrs }">
                                                      <v-btn
                                                        color="#4f3316"
                                                        icon
                                                        v-bind="attrs"
                                                        v-on="on"
                                                      >
                                                        <v-icon>mdi-dots-horizontal</v-icon>
                                                      </v-btn>
                                                    </template>
                                                    <v-list>
                                                      <v-list-item
                                                        v-for="(item, index) in items"
                                                        :key="index"
                                                        link
                                                      >
                                                        <v-list-item-title @click="itemAction(item.action, activity.city_id, i, x, adventureIndex, adventures.adventrue)">
                                                          {{ item.title }}
                                                        </v-list-item-title>
                                                      </v-list-item>
                                                    </v-list>
                                                  </v-menu>
                                                </v-col>
                                              </v-row>
                                            </div>
                                            <v-divider class="my-2" />
                                          </div>
                                        </div>
                                        <div v-else>
                                          <h4>You Have Free Time</h4>
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
                                            <v-col cols="10" :md="cruise.master_image ? 2 : 10">
                                              <div class="cruise-result-trip justify-space-between pt-4">
                                                <v-btn
                                                  color="secondary"
                                                  @click="viewCruiseDetails(cruise)"
                                                >
                                                  view
                                                </v-btn>
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
                    </v-card>

                    <v-btn
                      color="primary"
                      :disabled="!isButtonEnabled"
                      @click="checkPackageDateIsExist"
                    >
                      Next
                    </v-btn>
                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <!-- Hotel Cards -->
                    <div v-if="!confirmedSelectedRoom && !showInfoOfRooms">
                      <v-card
                        v-if="showHotelCards"
                        class="mb-12"
                      >
                        <!-- Main Hotel Loop -->
                        <v-row v-for="(hotel, h) in listGtaHotelDetails" :key="h" class="mb-6">
                          <!-- Hotel Image -->
                          <v-col cols="12" class="mb-2">
                            <p class="font-weight-bold late--text text-h6">
                              Our Top Pick For:  <span class="late--text"> {{ hotel.city_name || 'City Name' }} City</span>
                            </p>
                          </v-col>
                          <v-col cols="12" md="4" class="p-0">
                            <v-img
                              :src="hotel.Images?.Image[1]?.Type === 'BIG' ? hotel.Images?.Image[1]?.FileName : hotel.Images?.Image[2]?.FileName"
                              alt="Hotel Image"
                              style="width: 100%; height: 260px; object-fit: cover;"
                              class="rounded-lg"
                            />
                          </v-col>

                          <!-- Hotel Content -->
                          <v-col cols="12" md="8" class="pt-0 pl-md-4">
                            <!-- Hotel Name and Change Hotel Button on the Same Line -->
                            <div class="d-flex justify-space-between align-center mb-1">
                              <div>
                                <h4 class="mb-0 font-weight-bold">
                                  {{ hotel.HotelName || 'Hotel Name' }}
                                </h4>
                                <v-icon color="red" class="mr-1">
                                  mdi-map-marker
                                </v-icon>
                                <span class="grey--text text-caption">{{ hotel.Address?.Address || 'City Name' }}</span>
                              </div>

                              <!-- Change Hotel Button -->
                              <v-btn small class="v-btn-brown" @click="showHotels(h)">
                                Change Hotel
                              </v-btn>
                            </div>

                            <!-- Rating -->
                            <v-rating
                              :value="getRatingFromCategory(hotel.HotelCategory._)"
                              dense
                              readonly
                            />
                            <div class="my-3">
                              <v-btn small outlined color="brown" @click="showHotelDetailsObject(hotel.Code)">
                                Info
                              </v-btn>
                            </div>
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-menu v-model="menuStartDates[h]" :close-on-content-click="false">
                                  <template #activator="{ on }">
                                    <v-text-field
                                      :value="hotelStartDatesText[h] || todayFormatted"
                                      label="Start Date"
                                      prepend-inner-icon="mdi-calendar"
                                      outlined
                                      readonly
                                      v-on="on"
                                    />
                                  </template>
                                  <v-date-picker
                                    v-model="hotelStartDates[h]"
                                    :min="packageStartDay"
                                    color="late"
                                    @input="menuStartDates[h] = false; handleStartDateChange(h); formatDate(hotelStartDates[h], 1, 'hotelStartDate', h)"
                                  />
                                </v-menu>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-menu v-model="menuEndDates[h]" :close-on-content-click="false">
                                  <template #activator="{ on }">
                                    <v-text-field
                                      :value="hotelEndDatesText[h] || endDateFormatted"
                                      label="End Date"
                                      prepend-inner-icon="mdi-calendar"
                                      outlined
                                      readonly
                                      v-on="on"
                                    />
                                  </template>
                                  <v-date-picker
                                    v-model="hotelEndDates[h]"
                                    :min="minEndDate[h] || packageStartDay"
                                    color="late"
                                    @input="menuEndDates[h] = false; formatDate(hotelEndDates[h], 1, 'hotelEndDate', h)"
                                  />
                                </v-menu>
                              </v-col>
                            </v-row>
                            <div class="d-flex justify-space-between align-center mt-3">
                              <v-btn
                                class="white--text text-capitalize v-btn-brown"
                                color="primary"
                                elevation="6"
                                x-large
                                block
                                raised
                                rounded-lg
                                @click="checkHotelAvailabilityByHotel(hotel, h)"
                              >
                                Check Availability
                              </v-btn>
                            </div>
                            <p class="mt-1 text-caption grey--text">
                              *Please select occupancy and dates before checking availability
                            </p>
                          </v-col>
                          <v-col cols="12" md="12">
                            <v-expand-transition>
                              <v-card v-if="singleHotelData.index === h && isAvailables[h] && getRoomOptions(singleHotelData?.data?.HotelOptions?.HotelOption)?.length" width="100%" class="mt-2" elevation="2">
                                <v-card-text>
                                  <v-row
                                    v-for="(roomOption, index) in getRoomOptions(singleHotelData?.data?.HotelOptions?.HotelOption)"
                                    :key="index"
                                    class="room-card mb-3"
                                  >
                                    <v-col cols="12">
                                      <v-row justify="space-between">
                                        <v-col cols="12" md="6">
                                          <h5 class="mb-0 brown--text text-decoration-underline">
                                            {{ roomOption.HotelRooms?.HotelRoom?.Name || 'Room Name Not Available' }}
                                          </h5>
                                        </v-col>
                                        <v-col cols="12" md="6" class="text-right">
                                          <p class="mr-3 font-weight-bold text-subtitle-1">
                                            $ {{ roomOption.Prices?.Price?.TotalFixAmounts?.Gross || 'Price not available' }}
                                          </p>
                                        </v-col>
                                      </v-row>

                                      <v-row class="d-flex align-center justify-space-between mt-2" no-gutters>
                                        <v-col cols="4">
                                          <p class="mb-0 font-weight-medium">
                                            <span class="grey--text">
                                              {{ roomOption.Board?._ || 'Board not available' }}
                                            </span>
                                          </p>
                                        </v-col>
                                        <v-col cols="4" class="d-flex align-start">
                                          <v-btn
                                            small
                                            text
                                            :color="isNonRefundable(index) ? 'red' : 'green'"
                                            class="text-decoration-underline"
                                            @click="toggleCancellationPolicy(index)"
                                          >
                                            {{ isNonRefundable(index) ? 'Non-refundable' : 'Cancellation Available' }}
                                            <v-icon small class="ml-1">
                                              {{ showFullCancellationPolicy[index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                            </v-icon>
                                          </v-btn>
                                        </v-col>
                                        <v-col cols="4" class="d-flex justify-end">
                                          <v-btn
                                            small
                                            class="mr-2 px-2 py-4 no-wrap v-btn-brown"
                                            :disabled="isRoomSelected[h]?.[index]"
                                            @click="selectRoomHotelGta(h, index)"
                                          >
                                            Select Room
                                          </v-btn>
                                        </v-col>
                                      </v-row>

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
                            </v-expand-transition>
                          </v-col>
                        </v-row>
                      </v-card>
                      <v-card
                        class="mb-12"
                      >
                        <div v-if="!showHotelCards && confirmedSelectedRoom">
                          <div v-for="(gta, g) in selectedRoomGtaArray" :key="g" class="selected-room-card">
                            <v-row class="bordered-room" style="padding: 10px; margin: 10px 0; border-radius: 12px;">
                              <v-col cols="12" md="12">
                                <div>
                                  <h4 class="font-weight-bold late--text mb-2">
                                    Your Rooms Selection
                                  </h4>

                                  <!-- Board Information -->
                                  <v-row class="mb-1 d-flex align-start">
                                    <v-col cols="12" class="d-flex align-start">
                                      <v-icon color="brown" class="mr-1">
                                        mdi-food
                                      </v-icon>
                                      <span class="text-h6 font-weight-medium brown--text">{{ gta.Board._ || 'Not Specified' }}</span>
                                    </v-col>
                                  </v-row>

                                  <!-- Hotel Offer -->
                                  <v-row v-if="gta.AdditionalElements && gta.AdditionalElements.HotelOffers" class="mb-1 d-flex align-start">
                                    <v-col cols="12" class="d-flex align-start">
                                      <v-icon color="blue" class="mr-1">
                                        mdi-tag
                                      </v-icon>
                                      <span class="font-weight-medium">{{ gta.AdditionalElements.HotelOffers.HotelOffer.Name }}</span>
                                    </v-col>
                                  </v-row>

                                  <!-- Hotel Rooms -->
                                  <v-row class="mb-1 d-flex align-start">
                                    <v-col cols="12" class="d-flex align-start">
                                      <v-icon color="brown" class="mr-1">
                                        mdi-bed
                                      </v-icon>
                                      <div class="ml-2">
                                        <template v-if="Array.isArray(gta.HotelRooms.HotelRoom)">
                                          <span v-for="(room, r) in gta.HotelRooms.HotelRoom" :key="r" class="font-weight-medium">
                                            {{ room.Name }} - Adults: {{ room.RoomOccupancy?.Adults || 0 }} Children: {{ room.RoomOccupancy?.Children || 0 }}
                                          </span>
                                        </template>
                                        <template v-else>
                                          <span class="font-weight-medium">
                                            {{ gta.HotelRooms.HotelRoom.Name }} - Adults: {{ gta.HotelRooms.HotelRoom.RoomOccupancy?.Adults || 0 }} Children: {{ gta.HotelRooms.HotelRoom.RoomOccupancy?.Children || 0 }}
                                          </span>
                                        </template>
                                      </div>
                                    </v-col>
                                  </v-row>

                                  <!-- Prices -->
                                  <v-row class="mb-1 d-flex align-start">
                                    <v-col cols="12" class="d-flex align-start">
                                      <v-icon color="green" class="mr-1">
                                        mdi-currency-usd
                                      </v-icon>
                                      <span class="font-weight-medium">{{ gta.Prices.Price.TotalFixAmounts.Nett }} {{ gta.Prices.Price.Currency }}</span>
                                    </v-col>
                                  </v-row>
                                </div>
                              </v-col>
                            </v-row>
                          </div>
                        </div>
                      </v-card>
                    </div>
                    <v-card
                      class="mb-12"
                    >
                      <div v-if="showInfoOfRooms && !confirmedSelectedRoom">
                        <div v-for="(roomsArray, hotelIndex) in selectedRoomGtaArray" :key="hotelIndex" class="selected-room-card">
                          <h4 class="font-weight-bold late--text mb-3">
                            Your Room Selection for Hotel {{ hotelIndex + 1 }}
                          </h4>

                          <!-- Check if roomsArray is undefined or empty and display "None" -->
                          <div v-if="!roomsArray || roomsArray.length === 0" class="font-weight-medium grey--text">
                            None
                          </div>

                          <!-- If roomsArray is defined and not empty, display room details -->
                          <div v-else>
                            <div v-for="(gta, roomIndex) in roomsArray" :key="roomIndex" class="bordered-room" style="padding: 10px; margin: 10px 0; border-radius: 12px;">
                              <v-row>
                                <v-col cols="12" md="12">
                                  <!-- Board Information -->
                                  <v-row class="mb-1 d-flex align-start">
                                    <v-col cols="12" class="d-flex align-start">
                                      <v-icon color="brown" class="mr-1">
                                        mdi-food
                                      </v-icon>
                                      <span class="text-h6 font-weight-medium brown--text">{{ gta.Board?._ || 'Not Specified' }}</span>
                                    </v-col>
                                  </v-row>

                                  <!-- Hotel Rooms -->
                                  <v-row class="mb-1 d-flex align-start">
                                    <v-col cols="12" class="d-flex align-start">
                                      <v-icon color="brown" class="mr-1">
                                        mdi-bed
                                      </v-icon>
                                      <div class="ml-2">
                                        <template v-if="Array.isArray(gta.HotelRooms.HotelRoom)">
                                          <span v-for="(room, r) in gta.HotelRooms.HotelRoom" :key="r" class="font-weight-medium">
                                            {{ room.Name }} - Adults: {{ room.RoomOccupancy?.Adults || 0 }} Children: {{ room.RoomOccupancy?.Children || 0 }}
                                          </span>
                                        </template>
                                        <template v-else>
                                          <span class="font-weight-medium">
                                            {{ gta.HotelRooms.HotelRoom.Name }} - Adults: {{ gta.HotelRooms.HotelRoom.RoomOccupancy?.Adults || 0 }} Children: {{ gta.HotelRooms.HotelRoom.RoomOccupancy?.Children || 0 }}
                                          </span>
                                        </template>
                                      </div>
                                    </v-col>
                                  </v-row>

                                  <!-- Prices -->
                                  <v-row class="mb-1 d-flex align-start">
                                    <v-col cols="12" class="d-flex align-start">
                                      <v-icon color="green" class="mr-1">
                                        mdi-currency-usd
                                      </v-icon>
                                      <span class="font-weight-medium">{{ gta.Prices?.Price?.TotalFixAmounts?.Nett || 'N/A' }} {{ gta.Prices?.Price?.Currency || '' }}</span>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </div>
                          </div>
                        </div>
                      </div>

                      <v-row class="">
                        <v-col cols="12" md="12">
                          <v-btn
                            v-if="e1 === 2 && !confirmedSelectedRoom && !showInfoOfRooms"
                            class="white--text v-btn-brown"
                            elevation="6"
                            large
                            block
                            raised
                            :disabled="(getRatePlanCodeArray.length === 0 && getRatePlanCodes.length === 0) || confirmedSelectedRoom"
                            @click="toggleRoomDetails"
                          >
                            <span>Proceed with Room(s) Selection</span>
                          </v-btn>
                          <v-btn
                            v-if="e1 === 2 && !confirmedSelectedRoom && showInfoOfRooms"
                            class="v-btn-brown"
                            elevation="6"
                            large
                            block
                            raised
                            :disabled="(getRatePlanCodeArray.length === 0 && getRatePlanCodes.length === 0) || confirmedSelectedRoom"
                            @click="confirmSelectedRoom"
                          >
                            <span v-if="getRatePlanCodeArray.length === 0 || getRatePlanCodes.length === 0">Confirm Selected Rooms</span>
                            <span v-else>Confirmed Successfully</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                    <v-card
                      class="mb-12"
                    >
                      <div v-if="confirmedSelectedRoom">
                        <div v-for="(roomsArray, hotelIndex) in selectedRoomGtaArray" :key="hotelIndex" class="selected-room-card">
                          <h4 class="font-weight-bold late--text mb-3">
                            Your Room Selection for Hotel {{ hotelIndex + 1 }}
                          </h4>
                          <div v-if="!roomsArray || roomsArray.length === 0" class="font-weight-medium grey--text">
                            None
                          </div>
                          <div v-else>
                            <div v-for="(gta, roomIndex) in roomsArray" :key="roomIndex" class="bordered-room" style="padding: 10px; margin: 10px 0; border-radius: 12px;">
                              <v-row>
                                <v-col cols="12" md="12">
                                  <v-row class="mb-1 d-flex align-start">
                                    <v-col cols="12" class="d-flex align-start">
                                      <v-icon color="brown" class="mr-1">
                                        mdi-food
                                      </v-icon>
                                      <span class="text-h6 font-weight-medium brown--text">{{ gta.Board?._ || 'Not Specified' }}</span>
                                    </v-col>
                                  </v-row>
                                  <v-row class="mb-1 d-flex align-start">
                                    <v-col cols="12" class="d-flex align-start">
                                      <v-icon color="brown" class="mr-1">
                                        mdi-bed
                                      </v-icon>
                                      <div class="ml-2">
                                        <template v-if="Array.isArray(gta.HotelRooms.HotelRoom)">
                                          <span v-for="(room, r) in gta.HotelRooms.HotelRoom" :key="r" class="font-weight-medium">
                                            {{ room.Name }} - Adults: {{ room.RoomOccupancy?.Adults || 0 }} Children: {{ room.RoomOccupancy?.Children || 0 }}
                                          </span>
                                        </template>
                                        <template v-else>
                                          <span class="font-weight-medium">
                                            {{ gta.HotelRooms.HotelRoom.Name }} - Adults: {{ gta.HotelRooms.HotelRoom.RoomOccupancy?.Adults || 0 }} Children: {{ gta.HotelRooms.HotelRoom.RoomOccupancy?.Children || 0 }}
                                          </span>
                                        </template>
                                      </div>
                                    </v-col>
                                  </v-row>
                                  <v-row class="mb-1 d-flex align-start">
                                    <v-col cols="12" class="d-flex align-start">
                                      <v-icon color="green" class="mr-1">
                                        mdi-currency-usd
                                      </v-icon>
                                      <span class="font-weight-medium">{{ gta.Prices?.Price?.TotalFixAmounts?.Nett || 'N/A' }} {{ gta.Prices?.Price?.Currency || '' }}</span>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </div>
                          </div>
                        </div>
                        <v-row class="pa-3">
                          <v-col cols="12" md="12">
                            <div>
                              <v-form ref="form" v-model="travellersFormValid">
                                <p class="body-1 font-weight-bold text-h5 mb-4">
                                  Booking Holder Information
                                </p>
                                <v-card class="pa-3 mb-5">
                                  <v-row>
                                    <v-col cols="4" md="2">
                                      <v-combobox
                                        v-model="title"
                                        :items="['Mr', 'Mrs', 'Ms', 'Miss']"
                                        :search-input.sync="search"
                                        label="Title"
                                        outlined
                                        :rules="requiredRule"
                                        class="rounded-lg"
                                        color="blue"
                                      />
                                    </v-col>
                                    <v-col cols="8" md="6">
                                      <v-text-field
                                        v-model="name"
                                        outlined
                                        :rules="[v => (!!v && v.length > 2) || 'Full Name (min 3 characters)', v => /^[_A-z]*((-|\s)*[_A-z])*$/.test(v) || 'Only letters allowed']"
                                        label="Full Name"
                                        required
                                        color="blue"
                                        class="rounded-lg"
                                      />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                      <v-text-field
                                        v-model="surname"
                                        outlined
                                        :rules="[v => (!!v && v.length > 2) || 'Surname (min 3 characters)', v => /^[_A-z]*((-|\s)*[_A-z])*$/.test(v) || 'Only letters allowed']"
                                        label="Surname"
                                        required
                                        color="blue"
                                        class="rounded-lg"
                                      />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                      <mobile-input @update="assignPhone" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                      <v-text-field
                                        v-model="email"
                                        outlined
                                        :rules="emailRules"
                                        label="Email"
                                        required
                                        color="blue"
                                        class="rounded-lg"
                                      />
                                    </v-col>
                                    <v-col cols="6" md="3">
                                      <v-text-field
                                        v-model="age"
                                        outlined
                                        label="Age"
                                        required
                                        color="blue"
                                        class="rounded-lg"
                                      />
                                    </v-col>
                                    <v-col cols="6" md="4">
                                      <v-text-field
                                        v-model="identification_document_pax"
                                        outlined
                                        label="Identification Document"
                                        required
                                        color="blue"
                                        class="rounded-lg"
                                      />
                                    </v-col>
                                    <v-col cols="6" md="5">
                                      <v-autocomplete
                                        v-model="issueCountry"
                                        :rules="[() => !!issueCountry || 'This field is required']"
                                        :items="countries"
                                        item-text="name"
                                        item-value="code"
                                        label="Issuing Country"
                                        outlined
                                        hide-no-data
                                        color="blue"
                                        class="rounded-lg"
                                      />
                                    </v-col>
                                  </v-row>
                                </v-card>
                              </v-form>
                            </div>
                          </v-col>
                          <div v-for="(traveller, t) in otherTravellers" :key="t">
                            <v-col cols="12" md="12">
                              <div class="cruise-result-trip justify-space-between">
                                <v-form ref="form" v-model="travellersFormValids">
                                  <p class="body-1 font-weight-bold text-h5">
                                    Traveller ({{ traveller.id }}) Information
                                  </p>
                                  <v-card class="pa-9 mb-5 rounded-xl" elevation="6">
                                    <v-row>
                                      <v-col class="py-0" cols="12" sm="12" md="12">
                                        <v-text-field
                                          v-model="bNames[t]"
                                          outlined
                                          :rules="[v => (!!v && v.length > 2) || 'Full Name is required at least 3 characters', v => /^[_A-z]*((-|\s)*[_A-z])*$/.test(v) || 'Name Must be letters only with no spaces']"
                                          label="Full Name"
                                          required
                                          color="blue"
                                          class="rounded-lg"
                                        />
                                      </v-col>
                                      <v-col class="py-0" cols="12" sm="6" md="6">
                                        <v-text-field
                                          v-model="bSurnames[t]"
                                          outlined
                                          :rules="[v => (!!v && v.length > 2) || 'Surname is required at least 3 characters', v => /^[_A-z]*((-|\s)*[_A-z])*$/.test(v) || 'Surname Must be letters only with no spaces']"
                                          label="Surname"
                                          required
                                          color="blue"
                                          class="rounded-lg"
                                        />
                                      </v-col>
                                      <v-col class="py-0" cols="12" sm="6" md="6">
                                        <v-text-field
                                          v-model="bAges[t]"
                                          outlined
                                          label="Age"
                                          required
                                          color="blue"
                                          class="rounded-lg"
                                        />
                                      </v-col>
                                    </v-row>
                                  </v-card>
                                </v-form>
                              </div>
                            </v-col>
                          </div>
                          <div v-for="(children, c) in otherChildren" :key="c">
                            <v-col cols="12" md="12">
                              <div class="cruise-result-trip justify-space-between">
                                <v-form ref="form" v-model="travellersFormValids">
                                  <p class="body-1 font-weight-bold text-h5">
                                    Children ({{ children.id }}) Information
                                  </p>
                                  <v-card class="pa-9 mb-5 rounded-xl" elevation="6">
                                    <v-row>
                                      <v-col class="py-0" cols="12" sm="12" md="12">
                                        <v-text-field
                                          v-model="bNamesChild[c]"
                                          outlined
                                          :rules="[v => (!!v && v.length > 2) || 'Full Name is required at least 3 characters', v => /^[_A-z]*((-|\s)*[_A-z])*$/.test(v) || 'Name Must be letters only with no spaces']"
                                          label="Full Name"
                                          required
                                          color="blue"
                                          class="rounded-lg"
                                        />
                                      </v-col>
                                      <v-col class="py-0" cols="12" sm="6" md="6">
                                        <v-text-field
                                          v-model="bSurnamesChild[c]"
                                          outlined
                                          :rules="[v => (!!v && v.length > 2) || 'Surname is required at least 3 characters', v => /^[_A-z]*((-|\s)*[_A-z])*$/.test(v) || 'Surname Must be letters only with no spaces']"
                                          label="Surname"
                                          required
                                          color="blue"
                                          class="rounded-lg"
                                        />
                                      </v-col>
                                      <v-col class="py-0" cols="12" sm="6" md="6">
                                        <v-text-field
                                          v-model="bAgesChild[c]"
                                          outlined
                                          label="Age"
                                          required
                                          color="blue"
                                          class="rounded-lg"
                                          :rules="[
                                            v => (v <= 17 || v === null || v === '') || 'Age must not exceed 17'
                                          ]"
                                        />
                                      </v-col>
                                    </v-row>
                                  </v-card>
                                </v-form>
                              </div>
                            </v-col>
                          </div>
                          <v-col>
                            <v-btn
                              v-if="e1 === 2"
                              class="v-btn-brown"
                              elevation="6"
                              large
                              block
                              raised
                              :disabled="!isButtonEnabledFormValidation || isBooked"
                              @click="finalBookHotel"
                            >
                              <span v-if="!isBooked">Book Hotel</span>
                              <span v-else>Booked Successfully</span>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </div>
                    </v-card>
                    <v-btn
                      class="btn-latte"
                      @click="e1 = 1"
                    >
                      Back
                    </v-btn>
                    <v-btn
                      class="btn-beige"
                      @click="checkTheStepCurrent"
                    >
                      Proceed With Booking
                    </v-btn>
                  </v-stepper-content>

                  <v-stepper-content step="3">
                    <v-card
                      class="mb-12"
                      color="grey lighten-1"
                      height="200px"
                    />

                    <v-btn
                      color="warning"
                      @click="e1 = 2"
                    >
                      Back
                    </v-btn>

                    <v-btn text>
                      Cancel
                    </v-btn>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="order-first order-md-last order-sm-first order-xs-first">
            <div style="position: sticky;top: 1rem;z-index: 2;">
              <v-card v-if="e1 === 1" class="" style="border-radius: 15px;">
                <div v-if="checkHasCruise">
                  <v-card-text>
                    <p class="no-of-guests black--text" color="black">
                      Number of guests
                    </p>
                    <p class="font-weight-bold">
                      Rooms
                      <span style="float: right;">
                        <v-btn
                          style="background-color: transparent; border: 1px solid #4f3316;"
                          elevation="4"
                          icon
                          small
                          @click="changeCounterRoom(0, 'rooms', -1)"
                        >
                          <v-icon color="#4f3316">
                            mdi-minus
                          </v-icon>
                        </v-btn>

                        <span class="quantity px-2 font-weight-bold">{{ room_count }}</span>

                        <v-btn
                          style="background-color: #4f3316;"
                          color="#4f3316"
                          elevation="4"
                          icon
                          small
                          @click="changeCounterRoom(0, 'rooms', 1)"
                        >
                          <v-icon color="#FFF">
                            mdi-plus
                          </v-icon>
                        </v-btn>
                      </span>
                    </p>
                    <v-divider class="my-2" />
                    <p v-for="(room, index) in rooms" :key="index" class="font-weight-bold">
                      Room {{ index + 1 }}
                      <v-card class="" style="border-radius: 15px;">
                        <v-card-text>
                          <p class="font-weight-bold">
                            Adults
                            <span style="float: right;">
                              <v-btn
                                style="background-color: transparent; border: 1px solid #4f3316;"
                                elevation="4"
                                icon
                                small
                                @click="changeCounterRoom(index, 'travelers', -1)"
                              >
                                <v-icon color="#4f3316">
                                  mdi-minus
                                </v-icon>
                              </v-btn>

                              <span class="quantity px-2 font-weight-bold">{{ room.travelers }}</span>

                              <v-btn
                                style="background-color: #4f3316;"
                                color="#4f3316"
                                elevation="4"
                                icon
                                small
                                @click="changeCounterRoom(index, 'travelers', 1)"
                              >
                                <v-icon color="#FFF">
                                  mdi-plus
                                </v-icon>
                              </v-btn>
                            </span>
                          </p>
                          <v-divider class="my-2" />
                          <p class="font-weight-bold">
                            Children
                            <span style="float: right;">
                              <v-btn
                                style="background-color: transparent; border: 1px solid #4f3316;"
                                elevation="4"
                                icon
                                small
                                @click="changeCounterRoom(index, 'children', -1)"
                              >
                                <v-icon color="#4f3316">
                                  mdi-minus
                                </v-icon>
                              </v-btn>

                              <span class="quantity px-2 font-weight-bold">{{ room.children }}</span>

                              <v-btn
                                style="background-color: #4f3316;"
                                color="#4f3316"
                                elevation="4"
                                icon
                                small
                                @click="changeCounterRoom(index, 'children', 1)"
                              >
                                <v-icon color="#FFF">
                                  mdi-plus
                                </v-icon>
                              </v-btn>
                            </span>
                          </p>
                          <div v-if="room.ageSelects.length > 0">
                            Children's Ages
                            <v-row>
                              <v-col v-for="(ageSelect, childIndex) in room.ageSelects" :key="childIndex" cols="4">
                                <v-select
                                  v-model="ageSelect.age"
                                  :items="ages"
                                  required
                                  :error-messages="getRoomAgeSelectErrorMessages(index, childIndex)"
                                  label="0"
                                  persistent-hint
                                  return-object
                                  single-line
                                  dense
                                  outlined
                                  @change="onChangeSelectAge($event)"
                                />
                              </v-col>
                            </v-row>
                          </div>
                          <v-divider class="my-2" />
                        </v-card-text>
                      </v-card>
                    </p>
                    <v-card v-if="false" class="" style="border-radius: 15px;">
                      <v-card-text>
                        <p class="font-weight-bold">
                          Adults
                          <span style="float: right;">
                            <v-btn
                              style="background-color: transparent; border: 1px solid #4f3316;"
                              elevation="4"
                              icon
                              small
                              @click="changeCounterAdult('-1')"
                            >
                              <v-icon color="#4f3316">
                                mdi-minus
                              </v-icon>
                            </v-btn>

                            <span class="quantity px-2 font-weight-bold">{{ travellers }}</span>

                            <v-btn
                              style="background-color: #4f3316;"
                              color="#4f3316"
                              elevation="4"
                              icon
                              small
                              @click="changeCounterAdult('1')"
                            >
                              <v-icon color="#FFF">
                                mdi-plus
                              </v-icon>
                            </v-btn>
                          </span>
                        </p>
                        <v-divider class="my-2" />
                        <p class="font-weight-bold">
                          Children
                          <span style="float: right;">
                            <v-btn
                              style="background-color: transparent; border: 1px solid #4f3316;"
                              elevation="4"
                              icon
                              small
                              @click="changeCounterChild('-1')"
                            >
                              <v-icon color="#4f3316">
                                mdi-minus
                              </v-icon>
                            </v-btn>

                            <span class="quantity px-2 font-weight-bold">{{ children }}</span>

                            <v-btn
                              style="background-color: #4f3316;"
                              color="#4f3316"
                              elevation="4"
                              icon
                              small
                              @click="changeCounterChild('1')"
                            >
                              <v-icon color="#FFF">
                                mdi-plus
                              </v-icon>
                            </v-btn>
                          </span>
                        </p>
                        <div v-if="ageSelects.length > 0">
                          Children's Ages
                          <v-row>
                            <v-col v-for="(ageSelect, index) in ageSelects" :key="index" cols="4">
                              <v-select
                                v-model="ageSelect.age"
                                :items="ages"
                                required
                                :error-messages="getAgeSelectErrorMessages(index)"
                                label="0"
                                persistent-hint
                                return-object
                                single-line
                                dense
                                outlined
                              />
                            </v-col>
                          </v-row>
                        </div>
                      </v-card-text>
                    </v-card>
                    <v-divider class="my-2" />
                    <p class="font-weight-bold">
                      Initial Price
                      <span style="float: right;">
                        <span class="quantity px-2 font-weight-bold">$ {{ initialPrice }}</span>
                      </span>
                    </p>
                  </v-card-text>
                </div>
                <div v-else>
                  <v-card-text>
                    <p class="no-of-guests black--text" color="black">
                      Number of guests
                    </p>
                    <p class="font-weight-bold">
                      Adults
                      <span style="float: right;">
                        <v-btn
                          style="background-color: transparent; border: 1px solid #4f3316;"
                          elevation="4"
                          icon
                          small
                          @click="changeCounterAdult('-1')"
                        >
                          <v-icon color="#4f3316">
                            mdi-minus
                          </v-icon>
                        </v-btn>

                        <span class="quantity px-2 font-weight-bold">{{ travellers }}</span>

                        <v-btn
                          style="background-color: #4f3316;"
                          color="#4f3316"
                          elevation="4"
                          icon
                          small
                          @click="changeCounterAdult('1')"
                        >
                          <v-icon color="#FFF">
                            mdi-plus
                          </v-icon>
                        </v-btn>
                      </span>
                    </p>
                    <v-divider class="my-2" />
                    <p class="font-weight-bold">
                      Children
                      <span style="float: right;">
                        <v-btn
                          style="background-color: transparent; border: 1px solid #4f3316;"
                          elevation="4"
                          icon
                          small
                          @click="changeCounterChild('-1')"
                        >
                          <v-icon color="#4f3316">
                            mdi-minus
                          </v-icon>
                        </v-btn>

                        <span class="quantity px-2 font-weight-bold">{{ children }}</span>

                        <v-btn
                          style="background-color: #4f3316;"
                          color="#4f3316"
                          elevation="4"
                          icon
                          small
                          @click="changeCounterChild('1')"
                        >
                          <v-icon color="#FFF">
                            mdi-plus
                          </v-icon>
                        </v-btn>
                      </span>
                    </p>
                    <div v-if="ageSelects.length > 0">
                      Children's Ages
                      <v-row>
                        <v-col v-for="(ageSelect, index) in ageSelects" :key="index" cols="4">
                          <v-select
                            v-model="ageSelect.age"
                            :items="ages"
                            required
                            :error-messages="getAgeSelectErrorMessages(index)"
                            label="0"
                            persistent-hint
                            return-object
                            single-line
                            dense
                            outlined
                            @change="onChangeSelectAge($event)"
                          />
                        </v-col>
                      </v-row>
                    </div>
                    <v-divider class="my-2" />
                    <p class="font-weight-bold">
                      Initial Price
                      <span style="float: right;">
                        <span class="quantity px-2 font-weight-bold">$ {{ initialPrice }}</span>
                      </span>
                    </p>
                  </v-card-text>
                </div>
              </v-card>
              <v-card v-if="e1 === 2" class="" style="border-radius: 15px;">
                <v-card-text>
                  <p class="no-of-guests black--text" color="black">
                    Number of guests
                  </p>
                  <p class="font-weight-bold">
                    Rooms
                    <span style="float: right;">
                      <v-btn
                        style="background-color: transparent; border: 1px solid #4f3316;"
                        elevation="4"
                        icon
                        small
                        @click="changeCounterRoom(0, 'rooms', -1)"
                      >
                        <v-icon color="#4f3316">
                          mdi-minus
                        </v-icon>
                      </v-btn>

                      <span class="quantity px-2 font-weight-bold">{{ room_count }}</span>

                      <v-btn
                        style="background-color: #4f3316;"
                        color="#4f3316"
                        elevation="4"
                        icon
                        small
                        @click="changeCounterRoom(0, 'rooms', 1)"
                      >
                        <v-icon color="#FFF">
                          mdi-plus
                        </v-icon>
                      </v-btn>
                    </span>
                  </p>
                  <v-divider class="my-2" />
                  <p class="font-weight-bold">
                    Select Board Type
                    <v-select
                      v-model="boardType"
                      :items="boardsWithAll"
                      item-text="_"
                      item-value="Type"
                      required
                      label="Select Board Type"
                      persistent-hint
                      return-object
                      single-line
                      dense
                      outlined
                    />
                  </p>
                  <p v-for="(room, index) in rooms" :key="index" class="font-weight-bold">
                    Room {{ index + 1 }}
                    <v-card class="" style="border-radius: 15px;">
                      <v-card-text>
                        <p class="font-weight-bold">
                          Adults
                          <span style="float: right;">
                            <v-btn
                              style="background-color: transparent; border: 1px solid #4f3316;"
                              elevation="4"
                              icon
                              small
                              @click="changeCounterRoom(index, 'travelers', -1)"
                            >
                              <v-icon color="#4f3316">
                                mdi-minus
                              </v-icon>
                            </v-btn>

                            <span class="quantity px-2 font-weight-bold">{{ room.travelers }}</span>

                            <v-btn
                              style="background-color: #4f3316;"
                              color="#4f3316"
                              elevation="4"
                              icon
                              small
                              @click="changeCounterRoom(index, 'travelers', 1)"
                            >
                              <v-icon color="#FFF">
                                mdi-plus
                              </v-icon>
                            </v-btn>
                          </span>
                        </p>
                        <v-divider class="my-2" />
                        <p class="font-weight-bold">
                          Children
                          <span style="float: right;">
                            <v-btn
                              style="background-color: transparent; border: 1px solid #4f3316;"
                              elevation="4"
                              icon
                              small
                              @click="changeCounterRoom(index, 'children', -1)"
                            >
                              <v-icon color="#4f3316">
                                mdi-minus
                              </v-icon>
                            </v-btn>

                            <span class="quantity px-2 font-weight-bold">{{ room.children }}</span>

                            <v-btn
                              style="background-color: #4f3316;"
                              color="#4f3316"
                              elevation="4"
                              icon
                              small
                              @click="changeCounterRoom(index, 'children', 1)"
                            >
                              <v-icon color="#FFF">
                                mdi-plus
                              </v-icon>
                            </v-btn>
                          </span>
                        </p>
                        <div v-if="room.ageSelects.length > 0">
                          Children's Ages
                          <v-row>
                            <v-col v-for="(ageSelect, childIndex) in room.ageSelects" :key="childIndex" cols="4">
                              <v-select
                                v-model="ageSelect.age"
                                :items="ages"
                                required
                                :error-messages="getRoomAgeSelectErrorMessages(index, childIndex)"
                                label="0"
                                persistent-hint
                                return-object
                                single-line
                                dense
                                outlined
                              />
                            </v-col>
                          </v-row>
                        </div>
                        <v-divider class="my-2" />
                      </v-card-text>
                    </v-card>
                  </p>
                  <v-card v-if="false" class="" style="border-radius: 15px;">
                    <v-card-text>
                      <p class="font-weight-bold">
                        Adults
                        <span style="float: right;">
                          <v-btn
                            style="background-color: transparent; border: 1px solid #4f3316;"
                            elevation="4"
                            icon
                            small
                            @click="changeCounterAdult('-1')"
                          >
                            <v-icon color="#4f3316">
                              mdi-minus
                            </v-icon>
                          </v-btn>

                          <span class="quantity px-2 font-weight-bold">{{ travellers }}</span>

                          <v-btn
                            style="background-color: #4f3316;"
                            color="#4f3316"
                            elevation="4"
                            icon
                            small
                            @click="changeCounterAdult('1')"
                          >
                            <v-icon color="#FFF">
                              mdi-plus
                            </v-icon>
                          </v-btn>
                        </span>
                      </p>
                      <v-divider class="my-2" />
                      <p class="font-weight-bold">
                        Children
                        <span style="float: right;">
                          <v-btn
                            style="background-color: transparent; border: 1px solid #4f3316;"
                            elevation="4"
                            icon
                            small
                            @click="changeCounterChild('-1')"
                          >
                            <v-icon color="#4f3316">
                              mdi-minus
                            </v-icon>
                          </v-btn>

                          <span class="quantity px-2 font-weight-bold">{{ children }}</span>

                          <v-btn
                            style="background-color: #4f3316;"
                            color="#4f3316"
                            elevation="4"
                            icon
                            small
                            @click="changeCounterChild('1')"
                          >
                            <v-icon color="#FFF">
                              mdi-plus
                            </v-icon>
                          </v-btn>
                        </span>
                      </p>
                      <div v-if="ageSelects.length > 0">
                        Children's Ages
                        <v-row>
                          <v-col v-for="(ageSelect, index) in ageSelects" :key="index" cols="4">
                            <v-select
                              v-model="ageSelect.age"
                              :items="ages"
                              required
                              :error-messages="getAgeSelectErrorMessages(index)"
                              label="0"
                              persistent-hint
                              return-object
                              single-line
                              dense
                              outlined
                            />
                          </v-col>
                        </v-row>
                      </div>
                    </v-card-text>
                  </v-card>
                  <v-divider class="my-2" />
                  <p class="font-weight-bold">
                    Initial Price
                    <span style="float: right;">
                      <span class="quantity px-2 font-weight-bold">$ {{ initialPrice }}</span>
                    </span>
                  </p>
                </v-card-text>
                <v-row class="">
                  <v-col cols="12" md="12">
                    <v-btn
                      v-if="e1 === 2 && !confirmedSelectedRoom && !showInfoOfRooms"
                      class="white--text v-btn-brown"
                      elevation="6"
                      large
                      block
                      raised
                      :disabled="(getRatePlanCodeArray.length === 0 && getRatePlanCodes.length === 0) || confirmedSelectedRoom"
                      @click="toggleRoomDetails"
                    >
                      <span>Proceed with Room(s) Selection</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>
      <v-dialog v-model="showGallery" max-width="900" content-class="rounded-xl hide-overflow" style="z-index: 9999;" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Gallery
            <v-btn
              text
              color="white"
              style="background-color: transparent;border: 1px solid #fff;color: #fff;"
              elevation="4"
              icon
              small
              absolute
              right
              class="float-right"
              @click="showGallery = false"
            >
              <v-icon color="white">
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text v-if="galleries.length > 0" class="pt-4">
            <v-carousel hide-delimiters>
              <v-carousel-item
                v-for="(gallery,i) in galleries"
                :key="i"
                :src="gallery.src"
                contain
              />
            </v-carousel>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showCheckout" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Trip Summary
            <v-btn
              text
              color="white"
              style="background-color: transparent;border: 1px solid #fff;color: #fff;"
              elevation="4"
              icon
              small
              absolute
              right
              class="float-right"
              @click="showCheckout = false"
            >
              <v-icon color="white">
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="6" sm="2">
                <v-text-field
                  :value="travellers"
                  label="Adults"
                  prepend-inner-icon="mdi-account"
                  readonly
                />
              </v-col>

              <v-col cols="6" sm="2">
                <v-text-field
                  :value="children"
                  label="Children"
                  prepend-inner-icon="mdi-account"
                  readonly
                />
              </v-col>
            </v-row>
            <div>
              <div>
                <v-row class="mt-4">
                  <v-col cols="9" md="9">
                    <p class="font-weight-bold" style="font-size: 25px;color: #000;">
                      Adventures
                    </p>
                  </v-col>
                  <v-col cols="3" md="3">
                    <p>$ {{ initialPrice }}</p>
                  </v-col>
                </v-row>
              </div>
              <v-divider class="mb-4" />
              <div>
                <v-row class="mt-4">
                  <v-col cols="9" md="9">
                    <p class="font-weight-bold" style="font-size: 25px;color: #000;">
                      Accommodation Cost
                    </p>
                  </v-col>
                  <v-col cols="3" md="3">
                    <p>$ {{ hotelPrices.toFixed(2) }}</p>
                  </v-col>
                </v-row>
              </div>
              <v-divider class="mb-4" />
              <div>
                <v-row class="mt-4">
                  <v-col cols="9" md="9">
                    <p class="font-weight-bold" style="font-size: 25px;color: #000;">
                      Additional Cost
                    </p>
                  </v-col>
                  <v-col cols="3" md="3">
                    <p>$ {{ additionalPrice }}</p>
                  </v-col>
                </v-row>
              </div>
              <v-divider class="mb-4" />
              <div>
                <v-row class="mt-4">
                  <v-col cols="9" md="9">
                    <p class="font-weight-bold" style="font-size: 25px;color: #000;">
                      Discount
                    </p>
                  </v-col>
                  <v-col cols="3" md="3">
                    <p>% {{ discountPercentage }}</p>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="dialog-cart-footer" style="background-color: #fff">
            <v-row align="center" justify="center" class="px-5">
              <v-col cols="12" md="12">
                <v-row class="mt-2">
                  <v-col cols="8">
                    <h5 class="text-h5">
                      Total
                    </h5>
                  </v-col>
                  <v-col cols="4">
                    <p>$ {{ totalAllPrices.toFixed(2) }}</p>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="12">
                <v-btn
                  class="rounded"
                  style="margin-bottom: 15px;"
                  x-large
                  tile
                  elevation="0"
                  dark
                  color="#4f3316"
                  block
                  :disabled="!openProceed"
                  @click="bookAdventures"
                >
                  Complete Checkout
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showHotelsDialog" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Change Hotel
            <v-btn
              text
              color="white"
              style="background-color: transparent;border: 1px solid #fff;color: #fff;"
              elevation="4"
              icon
              small
              absolute
              right
              class="float-right"
              @click="showHotelsDialog = false"
            >
              <v-icon color="white">
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row v-if="isHotelsLoading" align="center" justify="center">
              <v-progress-circular indeterminate color="brown" />
            </v-row>
            <!-- ** make sure retrieved hotels are per city   -->
            <div v-for="(hotel, h) in listGtaHotelJpds" v-else :key="h">
              <v-row class="hotel-card mb-4" style="padding: 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <!-- Hotel Image -->
                <v-col cols="12" md="4" class="p-0">
                  <v-img
                    :src="hotel.Images?.Image[1]?.Type === 'BIG' ? hotel.Images?.Image[1]?.FileName : hotel.Images?.Image[2]?.FileName"
                    max-height="250"
                    max-width="100%"
                    class="rounded-lg"
                    style="object-fit: cover; width: 100%; height: 100%;"
                  />
                </v-col>

                <!-- Hotel Details Section -->
                <v-col cols="12" md="6" class="pl-md-4 pt-4">
                  <div class="d-flex flex-column justify-space-between">
                    <!-- Hotel Name and Change Hotel Button on the Same Line -->
                    <div class="d-flex justify-space-between align-center mb-1">
                      <h6 class="text-h6 font-weight-bold mb-2">
                        {{ hotel.HotelName || 'Hotel Name' }}
                      </h6>
                      <!-- <span class="mr-2 font-weight-bold" style="font-size: 15px;">Category:</span> -->
                      <v-rating
                        :value="getRatingFromCategory(hotel.HotelCategory?._)"
                        dense
                        readonly
                      />
                    </div>

                    <!-- Address -->
                    <p class="grey--text" style="font-size: 15px; margin: 4px 0;">
                      <v-icon color="red" class="mr-1">
                        mdi-map-marker
                      </v-icon>
                      {{ hotel.Address?.Address || 'City Name' }}
                    </p>

                    <!-- Rating for Category -->

                    <!-- Info Button -->
                    <!-- <v-btn small outlined color="brown" class="mt-2" @click="showHotels(h)">
                      Info
                    </v-btn> -->
                  </div>
                </v-col>

                <!-- Select Button Section -->
                <v-col cols="12" md="2" class="d-flex align-center justify-center pt-4">
                  <v-btn
                    class="rounded-lg text-capitalize font-weight-bold"
                    color="#4f3316"
                    dark
                    block
                    large
                    elevation="2"
                    @click="selectHotelGta(h)"
                  >
                    Select
                  </v-btn>
                </v-col>
                <!-- <v-col class="grey--text">
                  {{ hotel.Descriptions?.Description[0]?._ }}
                </v-col> -->
              </v-row>

              <v-divider class="mb-4" />
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showRoomsDialog" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Change Room
            <v-btn
              text
              color="white"
              style="background-color: transparent;border: 1px solid #fff;color: #fff;"
              elevation="4"
              icon
              small
              absolute
              right
              class="float-right"
              @click="showRoomsDialog = false"
            >
              <v-icon color="white">
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            <p>hello</p>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showAddNewAdventuresDialog" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            City Activities
            <v-btn
              text
              color="white"
              style="background-color: transparent;border: 1px solid #fff;color: #fff;"
              elevation="4"
              icon
              small
              absolute
              right
              class="float-right"
              @click="showAddNewAdventuresDialog = false"
            >
              <v-icon color="white">
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            <div v-if="adventures.length">
              <v-row>
                <v-col cols="12" md="12">
                  <div v-for="(adventure, n) in adventures" :key="n">
                    <v-card class="mb-5" style="border-radius: 15px;">
                      <v-card-text>
                        <v-row class="">
                          <v-col v-if="adventure.activityImages.length" cols="12" md="4" class="pt-4">
                            <v-img
                              :src="adventure.activityImages[0][0]"
                              class="rounded-lg"
                            />
                          </v-col>
                          <v-col cols="10" :md="adventure.activityImages.length ? 6 : 10">
                            <div class="cruise-result-trip justify-space-between pt-4">
                              <div>
                                <h5 class="text-h5 font-weight-bold">
                                  {{ adventure.activityTitle }}
                                </h5>
                              </div>
                              <div class="black--text">
                                <h5 class="subtitle-2 font-weight-bold">
                                  Start from ${{ adventure.activityPricePerPerson }} per person
                                </h5>
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="12">
                            <!-- eslint-disable-next-line vue/no-v-html -->
                            <v-tabs
                              v-model="tab"
                              color="font-weight-black accent-4"
                            >
                              <v-tab href="#intro">
                                Intro
                              </v-tab>
                              <v-tab href="#itinerary">
                                Itinerary
                              </v-tab>
                              <v-tab href="#notes">
                                Notes
                              </v-tab>
                            </v-tabs>
                            <v-tabs-items v-model="tab">
                              <v-tab-item :value="'intro'">
                                <v-card flat>
                                  <v-card-text>
                                    <div class="mb-3" v-html="adventure.activityIntro" />
                                  </v-card-text>
                                </v-card>
                              </v-tab-item>
                              <v-tab-item :value="'itinerary'">
                                <v-card flat>
                                  <v-card-text>
                                    <div class="mb-3" v-html="adventure.activityItinerary" />
                                  </v-card-text>
                                </v-card>
                              </v-tab-item>
                              <v-tab-item :value="'notes'">
                                <v-card flat>
                                  <v-card-text>
                                    <div class="mb-3" v-html="adventure.activityOverview" />
                                  </v-card-text>
                                </v-card>
                              </v-tab-item>
                            </v-tabs-items>
                            <div style="margin: 10px 0;">
                              <v-expansion-panels>
                                <v-expansion-panel v-if="adventure.activityIncludes.length">
                                  <v-expansion-panel-header class="text-subtitle-2">
                                    Includes
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content>
                                    <v-row>
                                      <v-col cols="12">
                                        <ul v-if="isMobile" class="list">
                                          <li v-for="(include, i) in adventure.activityIncludes" :key="i" class="list-item pl-2">
                                            - {{ include }}
                                          </li>
                                        </ul>
                                        <div v-else>
                                          <span v-for="(include, i) in adventure.activityIncludes" :key="i">
                                            <v-chip
                                              dense
                                              label
                                              class="my-1 px-4 ma-2 py-2 text-truncate"
                                              color="#F6F6F6"
                                            >
                                              <span class="text-xs">{{ include }}</span>
                                            </v-chip>
                                          </span>
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                              <div>
                                <v-expansion-panels>
                                  <v-expansion-panel v-if="adventure.activityExcludes.length">
                                    <v-expansion-panel-header class="text-subtitle-2">
                                      Excludes
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                      <v-row>
                                        <v-col cols="12">
                                          <ul v-if="isMobile" class="list">
                                            <li v-for="(exclude, i) in adventure.activityExcludes" :key="i" class="list-item pl-2 ">
                                              - {{ exclude }}
                                            </li>
                                          </ul>
                                          <div v-else>
                                            <span v-for="(exclude, i) in adventure.activityExcludes" :key="i">
                                              <v-chip
                                                dense
                                                label
                                                class="my-1 px-4 ma-2 py-2 text-truncate"
                                                color="#F6F6F6"
                                              >
                                                <span class="text-xs">{{ exclude }}</span>
                                              </v-chip>
                                            </span>
                                          </div>
                                        </v-col>
                                      </v-row>
                                    </v-expansion-panel-content>
                                  </v-expansion-panel>
                                </v-expansion-panels>
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-divider class="mb-2" />
                      <v-card-actions class="mb-2 pb-2">
                        <v-row>
                          <v-col cols="12" md="12">
                            <v-btn
                              v-if="!selected"
                              color="success"
                              block
                              elevation="4"
                              x-large
                              :loading="loadingSelectedAdventure"
                              @click="addAdventureToSelected(adventure)"
                            >
                              <v-icon class="mx-2">
                                mdi-plus-box-multiple
                              </v-icon>
                              Add This Adventure
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-actions>
                    </v-card>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div v-else-if="!adventures.length" class="my-5 text-center">
              No published adventures available now!
            </div>
            <div v-else>
              <v-img max-width="200" class="blink-2 mx-auto" src="~/assets/images/tanfer.png" />
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showAdventureDetailsDialog" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Adventure Details
            <v-btn
              text
              color="white"
              style="background-color: transparent;border: 1px solid #fff;color: #fff;"
              elevation="4"
              icon
              small
              absolute
              right
              class="float-right"
              @click="showAdventureDetailsDialog = false"
            >
              <v-icon color="white">
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            <div v-if="adventureDetails !== null">
              <v-row>
                <v-col cols="12" md="12">
                  <div>
                    <v-card class="mb-5" style="border-radius: 15px;">
                      <v-card-text>
                        <v-row class="">
                          <v-col v-if="adventureDetails.activityImages.length" cols="12" md="4" class="pt-4">
                            <v-img
                              max-height="350"
                              :src="adventureDetails.activityImages[0][0]"
                              max-width="250"
                              class="rounded-lg"
                            />
                          </v-col>
                          <v-col cols="10" :md="adventureDetails.activityImages.length ? 6 : 10">
                            <div class="cruise-result-trip justify-space-between pt-4">
                              <div>
                                <h5 class="text-h5 font-weight-bold">
                                  {{ adventureDetails.activityTitle }}
                                </h5>
                              </div>
                              <div class="black--text">
                                <h5 class="text-subtitle-2 font-weight-bold">
                                  Start from ${{ adventureDetails.activityPricePerPerson }} per person
                                </h5>
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="12">
                            <!-- eslint-disable-next-line vue/no-v-html -->
                            <v-row>
                              <v-col cols="12" md="8" lg="6">
                                <v-tabs
                                  v-model="tab"
                                  color="font-weight-black accent-4"
                                  class="adventure-details-tabs"
                                >
                                  <v-tab href="#intro">
                                    Intro
                                  </v-tab>
                                  <v-tab href="#itinerary">
                                    Itinerary
                                  </v-tab>
                                  <v-tab href="#notes">
                                    Notes
                                  </v-tab>
                                </v-tabs>
                              </v-col>
                            </v-row>
                            <v-tabs-items v-model="tab">
                              <v-tab-item :value="'intro'">
                                <v-card flat>
                                  <v-card-text>
                                    <div class="mb-3" v-html="adventureDetails.activityIntro" />
                                  </v-card-text>
                                </v-card>
                              </v-tab-item>
                              <v-tab-item :value="'itinerary'">
                                <v-card flat>
                                  <v-card-text>
                                    <div class="mb-3" v-html="adventureDetails.activityItinerary" />
                                  </v-card-text>
                                </v-card>
                              </v-tab-item>
                              <v-tab-item :value="'notes'">
                                <v-card flat>
                                  <v-card-text>
                                    <div class="mb-3" v-html="adventureDetails.activityOverview" />
                                  </v-card-text>
                                </v-card>
                              </v-tab-item>
                            </v-tabs-items>
                            <div style="margin: 10px 0;">
                              <v-expansion-panels>
                                <v-expansion-panel v-if="adventureDetails.activityIncludes.length">
                                  <v-expansion-panel-header class="text-subtitle-2">
                                    Includes
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content>
                                    <v-row>
                                      <v-col cols="12">
                                        <ul v-if="isMobile" class="list">
                                          <li v-for="(include, i) in adventureDetails.activityIncludes" :key="i" class="list-item pl-2">
                                            - {{ include }}
                                          </li>
                                        </ul>
                                        <div v-else>
                                          <span v-for="(include, i) in adventureDetails.activityIncludes" :key="i">
                                            <v-chip label large color="#F6F6F6" class="my-1 px-4 ma-2 py-2">{{ include }}</v-chip>
                                          </span>
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </div>

                            <div>
                              <v-expansion-panels>
                                <v-expansion-panel v-if="adventureDetails.activityExcludes.length">
                                  <v-expansion-panel-header class="text-subtitle-2">
                                    Excludes
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content>
                                    <v-row>
                                      <v-col cols="12">
                                        <ul v-if="isMobile" class="list">
                                          <li v-for="(exclude, i) in adventureDetails.activityExcludes" :key="i" class="list-item pl-2">
                                            - {{ exclude }}
                                          </li>
                                        </ul>
                                        <div v-else>
                                          <span v-for="(exclude, i) in adventureDetails.activityExcludes" :key="i">
                                            <v-chip label large color="#F6F6F6" class="my-1 px-4 ma-2 py-2">{{ exclude }}</v-chip>
                                          </span>
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div v-else class="my-5 text-center">
              Not selected adventure!
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showReplaceAdventureDialog" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Replace Adventure
            <v-btn
              text
              color="white"
              style="background-color: transparent;border: 1px solid #fff;color: #fff;"
              elevation="4"
              icon
              small
              absolute
              right
              class="float-right"
              @click="showReplaceAdventureDialog = false"
            >
              <v-icon color="white">
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            <div v-if="adventures.length">
              <v-row>
                <v-col cols="12" md="12">
                  <div v-for="(adventure, n) in adventures" :key="n">
                    <v-card class="mb-5" style="border-radius: 15px;">
                      <v-card-text>
                        <v-row class="">
                          <v-col v-if="adventure.activityImages.length" cols="12" md="4" class="pt-4">
                            <v-img
                              max-height="350"
                              :src="adventure.activityImages[0][0]"
                              max-width="250"
                              class="rounded-lg activity-img activity-img-mobile"
                            />
                          </v-col>
                          <v-col cols="10" :md="adventure.activityImages.length ? 6 : 10">
                            <div class="cruise-result-trip justify-space-between pt-4">
                              <div>
                                <h5 class="text-h5 font-weight-bold">
                                  {{ adventure.activityTitle }}
                                </h5>
                              </div>
                              <div class="black--text">
                                <h5 class="text-subtitle-2 font-weight-bold">
                                  Start from ${{ adventure.activityPricePerPerson }} per person
                                </h5>
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="12">
                            <!-- eslint-disable-next-line vue/no-v-html -->
                            <v-tabs
                              v-model="tab"
                              color="font-weight-black accent-4"
                            >
                              <v-tab href="#intro">
                                Intro
                              </v-tab>
                              <v-tab href="#itinerary">
                                Itinerary
                              </v-tab>
                              <v-tab href="#notes">
                                Notes
                              </v-tab>
                            </v-tabs>
                            <v-tabs-items v-model="tab">
                              <v-tab-item :value="'intro'">
                                <v-card flat>
                                  <v-card-text>
                                    <div class="mb-3" v-html="adventure.activityIntro" />
                                  </v-card-text>
                                </v-card>
                              </v-tab-item>
                              <v-tab-item :value="'itinerary'">
                                <v-card flat>
                                  <v-card-text>
                                    <div class="mb-3" v-html="adventure.activityItinerary" />
                                  </v-card-text>
                                </v-card>
                              </v-tab-item>
                              <v-tab-item :value="'notes'">
                                <v-card flat>
                                  <v-card-text>
                                    <div class="mb-3" v-html="adventure.activityOverview" />
                                  </v-card-text>
                                </v-card>
                              </v-tab-item>
                            </v-tabs-items>
                            <div style="margin: 10px 0;">
                              <v-expansion-panels>
                                <v-expansion-panel v-if="adventure.activityIncludes.length">
                                  <v-expansion-panel-header class="text-subtitle-2">
                                    Includes
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content>
                                    <v-row>
                                      <v-col cols="12">
                                        <ul v-if="isMobile" class="list">
                                          <li v-for="(include, i) in adventure.activityIncludes" :key="i" class="list-item pl-2">
                                            - {{ include }}
                                          </li>
                                        </ul>
                                        <div v-else>
                                          <span v-for="(include, i) in adventure.activityIncludes" :key="i">
                                            <v-chip
                                              dense
                                              label
                                              class="my-1 px-4 ma-2 py-2 text-truncate"
                                              color="#F6F6F6"
                                            >
                                              <span class="text-xs">{{ include }}</span>
                                            </v-chip>
                                          </span>
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </div>
                            <div>
                              <v-expansion-panels>
                                <v-expansion-panel v-if="adventure.activityExcludes.length">
                                  <v-expansion-panel-header
                                    class="text-subtitle-2"
                                  >
                                    Excludes
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content>
                                    <v-row>
                                      <v-col cols="12">
                                        <ul v-if="isMobile" class="list">
                                          <li v-for="(exclude, i) in adventure.activityExcludes" :key="i" class="list-item pl-2">
                                            - {{ exclude }}
                                          </li>
                                        </ul>
                                        <div v-else>
                                          <span v-for="(exclude, i) in adventure.activityExcludes" :key="i">
                                            <v-chip
                                              dense
                                              label
                                              class="my-1 px-4 ma-2 py-2 text-truncate"
                                              color="#F6F6F6"
                                            >
                                              <span class="text-xs">{{ exclude }}</span>
                                            </v-chip>
                                          </span>
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-divider class="mb-2" />
                      <v-card-actions class="mb-2 pb-2">
                        <v-row>
                          <v-col cols="12" md="12">
                            <v-btn
                              v-if="!selected"
                              color="success"
                              block
                              elevation="4"
                              x-large
                              style="padding: 0;"
                              :loading="loadingSelectedAdventure"
                              @click="replaceAdventureSelected(adventure)"
                            >
                              <v-icon class="mx-2">
                                mdi-plus-box-multiple
                              </v-icon>
                              Replace This Adventure
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-actions>
                    </v-card>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div v-else-if="!adventures.length" class="my-5 text-center">
              No published adventures available now!
            </div>
            <div v-else>
              <v-img max-width="200" class="blink-2 mx-auto" src="~/assets/images/tanfer.png" />
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showCruiseDetailsDialog" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Cruise Details
            <v-btn
              text
              color="white"
              style="background-color: transparent;border: 1px solid #fff;color: #fff;"
              elevation="4"
              icon
              small
              absolute
              right
              class="float-right"
              @click="showCruiseDetailsDialog = false"
            >
              <v-icon color="white">
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            <div v-if="cruiseDetails !== null">
              <v-row>
                <v-col cols="12" md="12">
                  <v-card class="pa-3">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-img :src="image" height="200" class="rounded" />
                      </v-col>
                      <v-col cols="12" md="6" class="d-flex flex-wrap">
                        <v-img
                          v-for="(item, i) in cruiseDetails.images"
                          :key="i"
                          :src="item.image"
                          height="70"
                          width="70"
                          class="rounded ma-1 gallery-image"
                          @click="image = item.image"
                        />
                      </v-col>
                    </v-row>
                    <v-card-title class="d-flex justify-space-between flex-wrap align-cener px-0 py-0">
                      {{ cruiseDetails.name }}
                      <v-rating
                        background-color="green lighten-2"
                        color="warning"
                        dense
                        empty-icon="mdi-star-outline"
                        full-icon="mdi-star"
                        length="5"
                        readonly
                        size="15"
                        :value="cruiseDetails.stars"
                      />
                    </v-card-title>
                    <v-card-subtitle class="py-0 px-0 my-1">
                      Cruise Line: {{ cruiseDetails.cruise_line }} / Ship: {{ cruiseDetails.ship_name }} / Nights: {{ cruiseDetails.number_of_nights }} / Cities:
                      <span v-for="(item, i) in cruiseDetails.cities" :key="i">{{ item.name + ', ' }}</span>
                    </v-card-subtitle>
                    <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
                    <v-card-text class="px-0" v-html="cruiseDetails.description" />
                    <div v-if="cruiseDetails.available_dates.length">
                      <h6>This Crusise is available to book during the following dates:</h6>
                      <div v-for="(season, k) in cruiseDetails.available_dates" :key="k">
                        <p><strong>From</strong> {{ new Date(season.start_date.replaceAll('-', '/')).toDateString() }} <strong>To</strong> {{ new Date(season.end_date.replaceAll('-', '/')).toDateString() }} </p>
                      </div>
                    </div>
                    <div v-if="cruiseDetails.includes.length">
                      <p class="text-subtitle-2">
                        Includes
                      </p>
                      <v-chip v-for="(item, i) in cruiseDetails.includes" :key="i" class="ma-1">
                        {{ item }}
                      </v-chip>
                    </div>
                    <div v-if="cruiseDetails.excludes.length">
                      <p class="text-subtitle-2">
                        Excludes
                      </p>
                      <v-chip v-for="(item, i) in cruiseDetails.excludes" :key="i" class="ma-1">
                        {{ item }}
                      </v-chip>
                    </div>
                    <div v-if="cruiseDetails.facilities.length">
                      <p class="text-h6">
                        Facilities
                      </p>
                      <v-chip v-for="(item, i) in cruiseDetails.facilities" :key="i" class="ma-1">
                        {{ item }}
                      </v-chip>
                    </div>
                    <div v-if="cruiseDetails.policies.length">
                      <p class="text-h6">
                        Policies
                      </p>
                      <v-chip v-for="(item, i) in cruiseDetails.policies" :key="i" class="ma-1">
                        {{ item }}
                      </v-chip>
                    </div>
                    <div v-if="cruiseDetails.start_days.length">
                      <p class="text-h6">
                        Start Days
                      </p>
                      <v-chip v-for="(item, i) in cruiseDetails.start_days" :key="i" class="ma-1">
                        {{ item }}
                      </v-chip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            <div v-else class="my-5 text-center">
              Not selected cruise!
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showHotelGtaDetails" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Hotel
            <v-btn
              text
              color="white"
              style="background-color: transparent;border: 1px solid #fff;color: #fff;"
              elevation="4"
              icon
              small
              absolute
              right
              class="float-right"
              @click="showHotelGtaDetails = false"
            >
              <v-icon color="white">
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            <div v-if="gtaHotelDetails !== null">
              <v-row class="" style="padding: 5px;margin: 10px 0">
                <v-col cols="12" md="4" class="pt-4">
                  <v-img
                    max-height="400"
                    :src="gtaHotelDetails.Images.Image[0] ? gtaHotelDetails.Images.Image[0].FileName : 'https://source.unsplash.com/user/c_v_r/1900x800'"
                    max-width="400"
                    class="rounded-lg"
                  />
                </v-col>
                <v-col cols="12" md="8">
                  <div class="cruise-result-trip justify-space-between">
                    <div>
                      <h6 class="text-h6 font-weight-bold">
                        {{ gtaHotelDetails.HotelName }}
                      </h6>
                    </div>
                    <div v-if="gtaHotelDetails.Images && gtaHotelDetails.Images.Image.length > 0">
                      <v-carousel hide-delimiters height="300">
                        <v-carousel-item
                          v-for="(image,i) in gtaHotelDetails.Images.Image"
                          :key="i"
                          :src="image.FileName"
                        />
                      </v-carousel>
                    </div>
                    <div class="black--text">
                      <p class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Address:</strong> {{ gtaHotelDetails.Address.Address }}
                      </p>
                      <p class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Postal Code:</strong> {{ gtaHotelDetails.Address.PostalCode }}
                      </p>
                      <p class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Category:</strong> {{ gtaHotelDetails.HotelCategory._ }}
                      </p>
                      <p class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Hotel Chain:</strong> {{ gtaHotelDetails.HotelChain.Name }}
                      </p>
                      <p class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Descriptions:</strong>
                        <span v-for="(description, d) in gtaHotelDetails.Descriptions.Description" :key="d">
                          <span v-if="description.Type === 'LNG'">
                            <span class="" style="font-size: 15px;margin: 2px 0;">{{ description._ }}</span>
                          </span>
                        </span>
                      </p>
                      <div class="trips-cityname" style="margin: 10px 0;">
                        <v-expansion-panels>
                          <v-expansion-panel v-if="gtaHotelDetails.Features.Feature.length">
                            <v-expansion-panel-header>
                              Features
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <span v-for="(feature, f) in gtaHotelDetails.Features.Feature" :key="f">
                                <v-chip label large color="#F6F6F6" class="my-1 px-4 ma-2 py-2">{{ feature._ }}</v-chip>
                              </span>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import LoadingScreen from '~/components/LoadingScreen.vue'
import tripsServices from '~/services/tripsServices'
import adventureServices from '~/services/activitiesServies'

export default {
  components: {
    LoadingScreen
  },
  data () {
    const today = new Date()
    const todayFormatted = today.toISOString().substr(0, 10)
    const endDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
    const endDateFormatted = endDate.toISOString().substr(0, 10)
    return {
      isLoading: false,
      snackbar: false,
      color: '',
      text: '',
      loaded: '',
      packageStartDayText: null,
      packageStartDay: null,
      menu: null,
      travellers: 0,
      children: 0,
      ages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      ageSelects: [],
      showAgesSelects: false,
      selectedAdventures: [],
      activityPhase: false,
      acomidationPhase: false,
      tripSummaryPhase: false,
      e1: 1,
      // panelExpandedTraveller: 0,
      panelExpandedPayNow: null,
      showCheckout: false,
      showHotelsDialog: false,
      showRoomsDialog: false,
      // rooms: 0,
      room_count: 1,
      rooms: [
        { travelers: 0, children: 0, ageSelects: [], roomCategory: { _: 'All', Type: 'all' } }
      ],
      roomCategories: [],
      boards: [],
      boardType: { _: 'All', Type: 'all' },
      openProceed: false,
      packageDetails: {
        packageImage: 'test'
      },
      items: [
        { title: 'Replace', action: 'replace' },
        { title: 'View', action: 'view' },
        { title: 'Remove', action: 'remove' }
      ],
      showAddNewAdventuresDialog: false,
      adventures: [],
      cities: [],
      activityIndex: null,
      dayIndex: null,
      adventureIndex: null,
      date: null,
      tab: null,
      selected: false,
      loadingSelectedAdventure: false,
      showAdventureDetailsDialog: false,
      adventureDetails: null,
      cruiseDetails: null,
      showReplaceAdventureDialog: false,
      showCruiseDetailsDialog: false,
      initialPrice: 0,
      priceSessionId: null,
      startingDay: 0,
      panelExpandedActivities: [],
      showGallery: false,
      galleries: [],
      checkResponseCode: false,
      listGtaHotelDetails: [],
      showHotelGtaDetails: false,
      gtaHotelDetails: null,
      listGtaHotelJpds: [],
      selectedCityHotelIndex: null,
      hotelStartDateText: null,
      hotelStartDate: null,
      hotelEndDateText: null,
      hotelEndDate: null,
      menuStartDate: null,
      menuEndDate: null,
      todayFormatted,
      endDateFormatted,
      minEndDate: [],
      hotelStartDates: [],
      hotelEndDates: [],
      hotelStartDatesText: [],
      hotelEndDatesText: [],
      menuStartDates: [],
      menuEndDates: [],
      selectedDateForAddNewAdventure: null,
      showDaysArray: [],
      isAvailable: false,
      isAvailables: [],
      hotelAvailsArray: [],
      travellersFormValid: null,
      // hotelAvails: null,
      hotelAvails: {
        HotelOptions: {
          HotelOption: {
            Board: {
              _: 'Room Only',
              Type: 'SA'
            },
            Prices: {
              Price: {
                TotalFixAmounts: {
                  Service: {
                    Amount: ''
                  },
                  Gross: '',
                  Nett: ''
                },
                Type: 'S',
                Currency: 'USD'
              }
            },
            CancellationPolicy: {
              FirstDayCostCancellation: {
                _: '',
                Hour: ''
              },
              Description: '',
              PolicyRules: {
                Rule: [
                  {
                    From: '',
                    To: '',
                    DateFrom: '',
                    DateFromHour: '',
                    DateTo: '',
                    DateToHour: '',
                    Type: 'V',
                    FixedPrice: 0,
                    PercentPrice: '',
                    Nights: '',
                    ApplicationTypeNights: ''
                  }
                ]
              },
              CurrencyCode: 'USD',
              Type: 'S'
            },
            HotelRooms: {
              HotelRoom: {
                Name: '1/3 pax',
                RoomCategory: {
                  _: '',
                  Type: '187'
                },
                RoomOccupancy: {
                  Occupancy: '',
                  MaxOccupancy: '',
                  Adults: '',
                  Children: 0
                },
                Units: 1,
                Source: '1',
                AvailRooms: 33
              }
            },
            RatePlanCode: 'xxxx',
            Status: 'OK',
            NonRefundable: false,
            PackageContract: false
          }
        },
        Code: 'xxxx',
        JPCode: 'xxxx',
        JPDCode: 'xxxx',
        BestDeal: true,
        Type: 'HOTEL',
        DestinationZone: 'xxxx'
      },
      hotelAvailsList: [],
      selectedHotelIndex: null,
      hotelPrices: 0,
      hotelAvailPrices: [],
      additionalPrice: 0,
      discountPercentage: 0,
      totalAllPrices: 0,
      isInputValid: false,
      selectedRoomGta: null,
      getRatePlanCode: null,
      selectedHotelStartDate: null,
      selectedHotelEndDate: null,
      selectedHotelCode: null,
      selectedHotelJPCode: null,
      selectedHotelJPDCode: null,
      selectedHotelCodes: [],
      selectedHotelJPCodes: [],
      selectedHotelJPDCodes: [],
      confirmedSelectedRoom: false,
      getbookingRule: null,
      selectedRoomGtas: [],
      getRatePlanCodes: [],
      getbookingRules: [],
      selectedRoomGtaArray: [],
      getRatePlanCodeArray: [],
      hotelPricesArray: [],
      selectedHotelStartDateArray: [],
      selectedHotelEndDateArray: [],
      selectedHotelCodeArray: [],
      selectedHotelJPCodeArray: [],
      selectedHotelJPDCodeArray: [],
      confirmedSelectedRoomArray: [],
      getbookingRuleArray: [],
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
      checkHasCruise: false,
      finalBookHotelFormData: null,
      finalBookHotelsFormData: [],
      identification_document_pax: '',
      address_pax: '',
      city_pax: '',
      country_pax: '',
      postal_code_pax: '',
      dayActivities: [],
      isMobile: false,
      singleHotelData: {},
      showFullCancellationPolicy: {},
      showAllRooms: false,
      showHotelCards: true,
      isSelectionConfirmed: false,
      showInfoOfRooms: false,
      isRoomSelected: [],
      isHotelsLoading: true
    }
  },
  async fetch () {
    if (this.$route.params.slug) {
      await this.getPackage()
      await this.getRoomCategories()
    } else if (this.$route.query.custom_package) {
      // await this.getSavedPackage()
    } else { this.$router.go(-1) }
  },
  computed: {

    isNonRefundable () {
      return (roomIndex) => {
        const description = this.singleHotelData?.data?.HotelOptions?.HotelOption[roomIndex]?.CancellationPolicy?.Description || ''
        // Updated pattern to match "0" followed by spaces or "&nbsp;", then "USD"
        return !/0(?:\s|&nbsp;)+usd/i.test(description) // Returns false if "0&nbsp;USD" or "0 USD" is present
      }
    },
    isButtonEnabled () {
      const getCountOfChildren = this.children
      const rooms = this.rooms
      let checkCountofAges = 0
      if (rooms.length) {
        for (const room of rooms) {
          if (room.ageSelects.length) {
            for (const ageSelect of room.ageSelects) {
              if (ageSelect && ageSelect.age !== null) {
                checkCountofAges++
              }
            }
          }
        }
      }
      const childrenValidate = checkCountofAges === getCountOfChildren
      const initialPriceValidate = this.initialPrice > 0
      return childrenValidate && initialPriceValidate
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
      // Create a new array with an "All" option
      return [{ _: 'All', Type: 'all' }, ...this.roomCategories]
    },
    boardsWithAll () {
      // Create a new array with an "All" option
      return [{ _: 'All', Type: 'all' }, ...this.boards]
    }
  },
  watch: {

    packageStartDay (newDate) {
      if (newDate) {
        const startDateFormatted = this.formatDate(newDate, 1, 'hotelStartDate')
        this.hotelStartDates = Array(this.listGtaHotelDetails.length).fill(newDate)
        this.hotelStartDatesText = Array(this.listGtaHotelDetails.length).fill(startDateFormatted)
        const endDate = new Date(new Date(newDate).getTime() + 3 * 24 * 60 * 60 * 1000)
        const endDateFormatted = this.formatDate(endDate, 1, 'hotelEndDate')
        this.hotelEndDates = Array(this.listGtaHotelDetails.length).fill(endDate.toISOString().substr(0, 10))
        this.hotelEndDatesText = Array(this.listGtaHotelDetails.length).fill(endDateFormatted)
      }
    }
  },
  mounted () {
    this.checkIfMobile()
    window.addEventListener('resize', this.checkIfMobile)
    // const today = new Date()
    // const todayFormatted = today.toISOString().substr(0, 10)
    // const endDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
    // const endDateFormatted = endDate.toISOString().substr(0, 10)
    // this.hotelStartDates = Array(this.listGtaHotelDetails.length).fill(todayFormatted)
    // this.hotelEndDates = Array(this.listGtaHotelDetails.length).fill(endDateFormatted)
    // this.hotelStartDatesText = Array(this.listGtaHotelDetails.length).fill(todayFormatted)
    // this.hotelEndDatesText = Array(this.listGtaHotelDetails.length).fill(endDateFormatted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkIfMobile)
  },
  methods: {
    toggleRoomDetails () {
      this.showInfoOfRooms = true
    },
    showHotelDetailsObject (hotelCode) {
      console.log(hotelCode) // Verify the hotel code

      const url = this.$router.resolve({
        path: '/hotels/hotelInfo/packageHotelInfo',
        query: { hotelCode }
      }).href

      window.open(url, '_blank')
    },
    toggleRoomDisplay (hotelIndex) {
      this.$set(this.showAllRoomsForHotel, hotelIndex, !this.showAllRoomsForHotel[hotelIndex])
    },
    toggleCancellationPolicy (roomIndex) {
      this.$set(this.showFullCancellationPolicy, roomIndex, !this.showFullCancellationPolicy[roomIndex])
    },
    getRoomOptions (roomOptions) {
      if (!roomOptions) {
        return []
      }
      return Array.isArray(roomOptions) ? roomOptions : [roomOptions]
    },
    getToday () {
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    },

    handleStartDateChange (index) {
      if (this.hotelStartDates[index]) {
        const startDate = new Date(this.hotelStartDates[index])
        this.hotelStartDates[index] = startDate.toISOString().split('T')[0]
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 3)
        this.hotelEndDates[index] = endDate.toISOString().split('T')[0]
        this.hotelStartDatesText[index] = this.formatDate(this.hotelStartDates[index])
        this.hotelEndDatesText[index] = this.formatDate(this.hotelEndDates[index])
        const minEndDate = new Date(startDate)
        minEndDate.setDate(startDate.getDate() + 1)
        this.minEndDate[index] = minEndDate.toISOString().split('T')[0]
      }
    },
    displayedRooms (roomOptions) {
      return this.showAllRooms ? roomOptions : roomOptions.slice(0, 2)
    },
    hiddenRoomCount (roomOptions) {
      return roomOptions.length - 2
    },
    //   if (typeof description !== 'string') {
    //     return 'No cancellation policy available'
    //   }

    //   const normalizeText = (text) => {
    //     return text.toLowerCase().trim()
    //   }

    //   const percentagePattern = /\d{1,3}(?:\.\d+)?\s*%\s*of\s*total\s*amount/i
    //   const pricePattern = /\b\d+(?:\.\d+)?\s+usd\b/i
    //   const nightPattern = /\b\d+\s+night\b/i
    //   const mostExpensiveNightPattern = /\bmost\s*expensive\s*night\b/i

    //   const wrapRed = match => `<span style="color: red;">${match.replace(/\s*usd\b/i, '$')}</span>`

    //   return description
    //     .replace(/\*/g, '\n')
    //     .split('\n')
    //     .map((line) => {
    //       const normalizedLine = normalizeText(line)
    //       const highlightedLine = normalizedLine
    //         .replace(percentagePattern, wrapRed)
    //         .replace(pricePattern, wrapRed)
    //         .replace(nightPattern, wrapRed)
    //         .replace(mostExpensiveNightPattern, wrapRed)

    //       return `<span style="color: grey;">${highlightedLine.trim()}</span>`
    //     })
    //     .join('<br>')
    // },
    formatCancellationPolicy (description) {
      if (typeof description !== 'string') {
        return 'No cancellation policy available'
      }

      const normalizeText = (text) => {
        return text.trim()
      }

      const percentagePattern = /\d{1,3}(?:\.\d+)?\s*%\s*of\s*total\s*amount/i
      const pricePattern = /\b(\d+(?:\.\d+)?)\s{1,}\s+usd\b/i // Modified to handle multiple spaces
      const nightPattern = /\b\d+\s+night\b/i
      const mostExpensiveNightPattern = /\bmost\s*expensive\s*night\b/i

      const wrapRed = match => `<span style="color: red;">${match.replace(/\s*usd\b/i, '$')}</span>`
      const wrapGreen = text => `<span style="color: green;">${text}</span>`

      return description
        .replace(/\*/g, '\n')
        .split('\n')
        .map((line) => {
          const normalizedLine = normalizeText(line)
          if (/0\s+\s+usd/i.test(normalizedLine)) {
            return wrapGreen('Cancellation Available')
          }
          const highlightedLine = normalizedLine
            .replace(percentagePattern, wrapRed)
            .replace(pricePattern, (match, amount) => {
              return amount > 0 ? wrapRed(match) : wrapGreen('Cancellation Available')
            })
            .replace(nightPattern, wrapRed)
            .replace(mostExpensiveNightPattern, wrapRed)

          return `<span style="color: grey;">${highlightedLine.trim()}</span>`
        })
        .join('<br>')
    },
    setDefaultHotelDates () {
      this.hotelStartDates = this.hotelStartDates.map(() => this.packageStartDay)
      this.hotelEndDates = this.hotelEndDates.map(() => this.activity.package_text_day)
      this.hotelStartDatesText = this.hotelStartDates.map(date => this.formatDate(date, 1, 'hotelStartDate'))
      this.hotelEndDatesText = this.hotelEndDates.map(date => this.formatDate(date, 1, 'hotelEndDate'))
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
    checkIfMobile () {
      this.isMobile = window.innerWidth <= 600
    },
    formatDate (date, formatType, targetField, index) {
      const d = new Date(date)
      const formattedDate = d.toISOString().substr(0, 10)

      if (targetField === 'hotelStartDate') {
        this.hotelStartDatesText[index] = formattedDate
      } else if (targetField === 'hotelEndDate') {
        this.hotelEndDatesText[index] = formattedDate
      } else if (targetField === 'packageStartDay') {
        this.packageStartDayText = formattedDate
      }

      return formattedDate
    },
    formatDateAllDays (date, num, type = null) {
      if (!date) { return null }
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      if (type === 'default') {
        const newDate = `${year}-${month}-${parseInt(day) + parseInt(num) - 1}`
        // console.log(date, type, newDate)
        return newDate
      } else {
        const newDate = `${parseInt(day) + parseInt(num) - 1} ${months[month - 1]} ${year}`
        return newDate
      }
    },
    formatDays (day, type) {
      // let dayString = 0
      // console.log('test day', day)
      // if (!day) { return null }
      // if (type === 'adventure') {
      //   dayString++
      //   this.startingDay = dayString
      //   console.log(this.startingDay)
      // } else {
      //   // this.startingDay += 1
      //   // return this.startingDay
      //   console.log(type)
      // }
      return ' ' + day
      // if (day === 1) {
      // this.startingDay += +day
      // return this.startingDay
      // dayString = this.startingDay
      // return dayString
      // } else {
      //   this.startingDay += +day
      //   dayString = this.startingDay
      //   // return (dayString - 1) + ' ' + dayString
      // }
    },
    async changeCounterAdult (num) {
      if (!this.packageStartDay) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select start date to custom your trip'
        this.loaded = false
      } else {
        this.travellers += +num
        if (!isNaN(this.travellers) && this.travellers > 0) {
          await this.calculateAllPrice(this.packageStartDay)
          if (this.travellers > 1) {
            if (num > 0) {
              this.otherTravellers.push({ id: this.travellers })
            } else {
              this.otherTravellers.splice(-1, 1)
            }
            this.otherTravellers = this.onlyUniqueObjectsId(this.otherTravellers)
          }
          return this.travellers
        } else {
          this.travellers = 0
          this.otherTravellers = []
        }
        await this.calculateAllPrice(this.packageStartDay)
      }
    },
    async changeCounterChild (num) {
      if (!this.packageStartDay) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select start date to custom your trip'
        this.loaded = false
      } else {
        this.children += +num
        if (!isNaN(this.children) && this.children > 0) {
          if (num > 0) {
            this.ageSelects.push({ age: null })
            this.showAgesSelects = true
          } else {
            this.ageSelects.splice(-1, 1)
          }
          if (this.children > 0) {
            if (num > 0) {
              this.otherChildren.push({ id: this.children })
            } else {
              this.otherChildren.splice(-1, 1)
            }
            this.otherChildren = this.onlyUniqueObjectsId(this.otherChildren)
          }
          await this.calculateAllPrice(this.packageStartDay)
          return this.children
        } else {
          this.ageSelects = []
          this.children = 0
        }
        await this.calculateAllPrice(this.packageStartDay)
      }
    },
    getAgeSelectErrorMessages (index) {
      if (!this.showAgesSelects) {
        return [] // Skip error messages if age selects are hidden
      }
      const ageSelect = this.ageSelects[index]
      if (ageSelect && ageSelect.age === null) {
        return ['This field is required']
      }
      return []
    },
    checkPackageDateIsExist () {
      if (!this.packageStartDay) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select start date to custom your trip'
        this.loaded = false
      } else {
        this.e1 = 2
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    checkTheStepCurrent () {
      if (this.e1 === 2) {
        this.loaded = true
        this.openProceed = true
        this.showCheckout = true
      } else {
        this.openProceed = false
        this.showCheckout = false
      }
    },
    // async showHotels (indexCity) {
    //   this.showHotelsDialog = true
    //   this.isHotelsLoading = true
    //   this.listGtaHotelJpds = []
    //   const getHotels = this.listGtaHotelDetails[indexCity]
    //   if (getHotels.hotelJpds.length > 0) {
    //     for (let index = 0; index < getHotels.hotelJpds.length; index++) {
    //       if (getHotels.hotelJpds[index]) {
    //         const promise2 = tripsServices.getGtaHotelDetails(getHotels.hotelJpds[index])
    //         const response2 = await promise2
    //         const results2 = response2?.data?.ContentRS?.Contents?.HotelContent
    //         console.log('results: ', results2)
    //         results2.city_id = getHotels.city_id
    //         results2.city_name = getHotels.city_name
    //         results2.hotelIDs = getHotels.hotelIDs
    //         results2.hotelJpds = getHotels.hotelJpds
    //         results2.isAvailable = false
    //         results2.isAvailableText = 'Not Checked with Dates'
    //         this.listGtaHotelJpds.push(results2)
    //         this.isHotelsLoading = false
    //       }
    //     }
    //   }
    //   this.selectedCityHotelIndex = indexCity
    // },
    async showHotels (indexCity) {
      // Initialize UI state
      this.showHotelsDialog = true
      this.isHotelsLoading = true
      this.listGtaHotelJpds = [] // Clear previous data

      const cityHotels = this.listGtaHotelDetails[indexCity] // Get data for the specific city
      if (!cityHotels || !cityHotels.hotelJpds || cityHotels.hotelJpds.length === 0) {
        console.warn('No hotels found for the selected city.')
        this.isHotelsLoading = false
        return
      }

      for (let i = 0; i < cityHotels.hotelJpds.length; i++) {
        const hotelJpd = cityHotels.hotelJpds[i]
        if (!hotelJpd) { continue }

        try {
          const response = await tripsServices.getGtaHotelDetails(hotelJpd)
          const hotelDetails = response?.data?.ContentRS?.Contents?.HotelContent

          if (!hotelDetails) {
            console.warn(`No details found for hotel JP code: ${hotelJpd}`)
            continue
          }

          hotelDetails.city_id = cityHotels.city_id
          hotelDetails.city_name = cityHotels.city_name
          hotelDetails.hotelIDs = cityHotels.hotelIDs
          hotelDetails.hotelJpds = cityHotels.hotelJpds
          hotelDetails.isAvailable = false
          hotelDetails.isAvailableText = 'Not Checked with Dates'

          this.listGtaHotelJpds.push(hotelDetails)
          this.isHotelsLoading = false
        } catch (error) {
          console.error(`Failed to fetch hotel details for JP code: ${hotelJpd}`, error)
        }
      }

      this.selectedCityHotelIndex = indexCity
    },
    // async showHotels (indexCity) {
    //   this.showHotelsDialog = true
    //   this.isHotelsLoading = true
    //   this.listGtaHotelJpds = []

    //   const getHotels = this.listGtaHotelDetails[indexCity]
    //   if (getHotels.hotelJpds.length > 0) {
    //     for (let index = 0; index < getHotels.hotelJpds.length; index++) {
    //       if (getHotels.hotelJpds[index]) {
    //         try {
    //           const promise2 = tripsServices.getGtaHotelDetails(getHotels.hotelJpds[index])
    //           const response2 = await promise2
    //           const results2 = response2?.data?.ContentRS?.Contents?.HotelContent

    //           if (!results2) {
    //             console.warn('No hotel data found for this ID, skipping...')
    //             continue // Skip this iteration if results2 is undefined
    //           }

    //           results2.city_id = getHotels.city_id
    //           results2.city_name = getHotels.city_name
    //           results2.hotelIDs = getHotels.hotelIDs
    //           results2.hotelJpds = getHotels.hotelJpds
    //           results2.isAvailable = false
    //           results2.isAvailableText = 'Not Checked with Dates'
    //           this.listGtaHotelJpds.push(results2)
    //           this.isHotelsLoading = false
    //         } catch (error) {
    //           console.warn(`Failed to retrieve hotel data: ${error.message}`)
    //         }
    //       }
    //     }
    //   }
    //   // this.isHotelsLoading = false
    //   this.selectedCityHotelIndex = indexCity
    // },
    // async getZonesperHotels (indexCity) {
    //   // this.hotelStartDateText = this.packageStartDayText
    //   // this.hotelStartDate = this.packageStartDay
    //   // this.hotelEndDateText = this.packageEndDay
    //   this.listGtaHotelJpds = []
    //   const getHotels = this.listGtaHotelDetails[indexCity]
    //   if (getHotels.hotelJpds.length > 0) {
    //     for (let index = 0; index < getHotels.hotelJpds.length; index++) {
    //       if (getHotels.hotelJpds[index]) {
    //         const promise2 = tripsServices.getGtaHotelDetails(getHotels.hotelJpds[index])
    //         const response2 = await promise2
    //         const results2 = response2.data.ContentRS.Contents.HotelContent
    //         console.log('results: ', results2)
    //         results2.city_id = getHotels.city_id
    //         results2.city_name = getHotels.city_name
    //         results2.hotelIDs = getHotels.hotelIDs
    //         results2.hotelJpds = getHotels.hotelJpds
    //         results2.isAvailable = false
    //         results2.isAvailableText = 'Not Checked with Dates'
    //         this.listGtaHotelJpds.push(results2)
    //       }
    //     }
    //   }
    //   this.selectedCityHotelIndex = indexCity
    //   // this.showHotelsDialog = true
    // },
    showRooms (HotelIndex) {
      // if (this.listGtaHotelDetails.length > 1) {
      //   this.hotelAvails = this.hotelAvailsArray[HotelIndex]
      // }
      // if (this.hotelAvails !== null) {
      //   this.showRoomsDialog = true
      // }
      // alert('Please select city first')
      // if (this.hotelAvailsList[HotelIndex] !== null) {
      //   this.hotelAvails = this.hotelAvailsList[HotelIndex]
      //   this.selectedHotelIndex = HotelIndex
      //   this.showRoomsDialog = true
      // }
      // this.checkHotelAvailabilityByHotel(hotelDetail, HotelIndex)
      this.showRoomsDialog = true
    },
    async changeCounterRoom (index, type, value) {
      if (!this.packageStartDay) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select start date to custom your trip'
        this.loaded = false
      } else if (this.packageStartDay) {
        if (type === 'rooms') {
          this.room_count += +value
          if (this.room_count > 0) {
            if (value > 0) {
              this.rooms.push({ travelers: 0, children: 0, ageSelects: [], roomCategory: { _: 'All', Type: 'all' } })
            } else {
              this.rooms.splice(-1, 1)
            }
          } else {
            this.room_count = 0
            this.rooms = []
          }
        } else {
          // Ensure the value is not negative
          const newValue = Math.max(0, this.rooms[index][type] + value)
          // Update the value in the rooms array
          this.$set(this.rooms, index, {
            ...this.rooms[index],
            [type]: newValue
          })

          // If the type is 'children' and the value is 1, add an age selection for the new child
          if (type === 'children') {
            this.addAgeSelection(index, value)
            this.showAgesSelects = true
          }
        }
        this.travellers = this.totalTravelers
        this.children = this.totalChildren
        await this.calculateAllPrice(this.packageStartDay)
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
    addAgeSelection (index, value) {
      // Add an initial age selection for the new child
      // this.$set(this.rooms[index].ageSelects, this.rooms[index].children, { age: null })

      // Initialize ageSelects as an empty array if it doesn't exist
      if (!this.rooms[index].ageSelects) {
        this.$set(this.rooms[index], 'ageSelects', [])
      }

      if (value === 1) {
        // Add an initial age selection for the new child
        this.rooms[index].ageSelects.push({ age: null })
      } else {
        this.rooms[index].ageSelects.splice(-1, 1)
      }
    },
    getRoomAgeSelectErrorMessages (roomIndex, childIndex) {
      if (!this.showAgesSelects) {
        return []
      }
      const ageSelect = this.rooms[roomIndex].ageSelects[childIndex]
      if (ageSelect && ageSelect.age === null) {
        return ['This field is required']
      }
      return []
    },
    async getPackage () {
      const promise = tripsServices.getTripDetails(this.$route.params.slug)
      const response = await promise
      const results = response.data
      this.packageDetails = results.data
      this.initialPrice = this.packageDetails.intialprice
      this.additionalPrice = this.packageDetails.additionalprice
      this.discountPercentage = this.packageDetails.discountprecentage
      // temp to fix error
      this.totalAllPrices = this.getFinalTotalPrices()
      // this.totalAllPrices = this.packageDetails.initialprice
      this.priceSessionId = this.packageDetails.sessionId
      if (this.packageDetails.activities.length > 0) {
        for (let x = 0; x < this.packageDetails.activities.length; x++) {
          if (this.packageDetails.activities[x].type === 'cruise') {
            this.checkHasCruise = true
          }
        }
      }
      if (this.packageDetails.packageImages.length > 0) {
        this.galleries = this.packageDetails.packageImages.map((image, imageIndex) => ({
          src: image.image
        }))
      }
      // if (this.packageDetails.package_hotel.length > 0) {
      //   const packageHotel = this.packageDetails.package_hotel
      //   console.log(packageHotel)
      //   for (let index = 0; index < packageHotel.length; index++) {
      //     if (packageHotel[index].hotel.Jpd_code) {
      //       const promise2 = tripsServices.getGtaHotelDetails(packageHotel[index].hotel.Jpd_code)
      //       const response2 = await promise2
      //       const results2 = response2.data.ContentRS.Contents.HotelContent
      //       results2.city_id = packageHotel[index].city_id
      //       results2.city_name = packageHotel[index].city_name
      //       results2.hotelIDs = packageHotel[index].hotelIDs
      //       results2.hotelJpds = packageHotel[index].hotelJpds
      //       results2.isAvailable = false
      //       results2.isAvailableText = 'Not Checked with Dates'
      //       this.listGtaHotelDetails.push(results2)
      //     }
      //   }
      // }
      if (this.packageDetails.package_hotel.length > 0) {
        const packageHotel = this.packageDetails.package_hotel[0] // Assuming you're only dealing with the first item in `package_hotel`
        const accommodations = packageHotel.accommodations

        for (let i = 0; i < accommodations.length; i++) {
          const accommodation = accommodations[i]

          if (accommodation.recommended_hotel && accommodation.recommended_hotel.Jpd_code) {
            try {
              const response = await tripsServices.getGtaHotelDetails(accommodation.recommended_hotel.Jpd_code)
              console.log('response: ', response)
              const hotelDetails = response.data.ContentRS.Contents.HotelContent

              hotelDetails.city_id = accommodation.city_id
              hotelDetails.city_name = accommodation.city_name
              hotelDetails.hotelIDs = accommodation.hotels.map(hotel => hotel.id)
              hotelDetails.hotelJpds = accommodation.hotels.map(hotel => hotel.Jpd_code)
              hotelDetails.isAvailable = false
              hotelDetails.isAvailableText = 'Not Checked with Dates'

              this.listGtaHotelDetails.push(hotelDetails)
            } catch (error) {
              console.error('Error fetching hotel details:', error)
            }
          }
        }
      }

      if (this.packageDetails.availabilities.length > 0) {
        const availabilities = this.packageDetails.availabilities
        for (let indexA = 0; indexA < availabilities.length; indexA++) {
          const getDays = availabilities[indexA].days
          for (let indexB = 0; indexB < getDays.length; indexB++) {
            this.showDaysArray.push(getDays[indexB])
          }
        }
      }
      this.calcDaysFromDetails()
      // Initialize the 'panelExpandedActivities' array with all values set to 'true'
      this.panelExpandedActivities = this.packageDetails.activities.map(() => 0)
    },
    getCityImage (name) {
      let img = ''
      switch (name) {
        case 'Cairo':
          img = 'cairo-city.jpg'
          break
        case 'Giza':
          img = 'blog-img.jpg'
          break
        case 'Aswan':
          img = 'aswan.jpg'
          break
        case 'Luxor':
          img = '208568-p-800.png'
          break
        case 'Sharm El Sheikh':
          img = 'dahab9-p-500.jpeg'
          break
        case 'Hurghada':
          img = 'dahab7.jpg'
          break
        case 'Alexandria':
          img = 'alex.jpg'
          break
        case 'Dahab':
          img = 'dahab3.jpg'
          break
        default:
          img = 'egypt.jpg'
          break
      }
      return img
    },
    getAllTitles (objectList) {
      const titles = []
      const separator = ', '
      for (const obj of objectList) {
        if (obj.adventrue.activityTitle != null) {
          titles.push(obj.adventrue.activityTitle)
        }
      }
      const resultString = titles.join(separator)
      return resultString
    },
    async changeDayNumber (index, num) {
      if (!this.packageStartDay) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select start date to custom your trip'
        this.loaded = false
      } else {
        this.panelExpandedActivities[index] = null
        this.packageDetails.activities[index].days_number += +num
        if (num === '1') {
          this.packageDetails.activities[index].days.push({
            day_number: this.packageDetails.activities[index].days_number,
            start: this.packageDetails.activities[index].days_number,
            days: []
          })
        } else {
          this.packageDetails.activities[index].days.splice(-1, 1)
        }
        if (!isNaN(this.packageDetails.activities[index].days_number) && this.packageDetails.activities[index].days_number > 0) {
          this.calcDaysFromDetails()
          await this.calculateAllPrice()
          return this.packageDetails.activities[index].days_number
        } else {
          this.packageDetails.activities[index].days_number = 1
        }
        this.calcDaysFromDetails()
        await this.calculateAllPrice()
      }
    },
    async addNewAdventureToActivity (activityIndex, dayIndex, cityId, day, dayActivities) {
      // console.log('dayActivities: ' + dayActivities)
      // console.log('addNewAdventureToActivity', day)
      if (!this.packageStartDay) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select start date to custom your trip'
        this.loaded = false
      } else {
        this.activityIndex = activityIndex
        this.dayIndex = dayIndex
        this.selectedDateForAddNewAdventure = day
        this.dayActivities = []
        const days = this.packageDetails.activities[activityIndex].days[dayIndex].days
        for (let x = 0; x < days.length; x++) {
          if (days[x].adventrue_id > 0) {
            this.dayActivities.push(days[x].adventrue_id)
          }
        }
        await this.getAdventures(cityId, day, this.dayActivities.join(','))
        this.showAddNewAdventuresDialog = true
      }
    },
    async getAdventures (cityId, day, activities) {
      this.isLoading = true
      // console.log(cityId)
      try {
        const promise = adventureServices.getCityAdventures(cityId, 1, day, activities)
        const response = await promise
        const results = response.data
        this.adventures = []
        if (results.data.ActivityList.length > 0) {
          this.adventures = results.data.ActivityList
          this.adventures.forEach((item) => {
            item.selected = true
            item.start_days = item.start_days.filter(data => !!data)
          })
        }
        this.isLoading = false
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
        this.loaded = false
        this.isLoading = false
      }
    },
    getDateHint () {
      let text = 'You can choose from allowed dates :'
      for (let index = 0; index < this.adventure.start_days.filter(item => !!item).length; index++) {
        if (this.adventure.start_days[index]) { text += this.adventure.start_days[index] + ',' }
      }
      if (!this.adventure.start_days.filter(item => !!item).length) { text = '' }
      return text
    },
    async addAdventureToSelected (adventure) {
      this.packageDetails.activities[this.activityIndex].days[this.dayIndex].days.push({ adventrue_id: adventure.activityID, adventrue: adventure })
      this.calcDaysFromDetails()
      await this.calculateAllPrice()
      if (this.checkResponseCode === false) {
        this.packageDetails.activities[this.activityIndex].days[this.dayIndex].days.splice(-1, 1)
      } else {
        this.showAddNewAdventuresDialog = false
      }
      this.calcDaysFromDetails()
    },
    allowedDates (val) {
      const date = new Date(val.replaceAll('-', '/'))
      let days = this.showDaysArray.filter(item => !!item)
      days = days.map(v => v.toLowerCase())
      const availabilities = this.packageDetails.availabilities
      let allowedDay = false
      let allowedDate = false

      for (const availability of availabilities) {
        const fromDate = new Date(availability.from_date.replaceAll('-', '/'))
        const toDate = new Date(availability.to_date.replaceAll('-', '/'))
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        toDate.setHours(23, 59, 59, 999)
        if (date > today && date >= fromDate && date <= toDate) {
          allowedDate = true
          break
        }
      }
      if (days.includes(date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()) || !days.length) { allowedDay = true }
      return allowedDay && allowedDate
    },
    uniqueAndFilter (arr) {
      let uniqueArr = [...new Set(arr)]
      uniqueArr = uniqueArr.filter(item => item.length > 0)
      return uniqueArr
    },
    async itemAction (actionType, cityId, activityIndex, dayIndex, adventureIndex, adventureDetails) {
      if (!this.packageStartDay) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select start date to custom your trip'
        this.loaded = false
      } else {
        if (actionType === 'replace') {
          this.activityIndex = activityIndex
          this.dayIndex = dayIndex
          this.adventureIndex = adventureIndex
          await this.getAdventures(cityId)
          this.showReplaceAdventureDialog = true
          await this.calculateAllPrice()
        }

        if (actionType === 'view') {
          this.adventureDetails = adventureDetails
          this.showAdventureDetailsDialog = true
          await this.calculateAllPrice()
        }

        if (actionType === 'remove') {
          this.packageDetails.activities[activityIndex].days[dayIndex].days.splice(adventureIndex, 1)
          this.calcDaysFromDetails()
          await this.calculateAllPrice()
        }
      }
    },
    async replaceAdventureSelected (adventure) {
      this.packageDetails.activities[this.activityIndex].days[this.dayIndex].days[this.adventureIndex] = { adventrue_id: adventure.activityID, adventrue: adventure }
      this.calcDaysFromDetails()
      await this.calculateAllPrice()
      this.showReplaceAdventureDialog = false
    },
    viewCruiseDetails (cruise) {
      this.cruiseDetails = cruise
      this.showCruiseDetailsDialog = true
    },
    async calculateAllPrice () {
      const formData = new FormData()
      formData.append('package_id', this.packageDetails.packageID)
      formData.append('adults', this.travellers)
      formData.append('children', this.children)
      formData.append('date', this.packageStartDay)
      // formData.append('date', this.selectedDateForAddNewAdventure)
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
              formData.append('rooms[' + r + '][ages][' + rx + ']', this.rooms[r].ageSelects[rx].age)
            }
          }
        }
      }
      let indexCount = 0
      const activities = this.packageDetails.activities
      for (let i = 0; i < activities.length; i++) {
        const activity = activities[i].days
        for (let x = 0; x < activity.length; x++) {
          const days = activity[x].days
          const startFormatDay = activity[x].start_format_day
          formData.append('activities[' + indexCount + '][startFormatDay]', startFormatDay)
          for (let y = 0; y < days.length; y++) {
            const adventures = days[y]
            formData.append('activities[' + indexCount + '][adventures][' + y + ']', adventures.adventrue_id)
          }
          indexCount++
        }
      }
      try {
        const promise = adventureServices.calculatePackagePrice(formData)
        const response = await promise
        const results = response.data
        if (results.status === 200) {
          this.initialPrice = results.totalPrice
          this.totalAllPrices = this.getFinalTotalPrices()
          this.priceSessionId = results.sessionId
          this.checkResponseCode = true
        } else {
          this.loaded = false
          this.checkResponseCode = false
        }
      } catch (error) {
        // this.snackbar = true
        // this.color = 'error'
        // this.text = 'Something went wrong'
        this.loaded = false
        this.checkResponseCode = false
      }
    },
    calcDaysFromDetails () {
      this.startingDay = 0
      const activities = this.packageDetails.activities
      for (let i = 0; i < activities.length; i++) {
        if (activities[i].type === 'adventure') {
          const activity = activities[i].days
          for (let x = 0; x < activity.length; x++) {
            activity[x].start_day = ++this.startingDay
            activity[x].start_format_day = this.formatDateAllDays(this.packageStartDay, activity[x].start_day, 'default')
            activity[x].start_text_day = this.formatDateAllDays(this.packageStartDay, activity[x].start_day)
          }
        } else {
          const startDay = this.startingDay + 1
          this.startingDay += activities[i].days_number
          const endDay = this.startingDay
          activities[i].package_day = startDay + '-' + endDay
          activities[i].package_text_day = this.packageStartDay != null ? (this.formatDateAllDays(this.packageStartDay, startDay) + ' - ' + this.formatDateAllDays(this.packageStartDay, endDay)) : null
          activities[i].start_day = startDay
          activities[i].end_day = endDay
        }
      }
    },
    bookAdventures () {
      const calculatedTotalPrice = this.getFinalTotalPrices() // Ensure this returns the correct total
      const calculatedFinalPrice = calculatedTotalPrice // Or apply any final adjustments
      this.$store.dispatch('setTravellersNumber', {
        adults: this.travellers,
        children: this.children,
        totalPrice: calculatedTotalPrice,
        totalAllPrices: calculatedFinalPrice,
        packageStartDay: this.packageStartDay,
        packageDetails: this.packageDetails,
        priceSessionId: this.priceSessionId,
        ratePlanCode: this.RatePlanCode,
        bookingRule: this.getbookingRule,
        bookingInfo: this.getBookingCode,
        hotelStartDate: this.hotelStartDate,
        hotelEndDate: this.hotelEndDate,
        ratePlanCodes: this.RatePlanCodes,
        bookingRules: this.getbookingRules,
        bookingInfos: this.getBookingCodes,
        hotelStartDates: this.hotelStartDates,
        hotelEndDates: this.hotelEndDates,
        finalBookHotelFormData: this.finalBookHotelFormData,
        finalBookHotelsFormData: this.finalBookHotelsFormData,
        hotelJPCode: this.selectedHotelJPCode,
        hotelJPCodes: this.selectedHotelCodes,
        checkHasCruise: this.checkHasCruise
      })
      this.$router.push({ name: 'booking-module', params: { module: 'trip' } })
    },
    openGallery () {
      this.showGallery = true
    },
    showHotelDetails (hotelIndex) {
      this.gtaHotelDetails = this.listGtaHotelDetails[hotelIndex]
      this.showHotelGtaDetails = true
    },
    selectHotelGta (getHotelIndex) {
      this.listGtaHotelDetails[this.selectedCityHotelIndex] = this.listGtaHotelJpds[getHotelIndex]
      this.showHotelsDialog = false
    },
    async checkHotelAvailability () {
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
        this.hotelAvailsArray = []
        const formData = new FormData()
        formData.append('start_date', this.hotelStartDate)
        formData.append('end_date', this.hotelEndDate)
        formData.append('board', this.boardType.Type)
        const hotels = this.listGtaHotelDetails
        for (let i = 0; i < hotels.length; i++) {
          formData.append('hotels[' + i + ']', hotels[i].JPCode)
        }
        // if (hotels.length > 1) {
        //   formData.append('hotels[' + 0 + ']', 'JP046300')
        //   formData.append('hotels[' + 1 + ']', 'JP077424')
        // } else {
        //   formData.append('hotels[' + 0 + ']', 'JP046300')
        // }
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
                formData.append('rooms[' + r + '][ages][' + rx + ']', this.rooms[r].ageSelects[rx].age)
              }
            }
            formData.append('rooms[' + r + '][category]', this.rooms[r].roomCategory.Type)
          }
        }
        try {
          const promise = tripsServices.checkHotelAvailabilities(formData)
          const response = await promise
          console.log(response)
          const results = response.data.AvailabilityRS
          if (results.Errors !== undefined) {
            this.snackbar = true
            this.color = 'error'
            this.text = this.errorMessage(results.Errors.Error.Text)
            this.loaded = false
            this.checkResponseCode = false
            this.isLoading = false
          } else {
            this.isAvailable = true
            const hotelResults = results.Results.HotelResult
            console.log(hotelResults)
            if (hotels.length > 1) {
              for (let index = 0; index < hotelResults.length; index++) {
                this.hotelAvailsArray.push(hotelResults[index])
                this.selectedHotelStartDate = this.hotelStartDate
                this.selectedHotelEndDate = this.hotelEndDate
              }
              this.hotelAvails = hotelResults[0]
            } else {
              this.hotelAvails = hotelResults
            }
            this.checkResponseCode = true
            this.isLoading = false
          }
        } catch (error) {
          // this.snackbar = true
          // this.color = 'error'
          // this.text = 'Something went wrong'
          this.loaded = false
          this.checkResponseCode = false
          this.isLoading = false
        }
      }
    },
    async checkHotelAvailabilityByHotel (hotelDetail, hotelIndex) {
      if (this.travellers === 0) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select Number of Adult'
        this.loaded = false
      } else if (this.hotelStartDates[hotelIndex] === null || this.hotelEndDates[hotelIndex] === null) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select Start Date and End Date'
        this.loaded = false
      } else {
        this.isLoading = true
        this.hotelAvailsArray = []
        const formData = new FormData()
        formData.append('start_date', this.hotelStartDates[hotelIndex])
        formData.append('end_date', this.hotelEndDates[hotelIndex])
        formData.append('board', this.boardType.Type || '')
        formData.append('hotels[' + 0 + ']', hotelDetail.Code)
        formData.append('adults', this.travellers || 1)
        formData.append('children', this.children || 0)

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
                formData.append('rooms[' + r + '][ages][' + rx + ']', this.rooms[r].ageSelects[rx].age)
              }
            }
            formData.append('rooms[' + r + '][category]', this.rooms[r].roomCategory.Type)
          }
        }

        try {
          const response = await tripsServices.checkHotelAvailabilities(formData)
          console.log(response)

          const results = response.data.data?.AvailabilityRS?.Results?.HotelResult
          const errorResponse = response.data.data?.AvailabilityRS?.Errors?.Error

          if (errorResponse) {
            this.snackbar = true
            this.color = 'error'
            this.text = errorResponse.Text || 'An error occurred'
            this.loaded = false
            this.checkResponseCode = false
            this.isLoading = false
          } else {
            const singleHotelDataResponse = results
            this.singleHotelData = {
              data: singleHotelDataResponse,
              index: hotelIndex
            }

            this.isAvailable = true
            this.isAvailables[hotelIndex] = true
            const hotelResults = results?.Results?.HotelResult
            this.hotelAvails = hotelResults
            this.hotelAvailsList[hotelIndex] = hotelResults
            this.checkResponseCode = true
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
    // async checkHotelAvailabilityByHotel (hotelDetail, hotelIndex) {
    //   if (this.travellers === 0) {
    //     this.snackbar = true
    //     this.color = 'error'
    //     this.text = 'Please select Number of Adult'
    //     this.loaded = false
    //   } else if (this.hotelStartDates[hotelIndex] === null || this.hotelEndDates[hotelIndex] === null) {
    //     this.snackbar = true
    //     this.color = 'error'
    //     this.text = 'Please select Start Date and End Date'
    //     this.loaded = false
    //   } else {
    //     this.isLoading = true
    //     this.hotelAvailsArray = []
    //     const formData = new FormData()
    //     formData.append('start_date', this.hotelStartDates[hotelIndex])
    //     formData.append('end_date', this.hotelEndDates[hotelIndex])
    //     formData.append('board', this.boardType.Type || 'all')
    //     formData.append('hotels[' + 0 + ']', hotelDetail.Code)
    //     formData.append('adults', this.travellers || 1)
    //     formData.append('children', this.children || 0)

    //     if (this.ageSelects.length > 0) {
    //       for (let x = 0; x < this.ageSelects.length; x++) {
    //         formData.append('ages[' + x + ']', this.ageSelects[x].age)
    //       }
    //     }

    //     if (this.rooms.length > 0) {
    //       for (let r = 0; r < this.rooms.length; r++) {
    //         formData.append('rooms[' + r + '][travellers]', this.rooms[r].travelers)
    //         formData.append('rooms[' + r + '][children]', this.rooms[r].children)
    //         if (this.rooms[r].ageSelects.length > 0) {
    //           for (let rx = 0; rx < this.rooms[r].ageSelects.length; rx++) {
    //             formData.append('rooms[' + r + '][ages][' + rx + ']', this.rooms[r].ageSelects[rx].age)
    //           }
    //         }
    //         formData.append('rooms[' + r + '][category]', this.rooms[r].roomCategory.Type)
    //       }
    //     }

    //     try {
    //       const promise = tripsServices.checkHotelAvailabilities(formData)
    //       const response = await promise
    //       const results = response.data.data?.AvailabilityRS?.Results.HotelResult
    //       const singleHotelDataResponse = response.data?.data.AvailabilityRS?.Results?.HotelResult

    //       // Set `singleHotelData` with both hotel data and index for correct display condition
    //       this.singleHotelData = {
    //         data: singleHotelDataResponse,
    //         index: hotelIndex
    //       }

    //       if (results.Errors !== undefined) {
    //         this.snackbar = true
    //         this.color = 'error'
    //         this.text = this.errorMessage(results.Errors.Error.Text)
    //         this.loaded = false
    //         this.checkResponseCode = false
    //         this.isLoading = false
    //       } else {
    //         this.isAvailable = true
    //         this.isAvailables[hotelIndex] = true
    //         this.hotelAvails = results.Results.HotelResult
    //         this.hotelAvailsList[hotelIndex] = results.Results.HotelResult
    //         this.checkResponseCode = true
    //         this.isLoading = false
    //       }
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

    openBookFlight () {
      window.open('https://flights.tanefer.com', '_blank')
    },
    getTotalHotelPrices () {
      const hotelAvailPricesList = this.hotelAvailPrices
      let hotelAvailPrices = 0
      for (let x = 0; x < hotelAvailPricesList.length; x++) {
        hotelAvailPrices += hotelAvailPricesList[x]
      }
      return hotelAvailPrices
    },
    getFinalTotalPrices () {
      const initialPrice = this.initialPrice || 0
      const hotelPrice = this.hotelPrices || 0
      const hotelAvailPricesList = this.hotelAvailPrices || []
      const additionalPrice = this.additionalPrice || 0
      const percentagePrice = this.discountPercentage || 0

      // Calculate hotelAvailPrices, ensuring it only sums numeric values
      let hotelAvailPrices = 0
      for (let x = 0; x < hotelAvailPricesList.length; x++) {
        const price = hotelAvailPricesList[x] || 0
        hotelAvailPrices += price
      }

      // Log each part to debug
      console.log('Initial Price:', initialPrice)
      console.log('Hotel Price:', hotelPrice)
      console.log('Hotel Available Prices Total:', hotelAvailPrices)
      console.log('Additional Price:', additionalPrice)
      console.log('Discount Percentage:', percentagePrice)

      const getAllPositivePrices = initialPrice + hotelPrice + additionalPrice
      const getDiscountPercentagePrice = percentagePrice === 0 ? 0 : (getAllPositivePrices * percentagePrice / 100)
      const totalAllPrices = getAllPositivePrices - getDiscountPercentagePrice

      // Log the final computed prices
      console.log('Total All Prices (Before Discount):', getAllPositivePrices)
      console.log('Discounted Amount:', getDiscountPercentagePrice)
      console.log('Total All Prices (After Discount):', totalAllPrices)

      return totalAllPrices
    },
    // getFinalTotalPrices () {
    //   const initalPrice = this.initialPrice
    //   const hotelPrice = this.hotelPrices
    //   const hotelAvailPricesList = this.hotelAvailPrices
    //   let hotelAvailPrices = 0
    //   for (let x = 0; x < hotelAvailPricesList.length; x++) {
    //     hotelAvailPrices += hotelAvailPricesList[x]
    //   }
    //   const additionalPrice = this.additionalPrice
    //   const percentagePrice = this.discountPercentage
    //   const getAllPositivePrices = initalPrice + hotelPrice + hotelAvailPrices + additionalPrice
    //   const getDiscountPercentagePrice = percentagePrice === 0 ? 0 : (getAllPositivePrices * percentagePrice / 100)
    //   const totalAllPrices = getAllPositivePrices - getDiscountPercentagePrice
    //   return totalAllPrices
    // },
    // selectRoomHotelGta (AvailIndex, hotelAvailListIndex) {
    // selectRoomHotelGta (hotelIndex, roomIndex) {
    //   // Access the hotel data from `singleHotelData` or `hotelAvailsList`
    //   const hotelData = this.listGtaHotelDetails[hotelIndex]
    //   const roomOptions = this.getRoomOptions(hotelData?.HotelOptions?.HotelOption)

    //   if (hotelData && roomOptions && roomOptions[roomIndex]) {
    //     const selectedRoom = roomOptions[roomIndex]

    //     // Store selected room data
    //     this.selectedRoomGtaArray[hotelIndex] = selectedRoom
    //     this.getRatePlanCodes[hotelIndex] = selectedRoom.RatePlanCode
    //     this.hotelAvailPrices[hotelIndex] = selectedRoom.Prices.Price.TotalFixAmounts.Nett

    //     // Update hotel details for selected room
    //     this.selectedHotelCodes[hotelIndex] = hotelData.Code
    //     this.selectedHotelJPCodes[hotelIndex] = hotelData.JPCode
    //     this.selectedHotelJPDCodes[hotelIndex] = hotelData.JPDCode

    //     // Add room price to total price
    //     this.hotelPrices += selectedRoom.Prices.Price.TotalFixAmounts.Nett
    //     this.totalAllPrices = this.getFinalTotalPrices()
    //   } else {
    //     console.error('Hotel or room data not found for hotelIndex', hotelIndex, 'and roomIndex', roomIndex)
    //   }

    //   this.showRoomsDialog = false
    // },
    // selectRoomHotelGta (hotelIndex, roomIndex) {
    //   // this.showHotelCards = false
    //   // Access the hotel data from `singleHotelData`
    //   const hotelData = this.singleHotelData?.data
    //   const roomOptions = this.getRoomOptions(hotelData?.HotelOptions?.HotelOption)

    //   if (roomOptions.length === 0) {
    //     this.snackbar = true
    //     this.color = 'error'
    //     this.text = 'No rooms available for this hotel'
    //     return
    //   }

    //   if (hotelData && roomOptions[roomIndex]) {
    //     const selectedRoom = roomOptions[roomIndex]
    //     this.isRoomChoosed = true
    //     console.log(selectedRoom)
    //     this.selectedRoomGtaArray[hotelIndex] = selectedRoom
    //     console.log('the rooms array is:', this.selectedRoomGtaArray[hotelIndex])
    //     this.getRatePlanCodes[hotelIndex] = selectedRoom.RatePlanCode
    //     this.hotelAvailPrices[hotelIndex] = selectedRoom.Prices.Price.TotalFixAmounts.Nett

    //     this.selectedHotelCodes[hotelIndex] = hotelData.Code
    //     this.selectedHotelJPCodes[hotelIndex] = hotelData.JPCode
    //     this.selectedHotelJPDCodes[hotelIndex] = hotelData.JPDCode

    //     this.hotelPrices += selectedRoom.Prices.Price.TotalFixAmounts.Nett
    //     this.totalAllPrices = this.getFinalTotalPrices()
    //   } else {
    //     console.error('Hotel or room data not found for hotelIndex', hotelIndex, 'and roomIndex', roomIndex)
    //   }

    //   this.showRoomsDialog = false
    // },
    // selectRoomHotelGta (hotelIndex, roomIndex) {
    // // Ensure `isRoomSelected` is an array of objects for each hotel
    //   if (!this.isRoomSelected[hotelIndex]) {
    //     this.$set(this.isRoomSelected, hotelIndex, {})
    //   }

    //   // Update selection state for the specific hotel and room
    //   this.$set(this.isRoomSelected[hotelIndex], roomIndex, true)

    //   const hotelData = this.singleHotelData?.data
    //   const roomOptions = this.getRoomOptions(hotelData?.HotelOptions?.HotelOption)

    //   if (roomOptions.length === 0) {
    //     this.snackbar = true
    //     this.color = 'error'
    //     this.text = 'No rooms available for this hotel'
    //     return
    //   }

    //   if (hotelData && roomOptions[roomIndex]) {
    //     const selectedRoom = roomOptions[roomIndex]
    //     console.log(selectedRoom)
    //     this.selectedRoomGtaArray[hotelIndex] = [selectedRoom]
    //     console.log('the rooms array is:', this.selectedRoomGtaArray[hotelIndex])
    //     if (!this.selectedRoomGtaArray[hotelIndex]) {
    //       this.$set(this.selectedRoomGtaArray, hotelIndex, [])
    //     }
    //     this.getRatePlanCodes[hotelIndex] = selectedRoom.RatePlanCode
    //     this.hotelAvailPrices[hotelIndex] = selectedRoom.Prices.Price.TotalFixAmounts.Nett

    //     this.selectedHotelCodes[hotelIndex] = hotelData.Code
    //     this.selectedHotelJPCodes[hotelIndex] = hotelData.JPCode
    //     this.selectedHotelJPDCodes[hotelIndex] = hotelData.JPDCode

    //     this.hotelPrices += selectedRoom.Prices.Price.TotalFixAmounts.Nett
    //     this.totalAllPrices = this.getFinalTotalPrices()
    //   } else {
    //     console.error('Hotel or room data not found for hotelIndex', hotelIndex, 'and roomIndex', roomIndex)
    //   }

    //   this.showRoomsDialog = false
    // },
    selectRoomHotelGta (hotelIndex, roomIndex) {
      // Ensure `isRoomSelected` is an array of objects for each hotel
      if (!this.isRoomSelected[hotelIndex]) {
        this.$set(this.isRoomSelected, hotelIndex, {})
      }

      // Update selection state for the specific hotel and room
      this.$set(this.isRoomSelected[hotelIndex], roomIndex, true)

      const hotelData = this.singleHotelData?.data
      const roomOptions = this.getRoomOptions(hotelData?.HotelOptions?.HotelOption)

      if (!roomOptions || roomOptions.length === 0) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'No rooms available for this hotel'
        return
      }

      if (hotelData && roomOptions[roomIndex]) {
        const selectedRoom = roomOptions[roomIndex]
        console.log('Selected Room:', selectedRoom)

        // Ensure selectedRoomGtaArray is initialized for this hotelIndex
        if (!this.selectedRoomGtaArray[hotelIndex]) {
          this.$set(this.selectedRoomGtaArray, hotelIndex, [])
        }

        // Add the selected room to the array if not already selected
        if (!this.selectedRoomGtaArray[hotelIndex].includes(selectedRoom)) {
          this.selectedRoomGtaArray[hotelIndex].push(selectedRoom)
          console.log('Updated rooms array for hotelIndex:', hotelIndex, this.selectedRoomGtaArray[hotelIndex])
        }

        // Update rate plan and other hotel-related codes
        this.getRatePlanCodes[hotelIndex] = selectedRoom.RatePlanCode
        this.hotelAvailPrices[hotelIndex] = selectedRoom.Prices.Price.TotalFixAmounts.Nett
        this.selectedHotelCodes[hotelIndex] = hotelData.Code
        this.selectedHotelJPCodes[hotelIndex] = hotelData.JPCode
        this.selectedHotelJPDCodes[hotelIndex] = hotelData.JPDCode

        // Recalculate the total price for all selected rooms
        this.hotelPrices = this.selectedRoomGtaArray.reduce((total, rooms) => {
          return total + rooms.reduce((sum, room) => sum + room.Prices.Price.TotalFixAmounts.Nett, 0)
        }, 0)

        // this.totalAllPrices = this.getFinalTotalPrices()
        console.log('Total Hotel Prices:', this.hotelPrices, 'Total All Prices:', this.totalAllPrices)
      } else {
        console.error('Hotel or room data not found for hotelIndex', hotelIndex, 'and roomIndex', roomIndex)
      }

      this.showRoomsDialog = false
    },

    //   if (this.hotelAvailsArray.length > 0) {
    //     this.selectedRoomGtaArray.push(this.hotelAvails.HotelOptions.HotelOption)
    //     this.getRatePlanCodeArray.push(this.hotelAvails.HotelOptions.HotelOption.RatePlanCode)
    //     this.getRatePlanCodes.push(this.hotelAvails.HotelOptions.HotelOption.RatePlanCode)
    //     this.hotelPrices += this.hotelAvails.HotelOptions.HotelOption.Prices.Price.TotalFixAmounts.Nett
    //     this.selectedHotelCodeArray.push(this.hotelAvails.Code)
    //     this.selectedHotelJPCodeArray.push(this.hotelAvails.JPCode)
    //     this.selectedHotelJPDCodeArray.push(this.hotelAvails.JPDCode)
    //   } else {
    //     const getHotelAvailInfo = this.hotelAvailsList[hotelAvailListIndex]
    //     if (Array.isArray(getHotelAvailInfo.HotelOptions.HotelOption)) {
    //       this.selectedRoomGtas[hotelAvailListIndex] = getHotelAvailInfo.HotelOptions.HotelOption[AvailIndex]
    //       // this.selectedRoomGtaArray.push(getHotelAvailInfo.HotelOptions.HotelOption[AvailIndex])
    //       this.selectedRoomGtaArray[hotelAvailListIndex] = getHotelAvailInfo.HotelOptions.HotelOption[AvailIndex]
    //       this.getRatePlanCodes[hotelAvailListIndex] = getHotelAvailInfo.HotelOptions.HotelOption[AvailIndex].RatePlanCode
    //       this.hotelPrices = getHotelAvailInfo.HotelOptions.HotelOption[AvailIndex].Prices.Price.TotalFixAmounts.Nett
    //       this.hotelAvailPrices[hotelAvailListIndex] = getHotelAvailInfo.HotelOptions.HotelOption[AvailIndex].Prices.Price.TotalFixAmounts.Nett
    //     } else {
    //       this.selectedRoomGtas[hotelAvailListIndex] = getHotelAvailInfo.HotelOptions.HotelOption
    //       // this.selectedRoomGtaArray.push(getHotelAvailInfo.HotelOptions.HotelOption)
    //       this.selectedRoomGtaArray[hotelAvailListIndex] = getHotelAvailInfo.HotelOptions.HotelOption
    //       this.getRatePlanCodes[hotelAvailListIndex] = getHotelAvailInfo.HotelOptions.HotelOption.RatePlanCode
    //       this.hotelPrices = getHotelAvailInfo.HotelOptions.HotelOption.Prices.Price.TotalFixAmounts.Nett
    //       this.hotelAvailPrices[hotelAvailListIndex] = getHotelAvailInfo.HotelOptions.HotelOption.Prices.Price.TotalFixAmounts.Nett
    //     }
    //     this.selectedHotelCodes[hotelAvailListIndex] = getHotelAvailInfo.Code
    //     this.selectedHotelJPCodes[hotelAvailListIndex] = getHotelAvailInfo.JPCode
    //     this.selectedHotelJPDCodes[hotelAvailListIndex] = getHotelAvailInfo.JPDCode
    //   }
    //   this.totalAllPrices = this.getFinalTotalPrices()
    //   this.showRoomsDialog = false
    // },
    // async confirmSelectedRoom () {
    //   this.isLoading = true
    //   if (this.getRatePlanCodes.length > 0) {
    //     for (let x = 0; x < this.getRatePlanCodes.length; x++) {
    //       const formData = new FormData()
    //       formData.append('RatePlanCode', this.getRatePlanCodes[x])
    //       formData.append('StartDate', this.hotelStartDates[x])
    //       formData.append('EndDate', this.hotelEndDates[x])
    //       formData.append('HotelCode', this.selectedHotelCodes[x])
    //       try {
    //         const promise = tripsServices.getBookingRules(formData)
    //         const response = await promise
    //         console.log(response)
    //         const results = response.data.BookingRulesRS
    //         if (results.Errors !== undefined) {
    //           this.snackbar = true
    //           this.color = 'error'
    //           this.text = this.errorMessage(results.Errors.Error.Text)
    //           this.loaded = false
    //           this.checkResponseCode = false
    //           this.isLoading = false
    //         } else {
    //           this.getbookingRules[x] = results.Results.HotelResult
    //           this.getbookingRuleArray.push(results.Results.HotelResult)
    //           this.confirmedSelectedRoom = true
    //           this.isLoading = false
    //         }
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
    //   if (this.getRatePlanCodes.length === 0 && this.getRatePlanCode) {
    //     const formData = new FormData()
    //     formData.append('RatePlanCode', this.getRatePlanCode)
    //     // formData.append('StartDate', this.selectedHotelStartDate)
    //     formData.append('StartDate', this.hotelStartDate)
    //     // formData.append('EndDate', this.selectedHotelEndDate)
    //     formData.append('EndDate', this.hotelEndDate)
    //     formData.append('HotelCode', this.selectedHotelJPCode)
    //     try {
    //       const promise = tripsServices.getBookingRules(formData)
    //       const response = await promise
    //       console.log(response)
    //       const results = response.data.BookingRulesRS
    //       if (results.Errors !== undefined) {
    //         this.snackbar = true
    //         this.color = 'error'
    //         this.text = this.errorMessage(results.Errors.Error.Text)
    //         this.loaded = false
    //         this.checkResponseCode = false
    //         this.isLoading = false
    //       } else {
    //         this.getbookingRule = results.Results.HotelResult
    //         this.confirmedSelectedRoom = true
    //         this.isLoading = false
    //       }
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

    // async confirmSelectedRoom () {
    //   this.isLoading = true
    //   this.getbookingRules = [] // Initialize to avoid undefined errors

    //   if (this.getRatePlanCodes.length > 0) {
    //     for (let x = 0; x < this.getRatePlanCodes.length; x++) {
    //       const formData = new FormData()
    //       formData.append('RatePlanCode', this.getRatePlanCodes[x])
    //       formData.append('StartDate', this.hotelStartDates[x])
    //       formData.append('EndDate', this.hotelEndDates[x])
    //       formData.append('HotelCode', this.selectedHotelCodes[x])

    //       try {
    //         const promise = tripsServices.getBookingRules(formData)
    //         const response = await promise
    //         console.log(response)
    //         const results = response.data.BookingRulesRS

    //         if (results.Errors !== undefined) {
    //           // this.snackbar = true
    //           // this.color = 'error'
    //           // this.text = this.errorMessage(results.Errors.Error.Text)
    //           this.loaded = false
    //           this.checkResponseCode = false
    //           this.isLoading = false
    //         } else {
    //           this.getbookingRules[x] = results.Results.HotelResult
    //           this.getbookingRuleArray.push(results.Results.HotelResult)
    //           this.confirmedSelectedRoom = true
    //           this.isLoading = false
    //         }
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

    //   console.log('getbookingRules after confirmSelectedRoom:', this.getbookingRules)
    // },
    async confirmSelectedRoom () {
      this.isLoading = true
      this.getbookingRules = [] // Initialize to avoid undefined errors
      this.$store.dispatch('modules/booking/resetMultipleBookingData') // Clear previous multiple bookings

      if (this.getRatePlanCodes.length > 0) {
        for (let x = 0; x < this.getRatePlanCodes.length; x++) {
          const formData = new FormData()
          formData.append('RatePlanCode', this.getRatePlanCodes[x])
          formData.append('StartDate', this.hotelStartDates[x])
          formData.append('EndDate', this.hotelEndDates[x])
          formData.append('HotelCode', this.selectedHotelCodes[x])

          try {
            const promise = tripsServices.getBookingRules(formData)
            const response = await promise
            console.log(response)
            const results = response.data.BookingRulesRS

            if (results.Errors !== undefined) {
              // Handle errors
              this.loaded = false
              this.checkResponseCode = false
              this.isLoading = false
            } else {
              this.getbookingRules[x] = results.Results.HotelResult
              this.getbookingRuleArray.push(results.Results.HotelResult)
              this.confirmedSelectedRoom = true

              // Dispatch data to store for multiple hotels
              this.$store.dispatch('modules/booking/addMultipleBookingResponse', results)

              this.isLoading = false
            }
          } catch (error) {
            // this.snackbar = true
            // this.color = 'error'
            // this.text = 'Something went wrong'
            this.loaded = false
            this.checkResponseCode = false
            this.isLoading = false
          }
        }
      }

      console.log('getbookingRules after confirmSelectedRoom:', this.getbookingRules)
    },
    assignPhone (phone) {
      this.phone = phone
    },
    // async finalBookHotel () {
    //   this.isLoading = true
    //   if (this.getbookingRules.length > 0) {
    //     for (let x = 0; x < this.getbookingRules.length; x++) {
    //       const formData = new FormData()
    //       const bookingCode = this.getbookingRules[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.BookingCode._
    //       const startDate = this.getbookingRules[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Start
    //       const endDate = this.getbookingRules[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.End
    //       const HotelCode = this.getbookingRules[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.HotelCode
    //       const minimumPrice = this.getbookingRules[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Minimum
    //       const maximumPrice = this.getbookingRules[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Maximum
    //       const currency = this.getbookingRules[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Currency
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
    //       formData.append('board', this.boardType.Type)
    //       formData.append('identification_document_pax', this.identification_document_pax)
    //       formData.append('address_pax', this.address_pax)
    //       formData.append('city_pax', this.city_pax)
    //       formData.append('country_pax', this.country_pax)
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
    //           formData.append('rooms[' + r + '][category]', this.rooms[r].roomCategory.Type)
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
    //         const promise = tripsServices.finalBookHotel(formData)
    //         const response = await promise
    //         console.log(response)
    //         // const results = response.data.BookingRS
    //         const resultFormData = response.data.formDataId
    //         this.finalBookHotelFormData = resultFormData
    //         this.finalBookHotelsFormData[x] = resultFormData
    //         this.isBooked = true
    //         this.isLoading = false
    //         // if (results.Errors !== undefined) {
    //         //   this.snackbar = true
    //         //   this.color = 'error'
    //         //   this.text = this.errorMessage(results.Errors.Error.Text)
    //         //   this.loaded = false
    //         //   this.checkResponseCode = false
    //         //   this.isBooked = true
    //         //   this.isLoading = false
    //         // } else {
    //         //   this.getBookingCodeArray.push(results)
    //         //   this.isBooked = true
    //         //   this.isLoading = false
    //         // }
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
    //   if (this.getbookingRules.length === 0 && this.getbookingRule) {
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
    //     formData.append('board', this.boardType.Type)
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
    //         formData.append('rooms[' + r + '][category]', this.rooms[r].roomCategory.Type)
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
    //       const promise = tripsServices.finalBookHotel(formData)
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
    //       //   this.text = this.errorMessage(results.Errors.Error.Text)
    //       //   this.loaded = false
    //       //   this.checkResponseCode = false
    //       //   this.isBooked = true
    //       //   this.isLoading = false
    //       // } else {
    //       //   this.getBookingCode = results
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
    // async finalBookHotel () {
    //   this.isLoading = true

    //   if (this.getbookingRules.length > 0) {
    //     for (let x = 0; x < this.getbookingRules.length; x++) {
    //       const bookingRule = this.getbookingRules[x]
    //       if (!bookingRule) {
    //         console.error(`Booking rule at index ${x} is undefined.`)
    //         continue // Skip this iteration if booking rule is undefined
    //       }

    //       const formData = new FormData()
    //       const bookingCode = bookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.BookingCode._
    //       const startDate = bookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Start
    //       const endDate = bookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.End
    //       const HotelCode = bookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.HotelCode
    //       const minimumPrice = bookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Minimum
    //       const maximumPrice = bookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Maximum
    //       const currency = bookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Currency

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
    //       formData.append('board', this.boardType.Type || 'all')
    //       formData.append('identification_document_pax', this.identification_document_pax)
    //       formData.append('address_pax', this.address_pax || '')
    //       formData.append('city_pax', this.city_pax || '')
    //       formData.append('country_pax', this.country_pax || '')
    //       formData.append('postal_code_pax', this.postal_code_pax || '')
    //       formData.append('book_after_payment', '1')

    //       // Add room data and booking names
    //       if (this.rooms.length > 0) {
    //         for (let r = 0; r < this.rooms.length; r++) {
    //           formData.append(`rooms[${r}][travellers]`, this.rooms[r].travelers)
    //           formData.append(`rooms[${r}][children]`, this.rooms[r].children)
    //           if (this.rooms[r].ageSelects.length > 0) {
    //             for (let rx = 0; rx < this.rooms[r].ageSelects.length; rx++) {
    //               formData.append(`rooms[${r}][ages][${rx}]`, this.rooms[r].ageSelects[rx].age)
    //             }
    //           }
    //           formData.append(`rooms[${r}][category]`, this.rooms[r].roomCategory.Type)
    //         }
    //       }

    //       // Handle booking names and surnames for both adults and children
    //       const namesArray = { names: this.bNames, surnames: this.bSurnames, ages: this.bAges, namesChild: this.bNamesChild, surnamesChild: this.bSurnamesChild, agesChild: this.bAgesChild }
    //       Object.entries(namesArray).forEach(([key, array]) => {
    //         array.forEach((item, idx) => formData.append(`${key}[${idx}]`, item))
    //       })

    //       try {
    //         const response = await tripsServices.finalBookHotel(formData)
    //         console.log(response)
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
    //   } else {
    //     console.error('getbookingRules array is empty or undefined.')
    //   }
    // },
    async finalBookHotel () {
      this.isLoading = true
      this.totalAllPrices = this.getFinalTotalPrices()

      // Filter out undefined entries from getbookingRules
      const validBookingRules = this.getbookingRules.filter(rule => rule)

      if (validBookingRules.length > 0) {
        for (let x = 0; x < validBookingRules.length; x++) {
          const bookingRule = validBookingRules[x]

          // Check if HotelOption is an array or an object and handle accordingly
          const hotelOption = Array.isArray(bookingRule.HotelOptions?.HotelOption)
            ? bookingRule.HotelOptions.HotelOption[0]
            : bookingRule.HotelOptions?.HotelOption

          if (!hotelOption || !hotelOption.HotelRequiredFields?.HotelBooking) {
            console.error(`Hotel option or booking details missing at index ${x}`)
            continue // Skip iteration if required booking data is missing
          }

          // Retrieve required fields safely
          const bookingCode = hotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.BookingCode?._
          const startDate = hotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo?.Start
          const endDate = hotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo?.End
          const HotelCode = hotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo?.HotelCode
          const minimumPrice = hotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo?.Price?.PriceRange?.Minimum
          const maximumPrice = hotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo?.Price?.PriceRange?.Maximum
          const currency = hotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo?.Price?.PriceRange?.Currency

          // Build formData for each booking
          const formData = new FormData()
          formData.append('bookingCode', bookingCode)
          formData.append('startDate', startDate)
          formData.append('endDate', endDate)
          formData.append('HotelCode', HotelCode)
          formData.append('minimumPrice', minimumPrice)
          formData.append('maximumPrice', maximumPrice)
          formData.append('currency', currency)
          formData.append('phone_number', this.phone.formattedNumber)
          formData.append('title', this.title)
          formData.append('name', this.name)
          formData.append('surname', this.surname)
          formData.append('age', this.age)
          formData.append('email', this.email)
          formData.append('nationality', this.issueCountry)
          formData.append('board', this.boardType.Type || 'all')
          formData.append('identification_document_pax', this.identification_document_pax)
          formData.append('address_pax', this.address_pax || '')
          formData.append('city_pax', this.city_pax || '')
          formData.append('country_pax', this.country_pax || '')
          formData.append('postal_code_pax', this.postal_code_pax || '')
          formData.append('book_after_payment', '1')

          // Add room data and booking names
          if (this.rooms.length > 0) {
            this.rooms.forEach((room, r) => {
              formData.append(`rooms[${r}][travellers]`, room.travelers)
              formData.append(`rooms[${r}][children]`, room.children || 0)
              room.ageSelects?.forEach((ageSelect, rx) => {
                formData.append(`rooms[${r}][ages][${rx}]`, ageSelect.age)
              })
              formData.append(`rooms[${r}][category]`, room.roomCategory?.Type || '')
            })
          }

          // Handle booking names and surnames for both adults and children
          const namesArray = {
            names: this.bNames,
            surnames: this.bSurnames,
            ages: this.bAges,
            namesChild: this.bNamesChild,
            surnamesChild: this.bSurnamesChild,
            agesChild: this.bAgesChild
          }
          Object.entries(namesArray).forEach(([key, array]) => {
            array.forEach((item, idx) => formData.append(`${key}[${idx}]`, item))
          })

          try {
            const response = await tripsServices.finalBookHotel(formData)
            console.log('Booking response:', response)
            const resultFormData = response.data.formDataId
            this.finalBookHotelFormData = resultFormData
            this.finalBookHotelsFormData[x] = resultFormData
            this.isBooked = true
            this.isLoading = false
          } catch (error) {
            console.error('Booking error:', error)
            this.snackbar = true
            this.color = 'error'
            this.text = 'Something went wrong'
            this.loaded = false
            this.checkResponseCode = false
            this.isLoading = false
          }
        }
      } else {
        console.error('getbookingRules array is empty or undefined.')
      }
    },
    onlyUniqueArray (value, index, array) {
      return array.indexOf(value) === index
    },
    onlyUniqueObjectsId (array) {
      const key = 'id'
      const arrayUniqueByKey = [...new Map(array.map(item => [item[key], item])).values()]
      return arrayUniqueByKey
    },
    async getRoomCategories () {
      // this.isLoading = true
      this.roomCategories = []
      this.boards = []
      try {
        const promise = tripsServices.getHotelCatalogueData()
        const response = await promise
        // console.log(response)
        const results = response.data.CatalogueDataRS
        if (results.Errors !== undefined) {
          this.snackbar = true
          this.color = 'error'
          this.text = this.errorMessage(results.Errors.Error.Text)
          this.loaded = false
          // this.isLoading = false
        } else {
          this.roomCategories = results.HotelStaticData.RoomCategoryList.RoomCategory
          this.boards = results.HotelStaticData.BoardList.Board
          // this.isLoading = false
        }
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
        this.loaded = false
        // this.isLoading = false
      }
    },
    async onChangeSelectAge (event) {
      await this.calculateAllPrice()
    },
    errorMessage (message) {
      // Find the index of the last occurrence of ". "
      const lastIndex = message.lastIndexOf('. ')
      // Extract the substring after the last occurrence of ". "
      return message.substring(lastIndex + 2)
    }
  }
}
</script>

<style scoped>
.w-form-formradioinput {
    display: none;
}
.day-by-day {
  max-width: 95%;
}
.trip-total-price {
  position: sticky;
  bottom: 2px;
  background-color: white;
}

.my-chip {
  font-size: 14px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
}

.text-truncate {
  display: inline-block;
  max-width: 100%;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.activity-img {
  height: 350px;
  width: 250px;
}
  .non-visiable {
    visibility: hidden;
  }
  .activity-title {
    font-size: 16px;
  }
  .no-of-guests {
    font-size: 18px;
    font-weight: bold;
  }
  .list {
  padding: 0;
  list-style-type: none;
}

.list-item {
  margin-bottom: 10px;
  font-size: 14px;
}
.v-btn-brown {
  background-color: sienna !important;
  color: white !important;
}

.v-btn-brown:hover {
  background-color: #A0522D !important;
}

.btn-latte {
  background-color: #d7b899 !important;
  color: #4F3316 !important;
}

.btn-beige {
  background-color: #e8d2ac !important;
  color: #4F3316 !important;
}

.btn-latte:hover, .btn-beige:hover {
  background-color: #c8a87b !important;
  color: #ffffff !important;
}

/* .list-item::before {
  content: '●';
  color: #4f3316;
  position: absolute;
  left: 0;
  top: 0;
  font-size: 12px;
  line-height: 14px;
} */
@media (max-width: 768px) {
  .my-chip {
    font-size: 8px !important;
    padding: 2px 4px !important;
    max-width: 90% !important;
  }
  .v-chip.v-size--large {
    font-size: 7px !important;
  }
  .adventure-details-tabs .v-tab {
    font-size: 12px !important;
    padding: 1px !important;
    font-weight: 800 !important;
  }

  .adventure-details-tabs .v-tabs-bar {
    margin-bottom: 3px !important;
  }
  /* .v-tabs:not(.v-tabs--vertical) .v-tab {
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
    font-size: 12px !important;
    padding: 8px 10px !important;
  }
  .v-tabs-bar {
    margin-bottom: 5px !important;
  }
  .v-slide-group__prev .v-slide-group__prev--disabled {
    margin-left: -50px !important;
  } */
  .activity-img-mobile {
    max-width: 100% !important;
  }
  .non-visiable {
    visibility: hidden;
  }
  .activity-title {
    font-size: 12px;
  }
  .no-of-guests {
    font-size: 14px;
    font-weight: bold;
  }
  .package-overview-date {
    margin-top: 70px;
  }
  .v-tabs-bar {
  padding-left: 0 !important;
}
::v-deep .v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev {
  display: none !important;
}

/* ::v-deep .v-text-field.v-text-field--enclosed {
 padding-bottom: 20px;
} */

::v-deep .v-expansion-panel-content__wrap {
  padding: 0px;
}
}

::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0px;
}

::v-deep button.primary--text {
  color: #DAA520 !important;
}

</style>
