<template>
  <div class="sidebar">
    <div class="avatar-container">
      <v-img
        src="https://www.gravatar.com/avatar?d=mp"
        class="avatar"
        @click="uploadAvatar"
      />
      <div class="username">
        {{ user ? user.username : '' }}
      </div>
    </div>
    <v-list class="sidebar-list">
      <v-list-item link to="/profile">
        <v-list-item-content>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link to="/bookingHistory">
        <v-list-item-content>
          <v-list-item-title>Booking History</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link to="/change-password">
        <v-list-item-content>
          <v-list-item-title>Change Password</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    uploadAvatar () {
      // Logic to handle avatar upload
    }
  }
}
</script>

<style scoped>
  .sidebar {
  position: absolute;
  width: 240px;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #cfbb9a;
  padding-top: 20px;
  padding-left: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.username {
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
}

.sidebar-list {
  background-color: #cfbb9a !important;
  flex-grow: 1;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
}

v-list {
  background-color: #CFB9A1 !important;
}
.sidebar-list v-list-item {
  margin-bottom: 10px;
}
</style>
