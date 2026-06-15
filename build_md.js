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
  * Primary Hardware: Lego-compatible perforated beams, pegs, axles, wheels, gears, pulleys.
* **Box B: Basic Coding & Electronics Kit (BLUE)**
  * Eligible Grades: Class 4, 5
  * Primary Hardware: Arduino Uno, NodeMCU, Breadboards, SG90 Servo, BO Motors, DC Motors, LEDs, passives.
* **Box C: Advanced IoT & Sensors Kit (GREEN)**
  * Eligible Grades: Class 5, 6, 7, 8, 9, 10
  * Primary Hardware: LCD1602, HC-SR04, Bluetooth, Soil/Rain sensor, DHT11, Keypad, MPU6050, GPS.
* **Box D: Drone Assemblies Kit (RED)**
  * Eligible Grades: Class 10, 11
  * Primary Hardware: ESP32 DevKit V1, MPU6050, Motor Driver PCB, Boost Converter, Coreless Motors, Frame.
* **Bin E: Teacher's Vault (GREY)**
  * High-value items checkout only.

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

| Class | Syllabus Module | Required Workbench Box | Teacher Vault Checkout Items |
|---|---|---|---|
| Class 2 | Junior Mechatronics | Box A (Yellow) | None |
| Class 3 | Block Coding & 3D | Box A (Yellow) | 3D Pen + PLA Filaments |
| Class 4 | Scratch 2 & Circuits | Box B (Blue) | Multimeter DT830D |
| Class 5 | AI Principles | Box B (Blue) | ESP32 board + webcam |
| Class 6 | Embedded C++ & Web | Box B + Box C | Arduino Uno (Box B) + sensors |
| Class 7 | Smart IoT & Sensors | Box C (Green) | ESP8266 NodeMCU |
| Class 8 | Precision Robotics | Box B + Box C | ESP32 (Vault) + Drivers + Sensors |
| Class 9 | Python & 3D Slicing | Box B + Box C | Bambu Lab P1S 3D Printer |
| Class 10 | Edge AI & Vision | Box C (Green) | ESP32-CAM + Programmer |
| Class 11 | Avionics & Drones | Box D (Red) | 3S LiPo + Radio Controller |

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
