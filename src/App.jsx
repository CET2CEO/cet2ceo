import { useState, useEffect, useRef } from "react";

// ─── FONT INJECTION ───────────────────────────────────────────────────────────
const injectFonts = () => {
  if (document.getElementById("cetace-fonts")) return;
  const l = document.createElement("link");
  l.id = "cetace-fonts";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700&display=swap";
  l.rel = "stylesheet";
  document.head.appendChild(l);
};

// ─── QUESTIONS BANK ───────────────────────────────────────────────────────────
const QUESTIONS = [
  // LOGICAL REASONING
  { id: 0, section: "Logical Reasoning", text: "P is Q's father. Q is R's sister. S is R's mother. How is P related to S?", options: ["Son", "Husband", "Brother", "Father-in-law"], correct: 1, explanation: "P is the father of both Q and R (since Q is R's sister). S is the mother of R (and Q). Since P and S are parents of the same children, P is S's husband." },
  { id: 1, section: "Logical Reasoning", text: "Rohan walks 10 km North, turns right and walks 6 km, then turns right and walks 10 km South. How far is he from his starting point and in which direction?", options: ["6 km East", "6 km West", "16 km East", "4 km North-East"], correct: 0, explanation: "Net North-South movement = 10N − 10S = 0. Net East-West = 6 km East. So he is 6 km East of start." },
  { id: 2, section: "Logical Reasoning", text: "If APPLE is coded as BQQMF, what is the code for MANGO?", options: ["NBOHP", "NBOIP", "MBNHP", "NCOHP"], correct: 0, explanation: "Each letter is shifted by +1: M→N, A→B, N→O, G→H, O→P = NBOHP" },
  { id: 3, section: "Logical Reasoning", text: "All roses are flowers. Some flowers are beautiful. Which conclusion definitely follows?", options: ["All roses are beautiful", "Some roses are beautiful", "No roses are beautiful", "None of the above"], correct: 3, explanation: "We cannot conclude that any roses are beautiful — the beautiful flowers might not include roses. None of the conclusions can be definitively drawn." },
  { id: 4, section: "Logical Reasoning", text: "Find the next number in the series: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "36"], correct: 1, explanation: "Pattern: n×(n+1) → 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42" },
  { id: 5, section: "Logical Reasoning", text: "In a class of 45 students, Amit ranks 20th from the top. What is his rank from the bottom?", options: ["24th", "25th", "26th", "27th"], correct: 2, explanation: "Rank from bottom = (Total + 1) − Rank from top = 46 − 20 = 26th" },

  // ABSTRACT REASONING
  { id: 6, section: "Abstract Reasoning", text: "Find the odd one out: 4, 9, 16, 25, 35, 49", options: ["9", "25", "35", "49"], correct: 2, explanation: "4=2², 9=3², 16=4², 25=5², 49=7² — all perfect squares. 35 is NOT a perfect square. Hence 35 is odd one out." },
  { id: 7, section: "Abstract Reasoning", text: "What letter comes next in the series: A, C, F, J, O, ?", options: ["T", "U", "V", "W"], correct: 1, explanation: "Gaps increase by 1 each time: +2, +3, +4, +5, +6. A(1)→C(3)→F(6)→J(10)→O(15)→U(21). Answer: U" },
  { id: 8, section: "Abstract Reasoning", text: "If ● = 3, ■ = 5, ▲ = 2, what is the value of ■ × ▲ + ● ?", options: ["13", "15", "16", "19"], correct: 0, explanation: "Using BODMAS: ■ × ▲ + ● = 5 × 2 + 3 = 10 + 3 = 13" },
  { id: 9, section: "Abstract Reasoning", text: "Which number does NOT belong: 121, 144, 169, 196, 200, 225?", options: ["169", "196", "200", "225"], correct: 2, explanation: "121=11², 144=12², 169=13², 196=14², 225=15² are all perfect squares. 200 is not a perfect square." },

  // QUANTITATIVE APTITUDE
  { id: 10, section: "Quantitative Aptitude", text: "A can complete a piece of work in 12 days and B in 18 days. Working together, in how many days will they complete it?", options: ["6 days", "7 days", "7.2 days", "8 days"], correct: 2, explanation: "Combined rate = 1/12 + 1/18 = 3/36 + 2/36 = 5/36. Days = 36/5 = 7.2 days" },
  { id: 11, section: "Quantitative Aptitude", text: "What is the Simple Interest on ₹8,000 at 5% per annum for 3 years?", options: ["₹1,000", "₹1,200", "₹1,500", "₹2,400"], correct: 1, explanation: "SI = PRT/100 = (8000 × 5 × 3)/100 = 1,20,000/100 = ₹1,200" },
  { id: 12, section: "Quantitative Aptitude", text: "A shopkeeper buys an article for ₹500 and sells it for ₹600. His profit percentage is:", options: ["15%", "18%", "20%", "25%"], correct: 2, explanation: "Profit = ₹100. Profit% = (100/500) × 100 = 20%" },
  { id: 13, section: "Quantitative Aptitude", text: "The average of 5 numbers is 40. If one number is excluded, the average becomes 35. The excluded number is:", options: ["55", "60", "65", "70"], correct: 1, explanation: "Sum of 5 = 5×40 = 200. Sum of 4 = 4×35 = 140. Excluded = 200 − 140 = 60" },
  { id: 14, section: "Quantitative Aptitude", text: "A 200 metre long train passes a pole in 10 seconds. Its speed in km/h is:", options: ["60", "64", "70", "72"], correct: 3, explanation: "Speed = 200/10 = 20 m/s. In km/h: 20 × (18/5) = 72 km/h" },
  { id: 15, section: "Quantitative Aptitude", text: "If 30% of a number is 90, what is 50% of that number?", options: ["120", "150", "180", "200"], correct: 1, explanation: "0.30 × x = 90 → x = 300. 50% of 300 = 150" },

  // VERBAL ABILITY
  { id: 16, section: "Verbal Ability", text: "Fill in the blank: The committee _____ reached a unanimous decision.", options: ["have", "has", "are", "were"], correct: 1, explanation: "'Committee' is a collective noun, treated as singular in formal usage. The correct verb is 'has'." },
  { id: 17, section: "Verbal Ability", text: "Choose the synonym of ELOQUENT:", options: ["Silent", "Articulate", "Confused", "Timid"], correct: 1, explanation: "Eloquent means fluent and persuasive in speech. The best synonym is 'Articulate'." },
  { id: 18, section: "Verbal Ability", text: "Choose the antonym of BENEVOLENT:", options: ["Kind", "Generous", "Malevolent", "Virtuous"], correct: 2, explanation: "Benevolent = wishing good to others. Its antonym is Malevolent = wishing evil to others." },
  { id: 19, section: "Verbal Ability", text: "Choose the grammatically correct sentence:", options: ["Neither Ram nor Shyam are coming.", "Neither Ram nor Shyam is coming.", "Neither Ram nor Shyam were coming.", "Neither Ram nor Shyam have come."], correct: 1, explanation: "With Neither…nor, the verb agrees with the subject nearest to it. 'Shyam' is singular, so 'is' is correct." },
  { id: 20, section: "Verbal Ability", text: "'India has 5,000 B-schools producing 4,00,000 MBA graduates annually. Only 20% find relevant jobs immediately.' How many is that?", options: ["40,000", "60,000", "80,000", "1,00,000"], correct: 2, explanation: "20% of 4,00,000 = 80,000 graduates find relevant placements immediately." },
  { id: 21, section: "Verbal Ability", text: "Fill in the blank: The new policy will _____ effect from next month.", options: ["take", "bring", "put", "make"], correct: 0, explanation: "The correct idiom is 'take effect', meaning to become operative or applicable." },
];

const SECTIONS = ["Logical Reasoning", "Abstract Reasoning", "Quantitative Aptitude", "Verbal Ability"];

const SECTION_INFO = {
  "Logical Reasoning":   { color: "#4E9AF1", icon: "🧩", short: "LR", cetQs: 75 },
  "Abstract Reasoning":  { color: "#A855F7", icon: "🔷", short: "AR", cetQs: 25 },
  "Quantitative Aptitude":{ color: "#F2B705", icon: "📐", short: "QA", cetQs: 50 },
  "Verbal Ability":      { color: "#00C9A7", icon: "📖", short: "VA", cetQs: 50 },
};

const LEADERBOARD = [
  { name: "Priya S.", city: "Pune",       score: 21, percentile: "99.95" },
  { name: "Rahul M.", city: "Mumbai",     score: 20, percentile: "99.87" },
  { name: "Anjali K.", city: "Nagpur",    score: 19, percentile: "99.72" },
  { name: "Vikram P.", city: "Aurangabad",score: 18, percentile: "99.45" },
  { name: "Sneha R.", city: "Nashik",     score: 17, percentile: "99.12" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// ─── STYLE TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bg:     "#080C14",
  bg2:    "#0F1623",
  card:   "#141D2E",
  border: "#1E2D45",
  gold:   "#F2B705",
  teal:   "#00C9A7",
  purple: "#A855F7",
  blue:   "#4E9AF1",
  text:   "#E8EEF5",
  muted:  "#6B7A99",
  green:  "#16A34A",
  red:    "#DC2626",
};

const cardStyle = {
  background: T.card,
  border: `1px solid ${T.border}`,
  borderRadius: 16,
};

const btnGold = {
  background: T.gold, color: "#080C14",
  border: "none", borderRadius: 10,
  padding: "12px 24px",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 700, fontSize: 15,
  cursor: "pointer",
};

const inputStyle = {
  background: "#0D1320",
  border: `1px solid ${T.border}`,
  borderRadius: 10,
  padding: "13px 16px",
  color: T.text,
  fontFamily: "'Outfit', sans-serif",
  fontSize: 15,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ user, onLogout, onHome }) {
  return (
    <div style={{
      background: T.bg2,
      borderBottom: `1px solid ${T.border}`,
      padding: "14px 28px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: T.gold, cursor: "pointer", letterSpacing: "-0.5px" }}
        onClick={onHome}
      >
        CET 2 CEO
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 100, padding: "7px 16px", display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", color: "#080C14", fontWeight: 700, fontSize: 13 }}>
            {user.name[0].toUpperCase()}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name.split(" ")[0]}</span>
        </div>
        <button onClick={onLogout} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, padding: "8px 14px", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 13 }}>
          Logout
        </button>
      </div>
    </div>
  );
}

// ─── LOGIN VIEW ───────────────────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState("login");
  const [err, setErr] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) { setErr("Please fill in both fields."); return; }
    if (!email.includes("@")) { setErr("Enter a valid email."); return; }
    onLogin({ name: name.trim(), email: email.trim() });
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(242,183,5,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "15%", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(78,154,241,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 58, fontWeight: 700, color: T.gold, letterSpacing: "-1px", lineHeight: 1 }}>CET 2 CEO</div>
        <div style={{ color: T.muted, fontSize: 14, marginTop: 10, letterSpacing: 3, textTransform: "uppercase" }}>30+ Mocks · MBA MAH CET 2025</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(242,183,5,0.08)", border: "1px solid rgba(242,183,5,0.25)", borderRadius: 100, padding: "7px 18px", marginTop: 16, fontSize: 13, color: T.gold }}>
          ⭐ &nbsp;Curated by a 99.99 Percentiler
        </div>
      </div>

      {/* Card */}
      <div style={{ ...cardStyle, padding: "36px 36px 32px", width: "100%", maxWidth: 420 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "#0A0F1C", borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: tab === t ? T.gold : "transparent", color: tab === t ? "#080C14" : T.muted, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s", textTransform: "capitalize" }}>
              {t === "login" ? "Login" : "Register Free"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: T.muted, marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 0.8 }}>Full Name</label>
            <input style={inputStyle} placeholder="Enter your name" value={name} onChange={e => { setName(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: T.muted, marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 0.8 }}>Email Address</label>
            <input style={inputStyle} placeholder="Enter your email" type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          {err && <div style={{ color: "#F87171", fontSize: 13 }}>⚠️ {err}</div>}
          <button onClick={handleSubmit} style={{ ...btnGold, width: "100%", padding: "15px", fontSize: 16, marginTop: 6 }}>
            {tab === "login" ? "Login →" : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign: "center", color: T.muted, fontSize: 13, marginTop: 20, marginBottom: 0 }}>
          {tab === "login" ? "No account? " : "Already have one? "}
          <span onClick={() => setTab(tab === "login" ? "register" : "login")} style={{ color: T.gold, cursor: "pointer", fontWeight: 600 }}>
            {tab === "login" ? "Register free" : "Login here"}
          </span>
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 40, marginTop: 48 }}>
        {[["1000+", "Students"], ["30+", "Mock Tests"], ["99.99%ile", "Creator"], ["₹25", "Per Mock"]].map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.gold }}>{num}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({ user, onStartMock, pastResults }) {
  const mocks = [
    { id: 1,  name: "Mini Mock — Free Trial",     qs: 22,  dur: "30 min",  tag: "FREE",  status: "free", diff: "Beginner",  available: true  },
    { id: 2,  name: "Full Mock — 1",              qs: 200, dur: "150 min", tag: "₹25",   status: "paid", diff: "Moderate",  available: false },
    { id: 3,  name: "Full Mock — 2",              qs: 200, dur: "150 min", tag: "₹25",   status: "paid", diff: "Hard",      available: false },
    { id: 4,  name: "Full Mock — 3",              qs: 200, dur: "150 min", tag: "₹25",   status: "paid", diff: "Expert",    available: false },
    { id: 5,  name: "Full Mock — 4",              qs: 200, dur: "150 min", tag: "₹25",   status: "paid", diff: "Moderate",  available: false },
    { id: 6,  name: "Full Mock — 5",              qs: 200, dur: "150 min", tag: "₹25",   status: "paid", diff: "Hard",      available: false },
    { id: 7,  name: "Section Test: Logical R.",   qs: 75,  dur: "50 min",  tag: "₹15",   status: "paid", diff: "Targeted",  available: false },
    { id: 8,  name: "Section Test: Quant",        qs: 50,  dur: "40 min",  tag: "₹15",   status: "paid", diff: "Targeted",  available: false },
    { id: 9,  name: "Section Test: Verbal",       qs: 50,  dur: "40 min",  tag: "₹15",   status: "paid", diff: "Targeted",  available: false },
    { id: 10, name: "🔥 All 30 Mocks Bundle",     qs: 200, dur: "150 min", tag: "₹199",  status: "paid", diff: "Best Value", available: false },
  ];

  const best = pastResults.length > 0 ? Math.max(...pastResults.map(r => r.score)) : null;
  const avg  = pastResults.length > 0 ? Math.round(pastResults.reduce((a, r) => a + r.score, 0) / pastResults.length) : null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>
          Welcome, <span style={{ color: T.gold }}>{user.name.split(" ")[0]}</span> 👋
        </h2>
        <p style={{ color: T.muted, margin: "6px 0 0", fontSize: 15 }}>MBA MAH CET 2025 is approaching. Stay consistent — every mock counts!</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
        {[
          { icon: "📝", label: "Tests Taken",  value: pastResults.length || "0"        },
          { icon: "🏆", label: "Best Score",   value: best != null ? `${best}/22` : "—" },
          { icon: "📊", label: "Avg Score",    value: avg  != null ? `${avg}/22`  : "—" },
          { icon: "⏰", label: "Hours Spent",  value: pastResults.length > 0 ? `${Math.round(pastResults.length * 0.5)}h` : "0h" },
        ].map(s => (
          <div key={s.label} style={{ ...cardStyle, padding: "18px 22px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
        {/* Mocks list */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Available Mock Tests</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mocks.map(mock => (
              <div key={mock.id} style={{ ...cardStyle, padding: "22px 24px", display: "flex", alignItems: "center", gap: 18, opacity: mock.available ? 1 : 0.75 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: mock.available ? "rgba(242,183,5,0.1)" : "rgba(107,122,153,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {mock.available ? "✅" : "🔒"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{mock.name}</div>
                  <div style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>{mock.qs} Questions · {mock.dur} · All Sections</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <span style={{ background: "rgba(0,201,167,0.1)", color: T.teal, padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>{mock.diff}</span>
                    <span style={{ background: mock.available ? "rgba(242,183,5,0.12)" : "rgba(78,154,241,0.1)", color: mock.available ? T.gold : T.blue, padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{mock.tag}</span>
                  </div>
                </div>
                <button
                  onClick={() => mock.available && onStartMock()}
                  style={{ ...btnGold, background: mock.available ? T.gold : T.border, color: mock.available ? "#080C14" : T.muted, cursor: mock.available ? "pointer" : "not-allowed", whiteSpace: "nowrap", flexShrink: 0, padding: "11px 20px", fontSize: 14 }}
                >
                  {mock.available ? "Start →" : "Coming Soon"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Leaderboard */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 14px" }}>🏆 Leaderboard</h3>
            <div style={{ ...cardStyle, padding: "18px 20px" }}>
              {LEADERBOARD.map((entry, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < LEADERBOARD.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: i === 0 ? T.gold : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : T.border, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: i < 3 ? "#080C14" : T.muted, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.name}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{entry.city}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, color: T.gold, fontSize: 15 }}>{entry.score}/22</div>
                    <div style={{ fontSize: 11, color: T.teal }}>{entry.percentile}%ile</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CET Info */}
          <div style={{ ...cardStyle, padding: "18px 20px", background: "rgba(242,183,5,0.04)", border: "1px solid rgba(242,183,5,0.18)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.gold, marginBottom: 10 }}>📅 MAH CET 2025 Pattern</div>
            <div style={{ fontSize: 13, color: "#9CA3B8", lineHeight: 1.8 }}>
              <div>📝 200 Questions · 150 Minutes</div>
              <div>🎯 No Negative Marking</div>
              <div>🧩 LR: 75 · AR: 25 · QA: 50 · VA: 50</div>
              <div>✅ +1 mark per correct answer</div>
            </div>
          </div>

          {/* Past results */}
          {pastResults.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>📈 Your History</h3>
              <div style={{ ...cardStyle, padding: "16px 18px" }}>
                {pastResults.slice(-3).reverse().map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < Math.min(pastResults.length, 3) - 1 ? `1px solid ${T.border}` : "none" }}>
                    <span style={{ fontSize: 13, color: T.muted }}>Attempt {pastResults.length - i}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: r.score >= 15 ? T.green : r.score >= 10 ? T.gold : T.red }}>{r.score}/22</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── INSTRUCTIONS VIEW ────────────────────────────────────────────────────────
function InstructionsView({ onStart, onBack }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 20, fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
        ← Back to Dashboard
      </button>

      <div style={{ ...cardStyle, padding: 40 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 30, fontWeight: 700 }}>Mini Mock — 1 of 30+</h2>
        <p style={{ color: T.muted, margin: "0 0 32px", fontSize: 15 }}>Read all instructions carefully before starting the test.</p>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
          {[["📝", "22 Questions", "All 4 CET sections"],["⏱️", "30 Minutes", "Countdown timer"],["✅", "No Negative Marking", "+1 per correct"],["📊", "Full Analysis", "Detailed after submit"]].map(([icon, t, sub]) => (
            <div key={t} style={{ background: "#0D1320", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{t}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ color: T.gold, fontSize: 12, fontWeight: 700, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.2 }}>General Instructions</div>
          {[
            "Each correct answer carries +1 mark. There is NO negative marking for wrong answers.",
            "Click on an option to select your answer. Click again to change it.",
            "Use the Question Palette on the right to jump to any question.",
            "Use 'Mark for Review' to flag a question and come back to it.",
            "The test auto-submits when the timer reaches zero.",
            "Do NOT refresh the browser during the test — your progress may be lost.",
            "After submission, you will see a full analysis with correct answers and explanations.",
          ].map((ins, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 14, color: "#9CA3B8", alignItems: "flex-start" }}>
              <span style={{ color: T.gold, flexShrink: 0, marginTop: 1 }}>→</span>
              <span>{ins}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ background: "#0D1320", borderRadius: 12, padding: "16px 18px", marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 12, fontWeight: 600 }}>QUESTION PALETTE LEGEND</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {[[T.border, T.text, "Not Visited"],[T.red, "#fff", "Visited, Unanswered"],[T.green, "#fff", "Answered"],[T.purple, "#fff", "Marked for Review"]].map(([bg, col, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: bg, color: col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>Q</div>
                <span style={{ fontSize: 12, color: T.muted }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agreement */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 18, height: 18, cursor: "pointer", accentColor: T.gold }} />
          <label htmlFor="agree" style={{ fontSize: 14, color: "#9CA3B8", cursor: "pointer" }}>
            I have read and understood all the instructions above.
          </label>
        </div>

        <button
          onClick={() => agreed && onStart()}
          style={{ ...btnGold, width: "100%", padding: 16, fontSize: 16, opacity: agreed ? 1 : 0.45, cursor: agreed ? "pointer" : "not-allowed", background: agreed ? T.gold : T.border, color: agreed ? "#080C14" : T.muted }}
        >
          🚀 Start Test Now
        </button>
      </div>
    </div>
  );
}

// ─── TEST VIEW ────────────────────────────────────────────────────────────────
function TestView({ onSubmit }) {
  const [currentQ, setCurrentQ]   = useState(0);
  const [answers,  setAnswers]    = useState({});
  const [marked,   setMarked]     = useState(new Set());
  const [visited,  setVisited]    = useState(new Set([0]));
  const [timeLeft, setTimeLeft]   = useState(30 * 60);
  const [showModal, setShowModal] = useState(false);

  const answersRef = useRef({});
  const markedRef  = useRef(new Set());
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { markedRef.current  = marked;  }, [marked]);

  const doSubmit = (tl) => onSubmit({ answers: answersRef.current, timeLeft: tl });

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); setTimeout(() => doSubmit(0), 100); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const q   = QUESTIONS[currentQ];
  const sec = q.section;

  const goTo = (idx) => {
    setCurrentQ(idx);
    setVisited(v => new Set([...v, QUESTIONS[idx].id]));
  };

  const qStatus = (id) => {
    if (marked.has(id))            return "marked";
    if (answers[id] !== undefined) return "answered";
    if (visited.has(id))           return "visited";
    return "unvisited";
  };

  const paletteBg = (id) => {
    const s = qStatus(id);
    return s === "answered" ? T.green : s === "marked" ? T.purple : s === "visited" ? T.red : T.border;
  };

  const answeredCount   = Object.keys(answers).length;
  const markedCount     = marked.size;
  const unattempted     = QUESTIONS.length - answeredCount;
  const timeDanger      = timeLeft < 300;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
      {/* ── Top bar ── */}
      <div style={{ background: T.bg2, borderBottom: `1px solid ${T.border}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, gap: 12 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: T.gold }}>CET 2 CEO</div>

        {/* Section tabs */}
        <div style={{ display: "flex", gap: 3, overflowX: "auto" }}>
          {SECTIONS.map(s => {
            const sqs     = QUESTIONS.filter(q => q.section === s);
            const sAnswered = sqs.filter(q => answers[q.id] !== undefined).length;
            const active  = s === sec;
            const col     = SECTION_INFO[s].color;
            return (
              <button key={s} onClick={() => { const i = QUESTIONS.findIndex(q => q.section === s); goTo(i); }}
                style={{ padding: "6px 12px", border: "none", background: active ? col + "18" : "transparent", color: active ? col : T.muted, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, cursor: "pointer", borderRadius: 8, borderBottom: `2px solid ${active ? col : "transparent"}`, whiteSpace: "nowrap", transition: "all 0.15s" }}>
                {SECTION_INFO[s].short} {sAnswered}/{sqs.length}
              </button>
            );
          })}
        </div>

        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: timeDanger ? "rgba(220,38,38,0.12)" : "rgba(242,183,5,0.08)", border: `1px solid ${timeDanger ? "rgba(220,38,38,0.3)" : "rgba(242,183,5,0.2)"}`, borderRadius: 10, padding: "7px 16px" }}>
          <span>⏱️</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: timeDanger ? T.red : T.gold, fontVariantNumeric: "tabular-nums", letterSpacing: 1 }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Question panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            {/* Q meta */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ background: SECTION_INFO[sec].color + "18", color: SECTION_INFO[sec].color, padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                  {SECTION_INFO[sec].icon} {sec}
                </span>
                <span style={{ color: T.muted, fontSize: 13 }}>Q{currentQ + 1} of {QUESTIONS.length}</span>
              </div>
              {marked.has(q.id) && <span style={{ background: "rgba(168,85,247,0.12)", color: T.purple, padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>🔖 Flagged</span>}
            </div>

            {/* Question */}
            <div style={{ ...cardStyle, padding: "24px 28px", marginBottom: 20, fontSize: 17, lineHeight: 1.75, fontWeight: 400 }}>
              {q.text}
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i;
                return (
                  <div key={i} onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                    style={{ display: "flex", alignItems: "center", gap: 14, background: selected ? "rgba(242,183,5,0.08)" : T.card, border: `1px solid ${selected ? T.gold : T.border}`, borderRadius: 12, padding: "15px 20px", cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: selected ? T.gold : "#0D1320", border: `2px solid ${selected ? T.gold : "#2D3E55"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: selected ? "#080C14" : T.muted }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span style={{ fontSize: 15, color: selected ? T.text : "#9CA3B8", flex: 1 }}>{opt}</span>
                    {selected && <span style={{ color: T.gold, fontSize: 20 }}>✓</span>}
                  </div>
                );
              })}
            </div>

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
              <button onClick={() => currentQ > 0 && goTo(currentQ - 1)} disabled={currentQ === 0}
                style={{ ...btnGold, background: T.border, color: T.text, opacity: currentQ === 0 ? 0.4 : 1 }}>
                ← Prev
              </button>

              <button onClick={() => setMarked(m => { const nm = new Set(m); nm.has(q.id) ? nm.delete(q.id) : nm.add(q.id); return nm; })}
                style={{ ...btnGold, background: marked.has(q.id) ? "rgba(124,58,237,0.18)" : T.border, color: marked.has(q.id) ? T.purple : T.muted, border: `1px solid ${marked.has(q.id) ? T.purple : T.border}` }}>
                🔖 {marked.has(q.id) ? "Unmark" : "Mark for Review"}
              </button>

              {answers[q.id] !== undefined && (
                <button onClick={() => setAnswers(a => { const na = { ...a }; delete na[q.id]; return na; })}
                  style={{ ...btnGold, background: T.border, color: T.red }}>
                  ✕ Clear
                </button>
              )}

              <button onClick={() => currentQ < QUESTIONS.length - 1 ? goTo(currentQ + 1) : setShowModal(true)}
                style={{ ...btnGold, marginLeft: "auto" }}>
                {currentQ < QUESTIONS.length - 1 ? "Next →" : "Submit ✓"}
              </button>
            </div>
          </div>
        </div>

        {/* Right palette */}
        <div style={{ width: 248, background: T.bg2, borderLeft: `1px solid ${T.border}`, overflowY: "auto", padding: 16, flexShrink: 0 }}>
          {/* Mini stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 18 }}>
            {[[T.green, answeredCount, "Done"],[T.purple, markedCount, "Flagged"],[T.red, unattempted, "Left"]].map(([c, v, l]) => (
              <div key={l} style={{ background: T.card, borderRadius: 10, padding: "10px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: T.muted }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Palette by section */}
          {SECTIONS.map(s => {
            const sqs = QUESTIONS.filter(q => q.section === s);
            return (
              <div key={s} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, color: SECTION_INFO[s].color, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>
                  {SECTION_INFO[s].short}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {sqs.map(sq => {
                    const idx = QUESTIONS.findIndex(q => q.id === sq.id);
                    const isCur = idx === currentQ;
                    return (
                      <div key={sq.id} onClick={() => goTo(idx)}
                        style={{ width: 32, height: 32, borderRadius: 7, background: paletteBg(sq.id), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#fff", border: isCur ? `2px solid ${T.gold}` : "2px solid transparent", transition: "all 0.15s", boxSizing: "border-box" }}>
                        {idx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div style={{ marginTop: 6, marginBottom: 16 }}>
            {[[T.border, "Not Visited"],[T.red, "Seen"],[T.green, "Answered"],[T.purple, "Flagged"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: T.muted }}>{l}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setShowModal(true)} style={{ ...btnGold, width: "100%", padding: "12px", fontSize: 14 }}>
            Submit Test
          </button>
        </div>
      </div>

      {/* Submit modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ ...cardStyle, padding: 38, maxWidth: 420, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>📋</div>
            <h3 style={{ margin: "0 0 10px", fontSize: 22 }}>Ready to Submit?</h3>
            <div style={{ color: "#9CA3B8", fontSize: 14, lineHeight: 1.8, marginBottom: 26 }}>
              <span style={{ color: T.green, fontWeight: 700 }}>{answeredCount} Answered</span> &nbsp;·&nbsp;
              <span style={{ color: T.red, fontWeight: 700 }}>{unattempted} Unattempted</span> &nbsp;·&nbsp;
              <span style={{ color: T.purple, fontWeight: 700 }}>{markedCount} Flagged</span>
              <br /><br />
              Once submitted, you cannot go back.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowModal(false)} style={{ ...btnGold, background: T.border, color: T.text, flex: 1 }}>Cancel</button>
              <button onClick={() => doSubmit(timeLeft)} style={{ ...btnGold, flex: 1 }}>Submit ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ANALYSIS VIEW ────────────────────────────────────────────────────────────
function AnalysisView({ answers, timeLeft, onRetry, onDashboard }) {
  const [tab, setTab]         = useState("overview");
  const [expandedQ, setExpQ]  = useState(null);

  const timeTaken = 30 * 60 - timeLeft;

  // Scoring
  let correct = 0, incorrect = 0, unattempted = 0;
  const secStats = {};
  SECTIONS.forEach(s => { secStats[s] = { correct: 0, incorrect: 0, unattempted: 0, total: 0 }; });

  QUESTIONS.forEach(q => {
    secStats[q.section].total++;
    if (answers[q.id] === undefined) { unattempted++; secStats[q.section].unattempted++; }
    else if (answers[q.id] === q.correct) { correct++; secStats[q.section].correct++; }
    else { incorrect++; secStats[q.section].incorrect++; }
  });

  const attempted  = correct + incorrect;
  const accuracy   = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const score      = correct;
  const total      = QUESTIONS.length;
  const pctRaw     = Math.min(99.97, (score / total) * 97 + (accuracy / 100) * 2.5);
  const percentile = pctRaw.toFixed(2);

  const fmtTime = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  const scoreColor = score >= 18 ? T.green : score >= 12 ? T.gold : T.red;
  const scorePct   = (score / total) * 100;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>📊 Test Analysis</h2>
        <p style={{ color: T.muted, margin: "6px 0 0" }}>Mini Mock 1 — Detailed Performance Report</p>
      </div>

      {/* Score card */}
      <div style={{ background: "linear-gradient(135deg, #141D2E 0%, #0D1320 100%)", border: "1px solid rgba(242,183,5,0.18)", borderRadius: 20, padding: 32, marginBottom: 28, display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap" }}>
        {/* Circular score */}
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 130, height: 130, borderRadius: "50%", background: `conic-gradient(${scoreColor} 0% ${scorePct}%, #1E2D45 ${scorePct}% 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 104, height: 104, borderRadius: "50%", background: "#0D1320", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: scoreColor }}>{score}</div>
              <div style={{ fontSize: 13, color: T.muted }}>/ {total}</div>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: T.muted }}>Your Score</div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1, minWidth: 260 }}>
          {[["✅", "Correct",    correct,    T.green  ],["❌", "Incorrect", incorrect,   T.red    ],["⚪", "Skipped",   unattempted, T.muted  ],["🎯", "Accuracy",  accuracy + "%", T.blue]].map(([ico, lbl, val, col]) => (
            <div key={lbl} style={{ background: "#0D1320", borderRadius: 12, padding: "13px 16px", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>{ico}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: col }}>{val}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Percentile + time */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "rgba(242,183,5,0.08)", border: "1px solid rgba(242,183,5,0.2)", borderRadius: 14, padding: "16px 26px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: T.gold }}>~{percentile}%ile</div>
            <div style={{ fontSize: 12, color: "#9CA3B8", marginTop: 4 }}>Est. Percentile</div>
          </div>
          <div style={{ background: "#0D1320", borderRadius: 14, padding: "14px 26px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{fmtTime(timeTaken)}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>Time Taken</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 22, background: "#0D1320", borderRadius: 12, padding: 4, width: "fit-content" }}>
        {[["overview", "📊 Section Breakdown"], ["questions", "📝 Question Review"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer", background: tab === key ? T.gold : "transparent", color: tab === key ? "#080C14" : T.muted, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Section breakdown */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SECTIONS.map(s => {
            const ss  = secStats[s];
            const acc = ss.correct + ss.incorrect > 0 ? Math.round(ss.correct / (ss.correct + ss.incorrect) * 100) : 0;
            const col = SECTION_INFO[s].color;
            return (
              <div key={s} style={{ ...cardStyle, padding: "22px 26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{SECTION_INFO[s].icon} {s}</div>
                    <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
                      ✅ {ss.correct} correct &nbsp;·&nbsp; ❌ {ss.incorrect} wrong &nbsp;·&nbsp; ⚪ {ss.unattempted} skipped
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: col }}>{ss.correct}/{ss.total}</div>
                    <div style={{ fontSize: 12, color: T.muted }}>Accuracy: {acc}%</div>
                  </div>
                </div>
                <div style={{ background: T.border, borderRadius: 100, height: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(ss.correct / ss.total) * 100}%`, background: col, borderRadius: 100, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}

          {/* Tips */}
          <div style={{ ...cardStyle, padding: 24, background: "rgba(78,154,241,0.05)", border: "1px solid rgba(78,154,241,0.15)", marginTop: 4 }}>
            <div style={{ fontWeight: 700, color: T.blue, marginBottom: 12 }}>💡 Personalized Insights</div>
            {SECTIONS.map(s => {
              const ss = secStats[s]; const acc = ss.correct + ss.incorrect > 0 ? Math.round(ss.correct / (ss.correct + ss.incorrect) * 100) : 0;
              const tip = acc >= 80 ? `${s}: Excellent! Keep it up.` : acc >= 50 ? `${s}: Good attempt. Review your incorrect answers and practice more.` : `${s}: Needs more attention. Focus on fundamentals and attempt more mocks.`;
              return <div key={s} style={{ fontSize: 13, color: "#9CA3B8", marginBottom: 6 }}>→ {tip}</div>;
            })}
          </div>
        </div>
      )}

      {/* Question review */}
      {tab === "questions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {QUESTIONS.map((q, i) => {
            const ua = answers[q.id];
            const isCorrect = ua === q.correct;
            const isSkipped = ua === undefined;
            const expanded  = expandedQ === q.id;

            return (
              <div key={q.id} style={{ ...cardStyle, border: `1px solid ${isCorrect ? T.green + "30" : isSkipped ? T.border : T.red + "30"}`, overflow: "hidden" }}>
                <div onClick={() => setExpQ(expanded ? null : q.id)}
                  style={{ padding: "15px 20px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: isCorrect ? T.green + "20" : isSkipped ? T.border : T.red + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                    {isCorrect ? "✅" : isSkipped ? "⚪" : "❌"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 3 }}>Q{i + 1} · {q.section}</div>
                    <div style={{ fontSize: 14 }}>{q.text.length > 80 ? q.text.slice(0, 80) + "…" : q.text}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: isCorrect ? T.green : isSkipped ? T.muted : T.red, flexShrink: 0 }}>
                    {isCorrect ? "+1" : "0"}
                  </div>
                  <span style={{ color: T.muted, marginLeft: 6, fontSize: 14 }}>{expanded ? "▲" : "▼"}</span>
                </div>

                {expanded && (
                  <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${T.border}` }}>
                    <div style={{ fontWeight: 500, fontSize: 15, margin: "16px 0 14px", lineHeight: 1.7 }}>{q.text}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {q.options.map((opt, oi) => {
                        const isAns = oi === ua && !isCorrect;
                        const isRight = oi === q.correct;
                        return (
                          <div key={oi} style={{ padding: "11px 16px", borderRadius: 10, background: isRight ? T.green + "18" : isAns ? T.red + "15" : "#0D1320", border: `1px solid ${isRight ? T.green + "40" : isAns ? T.red + "35" : T.border}`, display: "flex", gap: 10, alignItems: "center" }}>
                            <span style={{ fontWeight: 800, width: 20, fontSize: 13 }}>{String.fromCharCode(65 + oi)}.</span>
                            <span style={{ flex: 1, fontSize: 14 }}>{opt}</span>
                            {isRight && <span style={{ color: T.green, fontWeight: 700, fontSize: 12 }}>✓ Correct</span>}
                            {isAns && <span style={{ color: T.red, fontWeight: 700, fontSize: 12 }}>✗ Your Ans</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 14, background: "rgba(78,154,241,0.08)", border: "1px solid rgba(78,154,241,0.18)", borderRadius: 10, padding: "13px 16px", fontSize: 13, color: "#9CA3B8", lineHeight: 1.7 }}>
                      <span style={{ color: T.blue, fontWeight: 700 }}>💡 Explanation: </span>{q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        <button onClick={onDashboard} style={{ ...btnGold, background: T.border, color: T.text }}>← Dashboard</button>
        <button onClick={onRetry} style={btnGold}>🔄 Retry Mock</button>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => { injectFonts(); }, []);

  const [view,        setView]       = useState("login");
  const [user,        setUser]       = useState(null);
  const [testResult,  setTestResult] = useState(null);
  const [pastResults, setPastResults]= useState([]);

  const login  = (u) => { setUser(u); setView("dashboard"); };
  const logout = () => { setUser(null); setView("login"); };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: T.bg, minHeight: "100vh", color: T.text }}>
      {user && view !== "test" && (
        <Navbar user={user} onLogout={logout} onHome={() => setView("dashboard")} />
      )}

      {view === "login"        && <LoginView onLogin={login} />}
      {view === "dashboard"    && <DashboardView user={user} onStartMock={() => setView("instructions")} pastResults={pastResults} />}
      {view === "instructions" && <InstructionsView onStart={() => setView("test")} onBack={() => setView("dashboard")} />}
      {view === "test"         && <TestView onSubmit={(r) => { setTestResult(r); setPastResults(p => [...p, { score: Object.entries(r.answers).filter(([id, ans]) => QUESTIONS.find(q => q.id === +id)?.correct === ans).length }]); setView("analysis"); }} />}
      {view === "analysis" && testResult && (
        <AnalysisView
          answers={testResult.answers}
          timeLeft={testResult.timeLeft}
          onRetry={() => { setTestResult(null); setView("instructions"); }}
          onDashboard={() => { setTestResult(null); setView("dashboard"); }}
        />
      )}
    </div>
  );
}
