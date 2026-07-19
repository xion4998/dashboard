/* eslint-disable */
import { useState } from "react";

// ⚠️ 각 설비 배포 URL을 아래 url 항목에 채워넣으세요
const FACILITIES = [
  { id: "mdas", name: "M-DAS", color: "#2563eb", gradient: "linear-gradient(135deg,#1e40af,#7c3aed)", pct: 0, sub: "배치 피킹", url: "https://m-das-nine.vercel.app", ready: true },
  { id: "maps", name: "MAPS", color: "#f59e0b", gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", pct: 0, sub: "호기별 라인", url: "https://maps-ten-psi.vercel.app", ready: true },
  { id: "qps", name: "QPS", color: "#059669", gradient: "linear-gradient(135deg,#059669,#0891b2)", pct: 0, sub: "라인별 피킹", url: "https://qps-new.vercel.app", ready: true },
  { id: "ons", name: "ONS", color: "#0891b2", gradient: "linear-gradient(135deg,#0891b2,#7c3aed)", pct: 0, sub: "호기별 피킹", url: "https://ons-nine.vercel.app", ready: true },
  { id: "dansu", name: "단수단포", color: "#7c3aed", gradient: "linear-gradient(135deg,#7c3aed,#ea580c)", pct: 0, sub: "단수/단포/원박스", url: "https://dansudanpo.vercel.app", ready: true },
  { id: "flash", name: "Flash Sorter", color: "#ea580c", gradient: "linear-gradient(135deg,#ea580c,#dc2626)", pct: 0, sub: "배치 피킹", url: "https://flash-sorter.vercel.app", ready: true },
  { id: "pas", name: "PAS", color: "#d97706", gradient: "linear-gradient(135deg,#059669,#d97706)", pct: 0, sub: "배치 피킹", url: "https://pas-flax.vercel.app", ready: true },
  { id: "3ds", name: "3D Sorter", color: "#db2777", gradient: "linear-gradient(135deg,#db2777,#7c3aed)", pct: 0, sub: "호기별 배치", url: "https://3-d-sorter.vercel.app", ready: true },
];

try {
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css";
  document.head.appendChild(fontLink);
} catch (e) {}

const S = {
  bg: "#f0f4f8", card: "#ffffff", border: "#e2e8f0",
  text: "#0f172a", textSub: "#64748b", inputBg: "#f8fafc",
  shadow: "0 1px 8px rgba(0,0,0,0.08)",
};

export default function App() {
  const [locked, setLocked] = useState(() => {
    try { const s = localStorage.getItem("dash_locked"); if (s) return JSON.parse(s); } catch (e) {}
    return {};
  });
  const [editMode, setEditMode] = useState(false);

  const toggleLock = (id) => {
    const next = { ...locked, [id]: !locked[id] };
    setLocked(next);
    try { localStorage.setItem("dash_locked", JSON.stringify(next)); } catch (e) {}
  };

  const now = new Date();
  const timeStr = `${now.getHours()}시${now.getMinutes().toString().padStart(2,"0")}분`;
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const activeFacilities = FACILITIES.filter(f => f.ready && !locked[f.id]);
  const totalPct = activeFacilities.length > 0
    ? Math.round(activeFacilities.reduce((s,f) => s+f.pct, 0) / activeFacilities.length)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "'Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif", padding: "20px 16px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", color: S.textSub, textTransform: "uppercase", fontWeight: 500, marginBottom: 4 }}>BLP 양지센터</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, background: "linear-gradient(135deg,#1e40af,#7c3aed,#db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>야간 피킹 종합 현황판</h1>
        <div style={{ fontSize: 12, color: S.textSub, marginTop: 4 }}>{month}월{day}일 · {timeStr} 기준</div>
        <button onClick={() => setEditMode(!editMode)} style={{
          marginTop: 8, fontSize: 11, fontWeight: 700, padding: "5px 16px", borderRadius: 20, cursor: "pointer",
          background: editMode ? "#7c3aed" : "#f8fafc",
          border: "1px solid " + (editMode ? "#7c3aed" : "#e2e8f0"),
          color: editMode ? "#fff" : S.textSub, fontFamily: "inherit", transition: "all 0.2s"
        }}>
          {editMode ? "✓ 완료" : "⚙️ 설비 관리"}
        </button>
        {editMode && <div style={{ fontSize: 11, color: "#7c3aed", marginTop: 6, fontWeight: 600 }}>카드를 탭하면 잠금/해제됩니다</div>}
      </div>

      {/* 전체 진행률 */}
      <div style={{ background: "linear-gradient(135deg,#1e40af,#7c3aed)", borderRadius: 16, padding: "16px 20px", marginBottom: 16, boxShadow: "0 4px 20px rgba(37,99,235,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 2 }}>전체 피킹작업률</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#fff" }}>{totalPct}%</div>
          </div>
          <div style={{ position: "relative" }}>
            <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={36} cy={36} r={30} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={6} />
              <circle cx={36} cy={36} r={30} fill="none" stroke="#fff" strokeWidth={6}
                strokeDasharray={`${(totalPct/100)*2*Math.PI*30} ${2*Math.PI*30}`} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{totalPct}%</span>
            </div>
          </div>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
          <div style={{ height: 6, borderRadius: 3, background: "#fff", width: `${totalPct}%`, transition: "width 0.5s" }} />
        </div>
      </div>

      {/* 설비 그리드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {FACILITIES.map(f => {
          const isLocked = locked[f.id] || false;
          const clickable = f.ready && !isLocked && !editMode;
          const CardInner = (
            <div onClick={editMode ? () => toggleLock(f.id) : undefined} style={{
              background: S.card, borderRadius: 16, padding: "16px 8px",
              textAlign: "center", boxShadow: S.shadow,
              border: `1.5px solid ${editMode ? (isLocked ? "#dc262666" : "#7c3aed66") : (clickable ? f.color+"44" : S.border)}`,
              opacity: isLocked ? 0.35 : (f.ready ? 1 : 0.5),
              transition: "all 0.2s",
              cursor: editMode ? "pointer" : (clickable ? "pointer" : "default"),
              position: "relative",
            }}>
              {isLocked && (
                <div style={{ position: "absolute", top: 6, right: 8, fontSize: 14 }}>🔒</div>
              )}
              {/* 진행률 링 */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: 8 }}>
                <svg width={68} height={68} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={34} cy={34} r={27} fill="none" stroke="#e2e8f0" strokeWidth={6} />
                  <circle cx={34} cy={34} r={27} fill="none" stroke={f.color} strokeWidth={6}
                    strokeDasharray={`${(f.pct/100)*2*Math.PI*27} ${2*Math.PI*27}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: f.color }}>{f.pct}%</span>
                </div>
              </div>

              <div style={{ fontSize: 11, fontWeight: 800, color: f.ready ? f.color : S.textSub, marginBottom: 3, lineHeight: 1.2 }}>{f.name}</div>
              <div style={{ fontSize: 10, color: S.textSub }}>{isLocked ? "미운영" : f.ready ? f.sub : "준비중"}</div>

              {clickable && (
                <div style={{ marginTop: 8, fontSize: 9, background: f.color+"15", color: f.color, borderRadius: 10, padding: "3px 8px", fontWeight: 700, border: `1px solid ${f.color}33` }}>
                  바로가기 →
                </div>
              )}
              {editMode && (
                <div style={{ marginTop: 8, fontSize: 9, background: isLocked ? "#fee2e2" : "#ede9fe", color: isLocked ? "#dc2626" : "#7c3aed", borderRadius: 10, padding: "3px 8px", fontWeight: 700 }}>
                  {isLocked ? "잠김 · 탭하여 해제" : "운영중 · 탭하여 잠금"}
                </div>
              )}
            </div>
          );
          return clickable ? (
            <a key={f.id} href={f.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>{CardInner}</a>
          ) : (
            <div key={f.id}>{CardInner}</div>
          );
        })}
      </div>

      {/* 하단 안내 */}
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: S.textSub }}>
        카드 탭 → 해당 설비 상세 현황
      </div>
    </div>
  );
}
