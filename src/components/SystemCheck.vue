<template>
  <div class="container">
    <!-- ปุ่ม Logout และ Dashboard ไปไว้ที่มุมขวาบน -->
    <div class="top-right-buttons">
      <button @click="goToDashboard" class="dashboard-button">DASHBOARD</button>
      <button @click="logout" class="logout-button">LOGOUT</button>
    </div>

    <h1 class="title">SYSTEM CHECK</h1>

    <div class="table-container">
      <div class="table-wrapper" v-for="(group, index) in sensorGroups" :key="index">
        <table class="sensor-table">
          <thead>
            <tr>
              <th>Sensor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sensor in group" :key="sensor.id">
              <td>{{ sensor.name }}</td>
              <td>{{ getStatusText(sensor.status) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ปุ่มเพิ่มเซ็นเซอร์ ขยับลงเล็กน้อย -->
    <div class="button-container">
      <button @click="addSensor" class="add-sensor-button">ADD SENSOR</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import mqtt from "mqtt";
import { auth } from "../firebaseConfig";

const router = useRouter();
const client = mqtt.connect("wss://test.mosquitto.org:8081");

const sensors = ref([
  { id: 1, name: "Sensor 1", status: "" },
  { id: 2, name: "Sensor 2", status: "" },
  { id: 3, name: "Sensor 3", status: "" },
  { id: 4, name: "Sensor 4", status: "" },
  { id: 5, name: "Sensor 5", status: "" },
  { id: 6, name: "Sensor 6", status: "" },
  { id: 7, name: "Sensor 7", status: "" },
  { id: 8, name: "Sensor 8", status: "" },
  { id: 9, name: "Sensor 9", status: "" },
  { id: 10, name: "Sensor 10", status: "" },
]);

const sensorGroups = ref([]);

const splitSensors = () => {
  const mid = Math.ceil(sensors.value.length / 2);
  sensorGroups.value = [sensors.value.slice(0, mid), sensors.value.slice(mid)];
};

client.on("connect", () => {
  console.log("✅ MQTT Connected");
  sensors.value.forEach((sensor) => {
    client.subscribe(`kmitl/project/irsensor/${sensor.id}`);
  });
});

client.on("message", (topic, message) => {
  const sensorId = parseInt(topic.replace("kmitl/project/irsensor/", ""));
  const sensor = sensors.value.find((s) => s.id === sensorId);
  if (sensor) sensor.status = message.toString();
});

const getStatusText = (status) => {
  if (!status) return "ยังไม่เชื่อมต่อกับระบบ";
  return status === "1" ? "ตรวจพบรถยนต์" : "ตรวจไม่พบรถยนต์";
};

const addSensor = () => {
  const newId = sensors.value.length + 1;
  sensors.value.push({ id: newId, name: `Sensor ${newId}`, status: "" });
  client.subscribe(`kmitl/project/irsensor/${newId}`);
  splitSensors();
};

onMounted(() => {
  if (!auth.currentUser) router.push("/login");
  splitSensors();
});

const logout = () => {
  auth.signOut().then(() => router.push("/login"));
};

const goToDashboard = () => {
  router.push("/dashboard");
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: white;
  padding: 20px;
}

/* ปุ่ม Logout และ Dashboard ไปไว้ที่มุมขวาบน */
.top-right-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.logout-button {
  background: linear-gradient(to right, #ff5733, #ff8d72);
  color: black;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
}

.dashboard-button {
  background: linear-gradient(to right, #b2f7ef, #7b8df2);
  color: black;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-transform: uppercase;
  color: #0047AB;
}

.table-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.sensor-table {
  border-collapse: collapse;
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 2px solid #2E8B57;
}

.sensor-table th {
  background: #2E8B57;
  padding: 14px;
  color: white;
}

.sensor-table td {
  border: 1px solid #2E8B57;
  padding: 12px;
  background: #E0F7FA;
}

/* ปุ่มเพิ่มเซ็นเซอร์ ขยับลงเล็กน้อย */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.add-sensor-button {
  background: linear-gradient(to right, #57ff33, #72ff8d);
  color: black;
  padding: 12px 22px;
  border-radius: 30px;
  transition: all 0.3s;
  margin-top: 15px; /* เพิ่มระยะห่างด้านบน */
}
</style>
