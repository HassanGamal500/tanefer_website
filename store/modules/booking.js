export const namespaced = true
export const state = () => ({
  bookingdata: {}, // For single hotel booking
  multipleBookingData: [] // For multiple hotels in a trip
})

export const mutations = {
  SET_BOOKING_DATA (state, data) {
    state.bookingdata = data
  },
  ADD_MULTIPLE_BOOKING_DATA (state, data) {
    state.multipleBookingData.push(data)
  },
  RESET_MULTIPLE_BOOKING_DATA (state) {
    state.multipleBookingData = []
  }
}

export const actions = {
  setBookingResponse ({ commit }, data) {
    const bookingData = {
      hotelName: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelContent?.HotelName || 'N/A',
      hotelCategory: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelContent?.HotelCategory?._ || 'N/A',
      address: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelContent?.Address?.Address || 'N/A',
      totalPrice: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.Prices?.Price?.TotalFixAmounts?.Nett || 'N/A',
      board: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.Board?._ || 'N/A',
      roomType: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelRooms?.HotelRoom?.Name || 'N/A',
      cancellationPolicy: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.CancellationPolicy?.Description || 'N/A',
      comments: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.OptionalElements?.Comments?.Comment?._ || 'N/A'
    }
    commit('SET_BOOKING_DATA', bookingData)
  },
  addMultipleBookingResponse ({ commit }, data) {
    const bookingData = {
      hotelName: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelContent?.HotelName || 'N/A',
      code: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelContent?.Code || 'N/A',
      hotelCategory: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelContent?.HotelCategory?._ || 'N/A',
      address: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelContent?.Address?.Address || 'N/A',
      totalPrice: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.Prices?.Price?.TotalFixAmounts?.Nett || 'N/A',
      board: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.Board?._ || 'N/A',
      roomType: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelRooms?.HotelRoom?.Name || 'N/A',
      cancellationPolicy: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.CancellationPolicy?.Description || 'N/A',
      comments: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.OptionalElements?.Comments?.Comment?._ || 'N/A'
    }
    commit('ADD_MULTIPLE_BOOKING_DATA', bookingData)
  },
  resetMultipleBookingData ({ commit }) {
    commit('RESET_MULTIPLE_BOOKING_DATA')
  }
}

export const getters = {
  getBookingResponse: state => state.bookingdata,
  getMultipleBookingResponses: state => state.multipleBookingData
}
