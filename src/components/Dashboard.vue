<template>
  <div class="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
    <div class="card w-96 bg-base-100 shadow-xl border-2 border-white-200 rounded-lg p-8">
      <h1 class="text-3xl font-bold text-white mb-8 text-center">Dashboard</h1>

      <figure>
        <img src="https://play-lh.googleusercontent.com/cBtAwCPTvgclnoQrjRjFpZJ1ZWQAjszHJ5oFtwsQxNV06mntHVF3GtG6uDZ1U3B_Sw" alt="Control Panel" class="rounded-t-lg" />
      </figure>
      <div class="card-body">
        <div class="flex flex-col space-y-4 mt-4">
          <router-link to="/led-control" class="btn btn-primary">LED Control</router-link>
          <router-link to="/air-conditioner" class="btn btn-secondary">Air Conditioner Control</router-link>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter();
    const auth = getAuth();

    const logout = () => {
      auth.signOut().then(() => {
        router.push('/login');
      }).catch((error) => {
        console.error('Sign out error:', error);
      });
    };

    return {
      logout,
    };
  },
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-5px);
}
</style>
