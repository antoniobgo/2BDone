<script setup>
import { defineProps, ref } from "vue";

const toggle = ref(false);
const props = defineProps(["item"]);
</script>

<template>
  <v-sheet rounded style="border: 1px solid black">
    <v-row>
      <v-col cols="2">
        <v-radio @click="toggle = !toggle" v-model="toggle"> </v-radio>
      </v-col>
      <v-col cols="10">
        <p class="text-subtitle-1 pt-1">
          {{ props.item.title }}
        </p>
      </v-col>
    </v-row>
  </v-sheet>
</template>
