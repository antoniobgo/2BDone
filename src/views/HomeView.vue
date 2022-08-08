<script setup>
import { ref } from "vue";
import { useStore } from "@/store/index";

const store = useStore();

const toggle = ref(false);
</script>
<template>
  <div class="pa-10">
    <v-row justify="space-between" dense>
      <p class="text-h4">{{ store.boards[0].name }}</p>
      <v-btn flat icon="mdi-dots-vertical"></v-btn>
    </v-row>
    <v-row dense class="mt-15">
      <v-card
        flat
        height="300"
        width="300"
        v-for="section in store.boards[0].sections"
        :key="section.name"
      >
        <v-card-title>
          <v-row justify="space-between">
            <div class="d-flex">
              <p>{{ section.name }}</p>
              <p class="ml-3">{{ section.items.length }}</p>
            </div>
            <v-btn flat icon="mdi-dots-vertical"></v-btn>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-sheet
            v-for="item in section.items"
            :key="item.description"
            rounded
            style="border: 1px solid black"
          >
            <v-row>
              <v-col cols="2">
                <v-radio @click="toggle = !toggle" v-model="toggle"> </v-radio>
              </v-col>
              <v-col cols="10">
                <p class="text-subtitle-1 pt-1">
                  {{ item.description }}
                </p>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
          <v-row justify="end">
            <v-btn> adicionar tarefa </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>
  </div>
</template>
