<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        v-model="dateFormatted"
        :prepend-inner-icon="icon"
        readonly
        outlined
        :placeholder="placeholder"
        color="bluish"
        height="60"
        :class="getClass()"
        :rules="[v => !!v || 'Item is required']"
        v-on="on"
        @focus="checkDateType"
      />
    </template>
    <v-date-picker
      v-model="date"
      first-day-of-week="1"
      color="bluish"
      :min="minDate"
      :show-current="minDate"
      no-title
      :disabled="disable"
      @input="menu = false"
    />
    <p v-if="disable" class="red--text">
      {{ text }}
    </p>
  </v-menu>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['type', 'focus'],
  data () {
    return {
      date: '',
      menu: false,
      today: new Date().toISOString().substr(0, 10),
      minDate: null,
      disable: false
    }
  },
  computed: {
    dateFormatted () {
      return this.formatDate(this.date)
    },
    tomorrow () {
      const today = new Date(this.today)
      return today.toISOString().slice(0, 10)
    },
    placeholder () {
      let text
      if (this.type === 'checkIn') {
        text = 'Check In'
      } else if (this.type === 'checkOut') {
        text = 'Check Out'
      }
      return text
    },
    icon () {
      let icon
      if (this.type === 'checkIn') {
        icon = 'mdi-calendar-arrow-right'
      } else if (this.type === 'checkOut') {
        icon = 'mdi-calendar-arrow-left'
      } else { icon = 'mdi-calendar' }
      return icon
    }
  },
  watch: {
    date (value) {
      switch (this.type) {
        case 'checkIn':
          this.$store.dispatch('setDates', { data: value, type: 'checkIn' })
          break
        case 'checkOut':
          this.$store.dispatch('setDates', { data: value, type: 'checkOut' })
          break
        default:
          break
      }
    }
  },
  created () {
    switch (this.type) {
      case 'checkIn':
        this.date = this.$store.state.hotelSearch.checkInDate
        break
      case 'checkOut':
        this.date = this.$store.state.hotelSearch.checkOutDate
        break
      default:
        break
    }
  },
  methods: {
    getClass () {
      let borderClass = ''
      switch (this.type) {
        case 'checkIn':
          borderClass = 'rounded-tr-0 rounded-br-0'
          break
        case 'checkOut':
          borderClass = 'rounded-tl-0 rounded-bl-0'
          break
        default:
          break
      }
      return borderClass
    },
    formatDate (date) {
      if (!date) { return null }
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${day} ${months[month - 1]} ${year}`
    },
    checkDateType () {
      const min = (this.type === 'checkIn' || this.type === 'checkOut') ? new Date(this.$store.state.hotelSearch.checkInDate) : ''
      switch (this.type) {
        case 'checkOut':
          if (this.$store.state.hotelSearch.checkInDate === null) {
            this.date = ''
          } else {
            min.setDate(min.getDate() + 1)
            this.minDate = min.toISOString().slice(0, 10)
            this.date = this.minDate
          }
          break
        default:
          this.minDate = this.tomorrow
          break
      }
    }
  }
}
</script>
