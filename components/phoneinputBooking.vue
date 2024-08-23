<template>
  <v-row dense>
    <v-col cols="6">
      <v-select
        v-model="selectedCountryCode"
        :items="filteredCountryCodes"
        item-text="label"
        item-value="dial_code"
        label="Code"
        outlined
        dense
        hide-details
        class="minimal-input"
        @menu="focusSearch"
        @change="emitPhone"
      >
        <template #prepend-item>
          <v-text-field
            ref="searchInput"
            v-model="searchQuery"
            label="Search country"
            dense
            solo
            hide-details
            @input="filterCountries"
          />
        </template>
      </v-select>
    </v-col>

    <v-col cols="6">
      <v-text-field
        v-model="phoneNumber"
        label="Phone"
        outlined
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
      filteredCountryCodes: [],
      searchQuery: ''
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
    this.loadCountryCodes()
  },
  methods: {
    loadCountryCodes () {
      const countries = require('~/assets/CountryCodes.json')
      this.countryCodes = countries.map(country => ({
        label: `${country.dial_code} (${country.name})`,
        dial_code: country.dial_code,
        name: country.name
      }))

      this.filteredCountryCodes = this.countryCodes
    },
    filterCountries () {
      const query = this.searchQuery.toLowerCase()
      if (query) {
        this.filteredCountryCodes = this.countryCodes.filter(country =>
          country.name.toLowerCase().startsWith(query)
        )
      } else {
        this.filteredCountryCodes = this.countryCodes
      }
    },

    focusSearch () {
      this.$nextTick(() => {
        this.$refs.searchInput.focus()
      })
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
  border: 1px solid #ccc !important; /* Adds the border around the input */
  border-radius: 8px !important; /* Adds border radius for rounded corners */
  box-shadow: none !important;
}

.minimal-input .v-input__slot {
  padding: 8px 12px !important; /* Adds padding for better spacing */
}

.minimal-input .v-label {
  color: black !important;
}

.minimal-input .v-text-field__details {
  display: none;
}
</style>
