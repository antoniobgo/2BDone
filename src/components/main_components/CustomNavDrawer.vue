<script setup>
import { ref, computed, inject } from "vue";
import { useStore } from "@/store";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import router from "@/router/index.js";
import AuthService from "@/services/auth.service";
import BoardService from "@/services/board.service";

const store = useStore();
const showAddBoardField = ref(false);
const newBoard = ref({});
const addBoardIsLoading = ref(false);
const addBoardError = ref(false);

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

const onCancelClick = () => {
  newBoard.value = {};
  showAddBoardField.value = false;
};

const setChosenBoardIndex = (index) => {
  store.chosenBoardIndex = index;
};
</script>

<template>
  <v-navigation-drawer
    v-if="store.isUserLoggedIn"
    v-model="store.isDrawerActive"
    left
  >
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

      <v-list :opened="['Projetos']">
        <v-list-group class="pt-5" value="Projetos">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-folder-outline"
              title="Projetos"
              value="projects"
            ></v-list-item>
          </template>
          <v-row dense no-gutters justify="center">
            <v-btn
              v-if="!showAddBoardField"
              prepend-icon="mdi-plus-circle-outline"
              @click="showAddBoardField = true"
              flat
              size="small"
              >Criar Projeto</v-btn
            >
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
            @click="setChosenBoardIndex(index)"
          >
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
  </v-navigation-drawer>
</template>
