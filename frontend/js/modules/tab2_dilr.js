window.DILR_DRILL_IDX = 0;
window.DILR_DRILL_VIEW = "single";
window.DILR_DRILL_STATE = {};

window.getDilrDrillsForModule = function (mod) {
  const extra = (window.IPM_DILR_VARC_BANK || {})[mod.id] || [];
  return [...(mod.questions || []), ...extra];
};

window.renderDilrDrillCard = function (q, idx, total) {
  const st = window.DILR_DRILL_STATE[q.id];
  return `
    <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-cyan-400">DI/LR Practice Question ${idx + 1} of ${total}</span>
        <span class="text-[10px] px-2.5 py-0.5 rounded font-semibold ${
          q.type === "SA_NUMERIC" ? "bg-amber-500/20 text-amber-300" : "bg-sky-500/20 text-sky-300"
        }">${q.type === "SA_NUMERIC" ? "Indore QA-SA DI (Zero Negative)" : "MCQ (+4 / -1)"}</span>
      </div>
      <p class="text-xs md:text-sm text-slate-100 whitespace-pre-line leading-relaxed">${q.prompt}</p>
      ${
        q.type === "SA_NUMERIC"
          ? `<div class="flex flex-wrap gap-2 items-center">
               <input id="dilr-in-${q.id}" type="text" value="${st?.picked || ""}" placeholder="Enter exact value..."
                 class="rounded-lg bg-slate-900 border border-amber-500/50 px-3 py-1.5 text-xs text-amber-300 font-mono">
               <button onclick="window.revealDilr('${q.id}')" class="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white">Check Answer</button>
             </div>`
          : `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              ${q.options.map((opt, oi) => {
                let cls = "bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500";
                if (st) {
                  if (oi === q.answer) cls = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold";
                  else if (oi === st.picked && !st.correct) cls = "bg-rose-950/60 border-rose-500 text-rose-200";
                }
                return `<button onclick="window.revealDilr('${q.id}', ${oi}, ${q.answer})"
                  class="text-left p-2.5 rounded-xl border text-xs transition ${cls}">
                  <strong>${String.fromCharCode(65 + oi)}.</strong> ${opt}
                </button>`;
              }).join("")}
             </div>`
      }
      <div class="${st ? "" : "hidden"} p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/40 text-xs text-emerald-200">
        ${st ? `<strong>${st.banner}</strong><br>${q.explanation}` : ""}
      </div>
    </div>
  `;
};

window.renderTab2 = function (el) {
  const mods = window.getDilrModules();
  if (!window.IPM_STATE.selectedDilrId || !mods.some(m => m.id === window.IPM_STATE.selectedDilrId)) {
    window.IPM_STATE.selectedDilrId = mods[0].id;
    window.DILR_DRILL_IDX = 0;
  }
  const activeMod = mods.find(m => m.id === window.IPM_STATE.selectedDilrId);
  const sub = window.IPM_STATE.dilrSubTab;
  const allDrills = window.getDilrDrillsForModule(activeMod);
  if (window.DILR_DRILL_IDX >= allDrills.length) window.DILR_DRILL_IDX = 0;

  const solved = allDrills.filter(q => window.DILR_DRILL_STATE[q.id]).length;
  const correct = allDrills.filter(q => window.DILR_DRILL_STATE[q.id]?.correct).length;

  el.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div class="lg:col-span-4 space-y-2 lg:h-[calc(100vh-225px)] lg:overflow-y-auto lg:pr-2 pane-scroll">
        <div class="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">DI & Logical Reasoning (${mods.length} Modules)</div>
        ${mods.map(m => `
          <button onclick="window.selectDilrModule('${m.id}')"
            class="w-full text-left p-3 rounded-xl border transition ${
              m.id === activeMod.id
                ? "bg-cyan-950/70 border-cyan-500 text-white"
                : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600"
            }">
            <div class="font-semibold text-sm">${m.title}</div>
            <div class="text-[11px] text-slate-400 mt-1">${m.weightage}</div>
          </button>
        `).join("")}
      </div>

      <div class="lg:col-span-8 space-y-4 lg:h-[calc(100vh-225px)] lg:overflow-y-auto lg:pr-2 pane-scroll">
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span class="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">DI / LR Studio</span>
              <h2 class="text-xl font-bold text-white mt-1">${activeMod.title}</h2>
            </div>
            <div class="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button onclick="window.setDilrSubTab('refresher')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${sub === 'refresher' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}">
                Chapter Refresher & Theory
              </button>
              <button onclick="window.setDilrSubTab('drills')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${sub === 'drills' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}">
                Shortcuts & ${allDrills.length} Practice Sets
              </button>
            </div>
          </div>

          ${
            sub === "refresher"
              ? window.renderRefresherCard(activeMod.id, "cyan")
              : `<div class="space-y-4">
                  <div class="p-4 rounded-2xl bg-cyan-950/25 border border-cyan-500/40 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div class="text-xs font-bold uppercase tracking-wider text-amber-300">Interactive DI/LR Practice (${allDrills.length} Questions)</div>
                        <div class="text-[11px] text-slate-300 mt-0.5">Attempted: <strong>${solved}/${allDrills.length}</strong> &bull; Correct: <strong class="text-emerald-300">${correct}</strong></div>
                      </div>
                      <div class="flex gap-1.5">
                        <button onclick="window.setDilrDrillView('single')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold ${window.DILR_DRILL_VIEW === 'single' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700'}">Focus Mode (Prev / Next)</button>
                        <button onclick="window.setDilrDrillView('all')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold ${window.DILR_DRILL_VIEW === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700'}">View All ${allDrills.length}</button>
                      </div>
                    </div>

                    ${
                      window.DILR_DRILL_VIEW === "single"
                        ? `<div class="flex flex-wrap gap-1 pt-1">
                             ${allDrills.map((item, i) => {
                               const st = window.DILR_DRILL_STATE[item.id];
                               const cur = i === window.DILR_DRILL_IDX;
                               let pillCls = "bg-slate-900 text-slate-400 border-slate-700";
                               if (st) pillCls = st.correct ? "bg-emerald-600/30 text-emerald-200 border-emerald-500" : "bg-rose-600/30 text-rose-200 border-rose-500";
                               if (cur) pillCls += " ring-2 ring-cyan-400 text-white font-bold";
                               return `<button onclick="window.jumpDilrDrill(${i})" class="w-7 h-7 rounded-lg border text-[11px] transition ${pillCls}">${i + 1}</button>`;
                             }).join("")}
                           </div>
                           ${allDrills.length ? window.renderDilrDrillCard(allDrills[window.DILR_DRILL_IDX], window.DILR_DRILL_IDX, allDrills.length) : ""}
                           <div class="flex items-center justify-between pt-1">
                             <button onclick="window.stepDilrDrill(-1)" ${window.DILR_DRILL_IDX === 0 ? "disabled" : ""} class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white">&larr; Previous</button>
                             <span class="text-xs text-slate-400 font-semibold">${window.DILR_DRILL_IDX + 1} / ${allDrills.length}</span>
                             <button onclick="window.stepDilrDrill(1)" ${window.DILR_DRILL_IDX >= allDrills.length - 1 ? "disabled" : ""} class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs font-bold text-white">Next &rarr;</button>
                           </div>`
                        : `<div class="space-y-3">${allDrills.map((q, i) => window.renderDilrDrillCard(q, i, allDrills.length)).join("")}</div>`
                    }
                  </div>

                  ${activeMod.concepts.map(c => `
                    <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                      <h3 class="font-bold text-cyan-300 text-sm">${c.heading}</h3>
                      <div class="px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 font-mono text-xs text-amber-300">${c.formula}</div>
                      <p class="text-xs text-slate-300">${c.derivation}</p>
                      <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/40 text-xs text-emerald-200"><strong>Speed Technique:</strong> ${c.shortcut}</div>
                    </div>
                  `).join("")}
                </div>`
          }
        </div>
      </div>
    </div>
  `;
};

window.selectDilrModule = function (id) { window.IPM_STATE.selectedDilrId = id; window.DILR_DRILL_IDX = 0; window.renderActiveTab(); };
window.setDilrSubTab = function (sub) { window.IPM_STATE.dilrSubTab = sub; window.renderActiveTab(); };
window.setDilrDrillView = function (v) { window.DILR_DRILL_VIEW = v; window.renderActiveTab(); };
window.jumpDilrDrill = function (i) { window.DILR_DRILL_IDX = i; window.renderActiveTab(); };
window.stepDilrDrill = function (d) {
  const activeMod = window.getDilrModules().find(m => m.id === window.IPM_STATE.selectedDilrId);
  const total = window.getDilrDrillsForModule(activeMod).length;
  window.DILR_DRILL_IDX = Math.max(0, Math.min(total - 1, window.DILR_DRILL_IDX + d));
  window.renderActiveTab();
};
window.revealDilr = function (qid, picked, correct) {
  const activeMod = window.getDilrModules().find(m => m.id === window.IPM_STATE.selectedDilrId);
  const q = window.getDilrDrillsForModule(activeMod).find(item => item.id === qid);
  if (!q) return;
  if (picked === undefined) {
    const typed = (document.getElementById("dilr-in-" + qid)?.value || "").trim();
    const ok = typed === String(q.answer).trim();
    window.DILR_DRILL_STATE[qid] = { picked: typed, correct: ok, banner: ok ? `Exact Match! (+4) — Answer: ${q.answer}` : `Target SA Answer: ${q.answer}` };
  } else {
    const ok = picked === correct;
    window.DILR_DRILL_STATE[qid] = { picked: picked, correct: ok, banner: ok ? "Correct (+4 Marks)" : `Incorrect (-1) — Correct Option: ${String.fromCharCode(65 + correct)}` };
  }
  window.renderActiveTab();
};