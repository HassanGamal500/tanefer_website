<template>
  <div>
    <div class="t-container">
      <div class="booking-box">
        <hotelSearch />
      </div>
    </div>
  </div>
</template>

<script>
import hotelSearch from '~/components/hotelsComponents/HotelSearch'

export default {
  components: {
    hotelSearch
  },
  head () {
    return {
      title: 'Search For Hotels'
    }
  }
}
</script>

<style>
</style>
