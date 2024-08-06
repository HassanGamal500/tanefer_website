<template>
  <div class="profile-page-wrapper">
    <LoadingScreen v-if="isLoading" />
    <div class="profile-page-wrapper">
      <div class="profile-wrapper">
        <div class="profile-header">
          <img :src="profile.image" alt="Profile Picture" class="profile-pic">
          <div class="basic-info">
            <h2>{{ editableFields.Title }} {{ editableFields.FirstName }} {{ editableFields.LastName }}</h2>
          </div>
        </div>
        <div class="profile-info">
          <div class="info-row">
            <input v-model="editableFields.Title" type="text" placeholder="Title">
            <input v-model="editableFields.UserName" type="text" placeholder="User name">
            <input v-model="editableFields.Email" type="text" placeholder="Email">
          </div>
          <div class="info-row">
            <input v-model="editableFields.Gender" type="text" placeholder="Gender">
            <input v-model="editableFields.Nationality" type="text" placeholder="Nationality">
            <input v-model="editableFields.Phone" type="text" placeholder="Phone">
          </div>
          <div class="info-row">
            <input v-model="editableFields.PassportNumber" type="text" placeholder="Passport Number">
            <input v-model="editableFields.PassportExpiryDate" type="text" placeholder="Passport Expiry Date">
            <input v-model="editableFields.PassportIssuingCountry" type="text" placeholder="Passport Issuing Country">
          </div>
        </div>
        <div class="buttons btn-block btn-large">
          <button @click="saveProfile">
            Update Traveller Details
          </button>
        </div>
        <div class="reservation-history">
          <h3>Reservation History</h3>
          <div class="empty-card">
            <!-- Reservation history will be added here -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clientAPI from '../services/axiosConfig'

export default {
  data () {
    return {
      isLoading: true,
      profile: {
        image: 'https://via.placeholder.com/100',
        firstName: '',
        lastName: '',
        gender: '',
        nationality: '',
        phone: '',
        passportNumber: '',
        passportExpiryDate: '',
        passportIssuingCountry: '',
        title: '',
        username: '',
        email: ''
      },
      editableFields: {
        FirstName: '',
        LastName: '',
        Gender: '',
        Nationality: '',
        Phone: '',
        PassportNumber: '',
        PassportExpiryDate: '',
        PassportIssuingCountry: '',
        Title: '',
        UserName: '',
        Email: ''
      },
      originalFields: {}
    }
  },
  created () {
    this.fetchProfile()
  },
  methods: {
    async fetchProfile () {
      try {
        const token = localStorage.getItem('authToken')
        alert(token)
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await clientAPI('http://localhost:8000/api/v2/auth').get('/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.status) {
          const profileData = response.data.data

          this.profile = {
            ...this.profile,
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            gender: profileData.gender || '',
            nationality: profileData.nationality || '',
            phone: profileData.phone || '',
            passportNumber: profileData.passportNumber || '',
            passportExpiryDate: profileData.passportExpiryDate || '',
            passportIssuingCountry: profileData.passportIssuingCountry || '',
            title: profileData.title || '',
            username: profileData.username || '',
            email: profileData.email || ''
          }

          this.editableFields = {
            FirstName: profileData.firstName || '',
            LastName: profileData.lastName || '',
            Gender: profileData.gender || '',
            Nationality: profileData.nationality || '',
            Phone: profileData.phone || '',
            PassportNumber: profileData.passportNumber || '',
            PassportExpiryDate: profileData.passportExpiryDate || '',
            PassportIssuingCountry: profileData.passportIssuingCountry || '',
            Title: profileData.title || '',
            UserName: profileData.username || '',
            Email: profileData.email || ''
          }

          this.originalFields = { ...this.editableFields }
        }
      } catch (error) {
        alert('Error fetching profile:', error)
      } finally {
        this.isLoading = false
      }
    },
    saveProfile () {
      this.profile = { ...this.editableFields }
      this.originalFields = { ...this.editableFields }
      alert('Profile saved successfully!')
    },
    cancelEdit () {
      this.editableFields = { ...this.originalFields }
    }
  }
}
</script>
<style scoped>
/* .profile-page-wrapper {
  background-color: #CFB9A1;
  min-height: 100vh;
  padding: 10px;
} */
.profile-wrapper {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
}
.basic-info {
  flex: 1;
}
.basic-info h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.4;
}
.profile-info {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}
.info-row input {
  flex: 1 1 calc(50% - 10px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  font-size: 14px;
  color: #333;
}
.info-row input::placeholder {
  color: #aaa;
}
.buttons {
  text-align: center;
  margin-bottom: 20px;
}
.buttons button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #16404F;
  color: #fff;
  font-size: 16px;
}
.buttons button:hover {
  color: black;
  background-color: #A1C2CF;
}
.reservation-history {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.reservation-history h3 {
  margin-bottom: 10px;
}
.empty-card {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  color: #888;
}
/* Responsive Styles */
@media (max-width: 768px) {
  .info-row input {
    flex: 1 1 100%;
  }
}
</style>
