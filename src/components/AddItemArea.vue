<script setup>
import { defineProps, ref, computed, watch } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "@/store/index";
import BoardService from "@/services/board.service";

const taskItem = ref({
  title: "",
  description: "",
});
const { mdAndUp } = useDisplay();
const store = useStore();
const props = defineProps(["section"]);
const showAddItemField = ref(false);
const addItemError = ref(false);
const taskFieldInputError = ref(false);
const isAddItemButtonLoading = ref(false);

const taskFieldInputErrorMessage = computed(() => {
  const titleLength = taskItem.value.title.length;
  const descriptionLength = taskItem.value.description.length;
  return titleLength > 70
    ? `Título com ${titleLength}/70 caracteres`
    : descriptionLength > 200
    ? `Descrição com ${descriptionLength}/200 caracteres.`
    : "";
});

const addItemServerErrorMessage = computed(() => {
  return "Um erro inesperado ocorreu. Por favor, tente novamente.";
});

const onAddItemClick = () => {
  showAddItemField.value = true;
  if (addItemError.value) addItemError.value = false;
};

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
        if (!store.boards[store.chosenBoardIndex].sections[sectionIndex].items)
          store.boards[store.chosenBoardIndex].sections[sectionIndex].items =
            [];
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
  <div v-if="showAddItemField" class="w-100">
    <v-row justify="center" no-gutters>
      <v-col cols="12">
        <v-sheet style="border: 1px solid #e0e0e0" class="mx-4 rounded-lg">
          <v-text-field
            v-model="taskItem.title"
            class="pl-3"
            variant="plain"
            placeholder="Título da tarefa"
            hide-details="auto"
            density="compact"
          ></v-text-field>
          <v-text-field
            v-model="taskItem.description"
            class="pl-3"
            variant="plain"
            placeholder="Descrição"
            hide-details="auto"
            density="compact"
          ></v-text-field>
        </v-sheet>
        <p v-if="taskFieldInputError" class="text-red ml-4">
          {{ taskFieldInputErrorMessage }}
        </p>
        <v-row justify="end" class="mt-2" no-gutters>
          <v-btn @click="onCancelClick" size="small"> cancelar </v-btn>
          <v-btn
            @click="onConfirmAddItem"
            :loading="isAddItemButtonLoading"
            size="small"
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
  </div>
  <div class="w-100" v-else>
    <v-row no-gutters dense justify="start">
      <v-col>
        <v-btn
          prepend-icon="mdi-plus-circle-outline"
          @click="onAddItemClick"
          size="small"
          class="ml-3"
        >
          adicionar tarefa
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style>
/* TODO: not a very smart way to reduce input paddings.
*/
input[placeholder="Título da tarefa"] {
  padding-top: 2px;
}
input[placeholder="Descrição"] {
  padding-top: 2px;
}
</style>
