<template>
  <span :class="`${color}--text`">{{ formatDate(date) }}</span>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['date', 'color', 'small'],
  methods: {
    formatDate (date) {
      if (!date) { return '' }
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return this.small ? `${day} ${months[month - 1]}` : `${day} ${months[month - 1]} ${year}`
    }
  }
}
</script>
