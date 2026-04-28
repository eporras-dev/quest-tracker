import { useState } from "react";

/*

  domains: array of numbers per domain
    0   = Not Started
    12  = Just Getting Started
    25  = Making Progress
    40  = Building Momentum
    50  = Halfway There
    65  = Strong Progress
    80  = Almost Done
    100 = Domain Complete

  certified: true when they pass the real exam

  Overall progress = SUM(domain_value * domain_weight) + 5 if certified.
  Weights match the AWS exam blueprints (see CCP_WEIGHTS / CAIP_WEIGHTS below).
*/

const CCP_DATA = [
  { name: "Kate", domains: [0, 0, 0, 0], certified: false },
  { name: "Steven", domains: [0, 0, 0, 0], certified: false },
  { name: "Simone Levy", domains: [0, 0, 0, 0], certified: false },
];

const CAIP_DATA = [
  { name: "Caroline Sabin", domains: [0, 0, 0, 0, 0], certified: false },
  { name: "Grace Ha", domains: [0, 0, 0, 0, 0], certified: false },
  { name: "Zohaib Akram", domains: [0, 0, 0, 0, 0], certified: false },
  { name: "Zach Womack", domains: [0, 0, 0, 0, 0], certified: false },
  { name: "Bharat Yalamarthi", domains: [0, 0, 0, 0, 0], certified: false },
  { name: "Muhammad Zuhdi", domains: [12, 0, 0, 0, 0], certified: false },
  { name: "Elena Porras", domains: [100, 12, 0, 0, 0], certified: false },
];

const CCP_DOMAINS = ["Cloud Concepts", "Security & Compliance", "Cloud Tech & Services", "Billing & Support"];
const CAIP_DOMAINS = ["AI & ML Fundamentals", "GenAI Fundamentals", "Foundation Models", "Responsible AI", "Security & Gov."];

// Equal weight for now; swap to [0.24, 0.30, 0.34, 0.12] to match the AWS CCP exam blueprint.
const CCP_WEIGHTS = [0.25, 0.25, 0.25, 0.25];
// Matches the CAIP Excel tracker and the AWS CAIP exam blueprint.
const CAIP_WEIGHTS = [0.15, 0.45, 0.20, 0.10, 0.10];

const TITLES = ["Squire", "Apprentice", "Knight", "Vanguard", "Champion", "Dragon Slayer"];

const getProgress = (p, weights) => {
  const weighted = p.domains.reduce((sum, d, i) => sum + d * weights[i], 0);
  return Math.min(100, weighted + (p.certified ? 5 : 0));
};

const getTitle = (progress, certified) => {
  if (certified) return TITLES[5];
  if (progress >= 80) return TITLES[4];
  if (progress >= 60) return TITLES[3];
  if (progress >= 40) return TITLES[2];
  if (progress >= 20) return TITLES[1];
  return TITLES[0];
};

const THEMES = {
  ccp: {
    trackGradient: "linear-gradient(90deg, #1A6B8A, #1DAA6E)",
    trackGradientFull: "linear-gradient(90deg, #0E7A52, #2ECC71)",
    trackGradientEarly: "linear-gradient(90deg, #1A6B8A, #2E9EAA)",
    domainColors: {
      100: "#0E7A52", 80: "#1DAA6E", 65: "#27AE60",
      50: "#D4AC0D", 40: "#1BA8A0", 25: "#2E86C1", 12: "#5DADE2", 0: "transparent"
    },
    tabBg: "#1A6B8A",
    tabText: "#ffffff",
  },
  caip: {
    trackGradient: "linear-gradient(90deg, #5B3A8C, #A0785A)",
    trackGradientFull: "linear-gradient(90deg, #6C3483, #AF7AC5)",
    trackGradientEarly: "linear-gradient(90deg, #5B3A8C, #7D6B91)",
    domainColors: {
      100: "#6C3483", 80: "#8E44AD", 65: "#A569BD",
      50: "#C49B3F", 40: "#8B6D5C", 25: "#7D6B91", 12: "#A89BB5", 0: "transparent"
    },
    tabBg: "#5B3A8C",
    tabText: "#ffffff",
  },
};

const getDomainColor = (value, theme) => {
  const c = theme.domainColors;
  if (value >= 100) return c[100];
  if (value >= 80) return c[80];
  if (value >= 65) return c[65];
  if (value >= 50) return c[50];
  if (value >= 40) return c[40];
  if (value >= 25) return c[25];
  if (value >= 12) return c[12];
  return c[0];
};

const getTrackGradient = (progress, theme) => {
  if (progress >= 100) return theme.trackGradientFull;
  if (progress >= 40) return theme.trackGradient;
  return theme.trackGradientEarly;
};

const SectionLabel = ({ children }) => (
  <div style={{
    font: "Open Sans, sans-serif", fontSize: "11px", fontWeight: 700, color: "var(--color-text-secondary)",
    textTransform: "uppercase", letterSpacing: "0.8px",
    padding: "0 4px", marginBottom: "10px", marginTop: "6px",
  }}>
    {children}
  </div>
);

const Card = ({ children, style = {}, highlight = false }) => (
  <div style={{
    background: "var(--color-background-primary)",
    border: highlight ? "1.5px solid var(--color-border-success)" : "0.5px solid var(--color-border-tertiary)",
    borderRadius: "16px",
    padding: "16px",
    ...style,
  }}>
    {children}
  </div>
);

const DragonQueenBanner = ({ data, theme, weights }) => {
  const avgProgress = data.reduce((s, p) => s + getProgress(p, weights), 0) / data.length;
  const queenPower = Math.max(0, 100 - avgProgress);
  const dragonsSlain = data.filter(p => p.certified).length;
  const totalQuesters = data.length;

  let queenStatus = "reigns supreme";
  let queenEmoji = "👸🏼";
  if (queenPower <= 0) { queenStatus = "has been overthrown!"; queenEmoji = "💀"; }
  else if (queenPower <= 25) { queenStatus = "is faltering"; }
  else if (queenPower <= 50) { queenStatus = "grows uneasy"; }
  else if (queenPower <= 75) { queenStatus = "watches from her throne"; }

  return (
    <Card>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: queenPower <= 0
              ? "linear-gradient(135deg, #27AE60, #2ECC71)"
              : "linear-gradient(135deg, #8B1A1A, #C0392B)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", font: "Open Sans, sans-serif",
          }}>
            {queenEmoji}
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, font: "Open Sans, sans-serif" }}>The Dragon Queen {queenStatus}</div>
            <div style={{ fontSize: "11px", font: "Open Sans, sans-serif", color: "var(--color-text-secondary)" }}>
              {dragonsSlain}/{totalQuesters} dragons slain by the party
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: "18px", fontWeight: 700, fontFamily: "'Open Sans', var(--font-mono)",
            color: queenPower <= 25 ? "var(--color-text-success)" : "var(--color-text-primary)",
          }}>
            {Math.round(queenPower)}%
          </div>
          <div style={{ fontSize: "9px", font: "Open Sans, sans-serif", color: "var(--color-text-secondary)" }}>power remaining</div>
        </div>
      </div>

      <div style={{
        height: "8px", borderRadius: "4px",
        background: "var(--color-background-secondary)", overflow: "hidden",
      }}>
        <div style={{
          width: `${queenPower}%`, height: "100%", borderRadius: "4px",
          background: queenPower > 60 ? "#8B1A1A" : queenPower > 30 ? "#C0392B" : "#E67E22",
          transition: "width 0.5s ease",
        }} />
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "8px", marginTop: "12px",
      }}>
        {[
          { label: "Party avg progress", value: `${Math.round(avgProgress)}%` },
          { label: "Domains cleared", value: `${data.reduce((s, p) => s + p.domains.filter(d => d === 100).length, 0)}/${data.reduce((s, p) => s + p.domains.length, 0)}` },
          { label: "Certified", value: `${dragonsSlain}/${totalQuesters}` },
        ].map((s, i) => (
          <div key={i} style={{
            background: "var(--color-background-secondary)",
            borderRadius: "12px", padding: "8px 10px", textAlign: "center",
          }}>
            <div style={{ fontSize: "9px", font: "Open Sans, sans-serif", color: "var(--color-text-secondary)", marginBottom: "2px" }}>{s.label}</div>
            <div style={{ fontSize: "15px", fontWeight: 700, font: "Open Sans, sans-serif" }}>{s.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const QuestRow = ({ person, index, domains, totalDomains, theme, weights }) => {
  const progress = getProgress(person, weights);
  const dragonHP = Math.max(0, 100 - progress);
  const title = getTitle(progress, person.certified);
  const domainsComplete = person.domains.filter(d => d === 100).length;
  const dragonEmoji = progress >= 100 ? "💀" : "🐉";
  const hpBarColor = dragonHP > 60 ? "#8B1A1A" : dragonHP > 30 ? "#C0392B" : dragonHP > 0 ? "#E67E22" : "var(--color-text-success)";

  return (
    <Card highlight={person.certified}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: person.certified
              ? "linear-gradient(135deg, #F7DC6F, #F1C40F)"
              : "var(--color-background-secondary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", fontFamily: "'Open Sans', var(--font-sans)",
            border: person.certified ? "2px solid #D4AC0D" : "0.5px solid var(--color-border-tertiary)",
          }}>
            {person.certified ? "👑" : "⚔️"}
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700 }}>{person.name}</div>
            <div style={{
              fontSize: "11px", fontFamily: "'Open Sans', var(--font-sans)",
              color: person.certified ? "var(--color-text-success)" : "var(--color-text-secondary)",
              fontStyle: "italic",
            }}>
              {person.certified ? "Dragon Slayer, Certified!" : title}
              <span style={{ marginLeft: "6px", opacity: 0.6 }}>
                {domainsComplete}/{totalDomains} domains cleared
              </span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: "20px", font: "Open Sans, sans-serif", fontWeight: 700, fontFamily: "'Open Sans', var(--font-mono)",
            color: progress >= 80 ? "var(--color-text-success)" : "var(--color-text-primary)",
            lineHeight: 1,
          }}>
            {Math.round(progress)}%
          </div>
          <div style={{ fontSize: "9px", font: "Open Sans, sans-serif", color: "var(--color-text-secondary)", marginTop: "2px" }}>
            quest progress
          </div>
        </div>
      </div>

      <div style={{
        position: "relative", height: "48px",
        background: "var(--color-background-secondary)",
        borderRadius: "12px",
        overflow: "hidden", marginBottom: "10px",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%",
          width: `${progress}%`,
          background: getTrackGradient(progress, theme),
          borderRadius: "12px",
          transition: "width 0.6s ease",
        }} />

        {[...Array(totalDomains - 1)].map((_, i) => {
          const pos = ((i + 1) / totalDomains) * 100;
          return (
            <div key={i} style={{
              position: "absolute", top: "8px", bottom: "8px",
              left: `${pos}%`, width: "1px",
              background: "var(--color-border-secondary)", opacity: 0.25,
            }} />
          );
        })}

        <div style={{
          position: "absolute",
          left: `max(6px, calc(${progress}% - 18px))`,
          top: "50%", transform: "translateY(-50%)",
          fontSize: "26px", transition: "left 0.6s ease",
          zIndex: 2, lineHeight: 1,
        }}>
          {person.certified ? "👑" : "⚔️"}
        </div>

        <div style={{
          position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
          fontSize: "26px", lineHeight: 1, zIndex: 1,
          opacity: progress >= 100 ? 0.25 : 1,
          transition: "opacity 0.5s",
        }}>
          {dragonEmoji}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px",
      }}>
        <span style={{
          fontSize: "9px", color: "var(--color-text-secondary)",
          fontFamily: "'Open Sans', var(--font-mono)", whiteSpace: "nowrap", width: "55px",
        }}>
          Dragon HP
        </span>
        <div style={{
          flex: 1, height: "6px", borderRadius: "3px",
          background: "var(--color-background-secondary)", overflow: "hidden",
        }}>
          <div style={{
            width: `${dragonHP}%`, height: "100%", borderRadius: "3px",
            background: hpBarColor, transition: "width 0.5s ease",
          }} />
        </div>
        <span style={{
          fontSize: "9px", fontWeight: 700,
          fontFamily: "'Open Sans', var(--font-mono)",
          color: dragonHP === 0 ? "var(--color-text-success)" : "var(--color-text-secondary)",
          width: "32px", textAlign: "right",
        }}>
          {Math.round(dragonHP)}%
        </span>
      </div>

      <div style={{ display: "flex", gap: "4px" }}>
        {person.domains.map((d, i) => {
          const bg = getDomainColor(d, theme);
          const textColor = d >= 50 ? "white" : "var(--color-text-secondary)";
          const shortLabel = domains[i].length > 16 ? `D${i + 1}` : domains[i];
          return (
            <div key={i} style={{
              flex: 1, position: "relative", height: "22px", borderRadius: "6px",
              background: "var(--color-border-tertiary)", overflow: "hidden",
            }}>
              <div style={{
                width: `${d}%`, height: "100%", borderRadius: "6px",
                background: bg === "transparent" ? "transparent" : bg,
                transition: "width 0.3s",
              }} />
              <span style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "8px", fontWeight: 700,
                fontFamily: "'Open Sans', var(--font-mono)",
                color: textColor, letterSpacing: "-0.3px",
              }}>
                {shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default function App() {
  const [tab, setTab] = useState("ccp");
  const theme = THEMES[tab];
  const data = tab === "ccp" ? CCP_DATA : CAIP_DATA;
  const domains = tab === "ccp" ? CCP_DOMAINS : CAIP_DOMAINS;
  const weights = tab === "ccp" ? CCP_WEIGHTS : CAIP_WEIGHTS;
  const sorted = [...data].sort((a, b) => getProgress(b, weights) - getProgress(a, weights));

  const inactiveTabStyle = {
    padding: "10px 0", borderRadius: "12px", border: "none",
    cursor: "pointer", fontSize: "13px", fontWeight: 600,
    fontFamily: "'Open Sans', inherit",
    background: "transparent",
    color: "var(--color-text-secondary)",
    transition: "all 0.2s",
    flex: 1, textAlign: "center",
  };

  const activeTabStyle = {
    ...inactiveTabStyle,
    background: theme.tabBg,
    color: theme.tabText,
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  };

  return (
    <div style={{
      padding: "12px 0",
      fontFamily: "'Open Sans', var(--font-sans, system-ui)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        marginBottom: "16px", padding: "0 4px",
      }}>
        <span style={{ fontSize: "26px" }}>⚔️</span>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700 }}>WMA Certification Quest</div>
          <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
            Slay your dragon. Defeat the Dragon Queen. Get certified.
          </div>
        </div>
      </div>

      <div style={{
        display: "flex", gap: "4px",
        background: "var(--color-background-secondary)",
        borderRadius: "14px", padding: "4px",
        marginBottom: "20px",
      }}>
        <button
          onClick={() => setTab("ccp")}
          style={tab === "ccp" ? activeTabStyle : inactiveTabStyle}
        >
          ☁️  AWS CCP
          <span style={{
            display: "block", fontSize: "10px", fontWeight: 500,
            opacity: 0.7, marginTop: "1px",
          }}>
            {CCP_DATA.length} questers · 4 domains
          </span>
        </button>
        <button
          onClick={() => setTab("caip")}
          style={tab === "caip" ? activeTabStyle : inactiveTabStyle}
        >
          🤖  AWS CAIP
          <span style={{
            display: "block", fontSize: "10px", fontWeight: 500,
            opacity: 0.7, marginTop: "1px",
          }}>
            {CAIP_DATA.length} questers · 5 domains
          </span>
        </button>
      </div>

      <SectionLabel>The Dragon Queen</SectionLabel>
      <DragonQueenBanner data={data} theme={theme} weights={weights} />

      <div style={{ height: "20px" }} />

      <SectionLabel>Individual Quests</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sorted.map((person) => (
          <QuestRow
            key={person.name}
            person={person}
            index={data.indexOf(person)}
            domains={domains}
            totalDomains={domains.length}
            theme={theme}
            weights={weights}
          />
        ))}
      </div>

      <div style={{ height: "20px" }} />

      <SectionLabel>Legend</SectionLabel>
      <Card style={{ padding: "14px 16px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "6px 16px", fontSize: "11px", color: "var(--color-text-secondary)",
        }}>
          <span>⚔️  Questing</span>
          <span>👑  Certified</span>
          <span>🐉  Your dragon (the exam)</span>
          <span>💀  Dragon slain</span>
          <span>👸🏼  Dragon Queen (team boss)</span>
        </div>
        <div style={{
          marginTop: "10px", paddingTop: "10px",
          borderTop: "0.5px solid var(--color-border-tertiary)",
          fontSize: "11px", color: "var(--color-text-secondary)", lineHeight: 1.7,
        }}>
          <strong>Ranks:</strong> Squire, Apprentice, Knight, Vanguard, Champion, Dragon Slayer
        </div>
      </Card>
    </div>
  );
}