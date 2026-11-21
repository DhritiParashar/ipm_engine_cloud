// ==============================================================================
// GOALisB IIM UG & IPM MASTER ENGINE — MODE-ALIGNED MOCKS, SERIAL LOGS & TAB 7 (v22)
// - Aligns all 6 top exam mode pills with:
//   1) Tab 4 Proctored Mock Lobby (Mode-specific Full Mock + Serial ID Ledger)
//   2) Deterministic Mode-Prefixed Serial IDs (IPM-ALL / IPM-IND / IPM-ROH / IPM-JIP / IPM-IIMB / IPM-IIMM)
//   3) Tab 7 8-IIM Call & Target Forecaster (Mode-specific slider sync + Verified Mock Log)
// ==============================================================================
(function () {
  window.IPM_T3_SUBMODE = window.IPM_T3_SUBMODE || "varc";

  const origRenderTab3 = window.renderTab3;
  const origRenderTab4Trap = window.renderTab4;
  const origRenderTab5Pi = window.renderTab5;
  const origRenderTab7Doubt = window.renderTab7;
  const origRenderTab9Pyq = window.renderTab9;

  // Map top mode pills to exact Serial ID prefix, API filter, mock specs & Tab 7 target campus
  const IPM_MODE_SPECS = {
    ALL: {
      code: "IPM-ALL",
      label: "All-IIM Comprehensive Master (8 IIMs)",
      apiExam: "ALL",
      qCount: 30,
      mins: 45,
      pattern: "MCQ +4/-1 | SA +4/0",
      targetCampus: "IIM Indore (5-Yr IPM)",
      accent: "indigo"
    },
    INDORE: {
      code: "IPM-IND",
      label: "IPMAT Indore & Ranchi (5-Yr IPM)",
      apiExam: "IPMAT",
      qCount: 25,
      mins: 38,
      pattern: "QA-SA (+4/0) • QA-MCQ (+4/-1) • VA (+4/-1)",
      targetCampus: "IIM Indore (5-Yr IPM)",
      accent: "amber"
    },
    ROHTAK: {
      code: "IPM-ROH",
      label: "IPMAT Rohtak (5-Yr IPM)",
      apiExam: "Rohtak",
      qCount: 30,
      mins: 40,
      pattern: "QA • LR • VA (+4/-1 across all 3 sections)",
      targetCampus: "IIM Rohtak (5-Yr IPM)",
      accent: "cyan"
    },
    JIPMAT: {
      code: "IPM-JIP",
      label: "JIPMAT Bodh Gaya & Jammu (5-Yr IPM)",
      apiExam: "JIPMAT",
      qCount: 30,
      mins: 40,
      pattern: "QA • DILR • VARC (+4/-1 NTA CBT)",
      targetCampus: "IIM Bodh Gaya (5-Yr IPM)",
      accent: "emerald"
    },
    IIMB: {
      code: "IPM-IIMB",
      label: "IIM Bangalore (B.Sc. Econ/DS & BBA DBE)",
      apiExam: "IIM",
      qCount: 20,
      mins: 30,
      pattern: "Higher Math / Stats • Business DI • Verbal (+4/-1)",
      targetCampus: "IIM Bangalore (B.Sc. Econ/DS & BBA DBE)",
      accent: "purple"
    },
    IIMM_IIML: {
      code: "IPM-IIMM",
      label: "IIM Mumbai & IIM Lucknow (4-Yr Tech-Mgmt UG)",
      apiExam: "IIM",
      qCount: 20,
      mins: 30,
      pattern: "JEE/Higher Math • Analytics & Supply Chain Aptitude (+4/-1)",
      targetCampus: "IIM Mumbai (4-Yr BS Digital & Supply Chain)",
      accent: "sky"
    }
  };

  window.getActiveIpmModeSpec = function () {
    const rawId = ((window.IPM_STATE && window.IPM_STATE.mode) || "").toUpperCase();
    const activePill = document.querySelector("#exam-mode-pills button.bg-indigo-600, #exam-mode-pills button.bg-amber-500");
    const pillTxt = ((activePill && activePill.textContent) || rawId).toUpperCase();

    if (rawId.includes("ROH") || pillTxt.includes("ROHTAK")) return IPM_MODE_SPECS.ROHTAK;
    if (rawId.includes("JIP") || pillTxt.includes("JIPMAT") || pillTxt.includes("BODH")) return IPM_MODE_SPECS.JIPMAT;
    if (rawId.includes("IIMB") || pillTxt.includes("BANGALORE")) return IPM_MODE_SPECS.IIMB;
    if (rawId.includes("MUM") || rawId.includes("LUCK") || pillTxt.includes("MUMBAI") || pillTxt.includes("LUCKNOW")) return IPM_MODE_SPECS.IIMM_IIML;
    if (rawId.includes("IND") || pillTxt.includes("INDORE")) return IPM_MODE_SPECS.INDORE;
    return IPM_MODE_SPECS.ALL;
  };

  function getMockHistory() {
    try {
      const h = JSON.parse(localStorage.getItem("ipm_mock_history_v1") || "[]");
      return Array.isArray(h) ? h : [];
    } catch (_) {
      return [];
    }
  }

  function saveMockAttemptToLedger(entry) {
    const hist = getMockHistory();
    hist.push(entry);
    localStorage.setItem("ipm_mock_history_v1", JSON.stringify(hist));
  }

  function generateModeSerialId(modeCode) {
    const now = new Date();
    const ymd = now.getFullYear().toString()
      + String(now.getMonth() + 1).padStart(2, "0")
      + String(now.getDate()).padStart(2, "0");
    const hist = getMockHistory();
    const samePrefix = hist.filter(h => String(h.serialId || "").startsWith(`${modeCode}-${ymd}`));
    const attemptNum = String(samePrefix.length + 1).padStart(2, "0");
    return `${modeCode}-${ymd}-#${attemptNum}`;
  }

  // Re-render active tab immediately when any of the 6 top exam mode pills is clicked
  document.addEventListener("click", function (ev) {
    const pill = ev.target && ev.target.closest ? ev.target.closest("#exam-mode-pills button") : null;
    if (pill) {
      setTimeout(() => {
        if (window.IPM_STATE && ["tab4", "tab7"].includes(window.IPM_STATE.activeTab)) {
          window.renderActiveTab();
        }
      }, 45);
    }
  }, true);

  // TAB 3: VARC & Vocab Studio + Embedded AI PI / WAT Evaluator
  window.setIpmTab3Submode = function (m) {
    window.IPM_T3_SUBMODE = m;
    window.renderActiveTab();
  };

  window.renderTab3 = function (el) {
    el.innerHTML = `
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
    const inner = document.getElementById("ipm-tab3-inner");
    if (window.IPM_T3_SUBMODE === "pi_wat" && typeof origRenderTab5Pi === "function") {
      origRenderTab5Pi(inner);
    } else if (typeof origRenderTab3 === "function") {
      origRenderTab3(inner);
    }
  };

  // TAB 4: Mode-Aligned Proctored Mock Simulator + Serial ID Attempt Ledger
  window.launchModeAlignedIpmMock = async function (modeCodeOverride, apiExamOverride, qCountOverride, labelOverride) {
    const spec = window.getActiveIpmModeSpec();
    const modeCode = modeCodeOverride || spec.code;
    const apiExam = apiExamOverride || spec.apiExam;
    const qCount = qCountOverride || spec.qCount;
    const label = labelOverride || `${spec.label} (${qCount} Qs)`;

    try {
      let res = await fetch(`/api/questions?exam=${encodeURIComponent(apiExam)}&limit=${qCount}&t=${Date.now()}`);
      let data = await res.json();
      if (!Array.isArray(data.questions) || data.questions.length < 5) {
        res = await fetch(`/api/questions?exam=ALL&limit=${qCount}&t=${Date.now()}`);
        data = await res.json();
      }
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        const serialId = generateModeSerialId(modeCode);
        window.PG_MOCK = {
          started: true,
          submitted: false,
          serialId: serialId,
          modeCode: modeCode,
          title: label,
          questions: data.questions,
          currentIndex: 0,
          answers: {},
          secondsLeft: Math.max(300, data.questions.length * 90),
          timerId: null
        };
        if (typeof window.beginPgMockTimer === "function") window.beginPgMockTimer();
        window.renderActiveTab();
      }
    } catch (e) {
      alert("Error loading mock questions: " + e.message);
    }
  };

  const origSubmitPgMock = window.submitPgMock;
  window.submitPgMock = function () {
    if (window.PG_MOCK && !window.PG_MOCK.submitted && Array.isArray(window.PG_MOCK.questions)) {
      const qs = window.PG_MOCK.questions;
      let score = 0, maxScore = qs.length * 4, correct = 0, wrong = 0, skipped = 0;
      let saScore = 0, mcqScore = 0, vaScore = 0;

      qs.forEach(q => {
        const u = window.PG_MOCK.answers[q.id];
        const hasOpts = Array.isArray(q.options) && q.options.length > 0;
        const sec = String(q.section || "").toUpperCase();
        if (u === undefined || u === null || String(u).trim() === "") {
          skipped++;
        } else if (hasOpts ? Number(u) === Number(q.answer) : String(u).trim().toLowerCase() === String(q.answer).trim().toLowerCase()) {
          correct++;
          score += 4;
          if (!hasOpts || sec.includes("SA")) saScore += 4;
          else if (sec.includes("VARC")) vaScore += 4;
          else mcqScore += 4;
        } else {
          wrong++;
          if (hasOpts) {
            score -= 1;
            if (sec.includes("VARC")) vaScore -= 1;
            else mcqScore -= 1;
          }
        }
      });

      const spec = window.getActiveIpmModeSpec();
      const serialId = window.PG_MOCK.serialId || generateModeSerialId(window.PG_MOCK.modeCode || spec.code);
      window.PG_MOCK.serialId = serialId;

      saveMockAttemptToLedger({
        serialId: serialId,
        modeCode: window.PG_MOCK.modeCode || spec.code,
        title: window.PG_MOCK.title || spec.label,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        score: score,
        maxScore: maxScore,
        correct: correct,
        wrong: wrong,
        skipped: skipped,
        accuracyPct: Math.round((correct / Math.max(1, correct + wrong)) * 100),
        breakdown: { saScore, mcqScore, vaScore }
      });
    }
    if (typeof origSubmitPgMock === "function") origSubmitPgMock();
  };

  window.renderTab4 = function (el) {
    const spec = window.getActiveIpmModeSpec();
    const hist = getMockHistory().slice().reverse();

    if (!window.PG_MOCK || !window.PG_MOCK.started) {
      const hasStaged = window.PG_MOCK && Array.isArray(window.PG_MOCK.questions) && window.PG_MOCK.questions.length > 0;
      const stagedMins = hasStaged ? Math.ceil(Math.max(300, window.PG_MOCK.questions.length * 90) / 60) : 0;

      el.innerHTML = `
        <div class="space-y-4">
          <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-lg font-bold text-white">Proctored Mock Simulator &bull; ${spec.label}</h2>
                  <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold">Serial Prefix: ${spec.code}-YYYYMMDD-#NN</span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">Aligned to active top mode pill (<strong>${spec.label}</strong>). Pattern: ${spec.pattern}. Every completed test logs a Serial ID for Tab 7 Forecaster sync.</p>
              </div>
            </div>

            ${hasStaged ? `
              <div class="p-5 rounded-2xl bg-indigo-950/60 border border-indigo-500/50 flex flex-wrap items-center justify-between gap-4">
                <div class="space-y-1">
                  <div class="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300">Ready from PYQ Vault</div>
                  <div class="text-base font-bold text-white">${window.PG_MOCK.title}</div>
                  <div class="text-xs text-slate-300">${window.PG_MOCK.questions.length} Questions &bull; ${stagedMins} Minutes</div>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" onclick="window.PG_MOCK.serialId = '${generateModeSerialId(spec.code)}'; window.startStagedPgMock()" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg cursor-pointer">
                    Start Staged PYQ Mock &rarr;
                  </button>
                  <button type="button" onclick="window.exitPgMock()" class="px-3.5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer">Clear</button>
                </div>
              </div>
            ` : ""}

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="p-4 rounded-2xl bg-slate-950 border-2 border-indigo-500/60 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-extrabold uppercase text-indigo-400">ACTIVE TOP MODE MOCK</span>
                  <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">${spec.code}</span>
                </div>
                <div class="text-sm font-bold text-white">${spec.label}</div>
                <p class="text-xs text-slate-400">${spec.qCount} Questions &bull; ${spec.mins} Mins &bull; Calibrated for ${spec.targetCampus}.</p>
                <button type="button" onclick="window.launchModeAlignedIpmMock('${spec.code}', '${spec.apiExam}', ${spec.qCount}, '${spec.label} (${spec.qCount} Qs)')"
                  class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition cursor-pointer">
                  Start ${spec.code} Full Mock &rarr;
                </button>
              </div>

              <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-extrabold uppercase text-amber-400">IPMAT INDORE &amp; RANCHI</span>
                  <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">IPM-IND</span>
                </div>
                <div class="text-sm font-bold text-white">25 Questions &bull; 38 Mins</div>
                <p class="text-xs text-slate-400">QA-SA (Zero Penalty), Higher Math MCQ &amp; VARC calibrated to Indore.</p>
                <button type="button" onclick="window.launchModeAlignedIpmMock('IPM-IND', 'IPMAT', 25, 'IPMAT Indore & Ranchi Mock (25 Qs)')"
                  class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition cursor-pointer">
                  Start IPMAT Indore Mock &rarr;
                </button>
              </div>

              <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-extrabold uppercase text-cyan-400">ROHTAK / JIPMAT / IIMB UG</span>
                  <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">IPM-ROH / JIP</span>
                </div>
                <div class="text-sm font-bold text-white">30 Questions &bull; 40 Mins</div>
                <p class="text-xs text-slate-400">Speed-intensive Quant, DILR &amp; Verbal sets for Rohtak, JIPMAT &amp; IIMB UG.</p>
                <button type="button" onclick="window.launchModeAlignedIpmMock('IPM-ROH', 'ALL', 30, 'Rohtak / JIPMAT / IIMB UG Speed Mock (30 Qs)')"
                  class="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold transition cursor-pointer">
                  Start Rohtak / JIPMAT Mock &rarr;
                </button>
              </div>
            </div>
          </div>

          <!-- VERIFIED MOCK SERIAL ID LEDGER (ALIGNED TO TAB 7) -->
          <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-extrabold text-white">Verified Proctored Mock Attempt Ledger &amp; Serial IDs (${hist.length})</h3>
                <p class="text-[11px] text-slate-400">Every completed mock logs a deterministic Serial ID synced directly to Tab 7 (8-IIM Call &amp; Target Forecaster).</p>
              </div>
              <button type="button" onclick="window.switchTab('tab7')" class="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer">
                Open Tab 7 Forecaster &rarr;
              </button>
            </div>

            ${hist.length ? `
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                      <th class="py-2 pr-2">Verified Serial ID</th>
                      <th class="py-2 px-2">Exam Track</th>
                      <th class="py-2 px-2">Date</th>
                      <th class="py-2 px-2">Net Score</th>
                      <th class="py-2 px-2">Accuracy</th>
                      <th class="py-2 pl-2 text-right">Tab 7 Sync</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/70">
                    ${hist.map(h => `
                      <tr>
                        <td class="py-2 pr-2 font-mono font-bold text-amber-300">${h.serialId}</td>
                        <td class="py-2 px-2 text-white font-semibold">${h.title}</td>
                        <td class="py-2 px-2 text-slate-400">${h.date || "Today"}</td>
                        <td class="py-2 px-2 font-bold text-emerald-300">${h.score} / ${h.maxScore}</td>
                        <td class="py-2 px-2 text-slate-300">${h.accuracyPct || 0}% (${h.correct}C / ${h.wrong}W)</td>
                        <td class="py-2 pl-2 text-right">
                          <button type="button" onclick="window.syncSpecificIpmMockToTab7('${h.serialId}')"
                            class="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-extrabold cursor-pointer">
                            Sync to Tab 7 &rarr;
                          </button>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            ` : `
              <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                No proctored mocks submitted yet. Complete any mock above to generate your first <code class="text-amber-300">${spec.code}-YYYYMMDD-#01</code> Serial ID and sync it to Tab 7.
              </div>
            `}
          </div>
        </div>
      `;
      return;
    }

    // Active / Submitted Mock view (delegate to PG_MOCK renderer and inject Serial ID badge)
    const qs = window.PG_MOCK.questions;
    if (window.PG_MOCK.submitted) {
      const latest = getMockHistory().slice(-1)[0] || {};
      el.innerHTML = `
        <div class="space-y-4">
          <div class="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-6 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span class="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-extrabold">${window.PG_MOCK.serialId || spec.code}</span>
                <h2 class="text-lg font-bold text-white mt-1">Official Scorecard: ${window.PG_MOCK.title}</h2>
              </div>
              <div class="flex gap-2">
                <button type="button" onclick="window.syncSpecificIpmMockToTab7('${window.PG_MOCK.serialId || ""}')"
                  class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white shadow cursor-pointer">
                  &#8635; Sync Score to Tab 7 Forecaster &rarr;
                </button>
                <button type="button" onclick="window.exitPgMock()" class="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white cursor-pointer">
                  Back to Mock Lobby
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800"><div class="text-xs text-slate-400">Net Score</div><div class="text-xl font-extrabold text-emerald-400">${latest.score ?? 0} / ${latest.maxScore ?? qs.length * 4}</div></div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800"><div class="text-xs text-slate-400">Correct (+4)</div><div class="text-xl font-extrabold text-emerald-300">${latest.correct ?? 0}</div></div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800"><div class="text-xs text-slate-400">Incorrect (-1 MCQ / 0 SA)</div><div class="text-xl font-extrabold text-rose-400">${latest.wrong ?? 0}</div></div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800"><div class="text-xs text-slate-400">Serial ID Logged</div><div class="text-sm font-mono font-extrabold text-amber-300 pt-1">${window.PG_MOCK.serialId || "LOGGED"}</div></div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Active question runner
    const idx = window.PG_MOCK.currentIndex;
    const q = qs[idx];
    const hasOpts = Array.isArray(q.options) && q.options.length > 0;
    const m = String(Math.floor(window.PG_MOCK.secondsLeft / 60)).padStart(2, "0");
    const s = String(window.PG_MOCK.secondsLeft % 60).padStart(2, "0");

    el.innerHTML = `
      <div class="space-y-4">
        <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold">${window.PG_MOCK.serialId || spec.code}</span>
              <span class="text-sm font-bold text-white">${window.PG_MOCK.title}</span>
            </div>
            <div class="text-xs text-slate-400 mt-0.5">Question ${idx + 1} of ${qs.length} &bull; ${hasOpts ? "MCQ (+4 / -1)" : "Short Answer (+4 / 0)"}</div>
          </div>
          <div class="flex items-center gap-3">
            <span id="pgMockClock" class="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-extrabold text-sm">${m}:${s}</span>
            <button type="button" onclick="window.submitPgMock()" class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer">Submit Test</button>
            <button type="button" onclick="window.exitPgMock()" class="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer">Exit</button>
          </div>
        </div>
        <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 space-y-4">
          <p class="text-sm md:text-base text-white leading-relaxed whitespace-pre-line">${q.prompt}</p>
          ${hasOpts ? `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              ${q.options.map((opt, oi) => {
                const chosen = Number(window.PG_MOCK.answers[q.id]) === oi && window.PG_MOCK.answers[q.id] !== undefined;
                return `<button type="button" onclick="window.savePgMockAnswer('${q.id}', ${oi})"
                  class="text-left p-3 rounded-xl border text-xs md:text-sm transition ${chosen ? "bg-indigo-600/30 border-indigo-400 text-white font-bold" : "bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500"}">
                  <span class="font-bold mr-2">${String.fromCharCode(65 + oi)}.</span> ${opt}
                </button>`;
              }).join("")}
            </div>
          ` : `
            <input type="text" value="${window.PG_MOCK.answers[q.id] || ""}" onchange="window.savePgMockAnswer('${q.id}', this.value)"
              placeholder="Type exact number..." class="w-full max-w-xs px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono" />
          `}
          <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
            <div class="flex gap-2">
              <button type="button" onclick="window.jumpPgMockQ(${idx - 1})" ${idx === 0 ? "disabled" : ""} class="px-3.5 py-1.5 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-bold text-white">&larr; Previous</button>
              <button type="button" onclick="window.jumpPgMockQ(${idx + 1})" ${idx === qs.length - 1 ? "disabled" : ""} class="px-3.5 py-1.5 rounded-xl bg-indigo-600 disabled:opacity-40 text-xs font-bold text-white">Next &rarr;</button>
            </div>
            <div class="flex flex-wrap gap-1">
              ${qs.map((item, qi) => {
                const ansd = window.PG_MOCK.answers[item.id] !== undefined && String(window.PG_MOCK.answers[item.id]).trim() !== "";
                return `<button type="button" onclick="window.jumpPgMockQ(${qi})" class="w-7 h-7 rounded-lg text-[11px] font-bold ${qi === idx ? "bg-amber-500 text-slate-950" : ansd ? "bg-emerald-600/40 text-emerald-200 border border-emerald-500/40" : "bg-slate-950 text-slate-400 border border-slate-800"}">${qi + 1}</button>`;
              }).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // TAB 5: 5-Yr PYQ Vault
  window.renderTab5 = function (el) {
    if (typeof origRenderTab9Pyq === "function") origRenderTab9Pyq(el);
  };

  // TAB 6: Split-Screen Trap Doctor & AI Doubts
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
    if (typeof origRenderTab7Doubt === "function") origRenderTab7Doubt(right);
  };

  // TAB 7: Mode-Aligned 8-IIM Call & Target Forecaster + Synced Serial ID Log
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
    syncedSerialId: ""
  };

  function applyMockRecordToT7State(rec) {
    if (!rec) return;
    const ratio = Math.min(1, Math.max(0.2, Number(rec.score || 0) / Math.max(1, Number(rec.maxScore || 120))));
    const code = String(rec.modeCode || "").toUpperCase();
    window.IPM_T7_STATE.syncedSerialId = rec.serialId || "";

    if (code === "IPM-ROH") {
      window.IPM_T7_STATE.rohtak = Math.round(480 * ratio);
    } else if (code === "IPM-JIP") {
      window.IPM_T7_STATE.jipmat = Math.round(400 * ratio);
    } else if (code === "IPM-IIMB") {
      window.IPM_T7_STATE.iimbUg = Math.round(300 * ratio);
    } else if (code === "IPM-IIMM") {
      window.IPM_T7_STATE.jeePct = +(88 + 11.5 * ratio).toFixed(1);
    } else {
      window.IPM_T7_STATE.indSa = Math.round(60 * ratio);
      window.IPM_T7_STATE.indMcq = Math.round(120 * ratio);
      window.IPM_T7_STATE.indVa = Math.round(180 * ratio);
      if (code === "IPM-ALL") {
        window.IPM_T7_STATE.rohtak = Math.round(480 * ratio);
        window.IPM_T7_STATE.jipmat = Math.round(400 * ratio);
        window.IPM_T7_STATE.iimbUg = Math.round(300 * ratio);
      }
    }
  }

  window.syncSpecificIpmMockToTab7 = function (serialId) {
    const hist = getMockHistory();
    const match = hist.find(h => h.serialId === serialId) || hist[hist.length - 1];
    if (match) applyMockRecordToT7State(match);
    if (window.IPM_STATE && window.IPM_STATE.activeTab !== "tab7") {
      window.switchTab("tab7");
    } else {
      window.renderActiveTab();
    }
  };

  window.syncLatestIpmMockToTab7 = function () {
    const spec = window.getActiveIpmModeSpec();
    const hist = getMockHistory();
    const modeMatch = hist.slice().reverse().find(h => h.modeCode === spec.code) || hist[hist.length - 1];
    if (modeMatch) {
      applyMockRecordToT7State(modeMatch);
    }
    window.renderActiveTab();
  };

  window.updateIpmT7Slider = function (key, val) {
    window.IPM_T7_STATE[key] = key === "hasMath" ? Boolean(val) : parseFloat(val);
    window.renderActiveTab();
  };

  window.renderTab7 = function (el) {
    const spec = window.getActiveIpmModeSpec();
    const s = window.IPM_T7_STATE;
    const hist = getMockHistory().slice().reverse();
    const indTotal = s.indSa + s.indMcq + s.indVa;
    const indAts = ((s.indSa / 60) * 20 + (s.indMcq / 120) * 20 + (s.indVa / 180) * 25).toFixed(1);
    const rohtakComp = ((s.rohtak / 480) * 45 + (s.c10 / 100) * 10 + (s.c12 / 100) * 20).toFixed(1);

    const campuses = [
      {
        name: "IIM Indore (5-Yr IPM)",
        yourScore: `${indTotal}/360 (ATS ${indAts}/65)`,
        cutoff: "SA ≥ 24 • MCQ ≥ 40 • VA ≥ 116 (Total ~180+)",
        gap: Math.max(0, 180 - indTotal),
        eligible: s.indSa >= 24 && s.indMcq >= 40 && s.indVa >= 116,
        note: s.indSa < 24 ? `Need +${24 - s.indSa} in QA-SA` : s.indMcq < 40 ? `Need +${40 - s.indMcq} in QA-MCQ` : s.indVa < 116 ? `Need +${116 - s.indVa} in VA` : "All 3 sectional cutoffs cleared!"
      },
      {
        name: "IIM Ranchi (5-Yr IPM)",
        yourScore: `${indTotal}/360 + Acads ${((s.c10 + s.c12) / 2).toFixed(1)}%`,
        cutoff: "Total ~172+ (No sectional bar, 20% 10th/12th weight)",
        gap: Math.max(0, 172 - indTotal),
        eligible: indTotal >= 172,
        note: indTotal >= 172 ? "Strong PI shortlist zone" : `Need +${172 - indTotal} overall IPMAT marks`
      },
      {
        name: "IIM Rohtak (5-Yr IPM)",
        yourScore: `${s.rohtak}/480 (Pre-PI ${rohtakComp}/75)`,
        cutoff: "General ~385–405 / 480 + 30% Acad Weight",
        gap: Math.max(0, 390 - s.rohtak),
        eligible: s.rohtak >= 390,
        note: s.rohtak >= 390 ? "Above expected General PI call cutoff" : `Need +${390 - s.rohtak} marks in Rohtak CBT`
      },
      {
        name: "IIM Bodh Gaya (5-Yr IPM)",
        yourScore: `${s.jipmat}/400`,
        cutoff: "General ~310–325 / 400 (100% JIPMAT Merit)",
        gap: Math.max(0, 315 - s.jipmat),
        eligible: s.jipmat >= 315,
        note: s.jipmat >= 315 ? "Direct merit shortlist range" : `Need +${315 - s.jipmat} marks in JIPMAT`
      },
      {
        name: "IIM Jammu (5-Yr IPM)",
        yourScore: `${s.jipmat}/400`,
        cutoff: "General ~305–320 / 400 + Gender Diversity",
        gap: Math.max(0, 310 - s.jipmat),
        eligible: s.jipmat >= 310,
        note: s.jipmat >= 310 ? "Competitive for Merit List 1" : `Need +${310 - s.jipmat} marks in JIPMAT`
      },
      {
        name: "IIM Bangalore (B.Sc. Econ/DS & BBA DBE)",
        yourScore: `${s.iimbUg}/300 • Class 12 Math: ${s.hasMath ? "Yes" : "No"}`,
        cutoff: "Class 12 Math mandatory for B.Sc. • ~235+/300",
        gap: Math.max(0, 235 - s.iimbUg),
        eligible: s.hasMath && s.iimbUg >= 235,
        note: !s.hasMath ? "Ineligible for B.Sc. (No Class 12 Math); eligible for BBA DBE" : s.iimbUg >= 235 ? "Eligible for both B.Sc. & BBA DBE PI" : `Need +${235 - s.iimbUg} in IIMB UG test`
      },
      {
        name: "IIM Mumbai (4-Yr BS Digital & Supply Chain)",
        yourScore: `JEE ${s.jeePct}%ile • Math: ${s.hasMath ? "Yes" : "No"}`,
        cutoff: "Class 12 Math mandatory • ~96.0+%ile equivalent",
        gap: Math.max(0, +(96.0 - s.jeePct).toFixed(1)),
        eligible: s.hasMath && s.jeePct >= 96.0,
        note: !s.hasMath ? "Requires Class 12 Mathematics" : s.jeePct >= 96.0 ? "Meets quantitative & JEE benchmark" : `Need +${(96.0 - s.jeePct).toFixed(1)}%ile`
      },
      {
        name: "IIM Lucknow (4-Yr Tech-Mgmt UG)",
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
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg font-bold text-white">8-IIM Call &amp; Target Forecaster &bull; ${spec.label}</h2>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold">${callsCount} / 8 IIMs Shortlist Ready</span>
              ${s.syncedSerialId ? `<span class="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold">Synced: ${s.syncedSerialId}</span>` : ""}
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Active Mode Focus: <strong>${spec.targetCampus}</strong> (${spec.code}). Sync any Tab 4 mock Serial ID or adjust sliders below.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" onclick="window.syncLatestIpmMockToTab7()"
              class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow cursor-pointer">
              &#8635; Sync Mock (${spec.code})
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

          <div class="lg:col-span-7 space-y-4">
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 overflow-x-auto">
              <div class="flex items-center justify-between">
                <div class="text-xs font-extrabold uppercase tracking-wider text-emerald-400">8-IIM Campus Shortlist &amp; Cutoff Deficiency Matrix</div>
                <span class="text-[11px] text-slate-400">Highlighted: ${spec.targetCampus}</span>
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
                  ${campuses.map(c => {
                    const isFocused = c.name === spec.targetCampus;
                    return `
                    <tr class="${isFocused ? 'bg-indigo-950/40' : ''}">
                      <td class="py-2.5 pr-2 font-bold text-white">
                        ${c.name} ${isFocused ? '<span class="ml-1 px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 text-[9px] uppercase">Active Mode</span>' : ''}
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
                  `;}).join("")}
                </tbody>
              </table>
            </div>

            <!-- ALIGNED TAB 4 MOCK SERIAL ID LOGS INSIDE TAB 7 -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-extrabold uppercase tracking-wider text-amber-400">Synced Tab 4 Mock Serial ID Logs (${hist.length})</span>
                <span class="text-[11px] text-slate-400">Click any Serial ID to load into Forecaster</span>
              </div>
              ${hist.length ? `
                <div class="flex flex-wrap gap-2">
                  ${hist.slice(0, 8).map(h => `
                    <button type="button" onclick="window.syncSpecificIpmMockToTab7('${h.serialId}')"
                      class="px-3 py-1.5 rounded-xl border text-left transition cursor-pointer ${
                        s.syncedSerialId === h.serialId
                          ? "bg-amber-500/20 border-amber-400 text-amber-200 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500"
                      }">
                      <div class="font-mono text-[11px] font-extrabold">${h.serialId}</div>
                      <div class="text-[10px] text-slate-400">${h.score}/${h.maxScore} (${h.accuracyPct || 0}%)</div>
                    </button>
                  `).join("")}
                </div>
              ` : `<div class="text-[11px] text-slate-400">No Tab 4 mock logs yet. Complete a mock in Tab 4 to populate mode-tagged Serial IDs here.</div>`}
            </div>
          </div>
        </div>
      </div>
    `;
  };
})();
