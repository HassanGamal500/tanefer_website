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
    :menu-props="{ auto: true, maxWidth: 200, overflowY: true, zIndex: 9999 }"
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
  }
}
</script>

<style scoped>
.custom-placeholder ::placeholder {
  color: black;
  opacity: 1;
}
</style>
