<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable indent -->
<template>
  <div v-if="comingSoon" class="coming-soon">
    <h1>Coming Soon</h1>
    <p>We are working hard to bring you this page. Stay tuned!</p>
  </div>
  <div v-else>
    <LoadingScreen v-if="isLoading" />
    <v-container class="lighten-5" fluid style="margin-top: -7rem;">
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
      <!-- <div v-if="!listGtaHotelDetails.length"> -->
      <div v-if="showSearch && !isChoiceConfirmed" :style="isMobile ? { marginTop: '120px' } : {}">
        <div style="" class="px-0 my-5">
          <div>
            <v-card class="px-7 pt-7 pb-1" style="border-radius: 15px;">
              <v-row>
                <v-col cols="12" md="3">
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-width="0"
                    transition="scale-transition"
                    offset-y
                    max-height="300"
                    :style="{ minWidth: `${activatorWidth}px` }"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        ref="queryInput"
                        v-model="query"
                        prepend-inner-icon="mdi-map-marker"
                        label="Destination"
                        placeholder="Search for zones..."
                        solo
                        outlined
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                        @input="handleInput"
                      />
                    </template>
                    <template v-if="loading">
                      <div style="display: flex; justify-content: center; background-color: white; height: 100%;">
                        <v-progress-circular indeterminate color="primary" />
                      </div>
                    </template>
                    <v-list
                      v-else
                      style="overflow-y: auto; max-height: 300px;"
                      :style="{ minWidth: `${activatorWidth}px`, maxWidth: `${activatorWidth}px` }"
                    >
                      <v-list-item
                        v-for="zone in filteredZones"
                        :key="zone.id"
                        class="custom-list-item"
                        @click="handleZoneSelection(zone)"
                      >
                        <v-list-item-content class="custom-list-item-content">
                          <v-list-item-title>{{ zone.name }}</v-list-item-title>
                          <v-list-item-subtitle v-if="zone.parent_name">
                            {{ zone.parent_name }}
                            <span v-if="zone.grandparent_name">, {{ zone.grandparent_name }}</span>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="2">
                  <v-menu
                    v-model="menuStartDate"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    min-width="auto"
                  >
                    <template #activator="{ on }">
                      <v-text-field
                        v-model="hotelStartDateText"
                        label="Check in"
                        prepend-inner-icon="mdi-calendar-range"
                        append-inner-icon="mdi-pencil"
                        hide-details
                        readonly
                        outlined
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="hotelStartDate"
                      :min="minDate"
                      color="late"
                      @input="menuStartDate = false, formatDate(hotelStartDate, 1, 'hotelStartDate')"
                    />
                  </v-menu>
                </v-col>

                <!-- Check-out Date Picker -->
                <v-col cols="12" md="2">
                  <v-menu
                    v-model="menuEndDate"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    min-width="auto"
                  >
                    <template #activator="{ on }">
                      <v-text-field
                        v-model="hotelEndDateText"
                        label="Check out"
                        prepend-inner-icon="mdi-calendar-range"
                        append-inner-icon="mdi-pencil"
                        readonly
                        hide-details
                        outlined
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="hotelEndDate"
                      :min="hotelStartDate"
                      :allowed-dates="disableStartDate"
                      color="late"
                      @input="menuEndDate = false, formatDate(hotelEndDate, 1, 'hotelEndDate')"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                  <select-nationality @nationalitySelected="handleNationalitySelected" />
                </v-col>
                <v-col cols="12" md="2">
                  <rooms-and-guests @save="setGuests" />
                </v-col>
              </v-row>
              <div>
                <v-btn class="transparent-btn pa-1 mb-2" @click="toggleOptions">
                  {{ showMoreOptions ? 'Less Options' : 'More Options' }}
                  <v-icon class="ml-2">
                    {{ showMoreOptions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </v-btn>
                <v-row v-if="showMoreOptions">
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="selectedHotelName"
                      class=""
                      auto-select-first
                      clearable
                      outlined
                      hide-details
                      label="Hotel Name"
                      prepend-inner-icon="mdi-magnify-expand"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="selectedHotelCategory"
                      :items="gtaHotelCatgories"
                      label="All Hotel Categories"
                      outlined
                      clearable
                      item-text="name"
                      item-value="type"
                      hide-details
                      prepend-inner-icon="mdi-cash-multiple"
                    />
                  </v-col>
                </v-row>
              </div>
              <v-row>
                <v-col cols="12" md="9" class="mb-4" />
                <v-col cols="12" md="3" class="mb-4 justify-end">
                  <v-btn
                    class="white--text text-capitalize justify-center v-btn-brown"
                    color="#575757"
                    elevation="4"
                    block
                    raised
                    rounded-lg
                    @click="checkHotelAvailability"
                  >
                    Search
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </div>
      </div>
      <div>
        <!-- temp commented till deploy start -->
        <!-- moved to hotelsEX.vue -->
        <!-- temp commented till deploy end -->

        <!-- new results start -->
        <v-container v-if="!showSearch && confirmedSelectedRoom === false" fluid>
          <!-- First Row -->
          <v-row class="mt-10 pt-10">
            <!-- Left Column: "Hotels in *Destination*" -->
            <v-col cols="12" md="8">
              <h3>Hotels in {{ destination }} </h3>
              <p class="subtitle">
                <v-icon color="brown" class="">
                  mdi-calendar
                </v-icon>
                {{ hotelStartDate }} to {{ hotelEndDate }}
                <v-icon color="brown" class="">
                  mdi-home
                </v-icon>
                {{ room_count }} Room(s)
                <v-icon color="brown" class="">
                  mdi-account
                </v-icon>
                {{ travellers }} adult(s) & {{ children }} childrens
              </p>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn v-if="!showSearch" class="mt-5 justify-end v-btn-brown" @click="toggleSearch">
                Change Search
              </v-btn>
            </v-col>
          </v-row>
          <!-- Second Row: Sidebar and Main Content -->
          <v-row>
            <v-col cols="12" md="3">
              <v-card class="pa-3" outlined style="background-color: #CFBB9A">
                <!-- On mobile -->
                <v-expansion-panels v-if="isMobile">
                  <v-expansion-panel>
                    <v-expansion-panel-header class="text-subtitle-2">
                      Show Filters
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <!-- Filters content inside the expandable section on mobile -->
                      <v-text-field
                        v-model="hotelName"
                        label="Hotel Name"
                        outlined
                        dense
                        class="mt-1"
                      />
                      <v-card class="pa-3 mb-2" outlined>
                        <p class="text-subtitle-2 mb-2">
                          Price Range
                        </p>
                        <v-range-slider
                          v-model="priceRange"
                          :min="minPrice"
                          :max="maxPrice"
                          :step="5"
                          thumb-label="always"
                          class="mt-10"
                          @input="applyCombinedFilters"
                        />
                      </v-card>

                      <v-card class="pa-3 mb-2" outlined>
                        <p class="text-subtitle-2 mb-2">
                          Board Options
                        </p>
                        <v-row>
                          <v-col v-for="board in boardOptions" :key="board.value" cols="12">
                            <v-checkbox
                              v-model="selectedBoards"
                              :value="board.value"
                              :label="board.label"
                              hide-details="auto"
                              dense
                            />
                          </v-col>
                        </v-row>
                      </v-card>

                      <v-card class="pa-3 mb-2" outlined>
                        <p class="text-subtitle-2 mb-2 pb-1">
                          Specify a Category
                        </p>
                        <v-row>
                          <v-col v-for="rating in ratingOptions" :key="rating.value" cols="12">
                            <v-checkbox
                              v-model="selectedRatings"
                              :value="rating.value"
                              dense
                              hide-details
                            >
                              <template #label>
                                <span class="rating-stars" style="display: flex; align-items: center;">
                                  <v-rating
                                    v-if="isNumericRating(rating.value)"
                                    :value="parseInt(rating.value)"
                                    dense
                                    empty-icon="mdi-star-outline"
                                    full-icon="mdi-star"
                                    readonly
                                    small
                                  />
                                  <span v-else style="font-size: 12px;">
                                    {{ rating.label }}
                                  </span>
                                  <span style="font-size: 12px; margin-left: 5px;">
                                    ({{ rating.count }})
                                  </span>
                                </span>
                              </template>
                            </v-checkbox>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

                <!-- On larger screens -->
                <div v-else>
                  <v-text-field
                    v-model="hotelName"
                    label="Hotel Name"
                    outlined
                    dense
                    class="mt-1"
                  />
                  <v-card class="pa-3 mb-2" outlined>
                    <p class="text-subtitle-2 mb-2">
                      Price Range
                    </p>
                    <v-range-slider
                      v-model="priceRange"
                      :min="minPrice"
                      :max="maxPrice"
                      :step="5"
                      thumb-label="always"
                      class="mt-10"
                      @input="applyCombinedFilters"
                    />
                  </v-card>

                  <v-card class="pa-2 mb-1" outlined>
                    <p class="text-subtitle-2 mb-1" style="font-size: 14px; font-weight: bold;">
                      Board Options
                    </p>
                    <v-row dense>
                      <v-col v-for="board in boardOptions" :key="board.value" cols="12" class="py-1">
                        <v-checkbox
                          v-model="selectedBoards"
                          :value="board.value"
                          :label="board.label"
                          hide-details="auto"
                          dense
                          style="font-size: 12px;"
                        />
                      </v-col>
                    </v-row>
                  </v-card>

                  <v-card class="pa-2 mb-1" outlined>
                    <p class="text-subtitle-2 mb-1" style="font-size: 14px; font-weight: bold;">
                      Specify a Category
                    </p>
                    <v-row dense>
                      <v-col v-for="rating in ratingOptions" :key="rating.value" cols="12" class="py-1">
                        <v-checkbox
                          v-model="selectedRatings"
                          :value="rating.value"
                          dense
                          hide-details
                          style="font-size: 12px;"
                        >
                          <template #label>
                            <span class="rating-stars" style="display: flex; align-items: center; font-size: 14px;">
                              <v-rating
                                v-if="isNumericRating(rating.value)"
                                :value="parseInt(rating.value)"
                                dense
                                empty-icon="mdi-star-outline"
                                full-icon="mdi-star"
                                readonly
                                small
                              />
                              <span v-else>{{ rating.label }}</span>
                              <span style="margin-left: 4px;">
                                ({{ rating.count }})
                              </span>
                            </span>
                          </template>
                        </v-checkbox>
                      </v-col>
                    </v-row>
                  </v-card>
                </div>
              </v-card>
            </v-col>
            <!-- Main Content (col-8) -->
            <v-col cols="12" md="9">
              <v-card class="pa-3">
                <h3>Available Hotels</h3>
                <div v-for="(hotel, h) in filteredHotels" :key="h">
                  <!-- Hotel Card -->
                  <v-card class="hotel-card mb-2" max-width="100%" height="100%" elevation="2">
                    <v-row no-gutters class="align-stretch">
                      <!-- Desktop Card -->
                      <v-col
                        v-if="!$vuetify.breakpoint.xsOnly"
                        cols="12"
                        class="d-flex"
                      >
                        <!-- Hotel Image -->
                        <v-col cols="4" class="p-0">
                          <v-img
                            :src="getHotelImageSrc(hotel)"
                            alt="Hotel Image"
                            class="hotel-image"
                            style="width: 260px; height: 232px; object-fit: cover; overflow: hidden;"
                          />
                        </v-col>

                        <!-- Hotel Content -->
                        <v-col cols="8" class="py-2 pl-0" style="margin-left: -15px;">
                          <div class="d-flex justify-space-between align-center mb-1 hotel-title">
                            <div>
                              <h4 class="mb-0 font-weight-bold">
                                {{ hotel.HotelInfo.Name || 'Hotel Name' }}
                              </h4>
                              <v-icon color="red" class="">
                                mdi-map-marker
                              </v-icon>
                              <span class="grey--text text-caption text-justify">
                                <span v-html="formatAddress(hotel.HotelInfo.Address) || 'Location'" />
                              </span>
                            </div>
                          </div>

                          <!-- Hotel Description -->
                          <div class="grey--text text-justify text-body-2 font-italic description mb-1">
                            {{ truncatedDescriptions[h] }}
                          </div>

                          <!-- Buttons Section -->
                          <v-row no-gutters>
                            <v-col cols="12" class="pa-1">
                              <div class="mt-2 d-flex justify-space-between align-center">
                                <v-btn small outlined color="sienna" class="mr-2 px-5 no-wrap v-btn-brown" @click="showHotelDetailsObject(h)">
                                  Info
                                </v-btn>
                              </div>
                            </v-col>
                          </v-row>

                          <!-- Price and Rating -->
                          <div class="price-wrapper text-right">
                            <v-rating
                              :value="getRatingFromCategory(hotel.HotelInfo.HotelCategory._)"
                              active-color="yellow-accent-4"
                              dense
                              readonly
                            />
                            <small class="grey--text">{{ hotel.HotelInfo.HotelCategory._ }}</small>
                            <br>
                            <small class="grey--text">Average price</small>
                            <div class="font-weight-bold text-subtitle-1">
                              ${{ getHotelPrice(hotel) || 'not defined' }}
                            </div>
                          </div>
                        </v-col>
                      </v-col>

                      <!-- Mobile Card -->
                      <v-col
                        v-else
                        cols="12"
                      >
                        <!-- Hotel Image -->
                        <v-img
                          :src="getHotelImageSrc(hotel)"
                          alt="Hotel Image"
                          class="hotel-image"
                          style="width: 100%; height: 200px; object-fit: cover; overflow: hidden;"
                        />

                        <!-- Hotel Content -->
                        <div class="pa-2">
                          <div class="d-flex justify-space-between align-center mb-1 hotel-title">
                            <div>
                              <h4 class="mb-0 font-weight-bold">
                                {{ hotel.HotelInfo.Name || 'Hotel Name' }}
                              </h4>
                              <v-icon color="red" class="">
                                mdi-map-marker
                              </v-icon>
                              <span class="grey--text text-caption text-justify">
                                <span v-html="formatAddress(hotel.HotelInfo.Address) || 'Location'" />
                              </span>
                            </div>
                          </div>
                          <v-row class=" pb-1 mb-1">
                            <!-- Rating Section -->
                            <v-col cols="6" class="d-flex align-center">
                              <v-rating
                                :value="getRatingFromCategory(hotel.HotelInfo.HotelCategory._)"
                                active-color="yellow-accent-4"
                                dense
                                readonly
                              />
                            </v-col>

                            <!-- Price Section -->
                            <v-col cols="6" class="d-flex justify-end text-right">
                              <div>
                                <small class="grey--text">Average price</small>
                                <div class="font-weight-bold text-subtitle-1">
                                  ${{ getHotelPrice(hotel) || 'not defined' }}
                                </div>
                              </div>
                            </v-col>
                          </v-row>
                          <!-- Hotel Description -->
                          <div class="grey--text text-body-2 font-italic mb-1">
                            {{ truncatedDescriptions[h] }}
                          </div>

                          <!-- Buttons Section -->
                          <div class="mt-2 d-flex justify-space-between align-center">
                            <v-btn small outlined color="sienna" class="mr-2 px-5 no-wrap v-btn-brown" @click="showHotelDetailsObject(h)">
                              Info
                            </v-btn>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                    <!-- Room Details desktop-->
                    <v-row v-if="!$vuetify.breakpoint.xsOnly" style="margin-top: -20px;">
                      <v-col cols="12">
                        <div>
                          <v-expand-transition>
                            <v-card v-if="true" class="mt-2" elevation="2">
                              <v-card-text>
                                <v-row v-for="(roomOption, index) in getRoomOptions(hotel.HotelOptions.HotelOption).slice(0, 2)" :key="index" class="room-card">
                                  <v-col cols="12">
                                    <v-row justify="space-between">
                                      <v-col cols="12" md="6">
                                        <h5 class="mb-0 brown--text text-decoration-underline">
                                          {{ roomOption.HotelRooms.HotelRoom?.Name || 'Room Name Not Available' }}
                                        </h5>
                                      </v-col>
                                    </v-row>
                                    <v-row class="d-flex align-center justify-space-between" no-gutters>
                                      <v-col cols="4">
                                        <p class="mb-0 font-weight-medium">
                                          <!-- <strong>Board:</strong> -->
                                          <span class="grey--text">
                                            {{ roomOption.Board && roomOption.Board._ || 'Board not available' }}
                                          </span>
                                        </p>
                                      </v-col>
                                      <v-col cols="4" class="d-flex align-start">
                                        <v-btn small text :color="nonRefundableStatus(roomOption) ? 'red' : 'green'" class="text-decoration-underline" @click="toggleCancellationPolicy(h, index)">
                                          {{ nonRefundableStatus(roomOption) ? 'Non-refundable' : 'Cancellation Available' }}
                                          <v-icon small class="ml-1">
                                            {{ showFullCancellationPolicy[h] && showFullCancellationPolicy[h][index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                          </v-icon>
                                        </v-btn>
                                      </v-col>
                                      <v-col cols="4" class="d-flex justify-end">
                                        <p class="mr-3 font-weight-bold text-subtitle-1">
                                          $ {{ roomOption.Prices?.Price?.TotalFixAmounts?.Gross || 'Price not available' }}
                                        </p>
                                        <v-btn small class="mr-2 px-8 py-4 no-wrap v-btn-brown" @click="bookRoom(roomOption, h)">
                                          Book
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                    <v-row v-if="showFullCancellationPolicy[h] && showFullCancellationPolicy[h][index]">
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
                                                <span>
                                                  <span v-html="formatCancellationPolicy(roomOption.CancellationPolicy?.Description)" />
                                                </span>
                                              </span>
                                            </td>
                                          </tr>
                                        </table>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>

                                <!-- Show more rooms if available -->
                                <v-row v-if="getRoomOptions(hotel.HotelOptions.HotelOption).length > 2 && showAllRoomsForHotel[h]">
                                  <v-col v-for="(roomOption, index) in getRoomOptions(hotel.HotelOptions.HotelOption).slice(2)" :key="index + 2" cols="12" class="room-card">
                                    <v-row justify="space-between">
                                      <v-col cols="12" md="6">
                                        <h5 class="mb-0 brown--text  text-decoration-underline">
                                          {{ roomOption.HotelRooms.HotelRoom?.Name || 'Room Name Not Available' }}
                                        </h5>
                                      </v-col>
                                    </v-row>
                                    <!-- Aligning the Board, Non-refundable, and Book Button in one row -->
                                    <v-row class="d-flex align-center justify-space-between" no-gutters>
                                      <v-col cols="4">
                                        <p class="mb-0 font-weight-medium">
                                          <strong>Board:</strong>
                                          <span class="grey--text">
                                            {{ roomOption.Board && roomOption.Board._ || 'Board not available' }}
                                          </span>
                                        </p>
                                      </v-col>
                                      <v-col cols="4" class="d-flex align-center">
                                        <v-btn small text :color="nonRefundableStatus(roomOption) ? 'red' : 'green'" class=" text-decoration-underline" @click="toggleCancellationPolicy(h, index)">
                                          {{ nonRefundableStatus(roomOption) ? 'Non-refundable' : 'Cancellation Available' }}
                                          <v-icon small class="ml-1">
                                            {{ showFullCancellationPolicy[h] && showFullCancellationPolicy[h][index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                          </v-icon>
                                        </v-btn>
                                      </v-col>
                                      <v-col cols="4" class="d-flex justify-end">
                                        <p class="mr-3 font-weight-bold text-subtitle-1">
                                          $ {{ roomOption.Prices?.Price?.TotalFixAmounts?.Gross || 'Price not available' }}
                                        </p>
                                        <!-- Book Button -->
                                        <v-btn small class="mr-2 px-8 py-4 no-wrap v-btn-brown" @click="bookRoom(roomOption, h)">
                                          Book
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                    <v-row v-if="showFullCancellationPolicy[h] && showFullCancellationPolicy[h][index]">
                                      <v-col cols="12">
                                        <table width="100%" style="border-collapse: collapse; margin-top: 10px;">
                                          <!-- Row 1: Cancellation Charges -->
                                          <tr style="background-color: #eaeaea;">
                                            <td style="padding: 10px;">
                                              <strong>Cancellation Charges:</strong>
                                            </td>
                                          </tr>

                                          <!-- Row 2: Alert Message -->
                                          <tr style="background-color: rgb(255,239.5,193);">
                                            <td style="padding: 10px; color: rgb(134.5,100.875,0);">
                                              <v-icon color="rgb(134.5,100.875,0)" class="mr-1">
                                                mdi-alert
                                              </v-icon>
                                              Booking subject to cancellation charges
                                            </td>
                                          </tr>

                                          <!-- Row 3: Cancellation Policy Details -->
                                          <tr>
                                            <td style="padding: 10px;">
                                              <span class="grey--text">
                                                <span>
                                                  <span v-html="formatCancellationPolicy(roomOption.CancellationPolicy?.Description)" />
                                                </span>
                                              </span>
                                            </td>
                                          </tr>
                                        </table>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>
                                <!-- Toggle button to show more/less rooms -->
                                <v-row justify="center">
                                  <v-col cols="auto">
                                    <v-btn
                                      v-if="getRoomOptions(hotel.HotelOptions.HotelOption).length > 2"
                                      small
                                      class="text-body-1 text-brown font-weight-bold"
                                      text
                                      color="brown"
                                      @click="toggleRoomDisplay(h)"
                                    >
                                      {{ showAllRoomsForHotel[h] ? 'See Less' : `See More (${hiddenRoomCount(hotel.HotelOptions.HotelOption)}+)` }}
                                      <v-icon small>
                                        {{ showAllRoomsForHotel[h] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                      </v-icon>
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expand-transition>
                        </div>
                      </v-col>
                    </v-row>
                    <!-- room details mobile -->
                    <v-row v-else style="margin-top: -20px;">
                      <v-col cols="12">
                        <div>
                          <v-expand-transition>
                            <v-card v-if="true" class="mt-2" elevation="2">
                              <v-card-text>
                                <v-row
                                  v-for="(roomOption, index) in getRoomOptions(hotel.HotelOptions.HotelOption).slice(0, 2)"
                                  :key="index"
                                  class="room-card"
                                  no-gutters
                                >
                                  <v-col cols="12">
                                    <v-row justify="space-between" class="align-center">
                                      <v-col cols="12" md="6">
                                        <h5 class="mb-0 brown--text text-decoration-underline">
                                          {{ roomOption.HotelRooms.HotelRoom?.Name || 'Room Name Not Available' }}
                                        </h5>
                                      </v-col>
                                    </v-row>

                                    <!-- Adjust room details layout for mobile -->
                                    <v-row
                                      class="d-flex align-center justify-space-between"
                                      :class="{ 'flex-column': isMobile }"
                                      no-gutters
                                    >
                                      <v-col cols="12" md="4" class="py-1">
                                        <p class="mb-0 font-weight-medium">
                                          <span class="grey--text">
                                            {{ roomOption.Board && roomOption.Board._ || 'Board not available' }}
                                          </span>
                                        </p>
                                      </v-col>
                                      <v-col cols="12" md="4" class="py-1 d-flex justify-start">
                                        <v-btn small text :color="nonRefundableStatus(roomOption) ? 'red' : 'green'" class="text-decoration-underline" @click="toggleCancellationPolicy(h, index)">
                                          {{ nonRefundableStatus(roomOption) ? 'Non-refundable' : 'Cancellation Available' }}
                                          <v-icon small class="ml-1">
                                            {{ showFullCancellationPolicy[h] && showFullCancellationPolicy[h][index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                          </v-icon>
                                        </v-btn>
                                      </v-col>
                                      <v-col cols="12" md="4" class="d-flex justify-end py-1">
                                        <p class="mr-3 font-weight-black text-h6">
                                          $ {{ roomOption.Prices?.Price?.TotalFixAmounts?.Gross || 'Price not available' }} USD
                                        </p>
                                      </v-col>
                                      <v-col cols="12" md="4" class="py-1">
                                        <v-btn size="x-large" block class="pa-1 ma-1 no-wrap v-btn-brown" @click="bookRoom(roomOption, h)">
                                          Book
                                        </v-btn>
                                      </v-col>
                                    </v-row>

                                    <!-- Cancellation Policy Details -->
                                    <v-row v-if="showFullCancellationPolicy[h] && showFullCancellationPolicy[h][index]">
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

                                <!-- Show more rooms if available -->
                                <v-row v-if="getRoomOptions(hotel.HotelOptions.HotelOption).length > 2 && showAllRoomsForHotel[h]">
                                  <v-col v-for="(roomOption, index) in getRoomOptions(hotel.HotelOptions.HotelOption).slice(2)" :key="index + 2" cols="12" class="room-card">
                                    <v-row justify="space-between">
                                      <v-col cols="12" md="6">
                                        <h5 class="mb-0 brown--text text-decoration-underline">
                                          {{ roomOption.HotelRooms.HotelRoom?.Name || 'Room Name Not Available' }}
                                        </h5>
                                      </v-col>
                                    </v-row>
                                    <!-- Aligning the Board, Non-refundable, and Book Button in one row -->
                                    <v-row class="d-flex align-center justify-space-between" :class="{ 'flex-column': isMobile }" no-gutters>
                                      <v-col cols="12" md="4" class="py-1">
                                        <p class="mb-0 font-weight-medium">
                                          <span class="grey--text">
                                            {{ roomOption.Board && roomOption.Board._ || 'Board not available' }}
                                          </span>
                                        </p>
                                      </v-col>
                                      <v-col cols="12" md="4" class="py-1 d-flex justify-start">
                                        <v-btn small text :color="nonRefundableStatus(roomOption) ? 'red' : 'green'" class=" text-decoration-underline" @click="toggleCancellationPolicy(h, index)">
                                          {{ nonRefundableStatus(roomOption) ? 'Non-refundable' : 'Cancellation Available' }}
                                          <v-icon small class="ml-1">
                                            {{ showFullCancellationPolicy[h] && showFullCancellationPolicy[h][index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                          </v-icon>
                                        </v-btn>
                                      </v-col>
                                      <v-col cols="12" md="4" class="d-flex justify-end py-1">
                                        <p class="mr-3 font-weight-black text-h6">
                                          $ {{ roomOption.Prices?.Price?.TotalFixAmounts?.Gross || 'Price not available' }} USD
                                        </p>
                                      </v-col>
                                      <v-col cols="12" md="4" class="py-1">
                                        <v-btn size="x-large" block class="pa-1 ma-1 no-wrap v-btn-brown" @click="bookRoom(roomOption, h)">
                                          Book
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                    <v-row v-if="showFullCancellationPolicy[h] && showFullCancellationPolicy[h][index]">
                                      <v-col cols="12">
                                        <table width="100%" style="border-collapse: collapse; margin-top: 10px;">
                                          <!-- Row 1: Cancellation Charges -->
                                          <tr style="background-color: #eaeaea;">
                                            <td style="padding: 10px;">
                                              <strong>Cancellation Charges:</strong>
                                            </td>
                                          </tr>

                                          <!-- Row 2: Alert Message -->
                                          <tr style="background-color: rgb(255,239.5,193);">
                                            <td style="padding: 10px; color: rgb(134.5,100.875,0);">
                                              <v-icon color="rgb(134.5,100.875,0)" class="mr-1">
                                                mdi-alert
                                              </v-icon>
                                              Booking subject to cancellation charges
                                            </td>
                                          </tr>

                                          <!-- Row 3: Cancellation Policy Details -->
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
                                <!-- Toggle button to show more/less rooms -->
                                <v-row justify="center">
                                  <v-col cols="auto">
                                    <v-btn
                                      v-if="getRoomOptions(hotel.HotelOptions.HotelOption).length > 2"
                                      small
                                      class="text-body-1 text-brown font-weight-bold"
                                      text
                                      color="brown"
                                      @click="toggleRoomDisplay(h)"
                                    >
                                      {{ showAllRoomsForHotel[h] ? 'See Less' : `See More (${hiddenRoomCount(hotel.HotelOptions.HotelOption)}+)` }}
                                      <v-icon small>
                                        {{ showAllRoomsForHotel[h] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                      </v-icon>
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expand-transition>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <!-- new results end -->
      </div>
      <!-- the booking confirmation card  -->
      <v-row>
        <!-- Left Column (Booking Form + Additional Information) -->
        <v-col cols="12" md="8" :style="isMobile ? { marginTop: '102px' } : {}">
          <v-row>
            <v-col cols="12" md="4">
              <v-btn v-if="!showSearch && confirmedSelectedRoom && !isChoiceConfirmed" class="mt-5 justify-end" color="primary" @click="toggleSearch">
                Change Search
              </v-btn>
            </v-col>
          </v-row>
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
                  @click="checkoutPayment"
                >
                  <span>Proceed to checkout</span>
                  <!-- <span v-else>Booked Successfully</span> -->
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="showCheckout" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Hotel Summary
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
                    <p>$ {{ hotelPrices }}</p>
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
    </v-container>
    <!-- <form ref="paymentForm" method="POST" action="" /> -->
  </div>
</template>
<script>
import _ from 'lodash'
// import axios from 'axios'
import clientAPI from '../../services/axiosConfig'
import LoadingScreen from '~/components/LoadingScreen.vue'
import hotelsServices from '~/services/HotelsServices'

export default {
  components: {
    LoadingScreen
  },
  data () {
    return {
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
      isLoading: false,
      hotelAvails: null,
      checkResponseCode: false,
      showHotelGtaDetails: false,
      gtaHotelDetails: null,
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
      showFullCancellationPolicy: {},
      showAllRooms: false,
      minDate: this.getToday(),
      showAllRoomsForHotel: {},
      selectedBoards: [],
      boardOptions: [],
      loading: false,
      activatorWidth: 0,
      selectedHotelForBooking: {}
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
      return (roomOption) => {
        const description = roomOption?.CancellationPolicy?.Description || ''
        return !/0(?:\s|&nbsp;)+usd/i.test(description)
      }
    },
    isMobile () {
      return this.$vuetify.breakpoint.smAndDown // or use xs only if you want it more specific
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
      return this.filteredHotels.map((hotel) => {
        const description = hotel.HotelInfo.Description || 'Hotel Description'
        return description.length > 200 ? description.substring(0, 200) + '...' : description
      })
    },
    truncatedCancellationPolicy () {
      const policyText = this.roomOption?.CancellationPolicy?.Description || ''
      return policyText.length > 100 ? policyText.substring(0, 100) + '...' : policyText
    }
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
        if (newVal[0] !== null && newVal[1] !== null) {
          this.applyCombinedFilters()
        }
      },
      deep: true
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
    }
  },
  mounted () {
    window.addEventListener('popstate', this.handleBackButton)
    this.priceSessionId = localStorage.getItem('priceSessionId')
  },

  beforeDestroy () {
    window.removeEventListener('popstate', this.handleBackButton)
  },

  async created () {
    await this.getMetaData()
    this.debouncedApplyPriceFilter = _.debounce(this.applyPriceFilter, 300)
    this.debouncedApplyCombinedFilters = _.debounce(this.applyCombinedFilters, 300)
  },
  methods: {
    async processHotelBooking () {
      this.isLoading = true

      try {
        const formDataId = await this.finalBookHotel()

        if (!formDataId) {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Something went wrong during booking registration.'
          this.isLoading = false
          return
        }
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

        form.insertAdjacentHTML(
          'beforeend',
      `<input type="hidden" name="url" value="${window.location.origin}/payment-success">`
        )

        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="bookingId" value="${formDataId}">`)

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
      if (this.getbookingRuleArray.length > 0) {
        for (let x = 0; x < this.getbookingRuleArray.length; x++) {
          const formData = new FormData()
          const bookingCode = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.BookingCode._
          const startDate = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Start
          const endDate = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.End
          const HotelCode = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.HotelCode
          const minimumPrice = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Minimum
          const maximumPrice = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Maximum
          const currency = this.getbookingRuleArray[x].HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Currency
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
          formData.append('board', this.selectedBoard)
          formData.append('hotel_name', this.selectedHotelName)
          formData.append('hotel_category', this.selectedHotelCategory)
          formData.append('hotel_type_category', this.selectedHotelTypeCategory)
          formData.append('identification_document_pax', this.identification_document_pax)
          formData.append('address_pax', this.address_pax)
          // formData.append('city_pax', this.city_pax)
          // formData.append('country_pax', this.country_pax)
          formData.append('postal_code_pax', this.postal_code_pax)
          formData.append('book_after_payment', '1')
          if (this.rooms.length > 0) {
            for (let r = 0; r < this.rooms.length; r++) {
              formData.append('rooms[' + r + '][travellers]', this.rooms[r].travelers)
              formData.append('rooms[' + r + '][children]', this.rooms[r].children)
              if (this.rooms[r].ageSelects.length > 0) {
                for (let rx = 0; rx < this.rooms[r].ageSelects.length; rx++) {
                  formData.append('rooms[' + r + '][ages][' + rx + ']', this.rooms[r].ageSelects[rx].age)
                }
              }
              // formData.append('rooms[' + r + '][category]', this.rooms[r].roomCategory.Type)
              formData.append('rooms[' + r + '][category]', this.selectedCategory)
            }
          }
          if (this.bNames.length > 0) {
            for (let x = 0; x < this.bNames.length; x++) {
              formData.append('names[' + x + ']', this.bNames[x])
            }
          }
          if (this.bSurnames.length > 0) {
            for (let y = 0; y < this.bSurnames.length; y++) {
              formData.append('surnames[' + y + ']', this.bSurnames[y])
            }
          }
          if (this.bAges.length > 0) {
            for (let z = 0; z < this.bAges.length; z++) {
              formData.append('ages[' + z + ']', this.bAges[z])
            }
          }
          if (this.bNamesChild.length > 0) {
            for (let xx = 0; xx < this.bNamesChild.length; xx++) {
              formData.append('namesChild[' + xx + ']', this.bNamesChild[xx])
            }
          }
          if (this.bSurnamesChild.length > 0) {
            for (let yy = 0; yy < this.bSurnamesChild.length; yy++) {
              formData.append('surnamesChild[' + yy + ']', this.bSurnamesChild[yy])
            }
          }
          if (this.bAgesChild.length > 0) {
            for (let zz = 0; zz < this.bAgesChild.length; zz++) {
              formData.append('agesChild[' + zz + ']', this.bAgesChild[zz])
            }
          }

          try {
            const promise = hotelsServices.finalBookHotel(formData)
            const response = await promise
            console.log(response)
            // const results = response.data.BookingRS
            const resultFormData = response.data.formDataId
            this.finalBookHotelFormData = resultFormData
            this.finalBookHotelsFormData[x] = resultFormData
            this.isBooked = true
            this.isLoading = false
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
      if (this.getbookingRuleArray.length === 0 && this.getbookingRule) {
        const formData = new FormData()
        const bookingCode = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.BookingCode._
        const startDate = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Start
        const endDate = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.End
        const HotelCode = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.HotelCode
        const minimumPrice = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Minimum
        const maximumPrice = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Maximum
        const currency = this.getbookingRule.HotelOptions.HotelOption.HotelRequiredFields.HotelBooking.Elements.HotelElement.HotelBookingInfo.Price.PriceRange.Currency
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
        formData.append('board', this.selectedBoard)
        formData.append('hotel_name', this.selectedHotelName)
        formData.append('hotel_category', this.selectedHotelCategory)
        formData.append('hotel_type_category', this.selectedHotelTypeCategory)
        formData.append('identification_document_pax', this.identification_document_pax)
        formData.append('address_pax', this.address_pax)
        formData.append('city_pax', this.city_pax)
        formData.append('country_pax', this.country_pax)
        formData.append('postal_code_pax', this.postal_code_pax)
        formData.append('book_after_payment', '1')
        if (this.rooms.length > 0) {
          for (let r = 0; r < this.rooms.length; r++) {
            formData.append('rooms[' + r + '][travellers]', this.rooms[r].travelers)
            formData.append('rooms[' + r + '][children]', this.rooms[r].children)
            if (this.rooms[r].ageSelects.length > 0) {
              for (let rx = 0; rx < this.rooms[r].ageSelects.length; rx++) {
                formData.append('rooms[' + r + '][ages][' + rx + ']', this.rooms[r].ageSelects[rx].age)
              }
            }
            // formData.append('rooms[' + r + '][category]', this.rooms[r].roomCategory.Type)
            formData.append('rooms[' + r + '][category]', this.selectedCategory)
          }
        }
        if (this.bNames.length > 0) {
          for (let x = 0; x < this.bNames.length; x++) {
            formData.append('names[' + x + ']', this.bNames[x])
          }
        }
        if (this.bSurnames.length > 0) {
          for (let y = 0; y < this.bSurnames.length; y++) {
            formData.append('surnames[' + y + ']', this.bSurnames[y])
          }
        }
        if (this.bAges.length > 0) {
          for (let z = 0; z < this.bAges.length; z++) {
            formData.append('ages[' + z + ']', this.bAges[z])
          }
        }
        if (this.bNamesChild.length > 0) {
          for (let xx = 0; xx < this.bNamesChild.length; xx++) {
            formData.append('namesChild[' + xx + ']', this.bNamesChild[xx])
          }
        }
        if (this.bSurnamesChild.length > 0) {
          for (let yy = 0; yy < this.bSurnamesChild.length; yy++) {
            formData.append('surnamesChild[' + yy + ']', this.bSurnamesChild[yy])
          }
        }
        if (this.bAgesChild.length > 0) {
          for (let zz = 0; zz < this.bAgesChild.length; zz++) {
            formData.append('agesChild[' + zz + ']', this.bAgesChild[zz])
          }
        }

        try {
          const promise = hotelsServices.finalBookHotel(formData)
          const response = await promise
          console.log(response)
          const resultFormData = response.data.formDataId
          this.finalBookHotelFormData = resultFormData
          this.isBooked = true
          this.isLoading = false
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
      if (this.listGtaHotelDetails.length > 0 && this.filteredHotels.length !== 0) {
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
      if (this.listGtaHotelDetails.length === 1) {
        this.filteredHotels = this.listGtaHotelDetails
        return
      }
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
      if (this.listGtaHotelDetails.length === 1) {
        this.filteredHotels = this.listGtaHotelDetails
        return
      }
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
    getRoomOptions (roomOptions) {
      return Array.isArray(roomOptions) ? roomOptions : [roomOptions]
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
    toggleCancellationPolicy (hotelIndex, roomIndex) {
      if (!this.showFullCancellationPolicy[hotelIndex]) {
        this.$set(this.showFullCancellationPolicy, hotelIndex, {})
      }
      this.$set(this.showFullCancellationPolicy[hotelIndex], roomIndex, !this.showFullCancellationPolicy[hotelIndex][roomIndex])
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
    getHotelImageSrc (hotel) {
      if (hotel.Images && hotel.Images.length > 0) {
        const image = hotel.Images.find(img => img.Type === 'THB')
        return image ? image.FileName : 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      } else if (hotel.HotelInfo && hotel.HotelInfo.Images) {
        return hotel.HotelInfo.Images.Image || 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
      return 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    toggleSearch () {
      this.showSearch = !this.showSearch
    },
    clearPreviousResults () {
      this.hotelAvailsArray = []
      this.listGtaHotelDetails = []
      this.isLoading = false
    },
    handleInput: _.debounce(async function () {
      if (this.isSelecting) {
        return
      }

      if (this.query.length >= 3) {
        this.loading = true
        this.menu = true
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
    handleZoneSelection (zone) {
      this.isSelecting = true

      this.selectZone(zone)

      if (zone.area_type === 'CTY') {
        this.getCityIdByJpdCode(zone.jpd_code).then((cityId) => {
          this.getGtaHotelsPerCity(cityId)
        })
      } else if (zone.area_type === 'REG' || zone.area_type === 'LOC') {
        this.searchHotelsByAddress(zone.name)
      } else {
        this.getGtaHotelsPerZone(zone.id)
      }
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
      await new Promise(resolve => setTimeout(resolve, 10000))

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
      const pageSize = 500
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
            if (results && !Array.isArray(results)) {
              results = [results]
            }

            if (results.length > 0) {
              this.hotelAvailsArray.push(...results)
              this.listGtaHotelDetails = [...this.listGtaHotelDetails, ...results]
              this.filteredHotels = [...this.listGtaHotelDetails]
              console.log(this.filteredHotels)
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
    async bookRoom (roomOption, hotelIndex) {
      try {
        console.log('Room Option:', roomOption)
        console.log('Hotel Index:', hotelIndex)

        this.isLoading = true
        const selectedHotel = this.listGtaHotelDetails[hotelIndex]
        console.log('Selected Hotel Details:', selectedHotel)
        this.selectedRoomGta = roomOption
        this.selectedRoomGtaArray.push(roomOption)
        this.getRatePlanCode = roomOption.RatePlanCode
        this.hotelPrices = roomOption.Prices?.Price?.TotalFixAmounts?.Nett || 0
        this.selectedHotelForBooking = selectedHotel
        this.selectedHotelCode = selectedHotel.Code
        this.selectedHotelJPCode = selectedHotel.JPCode
        this.selectedHotelJPDCode = selectedHotel.JPDCode
        const formData = new FormData()
        formData.append('RatePlanCode', roomOption.RatePlanCode)
        formData.append('StartDate', this.hotelStartDate)
        formData.append('EndDate', this.hotelEndDate)
        formData.append('HotelCode', this.selectedHotelCode)
        const promise = hotelsServices.getBookingRules(formData)
        const response = await promise
        console.log('Booking Rules Response:', response)

        const results = response.data.BookingRulesRS

        if (results.Errors !== undefined) {
          this.snackbar = true
          this.color = 'error'
          this.text = results.Errors.Error.Text
          this.loaded = false
          this.checkResponseCode = false
        } else {
          this.getbookingRule = results.Results.HotelResult
          this.selectedHotelOption = results.Results.HotelResult.HotelOptions.HotelOption
          this.confirmedSelectedRoom = true
          console.log('Booking Rules Response Results for storing:', results)
          this.$store.dispatch('modules/booking/setBookingResponse', results)
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
        return []
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
      if (!this.selectedRoomGta || !this.selectedHotelCode) {
        console.warn('Required room or hotel data is missing')
        return
      }
      this.$store.dispatch('setTravellersNumber', {
        adults: this.travellers,
        children: this.children,
        totalPrice: this.hotelPrices,
        packageStartDay: this.packageStartDay,
        packageDetails: this.selectedHotelForBooking,
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

<style scoped>
  .coming-soon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }

  .coming-soon h1 {
    font-size: 3em;
    margin-bottom: 0.5em;
  }

  .coming-soon p {
    font-size: 1.5em;
  }

  .transparent-btn {
  background-color: transparent !important;
  color: #000;
  box-shadow: none !important;
  text-transform: none;
}

.v-btn:hover {
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}
.hotel-card {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.hotel-image {
  border-radius: 12px;
}

.price-wrapper {
  position: absolute;
  top: 15px;
  right: 15px;
}

.font-weight-bold {
  font-weight: 600 !important;
}

.description {
  margin-right: 140px; /* Add margin to the right to avoid overlapping with the price */
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mb-1 {
  margin-bottom: 4px !important;
}

.mb-2 {
  margin-bottom: 8px !important;
}

.mr-2 {
  margin-right: 8px !important;
}

.text-justify {
  text-align: justify;
}

/* Styling for brown buttons */
/* .v-btn {
  background-color: #8B4513 !important; /* Brown color */
  /* color: white !important; */
/* } */

/* .v-btn:hover {
  background-color: #A0522D !important; /* Lighter brown on hover */
/* } */

.text-brown {
  color: sienna !important;
}

.v-btn-brown {
  background-color: sienna !important; /* Brown color */
  color: white !important;
}

.v-btn-brown:hover {
  background-color: #A0522D !important; /* Lighter brown on hover */
}

.no-wrap {
  border: none !important;
}
.address-break {
    white-space: pre-wrap; /* Allows line breaks within the text */
    word-wrap: break-word; /* Breaks long words and prevents overflow */
  }
.hotel-title {
  max-width: 70%;
}

::v-deep button.primary--text {
  color: gold !important;
}

::v-deep div.v-input__slot {
  background-color: white !important;
}

/* ::v-deep label.v-label.theme--light {
  font-size: 14px !important;
} */

.truncated {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 3;
}

::v-deep .board-checkbox .v-label {
  font-size: 12px !important;
}

.board-col {
  margin-bottom: 1px !important;
  padding-bottom: 0 !important;
}
.room-card {
  border-bottom: 1px solid #d6b682;
}
.custom-list-item {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-list-item-content {
  font-size: 14px;
  padding: 8px;
  max-width: 100%;
}

.custom-list-item-title,
.custom-list-item-subtitle {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::v-deep .v-slider__thumb-label span {
    font-size: 12px !important;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
