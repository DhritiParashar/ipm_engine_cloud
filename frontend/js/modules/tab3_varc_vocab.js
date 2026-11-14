window.VARC_DRILL_IDX = 0;
window.VARC_DRILL_VIEW = "single";
window.VARC_DRILL_STATE = {};

window.CONFUSABLE_VOCAB_BANK = [
  { pair: "Appraise vs. Apprise", rule: "Appraise = assess value/quality; Apprise = inform or notify ('apprise of')." },
  { pair: "Discreet vs. Discrete", rule: "Discreet = tactful, prudent; Discrete = separate, distinct, non-continuous." },
  { pair: "Elicit vs. Illicit", rule: "Elicit (verb) = draw out a response/truth; Illicit (adj) = illegal or forbidden." },
  { pair: "Mitigate vs. Militate", rule: "Mitigate = lessen severity; Militate (against) = act as a strong factor preventing something." },
  { pair: "Proscribe vs. Prescribe", rule: "Proscribe = formally forbid/ban; Prescribe = recommend or authorize a remedy." },
  { pair: "Ingenious vs. Ingenuous", rule: "Ingenious = clever, inventive; Ingenuous = innocent, candid, naive." },
  { pair: "Disinterested vs. Uninterested", rule: "Disinterested = impartial, unbiased; Uninterested = bored, indifferent." },
  { pair: "Complacent vs. Complaisant", rule: "Complacent = smugly self-satisfied; Complaisant = eager to please/accommodate." },
  { pair: "Censure vs. Censor", rule: "Censure = strongly criticize/reprimand; Censor = suppress/delete objectionable content." },
  { pair: "Tortuous vs. Torturous", rule: "Tortuous = winding, full of twists; Torturous = causing severe pain or agony." },
  { pair: "Credible vs. Credulous", rule: "Credible = believable, trustworthy; Credulous = gullible, easily fooled." },
  { pair: "Imminent vs. Eminent", rule: "Imminent = about to happen soon; Eminent = famous and respected." },
  { pair: "Allude vs. Elude", rule: "Allude = refer indirectly; Elude = evade or escape capture/understanding." },
  { pair: "Perquisite vs. Prerequisite", rule: "Perquisite = perk/fringe benefit; Prerequisite = required prior condition." }
];

window.getVarcDrillsForModule = function (mod) {
  const extra = (window.IPM_DILR_VARC_BANK || {})[mod.id] || [];
  return [...(mod.questions || []), ...extra];
};

window.renderVarcDrillCard = function (q, idx, total) {
  const st = window.VARC_DRILL_STATE[q.id];
  return `
    <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-purple-400">Verbal Drill ${idx + 1} of ${total}</span>
        <span class="text-[10px] px-2.5 py-0.5 rounded font-semibold bg-purple-500/20 text-purple-300">MCQ (+4 / -1)</span>
      </div>
      <p class="text-xs md:text-sm text-slate-100 whitespace-pre-line leading-relaxed">${q.prompt}</p>
      <div class="grid grid-cols-1 gap-2">
        ${q.options.map((opt, oi) => {
          let cls = "bg-slate-900 border-slate-800 text-slate-300 hover:border-purple-500";
          if (st) {
            if (oi === q.answer) cls = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold";
            else if (oi === st.picked && !st.correct) cls = "bg-rose-950/60 border-rose-500 text-rose-200";
          }
          return `<button onclick="window.revealVarc('${q.id}', ${oi}, ${q.answer})"
            class="text-left p-2.5 rounded-xl border text-xs transition ${cls}">
            <strong>${String.fromCharCode(65 + oi)}.</strong> ${opt}
          </button>`;
        }).join("")}
      </div>
      <div class="${st ? "" : "hidden"} p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/40 text-xs text-emerald-200">
        ${st ? `<strong>${st.banner}</strong><br>${q.explanation}` : ""}
      </div>
    </div>
  `;
};

window.renderTab3 = function (el) {
  const mods = window.getVarcModules();
  if (!window.IPM_STATE.selectedVarcId || !mods.some(m => m.id === window.IPM_STATE.selectedVarcId)) {
    window.IPM_STATE.selectedVarcId = mods[0].id;
    window.VARC_DRILL_IDX = 0;
  }
  const activeMod = mods.find(m => m.id === window.IPM_STATE.selectedVarcId);
  const sub = window.IPM_STATE.varcSubTab;
  const allDrills = window.getVarcDrillsForModule(activeMod);
  if (window.VARC_DRILL_IDX >= allDrills.length) window.VARC_DRILL_IDX = 0;

  const solved = allDrills.filter(q => window.VARC_DRILL_STATE[q.id]).length;
  const correct = allDrills.filter(q => window.VARC_DRILL_STATE[q.id]?.correct).length;

  el.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div class="lg:col-span-4 space-y-4 lg:h-[calc(100vh-225px)] lg:overflow-y-auto lg:pr-2 pane-scroll">
        <div class="space-y-2">
          <div class="text-xs font-bold uppercase tracking-wider text-purple-400">VARC, RC & Vocab Modules (${mods.length})</div>
          ${mods.map(m => `
            <button onclick="window.selectVarcModule('${m.id}')"
              class="w-full text-left p-3 rounded-xl border transition ${
                m.id === activeMod.id
                  ? "bg-purple-950/70 border-purple-500 text-white"
                  : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600"
              }">
              <div class="font-semibold text-sm">${m.title}</div>
              <div class="text-[11px] text-slate-400 mt-1">${m.weightage}</div>
            </button>
          `).join("")}
        </div>

        <div class="bg-slate-900/90 border border-purple-800/40 rounded-2xl p-4 space-y-2.5">
          <div class="text-xs font-bold uppercase tracking-wider text-amber-300">IPMAT 2025-26 Confusable Word Pairs (${window.CONFUSABLE_VOCAB_BANK.length})</div>
          ${window.CONFUSABLE_VOCAB_BANK.map(v => `
            <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div class="font-bold text-purple-300">${v.pair}</div>
              <div class="text-slate-400 mt-0.5">${v.rule}</div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="lg:col-span-8 space-y-4 lg:h-[calc(100vh-225px)] lg:overflow-y-auto lg:pr-2 pane-scroll">
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span class="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">RC &bull; Vocab &bull; Fillers &bull; Grammar</span>
              <h2 class="text-xl font-bold text-white mt-1">${activeMod.title}</h2>
            </div>
            <div class="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button onclick="window.setVarcSubTab('refresher')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${sub === 'refresher' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}">
                Chapter Refresher & Rules
              </button>
              <button onclick="window.setVarcSubTab('drills')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${sub === 'drills' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}">
                RC Passages & ${allDrills.length} Drills
              </button>
            </div>
          </div>

          ${
            sub === "refresher"
              ? window.renderRefresherCard(activeMod.id, "purple")
              : `<div class="space-y-4">
                  <div class="p-4 rounded-2xl bg-purple-950/25 border border-purple-500/40 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div class="text-xs font-bold uppercase tracking-wider text-amber-300">Interactive Verbal Practice (${allDrills.length} Questions)</div>
                        <div class="text-[11px] text-slate-300 mt-0.5">Attempted: <strong>${solved}/${allDrills.length}</strong> &bull; Correct: <strong class="text-emerald-300">${correct}</strong></div>
                      </div>
                      <div class="flex gap-1.5">
                        <button onclick="window.setVarcDrillView('single')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold ${window.VARC_DRILL_VIEW === 'single' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700'}">Focus Mode (Prev / Next)</button>
                        <button onclick="window.setVarcDrillView('all')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold ${window.VARC_DRILL_VIEW === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700'}">View All ${allDrills.length}</button>
                      </div>
                    </div>

                    ${
                      window.VARC_DRILL_VIEW === "single"
                        ? `<div class="flex flex-wrap gap-1 pt-1">
                             ${allDrills.map((item, i) => {
                               const st = window.VARC_DRILL_STATE[item.id];
                               const cur = i === window.VARC_DRILL_IDX;
                               let pillCls = "bg-slate-900 text-slate-400 border-slate-700";
                               if (st) pillCls = st.correct ? "bg-emerald-600/30 text-emerald-200 border-emerald-500" : "bg-rose-600/30 text-rose-200 border-rose-500";
                               if (cur) pillCls += " ring-2 ring-purple-400 text-white font-bold";
                               return `<button onclick="window.jumpVarcDrill(${i})" class="w-7 h-7 rounded-lg border text-[11px] transition ${pillCls}">${i + 1}</button>`;
                             }).join("")}
                           </div>
                           ${allDrills.length ? window.renderVarcDrillCard(allDrills[window.VARC_DRILL_IDX], window.VARC_DRILL_IDX, allDrills.length) : ""}
                           <div class="flex items-center justify-between pt-1">
                             <button onclick="window.stepVarcDrill(-1)" ${window.VARC_DRILL_IDX === 0 ? "disabled" : ""} class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white">&larr; Previous</button>
                             <span class="text-xs text-slate-400 font-semibold">${window.VARC_DRILL_IDX + 1} / ${allDrills.length}</span>
                             <button onclick="window.stepVarcDrill(1)" ${window.VARC_DRILL_IDX >= allDrills.length - 1 ? "disabled" : ""} class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-bold text-white">Next &rarr;</button>
                           </div>`
                        : `<div class="space-y-3">${allDrills.map((q, i) => window.renderVarcDrillCard(q, i, allDrills.length)).join("")}</div>`
                    }
                  </div>

                  ${activeMod.concepts.map(c => `
                    <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                      <h3 class="font-bold text-purple-300 text-sm">${c.heading}</h3>
                      <div class="px-3 py-2 rounded-lg bg-slate-900 border border-purple-500/30 font-mono text-xs text-amber-300">${c.formula}</div>
                      <p class="text-xs text-slate-300">${c.derivation}</p>
                      <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/40 text-xs text-emerald-200"><strong>Elimination Shortcut:</strong> ${c.shortcut}</div>
                    </div>
                  `).join("")}
                </div>`
          }
        </div>
      </div>
    </div>
  `;
};

window.selectVarcModule = function (id) { window.IPM_STATE.selectedVarcId = id; window.VARC_DRILL_IDX = 0; window.renderActiveTab(); };
window.setVarcSubTab = function (sub) { window.IPM_STATE.varcSubTab = sub; window.renderActiveTab(); };
window.setVarcDrillView = function (v) { window.VARC_DRILL_VIEW = v; window.renderActiveTab(); };
window.jumpVarcDrill = function (i) { window.VARC_DRILL_IDX = i; window.renderActiveTab(); };
window.stepVarcDrill = function (d) {
  const activeMod = window.getVarcModules().find(m => m.id === window.IPM_STATE.selectedVarcId);
  const total = window.getVarcDrillsForModule(activeMod).length;
  window.VARC_DRILL_IDX = Math.max(0, Math.min(total - 1, window.VARC_DRILL_IDX + d));
  window.renderActiveTab();
};
window.revealVarc = function (qid, picked, correct) {
  const activeMod = window.getVarcModules().find(m => m.id === window.IPM_STATE.selectedVarcId);
  const q = window.getVarcDrillsForModule(activeMod).find(item => item.id === qid);
  if (!q) return;
  const ok = picked === correct;
  window.VARC_DRILL_STATE[qid] = { picked: picked, correct: ok, banner: ok ? "Correct (+4 Marks)" : `Incorrect (-1) — Correct Option: ${String.fromCharCode(65 + correct)}` };
  window.renderActiveTab();
};