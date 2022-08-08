<script setup>
// import { ref } from "vue";
import { useStore } from "@/store/index";
import BoardSection from "@/components/BoardSection.vue";

const store = useStore();

// const toggle = ref(false);
</script>
<template>
  <div class="pa-10">
    <v-row justify="space-between" dense>
      <p class="text-h4">{{ store.boards[0].name }}</p>
      <v-btn flat icon="mdi-dots-vertical"></v-btn>
    </v-row>
    <v-row dense class="mt-15">
      <BoardSection
        v-for="section in store.boards[0].sections"
        :key="section.name"
        :section="section"
      />
    </v-row>
  </div>
</template>
