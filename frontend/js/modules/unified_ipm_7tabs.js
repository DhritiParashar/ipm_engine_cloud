// ==============================================================================
// GOALisB IIM UG & IPM MASTER ENGINE â€” FULL SUITE PARITY & SCORECARD ENGINE (v24)
// - Adds Download Official Scorecard (.html / Print-to-PDF) & Exit Without Submission
// - Adds full Question-by-Question Answer Key & Step-by-Step Solution Review
// - Adds Paper Difficulty / Shift Tier + Candidate Honor-Code Declaration in Tab 4
// - Fixes 0% accuracy false-strength bug in Strength & Deficiency diagnostics
// ==============================================================================
(function () {
  window.IPM_T3_SUBMODE = window.IPM_T3_SUBMODE || "varc";
  window.ACTIVE_IIM_KEY = window.ACTIVE_IIM_KEY || "ALL";
  window.IPM_PAPER_TIER = window.IPM_PAPER_TIER || "STANDARD"; // "TOUGH" | "STANDARD" | "HIGH_CUTOFF"
  window.IPM_HONOR_CHECKED = true;

  const origRenderTab3 = window.renderTab3;
  const origRenderTab4Trap = window.renderTab4;
  const origRenderTab5Pi = window.renderTab5;
  const origRenderTab7Doubt = window.renderTab7;
  const origRenderTab9Pyq = window.renderTab9;

  const INDIVIDUAL_IIM_MODES = [
    {
      key: "ALL",
      code: "IPM-ALL",
      shortLabel: "All-8 IIMs Master",
      subLabel: "Unified",
      fullLabel: "All-8 IIMs Comprehensive Master",
      campusName: "IIM Indore (5-Yr IPM)",
      apiExam: "ALL",
      pyqExamFilter: "ALL",
      qCount: 30,
      mins: 45,
      pattern: "100 Qs | 150 Mins | Unified Pool",
      marking: "MCQ +4/-1 | SA +4/0 (Zero Penalty)",
      note: "Unified multi-campus benchmark across Indore, Ranchi, Rohtak, Bodh Gaya, Jammu, Bangalore, Mumbai & Lucknow.",
      practiceSections: [
        { title: "QA Short Answer (Zero Negative)", section: "QUANT_SA", suffix: "SA", qCount: 12, mins: 18, badge: "INDORE SA DRILL", desc: "Numeric short-answer drills with 0 negative marking penalty." },
        { title: "QA & Higher Math MCQ Sprint", section: "QUANT_MCQ", suffix: "QA", qCount: 15, mins: 22, badge: "QUANT +4/-1", desc: "Arithmetic, Algebra, Logs, Matrices & Functions speed sprint." },
        { title: "DI & Logical Reasoning Set", section: "DILR", suffix: "LR", qCount: 15, mins: 22, badge: "DILR +4/-1", desc: "Caselets, Data Sufficiency, Seating & Business Analytics." },
        { title: "VARC, RC & Confusable Vocab", section: "VARC", suffix: "VA", qCount: 15, mins: 20, badge: "VERBAL +4/-1", desc: "Reading Comprehension, Para-jumbles, Idioms & Grammar." }
      ]
    },
    {
      key: "INDORE",
      code: "IPM-IND",
      shortLabel: "IIM Indore",
      subLabel: "5-Yr IPM",
      fullLabel: "IIM Indore (5-Yr IPM)",
      campusName: "IIM Indore (5-Yr IPM)",
      apiExam: "IPMAT",
      pyqExamFilter: "IPMAT Indore",
      qCount: 25,
      mins: 38,
      pattern: "90 Qs (15 SA + 30 MCQ + 45 VA) | 120 Mins",
      marking: "MCQ +4/-1 | QA-SA +4/0 (Zero Penalty)",
      note: "Strict 40-min sectional timers & cutoffs (SA &ge;24, MCQ &ge;40, VA &ge;116) + 35% Personal Interview.",
      practiceSections: [
        { title: "Indore QA-SA (Zero Penalty)", section: "QUANT_SA", suffix: "SA", qCount: 15, mins: 25, badge: "INDORE SEC 1 (+4/0)", desc: "Exact 15-Q Short Answer numeric drill with zero negative marking." },
        { title: "Indore QA-MCQ & Higher Math", section: "QUANT_MCQ", suffix: "MCQ", qCount: 15, mins: 22, badge: "INDORE SEC 2 (+4/-1)", desc: "Logarithms, Matrices, Functions, Sequences & Number Theory." },
        { title: "Indore Verbal Ability (45-Q Pace)", section: "VARC", suffix: "VA", qCount: 15, mins: 15, badge: "INDORE SEC 3 (+4/-1)", desc: "High-weightage RC, Para-jumbles, Idioms & Usage accuracy sprint." },
        { title: "Indore Complete 3-Section Sprint", section: "", suffix: "MIX", qCount: 18, mins: 25, badge: "INDORE COMPOSITE", desc: "Balanced SA + MCQ + VA mini-simulation calibrated to ATS cutoffs." }
      ]
    },
    {
      key: "RANCHI",
      code: "IPM-RAN",
      shortLabel: "IIM Ranchi",
      subLabel: "5-Yr IPM",
      fullLabel: "IIM Ranchi (5-Yr IPM)",
      campusName: "IIM Ranchi (5-Yr IPM)",
      apiExam: "IPMAT",
      pyqExamFilter: "IPMAT Indore",
      qCount: 25,
      mins: 38,
      pattern: "Uses IPMAT Indore Score (No Sectional Bar) | 120 Mins",
      marking: "MCQ +4/-1 | SA +4/0 | 20% 10th/12th Weight",
      note: "Evaluates overall IPMAT Indore composite (~172+ General) with 20% academic weightage and 30% PI.",
      practiceSections: [
        { title: "Ranchi Score Booster: QA-SA (+4/0)", section: "QUANT_SA", suffix: "SA", qCount: 15, mins: 25, badge: "RANCHI QA-SA (+4/0)", desc: "Maximize risk-free SA marks to push total IPMAT composite above 172+." },
        { title: "Ranchi Quant MCQ Drill (+4/-1)", section: "QUANT_MCQ", suffix: "QA", qCount: 15, mins: 22, badge: "QUANT +4/-1", desc: "High-yield Arithmetic & Algebra sets for overall composite gain." },
        { title: "Ranchi Verbal Ability Maximizer", section: "VARC", suffix: "VA", qCount: 15, mins: 15, badge: "VERBAL +4/-1", desc: "Fast RC & Vocabulary scoring sprint for non-sectional-bar merit." },
        { title: "Ranchi 172+ Composite Drill", section: "", suffix: "COMP", qCount: 18, mins: 25, badge: "RANCHI TARGET", desc: "Mixed Indore-pattern drill tuned for Ranchi shortlist cutoff." }
      ]
    },
    {
      key: "ROHTAK",
      code: "IPM-ROH",
      shortLabel: "IIM Rohtak",
      subLabel: "5-Yr IPM",
      fullLabel: "IIM Rohtak (5-Yr IPM)",
      campusName: "IIM Rohtak (5-Yr IPM)",
      apiExam: "Rohtak",
      pyqExamFilter: "IPMAT Rohtak",
      qCount: 30,
      mins: 40,
      pattern: "120 Qs (40 QA + 40 LR + 40 VA) | 120 Mins",
      marking: "MCQ +4/-1 across all 3 sections | 30% Acad Weight",
      note: "High-speed accuracy test (~390+/480 General cutoff) combined with 10% Class 10 & 20% Class 12 weight.",
      practiceSections: [
        { title: "Rohtak Quantitative Ability (40-Q Pace)", section: "QUANT_MCQ", suffix: "QA", qCount: 15, mins: 15, badge: "ROHTAK SEC 1 (+4/-1)", desc: "1-minute-per-question Arithmetic, Algebra & Mensuration speed drill." },
        { title: "Rohtak Logical Reasoning (40-Q Pace)", section: "DILR", suffix: "LR", qCount: 15, mins: 15, badge: "ROHTAK SEC 2 (+4/-1)", desc: "Coding-decoding, Blood Relations, Syllogisms, Clocks & Arrangements." },
        { title: "Rohtak Verbal Ability (40-Q Pace)", section: "VARC", suffix: "VA", qCount: 15, mins: 15, badge: "ROHTAK SEC 3 (+4/-1)", desc: "Grammar, Antonyms/Synonyms, Para-completion & Short RCs." },
        { title: "Rohtak 390+ High-Speed Sprint", section: "", suffix: "SPD", qCount: 20, mins: 20, badge: "ROHTAK 1-MIN/Q", desc: "20 questions in 20 minutes to build 90%+ accuracy under Rohtak clock." }
      ]
    },
    {
      key: "BODHGAYA",
      code: "IPM-BG",
      shortLabel: "IIM Bodh Gaya",
      subLabel: "5-Yr IPM",
      fullLabel: "IIM Bodh Gaya (5-Yr IPM)",
      campusName: "IIM Bodh Gaya (5-Yr IPM)",
      apiExam: "JIPMAT",
      pyqExamFilter: "JIPMAT",
      qCount: 30,
      mins: 40,
      pattern: "100 Qs (33 QA + 33 DILR + 34 VARC) | 150 Mins",
      marking: "MCQ +4/-1 | 100% JIPMAT Merit (No PI)",
      note: "Direct admission via NTA JIPMAT score (~315+/400 General) with zero interview stage.",
      practiceSections: [
        { title: "JIPMAT Quantitative Aptitude (33-Q)", section: "QUANT_MCQ", suffix: "QA", qCount: 15, mins: 22, badge: "NTA JIPMAT QA", desc: "Arithmetic, Ratios, Percentages, Time-Speed-Distance & Geometry." },
        { title: "JIPMAT DI & Logical Reasoning (33-Q)", section: "DILR", suffix: "DILR", qCount: 15, mins: 22, badge: "NTA JIPMAT DILR", desc: "Tables, Bar/Pie DI, Blood Relations, Series & Seating Puzzles." },
        { title: "JIPMAT VARC & Grammar (34-Q)", section: "VARC", suffix: "VARC", qCount: 15, mins: 20, badge: "NTA JIPMAT VARC", desc: "RC Passages, Idioms, Active/Passive, Error Spotting & Vocab." },
        { title: "Bodh Gaya 315+ Direct Merit Drill", section: "", suffix: "MERIT", qCount: 20, mins: 28, badge: "NO PI &bull; 100% CBT", desc: "Mixed JIPMAT simulation calibrated to Bodh Gaya Merit List 1." }
      ]
    },
    {
      key: "JAMMU",
      code: "IPM-JAM",
      shortLabel: "IIM Jammu",
      subLabel: "5-Yr IPM",
      fullLabel: "IIM Jammu (5-Yr IPM)",
      campusName: "IIM Jammu (5-Yr IPM)",
      apiExam: "JIPMAT",
      pyqExamFilter: "JIPMAT",
      qCount: 30,
      mins: 40,
      pattern: "100 Qs (33 QA + 33 DILR + 34 VARC) | 150 Mins",
      marking: "MCQ +4/-1 | JIPMAT Merit + Diversity Weight",
      note: "Direct admission via NTA JIPMAT score (~310+/400 General) plus gender diversity points.",
      practiceSections: [
        { title: "Jammu Speed Quant & Commercial Math", section: "QUANT_MCQ", suffix: "QA", qCount: 15, mins: 20, badge: "JAMMU QA SPRINT", desc: "High-accuracy Profit-Loss, SI/CI, Mixtures & Mensuration sets." },
        { title: "Jammu Analytical Puzzles & Caselet DI", section: "DILR", suffix: "DILR", qCount: 15, mins: 20, badge: "JAMMU DILR SPRINT", desc: "Rapid Venn Diagrams, Blood Relations, Directions & Table DI." },
        { title: "Jammu RC & Idiomatic Usage Drill", section: "VARC", suffix: "VARC", qCount: 15, mins: 18, badge: "JAMMU VARC SPRINT", desc: "Reading Comprehension, Sentence Improvement & Confusable Words." },
        { title: "IIM Jammu 310+ Merit List 1 Mock", section: "", suffix: "MERIT", qCount: 20, mins: 26, badge: "JAMMU MERIT LIST 1", desc: "20-Q calibrated JIPMAT sprint targeting IIM Jammu Merit List 1 cutoff." }
      ]
    },
    {
      key: "BANGALORE",
      code: "IPM-IIMB",
      shortLabel: "IIM Bangalore",
      subLabel: "B.Sc. / BBA",
      fullLabel: "IIM Bangalore (B.Sc. Econ/DS & BBA DBE)",
      campusName: "IIM Bangalore (B.Sc. Econ/DS & BBA DBE)",
      apiExam: "IIM",
      pyqExamFilter: "IIM Bangalore",
      qCount: 20,
      mins: 30,
      pattern: "60 Qs (Quant/Stats + Business DI + Verbal) | 90 Mins",
      marking: "MCQ +4/-1 | Class 12 Math Mandatory for B.Sc.",
      note: "Quantitative Economics, Data Science & Digital Business entrance (~235+/300) followed by PI.",
      practiceSections: [
        { title: "IIMB Higher Math, Stats & Calculus", section: "QUANT_MCQ", suffix: "MATH", qCount: 15, mins: 22, badge: "B.SC. ECON/DS CORE", desc: "Probability, Functions, Matrices, Calculus & Statistical Inference." },
        { title: "IIMB Business & Economics DI", section: "DILR", suffix: "BIZDI", qCount: 15, mins: 22, badge: "DIGITAL BUSINESS DI", desc: "Macroeconomic charts, Revenue/Funnel Analytics & Caselets." },
        { title: "IIMB Verbal & Critical Reasoning", section: "VARC", suffix: "CR", qCount: 15, mins: 20, badge: "CRITICAL REASONING", desc: "Argument analysis, Assumption/Inference & Policy Comprehension." },
        { title: "IIMB 235+ UG Entrance Sprint", section: "", suffix: "UG", qCount: 18, mins: 27, badge: "IIMB B.SC. / BBA", desc: "Combined Quantitative + Business DI + Verbal practice set." }
      ]
    },
    {
      key: "MUMBAI",
      code: "IPM-IIMM",
      shortLabel: "IIM Mumbai",
      subLabel: "4-Yr BS",
      fullLabel: "IIM Mumbai (4-Yr BS Digital & Supply Chain)",
      campusName: "IIM Mumbai (4-Yr BS Digital & Supply Chain)",
      apiExam: "IIM",
      pyqExamFilter: "IIM Mumbai & Lucknow",
      qCount: 20,
      mins: 30,
      pattern: "Higher Math, Analytics & Supply Chain Aptitude | 90 Mins",
      marking: "MCQ +4/-1 | Class 12 Math Mandatory",
      note: "Quantitative & analytical track (~96.0+%ile JEE / IPMAT equivalent) with Class 12 Mathematics.",
      practiceSections: [
        { title: "Higher Math & JEE Quantitative Bridge", section: "QUANT_MCQ", suffix: "HMATH", qCount: 15, mins: 22, badge: "IIMM QUANT & JEE BRIDGE", desc: "Permutations, Probability, Matrices, Calculus & Optimization." },
        { title: "Supply Chain & Queuing Analytics", section: "DILR", suffix: "SCM", qCount: 15, mins: 22, badge: "OPS & ANALYTICS", desc: "Network routing, Inventory ratios, Bottleneck DI & Logic." },
        { title: "Business VARC & Tech Comprehension", section: "VARC", suffix: "VA", qCount: 15, mins: 20, badge: "TECH-MGMT VARC", desc: "Analytical passages, Precision Grammar & Vocabulary." },
        { title: "IIM Mumbai 4-Yr BS Readiness Set", section: "", suffix: "BS", qCount: 18, mins: 27, badge: "IIMM TECH-MGMT", desc: "Calibrated practice drill for IIM Mumbai BS Digital & Supply Chain." }
      ]
    },
    {
      key: "LUCKNOW",
      code: "IPM-IIML",
      shortLabel: "IIM Lucknow",
      subLabel: "4-Yr Tech-Mgmt",
      fullLabel: "IIM Lucknow (4-Yr Tech-Mgmt UG)",
      campusName: "IIM Lucknow (4-Yr Tech-Mgmt UG)",
      apiExam: "IIM",
      pyqExamFilter: "IIM Mumbai & Lucknow",
      qCount: 20,
      mins: 30,
      pattern: "Higher Math, Decision Analytics & VARC | 90 Mins",
      marking: "MCQ +4/-1 | 85%+ Class 10/12 + Math",
      note: "Combines strong Class 10/12 academic rigor (85%+) with quantitative and leadership PI.",
      practiceSections: [
        { title: "Decision Math & Quantitative Rigor", section: "QUANT_MCQ", suffix: "QMATH", qCount: 15, mins: 22, badge: "IIML QUANT CORE", desc: "Functions, Inequalities, Combinatorics, Stats & Algebra." },
        { title: "Hypothesis & Business Data Logic", section: "DILR", suffix: "DL", qCount: 15, mins: 22, badge: "DECISION ANALYTICS", desc: "Multi-variable tables, Logical deduction & Caselet DI." },
        { title: "VARC & Editorial Comprehension", section: "VARC", suffix: "VA", qCount: 15, mins: 20, badge: "IIML VERBAL", desc: "Editorial RC, Critical Reasoning & Vocabulary precision." },
        { title: "IIM Lucknow UG Composite Sprint", section: "", suffix: "UG", qCount: 18, mins: 27, badge: "IIML TECH-MGMT", desc: "Unified Quant + Analytics + VARC drill for IIM Lucknow UG." }
      ]
    }
  ];

  window.getActiveIpmModeSpec = function () {
    return INDIVIDUAL_IIM_MODES.find(m => m.key === window.ACTIVE_IIM_KEY) || INDIVIDUAL_IIM_MODES[0];
  };

  const LEGACY_MODE_MAP = {
    ALL: "ALL_IIMS",
    INDORE: "IPMAT_INDORE",
    RANCHI: "IPMAT_INDORE",
    ROHTAK: "IPMAT_ROHTAK",
    BODHGAYA: "JIPMAT",
    JAMMU: "JIPMAT",
    BANGALORE: "IIMB_UG",
    MUMBAI: "IIMM_IIML_UG",
    LUCKNOW: "IIMM_IIML_UG"
  };

  window.selectIndividualIimMode = function (key) {
    window.ACTIVE_IIM_KEY = key;
    const legacyId = LEGACY_MODE_MAP[key] || "ALL_IIMS";
    if (window.IPM_STATE) {
      window.IPM_STATE.mode = legacyId;
      window.IPM_STATE.selectedQuantId = null;
      window.IPM_STATE.selectedDilrId = null;
      window.IPM_STATE.selectedVarcId = null;
    }
    const spec = window.getActiveIpmModeSpec();
    if (spec && spec.pyqExamFilter) {
      window.PYQ_EXAM_FILTER = spec.pyqExamFilter;
      if (spec.pyqExamFilter !== "ALL" && spec.pyqExamFilter !== "IPMAT Indore" && window.PYQ_YEAR_FILTER === "ARCHIVE_2019_2021") {
        window.PYQ_YEAR_FILTER = "ALL";
      }
      if (spec.pyqExamFilter === "IIM Bangalore" && ["2022", "2023"].includes(window.PYQ_YEAR_FILTER)) {
        window.PYQ_YEAR_FILTER = "ALL";
      }
      if (spec.pyqExamFilter === "IIM Mumbai & Lucknow" && ["2022", "2023", "2024"].includes(window.PYQ_YEAR_FILTER)) {
        window.PYQ_YEAR_FILTER = "ALL";
      }
    }
    renderIndividualIimBar();
    if (typeof window.renderActiveTab === "function") window.renderActiveTab();
  };

  function renderIndividualIimBar() {
    const pillsEl = document.getElementById("exam-mode-pills");
    const bannerEl = document.getElementById("exam-meta-banner");
    const spec = window.getActiveIpmModeSpec();

    if (pillsEl) {
      pillsEl.innerHTML = INDIVIDUAL_IIM_MODES.map(m => {
        const active = m.key === spec.key;
        return `
          <button type="button" onclick="window.selectIndividualIimMode('${m.key}')"
            class="px-3 py-1.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
              active
                ? "bg-indigo-600 border-indigo-400 text-white shadow-md"
                : "bg-slate-900/90 border-slate-700 text-slate-300 hover:border-indigo-400"
            }">
            ${m.shortLabel} <span class="text-[10px] opacity-80 font-semibold">(${m.subLabel})</span>
          </button>
        `;
      }).join("");
    }

    if (bannerEl) {
      bannerEl.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span class="font-extrabold text-indigo-400">Active Campus Focus:</span>
            <span class="font-bold text-white">${spec.fullLabel}</span>
            <span class="ml-2 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">${spec.code}</span>
          </div>
          <div class="font-semibold text-emerald-400">Pattern: ${spec.pattern}</div>
          <div class="font-semibold text-amber-400">Marking: ${spec.marking}</div>
        </div>
        <p class="text-[11px] text-slate-400 mt-1">${spec.note}</p>
      `;
    }
  }

  window.renderExamModePills = renderIndividualIimBar;
  window.renderExamMetaBanner = renderIndividualIimBar;
  setTimeout(renderIndividualIimBar, 60);
  setInterval(() => {
    const pillsEl = document.getElementById("exam-mode-pills");
    if (pillsEl && pillsEl.children.length !== INDIVIDUAL_IIM_MODES.length) {
      renderIndividualIimBar();
    }
  }, 600);

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

  function generateModeSerialId(prefixCode) {
    const now = new Date();
    const ymd = now.getFullYear().toString()
      + String(now.getMonth() + 1).padStart(2, "0")
      + String(now.getDate()).padStart(2, "0");
    const hist = getMockHistory();
    const samePrefix = hist.filter(h => String(h.serialId || "").startsWith(`${prefixCode}-${ymd}`));
    const attemptNum = String(samePrefix.length + 1).padStart(2, "0");
    return `${prefixCode}-${ymd}-#${attemptNum}`;
  }

  // Fixed: Never falsely label a 0% section as a Strength
  function computeStrengthAndDeficiency(secStats) {
    const entries = Object.entries(secStats || {}).filter(([, v]) => v.total > 0);
    if (!entries.length) {
      return {
        strengths: ["No sectional responses recorded yet"],
        deficiencies: ["Attempt questions across all sections to diagnose gaps"],
        secSummary: "General Composite"
      };
    }
    const ranked = entries.map(([sec, v]) => ({
      sec,
      acc: Math.round((v.correct / v.total) * 100),
      attempted: v.correct + v.wrong,
      score: v.score,
      max: v.total * 4
    })).sort((a, b) => b.acc - a.acc);

    const strengths = ranked
      .filter(r => r.attempted > 0 && r.acc >= 60)
      .map(r => `${r.sec} (${r.acc}% acc, ${r.score}/${r.max})`);

    const deficiencies = ranked
      .filter(r => r.acc < 60)
      .map(r => `${r.sec} (${r.acc}% acc, ${r.score}/${r.max})`);

    if (!strengths.length) {
      const topPos = ranked.find(r => r.score > 0);
      strengths.push(
        topPos
          ? `${topPos.sec} (${topPos.acc}% â€” build above 70% for call safety)`
          : "No section &ge;60% yet â€” focus on accuracy & eliminating negative-marking guesses"
      );
    }

    return {
      strengths,
      deficiencies: deficiencies.length ? deficiencies : ["All sections &ge;60% â€” tighten speed & negative-marking control"],
      secSummary: ranked.map(r => `${r.sec}: ${r.score}/${r.max}`).join(" &bull; ")
    };
  }

  // Exit Without Submission (Discard test cleanly without logging score or burning quota)
  window.exitIpmMockWithoutSubmission = function () {
    const ok = window.confirm("Exit without submission? Your current answers will be discarded, no Serial ID will be logged, and your mock attempt will not be counted.");
    if (!ok) return;
    if (window.PG_MOCK && window.PG_MOCK.timerId) clearInterval(window.PG_MOCK.timerId);
    window.PG_MOCK = {
      started: false,
      submitted: false,
      isPractice: false,
      title: "",
      questions: [],
      currentIndex: 0,
      answers: {},
      secondsLeft: 0,
      timerId: null
    };
    window.renderActiveTab();
  };

  // Download Official Scorecard & Full Answer Key (HTML / Print-to-PDF)
  window.downloadIpmMockScorecard = function (serialIdOverride) {
    const hist = getMockHistory();
    const rec = hist.find(h => h.serialId === serialIdOverride) || hist[hist.length - 1];
    const qs = (window.PG_MOCK && Array.isArray(window.PG_MOCK.questions) && window.PG_MOCK.questions.length)
      ? window.PG_MOCK.questions
      : [];
    const ansMap = (window.PG_MOCK && window.PG_MOCK.answers) || {};
    const serial = (rec && rec.serialId) || (window.PG_MOCK && window.PG_MOCK.serialId) || "IPM-SCORECARD";
    const title = (rec && rec.title) || (window.PG_MOCK && window.PG_MOCK.title) || "GOALisB IIM UG & IPM Diagnostic Mock";
    const userObj = JSON.parse(localStorage.getItem("ipm_user_profile") || localStorage.getItem("goalisb_user") || "{}");
    const studentName = userObj.name || userObj.email || "GOALisB Aspirant";

    const rowsHtml = qs.map((q, idx) => {
      const hasOpts = Array.isArray(q.options) && q.options.length > 0;
      const u = ansMap[q.id];
      const uLabel = (u === undefined || String(u).trim() === "")
        ? "Unattempted"
        : hasOpts ? `${String.fromCharCode(65 + Number(u))}. ${q.options[Number(u)] || ""}` : String(u);
      const cLabel = hasOpts ? `${String.fromCharCode(65 + Number(q.answer))}. ${q.options[Number(q.answer)] || ""}` : String(q.answer);
      return `
        <div style="border:1px solid #cbd5e1;border-radius:10px;padding:12px;margin-bottom:10px;">
          <div style="font-weight:700;color:#1e293b;">Q${idx + 1}. [${q.section || "IPM"}] ${q.prompt}</div>
          <div style="margin-top:6px;font-size:13px;"><strong>Your Response:</strong> ${uLabel} &nbsp;|&nbsp; <strong style="color:#047857;">Official Answer:</strong> ${cLabel}</div>
          <div style="margin-top:4px;font-size:12px;color:#334155;"><strong>Solution:</strong> ${q.explanation || ""}</div>
        </div>
      `;
    }).join("");

    const docHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${serial} - GOALisB Official Scorecard</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:900px;margin:24px auto;padding:0 16px;color:#0f172a;">
  <div style="border-bottom:2px solid #4f46e5;padding-bottom:12px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <div style="font-size:11px;font-weight:800;color:#4f46e5;text-transform:uppercase;">GOALisB IIM UG &amp; IPM Master Engine &bull; Official Diagnostic Dossier</div>
      <h1 style="margin:4px 0;font-size:20px;">${title}</h1>
      <div style="font-size:12px;color:#475569;">Candidate: <strong>${studentName}</strong> &bull; Serial ID: <strong>${serial}</strong> &bull; Date: ${(rec && rec.date) || new Date().toLocaleDateString()}</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;text-align:center;">
    <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:10px;"><div style="font-size:11px;color:#64748b;">Net Score</div><div style="font-size:18px;font-weight:800;color:#047857;">${rec ? rec.score : 0} / ${rec ? rec.maxScore : 0}</div></div>
    <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:10px;"><div style="font-size:11px;color:#64748b;">Accuracy</div><div style="font-size:18px;font-weight:800;color:#4f46e5;">${rec ? rec.accuracyPct : 0}%</div></div>
    <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:10px;"><div style="font-size:11px;color:#64748b;">Correct / Wrong</div><div style="font-size:18px;font-weight:800;">${rec ? rec.correct : 0}C / ${rec ? rec.wrong : 0}W</div></div>
    <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:10px;"><div style="font-size:11px;color:#64748b;">Serial ID</div><div style="font-size:12px;font-weight:800;color:#b45309;padding-top:4px;">${serial}</div></div>
  </div>
  <div style="margin-bottom:18px;padding:12px;background:#f1f5f9;border-radius:10px;font-size:13px;">
    <div><strong>Gauged Strengths:</strong> ${rec ? (rec.strengths || []).join(" &bull; ") : "-"}</div>
    <div style="margin-top:4px;"><strong>Gauged Deficiencies:</strong> ${rec ? (rec.deficiencies || []).join(" &bull; ") : "-"}</div>
  </div>
  ${rowsHtml ? `<h2 style="font-size:16px;margin-bottom:10px;">Question-by-Question Answer Key &amp; Solutions</h2>${rowsHtml}` : ""}
</body></html>`;

    const blob = new Blob([docHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${serial}_Scorecard.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  window.setIpmPaperTier = function (tier) {
    window.IPM_PAPER_TIER = tier;
    window.renderActiveTab();
  };

  window.launchIpmUnifiedMock = async function (opts) {
    const spec = window.getActiveIpmModeSpec();
    const isPractice = Boolean(opts && opts.isPractice);
    if (!isPractice && !window.IPM_HONOR_CHECKED) {
      alert("Please tick the Candidate Honor-Code Declaration checkbox before starting a proctored full mock.");
      return;
    }
    const modeCode = (opts && opts.modeCode) || (isPractice ? `PRAC-${spec.code}` : spec.code);
    const apiExam = (opts && opts.apiExam) || spec.apiExam;
    const sectionFilter = (opts && opts.section) || "";
    const qCount = (opts && opts.qCount) || spec.qCount;
    const title = (opts && opts.title) || `${spec.fullLabel} (${qCount} Qs &bull; ${window.IPM_PAPER_TIER})`;

    try {
      const params = new URLSearchParams({ limit: String(qCount), t: String(Date.now()) });
      if (apiExam && apiExam !== "ALL") params.set("exam", apiExam);
      if (sectionFilter) params.set("section", sectionFilter);
      let res = await fetch(`/api/questions?${params.toString()}`);
      let data = await res.json();
      if ((!Array.isArray(data.questions) || data.questions.length < 4) && sectionFilter) {
        res = await fetch(`/api/questions?section=${encodeURIComponent(sectionFilter)}&limit=${qCount}&t=${Date.now()}`);
        data = await res.json();
      }
      if (!Array.isArray(data.questions) || data.questions.length < 4) {
        res = await fetch(`/api/questions?exam=ALL&limit=${qCount}&t=${Date.now()}`);
        data = await res.json();
      }
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        const serialId = generateModeSerialId(modeCode);
        window.PG_MOCK = {
          started: true,
          submitted: false,
          isPractice: isPractice,
          serialId: serialId,
          modeCode: modeCode,
          campusKey: spec.key,
          paperTier: window.IPM_PAPER_TIER,
          title: title,
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
      alert("Error loading mock items: " + e.message);
    }
  };

  window.submitPgMock = function () {
    if (!window.PG_MOCK || window.PG_MOCK.submitted) return;
    if (window.PG_MOCK.timerId) clearInterval(window.PG_MOCK.timerId);

    const qs = window.PG_MOCK.questions || [];
    let score = 0, maxScore = qs.length * 4, correct = 0, wrong = 0, skipped = 0;
    const secStats = {};

    qs.forEach(q => {
      const u = window.PG_MOCK.answers[q.id];
      const hasOpts = Array.isArray(q.options) && q.options.length > 0;
      const rawSec = String(q.section || (hasOpts ? "QUANT_MCQ" : "QUANT_SA")).toUpperCase();
      const bucket = rawSec.includes("SA") ? "QA-SA"
        : rawSec.includes("DILR") ? "DILR"
        : rawSec.includes("VARC") ? "VARC"
        : rawSec.includes("HIGH") ? "Higher Math"
        : "QA-MCQ";

      if (!secStats[bucket]) secStats[bucket] = { total: 0, correct: 0, wrong: 0, score: 0 };
      secStats[bucket].total++;

      if (u === undefined || u === null || String(u).trim() === "") {
        skipped++;
      } else if (hasOpts ? Number(u) === Number(q.answer) : String(u).trim().toLowerCase() === String(q.answer).trim().toLowerCase()) {
        correct++;
        score += 4;
        secStats[bucket].correct++;
        secStats[bucket].score += 4;
      } else {
        wrong++;
        secStats[bucket].wrong++;
        if (hasOpts) {
          score -= 1;
          secStats[bucket].score -= 1;
        }
      }
    });

    const spec = window.getActiveIpmModeSpec();
    const isPractice = Boolean(window.PG_MOCK.isPractice);
    const defaultPrefix = isPractice ? `PRAC-${spec.code}` : spec.code;
    const serialId = window.PG_MOCK.serialId || generateModeSerialId(defaultPrefix);
    window.PG_MOCK.serialId = serialId;
    window.PG_MOCK.submitted = true;

    const diag = computeStrengthAndDeficiency(secStats);

    saveMockAttemptToLedger({
      serialId: serialId,
      isPractice: isPractice,
      modeCode: window.PG_MOCK.modeCode || defaultPrefix,
      campusKey: window.PG_MOCK.campusKey || spec.key,
      title: window.PG_MOCK.title || spec.fullLabel,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      score: score,
      maxScore: maxScore,
      correct: correct,
      wrong: wrong,
      skipped: skipped,
      accuracyPct: Math.round((correct / Math.max(1, correct + wrong)) * 100),
      secStats: secStats,
      strengths: diag.strengths,
      deficiencies: diag.deficiencies,
      secSummary: diag.secSummary
    });

    window.renderActiveTab();
  };

  function renderActiveOrSubmittedMockRunner(el, returnTabLabel) {
    const spec = window.getActiveIpmModeSpec();
    const qs = window.PG_MOCK.questions || [];

    if (window.PG_MOCK.submitted) {
      const latest = getMockHistory().slice(-1)[0] || {};
      el.innerHTML = `
        <div class="space-y-4">
          <div class="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-6 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span class="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-extrabold">${latest.serialId || window.PG_MOCK.serialId}</span>
                <h2 class="text-lg font-bold text-white mt-1">Diagnostic Scorecard: ${window.PG_MOCK.title}</h2>
              </div>
              <div class="flex flex-wrap gap-2">
                <button type="button" onclick="window.downloadIpmMockScorecard('${latest.serialId || ""}')"
                  class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white shadow cursor-pointer">
                  &#11015;&#65039; Download Scorecard &amp; Solutions
                </button>
                <button type="button" onclick="window.syncSpecificIpmMockToTab7('${latest.serialId || ""}')"
                  class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white shadow cursor-pointer">
                  &#8635; Sync to Tab 7 Forecaster &rarr;
                </button>
                <button type="button" onclick="window.exitPgMock()"
                  class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer">
                  &larr; Back to ${returnTabLabel}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800"><div class="text-xs text-slate-400">Net Score</div><div class="text-xl font-extrabold text-emerald-400">${latest.score ?? 0} / ${latest.maxScore ?? qs.length * 4}</div></div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800"><div class="text-xs text-slate-400">Accuracy</div><div class="text-xl font-extrabold text-indigo-300">${latest.accuracyPct ?? 0}%</div></div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800"><div class="text-xs text-slate-400">Correct / Wrong / Skip</div><div class="text-lg font-extrabold text-white">${latest.correct ?? 0}C / ${latest.wrong ?? 0}W / ${latest.skipped ?? 0}S</div></div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800"><div class="text-xs text-slate-400">Logged Serial ID</div><div class="text-xs font-mono font-extrabold text-amber-300 pt-1.5">${latest.serialId || "LOGGED"}</div></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div class="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-700/40">
                <div class="font-extrabold text-emerald-300 uppercase text-[10px] mb-1">&#9989; Gauged Strengths</div>
                <div class="text-emerald-100">${(latest.strengths || []).join(" &bull; ")}</div>
              </div>
              <div class="p-3.5 rounded-xl bg-rose-950/30 border border-rose-700/40">
                <div class="font-extrabold text-rose-300 uppercase text-[10px] mb-1">&#9888;&#65039; Gauged Deficiencies &amp; Focus Areas</div>
                <div class="text-rose-100">${(latest.deficiencies || []).join(" &bull; ")}</div>
              </div>
            </div>
          </div>

          <!-- FULL QUESTION-BY-QUESTION ANSWER KEY & STEP-BY-STEP SOLUTIONS -->
          <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 class="text-sm font-extrabold text-white">Question-by-Question Answer Key &amp; Step-by-Step Solutions (${qs.length} Questions)</h3>
            <div class="space-y-3">
              ${qs.map((q, idx) => {
                const u = window.PG_MOCK.answers[q.id];
                const hasOpts = Array.isArray(q.options) && q.options.length > 0;
                const attempted = u !== undefined && String(u).trim() !== "";
                const isRight = attempted && (hasOpts ? Number(u) === Number(q.answer) : String(u).trim().toLowerCase() === String(q.answer).trim().toLowerCase());
                const uDisp = !attempted ? "Unattempted (0)" : hasOpts ? `${String.fromCharCode(65 + Number(u))} (${q.options[Number(u)] || ""})` : String(u);
                const cDisp = hasOpts ? `${String.fromCharCode(65 + Number(q.answer))} (${q.options[Number(q.answer)] || ""})` : String(q.answer);
                return `
                  <div class="p-4 rounded-xl bg-slate-950 border ${isRight ? "border-emerald-500/40" : attempted ? "border-rose-500/40" : "border-slate-800"} space-y-1.5 text-xs">
                    <div class="flex flex-wrap items-center justify-between gap-2 font-bold">
                      <span class="text-indigo-300">Q${idx + 1}. ${q.section || q.exam || "IPM"} ${q.topic ? "&bull; " + q.topic : ""}</span>
                      <span class="${isRight ? "text-emerald-400" : attempted ? "text-rose-400" : "text-slate-400"}">${isRight ? "+4 Correct" : attempted ? (hasOpts ? "-1 Incorrect" : "0 SA Incorrect") : "0 Skipped"}</span>
                    </div>
                    <p class="text-slate-100 text-sm whitespace-pre-line">${q.prompt}</p>
                    <div class="pt-1 text-slate-300"><strong>Your Response:</strong> ${uDisp} &nbsp;|&nbsp; <strong class="text-emerald-300">Official Answer:</strong> ${cDisp}</div>
                    <div class="text-slate-300"><strong>Step-by-Step Solution:</strong> ${q.explanation}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Active Mock Question Runner with clear Submit AND Exit Without Submission controls
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
          <div class="flex flex-wrap items-center gap-2.5">
            <span id="pgMockClock" class="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-extrabold text-sm">${m}:${s}</span>
            <button type="button" onclick="window.submitPgMock()" class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow cursor-pointer">
              &#10003; Submit &amp; Generate Scorecard
            </button>
            <button type="button" onclick="window.exitIpmMockWithoutSubmission()" class="px-3.5 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-bold cursor-pointer">
              &times; Exit Without Submission
            </button>
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
  }

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

  // TAB 4: Proctored Full Mock Simulator (Full Suite Parity Lobby + Serial ID Ledger)
  window.renderTab4 = function (el) {
    if (window.PG_MOCK && window.PG_MOCK.started && !window.PG_MOCK.isPractice) {
      renderActiveOrSubmittedMockRunner(el, "Proctored Mock Lobby");
      return;
    }

    const spec = window.getActiveIpmModeSpec();
    const nextSerial = generateModeSerialId(spec.code);
    const fullHist = getMockHistory().filter(h => !h.isPractice).slice().reverse();

    const tiers = [
      { id: "TOUGH", title: "Tough Paper (+15 Eq.)", desc: "IIM Indore / IIMB Top-100 Discriminator Weighting" },
      { id: "STANDARD", title: "Standard IIM Paper (0 Eq.)", desc: "Balanced Multi-Tier Official Blueprint" },
      { id: "HIGH_CUTOFF", title: "High-Cutoff Paper (-10 Eq.)", desc: "High-Speed Accuracy / Inflated Cutoff Simulation" }
    ];

    el.innerHTML = `
      <div class="space-y-4">
        <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase">PROCTORED CBT MOCK &bull; READY TO LAUNCH</span>
                <span class="text-xs font-mono font-bold text-slate-400">Next Serial ID: <strong class="text-amber-300">${nextSerial}</strong></span>
              </div>
              <h2 class="text-xl font-extrabold text-white mt-1">1. ${spec.fullLabel} (${spec.qCount} Qs &bull; ${spec.mins} Mins)</h2>
              <p class="text-xs text-slate-400 mt-0.5">Select the Paper Difficulty / Shift Tier below. Both the question mix and your calibrated call projections in Tab 7 corroborate your chosen level.</p>
            </div>
            <button type="button" onclick="window.launchIpmUnifiedMock({ isPractice: false, modeCode: '${spec.code}', apiExam: '${spec.apiExam}', qCount: ${spec.qCount}, title: '${spec.fullLabel} (${spec.qCount} Qs)' })"
              class="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-extrabold shadow-lg cursor-pointer transition">
              &#9654; Start Proctored Full Mock (${spec.mins} Mins)
            </button>
          </div>

          <!-- PAPER DIFFICULTY / SHIFT CALIBRATION TIER -->
          <div class="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5">
            <div class="flex items-center justify-between text-[11px]">
              <span class="font-extrabold uppercase tracking-wider text-indigo-400">SELECT PAPER DIFFICULTY / SHIFT CALIBRATION TIER</span>
              <span class="text-slate-400">Syncs directly with Tab 7 Call Forecaster</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              ${tiers.map(t => {
                const active = window.IPM_PAPER_TIER === t.id;
                return `
                  <button type="button" onclick="window.setIpmPaperTier('${t.id}')"
                    class="text-left p-3.5 rounded-xl border-2 transition cursor-pointer ${
                      active ? "bg-indigo-600/20 border-indigo-500 text-white" : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }">
                    <div class="text-xs font-extrabold">${t.title}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">${t.desc}</div>
                  </button>
                `;
              }).join("")}
            </div>
          </div>

          <!-- 4-CARD SUMMARY STRIP (MATCHING NEET/CAT/JEE SUITE) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div class="text-[10px] font-bold uppercase text-slate-400">QUESTION COUNT</div>
              <div class="text-sm font-extrabold text-white mt-1">${spec.qCount} Compulsory Qs</div>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div class="text-[10px] font-bold uppercase text-slate-400">SELECTED PAPER TIER</div>
              <div class="text-sm font-extrabold text-indigo-300 mt-1">${tiers.find(t => t.id === window.IPM_PAPER_TIER)?.title || "Standard"}</div>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div class="text-[10px] font-bold uppercase text-slate-400">LEDGER POLICY</div>
              <div class="text-sm font-extrabold text-amber-300 mt-1">Full Mocks Only (Tab 5 = Free)</div>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div class="text-[10px] font-bold uppercase text-slate-400">POSTGRESQL BANK</div>
              <div class="text-sm font-extrabold text-emerald-300 mt-1">342+ Live Items</div>
            </div>
          </div>

          <!-- CANDIDATE HONOR-CODE DECLARATION -->
          <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs">
            <input id="ipm-honor-chk" type="checkbox" ${window.IPM_HONOR_CHECKED ? "checked" : ""} onchange="window.IPM_HONOR_CHECKED = this.checked">
            <label for="ipm-honor-chk" class="text-slate-300">
              <strong>Candidate Honor-Code Declaration:</strong> I confirm that I am attempting Serial ID <strong class="font-mono text-amber-300">${nextSerial}</strong> (${spec.fullLabel}) under proctored conditions (${spec.marking}).
            </label>
          </div>
        </div>

        <!-- PROCTORED MOCK SERIAL ID & STRENGTH/DEFICIENCY LEDGER -->
        <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="text-sm font-extrabold text-white">Proctored Mock Attempt Log &amp; Sectional Strength/Deficiency Ledger (${fullHist.length})</h3>
              <p class="text-[11px] text-slate-400">Download official scorecards or sync any Serial ID directly to Tab 7 Forecaster.</p>
            </div>
            <button type="button" onclick="window.switchTab('tab7')" class="px-3 py-1.5 rounded-xl bg-indigo-600/25 border border-indigo-500/40 text-indigo-300 text-xs font-bold cursor-pointer">
              Open Tab 7 Forecaster &rarr;
            </button>
          </div>

          ${fullHist.length ? `
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <th class="py-2 pr-2">Serial ID</th>
                    <th class="py-2 px-2">Campus Track</th>
                    <th class="py-2 px-2">Score &amp; Acc</th>
                    <th class="py-2 px-2">Strengths &amp; Deficiencies</th>
                    <th class="py-2 pl-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/70">
                  ${fullHist.map(h => `
                    <tr>
                      <td class="py-2.5 pr-2 font-mono font-bold text-amber-300">${h.serialId}</td>
                      <td class="py-2.5 px-2 text-white font-semibold">${h.title}<div class="text-[10px] text-slate-400">${h.date || "Today"}</div></td>
                      <td class="py-2.5 px-2 font-bold text-emerald-300">${h.score}/${h.maxScore} (${h.accuracyPct || 0}%)</td>
                      <td class="py-2.5 px-2 text-[11px]">
                        <div class="text-emerald-300"><strong>+</strong> ${(h.strengths || []).join(", ")}</div>
                        <div class="text-rose-300"><strong>-</strong> ${(h.deficiencies || []).join(", ")}</div>
                      </td>
                      <td class="py-2.5 pl-2 text-right space-x-1.5">
                        <button type="button" onclick="window.downloadIpmMockScorecard('${h.serialId}')"
                          class="px-2.5 py-1 rounded-lg bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold cursor-pointer">
                          &#11015; Scorecard
                        </button>
                        <button type="button" onclick="window.syncSpecificIpmMockToTab7('${h.serialId}')"
                          class="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-extrabold cursor-pointer">
                          Sync Tab 7 &rarr;
                        </button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : `<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">No proctored mocks logged yet. Complete a mock above to generate <code class="text-amber-300">${nextSerial}</code>.</div>`}
        </div>
      </div>
    `;
  };

  // TAB 5: Dedicated Practice Mock & Sectional Sprints (100% Free & Unlimited)
  window.renderTab5 = function (el) {
    if (window.PG_MOCK && window.PG_MOCK.started && window.PG_MOCK.isPractice) {
      renderActiveOrSubmittedMockRunner(el, "Practice Mock Lobby");
      return;
    }

    const spec = window.getActiveIpmModeSpec();
    const hasStagedPyq = window.PG_MOCK && !window.PG_MOCK.started && Array.isArray(window.PG_MOCK.questions) && window.PG_MOCK.questions.length > 0;
    const pracHist = getMockHistory().filter(h => h.isPractice).slice().reverse();

    const sectionalCards = (spec.practiceSections || []).map(s => ({
      title: s.title,
      section: s.section,
      apiExam: spec.apiExam,
      code: `PRAC-${spec.code}-${s.suffix}`,
      qCount: s.qCount,
      mins: s.mins,
      badge: s.badge,
      desc: s.desc
    }));

    el.innerHTML = `
      <div class="space-y-4">
        <div class="bg-slate-900/95 border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-lg">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-lg font-bold text-white">Practice Mock &amp; Sectional Sprints &bull; ${spec.shortLabel}</h2>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">100% FREE &amp; UNLIMITED</span>
                <span class="px-2.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px] font-bold">PRAC-${spec.code}-YYYYMMDD-#NN</span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">Unlimited sectional practice mocks and PYQ drills with downloadable scorecards and instant Strength &amp; Deficiency diagnostics.</p>
            </div>
          </div>

          ${hasStagedPyq ? `
            <div class="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/50 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="text-[10px] font-extrabold uppercase text-indigo-300">Staged from Tab 6 PYQ Vault</div>
                <div class="text-sm font-bold text-white">${window.PG_MOCK.title} (${window.PG_MOCK.questions.length} Qs)</div>
              </div>
              <div class="flex gap-2">
                <button type="button" onclick="window.PG_MOCK.isPractice = true; window.PG_MOCK.serialId = '${generateModeSerialId("PRAC-" + spec.code)}'; window.startStagedPgMock()"
                  class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer">
                  Start Staged PYQ Practice Mock &rarr;
                </button>
                <button type="button" onclick="window.exitPgMock()" class="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer">Clear</button>
              </div>
            </div>
          ` : ""}

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            ${sectionalCards.map(c => `
              <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div class="space-y-1.5">
                  <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-extrabold">${c.badge}</span>
                  <div class="text-sm font-bold text-white pt-1">${c.title}</div>
                  <div class="text-[11px] font-semibold text-indigo-300">${c.qCount} Qs &bull; ${c.mins} Mins</div>
                  <p class="text-[11px] text-slate-400">${c.desc}</p>
                </div>
                <button type="button" onclick="window.launchIpmUnifiedMock({ isPractice: true, modeCode: '${c.code}', apiExam: '${c.apiExam}', section: '${c.section}', qCount: ${c.qCount}, title: '${c.title} (${spec.shortLabel})' })"
                  class="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer">
                  Start Practice Sprint &rarr;
                </button>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 class="text-sm font-extrabold text-white">Practice Mock &amp; Sectional Drill Log (${pracHist.length})</h3>
          ${pracHist.length ? `
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <th class="py-2 pr-2">Practice Serial ID</th>
                    <th class="py-2 px-2">Drill Module</th>
                    <th class="py-2 px-2">Score &amp; Acc</th>
                    <th class="py-2 px-2">Strengths &amp; Deficiencies</th>
                    <th class="py-2 pl-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/70">
                  ${pracHist.map(h => `
                    <tr>
                      <td class="py-2 pr-2 font-mono font-bold text-emerald-300">${h.serialId}</td>
                      <td class="py-2 px-2 text-white font-semibold">${h.title}</td>
                      <td class="py-2 px-2 font-bold text-indigo-300">${h.score}/${h.maxScore} (${h.accuracyPct || 0}%)</td>
                      <td class="py-2 px-2 text-[11px]">
                        <span class="text-emerald-300"><strong>+</strong> ${(h.strengths || []).join(", ")}</span> &bull;
                        <span class="text-rose-300"><strong>-</strong> ${(h.deficiencies || []).join(", ")}</span>
                      </td>
                      <td class="py-2 pl-2 text-right space-x-1.5">
                        <button type="button" onclick="window.downloadIpmMockScorecard('${h.serialId}')"
                          class="px-2 py-1 rounded-lg bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold cursor-pointer">
                          &#11015; Scorecard
                        </button>
                        <button type="button" onclick="window.syncSpecificIpmMockToTab7('${h.serialId}')"
                          class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white text-[10px] font-bold cursor-pointer">
                          Sync Tab 7
                        </button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : `<div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">No practice sprints completed yet. Launch any sectional drill above to log <code class="text-emerald-300">PRAC-${spec.code}-YYYYMMDD-#01</code>.</div>`}
        </div>
      </div>
    `;
  };

  window.startCustomPyqMock = function (questions, title) {
    if (!Array.isArray(questions) || !questions.length) return;
    if (window.PG_MOCK && window.PG_MOCK.timerId) clearInterval(window.PG_MOCK.timerId);
    window.PG_MOCK = {
      started: false,
      submitted: false,
      isPractice: true,
      title: title || `Filtered PYQ Practice Set (${questions.length} Qs)`,
      questions: questions,
      currentIndex: 0,
      answers: {},
      secondsLeft: Math.max(300, questions.length * 90),
      timerId: null
    };
    window.switchTab("tab5");
  };

  window.renderTab6 = function (el) {
    const spec = window.getActiveIpmModeSpec();
    if (typeof origRenderTab9Pyq === "function") {
      origRenderTab9Pyq(el);
      setTimeout(() => {
        el.querySelectorAll("button").forEach(b => {
          if (/Practice Filtered Set/i.test(b.textContent || "")) {
            b.textContent = "Practice Filtered Set in Tab 5 Practice Mock â†’";
          }
        });
        const hdr = el.querySelector("h2");
        if (hdr && !el.querySelector(".ipm-pyq-mode-pill")) {
          const badge = document.createElement("span");
          badge.className = "ipm-pyq-mode-pill ml-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold";
          badge.textContent = `Synced to Top Mode: ${spec.shortLabel} (${window.PYQ_EXAM_FILTER})`;
          hdr.appendChild(badge);
        }
      }, 30);
    }
  };

  // TAB 7: Individual 8-IIM Call & Target Forecaster
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
    syncedRecord: null
  };

  function applyMockRecordToT7State(rec) {
    if (!rec) return;
    const ratio = Math.min(1, Math.max(0.15, Number(rec.score || 0) / Math.max(1, Number(rec.maxScore || 120))));
    const cKey = String(rec.campusKey || "").toUpperCase();
    window.IPM_T7_STATE.syncedRecord = rec;

    if (cKey === "ROHTAK") {
      window.IPM_T7_STATE.rohtak = Math.round(480 * ratio);
    } else if (cKey === "BODHGAYA" || cKey === "JAMMU") {
      window.IPM_T7_STATE.jipmat = Math.round(400 * ratio);
    } else if (cKey === "BANGALORE") {
      window.IPM_T7_STATE.iimbUg = Math.round(300 * ratio);
    } else if (cKey === "MUMBAI" || cKey === "LUCKNOW") {
      window.IPM_T7_STATE.jeePct = +(88 + 11.5 * ratio).toFixed(1);
    } else {
      window.IPM_T7_STATE.indSa = Math.round(60 * ratio);
      window.IPM_T7_STATE.indMcq = Math.round(120 * ratio);
      window.IPM_T7_STATE.indVa = Math.round(180 * ratio);
      if (cKey === "ALL") {
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
    const match = hist.slice().reverse().find(h => h.campusKey === spec.key) || hist[hist.length - 1];
    if (match) applyMockRecordToT7State(match);
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
      { key: "INDORE", name: "IIM Indore (5-Yr IPM)", yourScore: `${indTotal}/360 (ATS ${indAts}/65)`, cutoff: "SA &ge; 24 &bull; MCQ &ge; 40 &bull; VA &ge; 116 (Total ~180+)", gap: Math.max(0, 180 - indTotal), eligible: s.indSa >= 24 && s.indMcq >= 40 && s.indVa >= 116, note: s.indSa < 24 ? `Need +${24 - s.indSa} in QA-SA` : s.indMcq < 40 ? `Need +${40 - s.indMcq} in QA-MCQ` : s.indVa < 116 ? `Need +${116 - s.indVa} in VA` : "All 3 sectional cutoffs cleared!" },
      { key: "RANCHI", name: "IIM Ranchi (5-Yr IPM)", yourScore: `${indTotal}/360 + Acads ${((s.c10 + s.c12) / 2).toFixed(1)}%`, cutoff: "Total ~172+ (No sectional bar, 20% 10th/12th weight)", gap: Math.max(0, 172 - indTotal), eligible: indTotal >= 172, note: indTotal >= 172 ? "Strong PI shortlist zone" : `Need +${172 - indTotal} overall IPMAT marks` },
      { key: "ROHTAK", name: "IIM Rohtak (5-Yr IPM)", yourScore: `${s.rohtak}/480 (Pre-PI ${rohtakComp}/75)`, cutoff: "General ~385&ndash;405 / 480 + 30% Acad Weight", gap: Math.max(0, 390 - s.rohtak), eligible: s.rohtak >= 390, note: s.rohtak >= 390 ? "Above expected General PI call cutoff" : `Need +${390 - s.rohtak} marks in Rohtak CBT` },
      { key: "BODHGAYA", name: "IIM Bodh Gaya (5-Yr IPM)", yourScore: `${s.jipmat}/400`, cutoff: "General ~310&ndash;325 / 400 (100% JIPMAT Merit)", gap: Math.max(0, 315 - s.jipmat), eligible: s.jipmat >= 315, note: s.jipmat >= 315 ? "Direct merit shortlist range" : `Need +${315 - s.jipmat} marks in JIPMAT` },
      { key: "JAMMU", name: "IIM Jammu (5-Yr IPM)", yourScore: `${s.jipmat}/400`, cutoff: "General ~305&ndash;320 / 400 + Diversity", gap: Math.max(0, 310 - s.jipmat), eligible: s.jipmat >= 310, note: s.jipmat >= 310 ? "Competitive for Merit List 1" : `Need +${310 - s.jipmat} marks in JIPMAT` },
      { key: "BANGALORE", name: "IIM Bangalore (B.Sc. Econ/DS & BBA DBE)", yourScore: `${s.iimbUg}/300 &bull; Class 12 Math: ${s.hasMath ? "Yes" : "No"}`, cutoff: "Class 12 Math mandatory for B.Sc. &bull; ~235+/300", gap: Math.max(0, 235 - s.iimbUg), eligible: s.hasMath && s.iimbUg >= 235, note: !s.hasMath ? "Ineligible for B.Sc. (No Class 12 Math); eligible for BBA DBE" : s.iimbUg >= 235 ? "Eligible for both B.Sc. & BBA DBE PI" : `Need +${235 - s.iimbUg} in IIMB UG test` },
      { key: "MUMBAI", name: "IIM Mumbai (4-Yr BS Digital & Supply Chain)", yourScore: `JEE ${s.jeePct}%ile &bull; Math: ${s.hasMath ? "Yes" : "No"}`, cutoff: "Class 12 Math mandatory &bull; ~96.0+%ile equivalent", gap: Math.max(0, +(96.0 - s.jeePct).toFixed(1)), eligible: s.hasMath && s.jeePct >= 96.0, note: !s.hasMath ? "Requires Class 12 Mathematics" : s.jeePct >= 96.0 ? "Meets quantitative & JEE benchmark" : `Need +${(96.0 - s.jeePct).toFixed(1)}%ile` },
      { key: "LUCKNOW", name: "IIM Lucknow (4-Yr Tech-Mgmt UG)", yourScore: `Acads ${((s.c10 + s.c12) / 2).toFixed(1)}% &bull; Math: ${s.hasMath ? "Yes" : "No"}`, cutoff: "Strong Class 10/12 (85%+) + Quantitative Aptitude", gap: 0, eligible: s.hasMath && s.c10 >= 85 && s.c12 >= 85, note: s.hasMath && s.c10 >= 85 && s.c12 >= 85 ? "Strong academic + quant profile" : "Requires 85%+ academics & Class 12 Math" }
    ];

    const callsCount = campuses.filter(c => c.eligible).length;
    const synced = s.syncedRecord;

    el.innerHTML = `
      <div class="space-y-4">
        <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg font-bold text-white">8-IIM Call &amp; Target Forecaster &bull; ${spec.fullLabel}</h2>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold">${callsCount} / 8 IIMs Shortlist Ready</span>
              ${synced ? `<span class="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold">Synced: ${synced.serialId}</span>` : ""}
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Select any of the 8 IIM pills above and click <strong>Sync Mock</strong> to evaluate present level, sectional strengths, and deficiencies.</p>
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

        ${synced ? `
          <div class="bg-slate-900/95 border border-indigo-500/40 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div class="text-[10px] font-extrabold uppercase text-amber-400">Present Level (${synced.serialId})</div>
              <div class="text-base font-extrabold text-white mt-0.5">${synced.score} / ${synced.maxScore} (${synced.accuracyPct || 0}% Acc)</div>
              <div class="text-[11px] text-slate-400 mt-0.5">${synced.secSummary || synced.title}</div>
            </div>
            <div class="p-3 rounded-xl bg-emerald-950/30 border border-emerald-700/40">
              <div class="text-[10px] font-extrabold uppercase text-emerald-300">&#9989; Gauged Strengths</div>
              <div class="text-emerald-100 mt-1">${(synced.strengths || []).join(" &bull; ")}</div>
            </div>
            <div class="p-3 rounded-xl bg-rose-950/30 border border-rose-700/40">
              <div class="text-[10px] font-extrabold uppercase text-rose-300">&#9888;&#65039; Gauged Deficiencies</div>
              <div class="text-rose-100 mt-1">${(synced.deficiencies || []).join(" &bull; ")}</div>
            </div>
          </div>
        ` : ""}

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-xs">
            <div class="font-extrabold uppercase tracking-wider text-indigo-400">Interactive What-If Score Simulator</div>
            <div><div class="flex justify-between font-bold mb-1"><span>IPMAT Indore QA-SA (/60)</span><span class="text-amber-300">${s.indSa} / 60</span></div><input type="range" min="0" max="60" value="${s.indSa}" oninput="window.updateIpmT7Slider('indSa', this.value)" class="w-full cursor-pointer"></div>
            <div><div class="flex justify-between font-bold mb-1"><span>IPMAT Indore QA-MCQ (/120)</span><span class="text-amber-300">${s.indMcq} / 120</span></div><input type="range" min="0" max="120" value="${s.indMcq}" oninput="window.updateIpmT7Slider('indMcq', this.value)" class="w-full cursor-pointer"></div>
            <div><div class="flex justify-between font-bold mb-1"><span>IPMAT Indore Verbal Ability (/180)</span><span class="text-amber-300">${s.indVa} / 180</span></div><input type="range" min="0" max="180" value="${s.indVa}" oninput="window.updateIpmT7Slider('indVa', this.value)" class="w-full cursor-pointer"></div>
            <div><div class="flex justify-between font-bold mb-1"><span>IPMAT Rohtak Composite (/480)</span><span class="text-cyan-300">${s.rohtak} / 480</span></div><input type="range" min="150" max="480" step="5" value="${s.rohtak}" oninput="window.updateIpmT7Slider('rohtak', this.value)" class="w-full cursor-pointer"></div>
            <div><div class="flex justify-between font-bold mb-1"><span>JIPMAT Bodh Gaya &amp; Jammu (/400)</span><span class="text-emerald-300">${s.jipmat} / 400</span></div><input type="range" min="150" max="400" step="5" value="${s.jipmat}" oninput="window.updateIpmT7Slider('jipmat', this.value)" class="w-full cursor-pointer"></div>
            <div><div class="flex justify-between font-bold mb-1"><span>IIM Bangalore UG Test (/300)</span><span class="text-purple-300">${s.iimbUg} / 300</span></div><input type="range" min="100" max="300" step="5" value="${s.iimbUg}" oninput="window.updateIpmT7Slider('iimbUg', this.value)" class="w-full cursor-pointer"></div>
            <div><div class="flex justify-between font-bold mb-1"><span>JEE Main %ile (IIM Mumbai BS)</span><span class="text-sky-300">${s.jeePct}%ile</span></div><input type="range" min="80" max="100" step="0.2" value="${s.jeePct}" oninput="window.updateIpmT7Slider('jeePct', this.value)" class="w-full cursor-pointer"></div>
            <div class="grid grid-cols-2 gap-3 pt-1">
              <div><label class="text-slate-400 font-bold">Class 10 %</label><input type="number" step="0.5" value="${s.c10}" onchange="window.updateIpmT7Slider('c10', this.value)" class="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-2 text-white"></div>
              <div><label class="text-slate-400 font-bold">Class 12 %</label><input type="number" step="0.5" value="${s.c12}" onchange="window.updateIpmT7Slider('c12', this.value)" class="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-2 text-white"></div>
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
                <span class="text-[11px] text-slate-400">Active Campus: ${spec.shortLabel}</span>
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
                    const isFocused = c.key === spec.key;
                    return `
                    <tr class="${isFocused ? 'bg-indigo-950/40' : ''}">
                      <td class="py-2.5 pr-2 font-bold text-white">
                        ${c.name} ${isFocused ? '<span class="ml-1 px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 text-[9px] uppercase">Selected</span>' : ''}
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

            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-extrabold uppercase tracking-wider text-amber-400">Executed Mock Serial ID Logs (${hist.length})</span>
                <span class="text-[11px] text-slate-400">Click any Serial ID to inspect strengths &amp; deficiencies</span>
              </div>
              ${hist.length ? `
                <div class="flex flex-wrap gap-2">
                  ${hist.slice(0, 10).map(h => `
                    <button type="button" onclick="window.syncSpecificIpmMockToTab7('${h.serialId}')"
                      class="px-3 py-1.5 rounded-xl border text-left transition cursor-pointer ${
                        synced && synced.serialId === h.serialId
                          ? "bg-amber-500/20 border-amber-400 text-amber-200 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500"
                      }">
                      <div class="font-mono text-[11px] font-extrabold">${h.serialId}</div>
                      <div class="text-[10px] text-slate-400">${h.score}/${h.maxScore} (${h.accuracyPct || 0}%)</div>
                    </button>
                  `).join("")}
                </div>
              ` : `<div class="text-[11px] text-slate-400">No mock logs yet. Execute a mock in Tab 4 or Tab 5 to populate Serial IDs here.</div>`}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // TAB 8: Split-Screen Trap Doctor & AI Doubts
  window.askIpmTrapDoctor = function (title, detail) {
    const qBox = document.getElementById("doubt-question") || document.querySelector("#ipm-t8-right textarea");
    if (qBox) {
      qBox.value = `Explain this IPMAT / IIM UG exam trap with a worked example and 30-second antidote:\n${title} â€” ${detail}`;
      window._IS_PRESET_TRAP_DOUBT = true;
      const btn = document.querySelector("#ipm-t8-right button");
      if (btn) btn.click();
    }
  };

  window.renderTab8 = function (el) {
    el.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div id="ipm-t8-left" class="lg:col-span-7 space-y-4"></div>
        <div id="ipm-t8-right" class="lg:col-span-5 space-y-4 lg:sticky lg:top-24"></div>
      </div>
    `;
    const left = document.getElementById("ipm-t8-left");
    const right = document.getElementById("ipm-t8-right");
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
})();
