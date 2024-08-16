<template>
  <VuePhoneNumberInput
    v-model="initialPhone"
    default-country-code="US"
    :preferred-countries="['US', 'EG']"
    :countries-height="25"
    no-flags
    class="phone-number-input"
    @update="assignPhone"
  >
    <template #arrow>
      <v-icon>mdi-chevron-down</v-icon>
    </template>
  </VuePhoneNumberInput>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'

export default {
  components: {
    VuePhoneNumberInput
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['phone'],
  data () {
    return {
      initialPhone: ''
    }
  },
  mounted () {
    if (this.phone) { this.initialPhone = this.phone }
  },
  methods: {
    assignPhone (phone) {
      this.$emit('update', phone)
    }
  }
}
</script>

  <style scoped>
  .phone-number-input .input-tel__input {
    border: none !important;
    border-bottom: 2px solid #c9c9cb !important;
    border-radius: 0 !important;
    height: auto !important;
  }

  .phone-number-input .input-tel__input:focus {
    border-bottom: 2px solid #007bff !important;
  }

  .phone-number-input .country-selector__input {
    border: none !important;
    border-bottom: 2px solid #c9c9cb !important;
    border-radius: 0 !important;
  }

  .phone-number-input .country-selector__input:focus {
    border-bottom: 2px solid #007bff !important;
  }
  </style>
