<script setup>
import { ref, computed, inject } from "vue";
import { useStore } from "@/store";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import router from "@/router/index.js";
import AuthService from "@/services/auth.service";
import BoardService from "@/services/board.service";

const store = useStore();
const { loggedUser } = storeToRefs(store);

const isInLoginView = computed(() => {
  return useRoute().name === "login";
});

const onNavIconClick = () => {
  store.isDrawerActive = !store.isDrawerActive;
};

const onLogoutClick = () => {
  AuthService.logout();
  store.$patch({ isUserLoggedIn: false, loggedUser: {} });
  router.push({ name: "login" });
};
</script>

<template>
  <v-app-bar :color="store.isUserLoggedIn ? 'primary' : '#fafafa'" flat>
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        v-if="store.isUserLoggedIn"
        @click.stop="onNavIconClick"
        class="ml-2"
      ></v-app-bar-nav-icon>
      <v-img
        @click="router.push({ name: 'home' })"
        :src="require('@/assets/done.svg')"
        class="logo ml-15 mr-2"
      />
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
</template>
