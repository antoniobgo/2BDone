<script setup>
import { defineProps, ref, computed, watch } from "vue";
import { useStore } from "@/store/index";
import SectionItem from "./SectionItem.vue";
import BoardService from "@/services/board.service";

const store = useStore();
const props = defineProps(["section"]);
const showAddItemField = ref(false);
const addItemError = ref(false);
const taskFieldInputError = ref(false);
const isAddItemButtonLoading = ref(false);

const addItemServerErrorMessage = computed(() => {
  return "Um erro inesperado ocorreu. Por favor, tente novamente.";
});

const taskFieldInputErrorMessage = computed(() => {
  const titleLength = taskItem.value.title.length;
  const descriptionLength = taskItem.value.description.length;
  return titleLength > 70
    ? `Título com ${titleLength}/70 caracteres`
    : descriptionLength > 200
    ? `Descrição com ${descriptionLength}/200 caracteres.`
    : "";
});

const onAddItemClick = () => {
  showAddItemField.value = true;
  if (addItemError.value) addItemError.value = false;
};

const taskItem = ref({
  title: "",
  description: "",
});

const onCancelClick = () => {
  showAddItemField.value = false;
  taskItem.value = {
    title: "",
    description: "",
  };
};

const onConfirmAddItem = () => {
  isAddItemButtonLoading.value = true;
  BoardService.addItem(taskItem.value, props.section.id)
    .then((response) => {
      if (response.status === 201) {
        showAddItemField.value = false;
        let sectionIndex = store.boards[
          store.chosenBoardIndex
        ].sections.indexOf(props.section);
        store.boards[store.chosenBoardIndex].sections[sectionIndex].items.push(
          response.data
        );
        taskItem.value = {
          title: "",
          description: "",
        };
      }
    })
    .catch((response) => {
      addItemError.value = true;
    });

  isAddItemButtonLoading.value = false;
};

watch(
  () => taskItem.value.title,
  (title) => {
    if (title.length > 70) taskFieldInputError.value = true;
  }
);

watch(
  () => taskItem.value.description,
  (description) => {
    if (description.length > 200) taskFieldInputError.value = true;
  }
);
</script>
<template>
  <v-card flat width="300">
    <v-card-title>
      <v-row justify="space-between">
        <div class="d-flex">
          <p>{{ section.title }}</p>
        </div>
        <v-btn flat icon="mdi-dots-horizontal"></v-btn>
      </v-row>
    </v-card-title>
    <v-card-text v-if="props.section.items" class="pb-0 mb-0">
      <SectionItem
        v-for="item in props.section.items"
        :key="item.description"
        :item="item"
        :sectionId="props.section.id"
        class="mb-2"
      />
      <v-sheet v-if="showAddItemField" style="border: 1px solid black">
        <v-text-field
          v-model="taskItem.title"
          class="pl-3"
          variant="plain"
          placeholder="Título da tarefa"
          hide-details
          density="compact"
        ></v-text-field>
        <v-text-field
          v-model="taskItem.description"
          class="pl-3"
          variant="plain"
          placeholder="descrição"
          hide-details
          density="compact"
        ></v-text-field>
      </v-sheet>
    </v-card-text>
    <v-card-actions class="ma-0 pa-0">
      <v-row v-if="showAddItemField" no-gutters>
        <v-col>
          <p v-if="taskFieldInputError" class="text-red ml-4">
            {{ taskFieldInputErrorMessage }}
          </p>
          <v-row justify="end" class="mt-2">
            <v-btn @click="onCancelClick"> cancelar </v-btn>
            <v-btn
              @click="onConfirmAddItem"
              :loading="isAddItemButtonLoading"
              :disabled="
                taskItem.title.length === 0 ||
                taskItem.title.length > 70 ||
                taskItem.description.length > 200
              "
            >
              confirmar
            </v-btn>
          </v-row>
          <p v-if="addItemError" class="text-red mt-2">
            {{ addItemServerErrorMessage }}
          </p>
        </v-col>
      </v-row>
      <v-row v-else justify="start">
        <v-col>
          <v-btn
            prepend-icon="mdi-plus-circle-outline"
            @click="onAddItemClick"
            size="small"
          >
            adicionar tarefa
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style></style>
