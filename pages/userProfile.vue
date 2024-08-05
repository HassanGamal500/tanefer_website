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
            <input v-model="editableFields.FirstName" type="text" placeholder="First Name">
            <input v-model="editableFields.LastName" type="text" placeholder="Last Name">
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
export default {
  data () {
    return {
      isLoading: false,
      profile: {
        image: 'https://via.placeholder.com/100',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        nationality: 'American',
        phone: '+1 234 567 890',
        passportNumber: '123456789',
        passportExpiryDate: '2025-12-31',
        passportIssuingCountry: 'USA',
        title: 'Mr.'
      },
      editableFields: {
        FirstName: 'John',
        LastName: 'Doe',
        Gender: 'Male',
        Nationality: 'American',
        Phone: '+1 234 567 890',
        PassportNumber: '123456789',
        PassportExpiryDate: '2025-12-31',
        PassportIssuingCountry: 'USA',
        Title: 'Mr.'
      },
      originalFields: {}
    }
  },
  created () {
    this.originalFields = { ...this.editableFields }
  },
  methods: {
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

  .profile-page-wrapper {
    padding: 10px;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  .profile-wrapper {
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 800px; /* Increased width for larger screens */
    flex: 1; /* Ensure it takes up available space */
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
