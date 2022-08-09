<script setup>
import { defineProps, ref } from "vue";
import SectionItem from "./SectionItem.vue";
import { useStore } from "@/store/index";

const store = useStore();
const props = defineProps(["section"]);
const showAddItem = ref(false);
const task = ref({
  title: "",
  description: "",
});
const onCancelClick = () => {
  showAddItem.value = false;
  task.value = {
    title: "",
    description: "",
  };
};

const onConfirmAddItem = () => {
  showAddItem.value = false;
  addSectionItem();
  task.value = {
    title: "",
    description: "",
  };
};

const addSectionItem = () => {
  store.addItemToSection(props.section.id, task.value);
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
        <v-btn flat icon="mdi-dots-horizontal"></v-btn>
      </v-row>
    </v-card-title>
    <v-card-text>
      <SectionItem
        v-for="item in props.section.items"
        :key="item.description"
        :item="item"
        :sectionId="props.section.id"
        class="mb-2"
      />
      <v-sheet v-if="showAddItem" rounded style="border: 1px solid black">
        <v-text-field
          v-model="task.title"
          class="pl-3"
          variant="plain"
          placeholder="Título da tarefa"
          hide-details
          density="compact"
        ></v-text-field>
        <v-text-field
          v-model="task.description"
          class="pl-3"
          variant="plain"
          placeholder="descrição"
          hide-details
          density="compact"
        ></v-text-field>
      </v-sheet>
    </v-card-text>
    <v-card-actions>
      <v-row v-if="showAddItem" justify="end">
        <v-btn @click="onCancelClick"> alo </v-btn>
        <v-btn @click="onConfirmAddItem"> confirmar </v-btn>
      </v-row>
      <v-row v-else justify="start">
        <v-btn
          prepend-icon="mdi-plus-circle-outline"
          @click="showAddItem = true"
          size="small"
        >
          adicionar tarefa
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style></style>
