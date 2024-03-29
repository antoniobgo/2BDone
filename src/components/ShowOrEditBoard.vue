<script setup>
import { ref, onBeforeMount, watch, computed } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "@/store/index";
import BoardService from "@/services/board.service";

const store = useStore();
const { mdAndUp } = useDisplay();
const showEditMode = ref(false);
const isTitleLengthInvalid = ref(false);
const board = ref({});
const onConfirmEditBoardLoading = ref(false);
const onEditBoardResponseError = ref(false);
const onDeleteBoardError = ref(false);
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

const onDeleteBoardClick = () => {
  BoardService.deleteBoard(store.boards[store.chosenBoardIndex].id)
    .then((response) => {
      if (response.status === 204) {
        store.boards.splice(store.chosenBoardIndex, 1);
        store.chosenBoardIndex = 0;
        if (onDeleteBoardError.value) onDeleteBoardError.value = false;
      }
    })
    .catch((error) => {
      onDeleteBoardError.value = true;
    });
};

watch(
  () => board.value.title,
  (title) => {
    if (title.length > 70 || title.length === 0) {
      isTitleLengthInvalid.value = true;
    } else isTitleLengthInvalid.value = false;
  }
);

watch(
  () => store.chosenBoardIndex,
  (index) => {
    board.value.title = store.boards[store.chosenBoardIndex].title;
  }
);
</script>

<template>
  <div v-if="!showEditMode">
    <div class="d-flex mx-10 mt-7 justify-space-between">
      <p class="text-h4 mt-5">
        {{ board.title }}
      </p>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="large"
            flat
            icon="mdi-dots-horizontal"
          ></v-btn>
        </template>

        <v-list>
          <v-list-item @click="showEditMode = true">
            <v-list-item-title>Editar projeto</v-list-item-title>
          </v-list-item>
          <v-list-item @click="onDeleteBoardClick">
            <v-list-item-title>Excluir projeto</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-if="onDeleteBoardError" class="d-flex">
      <p class="text-red mt-4 ml-10">
        Couldnt delete requested board. Please, try again!
      </p>
    </div>
  </div>
  <div v-else :class="mdAndUp ? 'w-25' : 'w-100'">
    <div class="d-flex flex-column">
      <v-text-field
        v-model="board.title"
        variant="outlined"
        hide-details
        compact
        class="ma-2"
      />
      <p v-if="isTitleLengthInvalid" class="text-red">
        {{ boardInputErrorMessage }}
      </p>
    </div>
    <div class="d-flex justify-end mr-2">
      <v-btn @click="onCancelEditBoardClick" size="small" class="mr-2">
        cancelar
      </v-btn>
      <v-btn
        @click="onConfirmEditBoardClick"
        :loading="onConfirmEditBoardLoading"
        :disabled="board.title.length === 0 || board.title.length > 70"
        size="small"
        color="primary"
      >
        confirmar
      </v-btn>
    </div>
    <p v-if="onEditBoardResponseError" class="text-red">
      {{ boardResponseError }}
    </p>
  </div>
</template>
