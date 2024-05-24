<template>
  <div class="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
    <div class="bg-white p-8 rounded shadow-md max-w-md w-full sm:w-auto flex flex-col items-center">
      <h2 class="text-3xl mb-6 font-bold text-gray-800">Forgot Password</h2>
      <form @submit.prevent="resetPassword" class="space-y-4 w-full">
        <div class="w-full">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" id="email" class="mt-1 p-2 w-full border-gray-300 rounded-md">
        </div>
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-md transition duration-300">Reset Password</button>
        <p v-if="showError" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </form>
      <button @click="goToLogin" class="mt-4 text-blue-500 cursor-pointer">Back to Login</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import router from '../router';

const email = ref("");
const showError = ref(false);
const errorMessage = ref("");

async function resetPassword() {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email.value);
    // Password reset email sent successfully
    // You can add a success message here if needed
  } catch (error) {
    // Check if error is an instance of Error
    if (error instanceof Error) {
      showError.value = true;
      errorMessage.value = error.message;
    } else {
      // If error is not an instance of Error, handle it accordingly
      console.error("Unknown error occurred:", error);
    }
  }
}

function goToLogin() {
  router.push('/login');
}
</script>


<style scoped>
/* Your scoped styles */
input[type="email"],
button {
  outline: none;
}

input[type="email"],
button,
a {
  transition: all 0.3s ease;
}

input[type="email"]:focus {
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
