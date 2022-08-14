import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import axios from "axios";
import VueAxios from "vue-axios";

loadFonts();

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(vuetify);
app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);
app.mount("#app");
