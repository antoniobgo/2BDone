<script setup>
import { ref, computed, inject, onBeforeMount } from "vue";
import { useStore } from "@/store/index";
import BoardSection from "@/components/BoardSection.vue";
import router from "@/router/index.js";
import AuthService from "../services/auth.service";
import BoardService from "../services/board.service";

const axios = inject("axios");
const store = useStore();
const user = ref({});
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);
const titleMessage = computed(() => {
  return "Cadastro";
});
const errorMessage = computed(() => {
  return "Email já em uso.";
});
const isLoading = ref(false);
const showErrorMessage = ref(false);
const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function isButtonDisabled() {
  if (
    !user.value.email ||
    !user.value.password ||
    !user.value.passwordConfirmation
  )
    return true;
  return !(
    emailPattern.test(user.value.email) &&
    user.value.password === user.value.passwordConfirmation
  );
}
const rules = {
  required: (value) => !!value || "Campo obrigatório.",
  counter: (value) =>
    value.length >= 6 || "Senha deve ter no mínimo 6 caracteres.",
  email: (value) => {
    return emailPattern.test(value) || "E-mail inválido.";
  },
  passwordConfirmation: (value) =>
    value === user.value.password || "As senhas devem coincidir.",
};

const onCancelClick = () => {
  user.value = {};
};
const onConfirmClick = () => {
  isLoading.value = true;
  AuthService.register(user.value)
    .then((response) => {
      if (response.status === 201) {
        user.value = {};
        router.push("/login");
      }
      isLoading.value = false;
    })
    .catch((error) => {
      if (error.response.status === 422) showErrorMessage.value = true;
      isLoading.value = false;
      user.value = {};
    });
};

onBeforeMount(() => {
  if (localStorage.getItem("token")) {
    if (store.isUserLoggedIn) router.push({ name: "home" });
    else {
      AuthService.loginWithToken().then((user) => {
        if (user) {
          store.$patch({
            isUserLoggedIn: true,
            loggedUser: user,
          });
        }
      });
      if (store.isUserLoggedIn && store.boards.length === 0)
        BoardService.getBoards().then((response) => {
          if (response.status === 200) store.setBoards(response.data);
        });
      router.push({ name: "home" });
    }
  }
});
</script>
<template>
  <div :class="mdAndUp ? 'pa-10' : 'pa-2'">
    <v-row justify="center" class="mt-15">
      <v-col cols="12" md="5" lg="3" align-self="center">
        <v-card flat>
          <v-card-title>
            <p class="text-h4 mb-5">{{ titleMessage }}</p>
          </v-card-title>
          <v-card-text>
            <v-row no-gutters dense>
              <v-col>
                <p v-if="loginError" class="text-red mb-2">
                  Email ou senha incorretos
                </p>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="user.email"
                  placeholder="Email"
                  :rules="[rules.email]"
                  variant="outlined"
                  density="compact"
                  autocomplete
                />

                <v-text-field
                  v-model="user.password"
                  placeholder="Senha"
                  variant="outlined"
                  :rules="[rules.required, rules.counter]"
                  density="compact"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append-inner="showPassword = !showPassword"
                />
                <v-text-field
                  v-model="user.passwordConfirmation"
                  placeholder="Senha"
                  variant="outlined"
                  :append-inner-icon="
                    showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  :rules="[rules.required, rules.passwordConfirmation]"
                  density="compact"
                  @click:append-inner="
                    showPasswordConfirmation = !showPasswordConfirmation
                  "
                />
                <v-row no-gutters dense>
                  <p v-if="showErrorMessage" class="text-red mb-2">
                    {{ errorMessage }}
                  </p>
                </v-row>
                <v-btn
                  :loading="isLoading"
                  variant="outlined"
                  size="large"
                  class="w-100 bg-primary"
                  :disabled="isButtonDisabled()"
                  @click="onConfirmClick"
                  >Cadastrar</v-btn
                >
                <v-divider class="mt-5" />
                <div class="w-100 d-flex justify-center mt-5">
                  <p>
                    Já tem uma conta?
                    <router-link to="/login">Entre aqui</router-link>
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
