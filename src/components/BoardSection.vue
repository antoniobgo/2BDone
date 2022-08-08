<script setup>
import { defineProps } from "vue";
import { useStore } from "@/store/index";
import SectionItem from "./SectionItem.vue";

const store = useStore();
const props = defineProps(["section"]);

console.log(props.section.items);

const addSectionItem = () => {
  store.addItemToSection(props.section.id);
};
</script>
<template>
  <v-card flat width="300">
    <v-card-title>
      <v-row justify="space-between">
        <div class="d-flex">
          <p>{{ section.name }}</p>
          <p class="ml-3">{{ props.section.items.length }}</p>
        </div>
        <v-btn flat icon="mdi-dots-vertical"></v-btn>
      </v-row>
    </v-card-title>
    <v-card-text>
      <!-- <v-sheet
        rounded
        style="border: 1px solid black"
        v-for="item in props.section.items"
        :key="item.description"
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
      </v-sheet> -->
      <SectionItem
        v-for="item in props.section.items"
        :key="item.description"
        :item="item"
      >
      </SectionItem>
    </v-card-text>
    <v-card-actions>
      <v-row justify="end">
        <v-btn @click="addSectionItem"> adicionar tarefa </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style></style>
