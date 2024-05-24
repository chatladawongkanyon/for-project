<template>
  <div class="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
    <div class="bg-white p-8 rounded shadow-md max-w-md w-full sm:w-auto flex flex-col items-center">
      <h2 class="text-3xl mb-6 font-bold text-gray-800">Login</h2>
      <form @submit.prevent="login" class="space-y-4 w-full">
        <div class="w-full">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input v-model="username" type="text" id="username" class="mt-1 p-2 w-full border-gray-300 rounded-md">
        </div>
        <div class="w-full">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" id="password" class="mt-1 p-2 w-full border-gray-300 rounded-md">
        </div>
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-md transition duration-300">Login</button>
        <p v-if="showWarning" class="text-red-500 text-sm mt-2">Please enter both username and password.</p>
        <!--        <p class="text-gray-700 mb-4">บริษัทม้าทองจำกัด</p>-->
        <!--        <p class="text-gray-700 mb-8">นายห้าง มักเสี่ยว เจตจรูญ</p>-->
      </form>
      <div class="text-center mt-4">
        <button @click="openRegisterModal" class="text-blue-500 cursor-pointer">Register</button>
        <span class="mx-2 text-gray-700">|</span>

        <button @click="openForgotPasswordModal" class="text-blue-500 cursor-pointer">Forgot Password</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Properties
const router = useRouter();
const username = ref("");
const password = ref("");
const showWarning = ref(false);

// Methods
function login() {
  const auth = getAuth();

  signInWithEmailAndPassword(auth, username.value, password.value)
      .then(() => {
        // Signed in successfully, navigate to LedControlView.vue
        router.push("/dashboard");
      })
      .catch((error) => {
        // Display error message if login fails
        showWarning.value = true;
        console.error("Login error:", error.code, error.message);
      });
}

function openRegisterModal() {
  // Navigate to RegisterFormView.vue when Register button is clicked
  router.push("/register");
}

function openForgotPasswordModal() {
  // Navigate to ForgotPasswordView.vue when Forgot Password button is clicked
  router.push("/forgot-password");
}
</script>

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
