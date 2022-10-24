<script setup>
import { ref, computed, inject } from "vue";
import { useStore } from "@/store/index";
import router from "@/router/index.js";
import AuthService from "../services/auth.service";

const axios = inject("axios");
const store = useStore();
const user = ref({});
const isLoading = ref(false);
const loginError = ref(false);
const dealWithLoginError = () => {};
const titleMessage = computed(() => {
  return "Bem vindo de volta!";
});
const onCancelClick = () => {
  user.value = {};
  router.push({ name: "home" });
};
const onConfirmClick = () => {
  isLoading.value = true;
  AuthService.login(user.value)
    .then((response) => {
      if (response.status === 200) {
        store.$patch({
          isUserLoggedIn: true,
          loggedUser: response.data.user,
        });
        isLoading.value = false;
        router.push({ name: "home" });
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        // dealWithLoginError();
        loginError.value = true;
        isLoading.value = false;
      }
    });
};
</script>
<template>
  <div class="pa-10">
    <v-row justify="center">
      <v-col cols="5">
        <v-card flat>
          <v-card-title>
            <p class="text-h4">{{ titleMessage }}</p>
          </v-card-title>
          <v-card-subtitle>
            <p>Logue sua conta</p>
          </v-card-subtitle>
          <v-card-text>
            <v-row no-gutters dense>
              <v-col cols="7">
                <v-text-field
                  v-model="user.email"
                  placeholder="Email"
                  variant="outlined"
                  hide-details
                  density="compact"
                  class="my-2"
                  autocomplete
                />

                <v-text-field
                  v-model="user.password"
                  placeholder="Senha"
                  variant="outlined"
                  hide-details
                  density="compact"
                  class="my-2"
                  type="password"
                />
              </v-col>
            </v-row>
            <v-col cols="7">
              <v-row no-gutters dense justify="space-between">
                <v-btn
                  variant="outlined"
                  @click="router.push({ name: 'signup' })"
                  >Cadastre-se</v-btn
                >
                <v-btn
                  :loading="isLoading"
                  variant="outlined"
                  @click="onConfirmClick"
                  >entrar</v-btn
                >
              </v-row>
            </v-col>
            <v-col>
              <p v-if="loginError" class="text-red">
                Email ou senha incorretos
              </p>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
