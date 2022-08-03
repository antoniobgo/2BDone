<script setup></script>
<template>
  <div class="pa-10">
    <v-row justify="space-between" dense>
      <p class="text-h4">Quadro</p>
      <v-btn flat icon="mdi-dots-vertical"></v-btn>
    </v-row>
    <v-row dense class="mt-15">
      <v-card min-height="300" min-width="300">
        <v-card-title>
          <v-row justify="space-between">
            <div class="d-flex">
              <p>To do</p>
              <p class="ml-3">3</p>
            </div>
            <v-btn flat icon="mdi-dots-vertical"></v-btn>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-sheet>
            <v-row>
              <v-col cols="2"> a </v-col>
              <v-col cols="10"> b </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-row>
  </div>
</template>
