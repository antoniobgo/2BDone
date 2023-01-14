<script setup>
import { ref } from "vue";
import { useStore } from "@/store/index";
import BoardService from "@/services/board.service";

const store = useStore();

const onAddSectionState = ref(false);
const sectionTitle = ref("");
const isAddSectionLoading = ref(false);
const addSectionError = ref(false);

const onCancelAddSectionClick = () => {
  onAddSectionState.value = false;
  sectionTitle.value = "";
  if (addSectionError.value) addSectionError.value = false;
};

const onConfirmAddSectionClick = () => {
  isAddSectionLoading.value = true;
  BoardService.addSection(
    store.boards[store.chosenBoardIndex].id,
    sectionTitle.value
  )
    .then((response) => {
      if (response.status === 201) {
        store.boards[store.chosenBoardIndex].sections.push(response.data);
        if (addSectionError.value) addSectionError.value = false;
        onAddSectionState.value = false;
        sectionTitle.value = "";
      }
    })
    .catch(() => {
      addSectionError.value = true;
    });
  isAddSectionLoading.value = false;
};
</script>

<template>
  <v-btn
    v-if="!onAddSectionState"
    @click="onAddSectionState = true"
    prepend-icon="mdi-plus-circle-outline"
    variant="tonal"
  >
    adicionar seção
  </v-btn>
  <div v-else>
    <v-text-field
      v-model="sectionTitle"
      hide-details
      density="compact"
      variant="outlined"
      label="Nome da seção"
    >
    </v-text-field>
    <v-row v-if="addSectionError" no-gutters dense>
      <p class="text-red">Ocorreu um erro inesperado</p>
      <p class="text-red">Tente novamente</p>
    </v-row>
    <v-row no-gutters class="mt-3">
      <v-btn
        @click="onConfirmAddSectionClick"
        :loading="isAddSectionLoading"
        :disabled="sectionTitle.length === 0 || sectionTitle.length > 70"
        flat
        size="small"
      >
        adicionar
      </v-btn>
      <v-btn @click="onCancelAddSectionClick" flat size="small">
        cancelar
      </v-btn>
    </v-row>
  </div>
</template>
