<template>
  <footer>
    <div class="newsletter-bar">
      <div class="container">
        <div class="mr-0 w-form">
          <form id="email-form-3" name="email-form-3" data-name="Email Form 3">
            <div class="news-row">
              <label for="name" class="news--label">Subscribe to our newsletter</label>
              <input
                id="email-2"
                type="email"
                class="news-emai-box w-input"
                maxlength="256"
                name="email-2"
                data-name="Email 2"
                placeholder="Enter yor E-mail"
                required
              >
              <input type="submit" value="Subscribe" data-wait="Please wait..." class="news-bt w-button">
            </div>
          </form>
          <div class="w-form-done">
            <div>Thank you! Your submission has been received!</div>
          </div>
          <div class="w-form-fail">
            <div>Oops! Something went wrong while submitting the form.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-links">
      <div class="container">
        <div class="footer-row">
          <div class="footer-col">
            <img src="~/assets/images/TaNeferLogo.png" loading="lazy" alt="" class="footer-logo">
            <p class="sm-p">
              TaNefer Tours is a travel agency which has transformed the concept of traveling from a merely business perspective to a self-discovering journey, and it has acquired that goal through implementing the latest technology into creating a conceptual traveling experience, given the expertise of highly qualified and knowledgeable staff with the requirements of each traveler.
            </p>
            <div class="follow-links">
              <a href="https://www.facebook.com/TaNefer.Tours" target="_blank" class="w-inline-block"><img src="~/assets/images/faceb00k-icon.png" loading="lazy" alt=""></a>
              <a href="https://twitter.com/TaneferTours" target="_blank" class="w-inline-block"><img src="~/assets/images/twittter-icon.png" loading="lazy" alt=""></a>
              <a href="https://www.instagram.com/tanefer.tours" target="_blank" class="w-inline-block"><img src="~/assets/images/instegram-icon.png" loading="lazy" alt=""></a>
              <a href="https://www.youtube.com/channel/UCBOwPy-O-eVpIzjkz2tSJtg" target="_blank" class="w-inline-block"><img src="~/assets/images/youtube-icon.png" loading="lazy" alt=""></a>
            </div>
          </div>
          <div class="footer-col mt-2">
            <div class="foter-title">
              About TaNefer
            </div>
            <NuxtLink to="/" class="foter-link">
              Home
            </NuxtLink>
            <a href="https://blog.tanefer.com/about-tanefer/" target="_blank" class="foter-link">About</a>
            <a href="https://blog.tanefer.com/" target="_blank" class="foter-link">Blog</a>
            <a href="https://blog.tanefer.com/about-tanefer/" target="_blank" class="foter-link">
              Services
            </a>
            <NuxtLink to="/comingSoon" class="foter-link">
              FAQ
            </NuxtLink>
            <a href="https://blog.tanefer.com/privacy-policy/" target="_blank" class="foter-link">Privacy Policy</a>
            <NuxtLink to="/termsAndConditions" class="foter-link">
              Terms of Use
            </NuxtLink>
            <NuxtLink to="/contact" class="foter-link">
              Contact us
            </NuxtLink>
          </div>
          <div class="footer-col">
            <div class="foter-title">
              Book your needs
            </div>
            <a
              href="https://flights.tanefer.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="foter-link"
            >
              Flights
            </a>
            <NuxtLink to="/hotels" class="foter-link">
              Hotels
            </NuxtLink>
            <NuxtLink to="/comingSoon" class="foter-link">
              Car rentals
            </NuxtLink>
            <NuxtLink to="/cruises" class="foter-link">
              Nile cruises
            </NuxtLink>
            <NuxtLink to="/trips" class="foter-link">
              Trips
            </NuxtLink>
            <NuxtLink to="/trips" class="foter-link">
              Build your trip
            </NuxtLink>
            <NuxtLink to="/adventures" class="foter-link">
              Activities
            </NuxtLink>
            <NuxtLink to="/trips" class="foter-link">
              Experience Egypt
            </NuxtLink>
          </div>
          <div class="footer-col">
            <div class="foter-title">
              Contact
            </div>
            <div class="contact-row">
              <img src="~/assets/images/mail-icon.png" loading="lazy" alt="" class="contact-icon">
              <div>
                <a href="mailto:info@tanefer.com" class="foter-link line-normal">info@tanefer.com</a>
                <a href="mailto:online@tanefer.com" class="foter-link line-normal">online@tanefer.com</a>
              </div>
            </div>
            <div class="foter-subtitle">
              TaNefer - Egypt
            </div>
            <div class="contact-row pb-10">
              <img src="~/assets/images/location-icon.png" loading="lazy" alt="" class="contact-icon">
              <div>
                <div>75 Mosadaq St #5,<br>Giza, Egypt</div>
              </div>
            </div>
            <div class="contact-row">
              <img src="~/assets/images/phobe-icon.png" loading="lazy" alt="" class="contact-icon">
              <div>
                <a href="tel:+2033384000" class="foter-link line-normal">+20 3 3384000</a>
              </div>
            </div>
            <div class="foter-subtitle">
              TaNefer - USA
            </div>
            <div class="contact-row pb-10">
              <img src="~/assets/images/location-icon.png" loading="lazy" alt="" class="contact-icon">
              <div>
                <div>6066 Leesburg Pike Suite #430 Falls Church, VA 20141</div>
              </div>
            </div>
            <div class="contact-row">
              <img src="~/assets/images/phobe-icon.png" loading="lazy" alt="" class="contact-icon">
              <div>
                <a href="tel:+1-571-406-3055" class="foter-link line-normal">+1-571-406-3055</a>
              </div>
            </div>
          </div>
        </div>
        <div class="copyright">
          <div class="text-block-2">
            Copyright © 2020 TaNefer Inc. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      sizes: null,
      pages: [
        { text: 'Home', value: 'home' },
        { text: 'About', value: 'abot' },
        { text: 'Blog', value: 'blog' },
        { text: 'Services', value: 'services' },
        { text: 'FAQ', value: 'faq' },
        { text: 'Privacy policy', value: 'privacy' },
        { text: 'Terms of use', value: 'Terms' },
        { text: 'Contact us', value: 'contact' }
      ],
      links: [
        { text: 'Flights', value: 'flights' },
        { text: 'Hotels', value: 'hotels' },
        { text: 'Car rentals', value: 'cars' },
        { text: 'Nile cruises', value: 'nile' },
        { text: 'Trips', value: 'trips' },
        { text: 'Build your trip', value: 'build' },
        { text: 'Activties', value: 'activities' },
        { text: 'Experience Egypt', value: 'exEgypt' },
        { text: 'Experience world', value: 'exWorld' },
        { text: 'Hage & Omra', value: 'islamic' }
      ]
    }
  },
  created () {
    this.sizes = this.$vuetify.breakpoint
  }
}
</script>
