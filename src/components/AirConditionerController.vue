<template>
  <div class="full-background bg-gradient-to-r from-blue-400 to-purple-500">
    <div class="flex justify-center items-center">
      <div class="card card-compact w-96 bg-base-100 shadow-xl">
        <figure>
          <img src="https://www.pgsoft.com/uploads/Games/Images/3d1df46f-8b45-4622-9110-6e7b23b819f0.jpg" alt="Air Conditioner" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">Air Conditioner</h2>
          <div class="card-actions justify-between">
            <div class="flex flex-col">
              <div class="form-control w-52">
                <label class="cursor-pointer label">
                  <input type="checkbox" class="toggle toggle-accent" v-model="isOn" @change="togglePower" />
                </label>
              </div>
            </div>
            <div class="flex items-center">
              <button :class="['btn', 'btn-secondary', { 'btn-disabled': !isOn }]" @click="decreaseTemperature" :disabled="!isOn">-</button>
              <span class="mx-2">{{ temperature }}°C</span>
              <button :class="['btn', 'btn-secondary', { 'btn-disabled': !isOn }]" @click="increaseTemperature" :disabled="!isOn">+</button>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-semibold">Sensor Temperature: {{ sensorTemperatureCelsius }}°C / {{ sensorTemperatureFahrenheit }}°F</h3>
          </div>
        </div>
      </div>
      <div class="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
        <button @click="goToDashboard" class="btn btn-primary">Dashboard</button>
        <button @click="logout" class="btn btn-error">Logout</button>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebaseConfig';
import mqtt, { MqttClient } from 'mqtt';

const isOn = ref(false);
const temperature = ref(24);
const sensorTemperatureCelsius = ref(0); // Ref for sensor temperature in Celsius
const sensorTemperatureFahrenheit = ref(0); // Ref for sensor temperature in Fahrenheit
const router = useRouter();
const mqttServer = 'wss://test.mosquitto.org:8081';
const mqttName = 'AirTest';
const sensorTopic = 'AirTest/temperature'; // Define the sensor topic
let client: MqttClient | null = null;

const togglePower = () => {
  if (isOn.value) {
    turnOnAC();
  } else {
    turnOffAC();
  }
};

const increaseTemperature = () => {
  if (isOn.value && temperature.value < 30) {
    temperature.value++;
    sendTemperatureToMQTT();
  }
};

const decreaseTemperature = () => {
  if (isOn.value && temperature.value > 16) {
    temperature.value--;
    sendTemperatureToMQTT();
  }
};

const logout = () => {
  auth.signOut().then(() => {
    router.push('/login');
  }).catch((error: Error) => {
    console.error('Sign out error:', error);
  });
};

const goToDashboard = () => {
  router.push('/dashboard');
};

const connectToMQTT = () => {
  client = mqtt.connect(mqttServer);
  client.on('connect', () => {
    console.log('Connected to MQTT Broker');
    subscribeToSensorTopic();
  });
  client.on('error', (error: Error) => {
    console.error('MQTT Error:', error);
  });
  client.on('message', (topic, message) => {console.log(sensorTopic);
    console.log(message);
    if (topic === sensorTopic) {
      const sensorTempCelsius = parseFloat(message.toString());
      sensorTemperatureCelsius.value = sensorTempCelsius;
      sensorTemperatureFahrenheit.value = (sensorTempCelsius * 9/5) + 32; // Convert to Fahrenheit
    }
  });
};

const subscribeToSensorTopic = () => {
  if (client) {
    client.subscribe(sensorTopic, (err) => {
      if (err) {
        console.error('Subscription error:', err);
      } else {
        console.log('Subscribed to sensor topic');
      }
    });
  }
};

const turnOnAC = () => {
  if (!client) {
    connectToMQTT();
  }
  client = client as MqttClient;
  client.publish(mqttName, 'on');
};

const turnOffAC = () => {
  if (!client) {
    connectToMQTT();
  }
  client = client as MqttClient;
  client.publish(mqttName, 'off');
};

const sendTemperatureToMQTT = () => {
  if (!client) {
    connectToMQTT();
  }
  client = client as MqttClient;
  client.publish(mqttName, temperature.value.toString());
};

onMounted(() => {
  connectToMQTT();
});

onUnmounted(() => {
  if (client) {
    client.end();
  }
});
</script>




<style scoped>
.full-background {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-compact {
  margin: 0 auto;
}

.btn-disabled {
  background-color: #d1d5db; /* Change to desired grey color */
  cursor: not-allowed;
}
</style>
