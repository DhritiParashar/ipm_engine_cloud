/**
 * GOALisB IIM UG & IPM Master Engine — Comprehensive Manifest (2026)
 * Covers all Class 12 pass-out pathways across IIM Indore, Rohtak, Ranchi,
 * Bodh Gaya, Jammu, Bangalore (B.Sc. Econ/DS & BBA DBE), Mumbai (BS), and Lucknow.
 */

window.IPM_MANIFEST = {
  brand: "GOALisB IIM UG & IPM Master Engine",
  tagline: "Unified Prep for All IIM Undergraduate & 5-Year Integrated Management Admissions",

  examModes: {
    ALL_IIM_MASTER: {
      id: "ALL_IIM_MASTER",
      label: "All-IIM Comprehensive Master",
      badge: "8 IIMs Unified",
      campuses: [
        "IIM Indore", "IIM Rohtak", "IIM Ranchi", "IIM Bodh Gaya",
        "IIM Jammu", "IIM Bangalore", "IIM Mumbai", "IIM Lucknow"
      ],
      programTypes: ["5-Yr IPM (BBA+MBA)", "4-Yr B.Sc./BS Hons", "3-Yr BBA/BMS"],
      totalQuestions: 100,
      durationMinutes: 150,
      sectionalTimeLock: false,
      marking: { mcqCorrect: 4, mcqWrong: -1, saCorrect: 4, saWrong: 0 },
      sections: [
        { id: "quant_core", name: "Quantitative Core (Arithmetic, Algebra, Geometry)", questions: 25, minutes: 40, type: "MCQ" },
        { id: "higher_math_stats", name: "Higher Math, Calculus & Statistics (Indore/IIMB)", questions: 20, minutes: 35, type: "SA_AND_MCQ" },
        { id: "dilr", name: "Data Interpretation & Logical Reasoning (JIPMAT/Rohtak)", questions: 25, minutes: 35, type: "MCQ" },
        { id: "varc", name: "Verbal Ability, Reading Comprehension & Critical Logic", questions: 30, minutes: 40, type: "MCQ" }
      ],
      selectionWeights: { test: 60, piWat: 25, academics10_12: 15 },
      keyFocus: "Complete coverage across Quant, Higher Math/Stats, DILR, VARC, and PI/WAT."
    },

    IPMAT_INDORE_RANCHI: {
      id: "IPMAT_INDORE_RANCHI",
      label: "IPMAT Indore & Ranchi",
      badge: "5-Yr IPM",
      campuses: ["IIM Indore", "IIM Ranchi"],
      programTypes: ["5-Year Integrated Programme in Management (BA + MBA / BBA + MBA)"],
      totalQuestions: 90,
      durationMinutes: 120,
      sectionalTimeLock: true,
      marking: { mcqCorrect: 4, mcqWrong: -1, saCorrect: 4, saWrong: 0 },
      sections: [
        { id: "qa_sa", name: "Quantitative Ability (Short Answer — No Negative)", questions: 15, minutes: 40, type: "SA_NUMERIC" },
        { id: "qa_mcq", name: "Quantitative Ability (MCQ)", questions: 30, minutes: 40, type: "MCQ" },
        { id: "va_mcq", name: "Verbal Ability (MCQ)", questions: 45, minutes: 40, type: "MCQ" }
      ],
      selectionWeights: { test: 65, piWat: 35, academics10_12: 0 },
      keyFocus: "Strict 40-min sectional locks, zero-penalty SA numericals, Higher Math & strict sectional cutoffs."
    },

    IPMAT_ROHTAK: {
      id: "IPMAT_ROHTAK",
      label: "IPMAT Rohtak",
      badge: "5-Yr IPM",
      campuses: ["IIM Rohtak"],
      programTypes: ["5-Year Integrated Programme in Management (BBA + MBA)"],
      totalQuestions: 120,
      durationMinutes: 120,
      sectionalTimeLock: false,
      marking: { mcqCorrect: 4, mcqWrong: -1, saCorrect: 4, saWrong: -1 },
      sections: [
        { id: "qa_rohtak", name: "Quantitative Ability", questions: 40, minutes: 40, type: "MCQ" },
        { id: "lr_rohtak", name: "Logical Reasoning", questions: 40, minutes: 40, type: "MCQ" },
        { id: "va_rohtak", name: "Verbal Ability", questions: 40, minutes: 40, type: "MCQ" }
      ],
      selectionWeights: { test: 45, piWat: 15, academics10_12: 40 },
      keyFocus: "High-speed 1-min/question pace, dedicated Logical Reasoning, and 40% weightage to Class 10 & 12 marks."
    },

    JIPMAT_BG_JAMMU: {
      id: "JIPMAT_BG_JAMMU",
      label: "JIPMAT (Bodh Gaya & Jammu)",
      badge: "5-Yr IPM",
      campuses: ["IIM Bodh Gaya", "IIM Jammu"],
      programTypes: ["5-Year Integrated Programme in Management (BBA + MBA)"],
      totalQuestions: 100,
      durationMinutes: 150,
      sectionalTimeLock: false,
      marking: { mcqCorrect: 4, mcqWrong: -1, saCorrect: 4, saWrong: -1 },
      sections: [
        { id: "qa_jipmat", name: "Quantitative Aptitude", questions: 33, minutes: 50, type: "MCQ" },
        { id: "dilr_jipmat", name: "Data Interpretation & Logical Reasoning", questions: 33, minutes: 50, type: "MCQ" },
        { id: "varc_jipmat", name: "Verbal Ability & Reading Comprehension", questions: 34, minutes: 50, type: "MCQ" }
      ],
      selectionWeights: { test: 100, piWat: 0, academics10_12: 0 },
      keyFocus: "100% JIPMAT score merit list (no PI), 150-min flexible pool, Arithmetic & DILR caselets."
    },

    IIMB_UG_ECON_DS_DBE: {
      id: "IIMB_UG_ECON_DS_DBE",
      label: "IIM Bangalore (B.Sc. Econ/DS & BBA DBE)",
      badge: "4-Yr B.Sc. / 3-Yr BBA",
      campuses: ["IIM Bangalore"],
      programTypes: [
        "B.Sc. (Hons) in Economics (Minor in Data Science & Business)",
        "B.Sc. (Hons) in Data Science (Minor in Economics & Business)",
        "BBA in Digital Business & Entrepreneurship (DBE)"
      ],
      totalQuestions: 90,
      durationMinutes: 120,
      sectionalTimeLock: false,
      marking: { mcqCorrect: 4, mcqWrong: -1, saCorrect: 4, saWrong: 0 },
      sections: [
        { id: "stats_prob_calc", name: "Statistics, Probability, Calculus & Higher Algebra", questions: 35, minutes: 50, type: "SA_AND_MCQ" },
        { id: "data_econ_reasoning", name: "Data Interpretation, Economics & Analytical Reasoning", questions: 30, minutes: 40, type: "MCQ" },
        { id: "varc_iimb", name: "Reading Comprehension & Verbal Reasoning", questions: 25, minutes: 30, type: "MCQ" }
      ],
      selectionWeights: { test: 60, piWat: 30, academics10_12: 10 },
      keyFocus: "Class 12 Math foundation (Stats, Probability, Calculus), quantitative economics & analytical PI."
    },

    IIMM_IIML_TECH_MGMT: {
      id: "IIMM_IIML_TECH_MGMT",
      label: "IIM Mumbai & IIM Lucknow (Tech-Mgmt UG)",
      badge: "4-Yr BS / Hons",
      campuses: ["IIM Mumbai", "IIM Lucknow"],
      programTypes: [
        "BS in Digital Science and Business Management (IIM Mumbai — via JEE Main)",
        "4-Yr UG in Business, Technology & Innovation (IIM Lucknow)"
      ],
      totalQuestions: 90,
      durationMinutes: 120,
      sectionalTimeLock: false,
      marking: { mcqCorrect: 4, mcqWrong: -1, saCorrect: 4, saWrong: 0 },
      sections: [
        { id: "quant_tech_math", name: "Quantitative Aptitude, Functions, Matrices & Probability", questions: 35, minutes: 50, type: "SA_AND_MCQ" },
        { id: "tech_logic_di", name: "Analytical Reasoning, Algorithmic Logic & Data Sets", questions: 30, minutes: 40, type: "MCQ" },
        { id: "varc_biz", name: "Business Comprehension & Communication", questions: 25, minutes: 30, type: "MCQ" }
      ],
      selectionWeights: { test: 65, piWat: 25, academics10_12: 10 },
      keyFocus: "Bridges JEE/Higher Math, Digital Business, Supply Chain/Analytics aptitude & tech-leadership PI."
    }
  },

  curriculumPillars: [
    {
      id: "quant_core",
      title: "1. Quantitative Core (Arithmetic, Algebra & Geometry)",
      relevance: "All 8 IIMs (JIPMAT, Rohtak, Indore, IIMB, IIMM, IIML)",
      topics: [
        "Percentages, Profit/Loss & SI/CI",
        "Ratios, Mixtures, Alligations & Partnerships",
        "Time, Speed, Distance & Races",
        "Time & Work, Pipes & Cisterns",
        "Number Systems, Remainders & Divisibility",
        "Linear & Quadratic Equations, Inequalities",
        "Triangles, Circles, Mensuration & Coordinate Basics"
      ]
    },
    {
      id: "higher_math_stats",
      title: "2. Higher Mathematics, Statistics & Calculus",
      relevance: "IPMAT Indore/Ranchi, IIM Bangalore (B.Sc. Econ/DS), IIM Mumbai & Lucknow",
      topics: [
        "Logarithms, Indices & Surds",
        "Sequences & Series (AP, GP, HP, Special Series)",
        "Permutations, Combinations & Binomial Theorem",
        "Probability, Bayes' Theorem & Distributions",
        "Descriptive Statistics, Variance & Correlation",
        "Matrices & Determinants",
        "Functions, Graphs, Limits & Differential Calculus"
      ]
    },
    {
      id: "dilr",
      title: "3. Data Interpretation & Logical Reasoning (DILR)",
      relevance: "JIPMAT (IIM BG/Jammu), IPMAT Rohtak, IIMB DBE, IIML",
      topics: [
        "Tables, Bar/Line/Pie & Radar Charts",
        "Quant-Based DI Caselets & Maxima-Minima",
        "Linear, Circular & Matrix Arrangements",
        "Syllogisms, Venn Diagrams & Binary Logic",
        "Blood Relations, Direction Sense & Coding",
        "Data Sufficiency & Input-Output"
      ]
    },
    {
      id: "varc",
      title: "4. Verbal Ability, RC & Critical Reasoning",
      relevance: "All 8 IIMs (45 Qs in Indore, 40 in Rohtak, 34 in JIPMAT)",
      topics: [
        "Business, Economics & Policy Reading Comprehension",
        "Para-Jumbles (TITA & MCQ) & Odd-One-Out",
        "Para-Completion & Summary Identification",
        "Grammar, Usage, Idioms & Phrasal Verbs",
        "Critical Reasoning: Assumptions, Strengthen/Weaken & Inference"
      ]
    },
    {
      id: "pi_wat_profile",
      title: "5. Personal Interview (PI), WAT & Campus Fit",
      relevance: "IIM Indore, Ranchi, Rohtak, Bangalore, Lucknow + IIM BG/Jammu Readiness",
      topics: [
        "Class 11-12 Stream Academic Rapid-Fire (Math, Econ, Commerce, Science, Humanities)",
        "1-Min Prep / 2-Min Extempore & Written Ability Test (WAT)",
        "Campus-Specific Fit: Mindfulness & Rural Immersion (IIM BG), Econ/Data Policy (IIMB), Social Impact (Indore/Ranchi)",
        "Ethical Dilemmas, Leadership & Current Affairs (Union Budget, AI, Indian Economy)"
      ]
    }
  ]
};