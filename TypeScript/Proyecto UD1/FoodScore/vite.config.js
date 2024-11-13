import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        profile: resolve(__dirname, 'profile.html'),
        register: resolve(__dirname, 'register.html'),
        newEvent: resolve(__dirname, 'new-restaurant.html'),
        eventDetail: resolve(__dirname, 'restaurant-detail.html'),
      },
    },
  },
})