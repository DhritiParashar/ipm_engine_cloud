window.MOCK_ANSWERS = {};
window.MOCK_SUBMITTED = false;
window.MOCK_PAPER_TYPE = "FULL_DIAGNOSTIC";
window.MOCK_INCLUDE_NCERT = true;
window.MOCK_QUESTIONS_CACHE = [];
window.MOCK_HISTORY_CODES = JSON.parse(localStorage.getItem("ipm_attempted_q_codes") || "[]");
window.MOCK_DB_INFO = null;
window.MOCK_LOADING = false;
window.MOCK_ACTIVE_SESSION = false;
window.MOCK_ERROR_MSG = "";
window.MOCK_TIMER_SECONDS = null;
window.MOCK_TIMER_INTERVAL = null;

window.fetchNewRandomMock = async function () {
  if (window.MOCK_LOADING) return;
  window.MOCK_LOADING = true;
  window.MOCK_ERROR_MSG = "";
  window.renderActiveTab();

  try {
    const res = await fetch("/api/mock/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam_mode: window.IPM_STATE.activeModeId,
        paper_type: window.MOCK_PAPER_TYPE,
        include_ncert: window.MOCK_INCLUDE_NCERT,
        exclude_codes: window.MOCK_HISTORY_CODES.slice(-180)
      })
    });
    const data = await res.json();
    if (data.error) window.MOCK_ERROR_MSG = data.error;
    if (Array.isArray(data.questions) && data.questions.length > 0) {
      window.MOCK_QUESTIONS_CACHE = data.questions;
      window.MOCK_DB_INFO = data.db || null;
    } else {
      window.MOCK_QUESTIONS_CACHE = (window.IPM_TAGGED_MOCK_QUESTIONS || []).slice(0, 20);
    }
  } catch (e) {
    window.MOCK_ERROR_MSG = e.message;
    window.MOCK_QUESTIONS_CACHE = (window.IPM_TAGGED_MOCK_QUESTIONS || []).slice(0, 20);
  } finally {
    window.MOCK_LOADING = false;
    window.MOCK_ACTIVE_SESSION = true;
    window.MOCK_ANSWERS = {};
    window.MOCK_SUBMITTED = false;
    const mins = window.MOCK_PAPER_TYPE === "FULL_DIAGNOSTIC" ? 60 : 40;
    window.startMockTimer(mins);
    window.renderActiveTab();
  }
};

window.startMockTimer = function (minutes) {
  if (window.MOCK_TIMER_INTERVAL) clearInterval(window.MOCK_TIMER_INTERVAL);
  window.MOCK_TIMER_SECONDS = minutes * 60;
  window.MOCK_TIMER_INTERVAL = setInterval(() => {
    if (window.MOCK_SUBMITTED || !window.MOCK_ACTIVE_SESSION) {
      clearInterval(window.MOCK_TIMER_INTERVAL);
      return;
    }
    window.MOCK_TIMER_SECONDS--;
    const disp = document.getElementById("mock-countdown-clock");
    if (disp) {
      const m = Math.floor(Math.max(0, window.MOCK_TIMER_SECONDS) / 60);
      const s = Math.max(0, window.MOCK_TIMER_SECONDS) % 60;
      disp.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    if (window.MOCK_TIMER_SECONDS <= 0) {
      clearInterval(window.MOCK_TIMER_INTERVAL);
      window.scoreMock();
    }
  }, 1000);
};

window.exitMockWithoutSubmission = function () {
  if (window.MOCK_TIMER_INTERVAL) {
    clearInterval(window.MOCK_TIMER_INTERVAL);
    window.MOCK_TIMER_INTERVAL = null;
  }
  window.MOCK_ACTIVE_SESSION = false;
  window.MOCK_ANSWERS = {};
  window.MOCK_SUBMITTED = false;
  window.MOCK_QUESTIONS_CACHE = [];
  window.MOCK_TIMER_SECONDS = null;
  window.renderActiveTab();
};

window.selectMockPaper = function (pid) {
  window.MOCK_PAPER_TYPE = pid;
  if (window.MOCK_ACTIVE_SESSION) {
    window.fetchNewRandomMock();
  } else {
    window.renderActiveTab();
  }
};

window.toggleMockNcert = function (flag) {
  window.MOCK_INCLUDE_NCERT = flag;
  if (window.MOCK_ACTIVE_SESSION) {
    window.fetchNewRandomMock();
  } else {
    window.renderActiveTab();
  }
};

window.renderTab8 = function (el) {
  const mode = window.getActiveMode();
  const papers = [
    { id: "FULL_DIAGNOSTIC", label: "Full 45-Q All-Section Random Mock (60m)", mins: 60, qs: 45 },
    { id: "QUANT_SPRINT", label: "Quant & Higher Math 30-Q Sprint (40m)", mins: 40, qs: 30 },
    { id: "NCERT_HIGHER_MATH_SPRINT", label: "Class 10/11/12 + Higher Math 30-Q Sprint (40m)", mins: 40, qs: 30 },
    { id: "DILR_SPRINT", label: "DI & LR 25-Q Sprint (40m)", mins: 40, qs: 25 },
    { id: "VARC_SPRINT", label: "VARC & Grammar 30-Q Sprint (40m)", mins: 40, qs: 30 }
  ];
  const selectedPaper = papers.find(p => p.id === window.MOCK_PAPER_TYPE) || papers[0];

  // STATE 1: MOCK LOBBY (Nothing starts until user explicitly clicks Start Random Mock)
  if (!window.MOCK_ACTIVE_SESSION && !window.MOCK_LOADING) {
    el.innerHTML = `
      <div class="max-w-4xl mx-auto my-4 bg-slate-900/95 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase">
              PostgreSQL Non-Repeating Mock Lobby
            </span>
            <h2 class="text-xl font-bold text-white mt-1.5">Configure Timed Mock — ${mode.label}</h2>
            <p class="text-xs text-slate-400 mt-0.5">
              Timer & question generation will <strong>not</strong> start until you click <strong>Start Random Mock</strong> below.
            </p>
          </div>
          <div class="text-right text-xs text-slate-300 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5">
            <div>Unseen History Tracked: <strong class="text-emerald-300">${window.MOCK_HISTORY_CODES.length} Qs</strong></div>
            <div>Marking: <strong>MCQ +${mode.marking.mcqCorrect}/${mode.marking.mcqWrong}</strong> | <strong>SA +${mode.marking.saCorrect}/${mode.marking.saWrong}</strong></div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-xs font-bold text-slate-300 uppercase tracking-wide">1. Choose Paper Format</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            ${papers.map(p => `
              <button type="button" onclick="window.selectMockPaper('${p.id}')"
                class="text-left p-3.5 rounded-xl border text-xs transition ${
                  window.MOCK_PAPER_TYPE === p.id
                    ? "bg-indigo-600/25 border-indigo-400 text-white font-bold shadow"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600"
                }">
                <div class="flex items-center justify-between">
                  <span>${p.label}</span>
                  <span class="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">${p.mins}m</span>
                </div>
              </button>
            `).join("")}
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
          <label class="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
            <input type="checkbox" ${window.MOCK_INCLUDE_NCERT ? "checked" : ""} onchange="window.toggleMockNcert(this.checked)">
            <span>Blend Class 10/11/12 NCERT & Higher Math Question Bank</span>
          </label>

          <button type="button" onclick="window.fetchNewRandomMock()"
            class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs md:text-sm font-extrabold text-white shadow-lg cursor-pointer">
            &#9654; Start Random Mock (${selectedPaper.qs} Qs &bull; ${selectedPaper.mins} Mins)
          </button>
        </div>
      </div>
    `;
    return;
  }

  // STATE 2: ACTIVE TIMED MOCK SESSION
  const questions = window.MOCK_QUESTIONS_CACHE;
  const minsLeft = Math.floor(Math.max(0, window.MOCK_TIMER_SECONDS || 0) / 60);
  const secsLeft = Math.max(0, window.MOCK_TIMER_SECONDS || 0) % 60;
  const answeredCount = questions.filter(q => window.MOCK_ANSWERS[q.id] !== undefined && String(window.MOCK_ANSWERS[q.id]).trim() !== "").length;

  el.innerHTML = `
    <div class="space-y-4">
      <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 space-y-3 sticky top-28 z-20 shadow-lg">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-bold text-white">Randomized DB Mock Engine — ${mode.label} (${questions.length} Qs)</h2>
              ${window.MOCK_DB_INFO ? `<span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">${window.MOCK_DB_INFO.engine} &bull; ${window.MOCK_DB_INFO.total_questions} Qs Pool</span>` : ""}
            </div>
            <p class="text-[11px] text-slate-400">
              Answered: <strong>${answeredCount}/${questions.length}</strong> &bull;
              Unseen History Tracked: <strong>${window.MOCK_HISTORY_CODES.length} Qs</strong> &bull;
              MCQ: <strong>+${mode.marking.mcqCorrect}/${mode.marking.mcqWrong}</strong> | SA: <strong>+${mode.marking.saCorrect}/${mode.marking.saWrong}</strong>
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <div class="px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 font-mono text-sm font-bold text-amber-300">
              &#9201; <span id="mock-countdown-clock">${String(minsLeft).padStart(2, "0")}:${String(secsLeft).padStart(2, "0")}</span>
            </div>
            <button type="button" onclick="window.fetchNewRandomMock()" class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow cursor-pointer">
              ${window.MOCK_LOADING ? "Generating..." : "&#127922; New Random Set"}
            </button>
            <button type="button" onclick="window.scoreMock()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer">
              Submit & Grade
            </button>
            <button type="button" onclick="window.exitMockWithoutSubmission()" class="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer">
              Exit without Submission
            </button>
          </div>
        </div>

        ${window.MOCK_ERROR_MSG ? `<div class="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-[11px] text-rose-200">DB Notice: ${window.MOCK_ERROR_MSG}</div>` : ""}
      </div>

      <div id="mock-score-banner" class="hidden bg-indigo-950/80 border border-indigo-500 rounded-2xl p-4 text-sm text-white"></div>

      <div class="space-y-4">
        ${questions.map((q, idx) => `
          <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-xs font-bold text-indigo-400">Question ${idx + 1} of ${questions.length} &bull; ${q.section || "QUANT"} (${q.topic || ""})</span>
              <div class="flex gap-1.5">
                ${q.source_tag === "CLASS_10_11_12_IMPORT" ? `<span class="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">Class 10/11/12 Bank</span>` : ""}
                <span class="text-[11px] px-2.5 py-0.5 rounded font-semibold ${
                  q.type === "SA_NUMERIC" ? "bg-amber-500/20 text-amber-300" : "bg-sky-500/20 text-sky-300"
                }">${q.type === "SA_NUMERIC" ? "Short Answer (Zero Negative)" : "MCQ (+4 / -1)"}</span>
              </div>
            </div>
            <p class="text-xs md:text-sm text-slate-100 whitespace-pre-line leading-relaxed">${q.prompt}</p>

            ${
              q.type === "SA_NUMERIC"
                ? `<div class="max-w-xs space-y-2">
                     <input id="sa-input-${q.id}" type="text" placeholder="Type exact numerical answer..." value="${window.MOCK_ANSWERS[q.id] || ""}"
                       oninput="window.MOCK_ANSWERS['${q.id}'] = this.value"
                       class="w-full rounded-xl bg-slate-950 border border-amber-500/50 p-2.5 text-sm font-mono text-amber-300">
                     <div class="grid grid-cols-5 gap-1">
                       ${["1","2","3","4","5","6","7","8","9","0","-",".","CLR"].map(k => `
                         <button type="button" onclick="window.pressSaKey('${q.id}', '${k}')"
                           class="py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-200 border border-slate-700">${k}</button>
                       `).join("")}
                     </div>
                   </div>`
                : `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    ${(q.options || []).map((opt, oi) => {
                      const picked = window.MOCK_ANSWERS[q.id] === oi;
                      return `<button type="button" onclick="window.pickMcq('${q.id}', ${oi})"
                        class="text-left p-3 rounded-xl border text-xs transition ${
                          picked
                            ? "bg-indigo-600/30 border-indigo-400 text-white font-semibold"
                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600"
                        }">
                        <span class="font-bold mr-2">${String.fromCharCode(65 + oi)}.</span> ${opt}
                      </button>`;
                    }).join("")}
                   </div>`
            }

            <div id="exp-${q.id}" class="${window.MOCK_SUBMITTED ? "" : "hidden"} p-3 rounded-xl bg-slate-950 border border-emerald-700/40 text-xs text-emerald-200">
              <strong>Solution:</strong> ${q.explanation}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
};

window.pressSaKey = function (qid, key) {
  const cur = String(window.MOCK_ANSWERS[qid] || "");
  window.MOCK_ANSWERS[qid] = key === "CLR" ? "" : cur + key;
  const inp = document.getElementById("sa-input-" + qid);
  if (inp) inp.value = window.MOCK_ANSWERS[qid];
};
window.pickMcq = function (qid, optIdx) { window.MOCK_ANSWERS[qid] = optIdx; window.renderActiveTab(); };

window.scoreMock = async function () {
  if (window.MOCK_TIMER_INTERVAL) clearInterval(window.MOCK_TIMER_INTERVAL);
  const mode = window.getActiveMode();
  const questions = window.MOCK_QUESTIONS_CACHE;
  let total = 0, maxScore = 0, correct = 0, wrong = 0, unattempted = 0;

  questions.forEach(q => {
    const ans = window.MOCK_ANSWERS[q.id];
    if (q.type === "SA_NUMERIC") {
      maxScore += mode.marking.saCorrect;
      if (ans === undefined || String(ans).trim() === "") unattempted++;
      else if (String(ans).trim() === String(q.answer).trim()) { total += mode.marking.saCorrect; correct++; }
      else { total += mode.marking.saWrong; wrong++; }
    } else {
      maxScore += mode.marking.mcqCorrect;
      if (ans === undefined) unattempted++;
      else if (ans === q.answer) { total += mode.marking.mcqCorrect; correct++; }
      else { total += mode.marking.mcqWrong; wrong++; }
    }
  });

  const usedCodes = questions.map(q => q.id);
  window.MOCK_HISTORY_CODES = Array.from(new Set([...window.MOCK_HISTORY_CODES, ...usedCodes]));
  localStorage.setItem("ipm_attempted_q_codes", JSON.stringify(window.MOCK_HISTORY_CODES));

  const acc = (correct + wrong) ? Math.round((correct / (correct + wrong)) * 100) : 0;
  try {
    await fetch("/api/mock/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: localStorage.getItem("ipm_auth_token") || null,
        exam_track: mode.label,
        paper_type: window.MOCK_PAPER_TYPE,
        score: total,
        max_score: maxScore,
        accuracy_pct: acc,
        attempted_q_codes: usedCodes
      })
    });
  } catch (e) {}

  window.MOCK_SUBMITTED = true;
  window.renderActiveTab();
  const banner = document.getElementById("mock-score-banner");
  if (banner) {
    banner.classList.remove("hidden");
    banner.innerHTML = `
      <strong>Final Mock Score: ${total} / ${maxScore}</strong> &nbsp;|&nbsp;
      Accuracy: <span class="text-amber-300 font-bold">${acc}%</span> &nbsp;|&nbsp;
      Correct: <span class="text-emerald-300 font-bold">${correct}</span> &nbsp;|&nbsp;
      Wrong: <span class="text-rose-300 font-bold">${wrong}</span> &nbsp;|&nbsp;
      Skipped: <span class="text-slate-300">${unattempted}</span>
    `;
  }
};