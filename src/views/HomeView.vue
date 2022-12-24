<script setup>
import { onBeforeMount } from "vue";
import router from "../router/index.js";
import { useStore } from "@/store/index";
import BoardSection from "@/components/BoardSection.vue";
import BoardService from "@/services/board.service";
import AuthService from "@/services/auth.service";

const store = useStore();

const tryLoginUserWithTokens = () => {
  // AuthService.loginWithToken()
  //   .then((response) => {
  //     if (response.status === 200)
  //       store.$patch({
  //         isUserLoggedIn: true,
  //         loggedUser: response.data.user,
  //       });
  //   })
  //   .catch((err) => {
  //     localStorage.removeItem("token");
  //     store.$patch({
  //       isUserLoggedIn: false,
  //       loggedUser: {},
  //     });
  //     router.push("login");
  //   });
};

onBeforeMount(() => {
  if (!store.isUserLoggedIn) {
    // localStorage.getItem("token")
    //   ? tryLoginUserWithTokens()
    //   : router.push("login");
    if (!localStorage.getItem("token")) router.push("login");
    AuthService.loginWithToken().then((user) => {
      if (user)
        store.$patch({
          isUserLoggedIn: true,
          loggedUser: user,
        });
      else router.push("login");
    });
    BoardService.getBoards().then((response) => {
      //eslint-disable-next-line
      // debugger;
      if (response.status === 200) store.setBoards(response.data);
    });
  }
});
</script>
<template>
  <div class="pa-10">
    <div v-if="store.isUserLoggedIn && store.boards.length">
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
