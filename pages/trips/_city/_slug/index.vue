<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <client-only>
      <v-snackbar
        v-model="snackbar"
        :color="color"
        :timeout="5000"
        top
      >
        <v-row>
          <span v-html="text" />
          <v-spacer />
          <v-icon small color="white" class="ml-3" @click="alert = false">
            mdi-close
          </v-icon>
        </v-row>
      </v-snackbar>
    </client-only>
    <v-img v-if="$fetchState.pendeing" max-width="200" class="blink-2 mx-auto" src="~/assets/images/tanfer.png" />
    <client-only placeholder="loading...">
      <div v-if="!$fetchState.error">
        <div v-if="packageDetails" class="t-container py-12">
          <v-row justify="space-between" class="headline px-5 my-5 late--text font-weight-black">
            <h1>
              {{ packageDetails.packageTitle }}
              <br>
              <span v-if="packageDetails.packageStartDate" class="caption grey--text">
                <date-display :date="packageDetails.packageStartDate" />
              </span>
            </h1>
          </v-row>
          <v-img :alt="packageDetails.packageImageAlt" class="mb-5 mt-3" :src="packageDetails.packageImage" contain max-height="200" />
          <span class="d-none">{{ packageDetails.packageImageCaption }}</span>
          <v-card>
            <v-card-title class="my-5 late--text">
              Add Start Date
            </v-card-title>
            <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="startDate"
                  outlined
                  label="Package Start Date"
                  readonly
                  prepend-inner-icon="mdi-calendar"
                  color="late"
                  class="mx-5"
                  persistent-hint
                  :hint="getDateHint()"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="startDate"
                color="late"
                :allowed-dates="allowedDates"
                :min="new Date().toISOString()"
                type="date"
                @input="startDateMenu = false; formatDate()"
              />
            </v-menu>
          </v-card>

          <div class="d-block my-5 d-md-flex">
            <aside class="aside-route">
              <div class="route-side">
                <div class="custom-side-title-block">
                  <div class="route-title-hed">
                    <span class="coustum-title">Customize your<br></span>Trip Route
                  </div>
                </div>
                <div class="w-form">
                  <div id="email-form-3" name="email-form-3" data-name="Email Form 3">
                    <div v-for="(city, i) in packageDetails.packageCities" :key="city.packageCityID" class="my-5">
                      <div class="route-city-row">
                        <div class="rout-city-row-inner">
                          <div class="city-order">
                            {{ i + 1 }}
                          </div>
                          <div class="route-city-name">
                            {{ city.cityName }}
                          </div>
                          <div class="nights-row">
                            <button
                              class="w-inline-block"
                              :disabled="city.cityDaysNumber < 2"
                              @click="
                                city.cityDaysNumber--;
                                city.cityDuration--;
                                minimisePrice(city.cityActivities['day_'+(city.cityDaysNumber+1)]);
                                delete city.cityActivities['day_'+(city.cityDaysNumber+1)];
                                city.selectedRooms = [];
                                citiesRooms = [];
                                roomsNum = 0;
                                editingCityId = city.cityID
                              "
                            >
                              <img src="~/assets/images/min-icon.png" loading="lazy" alt="" class="nights-change">
                            </button>
                            <div class="nights-num">
                              {{ city.cityDaysNumber }} <span class="night-lite">Days</span>
                            </div>
                            <button
                              class="w-inline-block"
                              @click="
                                city.cityDaysNumber++;
                                city.cityDuration++;
                                city.cityActivities['day_'+(Object.keys(city.cityActivities).length+1)] = [];
                                city.selectedRooms = [];
                                citiesRooms = [];
                                roomsNum = 0;
                                editingCityId = city.cityID
                              "
                            >
                              <img src="~/assets/images/plus-icon.png" loading="lazy" alt="" class="nights-change">
                            </button>
                          </div>
                        </div>
                        <button v-if="i > 0" class="remove-city-link w-inline-block" @click="removeCity(i); city.selectedRooms = []; citiesRooms = []; roomsNum = 0;">
                          <img src="~/assets/images/del-icpn.png" loading="lazy" alt="" class="remove-city-icon">
                        </button>
                      </div>
                      <div class="route-transport-block">
                        <div v-for="(trans, j) in city.cityTransportations" :key="trans.transportationID" class="trans-row">
                          <label class="w-radio">
                            <div :id="`check-icon-${i}-${j}`" :class="`w-form-formradioinput-${i} w-form-formradioinput w-form-formradioinput--inputType-custom trans-radio w-radio-input w--redirected-checked`" />
                            <img v-if="trans.transportationType === 'flight' || trans.transportationType === 'train' || trans.transportationType === 'limousine'" :src="trans.transportationType === 'flight' ? '' : (trans.transportationType === 'train' ? '~/assets/images/transport-train.png' : '~/assets/images/limousine.png')" loading="lazy" alt="" class="transport-bt-icon mx-wid-32">
                            <v-icon v-else class="transport-bt-icon" color="#333" left>{{ trans.transportationType === 'coaster' ? 'mdi-bus-side' : (trans.transportationType === 'hiac' ? 'mdi-car-estate' : 'mdi-bus') }}</v-icon>
                            <span v-if="trans.transportationType !== 'flight'" :id="`trans-label-${i}-${j}`" class="transport-m w-form-label" @click="showCheckIcon(i, j, trans.transportationType, trans.transportationPricePerPerson)">{{ trans.transportationType }} to {{ city.cityName }} &gt;</span>
                            <div v-else>
                              <span v-if="i === 0" :id="`trans-label-${i}-${j}`" class="transport-m w-form-label" @click="addFlightDialog = !addFlightDialog; editingCityIndex = i; showCheckIcon(i, j, 'air', 0);">Add Flight to {{ city.cityName }} &gt;</span>
                              <span v-else :id="`trans-label-${i}-${j}`" class="transport-m w-form-label" @click="editingCityIndex = i; showCheckIcon(i, j, 'air', 0); searchFlights();">Add Flight to {{ city.cityName }} &gt;</span>
                            </div>
                          </label>
                          <button v-if="trans.transportationType === 'flight' && trans.flight" data-w-id="17d6cb79-faec-cc6f-7468-c12e8db760e8" class="r-link frist-link" @click="showFlight(trans.flight)">
                            Details
                          </button>
                          <button v-if="trans.transportationType !== 'flight'" data-w-id="17d6cb79-faec-cc6f-7468-c12e8db760e8" class="r-link frist-link" @click="transDataDialog = true; transportation = trans">
                            Details
                          </button>
                          <button v-if="trans.transportationType === 'flight' && trans.flight" class="r-link" @click="editingCityIndex = i; searchFlights()">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                    <a href="/flights" target="_blank">
                      <v-btn large class="px-10" tile color="blue white--text" elevation="0">Book flight</v-btn>
                    </a>
                  </div>
                  <div class="w-form-done">
                    <div>Thank you! Your submission has been received!</div>
                  </div>
                  <div class="w-form-fail">
                    <div>Oops! Something went wrong while submitting the form.</div>
                  </div>
                </div>
              </div>

              <v-divider class="my-3" />

              <div class="route-side">
                <div class="custom-side-title-block">
                  <div class="route-title-hed">
                    <span class="coustum-title">Customize your<br></span>Cruise
                  </div>
                </div>
                <v-card outlined class="my-5">
                  <v-card-title class="d-flex justify-space-between flex-wrap">
                    Nile Cruise
                    <v-btn v-if="!packageDetails.cruise" icon color="primary" @click="addCruiseDialog = true">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <div v-else>
                      <v-btn icon color="error" @click="packageDetails.cruise = null; selectedCruise = null;">
                        <v-icon>mdi-trash-can</v-icon>
                      </v-btn>
                      <v-btn icon color="primary" @click="cruiseDialog = true">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </div>
                  </v-card-title>
                  <v-card-text v-if="packageDetails.cruise" class="pb-0">
                    <v-img max-height="200" :src="packageDetails.cruise.master_image" />
                    <div class="d-flex justify-space-between align-center">
                      <h3 class="my-1">
                        {{ packageDetails.cruise.name }} <small class="body-2">/ {{ packageDetails.cruise.number_of_nights }} nights</small>
                      </h3>
                      <v-rating
                        background-color="gray"
                        color="warning"
                        dense
                        empty-icon="mdi-star-outline"
                        full-icon="mdi-star"
                        length="5"
                        readonly
                        size="15"
                        :value="packageDetails.cruise.stars"
                      />
                    </div>
                    <p v-html="packageDetails.cruise.description" />
                    <p>
                      <v-icon left color="primary">
                        mdi-map-marker
                      </v-icon> {{ packageDetails.cruise.cruise_line }}
                    </p>
                    <p>
                      <v-icon left color="primary">
                        mdi-ferry
                      </v-icon> {{ packageDetails.cruise.ship_name }}
                    </p>
                  </v-card-text>

                  <v-card-actions class="py-0">
                    <v-spacer />
                    <v-btn v-if="packageDetails.cruise" tile color="primary" class="my-1" @click="addCruiseDialog = true">
                      Change Cruise
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </aside>

            <!-- hotels & itenrary -->
            <div>
              <div v-for="(city, i) in packageDetails.packageCities" :key="city.cityId" style="width: 100%" class="day-by-day">
                <div v-if="i === 0" class="custom-side-title-block">
                  <div class="route-title-hed">
                    <span class="coustum-title">Customize your<br></span>Day By Day Itinerary
                  </div>
                </div>
                <p class="text-h3 late--text">
                  {{ city.cityName }}
                </p>

                <!-- hotel -->
                <div v-if="city.cityHotels.length > 0" class="city-hotel">
                  <img :src="city.cityHotels[0].hotelImage" loading="lazy" sizes="(max-width: 479px) 100vw, (max-width: 767px) 96vw, (max-width: 991px) 97vw, (max-width: 1279px) 55vw, 670px" alt="Hotel Image" class="city-hotel-img">
                  <div class="city-hotel-details">
                    <div class="day-city-name">
                      {{ city.cityName }} {{ city.cityDaysNumber }} Days
                    </div>
                    <div class="city-hotel-layer">
                      <div class="day-hotel-name">
                        {{ city.cityHotels[0].hotelName }}
                      </div>

                      <div class="city-hotel-bt-row">
                        <button class="city-hotel-bt" @click="getHotels(city.cityID, i); editingCityId = city.cityID; editingCity = city;">
                          Change Hotel
                        </button>
                        <button class="city-hotel-bt" @click="getHotelDetails(city.cityHotels[0].hotelID); editingCity = city; editingCityId = city.cityID">
                          Change Room
                        </button>
                        <button
                          class="city-hotel-bt-remove"
                          @click="
                            editingCity = city;
                            editingCityId = city.cityID;
                            city.cityHotels = [];
                          "
                        >
                          Remove hotel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <v-btn tile class="late white--text my-3" @click="getHotels(city.cityID, i); editingCityId = city.cityID">
                    add hotel
                  </v-btn>
                  <v-divider class="my-3" />
                </div>

                <!-- activities -->
                <div v-for="(value, key, index) in city.cityActivities" :key="index">
                  <div v-if="city.days[index] === 'open'">
                    <div v-if="value.length > 0 && !updatingActivities">
                      <div class="day-by-day-date">
                        Day
                        <span>{{ prevDaysNum(i) + index + 1 }}</span>
                      </div>
                      <div v-for="(item, j) in value" :key="j" class="itenary-row">
                        <div class="d-mark">
                          <div>+</div>
                        </div>
                        <div v-if="item.activity">
                          <div class="day-time">
                            {{ item.activity.activityStartTime }}<br>{{ item.activity.activityEndTime }}
                          </div>
                          <div>{{ item.activity.activityTitle }}</div>
                          <button class="remove-place w-inline-block" @click="activityDetails = item.activity; activityDetailsDialog = !activityDetailsDialog">
                            <v-icon color="blue">
                              mdi-eye
                            </v-icon>
                          </button>
                          <button class="remove-place w-inline-block" @click="removeActivity(i,j,key)">
                            <img src="~/assets/images/del-icpn.png" loading="lazy" alt="">
                          </button>
                        </div>
                      </div>
                      <div v-if="value.find(el => el.activity && el.activity.activityType !== 'cruise')" class="itenary-row">
                        <div class="d-mark">
                          <div>+</div>
                        </div>
                        <div class="day-time">
                          Free<br>Time
                        </div>
                        <div>You have free time</div>
                        <button class="remove-place w-inline-block blue--text" @click="getActivities(city.cityID); editingCityId = city.cityID; editingActivityDay = key">
                          Add Activity
                        </button>
                      </div>
                    </div>
                    <div v-else>
                      <div class="day-sparator" />
                      <div class="day-by-day-date">
                        Day <span>{{ prevDaysNum(i) + index + 1 }}</span>
                      </div>
                      <div class="itenary-row">
                        <div>Free day</div>
                        <button class="remove-place w-inline-block blue--text" @click="getActivities(city.cityID); editingCityId = city.cityID; editingActivityDay = key">
                          Add Activity
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="day-by-day-date">
                      Day
                      <span>{{ prevDaysNum(i) + index + 1 }}</span>
                    </div>
                    <div class="itenary-row">
                      <div class="d-mark">
                        <div>+</div>
                      </div>
                      <div>
                        Continue Cruise
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- occupancy -->
            <div>
              <div class="custom-side-title-block">
                <div class="route-title-hed">
                  <span class="coustum-title">Customize your<br></span>Occupancy
                </div>
              </div>
              <rooms-and-guests @save="setGuests" />
              <v-checkbox
                v-if="EnteredAdults > 1"
                v-model="singleSupplement"
                label="Single Supplement"
                class="mx-5"
                @change="change_adults"
              />
              <v-text-field
                v-if="singleSupplement"
                v-model="single_travellers_num"
                outlined
                label="Single Supplement travllers number"
                prepend-inner-icon="mdi-account-group"
                color="late"
                :min="1"
                type="number"
                class="mx-5 mb-5"
                hide-details
                @input="change_adults"
              />
            </div>
          </div>

          <!-- pricing -->
          <div class="trip-total-price">
            <div class="stiky-10">
              <div class="price-details-block stikty-top pa-0">
                <div class="price-details-title mb-0">
                  <v-row class="px-5" justify="space-between" align="center">
                    <div>
                      Initial Price<br>
                      <div>${{ totalpricevalue || packageDetails.packagePricePerPerson }}<sub v-if="!totalpricevalue" class="caption">Initial Price / person</sub> <br></div>
                    </div>
                    <div class="custop-trip-bt mt-4" @click="emailDilog = true">
                      <div class="px-10 pt-1">
                        Save Trip
                      </div>
                    </div>
                    <div class="custop-trip-bt mt-4" @click="calculateprice">
                      <div class="px-10 pt-1">
                        Book Trip
                      </div>
                    </div>
                  </v-row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-center my-10 headline font-weight-light">
        Couldn't get the package
      </p>
    </client-only>

    <!-- pop ups -->
    <div v-if="packageDetails">
      <!-- trans -->
      <v-dialog v-model="transDataDialog" max-width="500">
        <v-card v-if="transportation">
          <v-card-title class="late white--text">
            <v-row justify="space-between">
              <span>{{ transportation.transportationType }} Details</span>
              <v-btn icon color="white" @click="transDataDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-row>
          </v-card-title>
          <v-card-text class="pa-5">
            <v-row class="px-5" justify="space-between">
              <div>
                <p class="headline">
                  Date
                </p>
                <p class="late--text font-weight-bold">
                  <date-display :date="transportation.transportationDate" />
                </p>
              </div>
              <div>
                <p class="headline">
                  Price<sub>/person</sub>
                </p>
                <p class="late--text font-weight-bold">
                  ${{ transportation.transportationPricePerPerson }}
                </p>
              </div>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- hotels -->
      <v-dialog v-model="hotelsDialog" max-width="700">
        <v-card>
          <v-card-title class="late white--text">
            <v-row justify="space-between">
              <span>Hotels</span>
              <v-btn icon color="white" @click="hotelsDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-row>
          </v-card-title>
          <v-card-text class="pa-3">
            <div v-for="hotel in packageHotels" :key="hotel.hotelID" class="hotel-result-block">
              <div class="hotel-result-pic">
                <div class="result-img-holder">
                  <v-img :src="hotel.hotelImage" class="hotel-result-img" />
                </div>
              </div>
              <div class="hotel-result-info">
                <div class="hoterl-result-name">
                  {{ hotel.hotelName }}
                </div>
                <div :class="`stars-bar _${hotel.hotelStars}-star`" />
              </div>
              <div class="hotel-result-price">
                <div class="_w-md-50-sm100">
                  <div class="hotel-totlal-price">
                    ${{ hotel.hotelPrice }}<sub class="caption">/person</sub>
                  </div>
                  <div
                    class="select-hotel"
                    @click="getHotelDetails(hotel.hotelID)"
                  >
                    Select
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showHotelDetails" fullscreen>
        <v-card tile>
          <div style="position: sticky; top: 0; z-index: 2;" class="d-flex justify-space-between late align-center">
            <v-card-title class="white--text">
              <v-btn icon color="white" large @click="showHotelDetails = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>Hotel Details
            </v-card-title>
            <v-btn
              tile
              elevation="0"
              class="mr-5"
              :disabled="!selectedRooms.length"
              color="white"
              large
              @click="reserveRooms()"
            >
              Reseve Rooms ({{ selectedRooms.length }})
            </v-btn>
          </div>
          <v-img :src="packageHotelDetails.hotelImage" max-height="200" />
          <v-card-text class="pa-5">
            <v-row justify="space-between" align="end">
              <div>
                <h3>{{ packageHotelDetails.hotelName }}</h3>
                <p class="grey--text">
                  <v-icon>mdi-map-marker</v-icon> {{ packageHotelDetails.hotelAddress }}
                </p>
                <p class="grey--text">
                  <v-icon>mdi-phone</v-icon> {{ packageHotelDetails.hotelPhone }}
                </p>
              </div>
              <div>
                <v-rating
                  v-model="packageHotelDetails.hotelStars"
                  background-color="orange lighten-3"
                  color="orange"
                />
                <v-btn text color="blue" @click="openMap(packageHotelDetails.hotelLatitude, packageHotelDetails.hotelLongitude)">
                  <v-icon>mdi-map</v-icon> {{ showMap ? 'Hide map' : 'show on map' }}
                </v-btn>
              </div>
            </v-row>
            <v-expand-transition>
              <gmap-map
                v-show="showMap"
                :center="center"
                :zoom="24"
                style="width:100%;  height: 500px;"
                zoom-control
                class="mt-1"
              >
                <gmap-marker
                  v-for="(m, index) in markers"
                  :key="index"
                  :position="m.position"
                  :clickable="true"
                  :draggable="true"
                  @click="center=m.position"
                />
              </gmap-map>
            </v-expand-transition>
            <p v-html="packageHotelDetails.hotelDescription" />
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Facilities
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p v-for="item in packageHotelDetails.hotelFacilities" :key="item">
                    <v-icon>mdi-check</v-icon> {{ item }}
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Policies
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p v-for="item in packageHotelDetails.hotelPolicies" :key="item">
                    <v-icon>mdi-check</v-icon> {{ item }}
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-card v-for="item in packageHotelDetails.hotelRooms" :key="item.roomID" class="my-3">
              <v-card-title class="late white--text">
                {{ item.roomType }}, {{ item.roomOccupancy }}
              </v-card-title>
              <v-card-text class="pa-3">
                <p>{{ item.roomMaxNumberOfAdult }} Adult(s) Maximum, {{ item.roomMaxNumberOfChildren === 0 ? 'No children' : (item.roomMaxNumberOfChildren > 1 ? item.roomMaxNumberOfChildren + 'Children' : item.roomMaxNumberOfChildren + 'Child') }}</p>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      Amenities
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p v-for="amen in item.roomAmenities" :key="amen">
                        <v-icon>mdi-check</v-icon> {{ amen }}
                      </p>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      Inclusions
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p v-for="inc in item.roomInclusions" :key="inc">
                        <v-icon>mdi-check</v-icon> {{ inc }}
                      </p>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-row class="mx-5 mt-10" justify="space-between" align="center">
                  <h3>${{ item.roomSeason ? item.roomSeason.roomSeasonPricePerDay : 0 }} / Person </h3>
                  <div class="d-flex align-center">
                    <v-text-field
                      v-model="item.selectionNumber"
                      min="1"
                      type="number"
                      hide-details
                      class="mr-3"
                      label="Number of Rooms"
                      dense
                      outlined
                    />
                    <v-btn tile :color="item.selected ? 'error' : 'late'" class="white--text" @click="manageRoom(item)">
                      {{ selectedRooms.includes(item) || item.selected ? 'Unselect Room' : 'Select Room' }}
                    </v-btn>
                  </div>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- activities -->
      <v-dialog v-model="activitiesDialog">
        <client-only>
          <v-card tile>
            <v-card-title class="late white--text">
              <v-btn icon color="white" large @click="activitiesDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>City activities
            </v-card-title>
            <v-card-text class="pa-5">
              <v-card v-for="item in packageActivities" :key="item.activityID" class="mb-3">
                <div v-if="item">
                  <v-card-title class="late white--text">
                    <v-row justify="space-between">
                      <span>{{ item.activityTitle }}</span>
                      <span>{{ item.activityType }}, {{ item.activityDuration_digits }} {{ item.activityDuration_type }}(s)</span>
                    </v-row>
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row v-if="item.activityImages.length" class="my-3">
                      <v-img v-for="image in item.activityImages" :key="image[0]" max-width="150" class="rounder-lg ma-3" :src="image[0]" />
                    </v-row>
                    <p class="grey--text" v-html="item.activityOverview" />
                    <v-row justify="space-around">
                      <div>
                        <h4>Includes</h4>
                        <p v-for="inc in item.activityIncludes" :key="inc">
                          <v-icon>mdi-check</v-icon> {{ inc }}
                        </p>
                      </div>
                      <div>
                        <h4>Exclusions</h4>
                        <p v-for="exc in item.activityExcludes" :key="exc">
                          <v-icon>mdi-check</v-icon> {{ exc }}
                        </p>
                      </div>
                    </v-row>
                    <v-simple-table v-if="item.activityType === 'camping' && item.sideActivity.length > 0" dense>
                      <template #default>
                        <thead>
                          <tr>
                            <th class="text-left">
                              Title
                            </th>
                            <th class="text-left">
                              Time
                            </th>
                            <th class="text-left">
                              Day Number
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(side, i) in item.sideActivity"
                            :key="i"
                          >
                            <td>{{ side.activityName }}</td>
                            <td>{{ side.activityTime }}</td>
                            <td>Day {{ side.activityDayNumber }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                    <v-divider />
                    <v-row class="mx-5" justify="space-between" align="center">
                      <div>
                        <h3>Price per person<small class="caption">/minimum {{ item.activityPaxMinimum }} travellers</small> </h3>
                        <h3>${{ item.activityPricePerPerson }}</h3>
                      </div>
                      <v-btn tile class="late white--text" @click="setActivity(item)">
                        Select
                      </v-btn>
                    </v-row>
                  </v-card-text>
                </div>
              </v-card>
            </v-card-text>
          </v-card>
        </client-only>
      </v-dialog>
      <v-dialog v-model="activityDetailsDialog">
        <v-card v-if="activityDetails">
          <v-card-title class="pa-2 brown white--text d-flex justify-space-between">
            {{ activityDetails.activityTitle }}
            <v-btn color="white" icon @click="activityDetailsDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-5">
            <v-row v-if="activityDetails.activityImages.length" class="my-3">
              <v-img v-for="image in activityDetails.activityImages" :key="image[0]" max-width="150" class="rounder-lg ma-3" :src="image[0]" />
            </v-row>
            <p class="headline black--text">
              Over View
            </p>
            <p class="body-1" v-html="activityDetails.activityOverview" />
            <p class="headline black--text">
              Includes
            </p>
            <p v-for="(item, i) in activityDetails.activityIncludes" :key="i + item" class="body-1">
              {{ item }}
            </p>
            <p class="headline black--text">
              Excludes
            </p>
            <p v-for="(item, k) in activityDetails.activityExcludes" :key="k + item" class="body-1">
              {{ item }}
            </p>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- email dialog -->
      <v-dialog v-model="emailDilog">
        <v-card>
          <v-card-title class="pa-2 brown white--text d-flex justify-space-between">
            Please enter your email.
            <v-btn color="white" icon @click="emailDilog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-5">
            <v-text-field v-model="email" type="email" prepend-inner-icon="mdi-email" outlined />
          </v-card-text>
          <v-card-actions>
            <v-btn text placeholder="Email ..." color="warning" @click="emailDilog = false">
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn tile :disabled="!email" elevation="0" color="late white--text" @click="sendEmail">
              Send
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- price dialog -->
      <v-dialog v-model="priceDialog" max-width="700">
        <v-card>
          <v-card-title class="late white--text">
            Package Summary
          </v-card-title>
          <v-card-text>
            <v-simple-table class="rounded-xl">
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Adults Number
                    </th>
                    <th class="text-left">
                      Children Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ EnteredAdults }}</td>
                    <td>
                      <span v-if="EnteredChildren">{{ EnteredChildren }}</span>
                      <span v-else>No children</span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <v-divider class="my-3" />
            <div class="d-flex justify-space-between late--text">
              <div class="text-h5">
                Grand Total
              </div>
              <div class="text-h5">
                ${{ totalpricevalue }}
              </div>
            </div>
          </v-card-text>

          <v-divider class="my-3" />

          <v-card-actions>
            <v-btn text color="warning" @click="priceDialog = false">
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn tile elevation="0" dark color="late" @click="saveTrip">
              Proceed
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- cruises dialog -->
      <v-dialog v-model="cruiseDialog" max-width="700">
        <v-card v-if="packageDetails.cruise">
          <v-card-title class="late white--text mb-5">
            Package Cruise
          </v-card-title>
          <v-card-text>
            <v-img max-height="200" :src="packageDetails.cruise.master_image" />
            <div v-if="packageDetails.cruise.images" class="d-flex flex-wrap justify-center">
              <v-img
                v-for="(image, i) in packageDetails.cruise.images"
                :key="i"
                max-width="20%"
                class="ma-1"
                :src="image.image"
                max-height="150"
              />
            </div>
            <div class="d-flex justify-space-between align-center">
              <h3 class="my-1">
                {{ packageDetails.cruise.name }} <small class="body-2">/ {{ packageDetails.cruise.number_of_nights }} nights</small>
              </h3>
              <v-rating
                background-color="gray"
                color="warning"
                dense
                empty-icon="mdi-star-outline"
                full-icon="mdi-star"
                length="5"
                readonly
                size="15"
                :value="packageDetails.cruise.stars"
              />
            </div>
            <p v-html="packageDetails.cruise.description" />
            <p>
              <v-icon left color="primary">
                mdi-map-marker
              </v-icon> {{ packageDetails.cruise.cruise_line }}
            </p>
            <p>
              <v-icon left color="primary">
                mdi-ferry
              </v-icon> {{ packageDetails.cruise.ship_name }}
            </p>

            <h5>Facilities</h5>
            <template v-for="(item, i) in packageDetails.cruise.facilities">
              <v-chip v-if="item" :key="i" class="ma-1">
                {{ item }}
              </v-chip>
            </template>

            <h5>Inclusions</h5>
            <div v-for="(item, i) in packageDetails.cruise.includes" :key="i">
              <v-chip v-if="item" :key="i" class="ma-1">
                {{ item }}
              </v-chip>
            </div>

            <h5>Exclusions</h5>
            <div v-for="(item, i) in packageDetails.cruise.excludes" :key="i">
              <v-chip v-if="item" :key="i" class="ma-1">
                {{ item }}
              </v-chip>
            </div>

            <h5>Policies</h5>
            <div v-for="(item, i) in packageDetails.cruise.Policies" :key="i">
              <v-chip v-if="item" :key="i" class="ma-1">
                {{ item }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="addCruiseDialog" max-width="700">
        <v-card>
          <v-card-title class="late white--text">
            {{ packageDetails.cruise ? 'Change' : 'Add' }} Package Cruise
          </v-card-title>
          <v-card-text class="mt-5">
            <v-select
              v-model="cruiseCityID"
              :items="packageDetails.packageCities"
              item-value="cityID"
              item-text="cityName"
              color="blue"
              outlined
              label="Cruise Start City"
              @input="getCruisesByCity()"
            />

            <v-select
              v-model="selectedCruise"
              :items="cruises"
              item-value="id"
              item-text="name"
              color="blue"
              outlined
              label="Choose Crusie"
              :disabled="!cruiseCityID"
              clearable
              return-object
            />
          </v-card-text>
          <v-card-actions>
            <v-btn text color="warning" @click="addCruiseDialog = false">
              cancel
            </v-btn>
            <v-spacer />
            <v-btn color="primary" :disabled="!selectedCruise" @click="packageDetails.cruise = selectedCruise; addCruiseDialog = false">
              {{ packageDetails.cruise ? 'Change' : 'Add' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import tripsServices from '~/services/tripsServices'
import cruisesServices from '~/services/cruisesServices'

export default {
  data () {
    return {
      editingCity: null,
      EnteredRooms: 0,
      Occupancyvalue: 0,
      initialpriceperperson: 0,
      hoteltotal: 0,
      activitiestotal: 0,
      transportationtotal: 0,
      totalpricevalue: 0,
      checkicon: false,
      solo: 0,
      EnteredAdults: 0,
      Childrenages: [],
      childrenpercentage: 0,
      AdultsCheckbox: false,
      EnteredChildren: 0,
      Occupancyentered: 0,
      OccupancyRooms: 0,
      OccupancyAdults: 0,
      OccupancyChildren: 0,
      Occupancy: 0,
      snackbar: false,
      currentprice: 0,
      newprice: 0,
      color: '',
      text: '',
      packageDetails: null,
      packagePrices: null,
      transportation: null,
      transDataDialog: false,
      departFlight: null,
      returnFlight: null,
      departAirport: null,
      returnAirport: null,
      citiesAirports: [],
      tripFlightType: 'package',
      fligthDialog: false,
      fligthShowDialog: false,
      query: '',
      departSearchId: '',
      returnSearchId: '',
      selectedFlight: null,
      packageHotels: [],
      hotelsDialog: false,
      showHotelDetails: false,
      packageHotelDetails: {},
      showMap: false,
      editingCityId: null,
      editingCityIndex: null,
      center: {
        lat: 0,
        lng: 0
      },
      markers: [],
      daysMarker: 0,
      packageActivities: [],
      activitiesDialog: false,
      editingActivityDay: '',
      updatingActivities: false,
      addFlightDialog: false,
      openFlightContent: true,
      startDate: '',
      startDateText: '',
      startDateMenu: false,
      OccupancyMenu: false,
      activityDetails: null,
      activityDetailsDialog: false,
      guestNationality: { code: 'US', name: 'United States' },
      singleSupplement: false,
      single_travellers_num: 0,
      added_activities: [],
      removed_activities: [],
      email: '',
      emailDilog: false,
      loadSave: false,
      removedRooms: [],
      addedRooms: [],
      selectedRooms: [],
      citiesRooms: [],
      roomsNum: 0,
      priceDialog: false,
      hotelPrices: [],
      packagePriceSessionId: null,
      guests: [
        {
          adults: 1,
          children: 0,
          childrenAges: []
        }
      ],
      days: [],
      cruiseDialog: false,
      addCruiseDialog: false,
      cruiseCityID: null,
      cruises: [],
      selectedCruise: null,
      loaded: true
    }
  },
  async fetch () {
    if (this.$route.params.slug) {
      await this.getPackage()
    } else if (this.$route.query.custom_package) {
      await this.getSavedPackage()
    } else { this.$router.go(-1) }
  },
  head () {
    return {
      title: this.$route.params.slug
    }
  },
  computed: {
    countries () {
      return this.$store.state.countries
    }
  },
  watch: {
    startDate (newVal) {
      this.packageDetails.packageStartDate = newVal
    }
  },
  created () {
    this.setGuests([
      {
        adults: 1,
        children: 0,
        childrenAges: []
      }
    ])
  },
  methods: {
    async getCruisesByCity () {
      const promise = cruisesServices.getCityCruises(this.cruiseCityID, 1, 10)
      const response = await promise
      const results = response.data
      this.cruises = results.data.cruiseList
    },
    setGuests (guests) {
      this.EnteredRooms = guests.length
      this.guests = guests
      this.EnteredAdults = 0
      this.EnteredChildren = 0
      this.Childrenages = []
      guests.forEach((item) => {
        this.EnteredAdults += Number(item.adults)
        this.EnteredChildren += Number(item.children)
        this.Childrenages.concat(item.childrenAges)
      })
    },
    showRoomUpdateAlert () {
      this.snackbar = true
      this.color = 'warning'
      this.text = 'You have updated your criteria. Please update your rooms selection.'
    },
    manageRoom (room) {
      if (this.selectedRooms.find(item => item.roomID === room.roomID)) {
        this.selectedRooms.splice(this.selectedRooms.indexOf(room), 1)
        room.selected = false
        room.selectionNumber = 1
      } else {
        this.selectedRooms.push(room)
        room.selected = true
      }
    },
    reserveRooms () {
      let roomsAdultsOccupancy = 0
      let roomsChildrenOccupancy = 0
      this.selectedRooms.forEach((room) => {
        roomsAdultsOccupancy += parseInt(room.roomMaxNumberOfAdult) * room.selectionNumber
        roomsChildrenOccupancy += parseInt(room.roomMaxNumberOfChildren) * room.selectionNumber
      })
      if (roomsAdultsOccupancy >= parseInt(this.EnteredAdults) && roomsChildrenOccupancy >= parseInt(this.EnteredChildren || 0)) {
        this.editingCity.selectedRooms = this.selectedRooms
        this.editingCity.selectedRooms.forEach((room) => {
          this.citiesRooms.push(room)
          this.roomsNum += parseInt(room.selectionNumber)
        })
        this.selectedRooms = []
        this.showHotelDetails = false
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please select the correct number of rooms! your occupancy is ' + this.EnteredAdults + ' adults and ' + this.EnteredChildren || 0 + ' children and your rooms occupancies are ' + roomsAdultsOccupancy + ' adults and ' + roomsChildrenOccupancy + ' children'
      }
    },
    allowedDates (val) {
      const date = new Date(val.replaceAll('-', '/'))
      const days = this.packageDetails.start_days.filter(item => !!item)
      const seasons = this.packageDetails.seasons
      let allowedDay = false
      if (days.includes(date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()) || !days.length) { allowedDay = true }
      let allowedSeason = false
      if (seasons.length) {
        for (let index = 0; index < seasons.length; index++) {
          if (date.getTime() >= new Date(seasons[index].from.replaceAll('-', '/')).getTime() && date.getTime() <= new Date(seasons[index].to.replaceAll('-', '/')).getTime()) { allowedSeason = true }
        }
      } else { allowedSeason = true }
      return allowedDay && allowedSeason
    },
    getDateHint () {
      let text = 'You can choose from allowed dates :'
      for (let index = 0; index < this.packageDetails.start_days.filter(item => !!item).length; index++) {
        if (this.packageDetails.start_days[index]) { text += this.packageDetails.start_days[index] + ',' }
      }
      for (let index = 0; index < this.packageDetails.seasons.length; index++) {
        text += 'from' + this.packageDetails.seasons[index].from + ' to ' + this.packageDetails.seasons[index].to + ' / '
      }
      if (!this.packageDetails.start_days.filter(item => !!item).length && !this.packageDetails.seasons.length) { text = '' }
      return text
    },
    prevDaysNum (index) {
      let count = 0
      if (index) {
        for (let i = 0; i < index; i++) {
          count += Object.keys(this.packageDetails.packageCities[i].cityActivities).length
        }
      }
      return count
    },
    setDaysMarker (index) {
      this.daysMarker = index + 1
    },
    closeAllDialogs () {
      this.transDataDialog = false
      this.fligthDialog = false
      this.fligthShowDialog = false
      this.hotelsDialog = false
      this.activitiesDialog = false
      this.addFlightDialog = false
    },
    formatDate () {
      if (!this.startDate) { return null }
      const [year, month, day] = this.startDate.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const newDate = `${day} ${months[month - 1]} ${year}`
      this.startDateText = newDate
    },
    removeCity (i) {
      if (this.startDate) {
        Object.entries(this.packageDetails.packageCities[i].cityActivities).forEach(([key, value]) => {
          value.forEach((item) => {
            this.removed_activities.push(item.activity)
            this.initialpriceperperson -= item.activity.activityPricePerPerson
          })
        })
        delete this.packageDetails.packageCities.splice(i, 1)
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    async getHotels (id, i) {
      if (this.startDate) {
        this.editingCityIndex = i
        const checkInDate = this.getDate(this.packageDetails.packageStartDate, this.getDaysNumber())
        const checkOutDate = this.getDate(checkInDate, this.packageDetails.packageCities[i].cityDaysNumber)
        const promise = tripsServices.getTripHotels(id, checkInDate, checkOutDate, this.OccupancyRooms, this.OccupancyAdults, this.OccupancyChildren)
        const response = await promise
        const results = response.data.data
        if (results.hotelList.length > 0) {
          this.packageHotels = results.hotelList
          this.hotelsDialog = true
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = 'No hotels found'
        }
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    async getHotelDetails (id) {
      if (this.startDate) {
        this.hotelsDialog = false
        // getTripHotelDetails
        const promise = tripsServices.getTripHotelDetails(id, this.EnteredRooms, this.EnteredAdults, this.EnteredChildren || 0, this.Childrenages)
        const response = await promise
        const results = response.data.data
        this.selectedRooms = this.editingCity.selectedRooms
        this.packageHotelDetails = results
        this.editingCity.cityHotels = [results]
        this.packageHotelDetails.hotelRooms.forEach((item) => {
          if (this.editingCity.selectedRooms.find(room => item.roomID === room.roomID)) { item.selected = true } else { item.selected = false }
          if (this.editingCity.selectedRooms.find(room => item.roomID === room.roomID)) { item.selectionNumber = this.editingCity.selectedRooms.find(room => item.roomID === room.roomID).selectionNumber } else { item.selectionNumber = 1 }
        })
        this.showHotelDetails = true
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    async calculateprice () {
      const body = {
        numberOfRooms: this.guests.length,
        roomGuests: this.guests,
        package_id: this.packageDetails.packageID,
        startDate: this.startDate,
        added_activities: this.added_activities,
        removed_activities: this.removed_activities,
        added_rooms: this.addedRooms,
        removed_rooms: this.removedRooms,
        singleSupplement: this.singleSupplement,
        single_travellers_num: this.single_travellers_num,
        solo: this.AdultsCheckbox,
        packageCities: []
      }

      if (this.packageDetails.cruise) { body.cruise_id = this.packageDetails.cruise.id }

      this.packageDetails.packageCities.forEach((item) => {
        if (typeof item.cityHotels[0] === 'undefined') {
          body.packageCities.push({
            cityID: item.cityID,
            cityDaysNumber: item.cityDaysNumber,
            cityDuration: item.cityDuration,
            hotelRooms: item.selectedRooms
          })
        } else {
          body.packageCities.push({
            cityID: item.cityID,
            cityDaysNumber: item.cityDaysNumber,
            hotelRooms: item.selectedRooms,
            cityDuration: item.cityDuration,
            hotelID: item.cityHotels[0].hotelID
          })
        }
      })
      const promise = tripsServices.getTripTotalPrice(body)
      const response = await promise
      const results = response.data.data
      this.totalpricevalue = results.totalPrice
      this.hotelPrices = results.hotelPrices
      this.packagePriceSessionId = results.sessionId
      this.priceDialog = true
    },
    changeRoom (room) {
      if (this.startDate) {
        this.packageDetails.packageCities.forEach((item) => {
          if (this.editingCityId === item.cityID) {
            const days = this.packageDetails.packageCities.find(x => x.cityID === item.cityID)
            if (item.cityHotels[0]) { this.initialpriceperperson = item.cityHotels[0].room.roomSeason ? this.initialpriceperperson - (Number(item.cityHotels[0].room.roomSeason.roomSeasonPricePerDay) * days.cityDaysNumber) : 0 }
            item.cityHotels[0].room.numberOfNights = days.cityDaysNumber
            room.numberOfNights = days.cityDaysNumber
            this.removedRooms.push(item.cityHotels[0].room)
            this.addedRooms.push(room)
            item.cityHotels[0] = {
              hotelID: this.packageHotelDetails.hotelID,
              hotelImage: this.packageHotelDetails.hotelImage,
              hotelName: this.packageHotelDetails.hotelName,
              hotelStars: this.packageHotelDetails.hotelStars,
              room,
              tripCityHotelID: this.packageHotelDetails.hotelID
            }
            this.hoteltotal = room.roomSeason ? room.roomSeason.roomSeasonPricePerDay : 0
            this.initialpriceperperson = Number(this.initialpriceperperson) + (Number(this.hoteltotal) * days.cityDaysNumber)
          }
        })
        this.showHotelDetails = false
        this.hotelsDialog = false
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    openMap (lat, lng) {
      this.showMap = !this.showMap
      this.center.lat = parseFloat(lat)
      this.center.lng = parseFloat(lng)
      this.markers.push({ position: this.center })
    },
    async getActivities (id) {
      if (this.startDate) {
        const promise = tripsServices.getTripActivities(id, 1)
        const response = await promise
        const results = response.data.data
        this.packageActivities = results.ActivityList
        this.activitiesDialog = true
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    setActivity (activity) {
      if (this.startDate) {
        this.packageDetails.packageCities.forEach((item) => {
          if (this.editingCityId === item.cityID) {
            item.cityActivities[this.editingActivityDay].push({ activity, activityDayNumber: this.editingActivityDay.split('_')[1] })
            this.added_activities.push(activity)
            this.initialpriceperperson += Number(activity.activityPricePerPerson)
            this.activitiestotal += (Number(activity.activityPricePerPerson) * this.OccupancyAdults)
          }
          this.activitiesDialog = false
        })
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    removeActivity (i, j, key) {
      if (this.startDate) {
        this.updatingActivities = true
        this.initialpriceperperson -= this.packageDetails.packageCities[i].cityActivities[key][j].activity.activityPricePerPerson
        this.removed_activities.push(this.packageDetails.packageCities[i].cityActivities[key][j].activity)
        this.packageDetails.packageCities[i].cityActivities[key].splice(j, 1)
        this.updatingActivities = false
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    showCheckIcon (cityIndex, index, type, price) {
      if (this.startDate) {
        document.getElementsByClassName(`w-form-formradioinput-${cityIndex}`).forEach((element) => {
          element.style.display = 'none'
        })
        document.getElementsByClassName('transport-m').forEach((element) => {
          element.style.color = 'rgb(148, 146, 146)'
        })
        document.getElementById(`trans-label-${cityIndex}-${index}`).style.color = '#333'
        document.getElementById(`check-icon-${cityIndex}-${index}`).style.display = 'flex'
        if (this.packageDetails.packageCities[cityIndex].cityTransportationPrice) { this.initialpriceperperson -= Number(this.packageDetails.packageCities[cityIndex].cityTransportationPrice) }
        if (type !== 'flight') {
          this.packageDetails.packageCities[cityIndex].cityTransportation = type
          this.packageDetails.packageCities[cityIndex].cityTransportationPrice = price
          this.initialpriceperperson += Number(price)
        }
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    getDate (date, nights) {
      if (this.startDate) {
        const editingDate = new Date(date)
        editingDate.setDate(editingDate.getDate() + nights)
        const dd = String(editingDate.getDate()).padStart(2, '0')
        const mm = String(editingDate.getMonth() + 1).padStart(2, '0')
        const yyyy = editingDate.getFullYear()
        const dateFormatted = yyyy + '-' + mm + '-' + dd
        return dateFormatted
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    getDaysNumber () {
      if (this.startDate) {
        let days = 0
        for (let index = 0; index < this.packageDetails.packageCities.length; index++) {
          if (index < this.editingCityIndex) { days = days + Number(this.packageDetails.packageCities[index].cityDaysNumber) }
        }
        return days
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    minimisePrice (dayActivities) {
      if (this.startDate) {
        if (dayActivities !== null && dayActivities !== undefined) {
          for (let index = 0; index < dayActivities.length; index++) {
            this.initialpriceperperson -= Number(dayActivities[index].activity.activityPricePerPerson)
          }
        }
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
        this.closeAllDialogs()
      }
    },
    async getPackage () {
      const promise = tripsServices.getTripDetails(this.$route.params.slug)
      const response = await promise
      const results = response.data
      this.packageDetails = results.data
      this.packageDetails.packageCities.forEach(function (i) {
        i.selectedRooms = []
        i.days = []
        for (let index = 0; index < Object.keys(i.cityActivities).length; index++) {
          i.days[index] = 'open'
        }
        for (let index = 0; index < Object.keys(i.cityActivities).length; index++) {
          const activity = i.cityActivities['day_' + (Number(index) + 1)].find(el => el.activity && el.activity.activityType === 'cruise')
          if (activity) {
            for (let j = 1; j < activity.activity.activityDuration_digits; j++) {
              i.days[index + j] = 'closed'
            }
          }
        }
        for (let index = 0; index < i.days.length; index++) {
          if (i.days[index] === 'closed') {
            i.cityActivities['day_' + (Number(index) + 1)] = []
          }
        }
        if (Object.keys(i.cityActivities).length < i.cityDaysNumber && Object.keys(i.cityActivities).length !== 0) {
          for (let j = Object.keys(i.cityActivities).length + 1; j < i.cityDaysNumber + 1; j++) {
            i.cityActivities['day_' + (Object.keys(i.cityActivities).length + 1)] = []
          }
        }
      })

      this.Occupancyvalue = Number(this.packageDetails.package_occupancy)
      this.packagePrices = results.prices
      this.EnteredChildren = 0
      this.EnteredRooms = 1
      this.OccupancyChildren = this.EnteredChildren
      this.OccupancyAdults = this.EnteredAdults
      this.OccupancyRooms = this.EnteredRooms
      if (this.EnteredAdults === 1 && this.solo === 1) {
        this.solo = 1
        this.OccupancyAdults = 1
        this.newprice = Number(this.packagePrices.solo)
        this.initialpriceperperson = Number(this.packagePrices.solo)
        this.currentprice = Number(this.packagePrices.solo)
      } else if (this.EnteredAdults >= 1 && this.EnteredAdults <= 2) {
        this.solo = 0
        this.AdultsCheckbox = false
        this.OccupancyAdults = this.EnteredAdults
        this.OccupancyChildren = this.EnteredChildren
        this.newprice = Number(this.packagePrices.limo)
        this.initialpriceperperson = Number(this.packagePrices.limo)
        this.currentprice = Number(this.packagePrices.limo)
      } else if (this.EnteredAdults >= 3 && this.EnteredAdults <= 8) {
        this.solo = 0
        this.AdultsCheckbox = false
        this.OccupancyAdults = this.EnteredAdults
        this.newprice = Number(this.packagePrices.hiac)
        this.initialpriceperperson = Number(this.packagePrices.hiac)
        this.currentprice = Number(this.packagePrices.hiac)
      } else if (this.EnteredAdults >= 9 && this.EnteredAdults <= 18) {
        this.solo = 0
        this.AdultsCheckbox = false
        this.OccupancyAdults = this.EnteredAdults
        this.newprice = Number(this.packagePrices.caster)
        this.initialpriceperperson = (this.packagePrices.caster)
        this.currentprice = (this.packagePrices.caster)
      } else if (this.EnteredAdults >= 18 && this.EnteredAdults <= 50) {
        this.solo = 0
        this.AdultsCheckbox = false
        this.OccupancyAdults = this.EnteredAdults
        this.newprice = Number(this.packagePrices.bus)
        this.initialpriceperperson = Number(this.packagePrices.bus)
        this.currentprice = Number(this.packagePrices.bus)
      }
      if (this.packageDetails.packageStartDate) { this.startDate = this.packageDetails.packageStartDate } else {
        this.packageDetails.packageStartDate = new Date().toISOString().substr(0, 10)
        this.startDate = this.packageDetails.packageStartDate
      }
      for (let index = 0; index < this.packageDetails.packageCities.length; index++) {
        this.citiesAirports[0] = null
      }

      // this.addMetaData(results.seo_data, { title: this.packageDetails.packageMetaTitle, description: this.packageDetails.packageMetaDesc })
    },
    async getSavedPackage () {
      const promise = tripsServices.getSavedTripDetails(this.$route.query.custom_package)
      const response = await promise
      const results = response.data
      this.packageDetails = results.package
      this.EnteredAdults = results.adults
      this.EnteredChildren = results.children
      this.prices = results.prices
      this.totalpricevalue = results.totalPrice
      this.AdultsCheckbox = results.solo
      this.singleSupplement = results.singleSupplement
      this.EnteredRooms = results.rooms
      this.startDate = results.package.packageStartDate
    },
    // addMetaData (main, special) {
    //   document.title = 'TaNefer' + ' | ' + main.title + ' | ' + special.title
    //   document.getElementsByTagName('title')[0].innerText = document.title
    //   const meta = document.createElement('meta')
    //   meta.name = 'description'
    //   meta.content = main.meta_description + ' ' + special.description
    //   document.getElementsByTagName('head')[0].prepend(meta)
    // },
    change_rooms () {
      this.OccupancyRooms = this.EnteredRooms
    },
    change_adults () {
      if (this.EnteredAdults > 0) {
        if (Number(this.EnteredAdults) === 1 && this.solo === 1) {
          this.solo = 1
          this.OccupancyAdults = 1
          this.newprice = Number(this.packagePrices.solo)
        } else if (Number(this.EnteredAdults) === 1 && this.solo === 0) {
          this.solo = 0
          this.AdultsCheckbox = false
          this.OccupancyAdults = this.EnteredAdults
          this.OccupancyChildren = this.EnteredChildren
          this.newprice = Number(this.packageDetails.packagePricePerPerson)
        } else if (Number(this.EnteredAdults) === 2) {
          this.solo = 0
          this.AdultsCheckbox = false
          this.OccupancyAdults = this.EnteredAdults
          this.OccupancyChildren = this.EnteredChildren
          this.newprice = Number(this.packagePrices.limo)
        } else if (this.EnteredAdults >= 3 && this.EnteredAdults <= 8) {
          this.solo = 0
          this.AdultsCheckbox = false
          this.OccupancyAdults = this.EnteredAdults
          this.newprice = Number(this.packagePrices.hiac)
        } else if (this.EnteredAdults >= 9 && this.EnteredAdults <= 18) {
          this.solo = 0
          this.AdultsCheckbox = false
          this.OccupancyAdults = this.EnteredAdults
          this.newprice = Number(this.packagePrices.caster)
        } else if (this.EnteredAdults > 18 && this.EnteredAdults <= 50) {
          this.solo = 0
          this.AdultsCheckbox = false
          this.OccupancyAdults = this.EnteredAdults
          this.newprice = Number(this.packagePrices.bus)
        } else if (this.EnteredAdults > 50) {
          this.EnteredAdults = 0
          this.OccupancyAdults = 0
          this.solo = 0
          this.snackbar = true
          this.color = 'warning'
          this.text = 'You cant enter more than 50 Adults'
          this.closeAllDialogs()
        }
        const val = Number(this.newprice) - Number(this.currentprice)
        this.initialpriceperperson += val
        this.currentprice = this.newprice
      } else {
        this.solo = 0
        this.EnteredAdults = 0
        this.OccupancyAdults = 0
        this.EnteredChildren = 0
      }
      this.packageDetails.packageCities.forEach((city) => {
        city.selectedRooms = []
      })
    },
    async saveTrip () {
      if (this.startDate) {
        const body = {
          numberOfRooms: this.guests.length,
          roomGuests: this.guests,
          package_id: this.packageDetails.packageID,
          city_start: this.getCity('first'),
          city_end: this.getCity('last'),
          start_date: this.startDate,
          total_price: { accommodation: null, transport: null, itineraries: null, total: this.totalpricevalue },
          sessionId: this.packagePriceSessionId,
          booking_cities: this.getCity('all'),
          adults: this.EnteredAdults,
          children: this.EnteredChildren,
          added_activities: this.added_activities,
          removed_activities: this.removed_activities,
          added_rooms: this.addedRooms,
          removed_rooms: this.removedRooms
        }
        if (this.OccupancyAdults > 1) { body.singleSupplement = this.singleSupplement } else { body.solo = this.AdultsCheckbox }
        const promise = tripsServices.saveTrip(body)
        const response = await promise
        const result = response.data.data
        const bookingId = result.booking_id
        localStorage.setItem('bookFor', 'package')
        localStorage.setItem('bookingId', bookingId)
        localStorage.setItem('packagePrice', this.totalpricevalue)
        localStorage.setItem('priceSessionId', this.packagePriceSessionId)
        localStorage.setItem('packageID', this.packageDetails.packageID)
        localStorage.setItem('adults', this.OccupancyAdults)
        localStorage.setItem('children', this.OccupancyChildren)
        localStorage.setItem('package', JSON.stringify({
          id: this.packageDetails.packageID,
          night_numbers: this.packageDetails.packageNightsNumber,
          name: this.packageDetails.packageTitle,
          start_date: this.startDate,
          cities: this.packageDetails.packageCities
        }))
        this.$store.dispatch('setPassengersData', {
          adults: this.OccupancyAdults,
          children: this.OccupancyChildren,
          infants: 0,
          classType: { text: 'Economy', value: 'Y' }
        })
        const routeData = this.$router.resolve({ name: 'booking-module', params: { module: 'trip' } })
        window.open(routeData.href, '_blank')
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose start date'
      }
    },
    sendEmail () {
      const body = {
        url: window.location.href,
        email: this.email,
        package: this.packageDetails,
        prices: this.packagePrices,
        totalPrice: this.totalpricevalue,
        adults: this.EnteredAdults,
        children: this.EnteredChildren,
        rooms: this.EnteredRooms,
        solo: this.AdultsCheckbox,
        singleSupplement: this.singleSupplement
      }
      try {
        tripsServices.saveToMail(body)
        this.snackbar = true
        this.color = 'success'
        this.text = 'Saved Successfully, You will recieve an email'
      } catch (error) {
        this.snackbar = false
        this.color = 'error'
        this.text = 'Couldnot save package!'
      } finally {
        this.emailDilog = false
      }
    },
    getCity (type) {
      if (type === 'first') {
        const city = {}
        city.id = this.packageDetails.packageCities[0].cityID
        city.with_flight = this.packageDetails.packageCities[0].cityTransportation === 'flight' ? 1 : 0
        return city
      } else if (type === 'last') {
        const city = {}
        city.id = this.packageDetails.packageCities[this.packageDetails.packageCities.length - 1].cityID
        city.with_flight = this.packageDetails.packageCities[this.packageDetails.packageCities.length - 1].returnFlight ? 1 : 0
        return city
      } else {
        const cities = []
        this.packageDetails.packageCities.forEach((item) => {
          const city = {}
          if (item.returnFlight) { city.returnFlight = item.returnFlight }
          city.city_id = item.cityID
          city.nights_number = item.cityDaysNumber
          if (item.cityTransportation) {
            city.transportation_type = item.cityTransportation
            city.transportation_amount = item.cityTransportationPrice
            item.cityTransportations.forEach((trans) => {
              trans.transportationType === 'flight' && trans.flight ? city.transportation_flight_id = trans.flight.id : city.transportation_flight_id = null
            })
          } else {
            city.transportation_type = null
          }
          if (Object.keys(item.cityActivities).length > 0) {
            city.activity = []
            for (const [, value] of Object.entries(item.cityActivities)) {
              value.forEach((element) => {
                element.activity.day_number = element.activityDayNumber
                city.activity.push(element.activity)
              })
            }
          } else { city.activity = [] }
          if (item.cityHotels.length) { city.hotelRooms = item.selectedRooms } else { city.hotelRooms = [] }
          cities.push(city)
        })
        return cities
      }
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
</style>
