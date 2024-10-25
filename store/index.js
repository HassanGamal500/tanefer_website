// import axios from 'axios'

export const state = () => ({
  airports: {
    departureAirports: [null, null, null],
    arrivalAirports: [null, null, null]
  },
  flightDates: {
    departureDates: [null, null, null],
    arrivalDate: null
  },
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
    classType: { text: 'Economy', value: 'Y' }
  },
  flightSearchQuery: '',
  flightResults: {},
  flightType: 'round',
  flightsTimeOut: false,
  flightsTimeOutFunction: null,
  flightsSearchTimeOutFunction: null,
  // hotels
  hotelTimeOut: false,
  hotelTimeOutFunction: null,
  hotelSearchTimeOutFunction: null,
  hotelSearch: {
    checkInDate: null,
    checkOutDate: null,
    destination: null,
    guestsInfo: [
      {
        adults: 1,
        children: 0,
        childrenAges: []
      }
    ]
  },
  countryCode: null,
  starRating: '',
  hotels: null,
  hotelSearchQuery: '',
  hotelParams: null,
  roomsParams: null,
  // cars
  carInfo: {
    pickupLocation: null,
    dropLocation: null,
    pickup: null,
    drop: null,
    pickupTime: null,
    dropTime: null
  },
  cars: null,
  carsTimeOut: false,
  carsTimeOutFunction: null,
  carsSearchTimeOutFunction: null,
  carSearchQuery: '',
  carRentData: {},
  rentedCar: null,
  // trips
  tripsCity: {},
  tripsResults: [],
  tripBookingData: {},
  // adventures
  selectedAdventures: [],
  travellersNumber: 1,
  cruiseRoomsResults: [],
  cruiseChosenDate: '',
  cruiseGuests: {
    adults: 1,
    children: 0
  },
  cruiseRooms: [],
  cruiseReserveData: null,
  countries: [
    { code: 'US', name: 'United States of America' },
    { code: 'AF', name: 'Afghanistan' },
    { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'AS', name: 'American Samoa' },
    { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' },
    { code: 'AI', name: 'Anguilla' },
    { code: 'AQ', name: 'Antarctica' },
    { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AW', name: 'Aruba' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BM', name: 'Bermuda' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BO', name: 'Bolivia Plurinational State' },
    { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BV', name: 'Bouvet Island' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IO', name: 'British Indian Ocean Territory' },
    { code: 'BN', name: 'Brunei Darussalam' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' },
    { code: 'CV', name: 'Cabo Verde' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CA', name: 'Canada' },
    { code: 'KY', name: 'Cayman Islands' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' },
    { code: 'CL', name: 'Chile' },
    { code: 'CN', name: 'China' },
    { code: 'CX', name: 'Christmas Island' },
    { code: 'CC', name: 'Cocos (Keeling) Islands' },
    { code: 'CO', name: 'Colombia' },
    { code: 'KM', name: 'Comoros' },
    { code: 'CD', name: 'Congo the Democratic' },
    { code: 'CG', name: 'Congo ' },
    { code: 'CK', name: 'Cook Island' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'HR', name: 'Croatia' },
    { code: 'CU', name: 'Cuba' },
    { code: 'CW', name: 'Curaçao' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czechia' },
    { code: 'CI', name: "Côte d'Ivoire" },
    { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'EG', name: 'Egypt' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'FK', name: 'Falkland Islands' },
    { code: 'FO', name: 'Faroe Islands' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'GF', name: 'French Guiana' },
    { code: 'PF', name: 'French Polynesia' },
    { code: 'TF', name: 'French Southern Territories' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GE', name: 'Georgia' },
    { code: 'DE', name: 'Germany' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GI', name: 'Gibraltar' },
    { code: 'GR', name: 'Greece' },
    { code: 'GL', name: 'Greenland' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GP', name: 'Guadeloupe' },
    { code: 'GU', name: 'Guam' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GG', name: 'Guernsey' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HM', name: 'Heard Island and McDonald Islands' },
    { code: 'VA', name: 'Holy See (the)' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IR', name: 'Iran' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IM', name: 'Isle of Man' },
    { code: 'IL', name: 'Israel' },
    { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'JE', name: 'Jersey' },
    { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'KI', name: 'Kiribat' },
    { code: 'KP', name: 'Korea' },
    { code: 'KR', name: 'Korea' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'LA', name: "Lao People's Democratic Republic" },
    { code: 'LV', name: 'Latvia' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LY', name: 'Libya' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MO', name: 'Macao' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'MQ', name: 'Martinique' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'YT', name: 'Mayotte' },
    { code: 'MX', name: 'Mexico' },
    { code: 'FM', name: 'Micronesia' },
    { code: 'MD', name: 'Moldova' },
    { code: 'MC', name: 'Monaco' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MS', name: 'Montserrat' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NC', name: 'New Caledonia' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'NU', name: 'Niue' },
    { code: 'NF', name: 'Norfolk Island' },
    { code: 'MP', name: 'Northern Mariana Islands' },
    { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PW', name: 'Palau' },
    { code: 'PS', name: 'Palestine' },
    { code: 'PA', name: 'Panama' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PH', name: 'Philippines' },
    { code: 'PN', name: 'Pitcairn' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'PR', name: 'Puerto Rico' },
    { code: 'QA', name: 'Qatar' },
    { code: 'MK', name: 'Republic of North Macedonia' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russian Federation' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'RE', name: 'Réunion' },
    { code: 'BL', name: 'Saint Barthélemy' },
    { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
    { code: 'KN', name: 'Saint Kitts and Nevis' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'MF', name: 'Saint Martin (French part)' },
    { code: 'PM', name: 'Saint Pierre and Miquelon' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' },
    { code: 'WS', name: 'Samoa' },
    { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'Sao Tome and Principe' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SX', name: 'Sint Maarten (Dutch part)' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'ES', name: 'Spain' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SJ', name: 'Svalbard and Jan Mayen' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SY', name: 'Syrian Arab Republic' },
    { code: 'TW', name: 'Taiwan (Province of China)' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' },
    { code: 'TG', name: 'Togo' },
    { code: 'TK', name: 'Tokelau' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TR', name: 'Turkey' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TC', name: 'Turks and Caicos Islands' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom of Great Britain and Northern Ireland' },
    { code: 'UM', name: 'United States Minor Outlying Islands' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'VE', name: 'Venezuela (Bolivarian Republic)' },
    { code: 'VN', name: 'Viet Nam' },
    { code: 'VG', name: 'Virgin Islands (British)' },
    { code: 'VI', name: 'Virgin Islands (U.S.)' },
    { code: 'WF', name: 'Wallis and Futuna' },
    { code: 'EH', name: 'Western Sahara' },
    { code: 'YE', name: 'Yemen' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' },
    { code: 'AX', name: 'Åland Islands' }
  ],
  cities: [],
  hotelSearchData: {
    startDate: null,
    endDate: null,
    travellers: 0,
    children: 0,
    board: '',
    hotelCategory: '',
    hotelTypeCategory: ''
  }
})

export const mutations = {
  setHotelSearchData (state, searchData) {
    state.hotelSearchData = searchData
  },
  setAirports (state, payload) {
    switch (payload.type) {
      case 'departure1':
        state.airports.departureAirports[0] = payload.data
        break
      case 'departure2':
        state.airports.departureAirports[1] = payload.data
        break
      case 'departure3':
        state.airports.departureAirports[2] = payload.data
        break
      case 'arrival1':
        state.airports.arrivalAirports[0] = payload.data
        break
      case 'arrival2':
        state.airports.arrivalAirports[1] = payload.data
        break
      case 'arrival3':
        state.airports.arrivalAirports[2] = payload.data
        break
      case 'pickup':
        state.carInfo.pickupLocation = payload.data
        break
      case 'drop':
        state.carInfo.dropLocation = payload.data
        break
      default:
        break
    }
  },
  setDates (state, payload) {
    switch (payload.type) {
      case 'departure1':
        state.flightDates.departureDates[0] = payload.data
        break
      case 'departure2':
        state.flightDates.departureDates[1] = payload.data
        break
      case 'departure3':
        state.flightDates.departureDates[2] = payload.data
        break
      case 'arrival':
        state.flightDates.arrivalDate = payload.data
        break
      case 'pickup':
        state.carInfo.pickup = payload.data
        break
      case 'drop':
        state.carInfo.drop = payload.data
        break
      case 'checkIn':
        state.hotelSearch.checkInDate = payload.data
        break
      case 'checkOut':
        state.hotelSearch.checkOutDate = payload.data
        break
      default:
        break
    }
  },
  setPassengersData (state, payload) {
    state.passengers = payload
  },
  setClass (state, payload) {
    state.passengers.classType = payload
  },
  setFlightSearchQuery (state, payload) {
    state.flightSearchQuery = payload
  },
  setFlightResults (state, payload) {
    state.flightResults = payload
  },
  updateFlights (state, payload) {
    state.flightResults.flights = payload
  },
  setFlightsTimeOut (state, payload) {
    state.flightsTimeOut = payload
  },
  setFlightsTimeOutFunction (state, payload) {
    state.flightsTimeOutFunction = payload
  },
  setFlightsSearchTimeoutFunction (state, payload) {
    state.flightsSearchTimeOutFunction = payload
  },
  setFlightType (state, payload) {
    state.flightType = payload
  },
  removeAirportsData (state) {
    state.airports.departureAirports = [null, null, null]
    state.airports.arrivalAirports = [null, null, null]
  },
  removeSegment (state) {
    state.airports.departureAirports[2] = null
    state.airports.arrivalAirports[2] = null
    state.flightDates.departureDates[2] = null
  },
  removeFlightResults (state) {
    state.flightResults = {}
  },
  clearFlightsTimeoutFunction (state) {
    clearTimeout(state.flightsTimeOutFunction)
  },
  clearFlightsSearchTimeoutFunction (state) {
    clearTimeout(state.flightsSearchTimeOutFunction)
  },
  // hotels
  setHotelTimeOut (state, payload) {
    state.hotelTimeOut = payload
  },
  setHotelTimeOutFunction (state, payload) {
    state.hotelTimeOutFunction = payload
  },
  setHotelSearchTimeoutFunction (state, payload) {
    state.hotelSearchTimeOutFunction = payload
  },
  setHotelDestination (state, payload) {
    state.hotelSearch.destination = payload
  },
  setHotelGuestsInfo (state, payload) {
    state.hotelSearch.guestsInfo = payload
  },
  setCountryCode (state, payload) {
    state.countryCode = payload
  },
  setHotels (state, payload) {
    state.hotels = payload
  },
  setStarRating (state, payload) {
    state.starRating = payload
  },
  setHotelSearchQuery (state, payload) {
    state.hotelSearchQuery = payload
  },
  setHotelParams (state, payload) {
    state.hotelParams = payload
  },
  clearHotelGuests (state) {
    state.hotelSearch.guestsInfo = [
      {
        adults: 1,
        children: 0,
        childrenAges: []
      }
    ]
  },
  removeHotelsResults (state) {
    state.hotels = null
  },
  clearHotelTimeoutFunction (state) {
    clearTimeout(state.hotelTimeOutFunction)
  },
  clearHotelSearchTimeoutFunction (state) {
    clearTimeout(state.hotelSearchTimeOutFunction)
  },
  setRoomsParams (state, payload) {
    state.roomsParams = payload
  },
  // cars
  setCarTimes  (state, payload) {
    payload.type === 'pickup' ? state.carInfo.pickupTime = payload.data : state.carInfo.dropTime = payload.data
  },
  setCars (state, payload) {
    state.cars = payload
  },
  setCarsTimeOut (state, payload) {
    state.carsTimeOut = payload
  },
  setCarsTimeOutFunction (state, payload) {
    state.carsTimeOutFunction = payload
  },
  setCarsSearchTimeOutFunction (state, payload) {
    state.carsSearchTimeOutFunction = payload
  },
  setCarSearchQuery (state, payload) {
    state.carSearchQuery = payload
  },
  setCarRentData (state, payload) {
    state.carRentData = payload
  },
  setRentedCar (state, payload) {
    state.rentedCar = payload
  },
  setSelectedAdventures (state, payload) {
    state.selectedAdventures = payload
  },
  setTravellersNumber (state, payload) {
    state.travellersNumber = payload
  },
  removeCarsResults (state) {
    state.cars = null
  },
  clearDropLocation (state) {
    state.carInfo.dropLocation = null
  },
  clearCarsTimeOutFunction (state) {
    clearTimeout(state.carsTimeOutFunction)
  },
  clearCarsSearchTimeOutFunction (state) {
    clearTimeout(state.carsSearchTimeOutFunction)
  },
  // trips
  setTripCity (state, payload) {
    state.tripsCity = payload
  },
  setTripsResults (state, payload) {
    state.tripsResults = payload
  },
  setTripBookingData (state, payload) {
    state.tripBookingData = payload
  },
  removeTripsResults (state) {
    state.tripsResults = []
  },
  // cruises
  setCruiseRoomsResults (state, payload) {
    state.cruiseRoomsResults = payload
  },
  setCruiseChosenDate (state, payload) {
    state.cruiseChosenDate = payload
  },
  setCruiseGuests (state, payload) {
    state.cruiseGuests = payload
  },
  setCruiseRooms (state, payload) {
    state.cruiseRooms = payload
  },
  setCruiseReserveData (state, payload) {
    state.cruiseReserveData = payload
  },
  setCities (state, payload) {
    state.cities = payload
  }
}

export const actions = {
  async nuxtServerInit ({ commit, state }) {
    if (!state.cities.length) {
      // const data = await this.$axios.$get('https://tanefer.nahrdev.com/api/v2/tours/list-city', { headers: { clientSecret: process.env.clientSecret } })
      const data = await this.$axios.$get('https://api.tanefer.com/api/v2/tours/list-city', { headers: { clientSecret: process.env.clientSecret } })
      commit('setCities', data.cities)
    }
  },
  setAirports (context, payload) {
    context.commit('setAirports', payload)
  },
  setDates (context, payload) {
    context.commit('setDates', payload)
  },
  setPassengersData (context, payload) {
    context.commit('setPassengersData', payload)
  },
  setClass (context, payload) {
    context.commit('setClass', payload)
  },
  setFlightResults (context, payload) {
    context.commit('setFlightResults', payload)
  },
  setFlightSearchQuery (context, payload) {
    context.commit('setFlightSearchQuery', payload)
  },
  updateFlights (context, payload) {
    context.commit('updateFlights', payload)
  },
  setFlightType (context, payload) {
    context.commit('setFlightType', payload)
  },
  setFlightsTimeOut (context, payload) {
    context.commit('setFlightsTimeOut', payload)
  },
  setFlightsTimeOutFunction (context, payload) {
    context.commit('setFlightsTimeOutFunction', payload)
  },
  setFlightsSearchTimeoutFunction (context, payload) {
    context.commit('setFlightsSearchTimeoutFunction', payload)
  },
  removeAirportsData (context) {
    context.commit('removeAirportsData')
  },
  removeDatesData (context) {
    context.commit('removeDatesData')
  },
  removeSegment (context) {
    context.commit('removeSegment')
  },
  removePassengersData (context) {
    context.commit('removePassengersData')
  },
  removeFlightResults (context) {
    context.commit('removeFlightResults')
  },
  clearFlightsTimeoutFunction (context) {
    context.commit('clearFlightsTimeoutFunction')
  },
  clearFlightsSearchTimeoutFunction (context) {
    context.commit('clearFlightsSearchTimeoutFunction')
  },
  // hotels
  setHotelTimeOut (context, payload) {
    context.commit('setHotelTimeOut', payload)
  },
  setHotelTimeOutFunction (context, payload) {
    context.commit('setHotelTimeOutFunction', payload)
  },
  setHotelSearchTimeoutFunction (context, payload) {
    context.commit('setHotelSearchTimeoutFunction', payload)
  },
  setHotelDestination (context, payload) {
    context.commit('setHotelDestination', payload)
  },
  setHotelGuestsInfo (context, payload) {
    context.commit('setHotelGuestsInfo', payload)
  },
  setCountryCode (context, payload) {
    context.commit('setCountryCode', payload)
  },
  setHotels (context, payload) {
    context.commit('setHotels', payload)
  },
  setStarRating (context, payload) {
    context.commit('setStarRating', payload)
  },
  setHotelSearchQuery (context, payload) {
    context.commit('setHotelSearchQuery', payload)
  },
  setHotelParams (context, payload) {
    context.commit('setHotelParams', payload)
  },
  removeHotelsResults (context) {
    context.commit('removeHotelsResults')
  },
  clearHotelGuests (context) {
    context.commit('clearHotelGuests')
  },
  clearHotelTimeoutFunction (context) {
    context.commit('clearHotelTimeoutFunction')
  },
  clearHotelSearchTimeoutFunction (context) {
    context.commit('clearHotelSearchTimeoutFunction')
  },
  setRoomsParams (context, payload) {
    context.commit('setRoomsParams', payload)
  },
  // cars
  setCarTimes (context, payload) {
    context.commit('setCarTimes', payload)
  },
  setCars (context, payload) {
    context.commit('setCars', payload)
  },
  setCarsTimeOut (context, payload) {
    context.commit('setCarsTimeOut', payload)
  },
  setCarsTimeOutFunction (context, payload) {
    context.commit('setCarsTimeOutFunction', payload)
  },
  setCarsSearchTimeOutFunction (context, payload) {
    context.commit('setCarsSearchTimeOutFunction', payload)
  },
  setCarSearchQuery (context, payload) {
    context.commit('setCarSearchQuery', payload)
  },
  setCarRentData (context, payload) {
    context.commit('setCarRentData', payload)
  },
  setRentedCar (context, payload) {
    context.commit('setRentedCar', payload)
  },
  setSelectedAdventures (context, payload) {
    context.commit('setSelectedAdventures', payload)
  },
  setTravellersNumber (context, payload) {
    context.commit('setTravellersNumber', payload)
  },
  removeCarsResults (context) {
    context.commit('removeCarsResults')
  },
  clearDropLocation (context) {
    context.commit('clearDropLocation')
  },
  clearCarsTimeOutFunction (context) {
    context.commit('clearCarsTimeOutFunction')
  },
  clearCarsSearchTimeOutFunction (context) {
    context.commit('clearCarsSearchTimeOutFunction')
  },
  // trips
  setTripCity (context, payload) {
    context.commit('setTripCity', payload)
  },
  setTripsResults (context, payload) {
    context.commit('setTripsResults', payload)
  },
  setTripBookingData (context, payload) {
    context.commit('setTripBookingData', payload)
  },
  removeTripsResults (context) {
    context.commit('removeTripsResults')
  },
  // cruises
  setCruiseRoomsResults ({ commit }, payload) {
    commit('setCruiseRoomsResults', payload)
  },
  setCruiseChosenDate ({ commit }, payload) {
    commit('setCruiseChosenDate', payload)
  },
  setCruiseGuests ({ commit }, payload) {
    const guests = {
      adults: 0,
      children: 0
    }
    payload.forEach((el) => {
      guests.adults += parseInt(el.adults)
      guests.children += parseInt(el.children)
    })
    commit('setCruiseGuests', guests)
    commit('setCruiseRooms', payload)
  },
  setCruiseReserveData ({ commit }, payload) {
    commit('setCruiseReserveData', payload)
  },
  setCities ({ commit }, payload) {
    commit('setCities', payload)
  }
}

export const getters = {
  getHotelSearchData: state => state.hotelSearchData
}

export const strict = false

export const modules = {
  loading: require('./loading').default
}
