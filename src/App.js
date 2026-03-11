import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const COUNTRIES = ["Greece","Cyprus","United Kingdom","Italy","France","Spain","Portugal","Germany","Turkey","Croatia","Montenegro","Albania","North Macedonia","Bulgaria","Romania","Hungary","Austria","Switzerland","Netherlands","Belgium","Other"];
const MOODS = ["✨ Magical","😌 Peaceful","🎉 Exciting","🤔 Reflective","😴 Exhausted","🥰 Romantic","🏃 Adventurous","🍷 Indulgent"];

const styles = {
  input: { width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,200,100,0.15)", borderRadius:"2px", padding:"10px 14px", color:"#f0d8a0", fontFamily:"'Crimson Text', serif", fontSize:"16px", outline:"none", boxSizing:"border-box", colorScheme:"dark" },
  label: { fontFamily:"'Crimson Text', serif", fontSize:"11px", color:"#806040", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px", display:"block" },
  btn: { background:"linear-gradient(135deg, #c08030, #f0c060)", border:"none", borderRadius:"2px", padding:"12px 28px", color:"#1a0e04", fontFamily:"'Crimson Text', serif", fontSize:"14px", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", fontWeight:600 },
  btnGhost: { background:"none", border:"1px solid rgba(255,200,100,0.15)", borderRadius:"2px", padding:"12px 24px", color:"#806040", fontFamily:"'Crimson Text', serif", fontSize:"14px", cursor:"pointer" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
}

// ── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup | magic
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true); setMsg("");
    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        setMsg("Check your email for a magic link!");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created! Check your email to confirm, then log in.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      }
    } catch (e) {
      setMsg(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0d0a06", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ maxWidth:"420px", width:"100%", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,200,100,0.12)", borderRadius:"2px", padding:"48px" }}>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"32px", color:"#f0d8a0", marginBottom:"6px", textAlign:"center" }}>✦ TRAVELOGUE</div>
        <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"13px", color:"#604030", textAlign:"center", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"40px" }}>
          {mode === "login" ? "Sign in to your journal" : mode === "signup" ? "Create your journal" : "Sign in with magic link"}
        </div>

        <div style={{ marginBottom:"20px" }}>
          <label style={styles.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} onKeyDown={e => e.key === "Enter" && handle()} />
        </div>

        {mode !== "magic" && (
          <div style={{ marginBottom:"28px" }}>
            <label style={styles.label}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} onKeyDown={e => e.key === "Enter" && handle()} />
          </div>
        )}

        {msg && <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"14px", color: msg.includes("!") ? "#a0c080" : "#c06040", marginBottom:"16px", textAlign:"center" }}>{msg}</div>}

        <button onClick={handle} disabled={loading} style={{ ...styles.btn, width:"100%", marginBottom:"16px", opacity: loading ? 0.7 : 1 }}>
          {loading ? "..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Magic Link"}
        </button>

        <div style={{ display:"flex", gap:"8px", justifyContent:"center", flexWrap:"wrap" }}>
          {mode !== "login" && <button onClick={() => { setMode("login"); setMsg(""); }} style={{ ...styles.btnGhost, fontSize:"12px", padding:"6px 14px" }}>Sign In</button>}
          {mode !== "signup" && <button onClick={() => { setMode("signup"); setMsg(""); }} style={{ ...styles.btnGhost, fontSize:"12px", padding:"6px 14px" }}>Create Account</button>}
          {mode !== "magic" && <button onClick={() => { setMode("magic"); setMsg(""); }} style={{ ...styles.btnGhost, fontSize:"12px", padding:"6px 14px" }}>Magic Link</button>}
        </div>
      </div>
    </div>
  );
}

// ── Trip Card ────────────────────────────────────────────────────────────────
function TripCard({ trip, onClick, onDelete }) {
  const data = trip.data;
  return (
    <div onClick={() => onClick(trip)} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,220,150,0.15)", borderRadius:"2px", padding:"28px 32px", cursor:"pointer", transition:"all 0.25s ease", position:"relative", overflow:"hidden" }}
      onMouseEnter={e => { e.currentTarget.style.background="rgba(255,220,150,0.07)"; e.currentTarget.style.borderColor="rgba(255,220,150,0.4)"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,220,150,0.15)"; e.currentTarget.style.transform="translateY(0)"; }}>
      <div style={{ position:"absolute", top:0, left:0, width:"3px", height:"100%", background:"linear-gradient(to bottom, #f0c060, #c08030)" }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"22px", color:"#f5e6c8", marginBottom:"6px" }}>{data.title}</div>
          <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"13px", color:"#c4a882", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"10px" }}>
            {data.country} · {formatDate(data.startDate)}{data.endDate ? ` — ${formatDate(data.endDate)}` : ""}
          </div>
          {data.mood && <div style={{ fontSize:"12px", color:"#a08060", marginBottom:"8px" }}>{data.mood}</div>}
          <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"15px", color:"#9a8870", lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {data.entries?.[0]?.text || "No entries yet..."}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"8px", marginLeft:"20px" }}>
          <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"12px", color:"#705840" }}>{data.entries?.length || 0} {data.entries?.length === 1 ? "entry" : "entries"}</div>
          <button onClick={e => { e.stopPropagation(); onDelete(trip.id); }} style={{ background:"none", border:"none", color:"#6a5040", cursor:"pointer", fontSize:"16px", padding:"4px", opacity:0.6, transition:"opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity="1"} onMouseLeave={e => e.currentTarget.style.opacity="0.6"}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ── New Trip Modal ───────────────────────────────────────────────────────────
function NewTripModal({ onSave, onClose }) {
  const [form, setForm] = useState({ title:"", country:"Greece", startDate:"", endDate:"", mood:"", notes:"" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,7,4,0.85)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ background:"#1a1208", border:"1px solid rgba(255,200,100,0.2)", borderRadius:"2px", padding:"48px", maxWidth:"540px", width:"100%", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"28px", color:"#f0d8a0", marginBottom:"8px" }}>New Journey</div>
        <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"13px", color:"#806040", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"36px" }}>Record a new chapter</div>

        {[{label:"TITLE",key:"title",type:"text",placeholder:"Peloponnese Road Trip"},{label:"START DATE",key:"startDate",type:"date"},{label:"END DATE",key:"endDate",type:"date"}].map(({label,key,type,placeholder}) => (
          <div key={key} style={{ marginBottom:"24px" }}>
            <label style={styles.label}>{label}</label>
            <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} style={styles.input} />
          </div>
        ))}

        <div style={{ marginBottom:"24px" }}>
          <label style={styles.label}>COUNTRY</label>
          <select value={form.country} onChange={e => set("country", e.target.value)} style={{ ...styles.input, background:"#1a1208" }}>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ marginBottom:"24px" }}>
          <label style={styles.label}>MOOD</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {MOODS.map(m => (
              <button key={m} onClick={() => set("mood", form.mood === m ? "" : m)} style={{ background: form.mood===m ? "rgba(240,192,96,0.2)" : "rgba(255,255,255,0.03)", border:`1px solid ${form.mood===m ? "rgba(240,192,96,0.5)" : "rgba(255,200,100,0.12)"}`, borderRadius:"2px", padding:"6px 12px", color: form.mood===m ? "#f0c060" : "#806040", fontFamily:"'Crimson Text', serif", fontSize:"13px", cursor:"pointer" }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:"36px" }}>
          <label style={styles.label}>FIRST IMPRESSIONS</label>
          <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="The road wound through olive groves..." rows={4} style={{ ...styles.input, resize:"vertical", lineHeight:1.7 }} />
        </div>

        <div style={{ display:"flex", gap:"16px" }}>
          <button onClick={() => { if (!form.title) return; onSave({ ...form, entries: form.notes ? [{ id: Date.now(), text: form.notes, date: form.startDate || new Date().toISOString().split("T")[0] }] : [] }); }} style={{ ...styles.btn, flex:1 }}>
            Begin Journey
          </button>
          <button onClick={onClose} style={styles.btnGhost}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Trip Detail ──────────────────────────────────────────────────────────────
function TripDetail({ trip, onBack, onUpdate }) {
  const [newEntry, setNewEntry] = useState("");
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingEntry, setEditingEntry] = useState(null);
  const data = trip.data;

  const addEntry = () => {
    if (!newEntry.trim()) return;
    const entry = { id: Date.now(), text: newEntry.trim(), date: newEntryDate };
    onUpdate(trip, { ...data, entries: [...(data.entries || []), entry] });
    setNewEntry("");
  };

  const deleteEntry = (id) => onUpdate(trip, { ...data, entries: data.entries.filter(e => e.id !== id) });
  const saveEdit = (id, text) => { onUpdate(trip, { ...data, entries: data.entries.map(e => e.id === id ? { ...e, text } : e) }); setEditingEntry(null); };

  return (
    <div style={{ maxWidth:"700px", margin:"0 auto" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#806040", fontFamily:"'Crimson Text', serif", fontSize:"14px", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", padding:"0 0 32px 0" }}>
        ← All Journeys
      </button>
      <div style={{ marginBottom:"48px" }}>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"42px", color:"#f5e6c8", lineHeight:1.1, marginBottom:"12px" }}>{data.title}</div>
        <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"14px", color:"#c4a882", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"8px" }}>
          {data.country} · {formatDate(data.startDate)}{data.endDate ? ` — ${formatDate(data.endDate)}` : ""}
        </div>
        {data.mood && <div style={{ fontSize:"14px", color:"#a08060" }}>{data.mood}</div>}
      </div>

      <div style={{ borderTop:"1px solid rgba(255,200,100,0.1)", paddingTop:"40px", marginBottom:"48px" }}>
        <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"12px", color:"#806040", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"16px" }}>Add Entry</div>
        <input type="date" value={newEntryDate} onChange={e => setNewEntryDate(e.target.value)} style={{ ...styles.input, width:"auto", marginBottom:"12px" }} />
        <textarea value={newEntry} onChange={e => setNewEntry(e.target.value)} placeholder="What did you discover today..." rows={5}
          style={{ ...styles.input, resize:"vertical", lineHeight:1.8, fontSize:"17px" }}
          onKeyDown={e => { if (e.metaKey && e.key === "Enter") addEntry(); }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"12px" }}>
          <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"12px", color:"#504030" }}>⌘ + Enter to save</div>
          <button onClick={addEntry} style={styles.btn}>Save Entry</button>
        </div>
      </div>

      <div>
        <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"12px", color:"#806040", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"32px" }}>
          {data.entries?.length || 0} {data.entries?.length === 1 ? "Entry" : "Entries"}
        </div>
        {(data.entries || []).slice().reverse().map(entry => (
          <div key={entry.id} style={{ borderLeft:"2px solid rgba(255,200,100,0.15)", paddingLeft:"28px", marginBottom:"40px", position:"relative" }}>
            <div style={{ position:"absolute", left:"-5px", top:"6px", width:"8px", height:"8px", borderRadius:"50%", background:"#c08030" }} />
            <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"12px", color:"#806040", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"12px" }}>{formatDate(entry.date)}</div>
            {editingEntry === entry.id ? (
              <div>
                <textarea defaultValue={entry.text} id={`edit-${entry.id}`} rows={6} style={{ ...styles.input, resize:"vertical", lineHeight:1.8, fontSize:"17px" }} />
                <div style={{ display:"flex", gap:"10px", marginTop:"10px" }}>
                  <button onClick={() => saveEdit(entry.id, document.getElementById(`edit-${entry.id}`).value)} style={{ ...styles.btn, padding:"6px 16px", fontSize:"13px" }}>Save</button>
                  <button onClick={() => setEditingEntry(null)} style={{ ...styles.btnGhost, padding:"6px 16px", fontSize:"13px" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"18px", color:"#d4c4a8", lineHeight:1.85, whiteSpace:"pre-wrap" }}>{entry.text}</div>
                <div style={{ display:"flex", gap:"16px", marginTop:"12px" }}>
                  <button onClick={() => setEditingEntry(entry.id)} style={{ background:"none", border:"none", color:"#605040", fontFamily:"'Crimson Text', serif", fontSize:"12px", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", padding:0 }}>Edit</button>
                  <button onClick={() => deleteEntry(entry.id)} style={{ background:"none", border:"none", color:"#605040", fontFamily:"'Crimson Text', serif", fontSize:"12px", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", padding:0 }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {(!data.entries || data.entries.length === 0) && (
          <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"18px", color:"#504030", fontStyle:"italic", textAlign:"center", padding:"48px 0" }}>The pages await your stories...</div>
        )}
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [view, setView] = useState("list");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showNewTrip, setShowNewTrip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadTrips();
  }, [user]);

  const loadTrips = async () => {
    const { data, error } = await supabase.from("trips").select("*").order("created_at", { ascending: false });
    if (!error) setTrips(data || []);
  };

  const addTrip = async (tripData) => {
    const { data, error } = await supabase.from("trips").insert([{ user_id: user.id, data: tripData }]).select();
    if (!error) { setTrips(t => [data[0], ...t]); setShowNewTrip(false); }
  };

  const deleteTrip = async (id) => {
    await supabase.from("trips").delete().eq("id", id);
    setTrips(t => t.filter(x => x.id !== id));
  };

  const updateTrip = async (trip, newData) => {
    const { data, error } = await supabase.from("trips").update({ data: newData }).eq("id", trip.id).select();
    if (!error) {
      const updated = data[0];
      setTrips(t => t.map(x => x.id === updated.id ? updated : x));
      setSelectedTrip(updated);
    }
  };

  const signOut = async () => { await supabase.auth.signOut(); setTrips([]); setView("list"); };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0d0a06", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cormorant Garamond', serif", fontSize:"24px", color:"#604030" }}>✦</div>
  );

  if (!user) return <AuthScreen onAuth={setUser} />;

  const filtered = trips.filter(t => !filter || t.data.title.toLowerCase().includes(filter.toLowerCase()) || t.data.country.toLowerCase().includes(filter.toLowerCase()));
  const totalEntries = trips.reduce((a, t) => a + (t.data.entries?.length || 0), 0);

  return (
    <div style={{ minHeight:"100vh", background:"#0d0a06", color:"#d4c4a8", fontFamily:"'Crimson Text', serif" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 20% 20%, rgba(120,80,20,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(80,40,10,0.06) 0%, transparent 60%)", pointerEvents:"none" }} />

      {/* Header */}
      <div style={{ borderBottom:"1px solid rgba(255,200,100,0.08)", padding:"28px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"rgba(13,10,6,0.95)", backdropFilter:"blur(12px)", zIndex:50 }}>
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"26px", color:"#f0d8a0", letterSpacing:"0.06em", fontWeight:300 }}>✦ TRAVELOGUE</div>
          <div style={{ fontSize:"12px", color:"#604030", letterSpacing:"0.1em", marginTop:"2px" }}>
            {trips.length} {trips.length === 1 ? "journey" : "journeys"} · {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
          </div>
        </div>
        <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
          {view === "list" && <button onClick={() => setShowNewTrip(true)} style={styles.btn}>+ New Journey</button>}
          <button onClick={signOut} style={{ ...styles.btnGhost, fontSize:"12px", padding:"8px 16px" }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth:"780px", margin:"0 auto", padding:"48px 24px" }}>
        {view === "list" ? (
          <>
            {trips.length > 2 && (
              <input type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search journeys..." style={{ ...styles.input, marginBottom:"32px" }} />
            )}
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"100px 0" }}>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"36px", color:"#3a2a18", marginBottom:"16px" }}>✦</div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"24px", color:"#604030", marginBottom:"12px" }}>
                  {trips.length === 0 ? "Your journey begins here" : "No matches found"}
                </div>
                {trips.length === 0 && <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"16px", color:"#503020", fontStyle:"italic" }}>Record your first adventure</div>}
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                {filtered.map(trip => <TripCard key={trip.id} trip={trip} onClick={t => { setSelectedTrip(t); setView("detail"); }} onDelete={deleteTrip} />)}
              </div>
            )}
          </>
        ) : (
          <TripDetail trip={selectedTrip} onBack={() => { setView("list"); setSelectedTrip(null); }} onUpdate={updateTrip} />
        )}
      </div>

      {showNewTrip && <NewTripModal onSave={addTrip} onClose={() => setShowNewTrip(false)} />}
    </div>
  );
}
