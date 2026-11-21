// ==============================================================================
// GOALisB IIM UG & IPM MASTER ENGINE — UNIFIED 7-TAB ARCHITECTURE & ENRICHED TAB 7
// Consolidates 9 legacy tabs into the standardized 7-Tab Ecosystem:
//   Tab 1: Quant & Higher Math (+ Live PG PYQs)
//   Tab 2: DI & Logical Reasoning (+ Live PG PYQs)
//   Tab 3: VARC, Vocab & PI/WAT Studio (Sub-toggle: VARC Drills | AI PI/WAT Evaluator)
//   Tab 4: Proctored Mock Simulator (Promoted from Tab 8 + Systematic Serial IDs)
//   Tab 5: 5-Yr PYQ Vault (2019-2026) & Drills (Promoted from Tab 9)
//   Tab 6: Trap Doctor (56 Traps + EV Sim) & Split-Screen Socratic AI Doubt Solver
//   Tab 7: Enriched 8-IIM Call & Target Forecaster (Live Sliders, Sync Mock & Matrix)
// ==============================================================================
(function () {
  window.IPM_T3_SUBMODE = window.IPM_T3_SUBMODE || "varc"; // "varc" | "pi_wat"

  const origRenderTab3 = window.renderTab3;
  const origRenderTab4Trap = window.renderTab4;
  const origRenderTab5Pi = window.renderTab5;
  const origRenderTab7Doubt = window.renderTab7;
  const origRenderTab8Mock = window.renderTab8;
  const origRenderTab9Pyq = window.renderTab9;

  // TAB 3: VARC & Vocab Studio + Embedded AI PI / WAT Evaluator sub-mode
  window.setIpmTab3Submode = function (m) {
    window.IPM_T3_SUBMODE = m;
    window.renderActiveTab();
  };

  window.renderTab3 = function (el) {
    const bar = `
      <div class="mb-4 p-3 rounded-2xl bg-slate-900/95 border border-purple-500/30 flex flex-wrap items-center justify-between gap-2">
        <div class="text-xs font-bold text-slate-300">Studio Workspace Mode:</div>
        <div class="flex gap-2">
          <button type="button" onclick="window.setIpmTab3Submode('varc')"
            class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${window.IPM_T3_SUBMODE === 'varc' ? 'bg-purple-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800'}">
            &#128214; VARC, RC &amp; Confusable Vocab Studio
          </button>
          <button type="button" onclick="window.setIpmTab3Submode('pi_wat')"
            class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${window.IPM_T3_SUBMODE === 'pi_wat' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800'}">
            &#127908; 8-IIM AI PI / WAT &amp; Current Affairs Evaluator (57 Prompts)
          </button>
        </div>
      </div>
      <div id="ipm-tab3-inner"></div>
    `;
    el.innerHTML = bar;
    const inner = document.getElementById("ipm-tab3-inner");
    if (window.IPM_T3_SUBMODE === "pi_wat" && typeof origRenderTab5Pi === "function") {
      origRenderTab5Pi(inner);
    } else if (typeof origRenderTab3 === "function") {
      origRenderTab3(inner);
    }
  };

  // TAB 4: Proctored Mock Simulator (Promoted from legacy Tab 8)
  window.renderTab4 = function (el) {
    if (typeof origRenderTab8Mock === "function") {
      origRenderTab8Mock(el);
    }
  };

  // TAB 5: 5-Yr PYQ Vault (2019-2026) (Promoted from legacy Tab 9)
  window.renderTab5 = function (el) {
    if (typeof origRenderTab9Pyq === "function") {
      origRenderTab9Pyq(el);
    }
  };

  // TAB 6: Split-Screen Trap Doctor (56 Traps + EV Sim) & Socratic AI Doubt Solver
  window.askIpmTrapDoctor = function (title, detail) {
    const qBox = document.getElementById("doubt-question") || document.querySelector("#ipm-t6-right textarea");
    if (qBox) {
      qBox.value = `Explain this IPMAT / IIM UG exam trap with a worked example and 30-second antidote:\n${title} — ${detail}`;
      window._IS_PRESET_TRAP_DOUBT = true;
      const btn = document.querySelector("#ipm-t6-right button");
      if (btn) btn.click();
    }
  };

  window.renderTab6 = function (el) {
    el.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div id="ipm-t6-left" class="lg:col-span-7 space-y-4"></div>
        <div id="ipm-t6-right" class="lg:col-span-5 space-y-4 lg:sticky lg:top-24"></div>
      </div>
    `;
    const left = document.getElementById("ipm-t6-left");
    const right = document.getElementById("ipm-t6-right");

    if (typeof origRenderTab4Trap === "function") {
      origRenderTab4Trap(left);
      setTimeout(() => {
        left.querySelectorAll("h3").forEach(h => {
          const card = h.closest("div.rounded-2xl");
          if (card && !card.querySelector(".ipm-ask-trap-btn")) {
            const titleText = (h.textContent || "").trim();
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "ipm-ask-trap-btn mt-2 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-extrabold cursor-pointer";
            btn.innerHTML = "&#9889; Ask AI Doubt Doctor About This Trap &rarr;";
            btn.onclick = () => window.askIpmTrapDoctor(titleText, "Verify domain constraints & +4/-1 risk.");
            h.insertAdjacentElement("afterend", btn);
          }
        });
      }, 40);
    }

    if (typeof origRenderTab7Doubt === "function") {
      origRenderTab7Doubt(right);
    }
  };

  // TAB 7: Enriched 8-IIM Call & Target Forecaster (Live Sliders, Sync Mock & Cutoff Matrix)
  window.IPM_T7_STATE = window.IPM_T7_STATE || {
    c10: 92,
    c12: 90,
    hasMath: true,
    indSa: 28,
    indMcq: 52,
    indVa: 128,
    rohtak: 395,
    jipmat: 325,
    iimbUg: 245,
    jeePct: 96.8,
    targetCampus: "IIM Indore (5-Yr IPM)"
  };

  window.syncLatestIpmMockToTab7 = function () {
    try {
      const hist = JSON.parse(localStorage.getItem("ipm_mock_history_v1") || "[]");
      if (Array.isArray(hist) && hist.length > 0) {
        const latest = hist[hist.length - 1];
        const ratio = Math.min(1, Math.max(0.25, Number(latest.score || 60) / Math.max(1, Number(latest.maxScore || 120))));
        window.IPM_T7_STATE.indSa = Math.round(60 * ratio);
        window.IPM_T7_STATE.indMcq = Math.round(120 * ratio);
        window.IPM_T7_STATE.indVa = Math.round(180 * ratio);
        window.IPM_T7_STATE.rohtak = Math.round(480 * ratio);
        window.IPM_T7_STATE.jipmat = Math.round(400 * ratio);
        window.IPM_T7_STATE.iimbUg = Math.round(300 * ratio);
      }
    } catch (_) {}
    window.renderActiveTab();
  };

  window.updateIpmT7Slider = function (key, val) {
    window.IPM_T7_STATE[key] = key === "hasMath" ? Boolean(val) : parseFloat(val);
    window.renderActiveTab();
  };

  window.renderTab7 = function (el) {
    const s = window.IPM_T7_STATE;
    const indTotal = s.indSa + s.indMcq + s.indVa;
    const indAts = ((s.indSa / 60) * 20 + (s.indMcq / 120) * 20 + (s.indVa / 180) * 25).toFixed(1);
    const rohtakComp = ((s.rohtak / 480) * 45 + (s.c10 / 100) * 10 + (s.c12 / 100) * 20).toFixed(1);

    const campuses = [
      {
        name: "IIM Indore (5-Yr IPM)",
        exam: "IPMAT Indore",
        yourScore: `${indTotal}/360 (ATS ${indAts}/65)`,
        cutoff: "SA ≥ 24 • MCQ ≥ 40 • VA ≥ 116 (Total ~180+)",
        gap: Math.max(0, 180 - indTotal),
        eligible: s.indSa >= 24 && s.indMcq >= 40 && s.indVa >= 116,
        note: s.indSa < 24 ? `Need +${24 - s.indSa} in QA-SA` : s.indMcq < 40 ? `Need +${40 - s.indMcq} in QA-MCQ` : s.indVa < 116 ? `Need +${116 - s.indVa} in VA` : "All 3 sectional cutoffs cleared!"
      },
      {
        name: "IIM Ranchi (5-Yr IPM)",
        exam: "IPMAT Indore Score",
        yourScore: `${indTotal}/360 + Acads ${((s.c10 + s.c12) / 2).toFixed(1)}%`,
        cutoff: "Total ~172+ (No sectional bar, 20% 10th/12th weight)",
        gap: Math.max(0, 172 - indTotal),
        eligible: indTotal >= 172,
        note: indTotal >= 172 ? "Strong PI shortlist zone" : `Need +${172 - indTotal} overall IPMAT marks`
      },
      {
        name: "IIM Rohtak (5-Yr IPM)",
        exam: "IPMAT Rohtak",
        yourScore: `${s.rohtak}/480 (Pre-PI ${rohtakComp}/75)`,
        cutoff: "General ~385–405 / 480 + 30% Acad Weight",
        gap: Math.max(0, 390 - s.rohtak),
        eligible: s.rohtak >= 390,
        note: s.rohtak >= 390 ? "Above expected General PI call cutoff" : `Need +${390 - s.rohtak} marks in Rohtak CBT`
      },
      {
        name: "IIM Bodh Gaya (5-Yr IPM)",
        exam: "JIPMAT (NTA)",
        yourScore: `${s.jipmat}/400`,
        cutoff: "General ~310–325 / 400 (100% JIPMAT Merit)",
        gap: Math.max(0, 315 - s.jipmat),
        eligible: s.jipmat >= 315,
        note: s.jipmat >= 315 ? "Direct merit shortlist range" : `Need +${315 - s.jipmat} marks in JIPMAT`
      },
      {
        name: "IIM Jammu (5-Yr IPM)",
        exam: "JIPMAT (NTA)",
        yourScore: `${s.jipmat}/400`,
        cutoff: "General ~305–320 / 400 + Gender Diversity",
        gap: Math.max(0, 310 - s.jipmat),
        eligible: s.jipmat >= 310,
        note: s.jipmat >= 310 ? "Competitive for Merit List 1" : `Need +${310 - s.jipmat} marks in JIPMAT`
      },
      {
        name: "IIM Bangalore (B.Sc. Econ/DS & BBA DBE)",
        exam: "IIMB UG Entrance",
        yourScore: `${s.iimbUg}/300 • Class 12 Math: ${s.hasMath ? "Yes" : "No"}`,
        cutoff: "Class 12 Math mandatory for B.Sc. • ~235+/300",
        gap: Math.max(0, 235 - s.iimbUg),
        eligible: s.hasMath && s.iimbUg >= 235,
        note: !s.hasMath ? "Ineligible for B.Sc. (No Class 12 Math); eligible for BBA DBE" : s.iimbUg >= 235 ? "Eligible for both B.Sc. & BBA DBE PI" : `Need +${235 - s.iimbUg} in IIMB UG test`
      },
      {
        name: "IIM Mumbai (4-Yr BS Digital & Supply Chain)",
        exam: "JEE Main / IPMAT + Math",
        yourScore: `JEE ${s.jeePct}%ile • Math: ${s.hasMath ? "Yes" : "No"}`,
        cutoff: "Class 12 Math mandatory • ~96.0+%ile equivalent",
        gap: Math.max(0, +(96.0 - s.jeePct).toFixed(1)),
        eligible: s.hasMath && s.jeePct >= 96.0,
        note: !s.hasMath ? "Requires Class 12 Mathematics" : s.jeePct >= 96.0 ? "Meets quantitative & JEE benchmark" : `Need +${(96.0 - s.jeePct).toFixed(1)}%ile`
      },
      {
        name: "IIM Lucknow (4-Yr Tech-Mgmt UG)",
        exam: "IPMAT / JEE + Acads",
        yourScore: `Acads ${((s.c10 + s.c12) / 2).toFixed(1)}% • Math: ${s.hasMath ? "Yes" : "No"}`,
        cutoff: "Strong Class 10/12 (85%+) + Quantitative Aptitude",
        gap: 0,
        eligible: s.hasMath && s.c10 >= 85 && s.c12 >= 85,
        note: s.hasMath && s.c10 >= 85 && s.c12 >= 85 ? "Strong academic + quant profile" : "Requires 85%+ academics & Class 12 Math"
      }
    ];

    const callsCount = campuses.filter(c => c.eligible).length;

    el.innerHTML = `
      <div class="space-y-4">
        <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-white">8-IIM Composite Call &amp; Target Score Forecaster</h2>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold">${callsCount} / 8 IIMs Shortlist Ready</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Adjust section sliders below or sync your Tab 4 mock score to project live call eligibility across all 8 IIM UG &amp; IPM campuses.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" onclick="window.syncLatestIpmMockToTab7()"
              class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow cursor-pointer">
              &#8635; Sync Mock
            </button>
            <button type="button" onclick="window.triggerProLearnerCheckout('Tab 7 Target Lock & Official 8-IIM PDF Dossier')"
              class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow cursor-pointer">
              &#127919; Set Target
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-xs">
            <div class="font-extrabold uppercase tracking-wider text-indigo-400">Interactive What-If Score Simulator</div>

            <div>
              <div class="flex justify-between font-bold mb-1"><span>IPMAT Indore QA-SA (/60)</span><span class="text-amber-300">${s.indSa} / 60</span></div>
              <input type="range" min="0" max="60" value="${s.indSa}" oninput="window.updateIpmT7Slider('indSa', this.value)" class="w-full cursor-pointer">
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>IPMAT Indore QA-MCQ (/120)</span><span class="text-amber-300">${s.indMcq} / 120</span></div>
              <input type="range" min="0" max="120" value="${s.indMcq}" oninput="window.updateIpmT7Slider('indMcq', this.value)" class="w-full cursor-pointer">
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>IPMAT Indore Verbal Ability (/180)</span><span class="text-amber-300">${s.indVa} / 180</span></div>
              <input type="range" min="0" max="180" value="${s.indVa}" oninput="window.updateIpmT7Slider('indVa', this.value)" class="w-full cursor-pointer">
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>IPMAT Rohtak Composite (/480)</span><span class="text-cyan-300">${s.rohtak} / 480</span></div>
              <input type="range" min="150" max="480" step="5" value="${s.rohtak}" oninput="window.updateIpmT7Slider('rohtak', this.value)" class="w-full cursor-pointer">
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>JIPMAT Bodh Gaya &amp; Jammu (/400)</span><span class="text-emerald-300">${s.jipmat} / 400</span></div>
              <input type="range" min="150" max="400" step="5" value="${s.jipmat}" oninput="window.updateIpmT7Slider('jipmat', this.value)" class="w-full cursor-pointer">
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>IIM Bangalore UG Test (/300)</span><span class="text-purple-300">${s.iimbUg} / 300</span></div>
              <input type="range" min="100" max="300" step="5" value="${s.iimbUg}" oninput="window.updateIpmT7Slider('iimbUg', this.value)" class="w-full cursor-pointer">
            </div>
            <div class="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label class="text-slate-400 font-bold">Class 10 %</label>
                <input type="number" step="0.5" value="${s.c10}" onchange="window.updateIpmT7Slider('c10', this.value)" class="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-2 text-white">
              </div>
              <div>
                <label class="text-slate-400 font-bold">Class 12 %</label>
                <input type="number" step="0.5" value="${s.c12}" onchange="window.updateIpmT7Slider('c12', this.value)" class="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-2 text-white">
              </div>
            </div>
            <div class="flex items-center gap-2 pt-1">
              <input id="t7-math-chk" type="checkbox" ${s.hasMath ? "checked" : ""} onchange="window.updateIpmT7Slider('hasMath', this.checked)">
              <label for="t7-math-chk" class="text-slate-300 font-semibold">Studied Mathematics in Class 12 (Mandatory for IIMB B.Sc. &amp; IIM Mumbai)</label>
            </div>
          </div>

          <div class="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 overflow-x-auto">
            <div class="flex items-center justify-between">
              <div class="text-xs font-extrabold uppercase tracking-wider text-emerald-400">8-IIM Campus Shortlist &amp; Cutoff Deficiency Matrix</div>
              <span class="text-[11px] text-slate-400">Auto-updates live with sliders</span>
            </div>
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                  <th class="py-2 pr-2">IIM Campus &amp; Program</th>
                  <th class="py-2 px-2">Projected Score</th>
                  <th class="py-2 px-2">Diagnostic Note</th>
                  <th class="py-2 pl-2 text-right">Call Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/70">
                ${campuses.map(c => `
                  <tr>
                    <td class="py-2.5 pr-2 font-bold text-white">
                      ${c.name}
                      <div class="text-[10px] font-normal text-slate-400">${c.cutoff}</div>
                    </td>
                    <td class="py-2.5 px-2 font-mono text-indigo-300">${c.yourScore}</td>
                    <td class="py-2.5 px-2 text-slate-300">${c.note}</td>
                    <td class="py-2.5 pl-2 text-right">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        c.eligible ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                      }">${c.eligible ? "CALL READY" : "GAP: -" + c.gap}</span>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };
})();
