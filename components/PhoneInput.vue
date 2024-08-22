<template>
  <v-row dense class="phone-input">
    <v-col cols="5">
      <v-select
        v-model="selectedCountryCode"
        :items="filteredCountryCodes"
        item-text="label"
        item-value="code"
        label="Code"
        solo-flat
        hide-details
        dense
        class="minimal-input"
        :search-input.sync="searchQuery"
        @change="emitPhone"
      />
    </v-col>

    <v-col cols="7">
      <v-text-field
        v-model="phoneNumber"
        label="Phone"
        solo-flat
        hide-details
        dense
        class="minimal-input"
        @input="emitPhone"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    countryCode: {
      type: String,
      default: '+1'
    },
    phoneNumberValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectedCountryCode: this.countryCode,
      phoneNumber: this.phoneNumberValue,
      countryCodes: [],
      searchQuery: '' // Used for filtering the country codes
    }
  },
  computed: {
    filteredCountryCodes () {
      if (!this.searchQuery) { return this.countryCodes }
      const query = this.searchQuery.toLowerCase()
      return this.countryCodes.filter(country =>
        country.label.toLowerCase().startsWith(query) // Filter countries based on the search query
      )
    }
  },
  watch: {
    phoneNumberValue: {
      immediate: true,
      handler (newValue) {
        this.phoneNumber = newValue
      }
    },
    countryCode: {
      immediate: true,
      handler (newCode) {
        this.selectedCountryCode = newCode
      }
    }
  },
  mounted () {
    this.fetchCountryCodes()
  },
  methods: {
    async fetchCountryCodes () {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all')
        const countries = await response.json()
        this.countryCodes = countries.map(country => ({
          label: `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''} (${country.name.common})`,
          code: `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''}`
        }))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching country codes:', error)
      }
    },
    emitPhone () {
      this.$emit('update-country-code', this.selectedCountryCode)
      this.$emit('update-phone-number', this.phoneNumber)
    }
  }
}
</script>

<style scoped>
.minimal-input .v-input__control {
  background-color: white !important;
  border-bottom: 1px solid black !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

.minimal-input .v-input__slot {
  padding: 0;
}

.minimal-input .v-label {
  color: black !important;
}

.minimal-input .v-text-field__details {
  display: none;
}

.phone-input {
  padding-top: 18px;
}
</style>
