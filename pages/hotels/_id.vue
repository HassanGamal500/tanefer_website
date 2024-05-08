<template>
  <div>
    <v-container fluid>
      <v-snackbar
        v-model="snackbar"
        :color="color"
        :timeout="5000"
        top
      >
        <v-row>
          <span v-html="text" />
          <v-spacer />
          <v-icon small color="white" class="ml-3" @click="snackbar = false">
            mdi-close
          </v-icon>
        </v-row>
      </v-snackbar>
      <div v-if="hotelAvails && !hotelLoading" class="cruise-body">
        <v-container>
          <v-alert
            v-if="showAlertBar"
            border="left"
            colored-border
            type="error"
            elevation="2"
            dismissible
          >
            {{ alertText }}
          </v-alert>
          <v-row>
            <v-col cols="12" md="3">
              <v-card class="pa-2">
                <v-card-title class="body-1 font-weight-bold px-0">
                  Dates & Occupancy
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
                      label="Cruise Start Date"
                      readonly
                      prepend-inner-icon="mdi-calendar"
                      color="late"
                      persistent-hint
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    color="late"
                    :allowed-dates="allowedDates"
                    :min="new Date().toISOString()"
                    type="date"
                    @input="startDateMenu = false"
                  />
                </v-menu>

                <rooms-and-guests @save="setGuests" />

                <!-- <h6 class="body-1 font-weight-bold">
                    Price: $ {{ initialPrice }}
                  </h6> -->

                <v-btn class="mb-5 lightBrown white--text" block :loading="selectLoading" @click="getCruiseRooms">
                  Check Availablity
                </v-btn>
              </v-card>
            </v-col>
            <v-col cols="12" md="9">
              <v-card class="pa-3">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-img :src="image" height="200" class="rounded" />
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex flex-wrap">
                    <v-img
                      v-for="(item, i) in cruise.images"
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
                  {{ cruise.name }}
                  <v-rating
                    background-color="green lighten-2"
                    color="warning"
                    dense
                    empty-icon="mdi-star-outline"
                    full-icon="mdi-star"
                    length="5"
                    readonly
                    size="15"
                    :value="cruise.stars"
                  />
                </v-card-title>
                <v-card-subtitle class="py-0 px-0 my-1">
                  Cruise Line: {{ cruise.cruise_line }} / Ship: {{ cruise.ship_name }} / Nights: {{ cruise.number_of_nights }} / Cities:
                  <span v-for="(item, i) in cruise.cities" :key="i">{{ item.name + ', ' }}</span>
                </v-card-subtitle>
                <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
                <v-card-text class="px-0" v-html="cruise.description" />
                <div v-if="cruise.available_dates.length">
                  <h6>This Crusise is available to book during the following dates:</h6>
                  <div v-for="(season, k) in cruise.available_dates" :key="k">
                    <p><strong>From</strong> {{ new Date(season.start_date.replaceAll('-', '/')).toDateString() }} <strong>To</strong> {{ new Date(season.end_date.replaceAll('-', '/')).toDateString() }} </p>
                  </div>
                </div>
                <div v-if="cruise.includes.length">
                  <p class="text-h6">
                    Includes
                  </p>
                  <v-chip v-for="(item, i) in cruise.includes" :key="i" class="ma-1">
                    {{ item }}
                  </v-chip>
                </div>
                <div v-if="cruise.excludes.length">
                  <p class="text-h6">
                    Excludes
                  </p>
                  <v-chip v-for="(item, i) in cruise.excludes" :key="i" class="ma-1">
                    {{ item }}
                  </v-chip>
                </div>
                <div v-if="cruise.facilities.length">
                  <p class="text-h6">
                    Facilities
                  </p>
                  <v-chip v-for="(item, i) in cruise.facilities" :key="i" class="ma-1">
                    {{ item }}
                  </v-chip>
                </div>
                <div v-if="cruise.policies.length">
                  <p class="text-h6">
                    Policies
                  </p>
                  <v-chip v-for="(item, i) in cruise.policies" :key="i" class="ma-1">
                    {{ item }}
                  </v-chip>
                </div>
                <div v-if="cruise.start_days.length">
                  <p class="text-h6">
                    Start Days
                  </p>
                  <v-chip v-for="(item, i) in cruise.start_days" :key="i" class="ma-1">
                    {{ item }}
                  </v-chip>
                </div>
              </v-card>
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
            <v-col cols="12" md="8">
              <div v-if="hotelAvails" class="results ma-1">
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
                          <p class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Hotel Description:</strong> {{ hotelAvails.HotelInfo.Description }}
                          </p>
                          <p class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Address:</strong> {{ hotelAvails.HotelInfo.Address }}
                          </p>
                          <p class="" style="font-size: 15px;margin: 2px 0;">
                            <strong>Category:</strong> {{ hotelAvails.HotelInfo.HotelCategory._ }}
                          </p>
                          <a class="" style="font-size: 15px;margin: 2px 0;" @click="showRoomsObject(hotelAvails.JPCode)">Select Room</a>
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
                              @click="showHotelDetailsObject(hotelAvails.JPCode)"
                            >
                              view
                            </v-btn>
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
              </div>
              <h4 v-else class="my-5 text-center">
                No hotel available now!
              </h4>
            </v-col>
          </v-row>

          <!-- rooms segments -->
          <div id="cruise-rooms">
            <div v-if="cruiseRoomsResults.length">
              <div class="hidden">
                {{ selectedRoom }}
              </div>
              <v-card
                v-for="(item, i) in cruiseRoomsResults"
                :key="i"
                class="mt-5 pa-5"
                elevation="8"
              >
                <v-card-title class="pa-0 pb-3 brown--text">
                  Room {{ (i+1) }}
                </v-card-title>
                <v-slide-group
                  show-arrows
                >
                  <v-slide-item
                    v-for="(room, j) in item[`room_${i+1}`]"
                    :key="j"
                  >
                    <v-card
                      class="mx-5 my-1"
                      width="350"
                    >
                      <v-card-title class="body-1 late--text d-flex flex-wrap justify-space-between">
                        <div>{{ room.type }}, {{ room.occupancy }}</div>
                        <v-icon v-if="isRoomSelected(room.id, i)" color="success">
                          mdi-check-circle
                        </v-icon>
                      </v-card-title>
                      <v-card-subtitle><span v-for="category in room.categories" :key="category">{{ category }} ,</span></v-card-subtitle>
                      <v-card-subtitle class="pt-0">
                        Maximum Adults {{ room.max_num_adult }} / Maximum children {{ room.max_num_children }}
                      </v-card-subtitle>
                      <v-card-text>
                        <div v-if="room.inclusions.length">
                          <p class="text-h6">
                            Includes
                          </p>
                          <v-chip v-for="inc in room.inclusions" :key="inc" class="ma-1">
                            {{ inc }}
                          </v-chip>
                        </div>
                        <div v-if="room.amenities.length">
                          <p class="text-h6">
                            Amenities
                          </p>
                          <v-chip v-for="amen in room.amenities" :key="amen" class="ma-1">
                            {{ amen }}
                          </v-chip>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <h6 class="body-1 font-weight-bold">
                          USD {{ room.price_per_day }}<small>/Night</small>
                        </h6>
                        <v-spacer />
                        <v-btn v-if="!isRoomSelected(room.id, i)" color="lightBrown white--text px-5" elevation="0" @click="selectRoom(i, room)">
                          Select
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>
              </v-card>
              <v-btn v-if="selectedRooms.length === cruiseRoomsResults.length" color="lightBrown white--text px-15 d-block mx-auto mt-5" :loading="reserveLoading" elevation="0" @click="reserve">
                Reserve
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>
      <template v-else-if="!hotelAvails || hotelLoading">
        <v-progress-linear
          indeterminate
          color="yellow darken-2"
        />
      </template>
      <p v-else class="text-center">
        No Rooms Available!
      </p>

      <v-dialog v-if="(confirmData && reservationData)" v-model="showPricingDialog" width="500">
        <v-card max-width="500">
          <v-card-title class="px-3 lightBrown white--text">
            Cruise Total price
          </v-card-title>
          <v-card-text class="pt-5">
            <table class="confirmation-table">
              <thead>
                <th>Room</th>
                <th>Quantity</th>
              </thead>
              <tbody>
                <tr v-for="(room, i) in reservationData.rooms" :key="i">
                  <td>{{ room.type }} ({{ room.occupancy }})</td>
                  <td>{{ room.quantity }}</td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
          <v-divider />
          <v-card-actions class="px-3">
            <h6 class="body-1 font-weight-bold">
              USD {{ confirmData.totalPrice }}
            </h6>
            <!-- <h6 class="body-1 font-weight-bold">
                USD {{ initialPrice }}
              </h6> -->
            <v-spacer />
            <v-btn color="lightBrown white--text px-5" @click="proceedToBook">
              Proceed
            </v-btn>
          </v-card-actions>
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
                                    <strong>Room Name:</strong> {{ room.Name }} <br>
                                    <strong>Room Category:</strong> {{ room.RoomCategory._ }} <br>
                                    <strong>Number of Adults:</strong> {{ room.RoomOccupancy.Adults }} <br>
                                    <strong>Number of Children:</strong> {{ room.RoomOccupancy.Children }} <br>
                                    <hr>
                                  </div>
                                </span>
                                <span v-else>
                                  <strong>Room Name:</strong> {{ hotelOption.HotelRooms.HotelRoom.Name }} <br>
                                  <strong>Room Category:</strong> {{ hotelOption.HotelRooms.HotelRoom.RoomCategory._ }} <br>
                                  <strong>Number of Adults:</strong> {{ hotelOption.HotelRooms.HotelRoom.RoomOccupancy.Adults }} <br>
                                  <strong>Number of Children:</strong> {{ hotelOption.HotelRooms.HotelRoom.RoomOccupancy.Children }} <br>
                                </span>
                              </p>
                              <p v-if="hotelOption.AdditionalElements" class="" style="font-size: 18px;margin: 2px 0;">
                                <strong>Hotel Offer:</strong> {{ hotelOption.AdditionalElements.HotelOffers.HotelOffer.Name }} <br>
                                <strong>Hotel Offer Description:</strong> {{ hotelOption.AdditionalElements.HotelOffers.HotelOffer.Description }} <br>
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
                                  <strong>Number of Adults:</strong> {{ room.RoomOccupancy.Adults }} <br>
                                  <strong>Number of Children:</strong> {{ room.RoomOccupancy.Children }} <br>
                                  <hr>
                                </div>
                              </span>
                              <span v-else>
                                <strong>Number of Adults:</strong> {{ hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.RoomOccupancy.Adults }} <br>
                                <strong>Number of Children:</strong> {{ hotelAvails.HotelOptions.HotelOption.HotelRooms.HotelRoom.RoomOccupancy.Children }} <br>
                              </span>
                            </p>
                            <p v-if="hotelAvails.HotelOptions.HotelOption.AdditionalElements" class="" style="font-size: 18px;margin: 2px 0;">
                              <strong>Hotel Offer:</strong> {{ hotelAvails.HotelOptions.HotelOption.AdditionalElements.HotelOffers.HotelOffer.Name }} <br>
                              <strong>Hotel Offer Description:</strong> {{ hotelAvails.HotelOptions.HotelOption.AdditionalElements.HotelOffers.HotelOffer.Description }} <br>
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
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import hotelsServices from '~/services/HotelsServices'

export default {
  data () {
    return {
      hotelLoading: true,
      image: '',
      selectedRooms: [],
      selectedRoom: null,
      reserveLoading: false,
      confirmData: null,
      reservationData: null,
      showPricingDialog: false,
      startDateMenu: false,
      startDate: new Date().toISOString().substring(0, 10),
      endDateMenu: false,
      endDate: '',
      selectLoading: false,
      showAlertBar: false,
      alertText: '',
      initialPrice: 0,
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
      ages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
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
        { travelers: 0, children: 0, ageSelects: [], roomCategory: { _: 'All', Type: 'all' } }
      ],
      hotels: [],
      gtaCities: [],
      selectedCity: null,
      gtaHotels: [],
      gtaZones: [],
      selectedZone: null,
      gtaCatgories: [],
      selectedCategory: null,
      gtaBoards: [],
      selectedBoard: null,
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
      bAgesChild: []
    }
  },
  async fetch () {
    try {
      console.log(this.$route.query)
      const promise = hotelsServices.getGtaHotelDetails(this.$route.params.code)
      const response = await promise
      this.hotelAvails = response.data.data
      this.image = this.hotelAvails.master_image
    } catch (err) {
      this.showAlert(err.response.data.error, 'error')
    } finally {
      this.hotelLoading = false
    }
    this.$store.dispatch('setCruiseRoomsResults', [])
  },
  head () {
    return {
      title: this.$route.query.code
    }
  },
  computed: {
    ...mapState(['cruiseRoomsResults', 'cruiseChosenDate']),
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
    }
  },
  methods: {
    formatDate (date, i, type) {
      if (!date) { return null }
      const [year, month, day] = date.split('-')
      const newDate = `${day}-${month}-${year}`
      if (type === 'packageStartDay') { this.packageStartDayText = newDate }
      if (type === 'hotelStartDate') { this.hotelStartDateText = newDate }
      if (type === 'hotelEndDate') { this.hotelEndDateText = newDate }
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
    async showHotelDetailsObject (code) {
      try {
        const promise = hotelsServices.getGtaHotelDetails(code)
        const response = await promise
        const results = response.data
        if (results.ContentRS) {
          this.gtaHotelDetails = results.ContentRS.Contents.HotelContent
          this.showHotelGtaDetails = true
        }
      } catch (error) {
        this.loaded = false
      }
    },
    showRooms (HotelIndex) {
      if (this.listGtaHotelDetails.length > 1) {
        this.hotelAvails = this.hotelAvailsArray[HotelIndex]
      }
      if (this.hotelAvails !== null) {
        this.showRoomsDialog = true
      }
    },
    showRoomsObject (code) {
      if (this.hotelAvails !== null) {
        this.showRoomsDialog = true
      }
    },
    selectRoomHotelGta (AvailIndex) {
      if (this.hotelAvailsArray.length > 0) {
        this.selectedRoomGtaArray.push(this.hotelAvails.HotelOptions.HotelOption)
        this.getRatePlanCodeArray.push(this.hotelAvails.HotelOptions.HotelOption.RatePlanCode)
        this.hotelPrices += this.hotelAvails.HotelOptions.HotelOption.Prices.Price.TotalFixAmounts.Nett
        this.selectedHotelCodeArray.push(this.hotelAvails.Code)
        this.selectedHotelJPCodeArray.push(this.hotelAvails.JPCode)
        this.selectedHotelJPDCodeArray.push(this.hotelAvails.JPDCode)
      } else {
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
      }
      this.showRoomsDialog = false
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
            const results = response.data.BookingRS
            if (results.Errors !== undefined) {
              this.snackbar = true
              this.color = 'error'
              this.text = results.Errors.Error.Text
              this.loaded = false
              this.checkResponseCode = false
              this.isBooked = true
              this.isLoading = false
            } else {
              this.getBookingCodeArray.push(results)
              this.isBooked = true
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
          const results = response.data.BookingRS
          if (results.Errors !== undefined) {
            this.snackbar = true
            this.color = 'error'
            this.text = results.Errors.Error.Text
            this.loaded = false
            this.checkResponseCode = false
            this.isBooked = true
            this.isLoading = false
          } else {
            this.getBookingCode = results
            this.isBooked = true
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
    proceedToBook () {
      this.$store.dispatch('setCruiseReserveData', this.reservationData)
      this.$router.push({ name: 'booking-module', params: { module: 'cruise' } })
    },
    showAlert (text, color) {
      this.snackbar = true
      this.color = color
      this.text = text
    }
  }
}
</script>

  <style>
  .cruise-body {
    scroll-behavior: smooth;
  }
  .confirmation-table {
      width: 100%;
      text-align: center;
      border: 0.5px solid;
  }
  .confirmation-table td, .confirmation-table th {
      border: 0.5px solid;
  }
  .hidden {
      display: none;
  }
  </style>
