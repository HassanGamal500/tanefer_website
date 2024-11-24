<template>
  <div class="phone-input-container">
    <VuePhoneNumberInput
      v-model="initialPhone"
      outlined
      default-country-code="US"
      :preferred-countries="['US', 'EG']"
      :countries-height="25"
      no-flags
      size="lg"
      class="mb-5"
      @update="assignPhone"
    >
      <template #arrow>
        <v-icon>mdi-chevron-down</v-icon>
      </template>
    </VuePhoneNumberInput>
  </div>
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

<style>
.phone-input-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.input-tel.lg .input-tel__input[data-v-e59be3b4],
.country-selector.lg .country-selector__input[data-v-46e105de] {
  height: 56px !important;
  border: 1.2px solid #c9c9cb;
  display: inline-flex;
  align-items: center;
}

.country-selector__input[data-v-46e105de] {
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
  padding: 0 10px; /* Adjust padding as needed */
}

.input-tel__input[data-v-e59be3b4] {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
  padding: 0 10px; /* Adjust padding as needed */
}
</style>
