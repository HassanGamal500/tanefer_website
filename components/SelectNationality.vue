<template>
  <v-autocomplete
    v-model="selectedNationality"
    class="custom-placeholder"
    label="Nationality"
    :items="countries"
    item-text="name"
    item-value="code"
    outlined
    hide-no-data
    autocomplete="off"
    :menu-props="{ auto: true, minWidth: 150, maxWidth: 150, left: true, zIndex: 9999 }"
    :filter="customFilter"
  />
</template>

<script>
export default {
  data () {
    return {
      selectedNationality: '',
      countries: []
    }
  },
  watch: {
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
    customFilter (item, queryText) {
      const text = item.name.toLowerCase()
      const query = queryText.toLowerCase()
      return text.startsWith(query)
    }
  }
}
</script>

<style scoped>
.custom-placeholder ::placeholder {
  color: black;
  opacity: 1;
}

::v-deep div.v-menu__content.theme--light.v-menu__content--auto.menuable__content__active.v-autocomplete__content {
  left: 600px !important;
}
</style>
