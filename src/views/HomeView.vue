<script setup>
import { onBeforeMount, watch, ref, computed } from "vue";
import router from "../router/index.js";
import { useStore } from "@/store/index";
import BoardSection from "@/components/main_components/BoardSection.vue";
import AddSectionButton from "@/components/AddSectionButton.vue";
import ShowOrEditBoard from "@/components/ShowOrEditBoard.vue";
import BoardService from "@/services/board.service";
import AuthService from "@/services/auth.service";

const store = useStore();
const board = ref({});

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
  BoardService.getBoards()
    .then((response) => {
      if (response.status === 200) {
        store.boards = response.data;
        if (store.boards.length > 0) {
          board.value.title = response.data[store.chosenBoardIndex].title;
          BoardService.getBoardSections(store.boards[store.chosenBoardIndex].id)
            .then((response) => {
              if (response.status === 200) {
                store.boards[store.chosenBoardIndex].sections = response.data;
                store.boards[store.chosenBoardIndex].sections.forEach(
                  (section, index) => {
                    BoardService.getSectionItems(section.id)
                      .then((response) => {
                        if (response.status === 200) {
                          // Verificar se adicionar propriedade nova quebra reatividade
                          store.boards[store.chosenBoardIndex].sections[
                            index
                          ].items = response.data;
                        }
                      })
                      .catch((error) => {
                        if (error.response) {
                          console.log(
                            "status: " +
                              error.response.status +
                              ", message: " +
                              error.message
                          );
                        }
                      });
                  }
                );
              }
            })
            .catch((error) => {
              if (error.response) {
                console.log(
                  "status: " +
                    error.response.status +
                    ", message: " +
                    error.message
                );
              }
            });
        }
      }
    })
    .catch((error) => {
      if (error.response) {
        console.log(
          "status: " + error.response.status + ", message: " + error.message
        );
      }
    });
};

const getNewSelectedBoardData = () => {
  board.value.title = store.boards[store.chosenBoardIndex].title;
  BoardService.getBoardSections(store.boards[store.chosenBoardIndex].id)
    .then((response) => {
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
    })
    .catch();
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
  <div v-if="store.boards.length" class="overflow-x-auto h-100">
    <ShowOrEditBoard />
    <v-row dense no-gutters class="ml-3 mt-5 flex-nowrap">
      <v-col
        cols="8"
        md="6"
        lg="2"
        v-for="section in store.boards[store.chosenBoardIndex].sections"
        :key="section.id"
      >
        <BoardSection :section="section" />
      </v-col>
      <v-col cols="8" md="6" lg="2">
        <AddSectionButton />
      </v-col>
    </v-row>
  </div>
  <div v-else class="mt-15 ml-15">
    <h3>Você ainda não tem projetos criados.</h3>
  </div>
</template>

<style></style>
