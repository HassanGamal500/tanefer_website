<template>
  <div class="loading-spinner">
    <div class="spinner-wheel" />
  </div>
</template>

<style scoped>
.loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f7f3ef; /* Light brown background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner-wheel {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #8b5e34; /* Darker brown */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
