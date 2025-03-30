<template>
  <div class="container">

    <div class="status-container">
      <div class="status">
        <div class="status-box available"></div> Available
      </div>
      <div class="status">
        <div class="status-box occupied"></div> Occupied
      </div>
    </div>

    <div class="counter-container">
      <span>Current Car Count: {{ inCarCount }}</span>
    </div>

    <div class="parking-layout">
      <div v-for="(row, rowIndex) in parkingRows" :key="rowIndex" class="parking-row">
        <div v-for="element in row" :key="element.id"
          :class="['parking-slot', element.type, { 'lane-block': isLaneBlock(rowIndex, element), occupied: element.occupied, available: !element.occupied }, element.type === 'lane' ? `rotated-${element.rotated}` : '']"
        >
          <span v-if="element.type === 'lane'" class="arrow">➡️</span>
          <span v-else>{{ element.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import mqtt from 'mqtt'
import { auth } from '../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const client = mqtt.connect('wss://test.mosquitto.org:8081')

const ir9Prev = ref("0")
const ir10Prev = ref("0")
const ir9Count = ref(0)
const ir10Count = ref(0)
const inCarCount = ref(0)

const debounceMs = 1000
let lastIR9Time = 0
let lastIR10Time = 0

const parkingRows = ref([])

onMounted(() => {
    // ✅ ไม่เช็ค login แล้วก็ยังทำงานต่อได้
    client.on("connect", () => {
      client.subscribe("kmitl/project/parking-layout")
      client.subscribe("kmitl/project/irsensor/9")
      client.subscribe("kmitl/project/irsensor/10")
    })

    client.on("message", (topic, message) => {
      const msg = message.toString().trim()
      const now = Date.now()

      if (topic === "kmitl/project/parking-layout") {
        try {
          const layout = JSON.parse(msg)
          parkingRows.value = layout

          layout.flat().forEach(slot => {
            if (slot.topic) client.subscribe(slot.topic)
          })
        } catch (e) {
          console.error("Failed to parse layout:", e)
        }
        return
      }

      if (topic === "kmitl/project/irsensor/9") {
        if (msg === "1" && ir9Prev.value === "0" && now - lastIR9Time > debounceMs) {
          ir9Count.value++
          lastIR9Time = now
          updateInCarCount()
        }
        ir9Prev.value = msg
        return
      }

      if (topic === "kmitl/project/irsensor/10") {
        if (msg === "1" && ir10Prev.value === "0" && now - lastIR10Time > debounceMs) {
          ir10Count.value++
          lastIR10Time = now
          updateInCarCount()
        }
        ir10Prev.value = msg
        return
      }

      const slot = parkingRows.value.flat().find(s => s.topic === topic)
      if (slot) slot.occupied = msg === "1"
    })
  })

function updateInCarCount() {
  inCarCount.value = Math.max(0, ir9Count.value - ir10Count.value)
}

function isLaneBlock(rowIndex, element) {
  const row = parkingRows.value[rowIndex]
  const index = row.indexOf(element)
  return index > 0 && row[index - 1].type === 'lane'
}
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 100vw; /* ✅ ป้องกันช่องขอบดำด้านขวา */
  background: linear-gradient(to right, #3a7bd5, #3a6073);
  padding: 20px;
  color: white;
  overflow-x: auto;
  box-sizing: border-box;
}

.top-right-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.logout-button,
.dashboard-button {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: black;
}

.logout-button {
  background: linear-gradient(to right, #ff5733, #ff8d72);
}

.dashboard-button {
  background: linear-gradient(to right, #b2f7ef, #7b8df2);
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
  flex-wrap: nowrap;
}

.parking-slot,
.lane,
.entrance,
.exit {
  flex-shrink: 0;
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

/* ✅ Responsive: มือถือเท่านั้นให้เลื่อนจอแทน */
@media (max-width: 768px) {
  .container {
    max-width: 100vw;
    overflow-x: auto;
  }

  .parking-layout {
    width: max-content;
  }

  .parking-row {
    width: max-content;
  }

  .parking-slot {
    width: 60px;
    height: 60px;
  }
}
</style>
