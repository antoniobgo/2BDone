<script setup>
import { onBeforeMount, onBeforeUnmount, watch, ref } from "vue";
import router from "../router/index.js";
import { useStore } from "@/store/index";
import BoardSection from "@/components/BoardSection.vue";
import BoardService from "@/services/board.service";
import AuthService from "@/services/auth.service";

const store = useStore();
const onEditMode = ref(false);
const onConfirmEditBoardLoading = ref(false);
const board = ref({});

const onCancelEditProjectClick = () => {
  onEditMode.value = false;
  board.value = store.boards[store.chosenBoardIndex];
};

const onConfirmAddBoardClick = () => {
  // onConfirmEditBoardLoading.value = true;
  // board.value.id = store.boards[store.chosenBoardIndex].id
  // BoardService.editBoard(board.value).then(response => {
  //   if()
  // })
};

const LogInWithToken = () => {
  if (!store.isUserLoggedIn)
    AuthService.loginWithToken().then((user) => {
      if (user)
        store.$patch({
          isUserLoggedIn: true,
          loggedUser: user,
        });
      else router.push("login");
    });
};

const getAndSaveFirstBoardData = () => {
  BoardService.getBoards().then((response) => {
    if (response.status === 200) {
      store.boards = response.data;
      if (store.boards.length > 0) {
        board.value.title = response.data[store.chosenBoardIndex].title;
        BoardService.getBoardSections(
          store.boards[store.chosenBoardIndex].id
        ).then((response) => {
          if (response.status === 200) {
            store.boards[store.chosenBoardIndex].sections = response.data;
            store.boards[store.chosenBoardIndex].sections.forEach(
              (section, index) => {
                BoardService.getSectionItems(section.id).then((response) => {
                  if (response.status === 200) {
                    // Verificar se adicionar propriedade nova quebra reatividade
                    store.boards[store.chosenBoardIndex].sections[index].items =
                      response.data;
                  }
                });
              }
            );
          }
        });
      }
    }
  });
};

const getNewSelectedBoardData = () => {
  board.value.title = store.boards[store.chosenBoardIndex].title;
  BoardService.getBoardSections(store.boards[store.chosenBoardIndex].id).then(
    (response) => {
      if (response.status === 200) {
        store.boards[store.chosenBoardIndex].sections = response.data;
        store.boards[store.chosenBoardIndex].sections.forEach(
          (section, index) => {
            BoardService.getSectionItems(section.id).then((response) => {
              if (response.status === 200) {
                // Verificar se adicionar propriedade nova quebra reatividade
                store.boards[store.chosenBoardIndex].sections[index].items =
                  response.data;
              }
            });
          }
        );
      }
    }
  );
};

onBeforeMount(() => {
  if (!localStorage.getItem("token")) router.push("login");
  else {
    LogInWithToken();
    if (store.boards.length === 0) {
      getAndSaveFirstBoardData();
    }
  }
});

watch(
  () => store.chosenBoardIndex,
  (chosenBoardIndex) => {
    getNewSelectedBoardData();
  }
);
</script>
<template>
  <div class="pa-10">
    <div v-if="store.boards.length">
      <v-row v-if="!onEditMode" justify="space-between" dense>
        <p class="text-h4">
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
            <v-list-item @click="onEditMode = true">
              <v-list-item-title>editar nome</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>excluir projeto</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
      <v-row v-else>
        <v-col>
          <v-text-field v-model="board.title"> </v-text-field>
          <v-row no-gutters>
            <v-btn
              @click="onConfirmEditProjectClick"
              :loading="onConfirmEditBoardLoading"
              :disabled="board.title.length === 0"
              size="small"
              color="primary"
            >
              confirmar
            </v-btn>
            <v-btn @click="onCancelEditProjectClick" size="small">
              cancelar
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense class="mt-15">
        <v-col
          cols="3"
          v-for="section in store.boards[store.chosenBoardIndex].sections"
          :key="section.id"
        >
          <BoardSection :section="section" />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <h3>ainda sem projetos amigao</h3>
    </div>
  </div>
</template>
