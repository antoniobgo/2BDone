<script setup>
import { onBeforeMount, onBeforeUnmount } from "vue";
import router from "../router/index.js";
import { useStore } from "@/store/index";
import BoardSection from "@/components/BoardSection.vue";
import BoardService from "@/services/board.service";
import AuthService from "@/services/auth.service";

const store = useStore();

onBeforeMount(() => {
  console.log("rá");
  if (!localStorage.getItem("token")) router.push("login");
  else {
    if (!store.isUserLoggedIn)
      AuthService.loginWithToken().then((user) => {
        if (user)
          store.$patch({
            isUserLoggedIn: true,
            loggedUser: user,
          });
        else router.push("login");
      });
    if (store.boards.length === 0) {
      BoardService.getBoards().then((response) => {
        if (response.status === 200) {
          store.boards = response.data;
          if (store.boards.length > 0) {
            BoardService.getBoardSections(store.boards[0].id).then(
              (response) => {
                if (response.status === 200) {
                  store.sections = response.data;
                  store.sections.forEach((section, index) => {
                    BoardService.getSectionItems(section.id).then(
                      (response) => {
                        if (response.status === 200) {
                          // Verificar se adicionar propriedade nova quebra reatividade
                          store.sections[index].items = response.data;
                        }
                      }
                    );
                  });
                }
              }
            );
          }
        }
      });
    }
  }
});
</script>
<template>
  <div class="pa-10">
    <div v-if="store.boards.length">
      <v-row justify="space-between" dense>
        <p class="text-h4">
          {{ store.boards[store.chosenBoardIndex].title }}
        </p>
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
              <v-list-item-title>editar nome</v-list-item-title>
            </v-list-item>
            <v-list-item @click="onDeleteTaskClick">
              <v-list-item-title>excluir projeto</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
      <v-row dense class="mt-15">
        <!-- TODO: logica do chosenboardid nao funciona mais-->
        <BoardSection
          v-for="section in store.sections"
          :key="section.id"
          :section="section"
        />
      </v-row>
    </div>
    <div v-else>
      <h3>ainda sem projetos amigao</h3>
    </div>
  </div>
</template>
