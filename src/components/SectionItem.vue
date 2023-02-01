<script setup>
import { defineProps, ref, watch } from "vue";
import { useStore } from "@/store/index";
import BoardService from "@/services/board.service";

const store = useStore();
const toggle = ref(false);
const isMouseOverItem = ref(false);
const onEditMode = ref(false);
const props = defineProps(["item", "section"]);
const task = ref({
  title: props.item.title,
  description: props.item.description,
});

// Olha que beleza
const onDeleteTaskClick = (completed = false) => {
  BoardService.deleteItem(props.item.id).then((response) => {
    store.deleteTaskItem(props.section.id, props.item.title);
  });
};
const onEditTaskClick = () => {
  onEditMode.value = true;
};

const onConfirmEditItemClick = () => {
  onEditMode.value = false;
  // store.editTaskItem(props.section.id, props.item.title, task);
  task.value.id = props.item.id;
  BoardService.editItem(task.value)
    .then((response) => {
      if (response.status === 200) {
        task.value = response.data.item;
        store.boards[store.chosenBoardId].sections[
          store.boards[store.chosenBoardId].sections.indexOf(props.section)
        ].items[
          store.boards[store.chosenBoardId].sections[
            store.boards[store.chosenBoardId].sections.indexOf(props.section)
          ].items.indexOf(props.item)
        ] = response.data.item;
        onEditMode.value = false;
      }
    })
    .catch((error) => {});
};

const onCancelEditItemClick = () => {
  task.value.title = props.item.title;
  task.value.description = props.item.description;
  onEditMode.value = false;
};

const teste = () => {
  //eslint-disable-next-line
  debugger;
};
</script>

<template>
  <div>
    <v-sheet
      @mouseover="isMouseOverItem = true"
      @mouseleave="isMouseOverItem = false"
      class="rounded-lg"
      style="border: 1px solid #e0e0e0"
    >
      <div v-if="!onEditMode">
        <v-row no-gutters dense>
          <v-col cols="2">
            <v-radio
              v-model="toggle"
              @click="onDeleteTaskClick"
              class="grey-color"
            >
            </v-radio>
          </v-col>
          <v-col cols="7">
            <p class="text-subtitle-1 pt-2">
              {{ task.title }}
            </p>
          </v-col>
          <v-col cols="3" align-self="center">
            <div v-if="isMouseOverItem" class="d-flex justify-end mr-1">
              <v-btn
                @click="onEditTaskClick"
                icon
                variant="flat"
                density="compact"
                size="small"
                class="mr-1"
              >
                <v-icon color="#7C7E81"> mdi-pencil </v-icon>
              </v-btn>
              <v-btn
                @click="onDeleteTaskClick"
                variant="flat"
                density="compact"
                size="small"
                icon
              >
                <v-icon color="#7C7E81"> mdi-trash-can-outline </v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters dense>
          <v-col cols="2">
            <p></p>
          </v-col>
          <v-col cols="10">
            <p style="font-size: 12px" class="grey-color">
              {{ task.description }}
            </p>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row no-gutters>
          <v-col cols="12">
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
              placeholder="Descrição"
              hide-details
              density="compact"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-sheet>
    <v-row v-if="onEditMode" justify="end" no-gutters>
      <div class="d-flex mt-3">
        <v-btn size="small" flat @click="onCancelEditItemClick">
          cancelar
        </v-btn>
        <v-btn
          size="small"
          flat
          @click="onConfirmEditItemClick"
          :disabled="
            task.title.length === 0 ||
            task.title.length > 70 ||
            task.description.length > 200
          "
          color="primary"
        >
          confirmar
        </v-btn>
      </div>
    </v-row>
  </div>
</template>

<style>
input[placeholder="Título da tarefa"] {
  padding-top: 2px;
}
input[placeholder="Descrição"] {
  padding-top: 2px;
}
</style>
