<template>
  <div class="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
    <div class="bg-white p-8 rounded shadow-md max-w-md w-full sm:w-auto flex flex-col items-center">
      <h2 class="text-3xl mb-6 font-bold text-gray-800">Forgot Password</h2>
      <form @submit.prevent="resetPassword" class="space-y-4 w-full">
        <div class="w-full">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" id="email" class="mt-1 p-3 w-full bg-white text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-md transition duration-300">Reset Password</button>
        <p v-if="showError" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </form>
      <button @click="goToLogin" class="mt-4 text-blue-500 cursor-pointer hover:opacity-80 transition duration-300">Back to Login</button>
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

// Function to reset password via email
async function resetPassword() {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email.value);
    // Password reset email sent successfully
    // You can add a success message here if needed
  } catch (error) {
    if (error instanceof Error) {
      showError.value = true;
      errorMessage.value = error.message;
    } else {
      console.error("Unknown error occurred:", error);
    }
  }
}

// Function to navigate back to login page
function goToLogin() {
  router.push('/login');
}
</script>

<style scoped>
/* Custom font and colors for the entire page */
body {
  font-family: 'Arial', sans-serif; /* Change the font */
}

/* Input styling */
input[type="email"] {
  outline: none;
  background-color: white;
  color: black;
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

input[type="email"]:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(72, 108, 232, 0.3);
}

/* Button styling */
button {
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  opacity: 0.8;
}

/* Link hover styling */
a:hover {
  text-decoration: underline;
}

/* Error message styling */
p {
  font-size: 0.875rem;
}
</style>
