<!-- eslint-disable no-console -->
<template>
  <div>
    <h1>Booking History List</h1>
    <div v-if="historyList.length === 0">
      No booking history found.
    </div>
    <ul v-else>
      <li v-for="(history, index) in historyList" :key="index">
        <strong>Title:</strong> {{ history.title }}<br>
        <strong>Type:</strong> {{ history.type }}<br>
        <strong>Date:</strong> {{ history.date }}<br>
        <strong>Total:</strong> {{ history.total }}<br>
        <strong>Status:</strong> {{ history.status }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData ({ $axios }) {
    try {
      const response = await $axios.get('http://127.0.0.1:8000/api/v2/booking/histories')
      return {
        historyList: response.data.data.historyList
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching booking history:', error)
      return {
        historyList: []
      }
    }
  }
}
</script>
