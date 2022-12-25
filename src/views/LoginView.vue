<script setup>
import { ref, computed, inject } from "vue";
import { useStore } from "@/store/index";
import router from "@/router/index.js";
import AuthService from "../services/auth.service";

const axios = inject("axios");
const store = useStore();
const user = ref({});
const isLoading = ref(false);
const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const rules = {
  counter: (value) =>
    value.length >= 6 || "Senha deve ter no mínimo 6 caracteres.",
  email: (value) => {
    if (user.value.email.length < 5) return true;
    return emailPattern.test(value) || "E-mail inválido.";
  },
};
const loginError = ref(false);
const titleMessage = computed(() => {
  return "Seja bem vindo!";
});
const onCancelClick = () => {
  user.value = {};
  router.push({ name: "home" });
};
const onConfirmClick = () => {
  isLoading.value = true;
  AuthService.login(user.value)
    .then((response) => {
      if (response.status === 202) {
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
        loginError.value = true;
        isLoading.value = false;
        user.value.email = "";
        user.value.password = "";
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
                  :rules="[rules.email]"
                  variant="outlined"
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
