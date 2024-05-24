<template>
  <div class="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
    <div class="bg-white p-8 rounded shadow-md max-w-md w-full">
      <h2 class="text-3xl mb-6 text-center font-bold text-gray-800">Register</h2>
      <form @submit.prevent="registerUser" class="space-y-4">
        <div class="flex flex-col">
          <label for="registerUsername" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input v-model="registerUsername" type="text" id="registerUsername" class="mt-1 p-2 block w-full border-gray-300 rounded-md">
        </div>
        <div class="flex flex-col">
          <label for="registerPassword" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="registerPassword" type="password" id="registerPassword" class="mt-1 p-2 block w-full border-gray-300 rounded-md">
        </div>
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-md transition duration-300">Register</button>
      </form>
      <div class="text-center mt-4">
        <button @click="closeRegisterModal" class="text-blue-500 cursor-pointer">Cancel</button>
        <span class="mx-2 text-gray-700">|</span>
        <button @click="openRegisterModal" class="text-blue-500 cursor-pointer">Login</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth"; // Import createUserWithEmailAndPassword function

export default {
  setup() {
    const router = useRouter();
    const registerUsername = ref("");
    const registerPassword = ref("");

    async function registerUser() {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
          await createUserWithEmailAndPassword(auth, registerUsername.value, registerPassword.value);
          await auth.signOut();
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        }
      } catch (error) {
        console.error(error);
      }
    }

    function closeRegisterModal() {
      router.push("/login");
    }

    function openRegisterModal() {
      router.push("/login");
    }

    return {
      registerUser,
      closeRegisterModal,
      openRegisterModal,
      registerUsername,
      registerPassword,
    };
  },
};
</script>

<style scoped>
/* Your scoped styles */
</style>

<style scoped>
/* Your scoped styles */
input[type="text"],
input[type="password"],
button {
  outline: none;
}

input[type="text"],
input[type="password"],
button,
a {
  transition: all 0.3s ease;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #4a90e2;
}

button {
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

a:hover {
  text-decoration: underline;
}
</style>