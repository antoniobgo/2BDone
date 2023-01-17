<script setup>
import { ref, onBeforeMount, watch, computed } from "vue";
import { useStore } from "@/store/index";
import BoardService from "@/services/board.service";

const store = useStore();

const showEditMode = ref(false);
const isTitleLengthInvalid = ref(false);
const board = ref({});
const onConfirmEditBoardLoading = ref(false);
const onEditBoardResponseError = ref(false);
const boardResponseError =
  "Algo inesperado ocorreu. Por favor, tente novamente.";

const boardInputErrorMessage = computed(() => {
  const titleLength = board.value.title.length;
  return titleLength > 70
    ? `Título com ${titleLength}/70 caracteres`
    : titleLength === 0
    ? `Título não deve ser vazio.`
    : "";
});

const onCancelEditBoardClick = () => {
  showEditMode.value = false;
  onEditBoardResponseError.value = false;
  board.value.title = store.boards[store.chosenBoardIndex].title;
};

onBeforeMount(() => {
  board.value.title = store.boards[store.chosenBoardIndex].title;
});

const onConfirmEditBoardClick = () => {
  onConfirmEditBoardLoading.value = true;
  board.value.id = store.boards[store.chosenBoardIndex].id;
  BoardService.editBoard(board.value)
    .then((response) => {
      if (response.status === 200) {
        board.value.title = response.data.board.title;
        store.boards[store.chosenBoardIndex].title = response.data.board.title;
        showEditMode.value = false;
        if (onEditBoardResponseError.value)
          onEditBoardResponseError.value = false;
      }
    })
    .catch((response) => {
      onEditBoardResponseError.value = true;
    });
  onConfirmEditBoardLoading.value = false;
};

watch(
  () => board.value.title,
  (title) => {
    if (title.length > 70 || title.length === 0) {
      isTitleLengthInvalid.value = true;
    } else isTitleLengthInvalid.value = false;
  }
);
</script>

<template>
  <div v-if="!showEditMode" class="d-flex mx-5 justify-space-between">
    <p class="text-h4 mt-5">
      {{ board.title }}
    </p>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          class="pr-2"
          v-bind="props"
          flat
          icon="mdi-dots-horizontal"
        ></v-btn>
      </template>

      <v-list>
        <v-list-item @click="showEditMode = true">
          <v-list-item-title>Editar projeto</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Excluir projeto</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
  <div v-else>
    <div class="d-flex flex-column">
      <v-text-field v-model="board.title" hide-details class="mb-2" />
      <p v-if="isTitleLengthInvalid" class="text-red">
        {{ boardInputErrorMessage }}
      </p>
    </div>
    <div class="d-flex">
      <v-btn
        @click="onConfirmEditBoardClick"
        :loading="onConfirmEditBoardLoading"
        :disabled="board.title.length === 0 || board.title.length > 70"
        size="small"
        color="primary"
      >
        confirmar
      </v-btn>
      <v-btn @click="onCancelEditBoardClick" size="small"> cancelar </v-btn>
    </div>
    <p v-if="onEditBoardResponseError" class="text-red">
      {{ boardResponseError }}
    </p>
  </div>
</template>
