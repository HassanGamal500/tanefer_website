<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :close-on-click="true"
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
      <v-card max-height="500" color="white">
        <v-card-text style="max-height: 500px; overflow: auto;">
          <div v-for="n in roomsNum" :key="n" class="inputs">
            <v-row>
              <v-col cols="12" sm="6" class="p-5 my-0">
                <div v-if="n === 1" class="rooms my-4">
                  <span class="label">Rooms</span>
                  <span class="minus" @click="decrease('rooms')"><v-icon color="white" small>mdi-minus</v-icon></span>
                  <span id="room" class="number">1</span>
                  <span class="plus" @click="increase('rooms')"><v-icon color="white" small>mdi-plus</v-icon></span>
                </div>
                <div v-else class="room-text">
                  Room {{ n }}
                </div>
                <div class="adults my-4">
                  <span class="label">Adults</span>
                  <span class="minus" @click="decrease('adults', n)"><v-icon color="white" small>mdi-minus</v-icon></span>
                  <span :id="`adult${n}`" class="number">1</span>
                  <span class="plus" @click="increase('adults', n)"><v-icon color="white" small>mdi-plus</v-icon></span>
                </div>
                <div class="children my-4">
                  <span class="label">Children</span>
                  <span class="minus" @click="decrease('children', n)"><v-icon color="white" small>mdi-minus</v-icon></span>
                  <span :id="`child${n}`" class="number">0</span>
                  <span class="plus" @click="increase('children', n)"><v-icon color="white" small>mdi-plus</v-icon></span>
                </div>
                <div :id="`ages${n}`" class="ages my-4">
                  <div v-if="n === 1" class="age">
                    <div v-for="i in childrenNumber1" :key="i" class="age">
                      <span class="minus" @click="decrease('age', n, i)"><v-icon color="white" small>mdi-minus</v-icon></span>
                      <span :id="`age${i}`" class="number">1</span>
                      <span class="plus" @click="increase('age', n, i)"><v-icon color="white" small>mdi-plus</v-icon></span>
                    </div>
                  </div>
                  <div v-if="n === 2" class="age">
                    <div v-for="i in childrenNumber2" :key="i" class="age">
                      <span class="minus" @click="decrease('age', n, i)"><v-icon color="white" small>mdi-minus</v-icon></span>
                      <span :id="`age${i + childrenNumber1}`" class="number">1</span>
                      <span class="plus" @click="increase('age', n, i)"><v-icon color="white" small>mdi-plus</v-icon></span>
                    </div>
                  </div>
                  <div v-if="n === 3" class="age">
                    <div v-for="i in childrenNumber3" :key="i" class="age">
                      <span class="minus" @click="decrease('age', n, i)"><v-icon color="white" small>mdi-minus</v-icon></span>
                      <span :id="`age${i + childrenNumber2 + childrenNumber1}`" class="number">1</span>
                      <span class="plus" @click="increase('age', n, i)"><v-icon color="white" small>mdi-plus</v-icon></span>
                    </div>
                  </div>
                  <div v-if="n === 4" class="age">
                    <div v-for="i in childrenNumber4" :key="i" class="age">
                      <span class="minus" @click="decrease('age', n, i)"><v-icon color="white" small>mdi-minus</v-icon></span>
                      <span :id="`age${i + childrenNumber3 + childrenNumber2 + childrenNumber1}`" class="number">1</span>
                      <span class="plus" @click="increase('age', n, i)"><v-icon color="white" small>mdi-plus</v-icon></span>
                    </div>
                  </div>
                  <div v-if="n === 5" class="age">
                    <div v-for="i in childrenNumber5" :key="i" class="age">
                      <span class="minus" @click="decrease('age', n, i)"><v-icon color="white" small>mdi-minus</v-icon></span>
                      <span :id="`age${i + childrenNumber4 + childrenNumber3 + childrenNumber2 + childrenNumber1}`" class="number">1</span>
                      <span class="plus" @click="increase('age', n, i)"><v-icon color="white" small>mdi-plus</v-icon></span>
                    </div>
                  </div>
                  <div v-if="n === 6" class="age">
                    <div v-for="i in childrenNumber6" :key="i" class="age">
                      <span class="minus" @click="decrease('age', n, i)"><v-icon color="white" small>mdi-minus</v-icon></span>
                      <span :id="`age${i + childrenNumber5 + childrenNumber4 + childrenNumber3 + childrenNumber2 + childrenNumber1}`" class="number">1</span>
                      <span class="plus" @click="increase('age', n, i)"><v-icon color="white" small>mdi-plus</v-icon></span>
                    </div>
                  </div>
                </div>
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
      childrenNum: [],
      childrenNumber1: 0,
      childrenNumber2: 0,
      childrenNumber3: 0,
      childrenNumber4: 0,
      childrenNumber5: 0,
      childrenNumber6: 0,
      number: 1,
      adults: [1],
      children: [0],
      childrenAges: [],
      guests: []
    }
  },
  watch: {
    roomsNum (val) {
      this.number = Number(val)
    },
    guestNationality (val) {
      this.$store.dispatch('setCountryCode', val)
    },
    starRating (val) {
      this.$store.dispatch('setStarRating', val)
    }
  },
  created () {
    // this.$emit('save', this.guests)
    // if (this.$route.name !== 'trips-city-slug') {
    //   // this.guests = this.$store.state.hotelSearch.guestsInfo
    //   // this.roomsNum = this.guests.length
    //   let adults = 0
    //   let children = 0
    //   for (let i = 0; i < this.roomsNum; i++) {
    //     this.adults.push(this.guests[i].adults)
    //     adults += this.guests[i].adults
    //     this.children.push(this.guests[i].children)
    //     children += this.guests[i].children
    //     if (this.guests[i].childrenAges.length > 0) {
    //       for (let x = 0; x < this.guests[i].childrenAges.length; x++) {
    //         this.childrenAges.push(this.guests[i].childrenAges[x])
    //       }
    //     }
    //   }
    //   this.label = `${this.guests.length} rooms, ${adults + children} guests`
    //   this.$emit('save', this.guests)
    // }
  },
  methods: {
    increase (type, n, i) {
      switch (type) {
        case 'rooms':
          if (this.roomsNum > 5) { this.roomsNum = 6 } else { this.roomsNum += 1 }
          document.getElementById('room').innerText = this.roomsNum
          this.adults.push(1)
          this.children.push(0)
          break
        case 'adults':
          if (this.adults[n - 1] > 5) { this.adults[n - 1] = 6 } else {
            this.adults[n - 1] === undefined ? this.adults[n - 1] = 2 : this.adults[n - 1] = this.adults[n - 1] + 1
          }
          document.getElementById(`adult${n}`).innerText = this.adults[n - 1]
          break
        case 'children':
          if (this.$route.name === 'cruises-city-id') {
            this.children[n - 1] = 1
          } else if (this.$route.name !== 'cruises-city-id') {
            if (this.children[n - 1] > 3) {
              this.children[n - 1] = 4
            } else {
              this.children[n - 1] === undefined ? this.children[n - 1] = 1 : this.children[n - 1] = this.children[n - 1] + 1
            }
          }
          document.getElementById(`child${n}`).innerText = String(this.children[n - 1])
          this.childrenNum[n - 1] = this.children[n - 1]
          if (this.childrenNum[n - 1] > 0) {
            document.getElementById(`ages${n}`).style.display = 'flex'
            switch (n) {
              case 1:
                this.childrenNumber1 = this.childrenNum[n - 1]
                this.childrenAges.push(1)
                break
              case 2:
                this.childrenNumber2 = this.childrenNum[n - 1]
                this.childrenAges.push(1)
                break
              case 3:
                this.childrenNumber3 = this.childrenNum[n - 1]
                this.childrenAges.push(1)
                break
              case 4:
                this.childrenNumber4 = this.childrenNum[n - 1]
                this.childrenAges.push(1)
                break
              case 5:
                this.childrenNumber5 = this.childrenNum[n - 1]
                this.childrenAges.push(1)
                break
              case 6:
                this.childrenNumber6 = this.childrenNum[n - 1]
                this.childrenAges.push(1)
                break
            }
          } else { document.getElementById(`ages${n}`).style.display = 'none' }
          break
        case 'age':
          switch (n) {
            case 1:
              if (this.childrenAges[i - 1] > 11) { this.childrenAges[i - 1] = 18 } else {
                this.childrenAges[i - 1] === undefined ? this.childrenAges[i - 1] = 2 : this.childrenAges[i - 1] = this.childrenAges[i - 1] + 1
              }
              document.getElementById(`age${i}`).innerText = this.childrenAges[i - 1]
              break
            case 2:
              if (this.childrenAges[(i - 1) + this.childrenNumber1] > 11) { this.childrenAges[(i - 1) + this.childrenNumber1] = 18 } else {
                this.childrenAges[(i - 1) + this.childrenNumber1] === undefined ? this.childrenAges[(i - 1) + this.childrenNumber1] = 2 : this.childrenAges[(i - 1) + this.childrenNumber1] = this.childrenAges[(i - 1) + this.childrenNumber1] + 1
              }
              document.getElementById(`age${i + this.childrenNumber1}`).innerText = this.childrenAges[(i - 1) + this.childrenNumber1]
              break
            case 3:
              if (this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] > 11) { this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] = 18 } else {
                this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] === undefined ? this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] = 2 : this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] = this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] + 1
              }
              document.getElementById(`age${i + this.childrenNumber2 + this.childrenNumber1}`).innerText = this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1]
              break
            case 4:
              if (this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] > 11) { this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 18 } else {
                this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] === undefined ? this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 2 : this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] + 1
              }
              document.getElementById(`age${i + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1}`).innerText = this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1]
              break
            case 5:
              if (this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] > 11) { this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 18 } else {
                this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] === undefined ? this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 2 : this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] + 1
              }
              document.getElementById(`age${i + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1}`).innerText = this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1]
              break
            case 6:
              if (this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] > 11) { this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 18 } else {
                this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] === undefined ? this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 2 : this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] + 1
              }
              document.getElementById(`age${i + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1}`).innerText = this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1]
              break
          }
          break
        default:
          break
      }
      this.save()
    },
    decrease (type, n, i) {
      switch (type) {
        case 'rooms':
          if (this.roomsNum < 2) { this.roomsNum = 1 } else { this.roomsNum -= 1 }
          document.getElementById('room').innerText = this.roomsNum
          for (let i = 0; i < this.children[this.children.length - 1]; i++) {
            this.childrenAges.pop()
          }
          this.adults.pop()
          this.children.pop()
          break
        case 'adults':
          if (this.adults[n - 1] < 2) { this.adults[n - 1] = 1 } else {
            this.adults[n - 1] === undefined ? this.adults[n - 1] = 1 : this.adults[n - 1] = this.adults[n - 1] - 1
          }
          document.getElementById(`adult${n}`).innerText = this.adults[n - 1]
          break
        case 'children':
          if (this.children[n - 1] < 1) { this.children[n - 1] = 0 } else {
            this.children[n - 1] === undefined ? this.children[n - 1] = 0 : this.children[n - 1] = this.children[n - 1] - 1
          }
          document.getElementById(`child${n}`).innerText = this.children[n - 1]
          this.childrenNum[n - 1] = this.children[n - 1]
          if (this.childrenNum[n - 1] > 0) {
            document.getElementById(`ages${n}`).style.display = 'flex'
            switch (n) {
              case 1:
                this.childrenNumber1 = this.childrenNum[n - 1]
                this.childrenAges.splice((n - 1), 1)
                break
              case 2:
                this.childrenNumber2 = this.childrenNum[n - 1]
                this.childrenAges.splice((n - 1), 1)
                break
              case 3:
                this.childrenNumber3 = this.childrenNum[n - 1]
                this.childrenAges.splice((n - 1), 1)
                break
              case 4:
                this.childrenNumber4 = this.childrenNum[n - 1]
                this.childrenAges.splice((n - 1), 1)
                break
              case 5:
                this.childrenNumber5 = this.childrenNum[n - 1]
                this.childrenAges.splice((n - 1), 1)
                break
              case 6:
                this.childrenNumber6 = this.childrenNum[n - 1]
                this.childrenAges.splice((n - 1), 1)
                break
            }
          } else { document.getElementById(`ages${n}`).style.display = 'none' }
          break
        case 'age':
          switch (n) {
            case 1:
              if (this.childrenAges[i - 1] < 2) { this.childrenAges[i - 1] = 1 } else {
                this.childrenAges[i - 1] === undefined ? this.childrenAges[i - 1] = 1 : this.childrenAges[i - 1] = this.childrenAges[i - 1] - 1
              }
              document.getElementById(`age${i}`).innerText = this.childrenAges[i - 1]
              break
            case 2:
              if (this.childrenAges[(i - 1) + this.childrenNumber1] < 2) { this.childrenAges[(i - 1) + this.childrenNumber1] = 1 } else {
                this.childrenAges[(i - 1) + this.childrenNumber1] === undefined ? this.childrenAges[(i - 1) + this.childrenNumber1] = 1 : this.childrenAges[(i - 1) + this.childrenNumber1] = this.childrenAges[(i - 1) + this.childrenNumber1] - 1
              }
              document.getElementById(`age${i + this.childrenNumber1}`).innerText = this.childrenAges[(i - 1) + this.childrenNumber1]
              break
            case 3:
              if (this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] < 2) { this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] = 1 } else {
                this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] === undefined ? this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] = 1 : this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] = this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1] - 1
              }
              document.getElementById(`age${i + this.childrenNumber2 + this.childrenNumber1}`).innerText = this.childrenAges[(i - 1) + this.childrenNumber2 + this.childrenNumber1]
              break
            case 4:
              if (this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] < 2) { this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 1 } else {
                this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] === undefined ? this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 1 : this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] - 1
              }
              document.getElementById(`age${i + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1}`).innerText = this.childrenAges[(i - 1) + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1]
              break
            case 5:
              if (this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] < 2) { this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 1 } else {
                this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] === undefined ? this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 1 : this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] - 1
              }
              document.getElementById(`age${i + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1}`).innerText = this.childrenAges[(i - 1) + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1]
              break
            case 6:
              if (this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] < 2) { this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 1 } else {
                this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] === undefined ? this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = 1 : this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] = this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1] - 1
              }
              document.getElementById(`age${i + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1}`).innerText = this.childrenAges[(i - 1) + this.childrenNumber5 + this.childrenNumber4 + this.childrenNumber3 + this.childrenNumber2 + this.childrenNumber1]
              break
          }
          break
        default:
          break
      }
      this.save()
    },
    save () {
      this.guests = []
      for (let i = 0; i < this.adults.length; i++) {
        this.adults[i] = this.adults[i] ? this.adults[i] : 1
      }
      for (let i = 0; i < this.children.length; i++) {
        this.children[i] = this.children[i] ? this.children[i] : 0
      }
      for (let i = 0; i < this.childrenAges.length; i++) {
        this.childrenAges[i] = this.childrenAges[i] ? this.childrenAges[i] : 1
      }
      const childrenAges = [...this.childrenAges]
      for (let i = 0; i < this.roomsNum; i++) {
        const roomGuest = {}
        roomGuest.adults = this.adults[i] ? this.adults[i] : 1
        roomGuest.children = this.children[i] ? this.children[i] : 0
        const roomChildrenAges = []
        for (let n = 0; n < this.children[i]; n++) {
          roomChildrenAges.push(childrenAges[n])
        }
        roomGuest.childrenAges = roomChildrenAges
        this.guests.push(roomGuest)
        childrenAges.splice(0, this.children[i])
      }
      let adults = 0
      let children = 0
      for (let i = 0; i < this.guests.length; i++) {
        adults = adults + this.guests[i].adults
        children = children + this.guests[i].children
      }
      this.label = `${this.guests.length} rooms, ${adults + children} guests`
      if (this.$route.name === 'trips-city-slug' || this.$route.name === 'roomsResults' || this.$route.name === 'cruises-city-id' || this.$route.name === 'hotels') {
        this.$emit('save', this.guests)
      } else {
        this.$store.dispatch('setHotelGuestsInfo', this.guests)
      }
      //   this.menu = false
    }
  }
}
</script>

  <style>
    .inputs, .rooms, .adults, .children, .ages, .age {
      display: flex;
    }
    .rooms, .adults, .children, .age {
      margin-right: 2px;
      position: relative;
    }
    .room-text {
      width: 90px;
    }
    .inputs {
      margin: 18px auto;
      position: relative;
      max-width: 276px;
      flex-wrap: wrap;
    }
    .ages {
      direction: rtl;
      width: 100%;
      flex-wrap: wrap;
      display: none;
    }
    .age {
      /* position: absolute;
      bottom: -20px; */
      margin-top: 2px;
      margin-left: 5px;
      width: 44px;
    }
    .label {
      position: absolute;
      top: -18px;
    }
    .minus, .plus {
      background-color: #BD9468;
      width: 30px;
      text-align: center;
      transition: 0.2s linear;
      color: white;
    }
    .minus:hover, .plus:hover {
      cursor: pointer;
      background-color: #5E432C;
    }
    .number {
      width: 30px;
      text-align: center;
      color: #222;
      background-color: #eee;
    }
  </style>
