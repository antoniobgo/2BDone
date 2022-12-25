<script setup>
import { ref, computed, inject, onMounted } from "vue";
import { useStore } from "./store";
import { storeToRefs } from "pinia";
import router from "@/router/index.js";
import AuthService from "./services/auth.service";
import BoardService from "./services/board.service";

const axios = inject("axios");
const store = useStore();
const showAddBoard = ref(false);
const { loggedUser } = storeToRefs(store);
const newBoard = ref({});
const addBoardIsLoading = ref(false);

const justifyValue = computed(() => {
  return showAddBoard.value ? "start" : "end";
});

const onConfirmAddBoardClick = () => {
  addBoardIsLoading.value = true;
  BoardService.createBoard(newBoard.value).then((response) => {
    if (response.status === 201) {
      store.addBoard(newBoard);
      addBoardIsLoading.value = false;
      newBoard.value = {};
      store.chosenBoardIndex.value = store.boards.length - 1;
    } else if (response.status === 422) {
      addBoardIsLoading.value = false;
    }
  });
  // axios
  //   .post(
  //     "http://localhost:3000/v1/boards",
  //     {
  //       name: newBoard.value.name,
  //       user: newBoard.value.user,
  //     },
  //     {
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     }
  //   )
  //   .then((response) => {
  //     if (response.status === 200) {
  //       //eslint-disable-next-line
  //       debugger;
  //       store.addBoard(newBoard.value);
  //       showAddBoard.value = false;
  //       newBoard.value = {};
  //       addBoardIsLoading.value = false;
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     addBoardIsLoading.value = false;
  //   });
};

const onCancelClick = () => {
  newBoard.value = {};
  showAddBoard.value = false;
};

const drawer = ref(true);

const onLogoutClick = () => {
  AuthService.logout();
  store.$patch({ isUserLoggedIn: false, loggedUser: {} });
  router.push({ name: "login" });
};

const onBoardClick = (index) => {
  store.chosenBoardIndex = index;
};
</script>
<template>
  <v-app>
    <v-app-bar color="primary">
      <template v-slot:prepend>
        <v-row align="center">
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
          <v-btn @click="router.push({ name: 'home' })" icon="mdi-home" />
        </v-row>
      </template>
      <v-app-bar-title>2BDone</v-app-bar-title>
      <v-spacer />
      <div class="d-flex align-center" v-if="store.isUserLoggedIn">
        <v-btn class="mr-2" icon="mdi-account-circle" />
        <p class="mr-10">{{ store.loggedUser.name }}</p>
        <v-btn @click="onLogoutClick" variant="outlined">logout</v-btn>
      </div>
      <v-btn
        v-else
        @click="router.push('login')"
        variant="outlined"
        class="mr-4"
      >
        Entrar
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-if="store.isUserLoggedIn" v-model="drawer" left>
      <v-card flat class="pl-5 pt-5">
        <v-list>
          <v-list-item
            prepend-icon="mdi-calendar-today"
            title="Hoje"
            value="today"
            rounded="xl"
          >
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-calendar-month"
            title="Próximo"
            rounded="xl"
            value="coming"
          />
        </v-list>

        <v-list>
          <v-list-group class="pt-5" value="Projetos">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-folder-outline"
                title="Projetos"
                value="projects"
              ></v-list-item>
            </template>
            <v-row dense no-gutters :justify="justifyValue">
              <v-btn
                v-if="!showAddBoard"
                prepend-icon="mdi-plus-circle-outline"
                @click="showAddBoard = true"
                size="small"
                flat
              />
              <v-col v-else cols="11" class="mb-7">
                <v-text-field
                  v-model="newBoard.title"
                  class="pl-3"
                  variant="outlined"
                  placeholder="Nome do projeto"
                  hide-details
                  density="compact"
                />
                <v-row dense no-gutters justify="end">
                  <v-btn size="x-small" flat @click="onCancelClick">
                    cancelar
                  </v-btn>
                  <v-btn
                    size="x-small"
                    flat
                    @click="onConfirmAddBoardClick"
                    :loading="addBoardIsLoading"
                  >
                    confirmar
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
            <v-list-item
              v-for="(board, index) in store.boards"
              :key="board.id"
              :title="board.title"
              rounded="xl"
              :value="board.title"
              @click="onBoardClick(index)"
            >
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.v-application {
  font-family: "Times New Roman";
}
</style>
