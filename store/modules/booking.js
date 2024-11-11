// store/modules/booking.js

export const namespaced = true
export const state = () => ({
  bookingdata: {}
})

export const mutations = {
  SET_BOOKING_data (state, data) {
    state.bookingdata = data
  }
}

// export const actions = {
//   setBookingdata ({ commit }, data) {
//     commit('SET_BOOKING_data', data)
//   }
// }
export const actions = {
  setBookingResponse ({ commit }, data) {
    const bookingData = {
      hotelName: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.HotelContent?.HotelName || 'N/A',
      hotelCategory: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.HotelContent?.HotelCategory?._ || 'N/A',
      address: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelContent?.Address?.Address || 'N/A',
      totalPrice: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.Prices?.Price?.TotalFixAmounts?.Nett || 'N/A',
      board: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.Board?._ || 'N/A',
      roomType: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.PriceInformation?.HotelRooms?.HotelRoom?.Name || 'N/A',
      cancellationPolicy: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.CancellationPolicy?.Description || 'N/A',
      comments: data?.Results?.HotelResult?.HotelOptions?.HotelOption?.OptionalElements?.Comments?.Comment?._ || 'N/A'
    }
    commit('SET_BOOKING_data', bookingData)
  }
}

export const getters = {
  getBookingResponse: state => state.bookingdata
}
