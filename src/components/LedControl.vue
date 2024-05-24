<template>
  <div class="flex justify-center flex-row gap-10 pt-40">
    <!-- TEST1 -->
    <div v-if="isAuthenticated" class="border card w-96 bg-base-100 shadow-xl">
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
    <div v-if="isAuthenticated" class="border card w-96 bg-base-100 shadow-xl">
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
        <div class="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
          <button @click="goToDashboard" class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-md">
            Dashboard
          </button>
          <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import mqtt from 'mqtt';
import { auth } from '../firebaseConfig';

const client = mqtt.connect('wss://test.mosquitto.org:8081');

const test1led1 = ref(false);
const test1led2 = ref(false);
const test2led1 = ref(false);
const test2led2 = ref(false);
const isAuthenticated = ref(false);

client.on('message', (topic, payload) => {
  if (topic === 'TEST1/LED1') {
    test1led1.value = payload.toString() === 'ON';
  } else if (topic === 'TEST1/LED2') {
    test1led2.value = payload.toString() === 'ON';
  } else if (topic === 'TEST2/LED1') {
    test2led1.value = payload.toString() === 'ON';
  } else if (topic === 'TEST2/LED2') {
    test2led2.value = payload.toString() === 'ON';
  }
});

function ledToggle(topic: string, isChecked: boolean) {
  const message = isChecked ? 'ON' : 'OFF';
  client.publish(topic, message);
}

const router = useRouter();

function logout() {
  auth.signOut().then(() => {
    router.push('/login');
  }).catch((error) => {
    console.error('Sign out error:', error);
  });
}

function goToDashboard() {
  router.push('/dashboard');
}

auth.onAuthStateChanged((user) => {
  isAuthenticated.value = !!user;
});

// Check authentication state on component mount
onMounted(() => {
  isAuthenticated.value = !!auth.currentUser;
});
</script>
