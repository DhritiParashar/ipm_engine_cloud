import json
import os
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="GOALisB IIM UG & IPM Master Engine API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
DATA_DIR = FRONTEND_DIR / "data"
JS_DIR = FRONTEND_DIR / "js"

if DATA_DIR.exists():
    app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")
if JS_DIR.exists():
    app.mount("/js", StaticFiles(directory=JS_DIR), name="js")


class EvaluationRequest(BaseModel):
    track: str
    prompt: str
    student_response: str
    mode: str = "PI_OR_WAT"


class DoubtRequest(BaseModel):
    track: str
    topic: str
    question: str
    student_attempt: Optional[str] = ""


class CallPredictorRequest(BaseModel):
    class10_pct: float
    class12_pct: float
    has_class12_math: bool
    ipmat_indore_sa: Optional[int] = 0
    ipmat_indore_mcq: Optional[int] = 0
    ipmat_indore_va: Optional[int] = 0
    ipmat_rohtak_score: Optional[int] = 0
    jipmat_score: Optional[int] = 0
    iimb_ug_score: Optional[int] = 0
    jee_main_percentile: Optional[float] = 0.0


def _call_gemini(system_instruction: str, user_prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return (
            "[Offline Evaluation Mode - Set GEMINI_API_KEY in Render Environment for live AI grading]\n"
            "1. Structure & Clarity: Ensure your opening sentence directly answers the prompt.\n"
            "2. Analytical Depth: Support claims with concrete data, economic logic, or academic principles.\n"
            "3. IIM Fit: Connect your reasoning to ethical leadership, social awareness, and quantitative rigor."
        )
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{system_instruction}\n\n{user_prompt}",
        )
        return response.text or "No response generated."
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini evaluation error: {str(exc)}")


@app.get("/")
def serve_home():
    index_file = FRONTEND_DIR / "index.html"
    if not index_file.exists():
        return {"status": "ok", "message": "GOALisB IIM UG & IPM Backend Active. Add frontend/index.html next."}
    return FileResponse(index_file)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "GOALisB IIM UG & IPM Master Engine",
        "campuses_covered": [
            "IIM Indore", "IIM Rohtak", "IIM Ranchi", "IIM Bodh Gaya",
            "IIM Jammu", "IIM Bangalore", "IIM Mumbai", "IIM Lucknow"
        ],
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
        "database_configured": bool(os.getenv("DATABASE_URL")),
    }


@app.post("/api/evaluate")
def evaluate_response(req: EvaluationRequest):
    rubric = (
        "You are an IIM UG/IPM Admissions Panelist (evaluating candidates for IIM Indore, "
        "IIM Rohtak, IIM Ranchi, IIM Bodh Gaya, IIM Jammu, IIM Bangalore, IIM Mumbai, and IIM Lucknow). "
        "Grade the student's response out of 10 across four criteria: "
        "(1) Structured Communication, (2) Analytical & Quantitative Rigor, "
        "(3) Emotional Intelligence & Ethical Judgment, and (4) Domain/Current Affairs Accuracy. "
        "Provide specific strengths, red flags an IIM panel would grill, and a model 4-sentence answer."
    )
    user_text = f"Target Track: {req.track}\nMode: {req.mode}\nPrompt: {req.prompt}\nStudent Response: {req.student_response}"
    feedback = _call_gemini(rubric, user_text)
    return {"track": req.track, "feedback": feedback}


@app.post("/api/doubt")
def solve_doubt(req: DoubtRequest):
    system_prompt = (
        "You are an expert IPMAT / JIPMAT / IIMB UG Socratic Tutor. "
        "Never jump straight to a dry answer. Provide: "
        "(1) Core Concept & Trap Warning (especially negative marking -1 vs SA 0 penalty), "
        "(2) Step-by-Step Derivation, and (3) A 30-Second Exam Shortcut."
    )
    user_text = f"Track: {req.track}\nTopic: {req.topic}\nQuestion: {req.question}\nStudent Attempt: {req.student_attempt}"
    solution = _call_gemini(system_prompt, user_text)
    return {"topic": req.topic, "solution": solution}


@app.post("/api/call-predictor")
def predict_iim_calls(req: CallPredictorRequest):
    results = []

    indore_total = (req.ipmat_indore_sa or 0) + (req.ipmat_indore_mcq or 0) + (req.ipmat_indore_va or 0)
    indore_sectional_ok = (req.ipmat_indore_sa or 0) >= 20 and (req.ipmat_indore_mcq or 0) >= 35 and (req.ipmat_indore_va or 0) >= 110
    results.append({
        "campus": "IIM Indore (5-Yr IPM)",
        "eligible": True,
        "status": "High PI Call Probability" if (indore_total >= 180 and indore_sectional_ok) else "Borderline / Improve Sectionals",
        "note": f"Total: {indore_total}/360 | Sectional Cutoffs {'Cleared' if indore_sectional_ok else 'At Risk'} (65% ATS + 35% PI)."
    })
    results.append({
        "campus": "IIM Ranchi (5-Yr IPM)",
        "eligible": True,
        "status": "Strong Shortlist Zone" if indore_total >= 175 else "Target 180+ in IPMAT Indore",
        "note": f"Uses IPMAT Indore score ({indore_total}/360) + Class 10 ({req.class10_pct}%) & Class 12 ({req.class12_pct}%) profile."
    })

    rohtak_acad = ((req.class10_pct + req.class12_pct) / 2.0) * 0.40
    results.append({
        "campus": "IIM Rohtak (5-Yr IPM)",
        "eligible": True,
        "status": "Competitive" if ((req.ipmat_rohtak_score or 0) >= 380 and req.class12_pct >= 85) else "Needs Higher Mock Score / Academic Boost",
        "note": f"Rohtak Score: {req.ipmat_rohtak_score}/480 | Academic Component: {rohtak_acad:.1f}/40."
    })

    results.append({
        "campus": "IIM Bodh Gaya & IIM Jammu (5-Yr IPM)",
        "eligible": True,
        "status": "Direct Merit Zone (No PI)" if (req.jipmat_score or 0) >= 310 else "Target 315+/400 in JIPMAT",
        "note": f"JIPMAT Score: {req.jipmat_score}/400 (100% test-based merit list; no Personal Interview)."
    })

    results.append({
        "campus": "IIM Bangalore (B.Sc. Econ/DS & BBA DBE)",
        "eligible": req.class12_pct >= 60,
        "status": "Eligible for B.Sc. Hons & BBA DBE" if req.has_class12_math else "Eligible for BBA DBE (B.Sc. requires Class 12 Math)",
        "note": f"IIMB UG Score: {req.iimb_ug_score}/360 | Class 12 Math: {'Yes' if req.has_class12_math else 'No'}."
    })

    results.append({
        "campus": "IIM Mumbai (BS Digital Science & Business Mgmt)",
        "eligible": req.has_class12_math and req.class12_pct >= 60,
        "status": "Competitive JEE Main Zone" if (req.has_class12_math and (req.jee_main_percentile or 0) >= 95.0) else "Requires PCM + High JEE Main Percentile",
        "note": f"JEE Main Percentile: {req.jee_main_percentile}% (Class 12 Physics & Math mandatory)."
    })
    results.append({
        "campus": "IIM Lucknow (4-Yr UG Business, Tech & Innovation)",
        "eligible": req.class12_pct >= 60,
        "status": "Ready for Aptitude + PI Track",
        "note": "Covered under unified Higher Math, Analytical Reasoning & VARC modules."
    })

    return {"predictions": results}

from app.live_ca_engine import load_archive, refresh_live_current_affairs

@app.get("/api/current-affairs")
def get_live_current_affairs():
    items = load_archive()
    if not items:
        return refresh_live_current_affairs(force=True)
    return {"status": "ok", "count": len(items), "items": items}

@app.post("/api/current-affairs/refresh")
def trigger_live_ca_refresh():
    return refresh_live_current_affairs(force=True)


from pydantic import BaseModel
from typing import List, Optional
from app.db_engine import (
    seed_initial_databank, db_backend_info, register_user, login_user,
    generate_stratified_mock, list_pyqs_from_db, SessionLocal, MockAttempt, UserSession
)
from app.import_ncert_bank import import_from_previous_projects

seed_initial_databank()
import_from_previous_projects()

class RegisterReq(BaseModel):
    full_name: str
    email: str
    password: str
    target_track: str = "ALL_IIM_MASTER"
    category: str = "General"
    class10_pct: float = 90.0
    class12_pct: float = 90.0

class LoginReq(BaseModel):
    email: str
    password: str

class MockGenReq(BaseModel):
    exam_mode: str = "ALL_IIM_MASTER"
    paper_type: str = "FULL_DIAGNOSTIC"
    include_ncert: bool = True
    exclude_codes: List[str] = []

class MockSubmitReq(BaseModel):
    token: Optional[str] = None
    exam_track: str
    paper_type: str
    score: float
    max_score: float
    accuracy_pct: float
    attempted_q_codes: List[str] = []

@app.get("/api/db/status")
def api_db_status():
    return db_backend_info()

@app.post("/api/db/import-ncert")
def api_import_ncert():
    res = import_from_previous_projects()
    return {**res, **db_backend_info()}

@app.post("/api/auth/register")
def api_register(req: RegisterReq):
    return register_user(req.full_name, req.email, req.password, req.target_track, req.category, req.class10_pct, req.class12_pct)

@app.post("/api/auth/login")
def api_login(req: LoginReq):
    return login_user(req.email, req.password)

@app.post("/api/mock/generate")
def api_generate_mock(req: MockGenReq):
    try:
        qs = generate_stratified_mock(req.exam_mode, req.paper_type, req.include_ncert, req.exclude_codes)
        if not qs:
            seed_initial_databank()
            qs = generate_stratified_mock(req.exam_mode, req.paper_type, req.include_ncert, req.exclude_codes)
        return {"count": len(qs), "questions": qs, "db": db_backend_info()}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"count": 0, "questions": [], "error": str(e), "db": db_backend_info()}

@app.post("/api/mock/submit")
def api_submit_mock(req: MockSubmitReq):
    db = SessionLocal()
    try:
        uid = None
        if req.token:
            sess = db.query(UserSession).filter(UserSession.token == req.token).first()
            if sess:
                uid = sess.user_id
        db.add(MockAttempt(
            user_id=uid,
            exam_track=req.exam_track,
            paper_type=req.paper_type,
            score=req.score,
            max_score=req.max_score,
            accuracy_pct=req.accuracy_pct,
            attempted_q_codes_json=json.dumps(req.attempted_q_codes)
        ))
        db.commit()
        return {"saved": True, "user_linked": uid is not None}
    finally:
        db.close()


@app.post("/api/auth/register-otp/init")
def api_reg_otp_init(req: OtpInitReq):
    return initiate_registration_otp(req.full_name, req.email, req.phone, req.password, req.class10_pct, req.class12_pct)

@app.post("/api/auth/register-otp/verify")
def api_reg_otp_verify(req: OtpVerifyReq):
    return verify_registration_otp(req.challenge_id, req.email_otp, req.phone_otp)

@app.get("/api/auth/me")
def api_auth_me(token: str = ""):
    u = get_user_by_token(token)
    if u:
        return {"ok": True, "user": u}
    return {"ok": False}

@app.post("/api/billing/upgrade-pro")
def api_upgrade_pro(req: UpgradeProReq):
    return upgrade_user_to_pro(req.token, req.payment_method, req.amount_inr)


from app.db_engine import initiate_password_reset_otp, complete_password_reset

class ForgotInitReq(BaseModel):
    email: str

class ForgotConfirmReq(BaseModel):
    challenge_id: int
    reset_otp: str
    new_password: str

@app.post("/api/auth/forgot-password/init")
def api_forgot_init(req: ForgotInitReq):
    return initiate_password_reset_otp(req.email)

@app.post("/api/auth/forgot-password/confirm")
def api_forgot_confirm(req: ForgotConfirmReq):
    return complete_password_reset(req.challenge_id, req.reset_otp, req.new_password)


from app.db_engine import redeem_beta_voucher, create_beta_voucher, BetaVoucher

class RedeemVoucherReq(BaseModel):
    token: str
    code: str

class CreateVoucherReq(BaseModel):
    code: str
    label: str = "Beta Tester Pass"
    valid_days: int = 14
    max_uses: int = 50

@app.post("/api/billing/redeem-voucher")
def api_redeem_voucher(req: RedeemVoucherReq):
    return redeem_beta_voucher(req.token, req.code)

@app.post("/api/admin/vouchers/create")
def api_create_voucher(req: CreateVoucherReq):
    return create_beta_voucher(req.code, req.label, req.valid_days, req.max_uses)

@app.get("/api/admin/vouchers")
def api_list_vouchers():
    db = SessionLocal()
    try:
        rows = db.query(BetaVoucher).order_by(BetaVoucher.id.desc()).all()
        return {"vouchers": [{"code": r.code, "label": r.label, "valid_days": r.valid_days, "used": r.used_count, "max_uses": r.max_uses, "active": r.is_active} for r in rows]}
    finally:
        db.close()

from app.db_engine import get_pyq_questions_from_db
@app.get("/api/questions")
def api_get_questions(section: str = "ALL", topic: str = "ALL", exam: str = "ALL", pyq_only: bool = False, limit: int = 25):
    import json
    from sqlalchemy import text
    from app.db_engine import engine
    clauses = ["1=1"]
    params = {"lim": max(1, min(limit, 150))}
    if section and section.upper() != "ALL":
        clauses.append("UPPER(section) = :sec")
        params["sec"] = section.upper().strip()
    if topic and topic.upper() != "ALL":
        clauses.append("topic ILIKE :top")
        params["top"] = f"%{topic.strip()}%"
    if exam and exam.upper() != "ALL":
        clauses.append("(exam_tags ILIKE :ex OR pyq_exam ILIKE :ex)")
        params["ex"] = f"%{exam.strip()}%"
    if pyq_only:
        clauses.append("is_pyq = TRUE")
    sql = f"""
        SELECT q_code, section, topic, exam_tags, q_type, difficulty, prompt,
               options_json, answer, explanation, is_pyq, pyq_year, pyq_exam
        FROM ipm_questions
        WHERE {' AND '.join(clauses)}
        ORDER BY RANDOM()
        LIMIT :lim
    """
    with engine.connect() as conn:
        rows = conn.execute(text(sql), params).mappings().all()
    out = []
    for r in rows:
        opts = r["options_json"]
        if isinstance(opts, str):
            try:
                opts = json.loads(opts)
            except Exception:
                opts = []
        ans_raw = str(r["answer"] or "").strip()
        ans_val = int(ans_raw) if (opts and ans_raw.isdigit() and int(ans_raw) < len(opts)) else ans_raw
        out.append({
            "id": r["q_code"],
            "section": r["section"],
            "topic": r["topic"],
            "exam_tags": r["exam_tags"],
            "q_type": r["q_type"],
            "difficulty": r["difficulty"],
            "prompt": r["prompt"],
            "options": opts or [],
            "answer": ans_val,
            "explanation": r["explanation"],
            "is_pyq": bool(r["is_pyq"]),
            "year": r["pyq_year"],
            "exam": r["pyq_exam"] or r["exam_tags"]
        })
    return {"count": len(out), "questions": out}
@app.get("/api/pyq")
def api_get_pyq(exam: str = "ALL", year: str = "ALL"):
    from app.db_engine import get_pyq_questions_from_db, seed_full_pyq_archive_to_postgres, seed_rich_pyq_expansion, seed_batch1_new_iim_ug_pyqs, seed_batch2_flagship_papers, seed_batch3_cuet_and_indore_archive, db_backend_info
    items = get_pyq_questions_from_db("ALL", "ALL")
    if len(items) < 100:
        seed_full_pyq_archive_to_postgres()
        seed_rich_pyq_expansion()
        seed_batch1_new_iim_ug_pyqs()
        seed_batch2_flagship_papers()
        seed_batch3_cuet_and_indore_archive()
        items = get_pyq_questions_from_db("ALL", "ALL")
    return {"count": len(items), "questions": items, "db": db_backend_info()}
