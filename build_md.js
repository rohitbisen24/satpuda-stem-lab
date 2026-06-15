const fs = require('fs');

const curriculumRaw = JSON.parse(fs.readFileSync('scratch_curriculum.json', 'utf8'));

// Clean curriculum data
const curriculumData = {};
for (const classNum in curriculumRaw) {
  curriculumData[classNum] = curriculumRaw[classNum].filter(item => {
    if (!item.topic) return false;
    if (['📗', '📘', '📙'].includes(item.topic.trim())) return false;
    if (item.topic.includes('Class') && item.topic.includes('Syllabus')) return false;
    return true;
  });
}

let mdContent = `# 🏗️ Satpuda Valley STEM Tinkering Lab
## Comprehensive Setup, Standard Operating Procedures (SOPs), & Curriculum Guide
*Developed by Connect Shiksha for Satpuda Valley Public School*

---

## 📋 Table of Contents
1. [Overview & Hybrid Sharing Model](#-overview--hybrid-sharing-model)
2. [4-Box Category Model & Allocation](#-4-box-category-model--allocation)
3. [Lab Spatial Design & Zoning Rules](#-lab-spatial-design--zoning-rules)
4. [Standard Operating Procedures (SOPs) & Student Roles](#-standard-operating-procedures-sops--student-roles)
5. [Class-Wise Kit Distribution Matrix](#-class-wise-kit-distribution-matrix)
6. [Budget & Proposal Summary](#-budget--proposal-summary)
7. [Class-Wise 30-Day Curriculum Matrices (Grades 2 to 11)](#-class-wise-30-day-curriculum-matrices-grades-2-to-11)

---

## 🎯 Overview & Hybrid Sharing Model

The Satpuda Valley STEM Lab runs on a **Hybrid Sharing Model** designed to prevent component loss and ensure cost-efficient access to high-value resources. Rather than duplicating expensive hardware across all student kits, components are divided into categories:

1. **Box Categories (A, B, C, D):** 40 kits distributed across 10 workbenches for structured rotation.
2. **Shared Lab Cabinet (Central Vault - Bin E):** High-cost or delicate controllers (Arduino, NodeMCU, ESP32, ESP32-CAM) and specialized modules are kept locked and checked out at the start of each session.

---

## 📦 4-Box Category Model & Allocation

To achieve maximum Value for Money (VFM) and easy storage, the lab is set up with exactly 40 boxes (4 categories of boxes distributed across 10 workbenches).

* **Box A: Mechatronics Structural Kit (YELLOW)**
  * Eligible Grades: Class 2, 3
  * Primary Hardware: Lego-compatible perforated beams, snap connector pegs, spur gears, axles, rubber wheels, pulleys & belts, manual cranks, and cams (No controllers).
* **Box B: Foundation Electronics & Pico Kit (BLUE)**
  * Eligible Grades: Class 4, 5
  * Primary Hardware: Raspberry Pi Pico (MicroPython), solderless breadboard, analog LDR and LM35 temperature sensors, TSOP1838 IR Receiver & Remote, LEDs, active buzzer, small DC hobby motor + fan propeller, vibration pager motor, SG90 micro servo.
* **Box C: Standalone Universal IoT & Sensors Kit (GREEN)**
  * Eligible Grades: Class 6, 7, 8, 9, 10
  * Primary Hardware: Solderless breadboard, acrylic robotics chassis, BO gear motors + wheels, L298N motor driver, SG90 micro servo, LCD1602 (I2C) display. Dedicated class-wise controllers & sensors:
    * Arduino Uno R3 (Class 6 & 7): HC-SR04 Sonar, HC-05 Bluetooth, LDR digital sensor.
    * NodeMCU ESP8266 (Class 8 & 9): WiFi, DHT11 weather sensor, Soil moisture sensor, Rain sensor, 1-Channel Relay, 4x4 keypad, 5V mini submersible water pump.
    * ESP32 DevKit V1 & ESP32-CAM DevKit (Class 10 Edge AI/IoT): RC522 RFID security module, MQ-135 Air Quality, Pulse rate biosensor, Neo-6M GPS, MAX983571 Audio Amp & Speaker.
* **Box D: Drone Assembly & Avionics Kit (RED)**
  * Eligible Grades: Class 11
  * Primary Hardware: ESP32 Flight Controller (using ESP32 DevKit V1), MPU6050 Gyro/Accel, custom MOSFET Motor Driver PCB, MT3608 boost converter, 8520 coreless brushed motors, 65mm propellers, 3D printed drone frame + prop guards, JST LiPo flight batteries, JST multi-port USB charger, 2.4GHz radio transceiver controller.
* **Bin E: Teacher's Shared Vault (GREY)**
  * Eligible Grades: All grades (facilitated by teacher)
  * Primary Hardware: Bambu Lab P1S 3D Printer, PLA filaments, 25W soldering iron kits, digital multimeters, wire strippers, hot glue guns with sticks, precision screwdrivers, extension boards, and 18650 smart battery chargers.
* **Box F: Lab Safety & Consumables (PURPLE)**
  * Eligible Grades: All grades (available for safety & maintenance)
  * Primary Hardware: Safety goggles, first aid kit, ABC chemical powder fire extinguisher, heat shrink sleeves, and insulation PVC tapes.

---

## 📅 Lab Spatial Design & Zoning Rules

To maintain physical order, the lab is partitioned into 5 distinct activity zones:
* **Zone A:** Electronics & Prototyping Workstations (10 workbenches for 30 students).
* **Zone B:** Mechanical Fabrication & 3D Printing Area (Bambu Lab P1S 3D Printer).
* **Zone C:** Central Storage Cabinet (The Vault).
* **Zone D:** Teacher Station (Demo desk, projector).
* **Zone E:** Classroom Open Storage Racks.

---

## 🍽️ Standard Operating Procedures (SOPs) & Student Roles

Workbenches rotate through three student roles each week:
* **Student 1 (Hardware Lead/Builder):** Assembling structural parts, wiring breadboards.
* **Student 2 (Software Lead/Coder):** Writing program logic on Scratch/Python, variables, upload.
* **Student 3 (Systems Lead/Tester):** Multimeter checks, continuity, debugging faults.

---

## 🔄 Class-Wise Kit Distribution Matrix

Teachers should only distribute the specific box needed for the class topic.

| Class | Syllabus Module | Required Workbench Box | Standalone Dedicated Controllers & Sensors |
|---|---|---|---|
| Class 2 | Junior Mechatronics | Box A (Yellow) | No Controller. Basic linkages, cams, and structural beams. |
| Class 3 | Block Coding & 3D Drafting | Box A (Yellow) | No Controller. 3D Pen & PLA filaments for mechanical designs. |
| Class 4 | Scratch Coding & Circuits | Box B (Blue) | Raspberry Pi Pico (MicroPython). Analog LDR & LM35 sensors. |
| Class 5 | Active Circuits & Remote | Box B (Blue) | Raspberry Pi Pico. TSOP1838 IR Receiver & Remote (Remote Control logic). |
| Class 6 | Embedded C++ & Beginner IoT | Box C (Green) | Arduino Uno R3. HC-SR04 Ultrasonic Sonar & HC-05 Bluetooth module. |
| Class 7 | Smart Robotics & Display | Box C (Green) | Arduino Uno R3. LCD1602 I2C Display, BO motors, chassis & L298N driver. |
| Class 8 | WiFi IoT & Weather station | Box C (Green) | NodeMCU ESP8266 (WiFi). DHT11, Soil Moisture probe, and Rain sensor. |
| Class 9 | Python & Home Automation | Box C (Green) | NodeMCU ESP8266. 4x4 Membrane Keypad, 1CH Relay, and Submersible Pump. |
| Class 10 | Edge AI, RFID & Biosensing | Box C (Green) | ESP32 DevKit V1 & ESP32-CAM. RFID RC522, MQ-135, Pulse sensor, and Speakers. |
| Class 11 | Avionics & Drone Flight | Box D (Red) | ESP32 Flight Controller (DevKit V1), MPU6050 Gyro, and coreless motors. |

---

## 💰 Budget & Proposal Summary

Total Investment (Excl. GST): **₹ 4,07,450**

* Module 1: Junior Mechatronics Kit (10x): ₹ 22,000
* Module 2: Foundation Electronics Kit (10x): ₹ 35,000
* Module 3: Intermediate Robotics & IoT Kit (10x): ₹ 58,000
* Module 4: Advanced Edge AI & Drone Kit (10x): ₹ 1,65,000
* Bambu Lab P1S 3D Printer: ₹ 52,450
* Lab Safety, Tools & Consumables: ₹ 30,000
* 4-Month Onsite Visiting Trainer: ₹ 45,000
* Professional Onsite Lab Setup & LMS: FREE

---

## 📚 Class-Wise 30-Day Curriculum Matrices (Grades 2 to 11)

This lab features a complete 300-topic syllabus matching 4 hardware mechatronics kit modules to CBSE Coding & AI framework guidelines.

`;

for (let i = 2; i <= 11; i++) {
  mdContent += "### Class " + i + " Curriculum\n\n";
  mdContent += "| Day | Topic / Project Name | Type / Domain | Concept & Key Focus |\n";
  mdContent += "|---|---|---|---|\n";
  
  if (curriculumData[i]) {
    curriculumData[i].forEach(d => {
      mdContent += "| " + d.day + " | **" + d.topic + "** | " + d.parts + " | " + d.desc + " |\n";
    });
  }
  mdContent += "\n---\n\n";
}

fs.writeFileSync('c:\\Users\\rohit\\OneDrive\\Desktop\\All Docs\\School\\Lab Setup and Carriculam\\STEM_Lab_Setup_And_Curriculum_Guide.md', mdContent);
console.log('Markdown generated successfully.');
