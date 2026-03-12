import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const COUNTRIES = ["Greece","Cyprus","United Kingdom","Italy","France","Spain","Portugal","Germany","Turkey","Croatia","Montenegro","Albania","North Macedonia","Bulgaria","Romania","Hungary","Austria","Switzerland","Netherlands","Belgium","Other"];
const MOODS = ["✨ Magical","😌 Peaceful","🎉 Exciting","🤔 Reflective","😴 Exhausted","🥰 Romantic","🏃 Adventurous","🍷 Indulgent"];

const C = {
  bg:"#f0f2f4", bgCard:"#ffffff", bgModal:"#f8f9fa", bgHeader:"rgba(240,242,244,0.95)",
  border:"rgba(100,120,140,0.18)", borderHover:"rgba(71,111,144,0.45)",
  accent:"#4779a0", accentLight:"#e8f0f7", accentGrad:"linear-gradient(135deg, #3a6a90, #5a9acc)",
  textPrimary:"#1e2d3d", textSecond:"#5a7080", textMuted:"#8fa0b0", textTiny:"#a0b4c0",
  success:"#4a9060", error:"#b04040", stripe:"linear-gradient(to bottom, #4779a0, #5a9acc)",
};

const styles = {
  input:{ width:"100%", background:"#fff", border:`1px solid ${C.border}`, borderRadius:"6px", padding:"10px 14px", color:C.textPrimary, fontFamily:"'Crimson Text', serif", fontSize:"16px", outline:"none", boxSizing:"border-box" },
  label:{ fontFamily:"'Crimson Text', serif", fontSize:"11px", color:C.textMuted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px", display:"block" },
  btn:{ background:C.accentGrad, border:"none", borderRadius:"6px", padding:"12px 28px", color:"#fff", fontFamily:"'Crimson Text', serif", fontSize:"14px", letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", fontWeight:600, boxShadow:"0 2px 8px rgba(71,121,160,0.3)" },
  btnGhost:{ background:"none", border:`1px solid ${C.border}`, borderRadius:"6px", padding:"12px 24px", color:C.textSecond, fontFamily:"'Crimson Text', serif", fontSize:"14px", cursor:"pointer" },
  btnSmall:{ background:"none", border:`1px solid ${C.border}`, borderRadius:"6px", padding:"6px 14px", color:C.textSecond, fontFamily:"'Crimson Text', serif", fontSize:"12px", cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
}

function isImage(filename) {
  return /\.(jpg|jpeg|png|gif|webp|heic)$/i.test(filename);
}

function fileIcon(filename) {
  if (isImage(filename)) return "🖼️";
  if (/\.pdf$/i.test(filename)) return "📄";
  if (/\.(doc|docx)$/i.test(filename)) return "📝";
  return "📎";
}

// ── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
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
    } catch (e) { setMsg(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ maxWidth:"420px", width:"100%", background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:"12px", padding:"48px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"32px", color:C.textPrimary, marginBottom:"6px", textAlign:"center" }}>✦ TRAVELOGUE</div>
        <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"13px", color:C.textMuted, textAlign:"center", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"40px" }}>
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
        {msg && <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"14px", color: msg.includes("!") ? C.success : C.error, marginBottom:"16px", textAlign:"center" }}>{msg}</div>}
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

// ── Trip Form (shared by New and Edit) ───────────────────────────────────────
function TripForm({ initial, onSave, onClose, title, submitLabel }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(30,45,61,0.4)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", backdropFilter:"blur(4px)" }}>
      <div style={{ background:C.bgModal, border:`1px solid ${C.border}`, borderRadius:"12px", padding:"48px", maxWidth:"540px", width:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 8px 40px rgba(0,0,0,0.12)" }}>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"28px", color:C.textPrimary, marginBottom:"6px", fontWeight:500 }}>{title}</div>
        <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"13px", color:C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"36px" }}>Record a new chapter</div>
        {[{label:"TITLE",key:"title",type:"text",placeholder:"Peloponnese Road Trip"},{label:"START DATE",key:"startDate",type:"date"},{label:"END DATE",key:"endDate",type:"date"}].map(({label,key,type,placeholder}) => (
          <div key={key} style={{ marginBottom:"24px" }}>
            <label style={styles.label}>{label}</label>
            <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} style={styles.input} />
          </div>
        ))}
        <div style={{ marginBottom:"24px" }}>
          <label style={styles.label}>COUNTRY</label>
          <select value={form.country} onChange={e => set("country", e.target.value)} style={{ ...styles.input, background:"#fff" }}>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:"36px" }}>
          <label style={styles.label}>MOOD</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {MOODS.map(m => (
              <button key={m} onClick={() => set("mood", form.mood === m ? "" : m)}
                style={{ background: form.mood===m ? C.accentLight : "#fff", border:`1px solid ${form.mood===m ? C.accent : C.border}`, borderRadius:"20px", padding:"6px 14px", color: form.mood===m ? C.accent : C.textSecond, fontFamily:"'Crimson Text', serif", fontSize:"13px", cursor:"pointer" }}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:"16px" }}>
          <button onClick={() => { if (!form.title) return; onSave(form); }} style={{ ...styles.btn, flex:1 }}>{submitLabel}</button>
          <button onClick={onClose} style={styles.btnGhost}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Trip Card ────────────────────────────────────────────────────────────────
function TripCard({ trip, onClick, onDelete }) {
  const data = trip.data;
  return (
    <div onClick={() => onClick(trip)}
      style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"24px 28px", cursor:"pointer", transition:"all 0.2s ease", position:"relative", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor=C.borderHover; e.currentTarget.style.boxShadow="0 4px 16px rgba(71,121,160,0.12)"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform="translateY(0)"; }}>
      <div style={{ position:"absolute", top:0, left:0, width:"4px", height:"100%", background:C.stripe }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"22px", color:C.textPrimary, marginBottom:"6px", fontWeight:500 }}>{data.title}</div>
          <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"13px", color:C.accent, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"10px" }}>
            {data.country} · {formatDate(data.startDate)}{data.endDate ? ` — ${formatDate(data.endDate)}` : ""}
          </div>
          {data.mood && <div style={{ fontSize:"12px", color:C.textMuted, marginBottom:"8px" }}>{data.mood}</div>}
          <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"15px", color:C.textSecond, lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {data.entries?.[0]?.text || "No entries yet..."}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"8px", marginLeft:"20px" }}>
          <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"12px", color:C.textTiny, background:C.accentLight, padding:"3px 10px", borderRadius:"20px" }}>
            {data.entries?.length || 0} {data.entries?.length === 1 ? "entry" : "entries"}
          </div>
          <button onClick={e => { e.stopPropagation(); onDelete(trip.id); }}
            style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:"16px", padding:"4px", opacity:0.5, transition:"opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity="1"} onMouseLeave={e => e.currentTarget.style.opacity="0.5"}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ── Attachment Viewer ────────────────────────────────────────────────────────
function AttachmentList({ attachments, onDelete }) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", marginTop:"14px" }}>
      {attachments.map(att => (
        <div key={att.path} style={{ display:"flex", alignItems:"center", gap:"8px", background:C.accentLight, border:`1px solid ${C.border}`, borderRadius:"8px", padding:"6px 12px", maxWidth:"240px" }}>
          <span style={{ fontSize:"16px" }}>{fileIcon(att.name)}</span>
          {isImage(att.name) ? (
            <a href={att.url} target="_blank" rel="noreferrer" style={{ color:C.accent, fontFamily:"'Crimson Text', serif", fontSize:"13px", textDecoration:"none", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{att.name}</a>
          ) : (
            <a href={att.url} download={att.name} style={{ color:C.accent, fontFamily:"'Crimson Text', serif", fontSize:"13px", textDecoration:"none", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{att.name}</a>
          )}
          {onDelete && (
            <button onClick={() => onDelete(att)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:"14px", padding:"0", lineHeight:1, flexShrink:0 }}>✕</button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Trip Detail ──────────────────────────────────────────────────────────────
function TripDetail({ trip, onBack, onUpdate, userId }) {
  const [newEntry, setNewEntry] = useState("");
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [uploading, setUploading] = useState(null); // entryId or "trip"
  const [editingTrip, setEditingTrip] = useState(false);
  const fileInputRef = useRef();
  const [pendingUploadEntryId, setPendingUploadEntryId] = useState(null);
  const data = trip.data;

  const addEntry = () => {
    if (!newEntry.trim()) return;
    const entry = { id: Date.now(), text: newEntry.trim(), date: newEntryDate, attachments: [] };
    onUpdate(trip, { ...data, entries: [...(data.entries || []), entry] });
    setNewEntry("");
  };

  const deleteEntry = (id) => onUpdate(trip, { ...data, entries: data.entries.filter(e => e.id !== id) });

  const saveEdit = (id, text) => {
    onUpdate(trip, { ...data, entries: data.entries.map(e => e.id === id ? { ...e, text } : e) });
    setEditingEntry(null);
  };

  const handleFileUpload = async (e, entryId) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(entryId);
    const newAttachments = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("attachments").upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("attachments").getPublicUrl(path);
        newAttachments.push({ name: file.name, path, url: urlData.publicUrl });
      }
    }
    if (newAttachments.length) {
      const updatedEntries = data.entries.map(e =>
        e.id === entryId ? { ...e, attachments: [...(e.attachments || []), ...newAttachments] } : e
      );
      onUpdate(trip, { ...data, entries: updatedEntries });
    }
    setUploading(null);
    e.target.value = "";
  };

  const deleteAttachment = async (entryId, att) => {
    await supabase.storage.from("attachments").remove([att.path]);
    const updatedEntries = data.entries.map(e =>
      e.id === entryId ? { ...e, attachments: (e.attachments || []).filter(a => a.path !== att.path) } : e
    );
    onUpdate(trip, { ...data, entries: updatedEntries });
  };

  return (
    <div style={{ maxWidth:"700px", margin:"0 auto" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.accent, fontFamily:"'Crimson Text', serif", fontSize:"14px", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", padding:"0 0 32px 0" }}>
        ← All Journeys
      </button>

      {/* Trip Header */}
      <div style={{ marginBottom:"24px", background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"32px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"38px", color:C.textPrimary, lineHeight:1.1, marginBottom:"12px", fontWeight:500 }}>{data.title}</div>
            <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"14px", color:C.accent, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"8px" }}>
              {data.country} · {formatDate(data.startDate)}{data.endDate ? ` — ${formatDate(data.endDate)}` : ""}
            </div>
            {data.mood && <div style={{ fontSize:"14px", color:C.textMuted }}>{data.mood}</div>}
          </div>
          <button onClick={() => setEditingTrip(true)} style={styles.btnSmall}>Edit</button>
        </div>
      </div>

      {/* Add Entry */}
      <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"28px 32px", marginBottom:"28px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"12px", color:C.textMuted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"16px" }}>Add Entry</div>
        <input type="date" value={newEntryDate} onChange={e => setNewEntryDate(e.target.value)} style={{ ...styles.input, width:"auto", marginBottom:"12px" }} />
        <textarea value={newEntry} onChange={e => setNewEntry(e.target.value)} placeholder="What did you discover today..." rows={5}
          style={{ ...styles.input, resize:"vertical", lineHeight:1.8, fontSize:"17px" }}
          onKeyDown={e => { if (e.metaKey && e.key === "Enter") addEntry(); }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"12px" }}>
          <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"12px", color:C.textTiny }}>⌘ + Enter to save</div>
          <button onClick={addEntry} style={styles.btn}>Save Entry</button>
        </div>
      </div>

      {/* Entries */}
      <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"12px", color:C.textMuted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"16px" }}>
        {data.entries?.length || 0} {data.entries?.length === 1 ? "Entry" : "Entries"}
      </div>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} style={{ display:"none" }} multiple accept="image/*,.pdf,.doc,.docx"
        onChange={e => handleFileUpload(e, pendingUploadEntryId)} />

      {(data.entries || []).slice().reverse().map(entry => (
        <div key={entry.id} style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderLeft:`4px solid ${C.accent}`, borderRadius:"10px", padding:"24px 28px", marginBottom:"14px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"12px", color:C.accent, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"12px" }}>{formatDate(entry.date)}</div>

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
              <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"18px", color:C.textPrimary, lineHeight:1.85, whiteSpace:"pre-wrap" }}>{entry.text}</div>

              {/* Attachments */}
              <AttachmentList attachments={entry.attachments} onDelete={att => deleteAttachment(entry.id, att)} />

              {/* Image previews */}
              {(entry.attachments || []).filter(a => isImage(a.name)).length > 0 && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", marginTop:"14px" }}>
                  {entry.attachments.filter(a => isImage(a.name)).map(att => (
                    <a key={att.path} href={att.url} target="_blank" rel="noreferrer">
                      <img src={att.url} alt={att.name} style={{ width:"120px", height:"90px", objectFit:"cover", borderRadius:"6px", border:`1px solid ${C.border}` }} />
                    </a>
                  ))}
                </div>
              )}

              <div style={{ display:"flex", gap:"16px", marginTop:"14px", alignItems:"center" }}>
                <button onClick={() => setEditingEntry(entry.id)} style={{ background:"none", border:"none", color:C.textMuted, fontFamily:"'Crimson Text', serif", fontSize:"12px", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", padding:0 }}>Edit</button>
                <button onClick={() => deleteEntry(entry.id)} style={{ background:"none", border:"none", color:C.textMuted, fontFamily:"'Crimson Text', serif", fontSize:"12px", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", padding:0 }}>Delete</button>
                <button onClick={() => { setPendingUploadEntryId(entry.id); fileInputRef.current.click(); }}
                  style={{ background:"none", border:"none", color:C.accent, fontFamily:"'Crimson Text', serif", fontSize:"12px", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", padding:0 }}>
                  {uploading === entry.id ? "Uploading..." : "+ Attach"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {(!data.entries || data.entries.length === 0) && (
        <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"18px", color:C.textTiny, fontStyle:"italic", textAlign:"center", padding:"48px 0" }}>The pages await your stories...</div>
      )}

      {editingTrip && (
        <TripForm
          initial={{ title: data.title, country: data.country, startDate: data.startDate || "", endDate: data.endDate || "", mood: data.mood || "" }}
          title="Edit Journey"
          submitLabel="Save Changes"
          onSave={updated => { onUpdate(trip, { ...data, ...updated }); setEditingTrip(false); }}
          onClose={() => setEditingTrip(false)}
        />
      )}
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
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { setUser(session?.user ?? null); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (user) loadTrips(); }, [user]);

  const loadTrips = async () => {
    const { data, error } = await supabase.from("trips").select("*").order("created_at", { ascending: false });
    if (!error) setTrips(data || []);
  };

  const addTrip = async (tripData) => {
    const fullData = { ...tripData, entries: tripData.notes ? [{ id: Date.now(), text: tripData.notes, date: tripData.startDate || new Date().toISOString().split("T")[0], attachments: [] }] : [] };
    delete fullData.notes;
    const { data, error } = await supabase.from("trips").insert([{ user_id: user.id, data: fullData }]).select();
    if (!error) { setTrips(t => [data[0], ...t]); setShowNewTrip(false); }
  };

  const deleteTrip = async (id) => {
    await supabase.from("trips").delete().eq("id", id);
    setTrips(t => t.filter(x => x.id !== id));
  };

  const updateTrip = async (trip, newData) => {
    const { data, error } = await supabase.from("trips").update({ data: newData }).eq("id", trip.id).select();
    if (!error) { const updated = data[0]; setTrips(t => t.map(x => x.id === updated.id ? updated : x)); setSelectedTrip(updated); }
  };

  const signOut = async () => { await supabase.auth.signOut(); setTrips([]); setView("list"); };

  if (loading) return <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cormorant Garamond', serif", fontSize:"24px", color:C.textMuted }}>✦</div>;
  if (!user) return <AuthScreen onAuth={setUser} />;

  const filtered = trips.filter(t => !filter || t.data.title.toLowerCase().includes(filter.toLowerCase()) || t.data.country.toLowerCase().includes(filter.toLowerCase()));
  const totalEntries = trips.reduce((a, t) => a + (t.data.entries?.length || 0), 0);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.textPrimary, fontFamily:"'Crimson Text', serif" }}>
      <div style={{ borderBottom:`1px solid ${C.border}`, padding:"20px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.bgHeader, backdropFilter:"blur(12px)", zIndex:50, boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"24px", color:C.textPrimary, letterSpacing:"0.06em", fontWeight:500 }}>✦ TRAVELOGUE</div>
          <div style={{ fontSize:"12px", color:C.textMuted, letterSpacing:"0.08em", marginTop:"2px" }}>
            {trips.length} {trips.length === 1 ? "journey" : "journeys"} · {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
          </div>
        </div>
        <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
          {view === "list" && <button onClick={() => setShowNewTrip(true)} style={styles.btn}>+ New Journey</button>}
          <button onClick={signOut} style={{ ...styles.btnGhost, fontSize:"12px", padding:"8px 16px" }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth:"780px", margin:"0 auto", padding:"40px 24px" }}>
        {view === "list" ? (
          <>
            {trips.length > 2 && <input type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search journeys..." style={{ ...styles.input, marginBottom:"28px" }} />}
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"100px 0" }}>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"36px", color:C.border, marginBottom:"16px" }}>✦</div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"24px", color:C.textMuted, marginBottom:"12px" }}>{trips.length === 0 ? "Your journey begins here" : "No matches found"}</div>
                {trips.length === 0 && <div style={{ fontFamily:"'Crimson Text', serif", fontSize:"16px", color:C.textTiny, fontStyle:"italic" }}>Record your first adventure</div>}
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                {filtered.map(trip => <TripCard key={trip.id} trip={trip} onClick={t => { setSelectedTrip(t); setView("detail"); }} onDelete={deleteTrip} />)}
              </div>
            )}
          </>
        ) : (
          <TripDetail trip={selectedTrip} onBack={() => { setView("list"); setSelectedTrip(null); }} onUpdate={updateTrip} userId={user.id} />
        )}
      </div>

      {showNewTrip && (
        <TripForm
          initial={{ title:"", country:"Greece", startDate:"", endDate:"", mood:"", notes:"" }}
          title="New Journey"
          submitLabel="Begin Journey"
          onSave={addTrip}
          onClose={() => setShowNewTrip(false)}
        />
      )}
    </div>
  );
}
