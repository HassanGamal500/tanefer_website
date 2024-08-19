<template>
  <VuePhoneNumberInput
    v-model="initialPhone"
    outlined
    size="lg"
    default-country-code="US"
    :preferred-countries="['US', 'EG']"
    required
    :countries-height="25"
    no-flags
    class="mb-5"
    @update="assignPhone"
  >
    <!-- style="width: 100%; font-size: 16px;"
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '100%' : '80%', fontSize: $vuetify.breakpoint.mdAndUp ? '16px' : '14px' }" -->
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
      // this.$emit('update:phone', phone)
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

  .country-selector__input[data-v-46e105de] {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
  }

  .input-tel__input[data-v-e59be3b4] {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
  }
</style>
