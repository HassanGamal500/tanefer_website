<template>
  <div>
    <div class="t-container">
      <cities-slider module="adventures" />
    </div>
  </div>
</template>

<script>
import adventureServices from '~/services/activitiesServies'

export default {
  data () {
    return {
      metaData: {
        page_name: null,
        seo_title: null,
        seo_description: null,
        featured_image: null,
        slug: null
      }
    }
  },
  head () {
    return {
      // title: 'Egypt Adventures'
      title: this.metaData.seo_title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaData.seo_description
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.metaData.seo_title
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.metaData.seo_description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.metaData.featured_image
        }
      ]
    }
  },
  async created () {
    await this.getMetaData()
  },
  methods: {
    async getMetaData () {
      try {
        const promise = adventureServices.getMetaData(4)
        const response = await promise
        const results = response.data
        // console.log(results)
        if (results.data) {
          this.metaData = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    }
  }
}
</script>
