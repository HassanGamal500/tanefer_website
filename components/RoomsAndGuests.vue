<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      bottom
      transition="scale-transition"
    >
      <template #activator="{ on }">
        <v-text-field
          v-model="label"
          outlined
          prepend-inner-icon="mdi-bed"
          color="secondary"
          height="60"
          readonly
          class="mr-1"
          v-on="on"
        />
      </template>
      <v-card max-width="600" color="white">
        <v-card-text style="max-height: 500px; overflow: auto;">
          <!-- Single Rooms Counter at the Top -->
          <div class="rooms mb-3">
            <span class="label">Rooms</span>
            <v-icon small color="white" class="minus" @click="decrease('rooms')">
              mdi-minus
            </v-icon>
            <span class="number">{{ roomsNum }}</span>
            <v-icon small color="white" class="plus" @click="increase('rooms')">
              mdi-plus
            </v-icon>
          </div>

          <!-- Room Details Section -->
          <div v-for="(room, roomIndex) in roomsNum" :key="roomIndex" class="inputs">
            <v-row class="align-center no-gutters mb-3" dense>
              <!-- Room Label -->
              <v-col cols="12" class="mb-2 d-flex align-center justify-center room-label">
                <span class="room-text">Room {{ roomIndex + 1 }}</span>
              </v-col>

              <!-- Adults Section -->
              <v-col cols="5" class="d-flex align-center justify-center">
                <div class="adults">
                  <span class="label">Adults</span>
                  <v-icon small color="white" class="minus" @click="decrease('adults', roomIndex)">
                    mdi-minus
                  </v-icon>
                  <span class="number">{{ adults[roomIndex] }}</span>
                  <v-icon small color="white" class="plus" @click="increase('adults', roomIndex)">
                    mdi-plus
                  </v-icon>
                </div>
              </v-col>

              <!-- Children Section -->
              <v-col cols="5" class="d-flex align-center justify-center">
                <div class="children">
                  <span class="label">Children</span>
                  <v-icon small color="white" class="minus" @click="decrease('children', roomIndex)">
                    mdi-minus
                  </v-icon>
                  <span class="number">{{ children[roomIndex] }}</span>
                  <v-icon small color="white" class="plus" @click="increase('children', roomIndex)">
                    mdi-plus
                  </v-icon>
                </div>
              </v-col>

              <!-- Children's Ages (Appears Only If Children Count > 0) -->
              <v-col v-if="children[roomIndex] > 0" cols="12" class="d-flex align-center justify-center mt-2">
                <v-row dense>
                  <v-col
                    v-for="(age, ageIndex) in childrenAges[roomIndex]"
                    :key="ageIndex"
                    class="d-flex align-center justify-center"
                    style="width: 80px;"
                  >
                    <span class="label">Age</span>
                    <v-icon small color="white" class="minus" @click="decrease('age', roomIndex, ageIndex)">
                      mdi-minus
                    </v-icon>
                    <span class="number">{{ age }}</span>
                    <v-icon small color="white" class="plus" @click="increase('age', roomIndex, ageIndex)">
                      mdi-plus
                    </v-icon>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: false,
      label: '1 room, 1 guest',
      roomsNum: 1,
      adults: [1],
      children: [0],
      childrenAges: [[]]
    }
  },
  methods: {
    increase (type, roomIndex, ageIndex) {
      if (type === 'rooms' && this.roomsNum < 6) {
        this.roomsNum++
        this.adults.push(1)
        this.children.push(0)
        this.childrenAges.push([])
      } else if (type === 'adults') {
        this.$set(this.adults, roomIndex, Math.min(this.adults[roomIndex] + 1, 6))
      } else if (type === 'children') {
        this.$set(this.children, roomIndex, Math.min(this.children[roomIndex] + 1, 4))
        this.$set(this.childrenAges, roomIndex, Array(this.children[roomIndex]).fill(1))
      } else if (type === 'age' && ageIndex !== undefined) {
        this.$set(this.childrenAges[roomIndex], ageIndex, Math.min(this.childrenAges[roomIndex][ageIndex] + 1, 17))
      }
      this.updateLabel()
    },
    decrease (type, roomIndex, ageIndex) {
      if (type === 'rooms' && this.roomsNum > 1) {
        this.roomsNum--
        this.adults.pop()
        this.children.pop()
        this.childrenAges.pop()
      } else if (type === 'adults') {
        this.$set(this.adults, roomIndex, Math.max(this.adults[roomIndex] - 1, 1))
      } else if (type === 'children') {
        this.$set(this.children, roomIndex, Math.max(this.children[roomIndex] - 1, 0))
        this.$set(this.childrenAges, roomIndex, Array(this.children[roomIndex]).fill(1))
      } else if (type === 'age' && ageIndex !== undefined) {
        this.$set(this.childrenAges[roomIndex], ageIndex, Math.max(this.childrenAges[roomIndex][ageIndex] - 1, 1))
      }
      this.updateLabel()
    },
    updateLabel () {
      // Calculate total guests
      const totalGuests = this.adults.reduce((sum, val) => sum + val, 0) + this.children.reduce((sum, val) => sum + val, 0)
      this.label = `${this.roomsNum} room${this.roomsNum > 1 ? 's' : ''}, ${totalGuests} guest${totalGuests > 1 ? 's' : ''}`

      // Update the guests array
      this.guests = this.adults.map((adultCount, index) => ({
        adults: adultCount,
        children: this.children[index],
        childrenAges: this.childrenAges[index] || []
      }))

      // Emit save event or dispatch store update based on route
      if (['trips-city-slug', 'roomsResults', 'cruises-city-id', 'hotels'].includes(this.$route.name)) {
        this.$emit('save', this.guests)
      } else {
        this.$store.dispatch('setHotelGuestsInfo', this.guests)
      }
    }
    // },
    // updateLabel () {
    //   const totalGuests = this.adults.reduce((sum, val) => sum + val, 0) + this.children.reduce((sum, val) => sum + val, 0)
    //   this.label = `${this.roomsNum} room${this.roomsNum > 1 ? 's' : ''}, ${totalGuests} guest${totalGuests > 1 ? 's' : ''}`
    // }
  }
}
</script>

<style scoped>
.inputs {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.rooms, .adults, .children, .age {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}
.room-label {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
}
.label {
  font-weight: bold;
  font-size: 14px;
  margin-right: 10px;
}
.number {
  width: 35px;
  text-align: center;
  background-color: #eee;
  color: #222;
  font-weight: bold;
  border-radius: 4px;
  margin: 0 5px;
}
.minus, .plus {
  background-color: #bd9468;
  width: 30px;
  text-align: center;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.minus:hover, .plus:hover {
  background-color: #5e432c;
}
</style>
