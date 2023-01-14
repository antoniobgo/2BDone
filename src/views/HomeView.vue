<script setup>
import { onBeforeMount, onBeforeUnmount, watch, ref, computed } from "vue";
import router from "../router/index.js";
import { useStore } from "@/store/index";
import BoardSection from "@/components/BoardSection.vue";
import AddSectionButton from "@/components/AddSectionButton.vue";
import BoardService from "@/services/board.service";
import AuthService from "@/services/auth.service";

const store = useStore();
const showEditMode = ref(false);
const onConfirmEditBoardLoading = ref(false);
const board = ref({});
const onEditBoardResponseError = ref(false);
const isTitleLengthInvalid = ref(false);
const showAddBoardSection = ref(false);

const boardInputErrorMessage = computed(() => {
  const titleLength = board.value.title.length;
  return titleLength > 70
    ? `Título com ${titleLength}/70 caracteres`
    : titleLength === 0
    ? `Título não deve ser vazio.`
    : "";
});

const boardResponseError =
  "Algo inesperado ocorreu. Por favor, tente novamente.";

const onCancelEditBoardClick = () => {
  showEditMode.value = false;
  onEditBoardResponseError.value = false;
  board.value = store.boards[store.chosenBoardIndex];
};

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

//Analisar um jeito de juntar essas duas funções
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

watch(
  () => board.value.title,
  (title) => {
    if (title.length > 70 || title.length === 0) {
      isTitleLengthInvalid.value = true;
      console.log("ra");
    } else isTitleLengthInvalid.value = false;
  }
);
</script>
<template>
  <div>
    <div>
      <div v-if="store.boards.length">
        <v-row v-if="!showEditMode" no-gutters justify="space-between" dense>
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
              <v-list-item @click="showEditMode = true">
                <v-list-item-title>Editar projeto</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Excluir projeto</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
        <v-row v-else>
          <v-col>
            <v-text-field v-model="board.title" hide-details class="mb-2">
            </v-text-field>
            <p v-if="isTitleLengthInvalid" class="text-red">
              {{ boardInputErrorMessage }}
            </p>
            <v-row no-gutters>
              <v-btn
                @click="onConfirmEditBoardClick"
                :loading="onConfirmEditBoardLoading"
                :disabled="board.title.length === 0 || board.title.length > 70"
                size="small"
                color="primary"
              >
                confirmar
              </v-btn>
              <v-btn @click="onCancelEditBoardClick" size="small">
                cancelar
              </v-btn>
            </v-row>
            <p v-if="onEditBoardResponseError" class="text-red">
              {{ boardResponseError }}
            </p>
          </v-col>
        </v-row>
        <v-row dense no-gutters class="mt-15 flex-nowrap">
          <v-col
            cols="2"
            v-for="section in store.boards[store.chosenBoardIndex].sections"
            :key="section.id"
          >
            <BoardSection :section="section" />
          </v-col>
          <v-col cols="2">
            <AddSectionButton> </AddSectionButton>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <h3>Sem projetos criados, crie um!</h3>
      </div>
    </div>
  </div>
</template>

<style>
.scroll-test {
  background-color: yellow;
  overflow: auto !important;
  /* white-space: nowrap !important; */
}
</style>
