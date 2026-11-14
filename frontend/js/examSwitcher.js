window.IPM_STATE = {
  activeModeId: "ALL_IIM_MASTER",
  activeTab: "tab1",
  selectedQuantId: null,
  selectedDilrId: null,
  selectedVarcId: null,
  quantSubTab: "refresher",
  dilrSubTab: "refresher",
  varcSubTab: "refresher"
};

window.getActiveMode = function () {
  return window.IPM_MANIFEST.examModes[window.IPM_STATE.activeModeId] || window.IPM_MANIFEST.examModes.ALL_IIM_MASTER;
};

window.filterByMode = function (list) {
  const modeId = window.IPM_STATE.activeModeId;
  if (modeId === "ALL_IIM_MASTER") return list;
  const filtered = list.filter(m => !m.exams || m.exams.includes(modeId));
  return filtered.length ? filtered : list;
};

window.getQuantModules = function () {
  return window.filterByMode([
    ...(window.IPM_QUANT_CORE || []),
    ...(window.IPM_HIGHER_MATH || []), ...(window.IPM_DEEP_MODULES || []).filter(m => m.pillar === "quant_core" || m.pillar === "higher_math_stats")
  ]);
};

window.getDilrModules = function () {
  return window.filterByMode([...(window.IPM_DILR || []), ...(window.IPM_DEEP_MODULES || []).filter(m => m.pillar === "dilr")]);
};

window.getVarcModules = function () {
  return window.filterByMode([...(window.IPM_VARC || [])]);
};

window.getAllModulesForMode = function () {
  return [
    ...window.getQuantModules(),
    ...window.getDilrModules(),
    ...window.getVarcModules()
  ];
};

window.REFRESHER_LEVEL_FILTER = "ALL";
window.setRefresherLevel = function (lvl) {
  window.REFRESHER_LEVEL_FILTER = lvl;
  window.renderActiveTab();
};

window.renderRefresherCard = function (modId, accentColor) {
  const ref = (window.IPM_CHAPTER_REFRESHERS || {})[modId];
  if (!ref) {
    return `<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">Detailed chapter refresher coming soon.</div>`;
  }
  const baseEx = ref.workedExamples || (ref.workedExample ? [{ level: "Foundation", ...ref.workedExample }] : []); const extraEx = (window.IPM_TIER_EXPANSION || {})[modId] || []; const allEx = [...baseEx, ...extraEx];
  const filteredEx = window.REFRESHER_LEVEL_FILTER === "ALL"
    ? allEx
    : allEx.filter(ex => ex.level === window.REFRESHER_LEVEL_FILTER);

  return `
    <div class="space-y-4">
      <div class="p-4 rounded-xl bg-slate-950/90 border border-${accentColor}-500/30 space-y-2">
        <div class="text-xs font-bold uppercase tracking-wider text-${accentColor}-300">Comprehensive Chapter Overview & Concept Bridge</div>
        <p class="text-xs md:text-sm text-slate-200 leading-relaxed">${ref.overview}</p>
        <div class="pt-2">
          <div class="text-[11px] font-semibold text-amber-300">Prerequisites & Foundational Formulas to Refresh:</div>
          <ul class="list-disc list-inside text-xs text-slate-300 mt-1 space-y-1">
            ${ref.prerequisites.map(p => `<li>${p}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
        <div class="text-xs font-bold uppercase tracking-wider text-indigo-300">Core Principles, Theorems & Exam Laws</div>
        <ul class="space-y-2 text-xs text-slate-300">
          ${ref.corePrinciples.map((rule, i) => `
            <li class="p-3 rounded-lg bg-slate-900 border border-slate-800 leading-relaxed">
              <strong class="text-white">Law ${i + 1}:</strong> ${rule}
            </li>
          `).join("")}
        </ul>
      </div>

      <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-700/40 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/40 pb-2.5">
          <div class="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Graded Worked Examples Bank (${filteredEx.length} of ${allEx.length} Solved Step-by-Step)
          </div>
          <div class="flex flex-wrap gap-1">
            ${["ALL", "Foundation", "IPMAT Moderate", "IIM Tough"].map(lvl => `
              <button onclick="window.setRefresherLevel('${lvl}')"
                class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  window.REFRESHER_LEVEL_FILTER === lvl
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-emerald-500"
                }">${lvl}</button>
            `).join("")}
          </div>
        </div>

        <div class="space-y-3">
          ${filteredEx.map(ex => `
            <div class="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-white">${ex.problem}</span>
                <span class="shrink-0 text-[10px] px-2 py-0.5 rounded font-semibold ${
                  ex.level === "IIM Tough"
                    ? "bg-rose-500/20 text-rose-300"
                    : ex.level === "IPMAT Moderate"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-sky-500/20 text-sky-300"
                }">${ex.level}</span>
              </div>
              <ol class="list-decimal list-inside text-xs text-emerald-100/90 space-y-1 pt-1">
                ${ex.steps.map(s => `<li>${s}</li>`).join("")}
              </ol>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
};

window.renderExamSwitcher = function () {
  const container = document.getElementById("exam-mode-pills");
  if (!container) return;
  const modes = Object.values(window.IPM_MANIFEST.examModes);
  container.innerHTML = modes.map(m => {
    const active = m.id === window.IPM_STATE.activeModeId;
    return `<button onclick="window.selectExamMode('${m.id}')"
      class="px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
        active
          ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
          : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
      }">
      ${m.label} <span class="ml-1 opacity-75 text-[10px]">(${m.badge})</span>
    </button>`;
  }).join("");

  const mode = window.getActiveMode();
  const banner = document.getElementById("exam-meta-banner");
  if (banner) {
    banner.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <div><strong class="text-indigo-300">Target Campuses:</strong> ${mode.campuses.join(" &bull; ")}</div>
        <div><strong class="text-emerald-300">Pattern:</strong> ${mode.totalQuestions} Qs | ${mode.durationMinutes} Mins | ${mode.sectionalTimeLock ? "Strict Sectional Timer" : "Flexible Pool"}</div>
        <div><strong class="text-amber-300">Marking:</strong> MCQ +${mode.marking.mcqCorrect}/${mode.marking.mcqWrong}${mode.marking.saWrong === 0 ? ` | SA +${mode.marking.saCorrect}/0 (Zero Penalty)` : " | 100% MCQ"}</div>
      </div>
      <div class="mt-1 text-[11px] text-slate-400">${mode.keyFocus}</div>
    `;
  }
};

window.selectExamMode = function (modeId) {
  window.IPM_STATE.activeModeId = modeId;
  window.IPM_STATE.selectedQuantId = null;
  window.IPM_STATE.selectedDilrId = null;
  window.IPM_STATE.selectedVarcId = null;
  window.renderExamSwitcher();
  window.renderActiveTab();
};