<template>
  <v-row dense>
    <v-col cols="4">
      <v-select
        v-model="selectedCountryCode"
        :items="countryCodes"
        item-text="label"
        item-value="code"
        label="Code"
        solo-flat
        hide-details
        dense
        class="minimal-input"
      />
    </v-col>

    <v-col cols="8">
      <v-text-field
        v-model="phoneNumber"
        label="Phone"
        solo-flat
        hide-details
        dense
        class="minimal-input"
        @blur="emitPhone"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectedCountryCode: '+1',
      phoneNumber: '',
      countryCodes: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (newValue) {
        const phoneRegex = /^(\+\d+)(\d+)$/
        const matches = newValue.match(phoneRegex)
        if (matches) {
          this.selectedCountryCode = matches[1]
          this.phoneNumber = matches[2]
        }
      }
    }
  },
  mounted () {
    this.fetchCountryCodes()
  },
  methods: {
    async fetchCountryCodes () {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all') // Fetch country codes from API
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
      const fullPhoneNumber = `${this.selectedCountryCode}${this.phoneNumber}`
      this.$emit('input', fullPhoneNumber) // Emit the combined value to the parent component
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
</style>
