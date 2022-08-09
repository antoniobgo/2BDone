<script setup>
import { defineProps, ref } from "vue";
import { useStore } from "@/store/index";

const store = useStore();
const toggle = ref(false);
const props = defineProps(["item", "sectionId"]);
const onDeleteTaskClick = () => {
  store.deleteTaskItem(props.sectionId, props.item.title);
};
</script>

<template>
  <v-sheet rounded style="border: 1px solid black">
    <v-row>
      <v-col cols="2">
        <v-radio @click="toggle = !toggle" v-model="toggle"> </v-radio>
      </v-col>
      <v-col cols="8">
        <p class="text-subtitle-1 pt-2">
          {{ props.item.title }}
        </p>
      </v-col>
      <v-col cols="2">
        <v-menu location="start">
          <template v-slot:activator="{ props }">
            <v-btn
              class="pr-2"
              v-bind="props"
              flat
              icon="mdi-dots-horizontal"
            ></v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>Editar tarefa</v-list-item-title>
            </v-list-item>
            <v-list-item @click="onDeleteTaskClick">
              <v-list-item-title>Excluir tarefa</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-sheet>
</template>
