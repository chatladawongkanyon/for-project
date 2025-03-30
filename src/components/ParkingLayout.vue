<template>
  <div class="container">
    <div class="top-right-buttons">
      <button @click="goToDashboard" class="dashboard-button">DASHBOARD</button>
      <button @click="logout" class="logout-button">LOGOUT</button>
    </div>

    <div class="status-container">
      <div class="status"><div class="status-box available"></div> Available</div>
      <div class="status"><div class="status-box occupied"></div> Occupied</div>
    </div>

    <div class="counter-container">
      <span>Current Car Count: {{ inCarCount }}</span>
    </div>

    <div class="parking-layout">
      <div v-for="(row, rowIndex) in parkingRows" :key="rowIndex" class="parking-row">
        <draggable v-model="parkingRows[rowIndex]" group="parking-group" item-key="id" class="parking-row">
          <template #item="{ element }">
            <div v-if="element.type === 'lane'"
             :class="['parking-slot', element.type, { 'lane-block': isLaneBlock(rowIndex, element), occupied: element.occupied, available: !element.occupied }, 'rotated-' + element.rotated]"

              @click="toggleLaneDirection(element.id)">
              <span class="arrow">➡️</span>
            </div>
            <div v-else
              :class="['parking-slot', element.type, { occupied: element.occupied, available: !element.occupied }]">
              {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <div class="config-panel">
      <div class="config-tools">
        <button @click="addNewRow" class="config-button">➕ Add Row</button>
        <button @click="addParkingSlot" class="config-button">➕ Add Parking</button>
        <button @click="addLane" class="config-button">➡️ Add Lane</button>
        <button @click="addEntrance" class="config-button entrance">🚗 Entrance</button>
        <button @click="addExit" class="config-button exit">🚪 Exit</button>
        <button @click="removeRow" class="config-button">❌ Remove Row</button>
        <button @click="removeLastElement" class="config-button">🗑️ Remove Last Element</button>
        <button @click="publishLayout" class="config-button">🔄 Publish Layout</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import mqtt from 'mqtt'
import draggable from 'vuedraggable'
import { auth } from '../firebaseConfig'

const router = useRouter()
const client = mqtt.connect('wss://test.mosquitto.org:8081')

const isAuthReady = ref(false)  // เพิ่มตัวนี้

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login")
    } else {
      isAuthReady.value = true

      // ทำ MQTT และอื่น ๆ ที่เกี่ยวข้องที่นี่
      client.on("connect", () => {
        parkingRows.value.flat().forEach(slot => slot.topic && client.subscribe(slot.topic))
        client.subscribe("kmitl/project/irsensor/9")
        client.subscribe("kmitl/project/irsensor/10")
        publishLayout()
      })

      client.on("message", (topic, message) => {
        const msg = message.toString().trim()
        const now = Date.now()
        if (topic.endsWith("/9")) handleSensor(msg, ir9Prev, ir9Count, now, () => lastIR9Time = now)
        else if (topic.endsWith("/10")) handleSensor(msg, ir10Prev, ir10Count, now, () => lastIR10Time = now)
        else {
          const id = parseInt(topic.split("/").pop())
          const sensor = parkingRows.value.flat().find(s => s.topic?.endsWith(id))
          if (sensor) sensor.occupied = msg === "1"
        }
      })
    }
  })
})


// Car Count & Debounce
const ir9Prev = ref("0"), ir10Prev = ref("0"), ir9Count = ref(0), ir10Count = ref(0), inCarCount = ref(0)
const debounceMs = 1000
let lastIR9Time = 0, lastIR10Time = 0

// Layout
const defaultLayout = [
  [
    { id: 1, name: "P1", topic: "kmitl/project/irsensor/1", occupied: false, type: 'parking' },
    { id: 2, name: "P2", topic: "kmitl/project/irsensor/2", occupied: false, type: 'parking' },
    { id: 3, name: "P3", topic: "kmitl/project/irsensor/3", occupied: false, type: 'parking' },
    { id: 4, name: "P4", topic: "kmitl/project/irsensor/4", occupied: false, type: 'parking' }
  ],
  [
    { id: "entrance", name: "Entrance", occupied: false, type: 'entrance' },
    { id: "lane", name: "Lane", occupied: false, type: 'lane', rotated: 0 },
    { id: "exit", name: "Exit", occupied: false, type: 'exit' }
  ],
  [
    { id: 5, name: "P5", topic: "kmitl/project/irsensor/5", occupied: false, type: 'parking' },
    { id: 6, name: "P6", topic: "kmitl/project/irsensor/6", occupied: false, type: 'parking' },
    { id: 7, name: "P7", topic: "kmitl/project/irsensor/7", occupied: false, type: 'parking' },
    { id: 8, name: "P8", topic: "kmitl/project/irsensor/8", occupied: false, type: 'parking' }
  ]
]

const parkingRows = ref(JSON.parse(localStorage.getItem("parkingLayout")) || defaultLayout)

watch(parkingRows, val => {
  localStorage.setItem("parkingLayout", JSON.stringify(val))
}, { deep: true })

import { onAuthStateChanged } from 'firebase/auth'

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login")
      return
    }

    // 👇 move all logic here
    client.on("connect", () => {
      console.log("✅ MQTT Connected")
      parkingRows.value.flat().forEach(slot => slot.topic && client.subscribe(slot.topic))
      client.subscribe("kmitl/project/irsensor/9")
      client.subscribe("kmitl/project/irsensor/10")
      publishLayout()
    })

    client.on("message", (topic, message) => {
      const msg = message.toString().trim()
      const now = Date.now()
      if (topic.endsWith("/9")) handleSensor(msg, ir9Prev, ir9Count, now, () => lastIR9Time = now)
      else if (topic.endsWith("/10")) handleSensor(msg, ir10Prev, ir10Count, now, () => lastIR10Time = now)
      else {
        const id = parseInt(topic.split("/").pop())
        const sensor = parkingRows.value.flat().find(s => s.topic?.endsWith(id))
        if (sensor) sensor.occupied = msg === "1"
      }
    })
  })
})

function handleSensor(msg, prevRef, countRef, now, updateTime) {
  if (msg === "1" && prevRef.value === "0" && now - (updateTime === lastIR9Time ? lastIR9Time : lastIR10Time) > debounceMs) {
    countRef.value++
    updateTime()
    updateInCarCount()
  }
  prevRef.value = msg
}
function updateInCarCount() {
  inCarCount.value = Math.max(0, ir9Count.value - ir10Count.value)
}
function logout() {
  auth.signOut().then(() => router.push("/login"))
}
function goToDashboard() {
  router.push("/dashboard")
}
function publishLayout() {
  client.publish("kmitl/project/parking-layout", JSON.stringify(parkingRows.value), { retain: true })
}
function addParkingSlot() {
  const allSlots = parkingRows.value.flat()
  const parkingNames = allSlots
    .filter(s => s.type === 'parking' && s.name.startsWith('P'))
    .map(s => parseInt(s.name.replace('P', '')))
    .filter(n => !isNaN(n))

  const nextNumber = parkingNames.length > 0 ? Math.max(...parkingNames) + 1 : 1
  const newSlot = {
    id: Date.now(), // ป้องกันซ้ำ
    name: `P${nextNumber}`,
    topic: `kmitl/project/irsensor/${nextNumber}`,

    occupied: false,
    type: 'parking'
  }

  parkingRows.value.at(-1).push(newSlot)
  client.subscribe(newSlot.topic)
  publishLayout()
}
function addNewRow() {
  parkingRows.value.push([])
  publishLayout()
}
function removeRow() {
  if (parkingRows.value.length > 1) parkingRows.value.pop()
  publishLayout()
}
function addEntrance() {
  parkingRows.value[1].unshift({ id: "entrance", name: "Entrance", occupied: false, type: 'entrance' })
  publishLayout()
}
function addExit() {
  parkingRows.value[1].push({ id: "exit", name: "Exit", occupied: false, type: 'exit' })
  publishLayout()
}
function addLane() {
  parkingRows.value[0].splice(1, 0, { id: `lane-${Date.now()}`, name: "Lane", occupied: false, type: 'lane', rotated: 0 })
  publishLayout()
}
function removeLastElement() {
  for (let i = parkingRows.value.length - 1; i >= 0; i--) {
    if (parkingRows.value[i].length > 0) {
      parkingRows.value[i].pop()
      publishLayout()
      break
    }
  }
}
function toggleLaneDirection(id) {
  const lane = parkingRows.value.flat().find(s => s.id === id && s.type === 'lane')
  if (lane) lane.rotated = (lane.rotated + 1) % 4
  publishLayout()
}
function isLaneBlock(rowIndex, element) {
  const row = parkingRows.value[rowIndex]
  const index = row.indexOf(element)
  return index > 0 && row[index - 1].type === 'lane'
}
</script>

<style scoped>
/* ย่อความยาว: ใช้ style เดิมทั้งหมด เช่นเดียวกับในไฟล์ก่อนหน้า
   รวมถึง media query สำหรับ mobile ที่ responsive */
</style>


<style scoped>
/* Responsive for layout rows */
.parking-layout {
  width: 100%;
  overflow-x: auto;
  padding: 10px 0;
}
.parking-row {
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 10px;
}

/* Responsive for parking slots */
.parking-slot,
.lane,
.entrance,
.exit {
  flex-shrink: 0;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to right, #3a7bd5, #3a6073);
  padding: 20px;
  color: white;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;

}
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
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}
.dashboard-button {
  background: linear-gradient(to right, #b2f7ef, #7b8df2);
  color: black;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}
.logout-button:hover,
.dashboard-button:hover {
  opacity: 0.8;
}
.status-container {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px 18px;
  border-radius: 10px;
}
.status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
}
.status-box {
  width: 20px;
  height: 20px;
  border-radius: 5px;
}
.available {
  background-color: #28a745;
}
.occupied {
  background-color: #dc3545;
}
.parking-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.parking-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.parking-slot {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 8px;
  background: rgb(7, 192, 50);
}
.parking-slot.occupied {
  background: rgb(218, 4, 25);
}
.entrance {
  background-color: #1e90ff;
  width: 120px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.exit {
  background-color: rgb(246, 8, 8);
  width: 120px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lane {
  background-color: #6c757d;
  width: 60px;
  height: 80px;
  margin: 0 5px;
  display: inline-block;
  cursor: pointer;
  position: relative;
}
.lane .arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  transition: transform 0.3s ease;
}
.lane.rotated-1 .arrow {
  transform: translate(-50%, -50%) rotate(90deg);
}
.lane.rotated-2 .arrow {
  transform: translate(-50%, -50%) rotate(180deg);
}
.lane.rotated-3 .arrow {
  transform: translate(-50%, -50%) rotate(270deg);
}
.config-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 220px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 10px;
  color: white;
}
.config-button {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: transparent;
  color: white;
  cursor: pointer;
  margin: 4px 0;
  font-size: 14px;
  border: 2px solid #007bff;
}
.config-button:hover {
  background-color: #007bff;
  color: white;
}
.config-button:active {
  background-color: #0056b3;
}
@media (max-width: 768px) {
  .config-panel {
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    overflow-x: auto;
    padding: 8px;
    border-radius: 0;
    flex-wrap: nowrap;
    z-index: 999;
  }

  .config-tools {
    display: flex;
    gap: 6px;
    flex-wrap: nowrap;
  }

  .config-button {
    font-size: 12px;
    padding: 4px 6px;
    white-space: nowrap;
    flex-shrink: 0;
  }
}
/* เพิ่มความสามารถ responsive ให้ layout แถว */
.parking-layout {
  width: 100%;
  overflow-x: auto;
  padding: 10px 0;
}

.parking-row {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  justify-content: flex-start;
  padding: 5px 0;
}

/* ป้องกัน box ย่อหรือขยายเกิน */
.parking-slot,
.lane,
.entrance,
.exit {
  flex-shrink: 0;
}

/* ทำให้ mobile จัดการ layout ได้ดีขึ้น */
@media (max-width: 768px) {
  .parking-layout, .parking-row {
    overflow-x: auto;
  }
}







</style>
