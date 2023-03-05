<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404" class="text-center display-3">
      {{ pageNotFound }}
    </h1>
    <h1 v-else-if="error.statusCode === 500" class="text-center display-3">
      {{ pageNotFound }}
    </h1>
    <h1 v-else class="text-center display-3">
      {{ otherError }}
    </h1>
    <NuxtLink class="text-center" to="/">
      Home page
    </NuxtLink>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      serverError: 'Something went wrong',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
