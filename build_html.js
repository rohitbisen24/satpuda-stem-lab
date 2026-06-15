const fs = require('fs');

const curriculumRaw = JSON.parse(fs.readFileSync('scratch_curriculum.json', 'utf8'));

// Clean curriculum data
const curriculumData = {};
for (const classNum in curriculumRaw) {
  curriculumData[classNum] = curriculumRaw[classNum].filter(item => {
    if (!item.topic) return false;
    // Filter out header items that got matched incorrectly
    if (['📗', '📘', '📙'].includes(item.topic.trim())) return false;
    if (item.topic.includes('Class') && item.topic.includes('Syllabus')) return false;
    return true;
  });
}

// Generate the HTML
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Satpuda STEM Lab — Interactive Scaling & Deployment Guide</title>
  
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <style>
    :root {
      --bg: #070913;
      --card-bg: rgba(16, 22, 38, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover-bg: rgba(25, 33, 56, 0.9);
      --card-hover-border: rgba(255, 255, 255, 0.18);
      
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      
      --cyan: #06b6d4;
      --green: #10b981;
      --yellow: #f59e0b;
      --purple: #8b5cf6;
      --red: #ef4444;
      --blue: #3b82f6;
      --grey: #64748b;
      
      --glow-cyan: rgba(6, 182, 212, 0.15);
      --glow-green: rgba(16, 185, 129, 0.15);
      --glow-yellow: rgba(245, 158, 11, 0.15);
      --glow-purple: rgba(139, 92, 246, 0.15);
      --glow-red: rgba(239, 68, 68, 0.15);
      --glow-blue: rgba(59, 130, 246, 0.15);
      --glow-grey: rgba(100, 116, 139, 0.15);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background-color: var(--bg);
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.04) 0%, transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.03) 0%, transparent 50%);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.6;
      overflow-x: hidden;
      padding-bottom: 3rem;
    }

    .container { max-width: 1300px; margin: 0 auto; padding: 1.5rem; }

    header {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 2.5rem 2rem;
      margin-bottom: 2.5rem;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }
    header::before {
      content: ''; position: absolute; top: 0; right: 0; width: 250px; height: 250px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%); pointer-events: none;
    }
    .brand-pill {
      display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.2); padding: 6px 16px; border-radius: 100px;
      font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--cyan); margin-bottom: 1.2rem;
    }
    header h1 {
      font-family: 'Outfit', sans-serif; font-size: 2.6rem; font-weight: 900; letter-spacing: -0.02em;
      line-height: 1.2; background: linear-gradient(135deg, #ffffff 30%, #94a3b8 70%, var(--cyan) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;
    }
    header p { color: var(--text-muted); font-size: 1.1rem; max-width: 850px; line-height: 1.6; }

    .nav-tabs {
      display: flex; gap: 0.8rem; margin-bottom: 2rem; border-bottom: 1px solid var(--card-border);
      padding-bottom: 0.8rem; flex-wrap: wrap;
    }
    .tab-btn {
      background: transparent; border: 1px solid transparent; color: var(--text-muted);
      padding: 0.8rem 1.4rem; font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 700;
      border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 0.6rem;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .tab-btn:hover { color: var(--text); background: rgba(255, 255, 255, 0.03); }
    .tab-btn.active {
      color: #fff; background: rgba(6, 182, 212, 0.12); border-color: rgba(6, 182, 212, 0.25);
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.08);
    }

    .tab-panel { display: none; animation: fadeIn 0.4s ease; }
    .tab-panel.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .glass-card {
      background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px;
      padding: 2rem; backdrop-filter: blur(12px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); transition: border-color 0.3s;
    }
    .glass-card:hover { border-color: rgba(255, 255, 255, 0.12); }
    .glass-card h3 { font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; margin-bottom: 1.2rem; color: #fff; display: flex; align-items: center; gap: 0.6rem; }
    .text-glow-cyan { text-shadow: 0 0 10px rgba(6, 182, 212, 0.3); }

    /* Matrix Table Styling */
    .matrix-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    .matrix-table th { background: rgba(255,255,255,0.05); color: var(--cyan); text-align: left; padding: 1rem; font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 800; letter-spacing: 0.05em; border-bottom: 2px solid var(--card-border); }
    .matrix-table td { padding: 1rem; border-bottom: 1px solid var(--card-border); font-size: 0.9rem; color: #fff; }
    .matrix-table tr:hover td { background: rgba(255,255,255,0.02); }
    .matrix-table td.muted { color: var(--text-muted); font-size: 0.85rem; }

    .box-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 700; font-size: 0.75rem; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; }
    .box-badge:hover { transform: translateY(-2px); filter: brightness(1.2); }
    .box-badge.yellow { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); color: var(--yellow); }
    .box-badge.blue { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); color: var(--blue); }
    .box-badge.green { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); color: var(--green); }
    .box-badge.red { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: var(--red); }
    .box-badge.purple { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); color: var(--purple); }
    .box-badge.grey { background: rgba(100,116,139,0.1); border-color: rgba(100,116,139,0.3); color: var(--text-muted); }
    
    /* Modal Styles */
    .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
    .modal-content { background: var(--card-bg); border: 1px solid var(--cyan); width: 90%; max-width: 600px; border-radius: 16px; padding: 2rem; position: relative; max-height: 80vh; overflow-y: auto; box-shadow: 0 0 30px rgba(6,182,212,0.2); }
    .modal-close { position: absolute; top: 1rem; right: 1.5rem; color: var(--text-muted); cursor: pointer; font-size: 1.8rem; line-height: 1; }
    .modal-close:hover { color: #fff; }
    .modal-item-row { display: flex; flex-direction: column; gap: 0.2rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 0.8rem 0; }
    .modal-item-name { font-weight: 700; color: #fff; font-size: 0.95rem; }
    .modal-item-desc { font-size: 0.8rem; color: var(--text-secondary); }
    .modal-item-qty { font-size: 0.8rem; color: var(--cyan); font-weight: 800; display: inline-block; background: rgba(6,182,212,0.1); padding: 1px 6px; border-radius: 4px; margin-top: 0.2rem; align-self: flex-start; }

    /* Budget Breakdown Grid */
    .budget-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .budget-metric { background: rgba(0,0,0,0.3); border: 1px solid var(--card-border); border-radius: 12px; padding: 1.5rem; text-align: center; }
    .budget-metric .val { font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 900; color: var(--cyan); margin-bottom: 0.3rem; }
    .budget-metric .lbl { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; }

    /* Visualizer Layout */
    .visualizer-layout { display: grid; grid-template-columns: 1fr 2.2fr; gap: 2rem; }
    .box-selector-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .box-selector-btn { width: 100%; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem 1.2rem; display: flex; align-items: center; justify-content: space-between; color: var(--text); cursor: pointer; text-align: left; font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 700; transition: all 0.2s ease; }
    .box-selector-btn:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.15); transform: translateX(3px); }
    .box-selector-btn .color-indicator { display: flex; align-items: center; gap: 0.8rem; }
    .color-dot { width: 14px; height: 14px; border-radius: 4px; }
    .box-selector-btn.active { background: rgba(255, 255, 255, 0.04); border-color: var(--box-accent); box-shadow: 0 0 15px var(--box-glow); }
    .box-selector-btn.active .name { color: var(--box-accent); }

    .box-grid-display { background: rgba(0, 0, 0, 0.3); border: 2px solid var(--box-accent); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; position: relative; }
    .box-grid-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; border-bottom: 1px solid var(--card-border); padding-bottom: 0.8rem; }
    .box-grid-header h4 { font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 800; color: #fff; }
    .box-row-container { display: flex; flex-direction: column; gap: 0.6rem; }
    .grid-row-header { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--box-accent); margin-bottom: 0.1rem; }
    .grid-cells-row { display: flex; gap: 0.6rem; width: 100%; }
    .grid-cell { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 10px; padding: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 100px; cursor: pointer; transition: all 0.2s ease; position: relative; }
    .grid-cell:hover { background: var(--card-hover-bg); border-color: var(--box-accent); transform: scale(1.02); }
    .grid-cell.active { background: rgba(255, 255, 255, 0.04); border-color: var(--box-accent); box-shadow: inset 0 0 10px var(--box-glow); }
    .grid-cell .coord { font-size: 0.52rem; font-weight: 800; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1px 4px; border-radius: 3px; margin-bottom: 0.4rem; color: var(--box-accent); }
    .grid-cell .item-name { font-size: 0.78rem; font-weight: 700; line-height: 1.3; color: #fff; }
    .grid-cell .item-qty { font-size: 0.72rem; font-weight: 800; color: var(--box-accent); background: rgba(255, 255, 255, 0.03); padding: 1px 6px; border-radius: 4px; margin-top: 0.3rem; border: 1px solid rgba(255, 255, 255, 0.04); }
    
    .w-1 { flex: 1; } .w-2 { flex: 2; } .w-3 { flex: 3; } .w-4 { flex: 4; } .w-5 { flex: 5; }

    .compartment-details { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 1.5rem; min-height: 180px; }
    .details-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-dim); text-align: center; padding: 2rem 0; }
    .details-placeholder i { font-size: 2.2rem; margin-bottom: 0.8rem; }
    .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem; }
    .details-item h5 { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.2rem; }
    .details-item p { font-size: 0.9rem; font-weight: 700; color: #fff; }
    .details-item.accent p { color: var(--box-accent); }

    /* Curriculum Explorer */
    .curriculum-filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; }
    .class-tabs-row { display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.4rem; flex-grow: 1; }
    .class-tab-chip { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--card-border); color: var(--text-muted); padding: 0.5rem 1rem; border-radius: 8px; font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
    .class-tab-chip:hover { background: rgba(255, 255, 255, 0.04); color: #fff; }
    .class-tab-chip.active { background: var(--cyan); border-color: var(--cyan); color: #fff; box-shadow: 0 0 10px rgba(6,182,212,0.4); }
    .search-wrap { display: flex; align-items: center; gap: 0.5rem; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--card-border); border-radius: 10px; padding: 0.5rem 0.8rem; min-width: 250px; }
    .search-wrap i { color: var(--text-dim); font-size: 0.85rem; }
    .search-wrap input { background: transparent; border: none; outline: none; color: #fff; font-size: 0.85rem; width: 100%; }

    .days-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .day-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; padding: 1.2rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 180px; transition: all 0.25s; }
    .day-card:hover { border-color: var(--cyan); transform: translateY(-3px); box-shadow: 0 5px 15px rgba(6,182,212,0.1); }
    .day-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
    .day-chip { font-family: 'Outfit', sans-serif; font-size: 0.62rem; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 5px; letter-spacing: 0.05em; background: rgba(6,182,212,0.1); color: var(--cyan); }
    .day-num { font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
    .day-title { font-size: 0.95rem; font-weight: 750; color: #fff; margin-bottom: 0.4rem; line-height: 1.3; }
    .day-desc { font-size: 0.76rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 0.8rem; }
    .day-footer { border-top: 1px solid rgba(255,255,255,0.03); margin-top: auto; padding-top: 0.5rem; font-size: 0.68rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.3rem; }

    /* Team Section */
    .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1.5rem; }
    .team-card { background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); border-radius: 16px; padding: 1.5rem; text-align: center; }
    .team-card h4 { font-family: 'Outfit', sans-serif; font-size: 1.1rem; color: #fff; margin-bottom: 0.2rem; }
    .team-card p { font-size: 0.8rem; color: var(--cyan); font-weight: 700; margin-bottom: 1rem; }

    /* Universal Level Map Styles */
    .universal-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .universal-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 1.2rem; text-align: center; cursor: pointer; transition: all 0.25s; }
    .universal-card:hover, .universal-card.active { border-color: var(--box-accent, var(--cyan)); transform: translateY(-3px); box-shadow: 0 5px 15px var(--box-glow, rgba(6,182,212,0.1)); }
    .universal-card h4 { font-family: 'Outfit', sans-serif; font-size: 1.05rem; margin-bottom: 0.3rem; color: #fff; }
    .universal-card .badge { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 5px; background: rgba(255,255,255,0.05); color: var(--text-muted); display: inline-block; margin-bottom: 0.5rem; }
    .level-badge-1 { color: var(--yellow) !important; background: var(--glow-yellow) !important; }
    .level-badge-2 { color: var(--blue) !important; background: var(--glow-blue) !important; }
    .level-badge-3 { color: var(--green) !important; background: var(--glow-green) !important; }
    .level-badge-4 { color: var(--red) !important; background: var(--glow-red) !important; }
    
    .level-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1.5rem; }
    .level-col { background: rgba(255,255,255,0.01); border: 1px solid var(--card-border); border-radius: 16px; padding: 1.2rem; min-height: 400px; }
    .level-col-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--card-border); }
    .level-col-header h4 { font-family: 'Outfit', sans-serif; font-size: 1.1rem; color: #fff; }
    .level-col-header span { font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
    
    .mini-task-card { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.03); border-radius: 10px; padding: 0.8rem; margin-bottom: 0.8rem; transition: border-color 0.2s; }
    .mini-task-card:hover { border-color: rgba(255,255,255,0.1); }
    .mini-task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
    .mini-task-day { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); }
    .mini-task-chip { font-size: 0.58rem; font-weight: 800; padding: 1px 5px; border-radius: 3px; background: rgba(6,182,212,0.1); color: var(--cyan); }
    .mini-task-title { font-size: 0.85rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem; }
    .mini-task-desc { font-size: 0.72rem; color: var(--text-secondary); line-height: 1.35; margin-bottom: 0.4rem; }
    .mini-task-goal { font-size: 0.65rem; color: var(--text-dim); border-top: 1px solid rgba(255,255,255,0.02); padding-top: 0.3rem; display: block; }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <div class="brand-pill"><i class="fas fa-satellite-dish"></i> Connect Shiksha — Satpuda Valley Project 2026</div>
      <h1>STEM Tinkering Lab Console</h1>
      <p>Centralized Curriculum Database (300 Topics), 4-Box Category Visualizer, Scale-up Allocation Matrix, Budget Breakdown, and Technical Proposal details mapped to NEP 2020 guidelines.</p>
    </header>

    <!-- BOX MODAL -->
    <div id="boxModal" class="modal-overlay" onclick="if(event.target==this) this.style.display='none'">
      <div class="modal-content" id="modalContentBlock">
        <span class="modal-close" onclick="document.getElementById('boxModal').style.display='none'">&times;</span>
        <h2 id="modalTitle" style="margin-bottom: 0.5rem; font-family:'Outfit'; color:var(--cyan);">Box Name</h2>
        <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom: 1.5rem;">Below is the complete inventory inside this container.</p>
        <div id="modalItemsList" style="display: flex; flex-direction: column;"></div>
      </div>
    </div>

    <div class="nav-tabs">
      <button class="tab-btn active" onclick="switchTab('tab-schedule')"><i class="fas fa-calendar-alt"></i> Lab Schedule & Flow</button>
      <button class="tab-btn" onclick="switchTab('tab-boxes')"><i class="fas fa-box"></i> Box Maps</button>
      <button class="tab-btn" onclick="switchTab('tab-distribution')"><i class="fas fa-sitemap"></i> Kit Distribution</button>
      <button class="tab-btn" onclick="switchTab('tab-curriculum')"><i class="fas fa-book-open"></i> Syllabus (300 Topics)</button>
      <button class="tab-btn" onclick="switchTab('tab-universal')"><i class="fas fa-layer-group"></i> Universal Level Map</button>
      <button class="tab-btn" onclick="switchTab('tab-proposal')"><i class="fas fa-file-invoice-dollar"></i> Budget & Proposal</button>
    </div>

    <!-- TAB: CURRICULUM EXPLORER -->
    <div id="tab-curriculum" class="tab-panel">
      
      <!-- LECTURE FLOW SECTION -->
      <div class="glass-card" style="margin-bottom: 2rem; border-left: 4px solid var(--cyan);">
        <h3 style="font-family:'Outfit'; font-size:1.4rem; color:var(--cyan); margin-bottom: 1rem;"><i class="fas fa-stopwatch"></i> Standard 40-Minute Lecture Flow</h3>
        <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom: 1rem;">To ensure active engagement and practical learning, every STEM class strictly follows this optimized 40-minute structure:</p>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); padding: 1.2rem; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; font-size: 4rem; color: var(--yellow);"><i class="fas fa-chalkboard-teacher"></i></div>
            <h4 style="color: var(--yellow); font-size: 1.1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-clock"></i> 10 Mins</h4>
            <h5 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.3rem;">Conceptual Briefing</h5>
            <p style="color: var(--text-muted); font-size: 0.8rem;">Teacher explains the daily mechanism, electronic concept, or logic block using the whiteboard.</p>
          </div>
          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); padding: 1.2rem; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; font-size: 4rem; color: var(--blue);"><i class="fas fa-tools"></i></div>
            <h4 style="color: var(--blue); font-size: 1.1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-clock"></i> 25 Mins</h4>
            <h5 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.3rem;">Hands-On Lab Work</h5>
            <p style="color: var(--text-muted); font-size: 0.8rem;">Students work in teams of 3 to assemble the hardware, configure the code, and test the active build.</p>
          </div>
          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); padding: 1.2rem; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; font-size: 4rem; color: var(--green);"><i class="fas fa-check-double"></i></div>
            <h4 style="color: var(--green); font-size: 1.1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-clock"></i> 5 Mins</h4>
            <h5 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.3rem;">Verification & Clean-up</h5>
            <p style="color: var(--text-muted); font-size: 0.8rem;">Check outputs using diagnostic checks and organize all kit components back into their boxes safely.</p>
          </div>
        </div>
      </div>

      <div class="curriculum-filters">
        <span class="filter-label" style="font-weight:700; font-size:0.85rem; color:var(--text-muted)"><i class="fas fa-filter"></i> CLASS:</span>
        <div class="class-tabs-row">
          <span class="class-tab-chip active" onclick="filterClass(2)">Class 2</span>
          <span class="class-tab-chip" onclick="filterClass(3)">Class 3</span>
          <span class="class-tab-chip" onclick="filterClass(4)">Class 4</span>
          <span class="class-tab-chip" onclick="filterClass(5)">Class 5</span>
          <span class="class-tab-chip" onclick="filterClass(6)">Class 6</span>
          <span class="class-tab-chip" onclick="filterClass(7)">Class 7</span>
          <span class="class-tab-chip" onclick="filterClass(8)">Class 8</span>
          <span class="class-tab-chip" onclick="filterClass(9)">Class 9</span>
          <span class="class-tab-chip" onclick="filterClass(10)">Class 10</span>
          <span class="class-tab-chip" onclick="filterClass(11)">Class 11</span>
        </div>
        <div class="search-wrap">
          <i class="fas fa-search"></i>
          <input type="text" id="curriculum-search" placeholder="Search topics, domains..." oninput="searchCurriculum()">
        </div>
      </div>
      <div class="days-grid" id="curriculum-days-target"></div>
    </div>

    <!-- TAB: BOX COMPARTMENTS -->
    <div id="tab-boxes" class="tab-panel">
      <div class="visualizer-layout">
        <div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:1.2rem; margin-bottom:1rem; color:#fff"><i class="fas fa-layer-group"></i> Box Categories (10 Sets Each)</h3>
          <div class="box-selector-list">
            <button class="box-selector-btn active" onclick="loadBoxGrid('boxA')" style="--box-accent: var(--yellow); --box-glow: var(--glow-yellow)">
              <span class="color-indicator"><span class="color-dot" style="background:var(--yellow)"></span> <span class="name">Box A: Mechatronics</span></span>
              <i class="fas fa-chevron-right"></i>
            </button>
            <button class="box-selector-btn" onclick="loadBoxGrid('boxB')" style="--box-accent: var(--blue); --box-glow: var(--glow-blue)">
              <span class="color-indicator"><span class="color-dot" style="background:var(--blue)"></span> <span class="name">Box B: Basic Electronics</span></span>
              <i class="fas fa-chevron-right"></i>
            </button>
            <button class="box-selector-btn" onclick="loadBoxGrid('boxC')" style="--box-accent: var(--green); --box-glow: var(--glow-green)">
              <span class="color-indicator"><span class="color-dot" style="background:var(--green)"></span> <span class="name">Box C: Advanced IoT & Sensors</span></span>
              <i class="fas fa-chevron-right"></i>
            </button>
            <button class="box-selector-btn" onclick="loadBoxGrid('boxD')" style="--box-accent: var(--red); --box-glow: var(--glow-red)">
              <span class="color-indicator"><span class="color-dot" style="background:var(--red)"></span> <span class="name">Box D: Drone Assembly</span></span>
              <i class="fas fa-chevron-right"></i>
            </button>
            <button class="box-selector-btn" onclick="loadBoxGrid('binE')" style="--box-accent: var(--grey); --box-glow: var(--glow-grey)">
              <span class="color-indicator"><span class="color-dot" style="background:var(--grey)"></span> <span class="name">Bin E: Teacher Vault (Grey)</span></span>
              <i class="fas fa-chevron-right"></i>
            </button>
            <button class="box-selector-btn" onclick="loadBoxGrid('boxF')" style="--box-accent: var(--purple); --box-glow: var(--glow-purple)">
              <span class="color-indicator"><span class="color-dot" style="background:var(--purple)"></span> <span class="name">Box F: Lab Safety & Consumables</span></span>
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div>
          <div class="box-grid-display" id="box-grid-frame" style="--box-accent: var(--yellow); --box-glow: var(--glow-yellow)">
            <div class="box-grid-header">
              <h4 id="box-grid-title">Box A: Mechatronics Compartment Map</h4>
              <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700;">Zero Contamination Audit System</span>
            </div>
            <div class="box-row-container" id="grid-rows-target"></div>
          </div>
          <div class="compartment-details" id="compartment-details-box">
            <div class="details-placeholder">
              <i class="fas fa-info-circle"></i>
              <p>Click any compartment slot above to view detailed sourcing specifications and quantities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: DISTRIBUTION MATRIX -->
    <div id="tab-distribution" class="tab-panel">
      
      <div style="margin-bottom: 2rem;">
        <h2 style="font-family:'Outfit'; font-size:1.8rem; margin-bottom: 0.5rem;">Lab Deployment Strategies</h2>
        <p style="color:var(--text-muted);">Choose the deployment model that best fits your school's budget and operational preferences. Below are the two strategies detailing how kits are distributed and why.</p>
      </div>

      <div class="glass-card" style="margin-bottom: 2rem; border-left: 4px solid var(--blue);">
        <h3><i class="fas fa-coins text-glow-cyan" style="color:var(--blue)"></i> Option 1: Hybrid Sharing Model (Budget-Optimized)</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:1rem;"><strong>Why this model?</strong> This is the standard, cost-effective approach. Instead of duplicating base electronics (Arduino, Breadboards, Motors) across all kits, we keep them strictly in Box B. When senior classes (Class 6, 8, 9) build advanced projects, they check out Box B (Base) + Box C (Sensors). This keeps the total kit count at exactly 40 and strictly controls the lab setup budget.</p>
        
        <table class="matrix-table">
          <thead>
            <tr>
              <th width="10%">Class</th>
              <th width="25%">Syllabus Module</th>
              <th width="25%">Required Workbench Box</th>
              <th width="40%">Teacher Vault Checkout Items</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><b>Class 2</b></td><td>Junior Mechatronics Linkages</td><td><span class="box-badge yellow" onclick="showBoxModal('boxA')">📦 Box A (Structural)</span></td><td class="muted">None. Simple manual gears, axles, and mechanical cams.</td></tr>
            <tr><td><b>Class 3</b></td><td>Block Coding & 3D Drafting</td><td><span class="box-badge yellow" onclick="showBoxModal('boxA')">📦 Box A (Structural)</span></td><td class="muted">3D Pen + PLA filaments checked out for creative mechanical designs.</td></tr>
            <tr><td><b>Class 4</b></td><td>Scratch Coding & Circuit Basics</td><td><span class="box-badge blue" onclick="showBoxModal('boxB')">📦 Box B (Basic Electronics)</span></td><td class="muted">Raspberry Pi Pico (MicroPython), analog LDR & LM35 sensors.</td></tr>
            <tr><td><b>Class 5</b></td><td>Active Circuits & Remote Triggers</td><td><span class="box-badge blue" onclick="showBoxModal('boxB')">📦 Box B (Basic Electronics)</span></td><td class="muted">TSOP1838 IR Receiver & Remote (Remote Control logic), active buzzer.</td></tr>
            <tr><td><b>Class 6</b></td><td>Embedded C++ & Beginner IoT</td><td><span class="box-badge blue" onclick="showBoxB">📦 Box B</span> + <span class="box-badge green" onclick="showBoxModal('boxC')">📦 Box C</span></td><td class="muted">Arduino Uno R3, HC-SR04 Ultrasonic Sonar & HC-05 Bluetooth (checked out).</td></tr>
            <tr><td><b>Class 7</b></td><td>Smart Robotics & Displays</td><td><span class="box-badge green" onclick="showBoxModal('boxC')">📦 Box C (Sensors & IoT)</span></td><td class="muted">LCD1602 I2C Display (checked out), chassis wheels & L298N driver.</td></tr>
            <tr><td><b>Class 8</b></td><td>Precision IoT & Environment</td><td><span class="box-badge blue" onclick="showBoxB">📦 Box B</span> + <span class="box-badge green" onclick="showBoxModal('boxC')">📦 Box C</span></td><td class="muted">NodeMCU ESP8266 (WiFi), Soil Moisture, Rain Sensor, and DHT11.</td></tr>
            <tr><td><b>Class 9</b></td><td>Python, Keypads & Pumps</td><td><span class="box-badge blue" onclick="showBoxB">📦 Box B</span> + <span class="box-badge green" onclick="showBoxModal('boxC')">📦 Box C</span></td><td class="muted">4x4 flat membrane Keypad, 1CH Relay, and Submersible Water Pump.</td></tr>
            <tr><td><b>Class 10</b></td><td>Edge AI, RFID & Biosensing</td><td><span class="box-badge green" onclick="showBoxModal('boxC')">📦 Box C (Sensors & IoT)</span></td><td class="muted">ESP32 DevKit V1, ESP32-CAM, RC522 RFID, MQ-135, Pulse sensor, and Speakers.</td></tr>
            <tr><td><b>Class 11</b></td><td>Avionics & Autonomous Drones</td><td><span class="box-badge red" onclick="showBoxModal('boxD')">📦 Box D (Drone Assembly)</span></td><td class="muted">ESP32 Flight Core (DevKit V1), MPU6050 Gyro, and 1S LiPo flight batteries.</td></tr>
            <tr style="background:rgba(139,92,246,0.1);"><td><b>All Classes</b></td><td>Safety & Tools Base</td><td><span class="box-badge purple" onclick="showBoxModal('boxF')">📦 Box F (Safety & Consumables)</span></td><td class="muted">Available at all times for tools & glue.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="glass-card" style="border-left: 4px solid var(--green);">
        <h3><i class="fas fa-box-open text-glow-cyan" style="color:var(--green)"></i> Option 2: Universal Box Model (High-Convenience)</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:1rem;"><strong>Why this model?</strong> In this premium approach, we upgrade Box C to be a fully independent "Universal IoT Kit" by adding base electronics directly into it. Students in Class 6 through 10 only need to manage a single box on their desk, preventing clutter and saving class setup time. <br><em>Note: Adds approx. ₹1,500 - ₹2,000 per Box C (Total lab budget increases by approx. +₹20k).</em></p>
        
        <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <h4 style="font-size:0.85rem; color:var(--green); margin-bottom:0.5rem; text-transform:uppercase;">✨ Universal Box C Upgrades (Added Components):</h4>
          <ul style="font-size:0.85rem; color:#fff; margin-left: 1.5rem;">
            <li>Dedicated class-wise controllers: Arduino Uno R3 (Class 6 & 7), NodeMCU ESP8266 (Class 8 & 9), ESP32 DevKit V1 (Class 10 IoT), and ESP32-CAM DevKit (Class 10 Edge AI)</li>
            <li>Robotics drive parts: Laser-cut Acrylic Chassis, 2x BO Gear Motors, 2x Wheels, and 1x L298N H-Bridge Motor Driver</li>
            <li>Connection & Power base: 830-point breadboard, dual-slot 18650 Battery Pack & cells, Dupont jumper wires pack, and passives bundle</li>
          </ul>
        </div>

        <table class="matrix-table">
          <thead>
            <tr>
              <th width="10%">Class</th>
              <th width="25%">Syllabus Module</th>
              <th width="25%">Required Workbench Box</th>
              <th width="40%">Operational Benefit</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><b>Class 2 & 3</b></td><td>Mechatronics & 3D</td><td><span class="box-badge yellow" onclick="showBoxModal('boxA')">📦 Box A</span></td><td class="muted">Structural beams, manual gear ratios, cranks, and cam translation mechanisms (No controllers).</td></tr>
            <tr><td><b>Class 4 & 5</b></td><td>Basic Electronics</td><td><span class="box-badge blue" onclick="showBoxModal('boxB')">📦 Box B</span></td><td class="muted">Independent kit with Raspberry Pi Pico, LDR/LM35 analog sensors, and TSOP1838 IR remote control.</td></tr>
            <tr><td><b>Class 6 & 7</b></td><td>Smart IoT & Sensors</td><td><span class="box-badge green" onclick="showBoxModal('boxC')">📦 Box C (Universal)</span></td><td class="muted">Independent kit using dedicated Arduino Uno R3, HC-05 Bluetooth, and HC-SR04 Ultrasonic Sonar.</td></tr>
            <tr><td><b>Class 8 & 9</b></td><td>Precision Robotics</td><td><span class="box-badge green" onclick="showBoxModal('boxC')">📦 Box C (Universal)</span></td><td class="muted">Independent kit using dedicated NodeMCU ESP8266 (WiFi weather Station), Soil, Rain, Relay, Keypad, and Pump.</td></tr>
            <tr><td><b>Class 10</b></td><td>Edge AI & Vision</td><td><span class="box-badge green" onclick="showBoxModal('boxC')">📦 Box C (Universal)</span></td><td class="muted">Independent kit using dedicated ESP32 DevKit V1 & ESP32-CAM, RFID, MQ-135, Pulse biosensor, and Speaker.</td></tr>
            <tr><td><b>Class 11</b></td><td>Drones & Avionics</td><td><span class="box-badge red" onclick="showBoxModal('boxD')">📦 Box D</span></td><td class="muted">Aerodynamics kit featuring ESP32 DevKit V1 preloaded as Flight Core, MPU6050 Gyro, and coreless motors.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB: BUDGET & PROPOSAL -->
    <div id="tab-proposal" class="tab-panel">
      <div class="budget-summary">
        <div class="budget-metric">
          <div class="val">₹4.23L</div>
          <div class="lbl">Total Investment (Excl GST)</div>
        </div>
        <div class="budget-metric">
          <div class="val">40</div>
          <div class="lbl">Workbench Kits Provided</div>
        </div>
        <div class="budget-metric">
          <div class="val">300</div>
          <div class="lbl">Syllabus Topics Covered</div>
        </div>
        <div class="budget-metric">
          <div class="val">1 Yr</div>
          <div class="lbl">Comprehensive Warranty</div>
        </div>
      </div>

      <div class="glass-card">
        <h3><i class="fas fa-file-invoice-dollar text-glow-cyan"></i> Tinkering Lab Setup Pricing Breakdown</h3>
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Setup Item / Service Description</th>
              <th>Unit Cost</th>
              <th>Qty</th>
              <th style="text-align:right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Module 1: Junior Mechatronics Kit (Grade 1-2)</td>
              <td>₹ 2,200</td>
              <td>10</td>
              <td style="text-align:right">₹ 22,000</td>
            </tr>
            <tr>
              <td>Module 2: Foundation Electronics Kit (Grade 3-5)</td>
              <td>₹ 3,500</td>
              <td>10</td>
              <td style="text-align:right">₹ 35,000</td>
            </tr>
            <tr>
              <td>Module 3: Intermediate Robotics & IoT Kit (Grade 6-8)</td>
              <td>₹ 5,800</td>
              <td>10</td>
              <td style="text-align:right">₹ 58,000</td>
            </tr>
            <tr>
              <td>Module 4: Advanced Edge AI & Drone Kit (Grade 9-10)</td>
              <td>₹ 16,500</td>
              <td>10</td>
              <td style="text-align:right">₹ 1,65,000</td>
            </tr>
            <tr>
              <td>Bambu Lab P1S Combo</td>
              <td>₹ 68,200</td>
              <td>1</td>
              <td style="text-align:right">₹ 68,200</td>
            </tr>
            <tr>
              <td>Heavy-Duty Tools & Consumables Pack</td>
              <td>₹ 20,000</td>
              <td>1</td>
              <td style="text-align:right">₹ 20,000</td>
            </tr>
            <tr>
              <td>Lab Safety Equipment & Branding Pack</td>
              <td>₹ 10,000</td>
              <td>1</td>
              <td style="text-align:right">₹ 10,000</td>
            </tr>
            <tr>
              <td>Onsite Visiting Trainer Program (4-Month)</td>
              <td>₹ 45,000</td>
              <td>1 Set</td>
              <td style="text-align:right">₹ 45,000</td>
            </tr>
            <tr style="background: rgba(16,185,129,0.05);">
              <td>Professional Onsite Setup & LMS Hosting (Value Add)</td>
              <td>Included</td>
              <td>1 Set</td>
              <td style="text-align:right; color:var(--green); font-weight:bold;">FREE</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB: UNIVERSAL LEVEL MAP -->
    <div id="tab-universal" class="tab-panel">
      <div style="margin-bottom: 2rem;">
        <h2 style="font-family:'Outfit'; font-size:1.8rem; margin-bottom: 0.5rem;"><i class="fas fa-layer-group text-glow-cyan"></i> Universal Level Map (Option 2)</h2>
        <p style="color:var(--text-muted);">This dashboard maps the 4 Class-wise Levels to the 4 Standalone Student Kits (Box A, B, C, D) and shows the task-wise micro levels (Foundation, Build, Integration) for each class.</p>
      </div>

      <!-- Class-wise Levels Grid -->
      <div class="universal-grid">
        <div class="universal-card active" onclick="selectUniversalLevel(1)" id="lvl-card-1" style="--box-accent: var(--yellow); --box-glow: var(--glow-yellow);">
          <span class="badge level-badge-1">Level 1</span>
          <h4>Mechanical Basics</h4>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.3rem;">Classes 2 & 3 • Box A</p>
        </div>
        <div class="universal-card" onclick="selectUniversalLevel(2)" id="lvl-card-2" style="--box-accent: var(--blue); --box-glow: var(--glow-blue);">
          <span class="badge level-badge-2">Level 2</span>
          <h4>Circuit Logic</h4>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.3rem;">Classes 4 & 5 • Box B</p>
        </div>
        <div class="universal-card" onclick="selectUniversalLevel(3)" id="lvl-card-3" style="--box-accent: var(--green); --box-glow: var(--glow-green);">
          <span class="badge level-badge-3">Level 3</span>
          <h4>Universal IoT</h4>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.3rem;">Classes 6-10 • Box C</p>
        </div>
        <div class="universal-card" onclick="selectUniversalLevel(4)" id="lvl-card-4" style="--box-accent: var(--red); --box-glow: var(--glow-red);">
          <span class="badge level-badge-4">Level 4</span>
          <h4>Avionics & Drones</h4>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.3rem;">Class 11 • Box D</p>
        </div>
      </div>

      <!-- Interactive Kit Specification Table -->
      <div class="glass-card" style="margin-bottom: 2rem;">
        <h3 style="font-family:'Outfit'; font-size:1.3rem; margin-bottom: 1rem; color:#fff;" id="univ-kit-title">📦 Standalone Kit Specification: Box A</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.2rem;">Complete 1-1 component list inside this standalone kit under the Universal Model.</p>
        <table class="matrix-table">
          <thead>
            <tr>
              <th width="30%">Component Name</th>
              <th width="50%">Specification Details</th>
              <th width="20%" style="text-align:right">Quantity</th>
            </tr>
          </thead>
          <tbody id="univ-kit-tbody">
            <!-- Dynamic components rows -->
          </tbody>
        </table>
      </div>

      <!-- Task-wise Micro Levels Columns -->
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h3 style="font-family:'Outfit'; font-size:1.3rem; color:#fff;"><i class="fas fa-tasks text-glow-cyan"></i> Class Task Breakdown (30 Topics)</h3>
            <p style="font-size:0.85rem; color:var(--text-muted);">Select a class to view the topics grouped by difficulty and learning goals.</p>
          </div>
          <div class="class-tabs-row" style="margin: 0;">
            <span class="class-tab-chip active" id="univ-cls-chip-2" onclick="selectUnivClass(2)">Class 2</span>
            <span class="class-tab-chip" id="univ-cls-chip-3" onclick="selectUnivClass(3)">Class 3</span>
            <span class="class-tab-chip" id="univ-cls-chip-4" onclick="selectUnivClass(4)">Class 4</span>
            <span class="class-tab-chip" id="univ-cls-chip-5" onclick="selectUnivClass(5)">Class 5</span>
            <span class="class-tab-chip" id="univ-cls-chip-6" onclick="selectUnivClass(6)">Class 6</span>
            <span class="class-tab-chip" id="univ-cls-chip-7" onclick="selectUnivClass(7)">Class 7</span>
            <span class="class-tab-chip" id="univ-cls-chip-8" onclick="selectUnivClass(8)">Class 8</span>
            <span class="class-tab-chip" id="univ-cls-chip-9" onclick="selectUnivClass(9)">Class 9</span>
            <span class="class-tab-chip" id="univ-cls-chip-10" onclick="selectUnivClass(10)">Class 10</span>
            <span class="class-tab-chip" id="univ-cls-chip-11" onclick="selectUnivClass(11)">Class 11</span>
          </div>
        </div>

        <div class="level-columns">
          <!-- Col 1: Foundation -->
          <div class="level-col">
            <div class="level-col-header">
              <span style="background:var(--glow-yellow); color:var(--yellow)">Tasks 1-10</span>
              <h4>🚀 Foundation</h4>
            </div>
            <div id="univ-col-target-1"></div>
          </div>
          <!-- Col 2: Build & Configure -->
          <div class="level-col">
            <div class="level-col-header">
              <span style="background:var(--glow-blue); color:var(--blue)">Tasks 11-20</span>
              <h4>⚙️ Build & Tune</h4>
            </div>
            <div id="univ-col-target-2"></div>
          </div>
          <!-- Col 3: Systems Integration -->
          <div class="level-col">
            <div class="level-col-header">
              <span style="background:var(--glow-green); color:var(--green)">Tasks 21-30</span>
              <h4>🧠 Integration</h4>
            </div>
            <div id="univ-col-target-3"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: LAB SCHEDULE & FLOW -->
    <div id="tab-schedule" class="tab-panel active">
      <div class="glass-card" style="border-left: 4px solid var(--purple);">
        <h3><i class="fas fa-calendar-alt text-glow-cyan" style="color:var(--purple)"></i> School Timetable Integration & Robotics Lecture Flow</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:1.5rem;">This section illustrates how the Connect Shiksha robotics classes seamlessly integrate into standard school timetables. The focus is strictly on maintaining high practical engagement within limited school periods.</p>
        
        <h4 style="font-family:'Outfit'; color:#fff; margin-bottom:1rem; font-size:1.1rem;">📅 Master Weekly Timetable (Semester 1)</h4>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
          
          <!-- Mon-Tue -->
          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); border-radius: 12px; overflow: hidden;">
            <div style="background: rgba(6, 182, 212, 0.15); border-bottom: 1px solid rgba(6, 182, 212, 0.3); padding: 0.8rem; text-align: center;">
              <h5 style="color: var(--cyan); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em;">Mon - Tue</h5>
            </div>
            <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; line-height: 1.2;">5th Period<br><span style="font-size: 0.65rem; font-weight: normal; opacity: 0.8;">11:30 - 12:10</span></span>
                <span style="font-size: 0.9rem; color: #fff; font-weight: 800;"><span class="box-badge yellow" onclick="showBoxModal('boxA')" style="padding: 2px 6px; font-size:0.65rem; margin-right:5px; border:none; background:transparent;">📦 Box A</span> Class 2nd A</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; line-height: 1.2;">6th Period<br><span style="font-size: 0.65rem; font-weight: normal; opacity: 0.8;">12:10 - 12:50</span></span>
                <span style="font-size: 0.9rem; color: #fff; font-weight: 800;"><span class="box-badge yellow" onclick="showBoxModal('boxA')" style="padding: 2px 6px; font-size:0.65rem; margin-right:5px; border:none; background:transparent;">📦 Box A</span> Class 2nd B</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; line-height: 1.2;">7th Period<br><span style="font-size: 0.65rem; font-weight: normal; opacity: 0.8;">12:50 - 1:30</span></span>
                <span style="font-size: 0.9rem; color: #fff; font-weight: 800;"><span class="box-badge yellow" onclick="showBoxModal('boxA')" style="padding: 2px 6px; font-size:0.65rem; margin-right:5px; border:none; background:transparent;">📦 Box A</span> Class 3rd</span>
              </div>
            </div>
          </div>

          <!-- Wed-Thu -->
          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); border-radius: 12px; overflow: hidden;">
            <div style="background: rgba(245, 158, 11, 0.15); border-bottom: 1px solid rgba(245, 158, 11, 0.3); padding: 0.8rem; text-align: center;">
              <h5 style="color: var(--yellow); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em;">Wed - Thu</h5>
            </div>
            <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; line-height: 1.2;">5th Period<br><span style="font-size: 0.65rem; font-weight: normal; opacity: 0.8;">11:30 - 12:10</span></span>
                <span style="font-size: 0.9rem; color: #fff; font-weight: 800;"><span class="box-badge blue" onclick="showBoxModal('boxB')" style="padding: 2px 6px; font-size:0.65rem; margin-right:5px; border:none; background:transparent;">📦 Box B</span> Class 4th</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; line-height: 1.2;">6th Period<br><span style="font-size: 0.65rem; font-weight: normal; opacity: 0.8;">12:10 - 12:50</span></span>
                <span style="font-size: 0.9rem; color: #fff; font-weight: 800;"><span class="box-badge blue" onclick="showBoxModal('boxB')" style="padding: 2px 6px; font-size:0.65rem; margin-right:5px; border:none; background:transparent;">📦 Box B</span> Class 5th A</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; line-height: 1.2;">7th Period<br><span style="font-size: 0.65rem; font-weight: normal; opacity: 0.8;">12:50 - 1:30</span></span>
                <span style="font-size: 0.9rem; color: #fff; font-weight: 800;"><span class="box-badge blue" onclick="showBoxModal('boxB')" style="padding: 2px 6px; font-size:0.65rem; margin-right:5px; border:none; background:transparent;">📦 Box B</span> Class 5th B</span>
              </div>
            </div>
          </div>

          <!-- Fri-Sat -->
          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); border-radius: 12px; overflow: hidden;">
            <div style="background: rgba(16, 185, 129, 0.15); border-bottom: 1px solid rgba(16, 185, 129, 0.3); padding: 0.8rem; text-align: center;">
              <h5 style="color: var(--green); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em;">Fri - Sat</h5>
            </div>
            <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; line-height: 1.2;">5th Period<br><span style="font-size: 0.65rem; font-weight: normal; opacity: 0.8;">11:30 - 12:10</span></span>
                <span style="font-size: 0.9rem; color: #fff; font-weight: 800;"><span class="box-badge green" onclick="showBoxModal('boxC')" style="padding: 2px 6px; font-size:0.65rem; margin-right:5px; border:none; background:transparent;">📦 Box C</span> Class 6th A</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; line-height: 1.2;">6th Period<br><span style="font-size: 0.65rem; font-weight: normal; opacity: 0.8;">12:10 - 12:50</span></span>
                <span style="font-size: 0.9rem; color: #fff; font-weight: 800;"><span class="box-badge green" onclick="showBoxModal('boxC')" style="padding: 2px 6px; font-size:0.65rem; margin-right:5px; border:none; background:transparent;">📦 Box C</span> Class 6th B</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; line-height: 1.2;">7th Period<br><span style="font-size: 0.65rem; font-weight: normal; opacity: 0.8;">12:50 - 1:30</span></span>
                <span style="font-size: 0.9rem; color: #fff; font-weight: 800;"><span class="box-badge green" onclick="showBoxModal('boxC')" style="padding: 2px 6px; font-size:0.65rem; margin-right:5px; border:none; background:transparent;">📦 Box C</span> Class 7th</span>
              </div>
            </div>
          </div>
        </div>

        <div style="background: rgba(139, 92, 246, 0.1); border: 1px dashed rgba(139, 92, 246, 0.4); padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 2.5rem; display: flex; align-items: center; gap: 1.5rem;">
          <div style="font-size: 2.5rem; color: var(--purple); opacity: 0.8;"><i class="fas fa-forward"></i></div>
          <div>
            <h5 style="color: var(--purple); font-size: 1.05rem; margin-bottom: 0.2rem;">Semester 2 & Senior Classes Planning</h5>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Classes 8, 9, 10, and 11 (Python, Edge AI, and Drone Assembly) will be scheduled in Semester 2 using their respective Box C and Box D allocations.</p>
          </div>
        </div>

        <h4 style="font-family:'Outfit'; color:#fff; margin-bottom:1rem; font-size:1.1rem;">⏱️ The 40-Minute Standard Robotics Lecture Flow</h4>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom: 1.5rem;">For single-period sessions, the following timeline is strictly enforced to ensure students complete practical tasks without spilling over into the next class.</p>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); padding: 1.2rem 1.5rem; border-radius: 12px; display:flex; align-items:center; gap: 1.5rem;">
            <div style="background:rgba(245, 158, 11, 0.1); color:var(--yellow); border-radius:50%; width:60px; height:60px; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0; border:2px solid var(--yellow);">
              <span style="font-size:1.2rem; font-weight:800; line-height:1;">10</span>
              <span style="font-size:0.6rem; font-weight:700;">MINS</span>
            </div>
            <div>
              <h5 style="color: #fff; font-size: 1.05rem; margin-bottom: 0.2rem;">Phase 1: Conceptual Briefing & Kit Checkout</h5>
              <p style="color: var(--text-secondary); font-size: 0.85rem;">Teacher explains the core electronics/coding concept on the whiteboard. Workbench Captains collect their designated Box (A, B, C, or D) from the rack.</p>
            </div>
          </div>

          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); padding: 1.2rem 1.5rem; border-radius: 12px; display:flex; align-items:center; gap: 1.5rem;">
            <div style="background:rgba(59, 130, 246, 0.1); color:var(--blue); border-radius:50%; width:60px; height:60px; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0; border:2px solid var(--blue);">
              <span style="font-size:1.2rem; font-weight:800; line-height:1;">25</span>
              <span style="font-size:0.6rem; font-weight:700;">MINS</span>
            </div>
            <div>
              <h5 style="color: #fff; font-size: 1.05rem; margin-bottom: 0.2rem;">Phase 2: Hands-On Execution (Build & Code)</h5>
              <p style="color: var(--text-secondary); font-size: 0.85rem;">Students work collaboratively (Builder, Coder, Tester roles). They follow visual guides to wire breadboards, assemble mechatronics, and upload code via laptops.</p>
            </div>
          </div>

          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); padding: 1.2rem 1.5rem; border-radius: 12px; display:flex; align-items:center; gap: 1.5rem;">
            <div style="background:rgba(16, 185, 129, 0.1); color:var(--green); border-radius:50%; width:60px; height:60px; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0; border:2px solid var(--green);">
              <span style="font-size:1.2rem; font-weight:800; line-height:1;">05</span>
              <span style="font-size:0.6rem; font-weight:700;">MINS</span>
            </div>
            <div>
              <h5 style="color: #fff; font-size: 1.05rem; margin-bottom: 0.2rem;">Phase 3: Verification & Zero-Contamination Audit</h5>
              <p style="color: var(--text-secondary); font-size: 0.85rem;">Teacher verifies the project output. Inventory Officers disassemble the kits, cross-check component counts with the lid map, and safely return boxes to the rack.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <script>
    const curriculumData = ${JSON.stringify(curriculumData)};
    
    const boxData = {
      boxA: {
        name: "Box A: Mechatronics Structural Kit (Class 2 & 3)", accent: "var(--yellow)", glow: "var(--glow-yellow)",
        grid: [
          {
            row: "Structural Parts",
            cells: [
              { coord: "A1", merge: 3, name: "Perforated Plastic Beams", qty: "20 Units", desc: "Lego-compatible structural beams with holes (various lengths)." },
              { coord: "A2", merge: 2, name: "Connector Pegs", qty: "40 Units", desc: "Quick-snap connector pins (black friction pegs, grey axle pegs)." }
            ]
          },
          {
            row: "Mechanical Drive Parts",
            cells: [
              { coord: "A3", merge: 1, name: "Spur Gears", qty: "18 Units", desc: "8T, 20T, 40T precision gears." },
              { coord: "A4", merge: 1, name: "Axles/Shafts", qty: "10 Units", desc: "Steel or hard plastic shafts." },
              { coord: "A5", merge: 1, name: "Rubber Wheels", qty: "4 Units", desc: "High-grip wheels for carts/chassis." },
              { coord: "A6", merge: 1, name: "Pulleys & Belts", qty: "4 Sets", desc: "Pulleys and elastic drive belts." },
              { coord: "A7", merge: 1, name: "Manual Cranks", qty: "4 Sets", desc: "Rotary levers and linkages." }
            ]
          },
          {
            row: "Art & Tools",
            cells: [
              { coord: "A8", merge: 3, name: "3D Pen Set", qty: "1 Set", desc: "Drawing 3D pen + colored PLA loops (on demand)." },
              { coord: "A9", merge: 2, name: "Base Grid Plate", qty: "1 Unit", desc: "Rigid plastic mounting grid board." }
            ]
          }
        ]
      },
      boxB: {
        name: "Box B: Foundation Electronics & Pico Kit (Class 4 & 5)", accent: "var(--blue)", glow: "var(--glow-blue)",
        grid: [
          {
            row: "Controller & Power",
            cells: [
              { coord: "B1", merge: 2, name: "Raspberry Pi Pico", qty: "1 Unit", desc: "Dual-core RP2040 microcontroller board (Dedicated to Class 4 & 5, micro python code)." },
              { coord: "B2", merge: 2, name: "Solderless Breadboard", qty: "1 Unit", desc: "830 tie-point dual bus strip for circuits." },
              { coord: "B3", merge: 1, name: "9V Battery Power", qty: "1 Set", desc: "9V alkaline battery + DC jack snap connector." }
            ]
          },
          {
            row: "Actuators & Outputs",
            cells: [
              { coord: "B4", merge: 2, name: "Diffused LEDs", qty: "20 Units", desc: "Assorted 5mm LEDs (Red/Green/Yellow/Blue)." },
              { coord: "B5", merge: 1, name: "Active Buzzer", qty: "1 Unit", desc: "5V piezo buzzer for acoustic warnings." },
              { coord: "B6", merge: 1, name: "DC Hobby Motor", qty: "2 Units", desc: "3V-6V small toy motor + fan propeller." },
              { coord: "B7", merge: 1, name: "SG90 Servo Motor", qty: "1 Unit", desc: "9g micro servo (180 degree rotation)." }
            ]
          },
          {
            row: "Sensors & Inputs",
            cells: [
              { coord: "B8", merge: 1, name: "LDR Light Sensor", qty: "2 Units", desc: "Photoresistors for light-sensitive logic." },
              { coord: "B9", merge: 1, name: "LM35 Temp Sensor", desc: "Analog temperature sensor.", qty: "1 Unit" },
              { coord: "B10", merge: 3, name: "TSOP1838 IR Receiver Set", desc: "Infrared receiver module + 21-key slim remote controller for remote triggers.", qty: "1 Set" }
            ]
          },
          {
            row: "Passives & Testing",
            cells: [
              { coord: "B11", merge: 2, name: "Passive Components", desc: "Tactile buttons (4x), resistors pack, slide switch, potentiometer, BC547, capacitors.", qty: "1 Pack" },
              { coord: "B12", merge: 2, name: "Digital Multimeter", desc: "Handheld multimeter for diagnostics.", qty: "1 Unit" },
              { coord: "B13", merge: 1, name: "Vibration Pager Motor", desc: "3V pager motor for wobbly-bots.", qty: "1 Unit" }
            ]
          }
        ]
      },
      boxC: {
        name: "Box C: Standalone Universal IoT & Sensors Kit (Class 6-10)", accent: "var(--green)", glow: "var(--glow-green)",
        grid: [
          {
            row: "Microcontrollers",
            cells: [
              { coord: "C1", merge: 1, name: "Arduino Uno R3", qty: "1 Unit", desc: "CH340G development board + programming cable (Dedicated to Class 6 & 7)." },
              { coord: "C2", merge: 1, name: "NodeMCU ESP8266", qty: "1 Unit", desc: "CP2102 integrated serial chip, WiFi enabled board (Dedicated to Class 8 & 9)." },
              { coord: "C3", merge: 1, name: "ESP32 DevKit V1", qty: "1 Unit", desc: "30-pin dual-core board with WiFi & Bluetooth (Dedicated to Class 10 IoT)." },
              { coord: "C4", merge: 2, name: "ESP32-CAM DevKit & Shield", qty: "1 Set", desc: "ESP32 camera module + serial programmer shield + antenna (Dedicated to Class 10 AI)." }
            ]
          },
          {
            row: "Robotics & Drive Plate",
            cells: [
              { coord: "C5", merge: 2, name: "Acrylic Chassis Plate", qty: "1 Set", desc: "Robotics chassis plate + caster wheel + mounting kit." },
              { coord: "C6", merge: 1, name: "BO Gear Motors", qty: "2 Units", desc: "Dual-shaft DC motors (150 RPM) + rubber wheels." },
              { coord: "C7", merge: 2, name: "L298N Motor Driver", qty: "1 Unit", desc: "Dual H-Bridge motor controller board + heatsink." }
            ]
          },
          {
            row: "Basic IoT Sensors (C6-C7)",
            cells: [
              { coord: "C8", merge: 1, name: "HC-SR04 Sonar", qty: "1 Unit", desc: "Ultrasonic distance sensor module for obstacle detection." },
              { coord: "C9", merge: 1, name: "HC-05 Bluetooth", qty: "1 Unit", desc: "Serial Bluetooth module for remote smartphone control." },
              { coord: "C10", merge: 1, name: "LCD1602 (I2C)", qty: "1 Unit", desc: "16x2 character display with pre-soldered I2C interface." },
              { coord: "C11", merge: 2, name: "LDR Board & SG90", qty: "1 Set", desc: "LDR digital sensor board + SG90 servo motor (180 degree)." }
            ]
          },
          {
            row: "Intermediate IoT Sensors (C8-C9)",
            cells: [
              { coord: "C12", merge: 1, name: "DHT11 Sensor", qty: "1 Unit", desc: "Digital temperature/humidity module for weather station." },
              { coord: "C13", merge: 1, name: "Soil Hygrometer", qty: "1 Unit", desc: "Soil moisture probe + comparator module for irrigation." },
              { coord: "C14", merge: 1, name: "Rain Sensor Module", qty: "1 Unit", desc: "Rain detection nickel board + comparator module." },
              { coord: "C15", merge: 2, name: "Relay, Keypad & Pump", qty: "1 Set", desc: "1CH 5V Relay + 4x4 matrix Membrane Keypad + 5V mini Submersible Water Pump." }
            ]
          },
          {
            row: "Web & AI Sensors (C10)",
            cells: [
              { coord: "C16", merge: 1, name: "RC522 RFID", qty: "1 Set", desc: "13.56MHz SPI RFID reader card reader + key fob & card tags." },
              { coord: "C17", merge: 1, name: "MQ-135 Gas Sensor", qty: "1 Unit", desc: "Air quality gas sensor for pollution level check." },
              { coord: "C18", merge: 1, name: "Pulse Rate Sensor", qty: "1 Unit", desc: "Biosensing optical heart-rate pulse module." },
              { coord: "C19", merge: 1, name: "Neo-6M GPS Module", qty: "1 Unit", desc: "GPS satellite receiver board with ceramic patch antenna." },
              { coord: "C20", merge: 1, name: "Audio Amp & Speaker", qty: "1 Set", desc: "Max983571 class D amplifier + 4 Ohm 3W passive speaker." }
            ]
          },
          {
            row: "Power & Support",
            cells: [
              { coord: "C21", merge: 2, name: "18650 Battery Pack", qty: "1 Set", desc: "2x 18650 high-discharge Li-ion batteries + Dual-slot holder." },
              { coord: "C22", merge: 2, name: "Solderless Breadboard", qty: "1 Unit", desc: "830 tie-point dual bus strip self-adhesive board." },
              { coord: "C23", merge: 1, name: "Dupont Jumper Wires", qty: "60 Wires", desc: "Breadboard-friendly ribbon wires (20x M-M, 20x M-F, 20x F-F)." }
            ]
          }
        ]
      },
      boxD: {
        name: "Box D: Drone Assembly & Avionics Kit (Class 11)", accent: "var(--red)", glow: "var(--glow-red)",
        grid: [
          {
            row: "Avionics Core",
            cells: [
              { coord: "D1", merge: 2, name: "ESP32 Flight Core", qty: "1 Unit", desc: "ESP32 DevKit V1 pre-programmed as Flight Controller." },
              { coord: "D2", merge: 2, name: "Motor Driver PCB", qty: "1 Board", desc: "Custom MOSFET power distribution board." },
              { coord: "D3", merge: 1, name: "MPU6050 Gyro/Accel", qty: "1 Unit", desc: "Angle sensor module for stability." }
            ]
          },
          {
            row: "Drone Hardware",
            cells: [
              { coord: "D4", merge: 2, name: "8520 Coreless Motors", qty: "6 Units", desc: "High-RPM brushed motors (4 active, 2 spare)." },
              { coord: "D5", merge: 1, name: "65mm Propellers", qty: "3 Sets", desc: "CW and CCW matched flight propeller sets." },
              { coord: "D6", merge: 2, name: "Frame & Guards", qty: "1 Frame", desc: "3D printed quad frame + rotor protection rails." }
            ]
          },
          {
            row: "Power & Transceiver",
            cells: [
              { coord: "D7", merge: 2, name: "1S LiPo Batteries", qty: "2 Units", desc: "3.7V high-discharge rechargeable batteries." },
              { coord: "D8", merge: 1, name: "Smart USB Charger", qty: "1 Unit", desc: "1S LiPo multi-port charger." },
              { coord: "D9", merge: 2, name: "Radio Transceiver", qty: "1 Set", desc: "2.4GHz controller + receiver module." }
            ]
          }
        ]
      },
      binE: {
        name: "Bin E: Teacher's Shared Vault (Grey)", accent: "var(--grey)", glow: "var(--glow-grey)",
        grid: [
          {
            row: "3D Printing & Filament",
            cells: [
              { coord: "E1", merge: 3, name: "Bambu Lab P1S Combo", qty: "1 Unit", desc: "Enclosed CoreXY high-speed 3D printer for additive slicing." },
              { coord: "E2", merge: 2, name: "PLA Filament Spools", qty: "5 Spools", desc: "1.75mm PLA filament rolls for prototyping." }
            ]
          },
          {
            row: "Heavy Tools & Diagnostics",
            cells: [
              { coord: "E3", merge: 2, name: "Soldering Iron Kits", qty: "2 Kits", desc: "25W soldering iron, stand, solder wire, and flux paste." },
              { coord: "E4", merge: 1, name: "Digital Multimeters", qty: "2 Units", desc: "DT830D multimeters for electrical troubleshooting." },
              { coord: "E5", merge: 2, name: "Wire Strippers & Glue Guns", qty: "2 Sets", desc: "Self-adjusting wire strippers + 40W glue guns with sticks." }
            ]
          },
          {
            row: "Utility & Power Charging",
            cells: [
              { coord: "E6", merge: 2, name: "Precision Screwdrivers", qty: "1 Set", desc: "40pc magnetic precision screwdriver kit with extension bar." },
              { coord: "E7", merge: 2, name: "18650 Battery Smart Charger", qty: "2 Units", desc: "4-slot intelligent USB smart battery charger with LCD." },
              { coord: "E8", merge: 1, name: "Power Extension Boards", qty: "4 Units", desc: "4+1 socket standard extension surge protector cords." }
            ]
          }
        ]
      },
      boxF: {
        name: "Box F: Lab Safety & Consumables (Purple)", accent: "var(--purple)", glow: "var(--glow-purple)",
        grid: [
          {
            row: "Safety & Emergency",
            cells: [
              { coord: "F1", merge: 2, name: "Safety Goggles", qty: "10 Units", desc: "Clear anti-fog splash-proof protection goggles." },
              { coord: "F2", merge: 2, name: "First Aid Kit", qty: "1 Kit", desc: "Standard medical emergency aid kit." },
              { coord: "F3", merge: 1, name: "ABC Fire Extinguisher", qty: "1 Unit", desc: "2kg dry chemical powder fire extinguisher." }
            ]
          },
          {
            row: "Consumables & Insulation",
            cells: [
              { coord: "F4", merge: 3, name: "Heat Shrink Sleeves", qty: "1 Pack", desc: "Assorted 100pc heat shrink sleeve tubes (2mm to 8mm)." },
              { coord: "F5", merge: 2, name: "Insulation PVC Tapes", qty: "3 Rolls", desc: "Standard black electrical insulation tape rolls." }
            ]
          }
        ]
      }
    };

    function showBoxModal(boxId) {
      const b = boxData[boxId];
      if(!b) return;
      document.getElementById('modalTitle').innerText = b.name;
      document.getElementById('modalTitle').style.color = b.accent;
      document.getElementById('modalContentBlock').style.borderColor = b.accent;
      document.getElementById('modalContentBlock').style.boxShadow = '0 0 30px ' + b.glow;
      
      let html = '';
      b.grid.forEach(row => {
        html += '<h4 style="color:'+b.accent+'; font-size:0.8rem; text-transform:uppercase; margin-top:1rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.2rem;">' + row.row + '</h4>';
        row.cells.forEach(cell => {
          html += '<div class="modal-item-row">';
          html += '  <span class="modal-item-name">' + cell.name + '</span>';
          html += '  <span class="modal-item-desc">' + cell.desc + '</span>';
          html += '  <span class="modal-item-qty">' + cell.qty + '</span>';
          html += '</div>';
        });
      });
      document.getElementById('modalItemsList').innerHTML = html;
      document.getElementById('boxModal').style.display = 'flex';
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
      if (btn) btn.classList.add('active');
      if (tabId === 'tab-boxes') loadBoxGrid('boxA');
      if (tabId === 'tab-curriculum') filterClass(2);
      if (tabId === 'tab-universal') selectUniversalLevel(1);
    }

    function loadBoxGrid(boxType) {
      document.querySelectorAll('.box-selector-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(boxType)) btn.classList.add('active');
      });
      const config = boxData[boxType];
      const gridFrame = document.getElementById('box-grid-frame');
      gridFrame.style.setProperty('--box-accent', config.accent);
      gridFrame.style.setProperty('--box-glow', config.glow);
      document.getElementById('box-grid-title').innerText = config.name + " Map";
      
      const target = document.getElementById('grid-rows-target');
      target.innerHTML = '';
      
      config.grid.forEach((row, rowIdx) => {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'grid-row-header';
        rowHeader.innerText = row.row;
        target.appendChild(rowHeader);
        
        const cellsRow = document.createElement('div');
        cellsRow.className = 'grid-cells-row';
        
        row.cells.forEach((cell, cellIdx) => {
          const cellDiv = document.createElement('div');
          cellDiv.className = \`grid-cell w-\${cell.merge}\`;
          cellDiv.setAttribute('onclick', \`showCompartmentDetails('\${boxType}', \${rowIdx}, \${cellIdx})\`);
          cellDiv.innerHTML = \`<div class="coord">\${cell.coord}</div><div class="item-name">\${cell.name}</div><div class="item-qty">\${cell.qty}</div>\`;
          cellsRow.appendChild(cellDiv);
        });
        target.appendChild(cellsRow);
      });
      document.getElementById('compartment-details-box').innerHTML = \`
        <div class="details-placeholder"><i class="fas fa-info-circle" style="color:\${config.accent}"></i>
        <p>Click any compartment slot in the grid above to view details, component inventory, dimension specs, and fitment checks.</p></div>
      \`;
    }

    function showCompartmentDetails(boxType, rowIdx, cellIdx) {
      document.querySelectorAll('.grid-cell').forEach(c => c.classList.remove('active'));
      event.currentTarget.classList.add('active');
      const config = boxData[boxType];
      const cell = config.grid[rowIdx].cells[cellIdx];
      const detailsBox = document.getElementById('compartment-details-box');
      detailsBox.style.borderLeft = \`4px solid \${config.accent}\`;
      detailsBox.innerHTML = \`
        <h3 style="font-family:'Outfit',sans-serif; font-size:1.25rem; color:#fff; display:flex; align-items:center; gap:0.5rem">
          <i class="fas fa-box" style="color:\${config.accent}"></i> \${cell.name}
        </h3>
        <div class="details-grid">
          <div class="details-item accent" style="--box-accent: \${config.accent}"><h5>Coordinate Slot</h5><p>\${cell.coord}</p></div>
          <div class="details-item accent" style="--box-accent: \${config.accent}"><h5>Stock Quantity</h5><p>\${cell.qty}</p></div>
        </div>
        <div style="margin-top: 1.2rem; border-top: 1px solid var(--card-border); padding-top: 0.8rem;">
          <h5 style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem;">Sourcing Specification</h5>
          <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">\${cell.desc}</p>
        </div>
      \`;
    }

    let selectedClassNum = 2;
    function filterClass(classNum) {
      selectedClassNum = classNum;
      document.querySelectorAll('.class-tab-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.innerText.trim() === \`Class \${classNum}\`) chip.classList.add('active');
      });
      renderCurriculumGrid();
    }

    function renderCurriculumGrid() {
      const days = curriculumData[selectedClassNum] || [];
      const searchQuery = document.getElementById('curriculum-search').value.toLowerCase();
      const target = document.getElementById('curriculum-days-target');
      target.innerHTML = '';

      const filtered = days.filter(d => {
        return (d.topic && d.topic.toLowerCase().includes(searchQuery)) || 
               (d.parts && d.parts.toLowerCase().includes(searchQuery)) ||
               (d.desc && d.desc.toLowerCase().includes(searchQuery));
      });

      if (filtered.length === 0) {
        target.innerHTML = \`<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-dim);"><i class="fas fa-search-minus" style="font-size: 2rem; margin-bottom: 0.5rem;"></i><p>No worksheets match your query.</p></div>\`;
        return;
      }

      filtered.forEach(d => {
        const card = document.createElement('div');
        card.className = 'day-card';
        card.innerHTML = \`
          <div>
            <div class="day-card-header"><span class="day-num">Topic \${d.day}</span><span class="day-chip">\${d.parts}</span></div>
            <div class="day-title">\${d.topic}</div>
            <div class="day-desc">\${d.desc}</div>
          </div>
          <div class="day-footer">
            <span>🎯 <b>Goal:</b> \${d.test}</span>
          </div>
        \`;
        target.appendChild(card);
      });
    }

    /* Universal Level Map Functions */
    const universalBoxSpecs = {
      boxA: [
        { name: "Perforated Plastic Beams", desc: "Lego-compatible structural beams with holes (various lengths)", qty: "20 Units" },
        { name: "Connector Pegs & Pins", desc: "Quick-snap connectors (black friction pegs, grey axle pegs)", qty: "40 Units" },
        { name: "Spur Gears", desc: "8T, 20T, and 40T precision plastic gears", qty: "18 Units" },
        { name: "Axles & Shafts", desc: "Steel and high-strength plastic axles (various lengths)", qty: "10 Units" },
        { name: "Rubber Wheels & Tires", desc: "High-traction rubber wheels for chassis builds", qty: "4 Units" },
        { name: "Pulley Wheels & Belts", desc: "Friction drive wheels and rubber transmission belts", qty: "4 Units" },
        { name: "Manual Cranks & Linkages", desc: "Rotary levers and structural connecting links", qty: "4 Sets" },
        { name: "Base Grid Plate", desc: "Rigid plastic mounting grid board for structural assembly", qty: "1 Unit" },
        { name: "3D Pen & PLA Filaments", desc: "3D drawing pen with multi-color PLA plastic filament rolls", qty: "1 Set" },
        { name: "Safety Plastic Screwdriver", desc: "Dual-head kid-safe plastic screwdriver tool", qty: "1 Unit" }
      ],
      boxB: [
        { name: "Raspberry Pi Pico", desc: "Dual-core RP2040 microcontroller (Dedicated to Class 4 & 5, micro python code)", qty: "1 Unit" },
        { name: "Solderless Breadboard (830)", desc: "830 tie-point dual bus strip for prototyping circuits", qty: "1 Unit" },
        { name: "LDR Light Sensors", desc: "Photoresistors (Light Dependent Resistors) for light-sensitive logic (Analog)", qty: "2 Units" },
        { name: "Temperature Sensor (LM35)", desc: "Precision analog centigrade temperature sensor (Analog)", qty: "1 Unit" },
        { name: "IR Receiver & Remote (TSOP1838)", desc: "TSOP1838 receiver module + 21-key slim remote controller (Remote control logic)", qty: "1 Set" },
        { name: "DC Hobby Motor & Propeller", desc: "3V-6V small round DC motor with 4-blade plastic fan propeller", qty: "2 Units" },
        { name: "Vibration Coin Pager Motor", desc: "3V pager motor for wobbly-bots and haptics", qty: "1 Unit" },
        { name: "Mini Servo Motor (SG90)", desc: "9g micro analog gear servo (180 degree rotation)", qty: "1 Unit" },
        { name: "Active Buzzer", desc: "5V active piezo electronic buzzer for acoustic feedback", qty: "1 Unit" },
        { name: "Assorted LEDs & RGB", desc: "Diffused 5mm LEDs (Red/Green/Yellow/Blue) and 5mm RGB LED", qty: "20 Units" },
        { name: "Potentiometers & Passives", desc: "10kΩ rotary pot + 4 tactile switches + SPDT slide switch + NPN BC547 transistors", qty: "1 Set" },
        { name: "Assorted Resistors & Caps", desc: "Carbon film resistors (220Ω, 1kΩ, 10kΩ, 100kΩ) and mixed capacitors pack", qty: "1 Pack" },
        { name: "Jumper Wires & Power", desc: "Male-to-Male jumper breadboard cables + 9V battery snap + AA battery holder case", qty: "1 Set" },
        { name: "Digital Multimeter", desc: "Handheld mini multimeter with probe cables for circuit diagnostics", qty: "1 Unit" }
      ],
      boxC: [
        { name: "Arduino Uno R3", desc: "Standard development board (Dedicated to Class 6 & 7 beginner IoT)", qty: "1 Unit" },
        { name: "NodeMCU ESP8266", desc: "WiFi integrated development board (Dedicated to Class 8 & 9 internet-connected IoT)", qty: "1 Unit" },
        { name: "ESP32 DevKit V1 (30-pin)", desc: "Dual-core processor with WiFi & BLE (Dedicated to Class 10 advanced IoT)", qty: "1 Unit" },
        { name: "ESP32-CAM DevKit & Shield", desc: "ESP32 camera module + serial programmer shield + antenna (Dedicated to Class 10 Edge AI)", qty: "1 Set" },
        { name: "Acrylic Robotics Chassis", desc: "Laser-cut acrylic plate + caster wheel + screw hardware", qty: "1 Set" },
        { name: "BO Gear Motors & Wheels", desc: "Dual-shaft yellow gear motors (150 RPM) + high-grip rubber tires", qty: "2 Units" },
        { name: "L298N Motor Driver", desc: "Dual H-Bridge driver board for motor speed and direction control", qty: "1 Unit" },
        { name: "HC-SR04 Ultrasonic Sonar", desc: "Non-contact ranging distance sensor module (Class 6 & 7)", qty: "1 Unit" },
        { name: "HC-05 Bluetooth Module", desc: "Serial RF transceiver module for smartphone robot control (Class 6 & 7)", qty: "1 Unit" },
        { name: "LDR Light Sensor Board", desc: "Light intensity sensor board with digital/analog outputs (Class 6 & 7)", qty: "1 Unit" },
        { name: "LCD1602 Display with I2C", desc: "16x2 character blue backlight screen with I2C backpack interface (Class 6 & 7)", qty: "1 Unit" },
        { name: "SG90 Servo Motor (180°)", desc: "9g micro gear motor for steering and robotic arms (Class 6 & 7)", qty: "1 Unit" },
        { name: "DHT11 Weather Sensor", desc: "Digital temperature and relative humidity sensor (Class 8 & 9)", qty: "1 Unit" },
        { name: "Soil Moisture Sensor", desc: "Corrosion-resistant soil moisture probe + comparator module (Class 8 & 9)", qty: "1 Unit" },
        { name: "Rain Sensor Module", desc: "Rain detection board with digital comparator (Class 8 & 9)", qty: "1 Unit" },
        { name: "1-Channel 5V Relay Module", desc: "High-voltage appliance switching module (Class 8 & 9)", qty: "1 Unit" },
        { name: "Membrane 4x4 Keypad", desc: "16-key matrix flat entry keypad for input codes (Class 8 & 9)", qty: "1 Unit" },
        { name: "5V Submersible Water Pump", desc: "Mini DC pump + 1-meter flexible tubing for smart plants (Class 8 & 9)", qty: "1 Set" },
        { name: "RFID Card Reader (RC522)", desc: "13.56MHz SPI reader + key fob & RFID card tags (Class 10 security)", qty: "1 Set" },
        { name: "MQ-135 Air Quality Sensor", desc: "Hazardous gas and air quality pollution sensor module (Class 10 safety)", qty: "1 Unit" },
        { name: "Pulse Rate Sensor", desc: "Biosensing optical heart-rate pulse module (Class 10 health)", qty: "1 Unit" },
        { name: "Neo-6M GPS Module", desc: "GPS satellite receiver board with ceramic patch antenna (Class 9/10 tracking)", qty: "1 Unit" },
        { name: "MAX983571 Audio Amp & Speaker", desc: "I2S class D amplifier + 4 Ohm 3W passive speaker for sound logic (Class 10 voice output)", qty: "1 Set" },
        { name: "Solderless Breadboard (830)", desc: "830 tie-point dual bus strip for prototyping circuits", qty: "1 Unit" },
        { name: "18650 Battery Pack & Holder", desc: "2x 18650 rechargeable Li-ion cells + Dual-slot holder with wire leads", qty: "1 Set" },
        { name: "Dupont Ribbon Jumper Wires", desc: "60-wire bundle of breadboard hookups (20x M-M, 20x M-F, 20x F-F)", qty: "60 Wires" },
        { name: "Basic Components Pack", desc: "Assorted LEDs (Red/Green/Yellow/Blue), resistors pack, slide switches, push buttons, active buzzer, transistors, and capacitors", qty: "1 Set" }
      ],
      boxD: [
        { name: "ESP32 Flight Controller", desc: "Pre-programmed flight control processor (Dedicated to Class 11, using ESP32 DevKit V1)", qty: "1 Unit" },
        { name: "3D Printed Drone Frame", desc: "Lightweight quad frame with integrated prop guards", qty: "1 Unit" },
        { name: "8520 Coreless Motors", desc: "High-RPM micro coreless motors (4 active, 2 spare)", qty: "6 Units" },
        { name: "65mm Propellers", desc: "CW and CCW matched flight propellers", qty: "3 Sets" },
        { name: "Custom Motor Driver PCB", desc: "Dedicated power distribution and MOSFET driver board", qty: "1 Unit" },
        { name: "MPU6050 Gyro Module", desc: "3-axis gyroscope and 3-axis accelerometer angle sensor", qty: "1 Unit" },
        { name: "MT3608 Boost Converter", desc: "High-efficiency step-up voltage regulator (3.7V to 5V)", qty: "1 Unit" },
        { name: "1S LiPo Batteries", desc: "3.7V 500-800mAh high-discharge lipo flight batteries", qty: "2 Units" },
        { name: "Smart USB Charger", desc: "Compact 1S LiPo multi-port USB charger board", qty: "1 Unit" },
        { name: "Radio Transceiver System", desc: "2.4GHz transmitter controller + receiver module", qty: "1 Set" },
        { name: "Safety Accessories", desc: "Zip ties, mounting tape, and rubber bands bundle", qty: "1 Pack" }
      ]
    };

    let selectedUniversalLevelNum = 1;
    let selectedUniversalClassNum = 2;

    function selectUniversalLevel(lvlNum) {
      selectedUniversalLevelNum = lvlNum;
      document.querySelectorAll('.universal-card').forEach(c => c.classList.remove('active'));
      const card = document.getElementById('lvl-card-' + lvlNum);
      if (card) card.classList.add('active');
      
      let boxId = 'boxA';
      let targetClass = 2;
      if (lvlNum === 1) { boxId = 'boxA'; targetClass = 2; }
      else if (lvlNum === 2) { boxId = 'boxB'; targetClass = 4; }
      else if (lvlNum === 3) { boxId = 'boxC'; targetClass = 6; }
      else if (lvlNum === 4) { boxId = 'boxD'; targetClass = 11; }
      
      loadUniversalBoxSpec(boxId);
      selectUnivClass(targetClass);
    }

    function loadUniversalBoxSpec(boxId) {
      const components = universalBoxSpecs[boxId] || [];
      const tbody = document.getElementById('univ-kit-tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      
      const boxNames = { boxA: "Box A: Junior Mechatronics Kit", boxB: "Box B: Foundation Electronics Kit", boxC: "Box C: Universal IoT & Sensors Kit", boxD: "Box D: Drone Assembly Kit" };
      const titleElem = document.getElementById('univ-kit-title');
      if (titleElem) titleElem.innerText = '📦 Standalone Kit Specification: ' + (boxNames[boxId] || boxId);
      
      components.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = \`<td><b>\${c.name}</b></td><td>\${c.desc}</td><td style="text-align:right; font-weight:700;">\${c.qty}</td>\`;
        tbody.appendChild(tr);
      });
    }

    function selectUnivClass(classNum) {
      selectedUniversalClassNum = classNum;
      
      // Update chips UI
      document.querySelectorAll('.class-tab-chip').forEach(chip => {
        if (chip.getAttribute('onclick') && chip.getAttribute('onclick').includes('selectUnivClass')) {
          chip.classList.remove('active');
        }
      });
      const targetChip = document.getElementById('univ-cls-chip-' + classNum);
      if (targetChip) targetChip.classList.add('active');
      
      // Update Class-wise level card selection based on class
      let lvl = 1;
      if (classNum == 2 || classNum == 3) lvl = 1;
      else if (classNum == 4 || classNum == 5) lvl = 2;
      else if (classNum >= 6 && classNum <= 10) lvl = 3;
      else if (classNum == 11) lvl = 4;
      
      document.querySelectorAll('.universal-card').forEach(c => c.classList.remove('active'));
      const lvlCard = document.getElementById('lvl-card-' + lvl);
      if (lvlCard) lvlCard.classList.add('active');
      
      const boxNames = { 1: 'boxA', 2: 'boxB', 3: 'boxC', 4: 'boxD' };
      loadUniversalBoxSpec(boxNames[lvl]);

      renderUnivColumns();
    }

    function renderUnivColumns() {
      const days = curriculumData[selectedUniversalClassNum] || [];
      const col1 = document.getElementById('univ-col-target-1');
      const col2 = document.getElementById('univ-col-target-2');
      const col3 = document.getElementById('univ-col-target-3');
      
      if (!col1 || !col2 || !col3) return;
      
      col1.innerHTML = '';
      col2.innerHTML = '';
      col3.innerHTML = '';
      
      days.forEach(d => {
        const card = document.createElement('div');
        card.className = 'mini-task-card';
        card.innerHTML = \`
          <div class="mini-task-header">
            <span class="mini-task-day">Topic \${d.day}</span>
            <span class="mini-task-chip">\${d.parts}</span>
          </div>
          <div class="mini-task-title">\${d.topic}</div>
          <div class="mini-task-desc">\${d.desc}</div>
          <span class="mini-task-goal">🎯 <b>Goal:</b> \${d.test}</span>
        \`;
        
        if (d.day >= 1 && d.day <= 10) {
          col1.appendChild(card);
        } else if (d.day >= 11 && d.day <= 20) {
          col2.appendChild(card);
        } else if (d.day >= 21 && d.day <= 30) {
          col3.appendChild(card);
        }
      });
    }

    window.addEventListener('DOMContentLoaded', () => {
      switchTab('tab-schedule');
    });
  </script>
</body>
</html>`;

const rootPath = 'c:\\Users\\rohit\\OneDrive\\Desktop\\All Docs\\School\\Lab Setup and Carriculam\\Interactive_STEM_Lab_Guide.html';
const deployPath = 'c:\\Users\\rohit\\OneDrive\\Desktop\\All Docs\\School\\Lab Setup and Carriculam\\deploy\\index.html';

fs.writeFileSync(rootPath, htmlContent);
try {
  const path = require('path');
  const deployDir = path.dirname(deployPath);
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
  }
  fs.writeFileSync(deployPath, htmlContent);
  console.log('HTML generated successfully in root and deploy/ index.html.');
} catch (err) {
  console.error('Error writing to deploy path:', err);
  console.log('HTML generated successfully in root.');
}
