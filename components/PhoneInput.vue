<template>
  <v-row dense>
    <!-- Country Code Dropdown -->
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

    <!-- Phone Number Input -->
    <v-col cols="8">
      <v-text-field
        v-model="phoneNumber"
        label="Phone"
        solo-flat
        hide-details
        dense
        class="minimal-input"
        @input="updatePhone"
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
      phoneNumber: ''
    }
  },
  computed: {
    countryCodes () {
      return [
        { label: '+1 (United States/Canada)', code: '+1' },
        { label: '+7 (Russia/Kazakhstan)', code: '+7' },
        { label: '+20 (Egypt)', code: '+20' },
        { label: '+27 (South Africa)', code: '+27' },
        { label: '+30 (Greece)', code: '+30' },
        { label: '+31 (Netherlands)', code: '+31' },
        { label: '+32 (Belgium)', code: '+32' },
        { label: '+33 (France)', code: '+33' },
        { label: '+34 (Spain)', code: '+34' },
        { label: '+36 (Hungary)', code: '+36' },
        { label: '+39 (Italy)', code: '+39' },
        { label: '+40 (Romania)', code: '+40' },
        { label: '+41 (Switzerland)', code: '+41' },
        { label: '+44 (United Kingdom)', code: '+44' },
        { label: '+45 (Denmark)', code: '+45' },
        { label: '+46 (Sweden)', code: '+46' },
        { label: '+47 (Norway)', code: '+47' },
        { label: '+48 (Poland)', code: '+48' },
        { label: '+49 (Germany)', code: '+49' },
        { label: '+52 (Mexico)', code: '+52' },
        { label: '+54 (Argentina)', code: '+54' },
        { label: '+55 (Brazil)', code: '+55' },
        { label: '+56 (Chile)', code: '+56' },
        { label: '+57 (Colombia)', code: '+57' },
        { label: '+58 (Venezuela)', code: '+58' },
        { label: '+60 (Malaysia)', code: '+60' },
        { label: '+61 (Australia)', code: '+61' },
        { label: '+62 (Indonesia)', code: '+62' },
        { label: '+63 (Philippines)', code: '+63' },
        { label: '+64 (New Zealand)', code: '+64' },
        { label: '+65 (Singapore)', code: '+65' },
        { label: '+66 (Thailand)', code: '+66' },
        { label: '+81 (Japan)', code: '+81' },
        { label: '+82 (South Korea)', code: '+82' },
        { label: '+84 (Vietnam)', code: '+84' },
        { label: '+90 (Turkey)', code: '+90' },
        { label: '+91 (India)', code: '+91' },
        { label: '+92 (Pakistan)', code: '+92' },
        { label: '+93 (Afghanistan)', code: '+93' },
        { label: '+94 (Sri Lanka)', code: '+94' },
        { label: '+95 (Myanmar)', code: '+95' },
        { label: '+98 (Iran)', code: '+98' },
        { label: '+212 (Morocco)', code: '+212' },
        { label: '+213 (Algeria)', code: '+213' },
        { label: '+216 (Tunisia)', code: '+216' },
        { label: '+218 (Libya)', code: '+218' },
        { label: '+220 (Gambia)', code: '+220' },
        { label: '+221 (Senegal)', code: '+221' },
        { label: '+222 (Mauritania)', code: '+222' },
        { label: '+223 (Mali)', code: '+223' },
        { label: '+224 (Guinea)', code: '+224' },
        { label: '+225 (Ivory Coast)', code: '+225' },
        { label: '+226 (Burkina Faso)', code: '+226' },
        { label: '+227 (Niger)', code: '+227' },
        { label: '+228 (Togo)', code: '+228' },
        { label: '+229 (Benin)', code: '+229' },
        { label: '+230 (Mauritius)', code: '+230' },
        { label: '+231 (Liberia)', code: '+231' },
        { label: '+232 (Sierra Leone)', code: '+232' },
        { label: '+233 (Ghana)', code: '+233' },
        { label: '+234 (Nigeria)', code: '+234' },
        { label: '+235 (Chad)', code: '+235' },
        { label: '+236 (Central African Republic)', code: '+236' },
        { label: '+237 (Cameroon)', code: '+237' },
        { label: '+238 (Cape Verde)', code: '+238' },
        { label: '+239 (Sao Tome and Principe)', code: '+239' },
        { label: '+240 (Equatorial Guinea)', code: '+240' },
        { label: '+241 (Gabon)', code: '+241' },
        { label: '+242 (Republic of the Congo)', code: '+242' },
        { label: '+243 (Democratic Republic of the Congo)', code: '+243' },
        { label: '+244 (Angola)', code: '+244' },
        { label: '+245 (Guinea-Bissau)', code: '+245' },
        { label: '+246 (Diego Garcia)', code: '+246' },
        { label: '+248 (Seychelles)', code: '+248' },
        { label: '+249 (Sudan)', code: '+249' },
        { label: '+250 (Rwanda)', code: '+250' },
        { label: '+251 (Ethiopia)', code: '+251' },
        { label: '+252 (Somalia)', code: '+252' },
        { label: '+253 (Djibouti)', code: '+253' },
        { label: '+254 (Kenya)', code: '+254' },
        { label: '+255 (Tanzania)', code: '+255' },
        { label: '+256 (Uganda)', code: '+256' },
        { label: '+257 (Burundi)', code: '+257' },
        { label: '+258 (Mozambique)', code: '+258' },
        { label: '+260 (Zambia)', code: '+260' },
        { label: '+261 (Madagascar)', code: '+261' },
        { label: '+262 (Reunion)', code: '+262' },
        { label: '+263 (Zimbabwe)', code: '+263' },
        { label: '+264 (Namibia)', code: '+264' },
        { label: '+265 (Malawi)', code: '+265' },
        { label: '+266 (Lesotho)', code: '+266' },
        { label: '+267 (Botswana)', code: '+267' },
        { label: '+268 (Eswatini)', code: '+268' },
        { label: '+269 (Comoros)', code: '+269' },
        { label: '+291 (Eritrea)', code: '+291' },
        { label: '+297 (Aruba)', code: '+297' },
        { label: '+298 (Faroe Islands)', code: '+298' },
        { label: '+299 (Greenland)', code: '+299' }
      ]
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
  methods: {
    updatePhone () {
      const fullPhone = `${this.selectedCountryCode}${this.phoneNumber}`
      this.$emit('input', fullPhone)
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
