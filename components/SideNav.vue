<template>
  <div
    id="w-nav-overlay-0"
    class="w-nav-overlay"
    data-wf-ignore=""
    style="height: 100%; display: block; width: 100%; z-index: 1001; background-color: rgba(0,0,0,0.2); top: 0;"
    @click.self="$emit('close')"
  >
    <nav
      role="navigation"
      class="nav-bar-flex w-nav-menu justify-space-between"
      data-nav-menu-open=""
      style="height: 8787.39px; transform: translateX(0px); transition: transform 400ms ease 0s;"
    >
      <div>
        <a
          href="https://flights.tanefer.com/"
          target="_blank"
          rel="noopener noreferrer"
          active-class="w--current"
          class="nav-link w-nav-link"
        >Flights</a>
        <NuxtLink to="/hotels" exact active-class="w--current" class="nav-link w-nav-link">
          Hotels
        </NuxtLink>
        <NuxtLink to="/cruises" exact active-class="w--current" class="nav-link w-nav-link">
          Nile cruises
        </NuxtLink>
        <NuxtLink to="/trips" exact active-class="w--current" class="nav-link w-inline-block">
          <div class="hot">
            <div>Pick & Custom your trip</div>
            <div class="hot-pointer" />
            <div class="hot-lable">
              HOT
            </div>
          </div>
        </NuxtLink>
        <NuxtLink to="/adventures" exact active-class="w--current" class="nav-link w-nav-link">
          Adventures
        </NuxtLink>
        <a
          href="https://tanefer.com/blog/"
          rel="noopener noreferrer"
          active-class="w--current"
          class="nav-link w-nav-link"
        >Blogs</a>
      </div>
    </nav>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>
