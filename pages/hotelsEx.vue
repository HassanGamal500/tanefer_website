<template>
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
</template>
