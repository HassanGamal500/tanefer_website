<template>
  <div>
    <v-img
      :src="tripsCity.cityImage ? tripsCity.cityImage : require(`~/assets/images/${getCityImage(tripsCity.CityName)}`)"
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
          <h1 class="text-h1 white--text font-weight-bold my-12 set-line-height-responsive" style="line-height: 12rem;">
            <!-- {{ tripsCity.CityName }} Hotels -->
            Hotels
          </h1>
        </v-col>
      </v-row>
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
      <div style="" class="px-0 my-5">
        <div>
          <v-card class="px-7 pt-7 pb-1" style="border-radius: 15px;">
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  ref="selectedCity"
                  :items="cities"
                  label="All Cities"
                  outlined
                  clearable
                  item-text="CityName"
                  item-value="CityID"
                  prepend-inner-icon="mdi-map-marker"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="selectedZone"
                  :items="zones"
                  label="All Zones"
                  outlined
                  clearable
                  item-text="zoneName"
                  item-value="id"
                  hide-details
                  prepend-inner-icon="mdi-cash-multiple"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="selectedCategory"
                  :items="catgories"
                  label="All Categories"
                  outlined
                  clearable
                  item-text="zoneName"
                  item-value="id"
                  hide-details
                  prepend-inner-icon="mdi-cash-multiple"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="selectedBoardType"
                  :items="boards"
                  label="All Boards"
                  outlined
                  clearable
                  item-text="BoardName"
                  item-value="id"
                  hide-details
                  prepend-inner-icon="mdi-cash-multiple"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-menu
                  v-model="menuStartDate"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-model="hotelStartDateText"
                      label="Start Date"
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
                    @input="menuStartDate = false, formatDate(hotelStartDate, 1, 'hotelStartDate')"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" md="4">
                <v-menu
                  v-model="menuEndDate"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-model="hotelEndDateText"
                      label="End Date"
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
                    @input="menuEndDate = false, formatDate(hotelEndDate, 1, 'hotelEndDate')"
                  />
                </v-menu>
              </v-col>
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
                  Check Available
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </div>
      <div v-if="!$fetchState.pending && adventures.length">
        <v-row>
          <v-col cols="12" md="8">
            <div class="results ma-1">
              <v-card
                class="mb-12"
              >
                <div v-for="(hotel, h) in listGtaHotelDetails" :key="h">
                  <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                    <v-col cols="12" md="4" class="pt-4">
                      <v-img
                        max-height="400"
                        :src="hotel.Images.Image[1].Type === 'THB' ? hotel.Images.Image[1].FileName : 'https://source.unsplash.com/user/c_v_r/1900x800'"
                        max-width="400"
                        class="rounded-lg"
                      />
                    </v-col>
                    <v-col cols="10" md="6">
                      <div class="cruise-result-trip justify-space-between">
                        <div>
                          <h6 class="text-h6 font-weight-bold">
                            {{ hotel.city_name }}
                          </h6>
                        </div>
                        <div class="black--text">
                          <p class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Hotel Name:</strong> {{ hotel.HotelName }}
                          </p>
                          <p class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Address:</strong> {{ hotel.Address.Address }}
                          </p>
                          <p class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Category:</strong> {{ hotel.HotelCategory._ }}
                          </p>
                          <a class="" style="font-size: 15px;margin: 2px 0;" @click="showHotels(h)">Change Hotel</a> <v-icon class="mx-2" style="color: black;">
                            mdi-swap-horizontal
                          </v-icon> <a class="" style="font-size: 15px;margin: 2px 0;" @click="showRooms(h)">Select Room</a>
                          <div class="cruise-result-trip justify-space-between pt-4">
                            <template>
                              <div class="text-center">
                                <div v-if="isAvailable">
                                  <v-chip
                                    class="float-left ma-2"
                                    color="green"
                                    text-color="white"
                                  >
                                    Available
                                  </v-chip>
                                </div>
                                <div v-else>
                                  <v-chip
                                    class="float-left ma-2"
                                    color="red"
                                    text-color="white"
                                  >
                                    Not Available
                                  </v-chip>
                                </div>
                              </div>
                            </template>
                            <v-btn
                              color="primary"
                              class="float-right"
                              @click="showHotelDetails(h)"
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
                <div v-for="(gta, g) in selectedRoomGtaArray" :key="g">
                  <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                    <v-col cols="12" md="12" class="pt-4">
                      <div>
                        <v-row class="" style="border: 3px solid #4F3316;padding: 5px;margin: 10px 0;border-radius: 10px;">
                          <v-col cols="12" md="12">
                            <div class="cruise-result-trip justify-space-between">
                              <div>
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
                                  <span v-if="Array.isArray(gta.HotelRooms.HotelRoom)">
                                    <div v-for="(room, r) in gta.HotelRooms.HotelRoom" :key="r">
                                      <div>
                                        {{ room.Name }} - Adults: {{ room.RoomOccupancy.Adults }} - Children: {{ room.RoomOccupancy.Children }}
                                      </div>
                                    </div>
                                  </span>
                                  <span v-else>
                                    {{ gta.HotelRooms.HotelRoom.Name }} - Adults: {{ gta.HotelRooms.HotelRoom.RoomOccupancy.Adults }} - Children: {{ gta.HotelRooms.HotelRoom.RoomOccupancy.Children }}
                                  </span>
                                </div>
                                <p class="" style="font-size: 15px;margin: 2px 0;">
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
                      v-if="e1 === 2"
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
                        v-if="e1 === 2"
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
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div style="position: sticky;top: 1rem;margin-bottom: 100px;z-index: 2;">
              <v-card class="" style="border-radius: 15px;">
                <v-card-text>
                  <h4 class="text-h4 black--text" color="black">
                    Number of guests
                  </h4>
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
                              />
                            </v-col>
                          </v-row>
                        </div>
                        <v-divider class="my-2" />
                        <p class="font-weight-bold">
                          Select Category
                          <v-select
                            v-model="room.roomCategory"
                            :items="roomCategoriesWithAll"
                            item-text="_"
                            item-value="Type"
                            required
                            label="Select Category"
                            persistent-hint
                            return-object
                            single-line
                            dense
                            outlined
                          />
                        </p>
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
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>
      <h4 v-else-if="!$fetchState.pending && !adventures.length" class="my-5 text-center">
        No published hotels available now!
      </h4>
      <div v-else>
        <v-img max-width="200" class="blink-2 mx-auto" src="~/assets/images/tanfer.png" />
      </div>
      <v-dialog v-model="showCheckout" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
        <v-card>
          <v-card-title class="white--text" style="background-color: #4f3316;">
            Adventure Summary
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
              Adventures
              <v-row class="mt-4">
                <v-col v-for="(item, index) in activitiesList" :key="index" cols="12" md="12">
                  <v-card color="#F5F5F5" class="rounded-xl">
                    <v-card-title class="text-h5 black--text font-weight-bold">
                      <v-icon class="black--text" x-large>
                        mdi-circle-small
                      </v-icon>
                      {{ item.activityTitle }}
                      <v-row
                        align="center"
                        justify="end"
                        class="mr-1"
                      >
                        <a
                          class="float-right"
                          style="font-size: small;color: black;"
                          :loading="loadingDeleteItem"
                          @click="removeItemCart(item.activity_id)"
                        >
                          <v-icon class="mx-2" style="color: red;">
                            mdi-delete
                          </v-icon>
                          Delete
                        </a>
                      </v-row>
                    </v-card-title>

                    <v-spacer />
                    <v-card-subtitle>
                      <div>
                        <p>
                          <v-icon>mdi-account</v-icon>
                          Adults
                          <span class="float-right">${{ item.totalAdultPrice }}</span>
                        </p>
                      </div>
                      <div>
                        <p>
                          <v-icon>mdi-account</v-icon>
                          Children
                          <span class="float-right">${{ item.totalChildrenPrice }}</span>
                        </p>
                      </div>
                      <v-divider class="my-3" />
                      <div>
                        <p>
                          Sub total
                          <span class="float-right">$ {{ item.subTotalPrice }}</span>
                        </p>
                      </div>
                    </v-card-subtitle>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-card-actions class="dialog-cart-footer">
            <v-row align="center" justify="center" class="px-5">
              <v-col cols="12" md="6">
                <div>
                  <h5 class="text-h5">
                    Grand Total ({{ selectedAdventures.length }}) Adventures
                  </h5>
                </div>
                <div>
                  <h5 class="text-h5">
                    $ {{ totalPrice }}
                  </h5>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  class="rounded"
                  x-large
                  tile
                  elevation="0"
                  dark
                  color="#4f3316"
                  block
                  :disabled="!openProceed"
                  @click="bookAdventures"
                >
                  Proceed
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
import { mapState } from 'vuex'
import adventureServices from '~/services/activitiesServies'

export default {
  ssr: false,
  data () {
    return {
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
      categories: [
        'sightseeing',
        'camping'
      ],
      selectedCategory: null,
      durations: [],
      selectedDuration: null,
      selectedSearchText: null,
      ageSelect: [],
      showAgesSelects: false,
      selectedDates: [],
      prices: [],
      selectedPrice: null,
      isValidateSelected: 'disableSelect',
      durationTypeList: ['hour', 'day', 'week'],
      selectedDurationType: null,
      loadingDeleteItem: false,
      selectedStatusFalse: false,
      openProceed: false,
      metaData: {
        page_name: null,
        seo_title: null,
        seo_description: null,
        featured_image: null,
        slug: null
      },
      room_count: 1,
      rooms: [
        { travelers: 0, children: 0, ageSelects: [], roomCategory: { _: 'All', Type: 'all' } }
      ]
    }
  },
  async fetch () {
    await this.getDurations()
    await this.getPrices()
  },
  head () {
    return {
      // title: 'Adventures in ' + this.$route.params.city,
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
    ...mapState(['tripsCity', 'cities']),
    isAgesValid () {
      if (!this.showAgesSelects) {
        return true // Skip validation if age selects are hidden
      }
      return this.ageSelects.every(ageSelect => ageSelect.age !== null)
    }
  },
  watch: {
    solo (val) {
      if (val) { this.children = 0 }
    },
    travellers (val) {
      this.solo = false
    }
  },
  async created () {
    await this.getMetaData()
    await this.getAdventures()
  },
  methods: {
    handleError (text, color) {
      this.snackbar = true
      this.color = color
      this.text = text
    },
    addSelectedAdventure (adventure) {
      this.selectedAdventures.push(adventure)
      if (this.$route.name === 'cruisesResults') { this.checkoutTotalPrice() }
    },
    removeSelectedAdventure (id) {
      this.selectedAdventures.splice(this.selectedAdventures.findIndex(a => a.activity_id === id), 1)
    },
    async checkoutTotalPrice () {
      this.totalPrice = 0
      if (this.selectedAdventures.length) {
        if (this.children > 0 && !this.isAgesValid) {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Children Ages is Required'
          this.loaded = false
          this.showCheckout = false
        } else {
          const body = {
            adults: this.travellers,
            children: this.children,
            solo: false,
            singleSupplement: false,
            activities: []
          }
          this.selectedAdventures.forEach((item) => {
            body.activities.push({
              activity_id: item.activity_id,
              activity_date: item.date,
              availability_id: item.availabilityId
            })
          })
          try {
            const promise = adventureServices.calculateAdventureTotalPrices(body)
            const response = await promise
            const results = response.data
            if (results.status === 200) {
              this.activitiesList = response.data.activities
              this.totalPrice = response.data.totalPrice
              localStorage.setItem('priceSessionId', response.data.sessionId)
              localStorage.setItem('activitiesPrices', response.data.activities)
              this.openProceed = true
              this.showCheckout = true
            } else {
              this.snackbar = true
              this.color = 'error'
              this.text = results.errors
              this.loaded = false
              this.openProceed = false
              this.showCheckout = false
            }
          } catch (error) {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Something went wrong'
            this.loaded = false
            this.openProceed = false
            this.showCheckout = false
          }
        }
      } else {
        this.totalPrice = 0
        this.activitiesList = []
        this.openProceed = false
        this.showCheckout = false
      }
    },
    adventurePrice (item) {
      let price = 0
      const adults = Number(this.travellers)
      const children = Number(this.children)
      const travellers = adults + children
      const childPercentage = item.children_percentage ? item.children_percentage : 0
      if (travellers === 1 && this.solo) {
        price += Number(item.solo_price)
        price += item.solo_price * (childPercentage / 100) * children
      } else if (travellers === 1 && !this.solo) {
        price += Number(item.activityPricePerPerson)
        price += item.activityPricePerPerson * (childPercentage / 100) * children
      } else if (travellers === 2) {
        const travellersPrice = this.singleSupplement ? (Number(item.Limo_price) * adults) + (Number(item.Limo_price) * adults * (item.single_supplement_percentage / 100)) : Number(item.Limo_price) * adults
        price += Number(travellersPrice)
        price += item.Limo_price * (childPercentage / 100) * children
      } else if (adults >= 3 && adults <= 8) {
        const travellersPrice = this.singleSupplement ? (Number(item.HiAC_price) * adults) + (Number(item.HiAC_price) * adults * (item.single_supplement_percentage / 100)) : Number(item.HiAC_price) * adults
        price += travellersPrice
        price += item.HiAC_price * (childPercentage / 100) * children
      } else if (adults >= 9 && adults <= 18) {
        const travellersPrice = this.singleSupplement ? (Number(item.Caster_price) * adults) + (Number(item.Caster_price) * adults * (item.single_supplement_percentage / 100)) : Number(item.Caster_price) * adults
        price += travellersPrice
        price += item.Caster_price * (childPercentage / 100) * children
      } else if (adults > 18 && adults <= 50) {
        const travellersPrice = this.singleSupplement ? (Number(item.bus_price) * adults) + (Number(item.bus_price) * adults * (item.single_supplement_percentage / 100)) : Number(item.bus_price) * adults
        price += travellersPrice
        price += item.bus_price * (childPercentage / 100) * children
      }
      return price
    },
    async getAdventures () {
      try {
        let cityId
        this.$route.query.cityId ? cityId = this.$route.query.cityId : cityId = this.cities.find(city => city.citySlug === this.$route.params.city).CityID
        // eslint-disable-next-line no-console
        const promise = adventureServices.getCityAdventures(cityId, 1)
        const response = await promise
        const results = response.data
        if (results.data.ActivityList.length > 0) {
          this.adventures = results.data.ActivityList
          this.adventures.forEach((item) => {
            item.selected = true
            item.start_days = item.start_days.filter(data => !!data)
          })
        }
      } catch (error) {
        // this.snackbar = true
        // this.color = 'error'
        // this.text = 'Something went wrong'
        // this.loaded = false
      }
    },
    async getDurations () {
      try {
        const durationType = this.selectedDurationType
        const promise = adventureServices.getDurations(durationType)
        const response = await promise
        const results = response.data
        if (results.DurationList.length > 0) {
          this.durations = results.DurationList
        } else {
          this.durations = []
        }
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
        this.loaded = false
      }
    },
    async getPrices () {
      try {
        const promise = adventureServices.getPrices()
        const response = await promise
        const results = response.data
        if (results.priceList.length > 0) {
          this.prices = results.priceList
        }
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
        this.loaded = false
      }
    },
    bookAdventures () {
      this.$store.dispatch('setSelectedAdventures', this.selectedAdventures)
      this.$store.dispatch('setTravellersNumber', {
        adults: this.travellers,
        children: this.children,
        solo: this.solo,
        totalPrice: this.totalPrice,
        activitiesPrices: this.activitiesList
      })
      this.$router.push({ name: 'booking-module', params: { module: 'adventure' } })
    },
    changeCounterAdult (num) {
      this.travellers += +num
      if (!isNaN(this.travellers) && this.travellers > 0) {
        return this.travellers
      } else {
        this.travellers = 1
      }
    },
    changeCounterChild (num) {
      this.children += +num
      if (!isNaN(this.children) && this.children > 0) {
        if (num > 0) {
          // this.ageSelects.push(this.children)
          this.ageSelects.push({ age: null })
          this.showAgesSelects = true
        } else {
          this.ageSelects.splice(-1, 1)
        }
        return this.children
      } else {
        this.ageSelects = []
        this.children = 0
      }
    },
    async applyFilter (data) {
      const selectedSearchText = this.selectedSearchText
      const selectedCategory = this.selectedCategory
      const selectedDuration = this.selectedDuration
      const selectedDurationType = this.selectedDurationType
      let cityId
      this.$route.query.cityId ? cityId = this.$route.query.cityId : cityId = this.cities.find(city => city.CityName === this.$route.params.city).CityID
      // Construct the request body
      const requestBody = {
        title: selectedSearchText,
        city_id: cityId,
        type: selectedCategory,
        duration: selectedDuration,
        duration_type: selectedDurationType
      }

      try {
        const promise = adventureServices.filterAdventure(requestBody)
        const response = await promise
        const results = response.data
        this.adventures = results.data.ActivityList
        this.adventures.forEach((item) => {
          item.selected = false
          item.start_days = item.start_days.filter(data => !!data)
        })
      } catch (error) {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
        this.loaded = false
      }
      // }
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
    removeItemCart (id) {
      this.loadingDeleteItem = true
      this.selectedStatusFalse = true
      this.selectedAdventures.splice(this.selectedAdventures.findIndex(a => a.activity_id === id), 1)
      this.checkoutTotalPrice()
    },
    async getMetaData () {
      try {
        const getCityDetails = this.cities.find(city => city.citySlug === this.$route.params.city)
        if (getCityDetails) {
          this.metaData.seo_title = getCityDetails.citySEOTitle ? 'Best Adventures & ' + getCityDetails.citySEOTitle : null
          this.metaData.seo_description = getCityDetails.citySEODescription ? 'Best Adventures Trips & ' + getCityDetails.citySEODescription : null
          this.metaData.featured_image = getCityDetails.citySEOImage ? getCityDetails.citySEOImage : null
          this.metaData.slug = getCityDetails.citySlug
        } else if (this.$route.params.city) {
          const res = adventureServices.getCityDetails(this.$route.params.city)
          const results = await res
          const cityDetails = results.data.data
          this.metaData.seo_title = cityDetails.citySEOTitle ? 'Best Custom ' + cityDetails.citySEOTitle : null
          this.metaData.seo_description = cityDetails.citySEODescription ? 'Best Custom ' + cityDetails.citySEODescription : null
          this.metaData.featured_image = cityDetails.citySEOImage ? cityDetails.citySEOImage : null
          this.metaData.slug = cityDetails.citySlug
        } else {
          const promise = adventureServices.getMetaData(4)
          const response = await promise
          const results = response.data
          if (results.data) {
            this.metaData = results.data
          }
        }
      } catch (error) {
        this.loaded = false
      }
    }
  }
}
</script>

  <style>
  .adventure-controller {
    position: sticky;
    top: 0;
    z-index: 3;
    background-color: #fbfbfb;
    border: 1px solid #e0e0e0;
  }

  @media only screen and (max-width: 722px) {
    .set-line-height-responsive {
      line-height: unset !important;
    }
  }
  </style>
