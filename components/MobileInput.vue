<template>
  <VuePhoneNumberInput
    v-model="initialPhone"
    size="lg"
    default-country-code="US"
    :preferred-countries="['US', 'EG']"
    required
    :countries-height="25"
    no-flags
    class="mb-5"
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

<style>
  .input-tel.lg .input-tel__input[data-v-e59be3b4], .country-selector.lg .country-selector__input[data-v-46e105de] {
    height: 56px !important;
    border: 1.2px solid #c9c9cb;
  }
</style>
