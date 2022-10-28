<script setup>
import { onBeforeMount } from "vue";
import router from "../router/index.js";
import { useStore } from "@/store/index";
import BoardSection from "@/components/BoardSection.vue";
import BoardService from "@/services/board.service";
import AuthService from "@/services/auth.service";

const store = useStore();

const tryLoginUserWithTokens = () => {
  AuthService.loginWithTokens()
    .then((response) => {
      if (response.status === 200)
        store.$patch({
          isUserLoggedIn: true,
          loggedUser: response.data.user,
        });
    })
    .catch((err) => {
      localStorage.removeItem("tokens");
      store.$patch({
        isUserLoggedIn: false,
        loggedUser: {},
      });
      router.push("login");
    });
};

onBeforeMount(() => {
  if (!store.isUserLoggedIn) {
    localStorage.getItem("tokens")
      ? tryLoginUserWithTokens()
      : router.push("login");
  }
  // BoardService.getBoards(store.loggedUser.id).then((response) => {
  //   //eslint-disable-next-line
  //   // debugger;
  //   // store.setBoards(response.data);
  //   store.boards = response.data;
  //   //eslint-disable-next-line
  //   debugger;
  // });
});
</script>
<template>
  <div class="pa-10">
    <div v-if="store.isUserLoggedIn && store.loggedUser.boards.length">
      <v-row justify="space-between" dense>
        <p class="text-h4">
          {{ store.loggedUser.boards[store.chosenBoardIndex].name }}
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
        <!-- <BoardSection
          v-for="section in store.boards[store.chosenBoardId - 1].sections"
          :key="section.name"
          :section="section"
        /> -->
      </v-row>
    </div>
    <div v-else>
      <h3>ainda sem projetos amigao</h3>
    </div>
  </div>
</template>
