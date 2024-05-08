<template>
  <div id="loading">
    <img class="img" :src="require(`~/assets/loading_1.gif`)" alt="loading..." width="200">
  </div>
</template>
<script>
export default {
  name: 'LoadingScreen'
}
</script>
<style>
#loading {
  position: absolute;
  z-index: 1000;
  background-color: white;
  opacity: 0.8;
  /* height: 100vh; */
  height: 100%;
  width: 100vw;
  text-align: center;
  line-height: 100vh;
}
.img {
  position: relative;
  margin: auto;
  margin-top: 30%;
}
</style>
