<script setup>
import { ref, computed, inject } from "vue";
import { useStore } from "./store";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import router from "@/router/index.js";
import AuthService from "./services/auth.service";
import BoardService from "./services/board.service";

const axios = inject("axios");
const store = useStore();
const showAddBoardField = ref(false);
const { loggedUser } = storeToRefs(store);
const newBoard = ref({});
const addBoardIsLoading = ref(false);

const justifyValue = computed(() => {
  return showAddBoardField.value ? "start" : "end";
});

const isInLoginView = computed(() => {
  return useRoute().name === "login";
});

const onConfirmAddBoardClick = () => {
  addBoardIsLoading.value = true;
  BoardService.createBoard(newBoard.value)
    .then((response) => {
      if (response.status === 201) {
        if (addBoardError.value) addBoardError.value = false;
        store.addBoard(newBoard.value);
        newBoard.value = {};
        showAddBoardField.value = false;
      }
    })
    .catch((error) => {
      addBoardError.value = true;
    })
    .finally(() => {
      addBoardIsLoading.value = false;
    });
};

const addBoardError = ref(false);

const onCancelClick = () => {
  newBoard.value = {};
  showAddBoardField.value = false;
};

const drawer = ref(true);

const onLogoutClick = () => {
  AuthService.logout();
  store.$patch({ isUserLoggedIn: false, loggedUser: {} });
  router.push({ name: "login" });
};

const onBoardClick = (board, index) => {
  store.chosenBoardIndex = index;
  BoardService.getBoardSections(board.id).then((response) => {
    // not sure this index is correct yet
    if (response.status === 200) store.boards[index].sections = response.data;
  });
};
</script>
<template>
  <v-app>
    <v-app-bar :color="store.isUserLoggedIn ? 'primary' : '#fafafa'" flat>
      <template v-slot:prepend>
        <v-row align="center">
          <v-app-bar-nav-icon
            v-if="store.isUserLoggedIn"
            @click.stop="drawer = !drawer"
            class="ml-2"
          ></v-app-bar-nav-icon>
          <v-img
            @click="router.push({ name: 'home' })"
            :src="require('@/assets/done.svg')"
            class="logo ml-15 mr-2"
          />
        </v-row>
      </template>
      <v-app-bar-title>
        <p :class="store.isUserLoggedIn ? 'text-white' : 'text-primary'">
          2BDone
        </p>
      </v-app-bar-title>
      <v-spacer />
      <div
        class="d-flex align-center"
        v-if="store.isUserLoggedIn && !isInLoginView"
      >
        <v-btn class="mr-2" icon="mdi-account-circle" />

        <p class="mr-10">{{ store.loggedUser.email }}</p>
        <v-btn @click="onLogoutClick" variant="outlined" class="mr-4"
          >logout</v-btn
        >
      </div>
      <div v-else>
        <v-btn
          v-if="!isInLoginView"
          @click="router.push('login')"
          variant="outlined"
          class="mr-4"
          color="primary"
        >
          Entrar
        </v-btn>
      </div>
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
                v-if="!showAddBoardField"
                prepend-icon="mdi-plus-circle-outline"
                @click="showAddBoardField = true"
                size="small"
                flat
              />
              <v-col v-else cols="11" class="mb-7">
                <v-text-field
                  v-model="newBoard.title"
                  class="pl-3"
                  type="input"
                  variant="outlined"
                  placeholder="Nome do projeto"
                  density="compact"
                  :error-messages="
                    addBoardError ? 'Por favor, tente novamente.' : false
                  "
                  :error="addBoardError"
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
                    :disabled="!newBoard.title || newBoard.title.length === 0"
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
              @click="onBoardClick(board, index)"
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
.logo {
  height: auto;
  width: 35px;
}
.logo:hover {
  cursor: pointer;
}
</style>
