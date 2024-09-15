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
      <div style="" class="px-0 my-5">
        <div>
          <v-card class="px-7 pt-7 pb-1" style="border-radius: 15px;">
            <v-row>
              <v-col cols="12" md="4">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-width="0"
                  transition="scale-transition"
                  offset-y
                  max-height="300"
                  :activator="null"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="query"
                      prepend-inner-icon="mdi-map-marker"
                      label="Destination"
                      placeholder="Search for zones..."
                      solo
                      outlined
                      hide-details="auto"
                      v-bind="attrs"
                      v-on="on"
                      @input="handleInput"
                    />
                  </template>

                  <v-list style="overflow-y: auto; max-height: 300px;">
                    <v-list-item
                      v-for="zone in filteredZones"
                      :key="zone.id"
                      @click="handleZoneSelection(zone)"
                    >
                      <v-list-item-content>
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
                      readonly
                      outlined
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="hotelStartDate"
                    color="late"
                    @input="menuStartDate = false, formatDate(hotelStartDate, 1, 'hotelStartDate')"
                  />
                </v-menu>
              </v-col>
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
                      outlined
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="hotelEndDate"
                    color="late"
                    @input="menuEndDate = false, formatDate(hotelEndDate, 1, 'hotelEndDate')"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" md="4">
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
                    label="Hotel Name"
                    hide-details
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
              <v-col cols="12" md="12" class="mb-4">
                <v-btn
                  class="white--text text-capitalize"
                  color="#575757"
                  elevation="6"
                  x-large
                  block
                  raised
                  rounded-lg
                  @click="checkHotelAvailability"
                >
                  Check Availability
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </div>
      <div>
        <v-row>
          <v-col cols="12" md="12">
            <div v-if="listGtaHotelDetails.length" class="results ma-1">
              <v-card
                class="mb-12"
              >
                <div v-for="(hotel, h) in listGtaHotelDetails" :key="h">
                  <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                    <v-col cols="12" md="4" class="pt-4">
                      <div v-if="hotel.Images && hotel.Images.length > 0">
                        <v-img
                          max-height="400"
                          :src="hotel.Images && hotel.Images.Image[1].Type === 'THB' ? hotel.Images.Image[1].FileName : 'https://source.unsplash.com/user/c_v_r/1900x800'"
                          max-width="400"
                          class="rounded-lg"
                        />
                      </div>
                      <div v-else-if="hotel.HotelInfo.Images">
                        <v-img
                          max-height="400"
                          :src="hotel.HotelInfo && hotel.HotelInfo.Images.Image ? hotel.HotelInfo.Images.Image : 'https://source.unsplash.com/user/c_v_r/1900x800'"
                          max-width="400"
                          class="rounded-lg"
                        />
                      </div>
                    </v-col>
                    <v-col cols="10" md="6">
                      <div class="cruise-result-trip justify-space-between">
                        <div>
                          <h6 class="text-h6 font-weight-bold">
                            {{ hotel.city_name }}
                          </h6>
                        </div>
                        <div class="black--text">
                          <p v-if="hotel.HotelInfo.Name" class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Hotel Name:</strong> {{ hotel.HotelInfo.Name }}
                          </p>
                          <p v-if="hotel.HotelInfo.Address" class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Address:</strong> {{ hotel.HotelInfo.Address }}
                          </p>
                          <p v-if="hotel.HotelInfo.HotelCategory" class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Category:</strong> {{ hotel.HotelInfo.HotelCategory._ }}
                          </p>
                          <p v-if="hotel.HotelInfo.HotelType" class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Type:</strong> {{ hotel.HotelInfo.HotelType._ }}
                          </p>
                          <p v-if="hotel.HotelOptions.HotelOption.Board" class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Board:</strong> {{ hotel.HotelOptions.HotelOption.Board._ }}
                          </p>
                          <p v-if="hotel.HotelInfo.Description" class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Description:</strong> {{ hotel.HotelInfo.Description }}
                          </p>
                          <p v-if="hotel.HotelOptions.HotelOption.Prices" class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Price:</strong> {{ hotel.HotelOptions.HotelOption.Prices.Price.TotalFixAmounts.Nett }} {{ hotel.HotelOptions.HotelOption.Prices.Price.Currency }}
                          </p>
                          <!-- <a class="" style="font-size: 15px;margin: 2px 0;" @click="showHotels(h)">Change Hotel</a> <v-icon class="mx-2" style="color: black;">
                            mdi-swap-horizontal
                          </v-icon> <a class="" style="font-size: 15px;margin: 2px 0;" @click="showRooms(h)">Select Room</a> -->
                          <v-btn
                            color="primary"
                            class="float-right justify-space-between"
                            @click="showRooms(h)"
                          >
                            Select Room
                          </v-btn>
                          <div class="cruise-result-trip justify-space-between">
                            <v-btn
                              color="primary"
                              class="float-right mr-2"
                              @click="showHotelDetailsObject(h)"
                            >
                              view
                            </v-btn>
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
              <v-card
                class="mb-12"
              >
                <div id="selectedRoomtargetDiv" />
                <div v-for="(gta, g) in selectedRoomGtaArray" :key="g">
                  <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                    <v-col cols="12" md="12" class="pt-4">
                      <div>
                        <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                          <v-col cols="12" md="12">
                            <div class="cruise-result-trip justify-space-between">
                              <div v-if="gta.Board">
                                <h6 class="text-h6 font-weight-bold">
                                  Board: {{ gta.Board._ }}
                                </h6>
                              </div>
                              <div class="black--text">
                                <p v-if="gta.AdditionalElements && gta.AdditionalElements.HotelOffers" class="" style="font-size: 15px;margin: 2px 0;">
                                  <strong>Hotel Offer:</strong> {{ gta.AdditionalElements.HotelOffers.HotelOffer.Name }}
                                </p>
                                <p class="" style="font-size: 15px;margin: 2px 0;">
                                  <strong>Hotel Rooms:</strong>
                                </p>
                                <div style="font-size: 15px;margin: 2px 0;">
                                  <span v-if="gta.HotelRooms && Array.isArray(gta.HotelRooms.HotelRoom)">
                                    <div v-for="(room, r) in gta.HotelRooms.HotelRoom" :key="r">
                                      <div>
                                        {{ room.Name }} <span v-if="room.RoomOccupancy && room.RoomOccupancy.Adults">- Adults: {{ room.RoomOccupancy.Adults }}</span> <span v-if="room.RoomOccupancy && room.RoomOccupancy.Children">- Children: {{ room.RoomOccupancy.Children }}</span>
                                      </div>
                                    </div>
                                  </span>
                                  <span v-else>
                                    <span v-if="gta.HotelRooms && gta.HotelRooms.HotelRoom">{{ gta.HotelRooms.HotelRoom.Name }}</span> <span v-if="gta.HotelRooms.HotelRoom.RoomOccupancy && gta.HotelRooms.HotelRoom.RoomOccupancy.Adults">- Adults: {{ gta.HotelRooms.HotelRoom.RoomOccupancy.Adults }}</span> <span v-if="gta.HotelRooms.HotelRoom.RoomOccupancy && gta.HotelRooms.HotelRoom.RoomOccupancy.Children">- Children: {{ gta.HotelRooms.HotelRoom.RoomOccupancy.Children }}</span>
                                  </span>
                                </div>
                                <p v-if="gta.Prices.Price" class="" style="font-size: 15px;margin: 2px 0;">
                                  <strong>Prices:</strong> {{ gta.Prices.Price.TotalFixAmounts.Nett }} {{ gta.Prices.Price.Currency }}
                                </p>
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
              <v-card
                class="mb-12"
              >
                <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                  <v-col cols="12" md="12">
                    <v-btn
                      class="white--text"
                      color="#4f3316"
                      elevation="6"
                      large
                      block
                      raised
                      :disabled="(getRatePlanCodeArray.length === 0 && getRatePlanCode === null) || confirmedSelectedRoom"
                      @click="confirmSelectedRoom"
                    >
                      <span v-if="getRatePlanCodeArray.length === 0 || getRatePlanCode === null">Confirm Selected Rooms</span>
                      <span v-else>Confirmed Successfully</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
              <v-card
                class="mb-12"
              >
                <div v-if="confirmedSelectedRoom">
                  <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                    <v-col cols="12" md="12">
                      <div class="cruise-result-trip justify-space-between">
                        <v-form ref="form" v-model="travellersFormValid">
                          <p class="body-1 font-weight-bold text-h5">
                            Holder Information
                          </p>
                          <v-card class="pa-9 mb-5 rounded-xl" elevation="6">
                            <v-row>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="name"
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
                                  v-model="surname"
                                  outlined
                                  :rules="[v => (!!v && v.length > 2) || 'Surname is required at least 3 characters', v => /^[_A-z]*((-|\s)*[_A-z])*$/.test(v) || 'Surname Must be letters only with no spaces']"
                                  label="Surname"
                                  required
                                  color="blue"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <mobile-input @update="assignPhone" />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="email"
                                  outlined
                                  :rules="emailRules"
                                  label="E-mail"
                                  required
                                  color="blue"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="age"
                                  outlined
                                  label="Age"
                                  required
                                  color="blue"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-combobox
                                  v-model="title"
                                  :items="['Mr', 'Mrs', 'Ms', 'Miss']"
                                  :search-input.sync="search"
                                  hide-selected
                                  hint="Add title and press enter to append it"
                                  label="Title"
                                  outlined
                                  :rules="requiredRule"
                                  class="pa-0 rounded-lg"
                                  height="56px"
                                  color="blue"
                                >
                                  <template #no-data>
                                    <v-list-item>
                                      <v-list-item-content>
                                        <v-list-item-title>
                                          No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                                        </v-list-item-title>
                                      </v-list-item-content>
                                    </v-list-item>
                                  </template>
                                </v-combobox>
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-autocomplete
                                  v-model="issueCountry"
                                  :rules="[() => !!issueCountry || 'This field is required']"
                                  :items="countries"
                                  item-text="name"
                                  item-value="code"
                                  placeholder="Issuing Country"
                                  name="issue-country-for-passports"
                                  required
                                  outlined
                                  hide-no-data
                                  color="blue"
                                  autocomplete="off"
                                  :menu-props="{ auto: true, maxWidth: 200, overflowY: true }"
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
                        class="white--text"
                        color="#4f3316"
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
              <v-card
                class="mb-12"
              >
                <div v-if="isBooked">
                  <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                    <v-col>
                      <v-btn
                        class="white--text"
                        color="#4f3316"
                        elevation="6"
                        large
                        block
                        raised
                        :disabled="!isBooked"
                        @click="checkoutPayment"
                      >
                        <span>Checkout Now</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </div>
            <div v-else-if="hotelAvails" class="results ma-1">
              <v-card
                class="mb-12"
              >
                <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                  <v-col cols="12" md="4" class="pt-4">
                    <v-img
                      max-height="400"
                      :src="hotelAvails.HotelInfo.Images.Image[1].Type === 'THB' ? hotelAvails.HotelInfo.Images.Image[1].FileName : 'https://source.unsplash.com/user/c_v_r/1900x800'"
                      max-width="400"
                      class="rounded-lg"
                    />
                  </v-col>
                  <v-col cols="10" md="6">
                    <div class="cruise-result-trip justify-space-between">
                      <div>
                        <h6 class="text-h6 font-weight-bold">
                          <strong>Hotel Name:</strong>{{ hotelAvails.HotelInfo.Name }}
                        </h6>
                      </div>
                      <div class="black--text">
                        <p v-if="hotelAvails.HotelInfo.Description" class="" style="font-size: 15px;margin: 2px 0;">
                          <strong>Hotel Description:</strong> {{ hotelAvails.HotelInfo.Description }}
                        </p>
                        <p v-if="hotelAvails.HotelInfo.Address" class="" style="font-size: 15px;margin: 2px 0;">
                          <strong>Address:</strong> {{ hotelAvails.HotelInfo.Address }}
                        </p>
                        <p v-if="hotelAvails.HotelInfo.HotelCategory" class="" style="font-size: 15px;margin: 2px 0;">
                          <strong>Category:</strong> {{ hotelAvails.HotelInfo.HotelCategory._ }}
                        </p>
                        <v-btn
                          color="primary"
                          class="float-right"
                          @click="showRoomsObject(hotelAvails.JPCode)"
                        >
                          Select Room
                        </v-btn>
                        <!-- <a class="" style="font-size: 15px;margin: 2px 0;" @click="showRoomsObject(hotelAvails.JPCode)">Select Room</a> -->
                        <div class="cruise-result-trip justify-space-between">
                          <v-btn
                            color="primary"
                            class="float-right mr-2"
                            @click="showHotelDetailsObject(hotelAvails.JPCode)"
                          >
                            view
                          </v-btn>
                          <!-- <v-btn
                            color="primary"
                            class="float-right"
                            @click="selectHotel(hotelAvails.JPCode, hotelAvails.HotelInfo.Name)"
                          >
                            Select Hotel
                          </v-btn> -->
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
              <v-card
                class="mb-12"
              >
                <div v-for="(gta, g) in selectedRoomGtaArray" :key="g">
                  <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                    <v-col cols="12" md="12" class="pt-4">
                      <div>
                        <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                          <v-col cols="12" md="12">
                            <div class="cruise-result-trip justify-space-between">
                              <div v-if="gta.Board">
                                <h6 class="text-h6 font-weight-bold">
                                  Board: {{ gta.Board._ }}
                                </h6>
                              </div>
                              <div class="black--text">
                                <p v-if="gta.AdditionalElements && gta.AdditionalElements.HotelOffers" class="" style="font-size: 15px;margin: 2px 0;">
                                  <strong>Hotel Offer:</strong> {{ gta.AdditionalElements.HotelOffers.HotelOffer.Name }}
                                </p>
                                <p class="" style="font-size: 15px;margin: 2px 0;">
                                  <strong>Hotel Rooms:</strong>
                                </p>
                                <div style="font-size: 15px;margin: 2px 0;">
                                  <span v-if="gta.HotelRooms && Array.isArray(gta.HotelRooms.HotelRoom)">
                                    <div v-for="(room, r) in gta.HotelRooms.HotelRoom" :key="r">
                                      <div>
                                        {{ room.Name }} <span v-if="room.RoomOccupancy && room.RoomOccupancy.Adults">- Adults: {{ room.RoomOccupancy.Adults }}</span> <span v-if="room.RoomOccupancy && room.RoomOccupancy.Children">- Children: {{ room.RoomOccupancy.Children }}</span>
                                      </div>
                                    </div>
                                  </span>
                                  <span v-else>
                                    <span v-if="gta.HotelRooms && gta.HotelRooms.HotelRoom">{{ gta.HotelRooms.HotelRoom.Name }}</span> <span v-if="gta.HotelRooms.HotelRoom.RoomOccupancy && gta.HotelRooms.HotelRoom.RoomOccupancy.Adults">- Adults: {{ gta.HotelRooms.HotelRoom.RoomOccupancy.Adults }}</span> <span v-if="gta.HotelRooms.HotelRoom.RoomOccupancy && gta.HotelRooms.HotelRoom.RoomOccupancy.Children">- Children: {{ gta.HotelRooms.HotelRoom.RoomOccupancy.Children }}</span>
                                  </span>
                                </div>
                                <p v-if="gta.Prices.Price" class="" style="font-size: 15px;margin: 2px 0;">
                                  <strong>Prices:</strong> {{ gta.Prices.Price.TotalFixAmounts.Nett }} {{ gta.Prices.Price.Currency }}
                                </p>
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
              <v-card
                class="mb-12"
              >
                <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                  <v-col cols="12" md="12">
                    <v-btn
                      class="white--text"
                      color="#4f3316"
                      elevation="6"
                      large
                      block
                      raised
                      :disabled="(getRatePlanCodeArray.length === 0 && getRatePlanCode === null) || confirmedSelectedRoom"
                      @click="confirmSelectedRoom"
                    >
                      <span v-if="getRatePlanCodeArray.length === 0 || getRatePlanCode === null">Confirm Selected Rooms</span>
                      <span v-else>Confirmed Successfully</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
              <v-card
                class="mb-12"
              >
                <div v-if="confirmedSelectedRoom">
                  <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                    <v-col cols="12" md="12">
                      <div class="cruise-result-trip justify-space-between">
                        <v-form ref="form" v-model="travellersFormValid">
                          <p class="body-1 font-weight-bold text-h5">
                            Holder Information
                          </p>
                          <v-card class="pa-9 mb-5 rounded-xl" elevation="6">
                            <v-row>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="name"
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
                                  v-model="surname"
                                  outlined
                                  :rules="[v => (!!v && v.length > 2) || 'Surname is required at least 3 characters', v => /^[_A-z]*((-|\s)*[_A-z])*$/.test(v) || 'Surname Must be letters only with no spaces']"
                                  label="Surname"
                                  required
                                  color="blue"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <mobile-input @update="assignPhone" />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="email"
                                  outlined
                                  :rules="emailRules"
                                  label="E-mail"
                                  required
                                  color="blue"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="age"
                                  outlined
                                  label="Age"
                                  required
                                  color="blue"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-combobox
                                  v-model="title"
                                  :items="['Mr', 'Mrs', 'Ms', 'Miss']"
                                  :search-input.sync="search"
                                  hide-selected
                                  hint="Add title and press enter to append it"
                                  label="Title"
                                  outlined
                                  :rules="requiredRule"
                                  class="pa-0 rounded-lg"
                                  height="56px"
                                  color="blue"
                                >
                                  <template #no-data>
                                    <v-list-item>
                                      <v-list-item-content>
                                        <v-list-item-title>
                                          No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                                        </v-list-item-title>
                                      </v-list-item-content>
                                    </v-list-item>
                                  </template>
                                </v-combobox>
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-autocomplete
                                  v-model="issueCountry"
                                  :rules="[() => !!issueCountry || 'This field is required']"
                                  :items="countries"
                                  item-text="name"
                                  item-value="code"
                                  placeholder="Issuing Country"
                                  name="issue-country-for-passports"
                                  required
                                  outlined
                                  hide-no-data
                                  color="blue"
                                  autocomplete="off"
                                  :menu-props="{ auto: true, maxWidth: 200, overflowY: true }"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="identification_document_pax"
                                  outlined
                                  label="Identification Document"
                                  required
                                  color="blue"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="address_pax"
                                  outlined
                                  label="Address"
                                  required
                                  color="blue"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="city_pax"
                                  outlined
                                  label="City"
                                  required
                                  color="blue"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="country_pax"
                                  outlined
                                  label="Country"
                                  required
                                  color="blue"
                                  class="rounded-lg"
                                />
                              </v-col>
                              <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="postal_code_pax"
                                  outlined
                                  :rules="[v => (v.length <= 12) || 'Maximum Postal Code is 12 digits']"
                                  label="Postal Code"
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
                    <v-col cols="12" md="12">
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
                    </v-col>
                    <v-col cols="12" md="12">
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
                                    />
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-form>
                          </div>
                        </v-col>
                      </div>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-btn
                        class="white--text"
                        color="#4f3316"
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
              <v-card
                class="mb-12"
              >
                <div v-if="isBooked">
                  <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                    <v-col>
                      <v-btn
                        class="white--text"
                        color="#4f3316"
                        elevation="6"
                        large
                        block
                        raised
                        :disabled="!isBooked"
                        @click="checkoutPayment"
                      >
                        <span>Checkout Now</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>
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
                  <div v-if="gtaHotelDetails.Images">
                    <v-img
                      max-height="400"
                      :src="gtaHotelDetails.Images && gtaHotelDetails.Images.Image[0] ? gtaHotelDetails.Images.Image[0].FileName : 'https://source.unsplash.com/user/c_v_r/1900x800'"
                      max-width="400"
                      class="rounded-lg"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="8">
                  <div class="cruise-result-trip justify-space-between">
                    <div>
                      <h6 class="text-h6 font-weight-bold">
                        {{ gtaHotelDetails.HotelName }}
                      </h6>
                    </div>
                    <div v-if="gtaHotelDetails.Images && gtaHotelDetails.Images.Image.length > 0">
                      <v-row>
                        <v-col cols="12" md="7">
                          <v-carousel hide-delimiters height="200">
                            <v-carousel-item
                              v-for="(image,i) in gtaHotelDetails.Images.Image"
                              :key="i"
                              :src="image.FileName"
                            />
                          </v-carousel>
                        </v-col>
                      </v-row>
                    </div>
                    <div class="black--text">
                      <p v-if="gtaHotelDetails.Address.Address" class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Address:</strong> {{ gtaHotelDetails.Address.Address }}
                      </p>
                      <p v-if="gtaHotelDetails.Address && gtaHotelDetails.Address.PostalCode" class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Postal Code:</strong> {{ gtaHotelDetails.Address.PostalCode }}
                      </p>
                      <p v-if="gtaHotelDetails.HotelCategory" class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Category:</strong> {{ gtaHotelDetails.HotelCategory._ }}
                      </p>
                      <p v-if="gtaHotelDetails.HotelType" class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Type:</strong> {{ gtaHotelDetails.HotelType._ }}
                      </p>
                      <!-- <p class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Hotel Chain:</strong> {{ gtaHotelDetails.HotelChain.Name }}
                      </p> -->
                      <p class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Descriptions:</strong>
                        <span v-if="Array.isArray(gtaHotelDetails.Descriptions.Description)">
                          <span v-for="(description, d) in gtaHotelDetails.Descriptions.Description" :key="d">
                            <span v-if="description.Type === 'LNG'">
                              <span class="" style="font-size: 15px;margin: 2px 0;">{{ description._ }}</span>
                            </span>
                          </span>
                        </span>
                        <span v-else>
                          {{ gtaHotelDetails.Descriptions.Description._ }}
                        </span>
                      </p>
                      <div v-if="gtaHotelDetails.Features" class="trips-cityname" style="margin: 10px 0;">
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
                      <!-- <p class="" style="font-size: 15px;margin: 2px 0;" v-if="gtaHotelAvailDetails.HotelOptions && gtaHotelAvailDetails.HotelOptions.HotelOption.Prices.Price">
                        <strong>Price:</strong> {{ gtaHotelAvailDetails.HotelOptions.HotelOption.Prices.Price.TotalFixAmounts.Nett }}  {{ gtaHotelAvailDetails.HotelOptions.HotelOption.Prices.Price.Currency }}
                      </p> -->
                      <p v-if="gtaHotelAvailDetails.HotelOptions.HotelOption.CancellationPolicy" class="" style="font-size: 15px;margin: 2px 0;">
                        <strong>Cancellation Policy:</strong> {{ gtaHotelAvailDetails.HotelOptions.HotelOption.CancellationPolicy.Description }}
                      </p>
                    </div>
                  </div>
                </v-col>
              </v-row>
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
            <div v-if="hotelAvails !== null">
              <div v-if="Array.isArray(hotelAvails.HotelOptions.HotelOption)">
                <div v-for="(hotelOption, hO) in hotelAvails.HotelOptions.HotelOption" :key="hO">
                  <v-card v-if="hotelOption" class="my-4">
                    <v-card-title class="white--text" style="background-color: #4f3316;">
                      Board: <span v-if="hotelOption.Board && hotelOption.Board._">{{ hotelOption.Board._ }}, </span><span v-if="hotelOption.HotelRooms && hotelOption.HotelRooms.HotelRoom">{{ hotelOption.HotelRooms.HotelRoom.Name }}</span>
                    </v-card-title>
                    <v-card-text class="pt-4">
                      <v-row class="" style="padding: 5px;margin: 10px 0">
                        <v-col cols="12" md="10">
                          <div class="cruise-result-trip justify-space-between">
                            <div class="black--text">
                              <p v-if="hotelOption.HotelRooms && hotelOption.HotelRooms.HotelRoom" class="" style="font-size: 15px;margin: 2px 0;">
                                <span v-if="Array.isArray(hotelOption.HotelRooms.HotelRoom)">
                                  <div v-for="(room, r) in hotelOption.HotelRooms.HotelRoom" :key="r">
                                    <span v-if="room.Name"><strong>Room Name:</strong> {{ room.Name }} <br></span>
                                    <span v-if="room.RoomCategory._"><strong>Room Category:</strong> {{ room.RoomCategory._ }} <br></span>
                                    <span v-if="room.RoomOccupancy && room.RoomOccupancy.Adults"><strong>Number of Adults:</strong> {{ room.RoomOccupancy.Adults }} <br></span>
                                    <span v-if="room.RoomOccupancy && room.RoomOccupancy.Children"><strong>Number of Children:</strong> {{ room.RoomOccupancy.Children }} <br></span>                                    <hr>
                                  </div>
                                </span>
                                <span v-else>
                                  <span v-if="hotelOption.HotelRooms.HotelRoom.Name"><strong>Room Name:</strong> {{ hotelOption.HotelRooms.HotelRoom.Name }} <br></span>
                                  <span v-if="hotelOption.HotelRooms.HotelRoom.RoomCategory._"><strong>Room Category:</strong> {{ hotelOption.HotelRooms.HotelRoom.RoomCategory._ }} <br></span>
                                  <span v-if="hotelOption.HotelRooms.HotelRoom.RoomOccupancy && hotelOption.HotelRooms.HotelRoom.RoomOccupancy.Adults"><strong>Number of Adults:</strong> {{ hotelOption.HotelRooms.HotelRoom.RoomOccupancy.Adults }} <br></span>
                                  <span v-if="hotelOption.HotelRooms.HotelRoom.RoomOccupancy && hotelOption.HotelRooms.HotelRoom.RoomOccupancy.Children"><strong>Number of Children:</strong> {{ hotelOption.HotelRooms.HotelRoom.RoomOccupancy.Children }} <br></span>
                                </span>
                              </p>
                              <!-- <p class="" style="font-size: 15px;margin: 2px 0;" v-if="hotelOption.HotelRooms && hotelOption.HotelRooms.HotelRoom">
                                <strong>Number of Adults:</strong> {{ hotelOption.HotelRooms.HotelRoom.RoomOccupancy.Adults }} <br>
                                <strong>Number of Children:</strong> {{ hotelOption.HotelRooms.HotelRoom.RoomOccupancy.Children }} <br>
                              </p> -->
                              <p v-if="hotelOption.AdditionalElements && hotelOption.AdditionalElements.HotelOffers" class="" style="font-size: 18px;margin: 2px 0;">
                                <strong>Hotel Offer:</strong> {{ hotelOption.AdditionalElements.HotelOffers.HotelOffer.Name }} <br>
                                <strong>Hotel Offer Description:</strong> {{ hotelOption.AdditionalElements.HotelOffers.HotelOffer.Description }} <br>
                              </p>
                              <v-divider class="mb-4" />
                              <p v-if="hotelOption.CancellationPolicy" class="" style="font-size: 18px;margin: 2px 0;">
                                <strong>Cancellation Policy</strong>
                                <strong>Description:</strong> {{ hotelOption.CancellationPolicy.Description }} <br>
                                <strong>First Day Cost Cancellation (Hour):</strong> {{ hotelOption.CancellationPolicy.FirstDayCostCancellation.Hour }} <br>
                                <strong>First Day Cost Cancellation (Date):</strong> {{ hotelOption.CancellationPolicy.FirstDayCostCancellation._ }} <br>
                              </p>
                              <v-divider class="mb-4" />
                              <p v-if="hotelOption.Prices && hotelOption.Prices.Price" class="" style="font-size: 15px;margin: 2px 0;">
                                <strong>Prices:</strong> {{ hotelOption.Prices.Price.TotalFixAmounts.Nett }} {{ hotelOption.Prices.Price.Currency }}
                              </p>
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-btn
                            class="rounded"
                            large
                            tile
                            elevation="0"
                            dark
                            color="#4f3316"
                            block
                            @click="selectRoomHotelGta(hO)"
                          >
                            Select
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
              <div v-else>
                <v-card v-if="hotelAvails.HotelOptions.HotelOption" class="my-4">
                  <v-card-title class="white--text" style="background-color: #4f3316;">
                    Board: <span v-if="hotelAvails.HotelOptions.HotelOption.Board && hotelAvails.HotelOptions.HotelOption.Board._">{{ hotelAvails.HotelOptions.HotelOption.Board._ }}, </span><span v-if="hotelAvails.HotelOptions.HotelOption.HotelRooms && hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom">{{ hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.Name }}</span>
                  </v-card-title>
                  <v-card-text class="pt-4">
                    <v-row class="" style="padding: 5px;margin: 10px 0">
                      <v-col cols="12" md="10">
                        <div class="cruise-result-trip justify-space-between">
                          <div class="black--text">
                            <p v-if="hotelAvails.HotelOptions.HotelOption.HotelRooms && hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom" class="" style="font-size: 15px;margin: 2px 0;">
                              <span v-if="Array.isArray(hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom)">
                                <div v-for="(room, r) in hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom" :key="r">
                                  <span v-if="room.Name"><strong>Room Name:</strong> {{ room.Name }} <br></span>
                                  <span v-if="room.RoomCategory._"><strong>Room Category:</strong> {{ room.RoomCategory._ }} <br></span>
                                  <span v-if="room.RoomOccupancy && room.RoomOccupancy.Adults"><strong>Number of Adults:</strong> {{ room.RoomOccupancy.Adults }} <br></span>
                                  <span v-if="room.RoomOccupancy && room.RoomOccupancy.Children"><strong>Number of Children:</strong> {{ room.RoomOccupancy.Children }} <br></span>
                                  <hr>
                                </div>
                              </span>
                              <span v-else>
                                <span v-if="hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.Name"><strong>Room Name:</strong> {{ hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.Name }} <br></span>
                                <span v-if="hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.RoomCategory._"><strong>Room Category:</strong> {{ hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.RoomCategory._ }} <br></span>
                                <span v-if="hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.RoomOccupancy && hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.RoomOccupancy.Adults"><strong>Number of Adults:</strong> {{ hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.RoomOccupancy.Adults }} <br></span>
                                <span v-if="hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.RoomOccupancy && hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.RoomOccupancy.Children"><strong>Number of Children:</strong> {{ hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.RoomOccupancy.Children }} <br></span>
                              </span>
                            </p>
                            <p v-if="hotelAvails.HotelOptions.HotelOption.AdditionalElements && hotelAvails.HotelOptions.HotelOption.AdditionalElements.HotelOffers" class="" style="font-size: 18px;margin: 2px 0;">
                              <strong>Hotel Offer:</strong> {{ hotelAvails.HotelOptions.HotelOption.AdditionalElements.HotelOffers.HotelOffer.Name }} <br>
                              <strong>Hotel Offer Description:</strong> {{ hotelAvails.HotelOptions.HotelOption.AdditionalElements.HotelOffers.HotelOffer.Description }} <br>
                            </p>
                            <v-divider class="mb-4" />
                            <p v-if="hotelAvails.HotelOptions.HotelOption.CancellationPolicy" class="" style="font-size: 18px;margin: 2px 0;">
                              <strong>Cancellation Policy</strong>
                              <strong>Description:</strong> {{ hotelAvails.HotelOptions.HotelOption.CancellationPolicy.Description }} <br>
                              <strong>First Day Cost Cancellation (Hour):</strong> {{ hotelAvails.HotelOptions.HotelOption.CancellationPolicy.FirstDayCostCancellation.Hour }} <br>
                              <strong>First Day Cost Cancellation (Date):</strong> {{ hotelAvails.HotelOptions.HotelOption.CancellationPolicy.FirstDayCostCancellation._ }} <br>
                            </p>
                            <v-divider class="mb-4" />
                            <p v-if="hotelAvails.HotelOptions.HotelOption.Prices && hotelAvails.HotelOptions.HotelOption.Prices.Price" class="" style="font-size: 15px;margin: 2px 0;">
                              <strong>Prices:</strong> {{ hotelAvails.HotelOptions.HotelOption.Prices.Price.TotalFixAmounts.Nett }} {{ hotelAvails.HotelOptions.HotelOption.Prices.Price.Currency }}
                            </p>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-btn
                          class="rounded"
                          large
                          tile
                          elevation="0"
                          dark
                          color="#4f3316"
                          block
                          @click="selectRoomHotelGta(hO)"
                        >
                          Select
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
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
      selectedZone: null,
      perZoneHotels: []
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
    query (newQuery) {
      this.handleInput()
    }
  },
  mounted () {
    this.gtaCountriesCopy = [...this.gtaCountries]
  },
  async created () {
    await this.getMetaData()
    await this.getGtaCountries()
    await this.getGtaCities()
    await this.getGtaHotelCategories()
    await this.getGtaHotelTypeCategories()
    await this.getGtaCategories()
    await this.getGtaBoards()
  },
  methods: {

    handleInput: _.debounce(function () {
      if (this.query.length >= 3) {
        this.searchZones()
        this.menu = true
      } else {
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
      this.selectedZone = zone
      this.query = zone.name
      this.menu = false
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
    // async getGtaHotels (index) {
    //   // console.log(index)
    //   const cityId = this.selectedCity
    //   try {
    //     const promise = hotelsServices.getGtaHotels(cityId)
    //     const response = await promise
    //     const results = response.data
    //     if (results.status === 200) {
    //       // this.$set(this.gtaHotels, index, results.data)
    //       this.gtaHotels = results.data
    //     }
    //   } catch (error) {
    //     this.loaded = false
    //   }
    // },
    // async getGtaHotelsPerZone (zoneId) {
    //   try {
    //     const response = await hotelsServices.getGtaHotelsPerZone(zoneId) // Use zoneId instead of cityId
    //     const results = response.data
    //     if (results.status === 200) {
    //       this.gtaHotels = results.data // Store the retrieved hotels
    //     }
    //   } catch (error) {
    //     // eslint-disable-next-line no-console
    //     console.error('Error fetching hotels:', error)
    //   }
    // },

    // async searchHotelsByZone () {
    //   if (this.selectedZone) {
    //     try {
    //       // Make an API request to search hotels by zone
    //       const response = await this.clientAPI('https://api.tanefer.com/api/v2').get('/api/hotels/search-by-zone', {
    //         params: { jpd_code: this.selectedZone.jpd_code }
    //       })

    //       // Assign the returned hotels to the data property
    //       this.hotels = response.data.perZoneHotels
    //     } catch (error) {
    //     // eslint-disable-next-line no-console
    //       console.error('Error fetching hotels:', error)
    //     }
    //   } else {
    //     // eslint-disable-next-line no-console
    //     console.error('No zone selected')
    //   }
    // },
    async showHotelDetailsObject (hotelIndex) {
      const getHotelGtaDetails = this.listGtaHotelDetails[hotelIndex]
      try {
        this.isLoading = true
        const promise = hotelsServices.getGtaHotelDetails(getHotelGtaDetails.Code)
        const response = await promise
        const results = response.data
        if (results.ContentRS) {
          this.gtaHotelDetails = results.ContentRS.Contents.HotelContent
          this.gtaHotelAvailDetails = getHotelGtaDetails
          this.showHotelGtaDetails = true
          this.isLoading = false
        }
      } catch (error) {
        this.loaded = false
        this.isLoading = false
      }
    },
    // async checkHotelAvailability () {
    //   if (this.travellers === 0) {
    //     this.snackbar = true
    //     this.color = 'error'
    //     this.text = 'Please select Number of Adult'
    //     this.loaded = false
    //   } else if (this.hotelStartDate === null || this.hotelEndDate === null) {
    //     this.snackbar = true
    //     this.color = 'error'
    //     this.text = 'Please select Start Date and End Date'
    //     this.loaded = false
    //   } else {
    //     this.isLoading = true
    //     this.hotelAvailsArray = []
    //     this.hotelAvails = null
    //     this.selectedRoomGtaArray = []
    //     this.getRatePlanCodeArray = []
    //     this.selectedHotelCodeArray = []
    //     this.selectedHotelJPCodeArray = []
    //     this.selectedHotelJPDCodeArray = []
    //     this.selectedRoomGta = null
    //     this.getRatePlanCode = null
    //     this.hotelPrices = null
    //     this.selectedHotelCode = null
    //     this.selectedHotelJPCode = null
    //     this.selectedHotelJPDCode = null
    //     this.getbookingRuleArray = []
    //     this.confirmedSelectedRoom = false

    //     const formData = new FormData()
    //     formData.append('start_date', this.hotelStartDate)
    //     formData.append('end_date', this.hotelEndDate)
    //     formData.append('board', this.selectedBoard)
    //     formData.append('hotel_name', this.selectedHotelName)
    //     formData.append('hotel_category', this.selectedHotelCategory)
    //     formData.append('hotel_type_category', this.selectedHotelTypeCategory)
    //     const hotels = this.gtaHotels || []
    //     for (let i = 0; i < hotels.length; i++) {
    //       formData.append('hotels[' + i + ']', hotels[i].Jpd_code)
    //     }
    //     formData.append('adults', this.travellers)
    //     formData.append('children', this.children)
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
    //             formData.append('rooms[' + r + '][ages][' + rx + ']', this.rooms[r].ageSelects[rx])
    //           }
    //         }
    //         // formData.append('rooms[' + r + '][category]', this.rooms[r].roomCategory.Type)
    //         formData.append('rooms[' + r + '][category]', this.selectedCategory)
    //       }
    //     }
    //     // try {
    //     //   const promise = hotelsServices.checkHotelAvailabilities(formData)
    //     //   const response = await promise
    //     //   // console.log(response)
    //     //   const results = response.data.AvailabilityRS
    //     //   if (results.Errors !== undefined) {
    //     //     this.snackbar = true
    //     //     this.color = 'error'
    //     //     this.text = results.Errors.Error.Text
    //     //     this.loaded = false
    //     //     this.checkResponseCode = false
    //     //     this.isLoading = false
    //     //   } else {
    //     //     this.isAvailable = true
    //     //     const hotelResults = results.Results.HotelResult
    //     //     // console.log(hotelResults)
    //     //     if (hotelResults.length > 1) {
    //     //       for (let index = 0; index < hotelResults.length; index++) {
    //     //         this.hotelAvailsArray.push(hotelResults[index])
    //     //         // this.listGtaHotelDetails.push(hotelResults[index])
    //     //         this.selectedHotelStartDate = this.hotelStartDate
    //     //         this.selectedHotelEndDate = this.hotelEndDate
    //     //       }
    //     //       // console.log('hotelResults')
    //     //       // console.log(hotelResults)
    //     //       this.listGtaHotelDetails = hotelResults
    //     //       this.hotelAvails = hotelResults[0]
    //     //     } else {
    //     //       this.hotelAvails = hotelResults
    //     //     }
    //     //     this.checkResponseCode = true
    //     //     this.isLoading = false
    //     //   }
    //     // } catch (error) {
    //     //   this.snackbar = true
    //     //   this.color = 'error'
    //     //   this.text = 'Something went wrong'
    //     //   this.loaded = false
    //     //   this.checkResponseCode = false
    //     //   this.isLoading = false
    //     // }
    //     try {
    //       // Initialize page and page size
    //       let page = 1
    //       const pageSize = 500 // Adjust based on your needs
    //       let totalPages = 1

    //       do {
    //         const promise = hotelsServices.checkHotelAvailabilities(formData, page, pageSize) // Pass page and pageSize
    //         const response = await promise

    //         const results = response.data.AvailabilityRS
    //         if (results.Errors !== undefined) {
    //           this.snackbar = true
    //           this.color = 'error'
    //           this.text = results.Errors.Error.Text
    //           this.loaded = false
    //           this.checkResponseCode = false
    //           this.isLoading = false
    //           break
    //         } else {
    //           this.isAvailable = true
    //           const hotelResults = results.Results.HotelResult

    //           if (hotelResults.length > 1) {
    //             for (let index = 0; index < hotelResults.length; index++) {
    //               this.hotelAvailsArray.push(hotelResults[index])
    //             }
    //             this.selectedHotelStartDate = this.hotelStartDate
    //             this.selectedHotelEndDate = this.hotelEndDate
    //             this.listGtaHotelDetails = [...this.listGtaHotelDetails, ...hotelResults] // Append results to the array
    //           } else {
    //             this.hotelAvails = hotelResults
    //           }

    //           // Assuming the backend response has a total page count
    //           totalPages = results.Pagination?.total_pages || 1
    //         }

    //         // Increment page number to fetch the next set of results
    //         page++

    //         // Stop loading if this was the last page
    //         if (page > totalPages) {
    //           this.checkResponseCode = true
    //           this.isLoading = false
    //         }
    //       } while (page <= totalPages)
    //     } catch (error) {
    //       // eslint-disable-next-line no-console
    //       console.error(error)
    //       this.snackbar = true
    //       this.color = 'error'
    //       this.text = 'An error occurred while fetching availability.'
    //       this.loaded = false
    //       this.checkResponseCode = false
    //       this.isLoading = false
    //     }
    //   }
    // },
    async checkHotelAvailability () {
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
      for (let i = 0; i < hotels.length; i++) {
        formData.append(`hotels[${i}]`, hotels[i].Jpd_code)
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

      try {
        let page = 1
        const pageSize = 500
        let totalPages = 1

        do {
          const promise = hotelsServices.checkHotelAvailabilities(formData, page, pageSize)
          const response = await promise

          // Log the full response to ensure structure is as expected
          // eslint-disable-next-line no-console
          console.log('Full Response:', response.data)

          // Access AvailabilityRS correctly
          const availabilityRS = response?.data?.data?.AvailabilityRS

          // Check if availabilityRS exists and handle errors
          if (!availabilityRS || availabilityRS?.Errors !== undefined) {
          // eslint-disable-next-line no-console
            console.log('Error in availabilityRS:', availabilityRS?.Errors)
            this.snackbar = true
            this.color = 'error'
            this.text = availabilityRS?.Errors?.Error?.Text || 'An error occurred while fetching availability.'
            this.loaded = false
            this.checkResponseCode = false
            this.isLoading = false
            break
          } else {
            this.isAvailable = true

            // Access Results and HotelResult safely
            const results = availabilityRS?.Results?.HotelResult || []

            if (results.length > 0) {
              this.hotelAvailsArray.push(...results) // Append results safely
              this.listGtaHotelDetails = [...this.listGtaHotelDetails, ...results] // Avoid duplicates
            }

            totalPages = availabilityRS?.pagination?.total_pages || 1 // Fix totalPages access
          }

          page++ // Increment the page

          if (page > totalPages) {
            this.checkResponseCode = true
            this.isLoading = false
          }
        } while (page <= totalPages)
      } catch (error) {
        // eslint-disable-next-line no-console
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
    selectRoomHotelGta (AvailIndex) {
      console.log('AvailIndex = ' + AvailIndex)
      // if (this.hotelAvailsArray.length > 0) {
      //   this.selectedRoomGtaArray.push(this.hotelAvails.HotelOptions.HotelOption)
      //   this.getRatePlanCodeArray.push(this.hotelAvails.HotelOptions.HotelOption.RatePlanCode)
      //   this.hotelPrices += this.hotelAvails.HotelOptions.HotelOption.Prices ? this.hotelAvails.HotelOptions.HotelOption.Prices.Price.TotalFixAmounts.Nett : 0
      //   this.selectedHotelCodeArray.push(this.hotelAvails.Code)
      //   this.selectedHotelJPCodeArray.push(this.hotelAvails.JPCode)
      //   this.selectedHotelJPDCodeArray.push(this.hotelAvails.JPDCode)
      // } else {
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
      // const targetElement = this.$refs.selectedRoomtargetDiv
      // console.log(targetElement)
      // if (targetElement) {
      //   targetElement.scrollIntoView({ behavior: 'smooth' })
      // }
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
            // const results = response.data.BookingRS
            const resultFormData = response.data.formDataId
            this.finalBookHotelFormData = resultFormData
            this.finalBookHotelsFormData[x] = resultFormData
            this.isBooked = true
            this.isLoading = false
            // if (results.Errors !== undefined) {
            //   this.snackbar = true
            //   this.color = 'error'
            //   this.text = results.Errors.Error.Text
            //   this.loaded = false
            //   this.checkResponseCode = false
            //   this.isBooked = true
            //   this.isLoading = false
            // } else {
            //   this.getBookingCodeArray.push(results)
            //   this.isBooked = true
            //   this.isLoading = false
            // }
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
          // const results = response.data.BookingRS
          const resultFormData = response.data.formDataId
          this.finalBookHotelFormData = resultFormData
          this.isBooked = true
          this.isLoading = false
          // if (results.Errors !== undefined) {
          //   this.snackbar = true
          //   this.color = 'error'
          //   this.text = results.Errors.Error.Text
          //   this.loaded = false
          //   this.checkResponseCode = false
          //   this.isBooked = true
          //   this.isLoading = false
          // } else {
          //   this.getBookingCode = results
          //   this.finalBookHotelFormData = resultFormData
          //   this.isBooked = true
          //   this.isLoading = false
          // }
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
      // Implement this method to provide error messages if needed
      // For example, you can check if the age selected for a child is valid
      // and return an array of error messages
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
</style>
