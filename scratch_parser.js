const fs = require('fs');
const path = require('path');

const text = fs.readFileSync('c:\\Users\\rohit\\OneDrive\\Desktop\\All Docs\\School\\Lab Setup and Carriculam\\_extracted_syllabus.txt', 'utf8');

const curriculumData = {};

for (let i = 2; i <= 11; i++) {
  const startStr = `Class ${i} Syllabus`;
  const endStr = i < 11 ? `Class ${i + 1} Syllabus` : undefined;
  
  const startIdx = text.indexOf(startStr);
  let endIdx = endStr ? text.indexOf(endStr) : text.length;
  if (startIdx === -1) continue;
  
  let section = text.substring(startIdx, endIdx);
  // clean up header/footers
  section = section.replace(/Connect Shiksha — Satpuda Valley Curriculum Guide\s+Confidential/g, '');
  
  const topics = [];
  // Match number, topic, concept, type, domain, link
  // Since spacing is multiple spaces, let's split by 2 or more spaces.
  // Actually, we can split by number " 1 ", " 2 ", etc.
  
  for (let j = 1; j <= 30; j++) {
    const searchRegex = new RegExp(`(?:^|\\s)${j}\\s{2,}([\\s\\S]+?)(?=(?:\\s${j+1}\\s{2,})|(?:$))`);
    const match = section.match(searchRegex);
    if (match) {
      const parts = match[1].trim().split(/\s{2,}/);
      if (parts.length >= 5) {
        const topic = parts[0];
        const concept = parts[1];
        const type = parts[2];
        const domain = parts[3];
        const cbse = parts[4];
        topics.push({ day: j, topic, parts: domain, desc: concept, test: cbse });
      } else {
        topics.push({ day: j, raw: match[1].trim() });
      }
    }
  }
  
  curriculumData[i] = topics;
}

fs.writeFileSync('c:\\Users\\rohit\\OneDrive\\Desktop\\All Docs\\School\\Lab Setup and Carriculam\\scratch_curriculum.json', JSON.stringify(curriculumData, null, 2));
console.log('Done parsing syllabus to JSON. Check scratch_curriculum.json');
