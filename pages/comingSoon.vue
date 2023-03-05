<template>
  <div class="bgimg">
    <div class="middle">
      <h1>COMING SOON</h1>
    </div>
  </div>
</template>

<style>
.bgimg {
  background-image: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('~/assets/aswan-city.jpg');
  height: 80vh;
  background-position: center;
  background-size: cover;
  position: relative;
  color: white;
  font-family: "Courier New", Courier, monospace;
  font-size: 25px;
}
.middle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.middle h1 {
    font-size: 70px;
}
</style>
