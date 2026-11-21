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
      shortLabel: "All-9 IIMs Master",
      subLabel: "Unified",
      fullLabel: "All-9 IIMs Comprehensive Master",
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
      key: "KOZHIKODE",
      code: "IPM-IIMK",
      shortLabel: "IIM Kozhikode",
      subLabel: "4-Yr BMS",
      fullLabel: "IIM Kozhikode (4-Yr BMS Honours)",
      campusName: "IIM Kozhikode (4-Yr BMS Honours)",
      apiExam: "IIM",
      pyqExamFilter: "IIM Kozhikode BMS",
      qCount: 25,
      mins: 35,
      pattern: "100 Qs (Quant, LR, VARC & Business Aptitude) | 120 Mins",
      marking: "MCQ +4/-1 | IIMK BMS Aptitude Test + Personal Interview",
      note: "4-Year Bachelor of Management Studies (Hons) at IIMK Kochi/Kozhikode campus (~240+/400 + Class 10/12 & PI).",
      practiceSections: [
        { title: "IIMK BMS Quantitative & Commercial Math", section: "QUANT_MCQ", suffix: "QA", qCount: 15, mins: 20, badge: "IIMK BMS QUANT", desc: "Arithmetic, Algebra, Modern Math & Ratios for IIMK BMS." },
        { title: "IIMK Business & Data Reasoning", section: "DILR", suffix: "LR", qCount: 15, mins: 20, badge: "IIMK BMS DILR", desc: "Caselet DI, Analytical Puzzles, Data Sufficiency & Logic." },
        { title: "IIMK VARC & Management Comprehension", section: "VARC", suffix: "VA", qCount: 15, mins: 18, badge: "IIMK BMS VARC", desc: "Editorial RC, Critical Reasoning, Grammar & Business Vocab." },
        { title: "IIM Kozhikode 4-Yr BMS Readiness Sprint", section: "", suffix: "BMS", qCount: 20, mins: 26, badge: "IIMK BMS COMPOSITE", desc: "Full 3-section calibrated practice set for IIMK BMS entrance." }
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
    },
    {
      key: "CUET",
      code: "IPM-CUET",
      shortLabel: "CUET-UG",
      subLabel: "GAT / BMS / Econ",
      fullLabel: "CUET-UG (NTA GAT, English & Applied Math)",
      campusName: "CUET-UG (SSCBS BMS/BBA-FIA & IIM UG)",
      apiExam: "CUET",
      pyqExamFilter: "CUET-UG",
      qCount: 30,
      mins: 35,
      pattern: "NTA CBT (GAT 50 Qs + English 40 Qs + Applied Math 40 Qs)",
      marking: "NTA Standard +5/-1 (Normalized +4/-1 Scale in Suite)",
      note: "Essential parallel UG entrance for SSCBS (BMS/BBA-FIA), SRCC, and IIM UG/IPM backup tracks (~650+/750 target).",
      practiceSections: [
        { title: "CUET General Aptitude Test (GAT)", section: "DILR", suffix: "GAT", qCount: 15, mins: 18, badge: "NTA CUET GAT", desc: "Quantitative Reasoning, Data Interpretation, Logic & Analytical speed drill." },
        { title: "CUET English Language & RC", section: "VARC", suffix: "ENG", qCount: 15, mins: 15, badge: "NTA CUET ENGLISH", desc: "High-speed Reading Comprehension, Idioms, Synonyms & Verbal usage." },
        { title: "CUET Applied & Core Mathematics", section: "QUANT_MCQ", suffix: "MATH", qCount: 15, mins: 20, badge: "APPLIED / CORE MATH", desc: "Matrices, Calculus, Probability, Linear Programming & Financial Math." },
        { title: "SSCBS / Top UG 99+%ile Composite Sprint", section: "", suffix: "UG", qCount: 20, mins: 24, badge: "CUET-UG COMPOSITE", desc: "Mixed GAT + English + Applied Math speed drill for top-college cutoffs." }
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
    KOZHIKODE: "IIMM_IIML_UG",
    LUCKNOW: "IIMM_IIML_UG",
    CUET: "ALL_IIMS"
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
    const activeSa = document.getElementById('pgMockSaInput');
    if (activeSa && window.PG_MOCK.questions && window.PG_MOCK.questions[window.PG_MOCK.currentIndex]) {
      window.PG_MOCK.answers[window.PG_MOCK.questions[window.PG_MOCK.currentIndex].id] = activeSa.value;
    }
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

  window.saveAndNextPgMock = function () {
    if (!window.PG_MOCK || !Array.isArray(window.PG_MOCK.questions)) return;
    const idx = window.PG_MOCK.currentIndex;
    const q = window.PG_MOCK.questions[idx];
    if (q) {
      const saInput = document.getElementById("pgMockSaInput");
      if (saInput) {
        window.PG_MOCK.answers[q.id] = saInput.value;
      }
      if (window.PG_MOCK.marked) delete window.PG_MOCK.marked[q.id];
    }
    if (idx < window.PG_MOCK.questions.length - 1) {
      window.PG_MOCK.currentIndex = idx + 1;
    }
    window.renderActiveTab();
  };

  window.clearPgMockResponse = function () {
    if (!window.PG_MOCK || !Array.isArray(window.PG_MOCK.questions)) return;
    const q = window.PG_MOCK.questions[window.PG_MOCK.currentIndex];
    if (q) {
      delete window.PG_MOCK.answers[q.id];
      if (window.PG_MOCK.marked) delete window.PG_MOCK.marked[q.id];
    }
    window.renderActiveTab();
  };

  window.markReviewAndNextPgMock = function () {
    if (!window.PG_MOCK || !Array.isArray(window.PG_MOCK.questions)) return;
    const idx = window.PG_MOCK.currentIndex;
    const q = window.PG_MOCK.questions[idx];
    if (q) {
      const saInput = document.getElementById("pgMockSaInput");
      if (saInput) window.PG_MOCK.answers[q.id] = saInput.value;
      window.PG_MOCK.marked = window.PG_MOCK.marked || {};
      window.PG_MOCK.marked[q.id] = true;
    }
    if (idx < window.PG_MOCK.questions.length - 1) {
      window.PG_MOCK.currentIndex = idx + 1;
    }
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
            <div class="flex flex-wrap items-center gap-2">
              <input id="pgMockSaInput" type="text" value="${window.PG_MOCK.answers[q.id] || ""}"
                oninput="window.PG_MOCK.answers['${q.id}'] = this.value"
                onkeydown="if(event.key==='Enter'){ event.preventDefault(); window.saveAndNextPgMock(); }"
                placeholder="Type exact number..." class="w-full max-w-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/50 text-white text-sm font-mono focus:outline-none focus:border-indigo-400" />
              <span class="text-[11px] text-slate-400">Press <strong>Enter</strong> or click <strong>Save &amp; Next &rarr;</strong></span>
            </div>
          `}
          <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" onclick="window.jumpPgMockQ(${idx - 1})" ${idx === 0 ? "disabled" : ""}
                class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white cursor-pointer">
                &larr; Previous
              </button>
              <button type="button" onclick="window.clearPgMockResponse()"
                class="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 cursor-pointer">
                Clear Response
              </button>
              <button type="button" onclick="window.markReviewAndNextPgMock()"
                class="px-3.5 py-2 rounded-xl bg-purple-600/25 hover:bg-purple-600/35 border border-purple-500/40 text-xs font-bold text-purple-200 cursor-pointer">
                &#128278; Mark for Review &amp; Next
              </button>
              <button type="button" onclick="window.saveAndNextPgMock()"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white shadow cursor-pointer">
                &#10003; ${idx === qs.length - 1 ? "Save Response" : "Save & Next →"}
              </button>
            </div>
            <div class="flex flex-wrap gap-1">
              ${qs.map((item, qi) => {
                const ansd = window.PG_MOCK.answers[item.id] !== undefined && String(window.PG_MOCK.answers[item.id]).trim() !== "";
                const marked = window.PG_MOCK.marked && window.PG_MOCK.marked[item.id];
                const cls = qi === idx
                  ? "bg-amber-500 text-slate-950 ring-2 ring-amber-300"
                  : marked
                    ? "bg-purple-600/40 text-purple-200 border border-purple-400"
                    : ansd
                      ? "bg-emerald-600/40 text-emerald-200 border border-emerald-500/40"
                      : "bg-slate-950 text-slate-400 border border-slate-800";
                return `<button type="button" onclick="window.jumpPgMockQ(${qi})" class="w-7 h-7 rounded-lg text-[11px] font-bold cursor-pointer ${cls}">${qi + 1}</button>`;
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
          badge.textContent = `Campus Mode: ${spec.shortLabel} • Active Filter: ${window.PYQ_EXAM_FILTER}`;
          hdr.appendChild(badge);
        }
      }, 30);
    }
  };

  // TAB 7: Individual 9-IIM + CUET-UG Call & Target Forecaster (NEET/CAT Parity v32)
  window.IPM_T7_MODE = window.IPM_T7_MODE || "TARGET"; // "TARGET" | "MOCK"
  window.IPM_T7_TARGETS = window.IPM_T7_TARGETS || {
    c10: 92,
    c12: 90,
    hasMath: true,
    indSa: 32,
    indMcq: 56,
    indVa: 132,
    rohtak: 405,
    jipmat: 330,
    iimbUg: 250,
    iimkBms: 265,
    cuetScore: 675,
    jeePct: 97.2,
    lockedAt: "Default 99%ile Target",
    syncedRecord: null
  };

  const MODE_SLIDER_GROUPS = {
    ALL: [
      { key: "indSa", label: "IPMAT Indore QA-SA", min: 0, max: 60, step: 1, unit: "/60", cutoff: 24 },
      { key: "indMcq", label: "IPMAT Indore QA-MCQ", min: 0, max: 120, step: 2, unit: "/120", cutoff: 40 },
      { key: "indVa", label: "IPMAT Indore Verbal Ability", min: 0, max: 180, step: 2, unit: "/180", cutoff: 116 },
      { key: "rohtak", label: "IPMAT Rohtak Composite", min: 150, max: 480, step: 5, unit: "/480", cutoff: 390 },
      { key: "jipmat", label: "JIPMAT (Bodh Gaya & Jammu)", min: 150, max: 400, step: 5, unit: "/400", cutoff: 315 },
      { key: "cuetScore", label: "CUET-UG (GAT + Eng + Math)", min: 300, max: 750, step: 5, unit: "/750", cutoff: 650 }
    ],
    INDORE: [
      { key: "indSa", label: "Section 1: QA Short Answer (+4/0)", min: 0, max: 60, step: 1, unit: "/60", cutoff: 24 },
      { key: "indMcq", label: "Section 2: QA MCQ & Higher Math (+4/-1)", min: 0, max: 120, step: 2, unit: "/120", cutoff: 40 },
      { key: "indVa", label: "Section 3: Verbal Ability (+4/-1)", min: 0, max: 180, step: 2, unit: "/180", cutoff: 116 }
    ],
    RANCHI: [
      { key: "indSa", label: "IPMAT QA-SA Component (+4/0)", min: 0, max: 60, step: 1, unit: "/60", cutoff: 20 },
      { key: "indMcq", label: "IPMAT QA-MCQ Component (+4/-1)", min: 0, max: 120, step: 2, unit: "/120", cutoff: 44 },
      { key: "indVa", label: "IPMAT Verbal Ability Component (+4/-1)", min: 0, max: 180, step: 2, unit: "/180", cutoff: 108 }
    ],
    ROHTAK: [
      { key: "rohtak", label: "IPMAT Rohtak Total (QA + LR + VA)", min: 150, max: 480, step: 5, unit: "/480", cutoff: 390 }
    ],
    BODHGAYA: [
      { key: "jipmat", label: "NTA JIPMAT Total (QA + DILR + VARC)", min: 150, max: 400, step: 5, unit: "/400", cutoff: 315 }
    ],
    JAMMU: [
      { key: "jipmat", label: "NTA JIPMAT Total (QA + DILR + VARC)", min: 150, max: 400, step: 5, unit: "/400", cutoff: 310 }
    ],
    BANGALORE: [
      { key: "iimbUg", label: "IIMB UG Entrance (Quant/Stats + Biz DI + VA)", min: 100, max: 300, step: 5, unit: "/300", cutoff: 235 }
    ],
    MUMBAI: [
      { key: "jeePct", label: "JEE Main / Quantitative Percentile", min: 80, max: 100, step: 0.2, unit: "%ile", cutoff: 96.0 }
    ],
    KOZHIKODE: [
      { key: "iimkBms", label: "IIMK BMS Aptitude Test (Quant + LR + VARC)", min: 120, max: 400, step: 5, unit: "/400", cutoff: 240 }
    ],
    LUCKNOW: [
      { key: "indMcq", label: "Higher Math & Decision Quant (/120)", min: 0, max: 120, step: 2, unit: "/120", cutoff: 52 },
      { key: "indVa", label: "VARC & Leadership Aptitude (/180)", min: 0, max: 180, step: 2, unit: "/180", cutoff: 120 }
    ],
    CUET: [
      { key: "cuetScore", label: "CUET-UG Composite (GAT + English + Math)", min: 300, max: 750, step: 5, unit: "/750", cutoff: 650 }
    ]
  };

  window.lockIpmDesiredTarget = function () {
    window.IPM_T7_MODE = "TARGET";
    window.IPM_T7_TARGETS.lockedAt = "Locked " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    localStorage.setItem("ipm_t7_locked_targets_v1", JSON.stringify(window.IPM_T7_TARGETS));
    window.renderActiveTab();
  };

  window.resetIpmDesiredTarget = function () {
    window.IPM_T7_MODE = "TARGET";
    Object.assign(window.IPM_T7_TARGETS, {
      c10: 92, c12: 90, hasMath: true,
      indSa: 32, indMcq: 56, indVa: 132,
      rohtak: 405, jipmat: 330, iimbUg: 250, iimkBms: 265, cuetScore: 675, jeePct: 97.2,
      lockedAt: "Reset to 99%ile Benchmark"
    });
    window.renderActiveTab();
  };

  window.syncSpecificIpmMockToTab7 = function (serialId) {
    const hist = getMockHistory();
    const match = hist.find(h => h.serialId === serialId) || hist[hist.length - 1];
    if (match) {
      window.IPM_T7_TARGETS.syncedRecord = match;
      window.IPM_T7_MODE = "MOCK";
    }
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
    if (match) {
      window.IPM_T7_TARGETS.syncedRecord = match;
      window.IPM_T7_MODE = "MOCK";
    } else {
      alert(`No ${spec.shortLabel} mock found yet. Complete a mock in Tab 4 or Tab 5 first, or adjust your Desired Self-Target sliders!`);
    }
    window.renderActiveTab();
  };

  window.updateIpmT7Slider = function (key, val) {
    window.IPM_T7_TARGETS[key] = key === "hasMath" ? Boolean(val) : parseFloat(val);
    window.renderActiveTab();
  };

  window.renderTab7 = function (el) {
    const spec = window.getActiveIpmModeSpec();
    const t = window.IPM_T7_TARGETS;
    const hist = getMockHistory().slice().reverse();
    const fullMocksCount = hist.filter(h => !h.isPractice).length;
    const synced = t.syncedRecord;

    const sliders = MODE_SLIDER_GROUPS[spec.key] || MODE_SLIDER_GROUPS.ALL;
    const indTotal = t.indSa + t.indMcq + t.indVa;
    const indAts = ((t.indSa / 60) * 20 + (t.indMcq / 120) * 20 + (t.indVa / 180) * 25).toFixed(1);

    // Primary KPI summary tailored to the active top campus pill
    let primaryPreview = `${indTotal} / 360`;
    let primarySub = `ATS ${indAts}/65 • Acads ${((t.c10 + t.c12) / 2).toFixed(1)}%`;
    let tierLabel = indTotal >= 195 ? "Top-100 IIM Indore & Ranchi Shortlist" : indTotal >= 175 ? "Strong PI Call Zone" : "Below Cutoff — Boost Sectional Score";

    if (spec.key === "ROHTAK") {
      primaryPreview = `${t.rohtak} / 480`;
      primarySub = `Acad Weight ${(((t.c10 + t.c12) / 200) * 30).toFixed(1)} / 30`;
      tierLabel = t.rohtak >= 390 ? "IIM Rohtak General PI Call Ready" : `Need +${390 - t.rohtak} Marks for PI Call`;
    } else if (spec.key === "BODHGAYA" || spec.key === "JAMMU") {
      const bar = spec.key === "BODHGAYA" ? 315 : 310;
      primaryPreview = `${t.jipmat} / 400`;
      primarySub = `NTA JIPMAT • ${spec.key === "BODHGAYA" ? "100% CBT Merit" : "+ Diversity Points"}`;
      tierLabel = t.jipmat >= bar ? `${spec.shortLabel} Direct Merit List 1` : `Need +${bar - t.jipmat} Marks in JIPMAT`;
    } else if (spec.key === "BANGALORE") {
      primaryPreview = `${t.iimbUg} / 300`;
      primarySub = `Class 12 Math: ${t.hasMath ? "Verified" : "Missing"}`;
      tierLabel = t.hasMath && t.iimbUg >= 235 ? "IIMB B.Sc. Econ/DS & BBA DBE PI Ready" : "Check Class 12 Math / 235+ Target";
    } else if (spec.key === "MUMBAI") {
      primaryPreview = `${t.jeePct}%ile`;
      primarySub = `Class 12 Math: ${t.hasMath ? "Verified" : "Missing"}`;
      tierLabel = t.hasMath && t.jeePct >= 96.0 ? "IIM Mumbai 4-Yr BS Shortlist Zone" : "Target ≥96.0%ile + Class 12 Math";
    } else if (spec.key === "KOZHIKODE") {
      primaryPreview = `${t.iimkBms} / 400`;
      primarySub = `Acads ${((t.c10 + t.c12) / 2).toFixed(1)}% • 4-Yr BMS Hons`;
      tierLabel = t.iimkBms >= 240 ? "IIM Kozhikode BMS PI Call Zone" : `Need +${240 - t.iimkBms} Marks in IIMK Test`;
    } else if (spec.key === "CUET") {
      primaryPreview = `${t.cuetScore} / 750`;
      primarySub = `GAT + English + Applied/Core Math`;
      tierLabel = t.cuetScore >= 650 ? "99+%ile SSCBS BMS / BBA-FIA & IIM UG" : `Need +${650 - t.cuetScore} Marks for Top-Tier BMS`;
    }

    // Build Achievement vs Deficiency rows from synced mock OR active mode targets
    const secStats = (synced && synced.secStats) || {};
    const sectionRows = [
      { label: "QA Short Answer (+4/0)", target: t.indSa, max: 60, mockKey: "QA-SA" },
      { label: "QA & Higher Math (+4/-1)", target: t.indMcq, max: 120, mockKey: "QA-MCQ" },
      { label: "DI & Logical Reasoning", target: Math.round((t.rohtak / 480) * 160), max: 160, mockKey: "DILR" },
      { label: "VARC & Verbal Ability", target: t.indVa, max: 180, mockKey: "VARC" }
    ].map(r => {
      const m = secStats[r.mockKey];
      const achieved = m && m.total > 0 ? Math.round((Math.max(0, m.score) / (m.total * 4)) * r.max) : null;
      const pct = achieved !== null ? Math.min(100, Math.round((achieved / Math.max(1, r.target)) * 100)) : 0;
      const diff = achieved !== null ? achieved - r.target : null;
      return { ...r, achieved, pct, diff };
    });

    const campuses = [
      { key: "INDORE", name: "IIM Indore (5-Yr IPM)", score: `${indTotal}/360 (ATS ${indAts}/65)`, gap: Math.max(0, 180 - indTotal), ok: t.indSa >= 24 && t.indMcq >= 40 && t.indVa >= 116, note: "SA ≥24 • MCQ ≥40 • VA ≥116" },
      { key: "RANCHI", name: "IIM Ranchi (5-Yr IPM)", score: `${indTotal}/360`, gap: Math.max(0, 172 - indTotal), ok: indTotal >= 172, note: "Composite ≥172 + 20% Acads" },
      { key: "ROHTAK", name: "IIM Rohtak (5-Yr IPM)", score: `${t.rohtak}/480`, gap: Math.max(0, 390 - t.rohtak), ok: t.rohtak >= 390, note: "Score ≥390 + 30% Acads" },
      { key: "BODHGAYA", name: "IIM Bodh Gaya (5-Yr IPM)", score: `${t.jipmat}/400`, gap: Math.max(0, 315 - t.jipmat), ok: t.jipmat >= 315, note: "JIPMAT ≥315 (No PI)" },
      { key: "JAMMU", name: "IIM Jammu (5-Yr IPM)", score: `${t.jipmat}/400`, gap: Math.max(0, 310 - t.jipmat), ok: t.jipmat >= 310, note: "JIPMAT ≥310 + Diversity" },
      { key: "BANGALORE", name: "IIM Bangalore (B.Sc. / BBA)", score: `${t.iimbUg}/300`, gap: Math.max(0, 235 - t.iimbUg), ok: t.hasMath && t.iimbUg >= 235, note: "≥235 + Class 12 Math" },
      { key: "MUMBAI", name: "IIM Mumbai (4-Yr BS)", score: `${t.jeePct}%ile`, gap: Math.max(0, +(96.0 - t.jeePct).toFixed(1)), ok: t.hasMath && t.jeePct >= 96.0, note: "≥96.0%ile + Class 12 Math" },
      { key: "KOZHIKODE", name: "IIM Kozhikode (4-Yr BMS)", score: `${t.iimkBms}/400`, gap: Math.max(0, 240 - t.iimkBms), ok: t.iimkBms >= 240, note: "IIMK BMS ≥240 + PI" },
      { key: "LUCKNOW", name: "IIM Lucknow (4-Yr UG)", score: `${((t.c10 + t.c12) / 2).toFixed(1)}% Acads`, gap: 0, ok: t.hasMath && t.c10 >= 85 && t.c12 >= 85, note: "85%+ Acads + Class 12 Math" },
      { key: "CUET", name: "CUET-UG (SSCBS / Top BMS)", score: `${t.cuetScore}/750`, gap: Math.max(0, 650 - t.cuetScore), ok: t.cuetScore >= 650, note: "≥650/750 (99+%ile NTA)" }
    ];

    const readyCount = campuses.filter(c => c.ok).length;

    el.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- LEFT PANEL: NEET/CAT-STYLE SELF-TARGET & SYNC CONTROLS -->
        <div class="lg:col-span-5 bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs shadow-lg">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase">
                MODE: ${window.IPM_T7_MODE === "MOCK" ? "ACTUAL MOCK SYNCED" : "DESIRED SELF-TARGET"}
              </span>
              <h2 class="text-lg font-extrabold text-white mt-1.5">Set Desired ${spec.shortLabel} Target</h2>
              <p class="text-[11px] text-slate-400 mt-0.5">Adjust sliders below, click <strong>Set Target</strong> to lock your goal, or click <strong>Sync Mock</strong> to compare actual Tab 4/5 achievement.</p>
            </div>
            <div class="flex flex-col gap-1.5 shrink-0">
              <button type="button" onclick="window.lockIpmDesiredTarget()"
                class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow cursor-pointer">
                &#127919; Set Target
              </button>
              <button type="button" onclick="window.resetIpmDesiredTarget()"
                class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer">
                Reset Target
              </button>
              <button type="button" onclick="window.syncLatestIpmMockToTab7()"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow cursor-pointer">
                &#8635; Sync Mock
              </button>
            </div>
          </div>

          <div class="space-y-3 pt-1 border-t border-slate-800">
            ${sliders.map(sl => `
              <div>
                <div class="flex justify-between font-bold mb-1">
                  <span class="text-slate-200">${sl.label}</span>
                  <span class="text-emerald-400 font-extrabold">${t[sl.key]} <span class="text-slate-400 font-normal">${sl.unit} (Cutoff: ${sl.cutoff})</span></span>
                </div>
                <input type="range" min="${sl.min}" max="${sl.max}" step="${sl.step}" value="${t[sl.key]}"
                  oninput="window.updateIpmT7Slider('${sl.key}', this.value)" class="w-full accent-emerald-500 cursor-pointer">
              </div>
            `).join("")}
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label class="text-slate-400 font-bold">Class 10 Board %</label>
              <input type="number" step="0.5" value="${t.c10}" onchange="window.updateIpmT7Slider('c10', this.value)" class="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-2 text-white">
            </div>
            <div>
              <label class="text-slate-400 font-bold">Class 12 Board %</label>
              <input type="number" step="0.5" value="${t.c12}" onchange="window.updateIpmT7Slider('c12', this.value)" class="w-full mt-1 rounded-xl bg-slate-950 border border-slate-700 p-2 text-white">
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input id="t7-math-chk" type="checkbox" ${t.hasMath ? "checked" : ""} onchange="window.updateIpmT7Slider('hasMath', this.checked)">
            <label for="t7-math-chk" class="text-slate-300 font-semibold">Studied Mathematics in Class 12 (IIMB B.Sc. / IIMM BS)</label>
          </div>
        </div>

        <!-- RIGHT PANEL: 3 KPI CARDS + ACHIEVEMENT VS DEFICIENCY MATRIX + 10-TRACK READINESS -->
        <div class="lg:col-span-7 space-y-4">
          <!-- 3-CARD KPI PREVIEW BANNER (MATCHING NEET/CAT) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-4 rounded-2xl bg-slate-900/95 border border-slate-800">
              <div class="text-[10px] font-extrabold uppercase text-slate-400">TARGET PREVIEW (${spec.code})</div>
              <div class="text-xl font-extrabold text-white mt-1">${primaryPreview}</div>
              <div class="text-[11px] text-indigo-300 mt-0.5">${primarySub}</div>
            </div>
            <div class="p-4 rounded-2xl bg-emerald-950/25 border border-emerald-700/40">
              <div class="text-[10px] font-extrabold uppercase text-emerald-300">SHORTLIST READINESS</div>
              <div class="text-xl font-extrabold text-emerald-400 mt-1">${readyCount} / 10 Tracks</div>
              <div class="text-[11px] text-emerald-200 mt-0.5">9 IIMs + CUET-UG BMS</div>
            </div>
            <div class="p-4 rounded-2xl bg-slate-900/95 border border-slate-800">
              <div class="text-[10px] font-extrabold uppercase text-amber-300">EXPECTED CALL TIER</div>
              <div class="text-sm font-extrabold text-white mt-1 leading-snug">${tierLabel}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">${t.lockedAt}</div>
            </div>
          </div>

          <!-- ACHIEVEMENT VS. DEFICIENCY REMAINING MATRIX WITH COMPLETION BARS -->
          <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div class="text-xs font-extrabold uppercase tracking-wider text-amber-400">ACHIEVEMENT VS. DEFICIENCY REMAINING MATRIX</div>
                <div class="text-[11px] text-slate-400">
                  ${synced ? `Synced Mock: <strong class="font-mono text-amber-300">${synced.serialId}</strong> (${synced.score}/${synced.maxScore} • ${synced.accuracyPct}% Acc)` : "Complete a mock in Tab 4/5 & click Sync Mock to populate Actual Achievement"}
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">${fullMocksCount} Full Mocks Logged</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <th class="py-2 pr-2">Section / Pillar</th>
                    <th class="py-2 px-2">Locked Target</th>
                    <th class="py-2 px-2">Achieved (Mock)</th>
                    <th class="py-2 px-2">Deficiency / Surplus</th>
                    <th class="py-2 pl-2">Completion</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/70">
                  ${sectionRows.map(r => `
                    <tr>
                      <td class="py-2.5 pr-2 font-bold text-white">${r.label}</td>
                      <td class="py-2.5 px-2 font-mono text-indigo-300">${r.target} / ${r.max}</td>
                      <td class="py-2.5 px-2 font-mono font-bold text-white">${r.achieved !== null ? `${r.achieved} / ${r.max}` : "—"}</td>
                      <td class="py-2.5 px-2 font-bold ${r.diff === null ? "text-slate-400" : r.diff >= 0 ? "text-emerald-400" : "text-rose-400"}">
                        ${r.diff === null ? "Pending Mock" : r.diff >= 0 ? `+${r.diff} Surplus` : `${r.diff} Deficit`}
                      </td>
                      <td class="py-2.5 pl-2">
                        <div class="flex items-center gap-2">
                          <div class="w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div class="h-full bg-emerald-500" style="width:${r.pct}%"></div>
                          </div>
                          <span class="text-[10px] font-bold text-slate-300">${r.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- ALL 9 IIMs + CUET-UG CAMPUS CALL MATRIX (SINGLE-LINE BADGES) -->
          <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-3 overflow-x-auto text-xs">
            <div class="flex items-center justify-between">
              <div class="text-xs font-extrabold uppercase tracking-wider text-emerald-400">9-IIM + CUET-UG Campus Shortlist Matrix</div>
              <span class="text-[11px] text-slate-400">Highlighted: ${spec.shortLabel}</span>
            </div>
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                  <th class="py-2 pr-2">Campus / Program</th>
                  <th class="py-2 px-2">Projected</th>
                  <th class="py-2 px-2">Benchmark</th>
                  <th class="py-2 pl-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/70">
                ${campuses.map(c => {
                  const isFocused = c.key === spec.key;
                  return `
                    <tr class="${isFocused ? "bg-indigo-950/40" : ""}">
                      <td class="py-2 pr-2 font-bold text-white whitespace-nowrap">${c.name}</td>
                      <td class="py-2 px-2 font-mono text-indigo-300 whitespace-nowrap">${c.score}</td>
                      <td class="py-2 px-2 text-slate-400">${c.note}</td>
                      <td class="py-2 pl-2 text-right whitespace-nowrap">
                        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold whitespace-nowrap ${
                          c.ok ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                        }">${c.ok ? "CALL READY" : "GAP: -" + c.gap}</span>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
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
