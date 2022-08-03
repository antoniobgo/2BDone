<script setup>
import { ref } from "vue";

const drawer = ref(true);
</script>
<template>
  <v-app>
    <v-app-bar color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>2BDone</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" left>
      <v-row no-gutters>
        <p>alo</p>
      </v-row>
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
