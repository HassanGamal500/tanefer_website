<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-autocomplete
    v-model="select"
    :items="items"
    :loading="loading"
    :search-input.sync="search"
    hide-no-data
    return-object
    outlined
    no-filter
    :menu-props="{ auto: true, maxWidth: 'auto', overflowY: true }"
    item-text="cityName"
    item-value="code"
    prepend-inner-icon="mdi-bed-king"
    color="bluish"
    :rules="$store.state.hotelSearch.destination !== null ? [true] : [v => !!v || 'Item is required']"
    class="mr-1"
    height="60"
    auto-select-first
    placeholder="Where are you going ?"
  >
    <template #item="data">
      <v-list-item-icon>
        <v-icon>{{ data.item.isHotel ? 'mdi-bed' : 'mdi-map-marker' }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ data.item.name }}</v-list-item-title>
      </v-list-item-content>
    </template>
    <template #selection="data">
      {{ data.item.name }}
    </template>
  </v-autocomplete>
</template>

<script>
import hotelsServices from '~/services/HotelsServices'

export default {
  data () {
    return {
      loading: false,
      select: null,
      search: null,
      items: [],
      firstRequest: true
    }
  },
  watch: {
    search (val) {
      val && val !== this.select && this.querySelections(val)
    },
    select (val) {
      this.$store.dispatch('setHotelDestination', val)
    }
  },
  mounted () {
    if (this.$store.state.hotelSearch.destination && this.$store.state.hotelSearch.destination.code) {
      this.search = this.$store.state.hotelSearch.destination.code.toString()
    } else {
      this.firstRequest = false
    }
  },
  methods: {
    querySelections (v) {
      this.loading = true
      if (this.firstRequest) {
        if (v) {
          hotelsServices.getCity(v).then((response) => {
            this.items.push(response.data)
            this.select = this.items[0]
            this.firstRequest = false
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.items = []
          this.select = null
        }
      } else {
        hotelsServices.getCities(v).then((response) => {
          this.items = response.data
          if (response.length === 1) { this.select = response[0] }
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>
