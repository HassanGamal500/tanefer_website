<template>
  <div>
    <v-card class="mb-5">
      <v-card-text>
        <v-row class="">
          <v-col v-if="adventure.activityImages.length" cols="12" md="4" class="pa-0">
            <v-img height="100%" :src="adventure.activityImages[0][0]" />
          </v-col>
          <v-col cols="12" :md="adventure.activityImages.length ? 8 : 12">
            <div class="cruise-result-trip headline d-flex justify-space-between">
              <div>{{ adventure.activityTitle }}</div>
              <div>
                <div>${{ adventure.activityPricePerPerson }} <small class="caption">/expected price per person</small></div>
              </div>
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="mb-3" v-html="adventure.activityOverview" />

            <div class="trips-cityname">
              <v-expansion-panels>
                <v-expansion-panel v-if="adventure.activityIncludes.length">
                  <v-expansion-panel-header>
                    Includes
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <span v-for="(include, i) in adventure.activityIncludes" :key="i">
                      <v-chip class="my-1 px-1">{{ include }}</v-chip>
                    </span>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="adventure.activityExcludes.length">
                  <v-expansion-panel-header>
                    Excludes
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <span v-for="(exclude, i) in adventure.activityExcludes" :key="i">
                      <v-chip class="my-1 px-1">{{ exclude }}</v-chip>
                    </span>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider class="mb-2" />
      <v-card-actions>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Adventure Date"
              prepend-inner-icon="mdi-calendar"
              append-inner-icon="mdi-pencil"
              readonly
              outlined
              :rules="[v => !!v || 'Date is required!']"
              v-bind="attrs"
              :hint="getDateHint(adventure)"
              persistent-hint
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="date"
            :allowed-dates="allowedDates"
            :min="new Date().toISOString().substr(0, 10)"
            @input="menu = false"
          />
        </v-menu>
        <v-spacer />

        <v-btn
          v-if="!selected"
          color="success"
          @click="addAdventureToSelected"
        >
          Select this Adventure
        </v-btn>
        <v-btn
          v-else
          color="error"
          @click="removeAdventureFromSelected"
        >
          Unselect this Adventure
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['adventure', 'index', 'price'],
  data () {
    return {
      menu: false,
      date: null,
      selected: false
    }
  },
  methods: {
    allowedDates (val) {
      const date = new Date(val.replaceAll('-', '/'))
      const days = this.adventure.start_days.filter(item => !!item)
      const seasons = this.adventure.seasons
      let allowedDay = false
      if (days.includes(date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()) || !days.length) { allowedDay = true }
      let allowedSeason = false
      if (seasons.length) {
        for (let index = 0; index < seasons.length; index++) {
          if (date.getTime() >= new Date(seasons[index].from.replaceAll('-', '/')).getTime() && date.getTime() <= new Date(seasons[index].to.replaceAll('-', '/')).getTime()) { allowedSeason = true }
        }
      } else { allowedSeason = true }
      return allowedDay && allowedSeason
    },
    getDateHint () {
      let text = 'You can choose from allowed dates :'
      for (let index = 0; index < this.adventure.start_days.filter(item => !!item).length; index++) {
        if (this.adventure.start_days[index]) { text += this.adventure.start_days[index] + ',' }
      }
      for (let index = 0; index < this.adventure.seasons.length; index++) {
        text += 'from' + this.adventure.seasons[index].from + ' to ' + this.adventure.seasons[index].to + ' / '
      }
      if (!this.adventure.start_days.filter(item => !!item).length && !this.adventure.seasons.length) { text = '' }
      return text
    },
    addAdventureToSelected () {
      if (this.date) {
        this.selected = true
        this.$emit('addAdventure', { activityTitle: this.adventure.activityTitle, activity_id: this.adventure.activityID, date: this.date, price: this.price })
      } else {
        this.$emit('error', 'Please select start date!', 'warning')
      }
    },
    removeAdventureFromSelected () {
      this.selected = false
      this.$emit('removeAdventure', this.adventure.activityID)
    }
  }
}
</script>
