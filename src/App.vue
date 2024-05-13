<template>
  <div v-if="!isLoggedIn" class="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
    <!-- Login Form -->
    <div class="bg-white p-8 rounded shadow-md max-w-md w-full sm:w-auto">
      <h2 class="text-3xl mb-6 text-center font-bold text-gray-800">Login</h2>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input v-model="username" type="text" id="username" class="mt-1 p-2 block w-full border-gray-300 rounded-md">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" id="password" class="mt-1 p-2 block w-full border-gray-300 rounded-md">
        </div>
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-md transition duration-300">Login</button>
        <p v-if="showWarning" class="text-black text-sm mt-2">Please enter both username and password.</p>
        <p class="absolute bottom-6 left-0 mb-4 ml-4 text-gray-700">บริษัทม้าทองจำกัด</p>
        <p class="absolute bottom-0 left-0 mb-4 ml-4 text-gray-700">นายห้าง มักเสี่ยว เจตจรูญ</p>
      </form>
    </div>
  </div>
  <div v-else>
    <!-- Logout Button -->
    <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded fixed bottom-4 right-4">Logout</button>
    <!-- MQTT functionality -->
    <div class="flex justify-center flex-row gap-10 pt-40">
      <!-- TEST1 -->
      <div class="border card w-96 bg-base-100 shadow-xl">
        <figure>
          <img src="https://cdn.coingaming.io/casino-hub88/PGsoft/fortune-ox-thumbnail.jpg" alt="Shoes" />
        </figure>
        <div class="card-body">
          <div class="flex justify-center">
            <h2 class="card-title">TEST1</h2>
          </div>
          <div class="flex flex-col pl-14">
            <div class="form-control w-52">
              <label class="cursor-pointer label">
                <span class="label-text">LED1</span>
                <input type="checkbox" v-model="test1led1" class="toggle toggle-accent" @change="ledToggle('TEST1/LED1', test1led1)" />
              </label>
            </div>
            <div class="form-control w-52">
              <label class="cursor-pointer label">
                <span class="label-text">LED2</span>
                <input type="checkbox" v-model="test1led2" class="toggle toggle-accent" @change="ledToggle('TEST1/LED2', test1led2)" />
              </label>
            </div>
          </div>
          <div class="card-actions justify-end"></div>
        </div>
      </div>
      <!-- TEST2 -->
      <div class="border card w-96 bg-base-100 shadow-xl">
        <figure>
          <img src="https://cdn.hub88.io/pgsoft/pgs_fortunemouse.jpg" alt="Shoes" />
        </figure>
        <div class="card-body">
          <div class="flex justify-center">
            <h2 class="card-title">TEST2</h2>
          </div>
          <div class="flex flex-col pl-14">
            <div class="form-control w-52">
              <label class="cursor-pointer label">
                <span class="label-text">LED1</span>
                <input type="checkbox" v-model="test2led1" class="toggle toggle-accent" @change="ledToggle('TEST2/LED1', test2led1)" />
              </label>
            </div>
            <div class="form-control w-52">
              <label class="cursor-pointer label">
                <span class="label-text">LED2</span>
                <input type="checkbox" v-model="test2led2" class="toggle toggle-accent" @change="ledToggle('TEST2/LED2', test2led2)" />
              </label>
            </div>
          </div>
          <div class="card-actions justify-end"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import mqtt from "mqtt";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import Swal from "sweetalert2";

// Firebase authentication
const auth = getAuth();
const isLoggedIn = ref(false);
const username = ref("");
const password = ref("");
const showWarning = ref(false);

// MQTT connection
const client = mqtt.connect("wss://test.mosquitto.org:8081");

// MQTT topics
client.subscribe("TEST1/LED1");
client.subscribe("TEST1/LED2");
client.subscribe("TEST2/LED1");
client.subscribe("TEST2/LED2");

// MQTT state
const test1led1 = ref(false);
const test1led2 = ref(false);
const test2led1 = ref(false);
const test2led2 = ref(false);

client.on("message", (topic, payload) => {
  if (topic === "TEST1/LED1") {
    test1led1.value = payload.toString() === "ON";
  } else if (topic === "TEST1/LED2") {
    test1led2.value = payload.toString() === "ON";
  } else if (topic === "TEST2/LED1") {
    test2led1.value = payload.toString() === "ON";
  } else if (topic === "TEST2/LED2") {
    test2led2.value = payload.toString() === "ON";
  }

  console.log(topic, payload.toString());
});

// Function to toggle LED status
function ledToggle(topic: string, isChecked: boolean) {
  const message = isChecked ? "ON" : "OFF";
  client.publish(topic, message);
  console.log(`Toggle switch: ${topic} - ${message}`);
}

// Login function
async function login() {
  try {
    await signInWithEmailAndPassword(auth, username.value, password.value);
  } catch (error: any) {
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      Swal.fire({ icon: "error", title: "Fail", text: "Invalid username or password" });
    } else {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
    return;
  }
}

// Logout function
async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
  }


// Clear form fields function

}

// Listen for authentication state changes
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});
</script>

<style scoped>
/* Your scoped styles */
</style>
