<script setup>
import { defineProps, ref } from "vue";
import { useStore } from "@/store/index";

const store = useStore();
const toggle = ref(false);
const onEditMode = ref(false);
const props = defineProps(["item", "sectionId"]);
const task = ref(props.item);

const onDeleteTaskClick = () => {
  store.deleteTaskItem(props.sectionId, props.item.title);
};
const onEditTaskClick = () => {
  onEditMode.value = true;
};

const onConfirmEditClick = () => {
  onEditMode.value = false;
  store.editTaskItem(props.sectionId, props.item.title, task);
};
</script>

<template>
  <v-sheet rounded style="border: 1px solid black">
    <v-row v-if="!onEditMode">
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
            <v-list-item @click="onEditTaskClick">
              <v-list-item-title>Editar tarefa</v-list-item-title>
            </v-list-item>
            <v-list-item @click="onDeleteTaskClick">
              <v-list-item-title>Excluir tarefa</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <div v-else>
      <v-row dense no-gutter>
        <v-col cols="12">
          <v-text-field
            v-model="task.title"
            class="pl-3"
            variant="plain"
            placeholder="Título da tarefa"
            hide-details
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="task.description"
            class="pl-3"
            variant="plain"
            placeholder="descrição"
            hide-details
            density="compact"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-btn size="x-small" flat @click="onCancelClick"> cancelar </v-btn>
        <v-btn size="x-small" flat @click="onConfirmEditClick">
          confirmar
        </v-btn>
      </v-row>
    </div>
  </v-sheet>
</template>
