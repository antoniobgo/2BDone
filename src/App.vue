<script setup>
import { ref, computed } from "vue";
import { useStore } from "./store";
import router from "@/router/index.js";

const store = useStore();
const showAddBoard = ref(false);
const boards = ref(store.boards);
const newBoard = ref({});

const justifyValue = computed(() => {
  return showAddBoard.value ? "start" : "end";
});

const onConfirmAddBoardClick = () => {
  store.addBoard(newBoard);
  newBoard.value = {};
  showAddBoard.value = false;
};

const onCancelClick = () => {
  newBoard.value = {};
  showAddBoard.value = false;
};

const drawer = ref(true);
</script>
<template>
  <v-app>
    <v-app-bar color="primary">
      <template v-slot:prepend>
        <v-row align="center">
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
          <v-btn icon="mdi-home" />
        </v-row>
      </template>
      <v-app-bar-title>2BDone</v-app-bar-title>
      <v-spacer />
      <v-btn
        v-if="store.isUserLoggedIn"
        class="mr-4"
        icon="mdi-account-circle"
      />
      <v-btn
        @click="router.push('login')"
        variant="outlined"
        v-else
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
                  v-model="newBoard.name"
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
                  <v-btn size="x-small" flat @click="onConfirmAddBoardClick">
                    confirmar
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
            <v-list-item
              v-for="board in boards"
              :key="board.id"
              :title="board.name"
              rounded="xl"
              :value="board.id"
              @click="store.chosenBoardId = board.id"
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
