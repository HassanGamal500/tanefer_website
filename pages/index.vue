<template>
  <div>
    <div
      data-delay="5000"
      data-animation="fade"
      data-autoplay="1"
      data-duration="500"
      data-infinite="1"
      class="home-slider w-slider"
    >
      <div class="w-slider-mask">
        <div class="slide-world w-slide">
          <div class="slidr-txt">
            <div class="t-container">
              <div class="rotator-big-titl">
                Experience
              </div>
              <div class="rotator-title">
                The worLd
              </div>
            </div>
          </div>
        </div>
        <div class="slide-enjoy w-slide">
          <div class="slidr-txt">
            <div class="t-container">
              <div class="rotator-big-titl">
                Enjoy
              </div>
              <div class="rotator-title">
                Life transforming trips
              </div>
            </div>
          </div>
        </div>
        <div class="slide-trip w-slide">
          <div class="slidr-txt">
            <div class="t-container">
              <div class="rotator-big-titl">
                Build
              </div>
              <div class="rotator-title">
                Your own trip
              </div>
            </div>
          </div>
        </div>
        <div class="slide-egypt w-slide">
          <div class="slidr-txt">
            <div class="t-container">
              <div class="rotator-big-titl">
                Discover
              </div>
              <div class="rotator-title">
                Ancient Egypt
              </div>
            </div>
          </div>
        </div>
        <div class="slide-adventure w-slide">
          <div class="slidr-txt">
            <div class="t-container">
              <div class="rotator-big-titl">
                Live
              </div>
              <div class="rotator-title">
                The adventure
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="left-arrow w-slider-arrow-left">
        <div class="w-icon-slider-left" />
      </div>
      <div class="right-arrow w-slider-arrow-right">
        <div class="w-icon-slider-right" />
      </div>
      <div class="slide-nav w-slider-nav w-round" />
      <div class="white-bar">
        <img
          style="z-index: 9;"
          src="~/assets/images/white-bar.png"
          loading="lazy"
          sizes="(max-width: 1919px) 100vw, 1920px"
          alt=""
        >
      </div>
    </div>

    <div class="home-warpere">
      <section class="why-section">
        <div class="t-container">
          <div class="why-row">
            <div data-w-id="706eef3a-fc19-46a3-9c55-99922092b928" class="why-col">
              <h1 class="home-h1">
                Why<br>TaNefer
              </h1>
              <p class="ex-p">
                We promise you a life-changing experience!
              </p>
              <p class="light-p">
                TaNefer Tours, is a Full -Service Travel Agency which has transformed the concept of merely traveling for leisure or business to a self-discovering journey. We have achieved this goal through combination of the latest technology and highly qualified Experts in the Industry to create a conceptual traveling experience that is unmatched.
              </p>
              <div class="why-points">
                <div class="point-cell">
                  <img src="~/assets/images/why-arrow.jpg.png" loading="lazy" alt="" class="why-arrow">
                  <div>Best prices</div>
                </div>
                <div class="point-cell">
                  <img src="~/assets/images/why-arrow.jpg.png" loading="lazy" alt="" class="why-arrow">
                  <div>Emergency services</div>
                </div>
                <div class="point-cell">
                  <img src="~/assets/images/why-arrow.jpg.png" loading="lazy" alt="" class="why-arrow">
                  <div>Tourist Guide.</div>
                </div>
                <div class="point-cell">
                  <img src="~/assets/images/why-arrow.jpg.png" loading="lazy" alt="" class="why-arrow">
                  <div>Travel insurance</div>
                </div>
              </div>
            </div>
            <div class="why-col">
              <div class="why-img-box">
                <div data-w-id="050f766b-7229-f5d0-444a-41e142c44d48" class="why-img-1">
                  <img src="~/assets/images/why-img-1.jpg" loading="lazy" alt="">
                </div>
                <div data-w-id="13d734be-7563-c5b1-f631-1cfa13c5c84f" class="why-img-2">
                  <img src="~/assets/images/why-img-3.jpg" loading="lazy" alt="">
                </div>
              </div>
            </div>
          </div>
          <div class="service-row-home">
            <div data-w-id="3d3ee02d-27e7-a39c-2d17-ddcacbcacaa2" class="service-booking-col">
              <div class="service-booking-block">
                <a
                  href="https://flights.tanefer.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="_w-100 w-inline-block"
                >
                  <img src="~/assets/images/flight-home.jpg" loading="lazy" alt="" class="_w-100">
                  <div class="mooking-name">
                    Flights
                  </div>
                </a>
              </div>
            </div>
            <div data-w-id="d87fa395-cdf0-77fb-7bc4-238a0c4c252d" class="service-booking-col">
              <div class="service-booking-block move-down-50">
                <NuxtLink to="/comingSoon" class="_w-100 w-inline-block">
                  <img src="~/assets/images/hotel-home.jpg" loading="lazy" alt="" class="_w-100">
                  <div class="mooking-name">
                    Hotels
                  </div>
                </NuxtLink>
              </div>
            </div>

            <div data-w-id="58f60d92-5c3e-c4a6-5c41-1070a31385b9" class="service-booking-col">
              <div class="service-booking-block move-down-30">
                <NuxtLink to="/trips" class="_w-100 w-inline-block">
                  <img src="~/assets/images/trip-home.jpg" loading="lazy" alt="" class="_w-100">
                  <div class="mooking-name">
                    Trips
                  </div>
                </NuxtLink>
              </div>
            </div>
            <div data-w-id="b71848a2-61d7-ffb3-9cb5-d904a243f0de" class="service-booking-col cruise-col">
              <div class="service-booking-block cruise-col-bloc">
                <NuxtLink to="/cruises" class="_w-100 w-inline-block">
                  <img src="~/assets/images/cruise-home.jpg" loading="lazy" alt="" class="_w-100 cruise-col-img">
                  <div class="mooking-name">
                    Nile cruises
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="build-section">
        <div class="t-container">
          <div class="build-row">
            <div data-w-id="ecdbbc6f-f2d5-04c0-c8e1-f001c7cd64c6" class="build-txt-block">
              <h2 class="home-section-title">
                Build your own trip based on your personal preferences
              </h2>
              <p class="light-p paddinf-bt-100">
                Build and customize your trip as you wish, choose your destination, accommodation and trip duration, add a flight or rent a car or use TaNefer buses , select attractions you want to visit and activities you want to practice , share your trip with your friends and invite them to join you
              </p>
              <div class="align-last">
                <NuxtLink to="/trips" class="min-bt">
                  Build your trip now
                </NuxtLink>
              </div>
            </div>
            <div class="build-stps">
              <div class="build-stps-row">
                <div data-w-id="493728f5-c7f4-b485-4b14-cb7ff790f454" class="build-step-col">
                  <div>
                    <img src="~/assets/images/build-choose.jpg" loading="lazy" alt="">
                    <div class="built-stipt-tst-block">
                      <div class="before-titel" />
                      <div>
                        <div class="build-stp-title">
                          Choose Destination
                        </div>
                        <div>Choose a city and accommodation</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <img src="~/assets/images/build-transport.jpg" loading="lazy" alt="">
                    <div class="built-stipt-tst-block">
                      <div class="before-titel" />
                      <div>
                        <div class="build-stp-title">
                          Add Transportation
                        </div>
                        <div>Select your transportation , flight ,car, bus</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-w-id="6ca5b140-2a50-dd8f-7f7c-31fb86424e4a" class="build-step-col move-down-40">
                  <div>
                    <img src="~/assets/images/build-plan.jpg" loading="lazy" alt="">
                    <div class="built-stipt-tst-block">
                      <div class="before-titel" />
                      <div>
                        <div class="build-stp-title">
                          Plan your trip
                        </div>
                        <div>Plan to visit attractions and activities</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <img src="~/assets/images/build-share.jpg" loading="lazy" alt="">
                    <div class="built-stipt-tst-block">
                      <div class="before-titel" />
                      <div>
                        <div class="build-stp-title">
                          Share
                        </div>
                        <div>Share your trip with your friends</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="egypt-section">
        <div class="t-container">
          <div class="egypt-row">
            <div class="egypt-pic">
              <div class="img-pic-50-vw">
                <img
                  src="~/assets/images/egypt-bg.jpg"
                  loading="lazy"
                  sizes="(max-width: 939px) 100vw, 939px"
                  alt=""
                  class="image-img-home"
                >
              </div>
            </div>
            <div class="egypt-col-1" />
            <div data-w-id="a795ec0a-c388-ea10-9488-bb79095af510" class="egypt-txt">
              <h2 class="home-section-title">
                Experience Egypt with TaNefer tours
              </h2>
              <p class="light-p paddinf-bt-100">
                Experience land of Egypt, where pharos built their mystic and progressive civilization, leaving us with abundant evident of their unceasing treasures, inducing historians and scientists to unravel more of its riches, and for nations to yet be amused with the most renown civilization in history. It is the land of all diversity and fulfilled wishes, the bigger the traveller enthusiasm to discover, the more this land will unravel of life pleasures and well preserved heritage for it combines all the exquisite pleasures of superb beaches from the Mediterranean to the Red Sea. For it is the most sought after destination for divers to discover the rare coral reefs, enjoyed at the luxurious resorts and hotels, along with wind surfing and many more water sports and amusements. Golf enthusiasts can easily find their promised favorite areas that are only available at TaNefer
              </p>
              <div class="align-last">
                <NuxtLink to="/trips" class="min-bt">
                  Experience Egypt now
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="home-destinations-section">
        <div class="t-container">
          <h2 class="home-section-title">
            Egypt Top <br>Destinations
          </h2>
          <div class="home-destination-row">
            <div data-w-id="57bd60fc-9a04-c484-ce8e-3ec40109f331" class="home-destination-col">
              <NuxtLink to="/trips/Cairo">
                <div class="home-destination-block" @click="goTo('Cairo')">
                  <!-- <a href="#" class="w-inline-block"> -->
                  <div class="home-destnation-name">
                    Cairo
                  </div><img src="~/assets/images/top-cairo.jpg" loading="lazy" alt="">
                  <!-- </a> -->
                </div>
              </NuxtLink>
              <NuxtLink to="/trips/Alexandria">
                <div class="home-destination-block" @click="goTo('Alexandria')">
                  <!-- <a href="#" class="w-inline-block"> -->
                  <div class="home-destnation-name">
                    Alexandria
                  </div><img src="~/assets/images/top-alexandria.jpg" loading="lazy" alt="">
                  <!-- </a> -->
                </div>
              </NuxtLink>
            </div>
            <div data-w-id="f22bf16c-9df9-1515-ea52-e6b48db9b33a" class="home-destination-col mov-up-30">
              <NuxtLink to="/trips/Luxor">
                <div class="home-destination-block" @click="goTo('Luxor')">
                  <!-- <a href="#" class="w-inline-block"> -->
                  <div class="home-destnation-name">
                    Luxor
                  </div><img src="~/assets/images/top-luxor.jpg" loading="lazy" alt="">
                  <!-- </a> -->
                </div>
              </NuxtLink>
              <NuxtLink to="/trips/Aswan">
                <div class="home-destination-block" @click="goTo('Aswan')">
                  <!-- <a href="#" class="w-inline-block"> -->
                  <div class="home-destnation-name">
                    Aswan
                  </div><img src="~/assets/images/top-aswan.jpg" loading="lazy" alt="">
                  <!-- </a> -->
                </div>
              </NuxtLink>
            </div>
            <div data-w-id="49ca733f-64d1-d003-050a-dc5d4280e889" class="home-destination-col mov-up-60">
              <NuxtLink to="/trips/Hurghada">
                <div class="home-destination-block" @click="goTo('Hurghada')">
                  <!-- <a href="#" class="w-inline-block"> -->
                  <div class="home-destnation-name">
                    Hurghada
                  </div><img src="~/assets/images/top-hurgada.jpg" loading="lazy" alt="">
                  <!-- </a> -->
                </div>
              </NuxtLink>
              <NuxtLink to="/trips/Sharm El Sheikh">
                <div class="home-destination-block" @click="goTo('Sharm El Sheikh')">
                  <!-- <a href="#" class="w-inline-block"> -->
                  <div class="home-destnation-name">
                    Sharm El-Shaikh
                  </div><img src="~/assets/images/top-sharm.jpg" loading="lazy" alt="">
                  <!-- </a> -->
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <section class="home-activity-section">
        <div class="t-container">
          <div class="home-activite-row">
            <div class="home-activity-col">
              <h2 data-w-id="c9384af2-73e5-7e1e-b994-25c20e865d0b" class="home-section-title">
                Discover best<br>activities in Egypt.
              </h2>
              <p data-w-id="ff66ecee-d74d-4275-90c1-ada95644a9a2" class="ex-p">
                We promise you a life-changing experience!
              </p>
              <p data-w-id="234cde28-b5ee-239e-29ad-0ceff28bad2a" class="light-p paddinf-bt-50">
                TaNefer allows you to discover different varieties of activities like:<br>hiking, diving, snorkeling, climbing , surfing , windsurfing~. and more.<br><br>With Tanefer you can search and find all activities in your city or at your destination.
              </p>
              <h3 data-w-id="ddcc53af-129b-9d65-89cf-dfb32aa3984f" class="home-section-h3">
                Popular activities
              </h3>
              <div data-w-id="cf8243ab-b005-af97-556a-3edc038b1721" class="p-activite-row">
                <div class="p-actvite-col">
                  <a href="#" class="w-inline-block"><img src="~/assets/images/winsurfing-icon.png" loading="lazy" alt="">
                    <div class="p-activite-name">Windsurfing</div>
                  </a>
                </div>
                <div class="p-actvite-col">
                  <a href="#" class="w-inline-block"><img src="~/assets/images/Hiking-icon.png" loading="lazy" alt="">
                    <div class="p-activite-name">Hiking</div>
                  </a>
                </div>
                <div class="p-actvite-col">
                  <a href="#" class="w-inline-block"><img src="~/assets/images/snorkeling-icon.png" loading="lazy" alt="">
                    <div class="p-activite-name">Snorkeling</div>
                  </a>
                </div>
                <div class="p-actvite-col">
                  <a href="#" class="w-inline-block"><img src="~/assets/images/Climbing-icon.png" loading="lazy" alt="">
                    <div class="p-activite-name">Climbing</div>
                  </a>
                </div>
                <div class="p-actvite-col">
                  <a href="#" class="w-inline-block"><img src="~/assets/images/diving-icon.png" loading="lazy" alt="">
                    <div class="p-activite-name">Diving</div>
                  </a>
                </div>
                <div class="p-actvite-col">
                  <a href="#" class="w-inline-block"><img src="~/assets/images/surfing-icon.png" loading="lazy" alt="">
                    <div class="p-activite-name">Surfing</div>
                  </a>
                </div>
              </div>
              <div data-w-id="f7cae52d-f7a6-0cdf-ce94-9a95519c9e03" class="align-last">
                <NuxtLink to="/adventures" class="min-bt">
                  View all activities
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="blog-sectio">
        <div class="t-container">
          <h2 data-w-id="c8d7d3c8-2eba-017b-6dce-0ea0239bba27" class="home-section-title home-blog-title">
            Latest stories
          </h2>
          <p data-w-id="dd42bd95-1907-180d-e2bc-80edfa9a6efa" class="home-plog-p">
            One inspiring story is worth traveling. Discover more about tradition and history. Read the stories that make you want to travel.
          </p>
          <div class="home-blog-row">
            <div v-for="post in posts.slice(0, 3)" :key="post.post_date_gmt" class="blog-col">
              <a :href="post.articleUrl" class="w-inline-block">
                <img :src="post.featuredImg" loading="lazy" alt="">
                <div class="home-post-date">{{ post.post_date }}</div>
                <div class="home-post-title">{{ post.post_title }}</div>
              </a>
            </div>
            <!-- <div data-w-id="fd0c4ff5-5379-8fdd-3742-293a91eba6d0" class="blog-col">
              <a href="https://tanefer.com/blog/egypt-the-first-state-ever/" class="w-inline-block">
                <img src="~/assets/images/post1.jpg" loading="lazy" alt="">
                <div class="home-post-date">April 26, 2019</div>
                <div class="home-post-title">Egypt the First State Ever</div>
              </a>
            </div>
            <div data-w-id="2d18928f-b95f-1c14-d608-02bcf415b54f" class="blog-col">
              <a href="https://tanefer.com/blog/egyptian-empire/" class="w-inline-block"><img src="~/assets/images/post3.jpg" loading="lazy" alt="">
                <div class="home-post-date">May 13, 2019</div>
                <div class="home-post-title">Egyptian Empire</div>
              </a>
            </div>
            <div data-w-id="c8cb3511-f607-c19c-6f16-0cc1af296bdb" class="blog-col">
              <a href="https://tanefer.com/blog/hellenistic-egypt/" class="w-inline-block"><img src="~/assets/images/post2.jpg" loading="lazy" alt="">
                <div class="home-post-date">June 22, 2019</div>
                <div class="home-post-title">Hellenistic Egypt</div>
              </a>
            </div> -->
          </div>
          <div data-w-id="ccf02149-becd-9829-4099-aa99d46b54e9" class="align-center">
            <a href="https://tanefer.com/blog/about-tanefer/" class="min-bt">Read more stories</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// import { allCities, headersNoAuth } from '../links'
import adventureServices from '~/services/activitiesServies'

export default {
  data () {
    return {
      sizes: null,
      currentTab: 'flights',
      cities: [],
      metaData: {
        page_name: null,
        seo_title: null,
        seo_description: null,
        featured_image: null,
        slug: null
      },
      posts: []
    }
  },
  head () {
    return {
      // title: 'Experience Egypt'
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
    this.sizes = this.$vuetify.breakpoint
    await this.getMetaData()
    await this.getPosts()
  },
  methods: {
    async getMetaData () {
      try {
        const promise = adventureServices.getMetaData(3)
        const response = await promise
        const results = response.data
        // console.log(results)
        if (results.data) {
          this.metaData = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    },
    async getPosts () {
      try {
        const promise = adventureServices.getPostsBlog()
        const response = await promise
        const results = response.data
        // console.log(results)
        if (results.data) {
          this.posts = results.data
        }
      } catch (error) {
        this.loaded = false
      }
    }
  }
}
</script>

<style scoped>
.trips {
  background-image: url('~assets/images/tour.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 100% 50%;
  width: 100%;
  margin: 50px 0;
}
</style>
