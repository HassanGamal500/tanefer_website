<template>
  <v-combobox
    ref="nationalityCombobox"
    v-model="selectedNationality"
    class="custom-combobox"
    label="Nationality"
    :items="countries"
    item-text="name"
    item-value="code"
    outlined
    hide-no-data
    autocomplete="off"
  />
</template>

<script>
export default {
  data () {
    return {
      selectedNationality: '',
      countries: [],
      menu: false // Used to track when the menu is opened/closed
    }
  },
  watch: {
    menu (val) {
      if (val) {
        // When the dropdown opens, adjust the position
        this.$nextTick(() => {
          this.adjustDropdownPosition()
        })
      }
    },
    selectedNationality (newVal) {
      this.$emit('nationalitySelected', newVal)
    }
  },
  async mounted () {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all')
      const data = await response.json()
      this.countries = data.map(country => ({
        name: country.name.common,
        code: country.cca2
      }))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching countries:', error)
    }
  },
  methods: {
    // Method to adjust the dropdown's position manually
    adjustDropdownPosition () {
      const combobox = this.$refs.nationalityCombobox.$el.querySelector('.v-input')
      const dropdown = this.$refs.nationalityCombobox.$el.querySelector('.v-menu__content')

      if (combobox && dropdown) {
        // Get combobox position relative to the viewport
        const comboboxRect = combobox.getBoundingClientRect()

        // Manually set the position of the dropdown based on the input field
        dropdown.style.position = 'absolute'
        dropdown.style.top = `${comboboxRect.bottom}px` // Position dropdown below input
        dropdown.style.left = '749px' // Set your desired left position
        dropdown.style.width = `${comboboxRect.width}px` // Match the dropdown width to the combobox width
        dropdown.style.maxHeight = '200px' // Limit the dropdown height
        dropdown.style.zIndex = '9999' // Ensure the dropdown is on top
      }
    },
    customFilter (item, queryText) {
      const text = item.name.toLowerCase()
      const query = queryText.toLowerCase()
      return text.startsWith(query)
    }
  }
}

</script>

<style scoped>
.v-menu__content[style] {
  position: absolute !important;
  left: 749px !important; /* Force the dropdown to left: 749px */
  top: 664px !important;  /* Ensure the dropdown stays at the desired top position */
  min-width: 188px !important;
  max-width: 166px !important;
  z-index: 9999 !important;
}

.custom-placeholder ::placeholder {
  color: black;
  opacity: 1;
}

.custom-combobox .v-menu__content {
  position: absolute !important;
  z-index: 9999 !important;
}
.custom-combobox .v-list-item {
  max-width: 100% !important; /* Ensure the list items don't exceed the dropdown width */
  white-space: nowrap !important; /* Prevent text wrapping */
  overflow: hidden !important; /* Hide overflowing text */
  text-overflow: ellipsis !important; /* Show ellipsis for overflowing text */
}

.custom-combobox .v-list-item__title {
  max-width: 100% !important; /* Ensure the title inside the list item respects the truncation */
  white-space: nowrap !important; /* Prevent title text wrapping */
  overflow: hidden !important; /* Hide overflow */
  text-overflow: ellipsis !important; /* Show ellipsis for long text */
}

.custom-combobox .v-text-field {
  font-size: 14px !important;
}

</style>
