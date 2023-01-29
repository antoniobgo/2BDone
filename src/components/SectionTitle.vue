<script setup>
import { defineProps, computed, ref } from "vue";
import { useStore } from "@/store/index";
import BoardService from "@/services/board.service";

const store = useStore();
const props = defineProps(["section"]);

const newSectionTitle = ref(props.section.title);
const isOnSectionEditState = ref(false);
const onConfirmEditSectionLoading = ref(false);
const onEditSectionResponseError = ref(false);
const onDeleteSectionResponseError = ref(false);

const isTitleLengthInvalid = computed(() => {
  return (
    newSectionTitle.value.length === 0 || newSectionTitle.value.length > 70
  );
});

const sectionItemsLength = computed(() =>
  props.section.items ? props.section.items.length : 0
);

const sectionInputErrorMessage = computed(() => {
  const titleLength = newSectionTitle.value.length;
  return titleLength > 70
    ? `Título com ${titleLength}/70 caracteres`
    : titleLength === 0
    ? `Título não deve ser vazio.`
    : "";
});

const onConfirmEditSectionClick = () => {
  onConfirmEditSectionLoading.value = true;
  const newSection = { id: props.section.id, title: newSectionTitle.value };
  BoardService.editSection(newSection)
    .then((response) => {
      if (response.status === 200) {
        let sectionIndex = store.boards[
          store.chosenBoardIndex
        ].sections.indexOf(props.section);
        store.boards[store.chosenBoardIndex].sections[sectionIndex].title =
          response.data.section.title;
        isOnSectionEditState.value = false;
        if (onEditSectionResponseError.value)
          onEditSectionResponseError.value = false;
      }
    })
    .catch((response) => {
      onEditSectionResponseError.value = true;
    })
    .finally(() => {
      onConfirmEditSectionLoading.value = false;
    });
};

const onCancelEditSectionClick = () => {
  newSectionTitle.value = props.section.title;
  isOnSectionEditState.value = false;
};

const onDeleteSectionClick = () => {
  BoardService.deleteSection(props.section.id)
    .then((response) => {
      if (response.status === 204) {
        if (onDeleteSectionResponseError.value)
          onDeleteSectionResponseError.value = false;
        let sectionIndex = store.boards[
          store.chosenBoardIndex
        ].sections.indexOf(props.section);
        store.boards[store.chosenBoardIndex].sections.splice(sectionIndex, 1);
      }
    })
    .catch(() => {
      onDeleteSectionResponseError.value = true;
    });
};
</script>

<template>
  <v-row
    v-if="!isOnSectionEditState"
    no-gutters
    justify="space-between"
    align="center"
  >
    <v-col>
      <div class="d-flex">
        <p>{{ props.section.title }}</p>
        <p class="ml-2 small-text grey-color">{{ sectionItemsLength }}</p>
      </div>
    </v-col>
    <v-col cols="2">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            flat
            icon="mdi-dots-horizontal grey-color"
          ></v-btn>
        </template>

        <v-list>
          <v-list-item @click="isOnSectionEditState = !isOnSectionEditState">
            <v-list-item-title>Editar seção</v-list-item-title>
          </v-list-item>
          <v-list-item @click="onDeleteSectionClick">
            <v-list-item-title>Excluir seção</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
    <v-col v-if="onDeleteSectionResponseError" cols="12">
      <p class="text-red input-error ml-1">An unexpected error occured.</p>
      <p class="text-red input-error ml-1 mb-1">Please, try again.</p>
    </v-col>
  </v-row>
  <v-row v-else no-gutters justify="start">
    <v-col cols="12">
      <v-text-field
        v-model="newSectionTitle"
        variant="outlined"
        hide-details
        density="compact"
        class="m-2 pr-4 pl-1"
      />
      <div
        v-if="onEditSectionResponseError || isTitleLengthInvalid"
        class="d-flex flex-wrap"
      >
        <p v-if="isTitleLengthInvalid" class="text-red input-error ml-1">
          {{ sectionInputErrorMessage }}
        </p>
        <div v-if="onEditSectionResponseError">
          <p class="text-red input-error ml-1">An unexpected error occured.</p>
          <p class="text-red input-error ml-1 mb-1">Please, try again.</p>
        </div>
      </div>
    </v-col>
    <div class="d-flex ml-1 my-2">
      <v-btn
        @click="onConfirmEditSectionClick"
        :loading="onConfirmEditSectionLoading"
        :disabled="newSectionTitle.length === 0 || newSectionTitle.length > 70"
        size="small"
        color="primary "
        class="mr-2"
      >
        confirmar
      </v-btn>
      <v-btn variant="plain" @click="onCancelEditSectionClick" size="small">
        cancelar
      </v-btn>
    </div>
  </v-row>
</template>

<style scoped>
.input-error {
  font-size: 12px;
  line-height: 14px;
}
</style>
