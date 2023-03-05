<!-- eslint-disable vue/no-v-html -->
<template>
  <v-card-text class="px-3">
    <v-row justify="space-between">
      <v-col style="border-left: 1px solid #eee;" class="my-2" cols="12" sm="6">
        <v-img :src="room.images[0]" height="200" />
        <p class="title black--text">
          Cancelation Policies
        </p>
        <!-- <p class="error--text">Cancelation Policies</p> -->
        <p v-if="room.cancelPolicies.lastCancellationDeadLine">
          Cancellation DeadLine: {{ room.cancelPolicies.lastCancellationDeadLine }}
        </p>
        <p v-if="room.cancelPolicies.defaultPolicy">
          Hotel Policy: {{ room.cancelPolicies.defaultPolicy }}
        </p>
        <div v-if="room.cancelPolicies.policies && room.cancelPolicies.policies.length > 0">
          <p v-for="(policy, i) in room.cancelPolicies.policies" :key="i">
            From <dateDisplay :date="policy.fromDate" /> to <dateDisplay :date="policy.toDate" /> cancelation charge {{ policy.chargeType === 'Fixed' ? '$' : '%' }}{{ policy.cancellationCharge }}
          </p>
        </div>
        <v-expansion-panels class="elevation-0">
          <v-expansion-panel v-if="room.supplements.length">
            <v-expansion-panel-header>
              Room supplements
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p v-for="sup in room.supplements" :key="sup.id" class="body-2 font-weight-bold">
                {{ sup.type }}: {{ sup.name }}, {{ sup.chargeType }}, {{ sup.price }} {{ sup.currencyCode }}
                <span v-if="!sup.isMandatory">
                  <v-btn color="blue" text small @click="supplements.push({sup: sup.id, room: room.roomIndex, accept: true})">Add Supplement</v-btn>
                </span>
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="room.amenities">
            <v-expansion-panel-header>
              Aminities
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-chip v-for="(item, i) in room.amenities.split('|')" :key="`chip-${i}`" color="late" class="ma-1" outlined>
                {{ item }}
              </v-chip>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="title black--text">
          Description
        </p>
        <div class="black--text" v-html="room.description" />
        <p v-if="room.inclusion" class="black--text">
          <b>Inclusions -</b> {{ room.inclusion === "" ? 'No Inclusions' : room.inclusion }}
        </p>
        <p v-if="room.meal" class="black--text">
          <b>Meals -</b> {{ room.meal }}
        </p>
        <p v-if="room.promotion !== '' && room.promotion" class="success--text">
          <b>Promotions -</b> {{ room.promotion }}
        </p>
      </v-col>
    </v-row>
    <v-divider />
    <div v-if="showPrices === 'show'">
      <p class="title black--text">
        Day Rates
      </p>
      <p v-for="(rate, i) in room.daysRate" :key="i" class="body-1 black--text">
        ${{ rate.baseFare }} on <dateDisplay :date="rate.date" />
      </p>
      <v-row justify="space-between" class="px-3">
        <p class="font-weight-bold text-h4 late--text">
          Total
        </p>
        <p class="font-weight-bold text-h4 late--text">
          ${{ room.rateSummary.totalFare * $store.state.hotelSearch.guestsInfo.length }}
        </p>
      </v-row>
      <v-divider />
    </div>
  </v-card-text>
</template>

<script>

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['room', 'showPrices']
}
</script>
