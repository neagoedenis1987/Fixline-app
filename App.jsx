import { useState, useRef, useEffect, useCallback } from "react";


// ─── SUONO NOTIFICA ─────────────────────────────────────────────────────────
// Audio context condiviso - no memory leak
let audioCtx = null;
let audioQueue = false;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Sblocco Safari / iPhone - richiede interazione utente
document.addEventListener("click", async () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") await ctx.resume();
  } catch(e) {}
}, { once: true });

function playBeep({ freq1=523, freq2=659, volume=0.3, duration=0.3, delay=0 }) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(freq1, ctx.currentTime + delay);
    osc.frequency.setValueAtTime(freq2, ctx.currentTime + delay + duration/2);
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch(e) {}
}

function suonaNotifica(urgenza) {
  try {
    if (audioQueue) return;
    audioQueue = true;
    if (urgenza === "macchina ferma") {
      [0, 0.2, 0.4, 0.6, 0.8].forEach(delay => 
        playBeep({ freq1:1200, freq2:800, volume:0.4, duration:0.18, delay })
      );
    } else if (urgenza === "alta") {
      [0, 0.3, 0.6].forEach(delay =>
        playBeep({ freq1:880, freq2:660, volume:0.35, duration:0.28, delay })
      );
    } else {
      playBeep({ freq1:523, freq2:659, volume:0.25, duration:0.4 });
    }
    setTimeout(() => { audioQueue = false; }, 2000);
  } catch(e) {
    console.error("Errore audio:", e);
  }
}


// ─── LOGO MORONI AMATO ──────────────────────────────────────────────────────
const LOGO_BASE64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCADEBGUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKMj1oAKKMj1ooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKMg9DQAUUUUABGRikCgDFLketU9S1mw0i3a61G7SGNFyzuaBqMpO0SztCsAD+FDbVPBGfc14j8bP27vgJ8HdLlvLrx9pk9ygP+i+Yc8V8fP8A8FltQ+K3xvsvht4J8HHyLvci3EE38QZR3es5VqUHZs+ryrgniDNqMq1Ok4wirtvT8z9MNpIzjBoJLD0FYPw41W61nwRpuqXyOsk1srOr9c5q7rHijw/oOBq2pRQbn2rvPc1ofLyozjUdNatGnRUFreW15EJ7SdXRuhU1PketBnKL6hRRRQAUUUUAFFGR60UAFFGR60UAFFFFABRRRQAUUUZHrQAUUUUAFFFFABRRRQAUUZB6GigAooJA6mjI9aACiiigAooooAKKKKACiiigAooooAKKMjOM0UAFFGR60UAFFFFABRRkHoaKACiijIzjNABRRRQAUUUZHXNABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUHpxRRQA3JIIb8M00lVGeB9KUAEha89+Nv7S/wq+AWmvqHxG10WiIm7lQePxIoclE2w2FxGMrKlRi5SfRHoJdVG4sAPWqi63o73hs11O2Mg/5Z/aBn8q/Nf9pX/guTpGj/AGnSPgpd216Tld9xGo/xr5f+Gf8AwVc+Oknxoh8UeKLmBba9njilVH+V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ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKMD0oooAY8aMu1kyKx9a8BeEPEEZXUvDWnTE/xTWKOf1FbO1l6GjeRwRQVCpVpyvCVjO0rwp4e0SAR6VodnBt/54WyJ/IVo7QR93FH7yjax5JoFKU5yvJjqKKKBBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//Z";

function LogoMoroniAmato({ size = "small" }) {
  const big = size === "big";
  return (
    <img 
      src={LOGO_BASE64} 
      alt="Moroni Amato"
      style={{ 
        height: big ? 60 : 36, 
        width: "auto",
        objectFit: "contain",
        background: "white",
        borderRadius: big ? 10 : 6,
        padding: big ? "6px 12px" : "3px 8px"
      }}
    />
  );
}


// ─── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <div style={{ textAlign:"center", padding:"16px", fontSize:11, color:"#D0C8C0", borderTop:"1px solid #1E1E1E", background:"#F5F0EB", marginTop:"auto" }}>
      <span style={{ color:"#FF4D00", fontWeight:700, fontStyle:"italic" }}>FixLine 🔧</span>
      <span style={{ color:"#777" }}> — Sviluppato da </span>
      <span style={{ color:"#8B1A2B", fontWeight:700 }}>Neagoe Denis</span>
    </div>
  );
}

const macchine = [
  "L01 - Acido","L02 - 3 Litri","L03 - Alcool","L04","L05 - 1250",
  "L06 - Eurospin","L07 - 2 Litri","L08 - 5 Litri","L09 - 900 Genio",
  "L10 - 4 Litri","L11 - 5 Litri Nuovo","L12","L13 - Disgorgante","L14 - 1 Litro Nelson",
];
const tipiGuasto = ["Riordinatore","Riempitrice","Scattolatrice","Robot","Altro"];

const reparti = ["Linee", "Miscelazione"];

const componentiMiscelazione = ["Problemi pompa", "Problemi Unimix", "Problemi impianto acqua", "Altro"];



const problemiPerTipo = {
  "Riordinatore": ["Flaconi non girati", "Problemi fotocellula", "Nastro rotto", "Mancanza aria", "Altro"],
  "Riempitrice":  ["Problemi bilance", "Problemi ugelli", "Mancanza aria", "Problemi fotocellula", "Pompa prodotto", "Altro"],
  "Scattolatrice":["Problemi presa cartoni", "Problemi scotch", "Nastro rotto", "Problemi testa", "Problemi fotocellula", "Mancanza aria", "Altro"],
  "Robot":        ["Problemi presa cartoni", "Problemi pinza", "Problemi fotocellula", "Mancanza aria", "Problemi marcatore", "Altro"],
  "Altro":        ["Altro"],
};

// Operai con badge (codice a barre)
const operaiIniziali = [
  { id:"B001", badge:"B001", nome:"Marco Rossi" },
  { id:"B002", badge:"B002", nome:"Luigi Bianchi" },
  { id:"B003", badge:"B003", nome:"Anna Testa" },
  { id:"B004", badge:"B004", nome:"Piero Marino" },
  { id:"B005", badge:"B005", nome:"Rosa Ferri" },
];

// Team con password personale
const teamIniziale = [
  { id:1, nome:"Mimmo",    ruolo:"Capo",              colore:"#FF4D00", icona:"👑", stato:"libero", password:"mimmo123",   isAdmin:false, canSeeOperai:true,  canAssign:true  },
  { id:2, nome:"Nadia",    ruolo:"Vice Capo",         colore:"#B44FFF", icona:"⭐", stato:"libero", password:"nadia123",   isAdmin:false, canSeeOperai:true,  canAssign:true  },
  { id:3, nome:"Ovidio",   ruolo:"Responsabile",      colore:"#00C2FF", icona:"🔧", stato:"libero", password:"ovidio123",  isAdmin:false, canSeeOperai:true,  canAssign:true  },
  { id:4, nome:"Amedeo",   ruolo:"Responsabile",      colore:"#00C2FF", icona:"🔧", stato:"libero", password:"amedeo123",  isAdmin:false, canSeeOperai:true,  canAssign:true  },
  { id:5, nome:"Samuele",  ruolo:"Manutentore",       colore:"#FFB800", icona:"🛠", stato:"occupato",password:"samuele123", isAdmin:false, canSeeOperai:false, canAssign:false },
  { id:6, nome:"Giovanni", ruolo:"Capo Manutenzione", colore:"#00E676", icona:"⚙️", stato:"libero", password:"giovanni123",isAdmin:false, canSeeOperai:false, canAssign:false },
  { id:7, nome:"Sergio",   ruolo:"Operaio Miscelazione", colore:"#FF6B35", icona:"⚗️", stato:"libero", password:"sergio123",  isAdmin:false, canSeeOperai:false, canAssign:false },
];

const archivioIniziale = [
  { id:"a1", macchina:"L08 - 5 Litri",     intervento:"Cambio pompa",         tecnico:"Samuele",  data:"12/01/2026", durata:45, note:"Pompa usurata", voto:5 },
  { id:"a2", macchina:"L01 - Acido",       intervento:"Sostituzione sensore", tecnico:"Giovanni", data:"18/01/2026", durata:20, note:"Sensore fuori calibrazione", voto:4 },
  { id:"a3", macchina:"L13 - Disgorgante", intervento:"Pulizia riordinatore", tecnico:"Samuele",  data:"03/02/2026", durata:30, note:"Accumulo residui", voto:5 },
  { id:"a4", macchina:"L06 - Eurospin",    intervento:"Reset pannello",       tecnico:"Ovidio",   data:"14/02/2026", durata:10, note:"Errore E-04", voto:3 },
  { id:"a5", macchina:"L08 - 5 Litri",     intervento:"Cambio cinghia robot", tecnico:"Giovanni", data:"20/02/2026", durata:60, note:"Cinghia deteriorata", voto:5 },
];

const segnalazioniIniziali = [
  { id:"s1", macchina:"L01 - Acido",       tipo:"Riempitrice",  descrizione:"Perdita sul raccordo",         operaio:"Marco Rossi",  ora:"08:14", data:"12/05/2026", stato:"aperto",   urgenza:"alta",  inCarico:null,      durata:null, voto:null, commento:"" },
  { id:"s2", macchina:"L08 - 5 Litri",     tipo:"Robot",        descrizione:"Linea bloccata",               operaio:"Luigi Bianchi",ora:"09:32", data:"12/05/2026", stato:"in corso", urgenza:"alta",  inCarico:"Samuele", durata:null, voto:null, commento:"" },
  { id:"s3", macchina:"L13 - Disgorgante", tipo:"Riordinatore", descrizione:"Rumore metallico",             operaio:"Anna Testa",   ora:"10:05", data:"11/05/2026", stato:"risolto",  urgenza:"media", inCarico:"Giovanni",oraPreso:"10:12", oraRisolto:"10:38", durata:26, voto:8, commento:"Ottimo lavoro, risolto in fretta!" },
  { id:"s4", macchina:"L06 - Eurospin",    tipo:"Altro",        descrizione:"Pannello errore E-04",         operaio:"Piero Marino", ora:"11:20", data:"10/05/2026", stato:"aperto",   urgenza:"media", inCarico:null,      durata:null, voto:null, commento:"" },
];

const urgCol = { alta:"#FF3B30", media:"#FF9500", bassa:"#34C759", "macchina ferma":"#7B0000" };
const stCol  = { aperto:"#FF3B30", "in corso":"#FF9500", risolto:"#34C759" };
const stLbl  = { aperto:"APERTO", "in corso":"IN CORSO", risolto:"RISOLTO" };
const B = { border:"none", borderRadius:10, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:700 };

function VotoDisplay({ voto }) {
  const color = voto>=8?"#34C759":voto>=5?"#FF9500":"#FF3B30";
  return <span style={{ fontSize:16, fontWeight:700, color, background:color+"20", padding:"3px 10px", borderRadius:20 }}>{voto}/10</span>;
}

function Stelle({ voto, onVota, readonly }) {
  return (
    <div style={{ display:"flex", gap:4 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => !readonly && onVota && onVota(s)}
          style={{ fontSize:22, cursor:readonly?"default":"pointer", filter:s*2<=voto?"none":"grayscale(1) opacity(0.3)" }}>⭐</span>
      ))}
    </div>
  );
}

// ═══════════════════ TABLET OPERAIO ═══════════════════
function TabletOperaio({ segnalazioni, setSegnalazioni, operai }) {
  const [step, setStep]         = useState("badge"); // badge | form | voto | grazie | errore
  const [operaio, setOperaio]   = useState(null);
  const [badgeInput, setBadgeInput] = useState("");
  const [form, setForm]         = useState({ macchina:"", tipo:"", descrizione:"", urgenza:"media" });
  const [votoPending, setVotoPending] = useState(null);
  const [votoNum, setVotoNum] = useState(0);
  const [votoTesto, setVotoTesto] = useState("");
  const badgeRef = useRef(null);
  const logoutTimer = useRef(null);

  const daVotare = segnalazioni.find(s => s.stato==="risolto" && !s.voto && s.operaio===operaio?.nome);

  // Auto-focus sul campo badge
  useEffect(() => {
    if (step==="badge" && badgeRef.current) badgeRef.current.focus();
  }, [step]);

  // Auto-logout dopo 3 minuti di inattività
  useEffect(() => {
    if (!operaio) return;
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => { logout(); }, 3 * 60 * 1000);
    return () => { if (logoutTimer.current) clearTimeout(logoutTimer.current); };
  }, [operaio, step]);

  const leggiBadge = () => {
    const codice = badgeInput.trim().toUpperCase();
    const trovato = operai.find(o => o.badge.toUpperCase() === codice);
    if (trovato) {
      setOperaio(trovato);
      // Controlla se c'è qualcosa da votare
      const dv = segnalazioni.find(s => s.stato==="risolto" && !s.voto && s.operaio===trovato.nome);
      if (dv) { setVotoPending(dv); setStep("voto"); }
      else setStep("form");
    } else {
      setStep("errore");
      setTimeout(() => { setStep("badge"); setBadgeInput(""); }, 2000);
    }
  };

  const logout = () => {
    setOperaio(null);
    setStep("badge");
    setBadgeInput("");
    setForm({ macchina:"", tipo:"", descrizione:"", urgenza:"media" });
  };

  const invia = () => {
    if (!form.macchina || !form.tipo || !form.sottotipo) return;
    const now = new Date();
    setSegnalazioni(prev => [{
      id: crypto.randomUUID(),
      ...form,
      descrizione: form.descrizione || "Guasto segnalato",
      operaio: operaio.nome,
      ora: now.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}),
      data: now.toLocaleDateString("it-IT"),
      stato:"aperto", inCarico:null, durata:null, voto:null,
    }, ...prev]);
    setStep("grazie");
    logoutTimer.current = setTimeout(() => logout(), 3000);
  };

  const daiVoto = (id, v) => {
    setSegnalazioni(prev => {
      const updated = prev.map(s => s.id===id ? {...s, voto:v, commento:votoTesto} : s);
      const altri = updated.filter(s => s.stato==="risolto" && !s.voto && s.operaio===operaio?.nome && s.id!==id);
      setVotoNum(0);
      setVotoTesto("");
      if (altri.length > 0) {
        setTimeout(() => { setVotoPending(altri[0]); setStep("voto"); }, 150);
      } else {
        setStep("grazie");
        logoutTimer.current = setTimeout(() => logout(), 3000);
      }
      return updated;
    });
  };

  return (
    <div style={{ background:"#F5F0EB", fontFamily:"Georgia,serif", maxWidth:768, margin:"0 auto", minHeight:"100vh", display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ background:"#FFFFFF", borderBottom:"1px solid #222", padding:"20px 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <LogoMoroniAmato size="small"/>
          <div style={{ fontSize:18, color:"#FF4D00", fontStyle:"italic", fontWeight:700, marginTop:4 }}>FixLine 🔧</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {operaio && (
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13, color:"#1A1A1A", fontWeight:700 }}>{operaio.nome}</div>
  
            </div>
          )}
          <div style={{ width:10, height:10, borderRadius:"50%", background:"#34C759" }}/>
        </div>
      </div>

      {/* BADGE LOGIN */}
      {step==="badge" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, gap:24 }}>
          <div style={{ fontSize:64 }}>🏷️</div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:28, color:"#1A1A1A", marginBottom:8 }}>Passa il tuo badge</div>
            <div style={{ fontSize:15, color:"#777" }}>Avvicina il badge al lettore oppure inserisci il codice</div>
          </div>

          {/* Campo nascosto che riceve il codice dal lettore */}
          <div style={{ width:"100%", maxWidth:400, display:"flex", flexDirection:"column", gap:12 }}>
            <input
              ref={badgeRef}
              value={badgeInput}
              onChange={e => setBadgeInput(e.target.value)}
              placeholder="Codice badge..."
              onKeyDown={e=>e.key==="Enter"&&leggiBadge()}
style={{ width:"100%", padding:"18px", background:"#F0EBE5", border:"2px solid #FF4D0050", borderRadius:12, color:"#1A1A1A", fontFamily:"Georgia,serif", fontSize:18, textAlign:"center", letterSpacing:"0.2em", boxSizing:"border-box" }}
              autoComplete="off"
            />
            <button onClick={leggiBadge} style={{ ...B, padding:"16px", background:"#FF4D00", color:"#fff", fontSize:16, borderRadius:12 }}>
              ✓ ENTRA
            </button>
          </div>

          {/* Lista operai per demo */}
          <div style={{ marginTop:8, padding:"12px 16px", background:"#FFFFFF", border:"1px solid #2A2A2A", borderRadius:10, fontSize:12, color:"#777", textAlign:"center" }}>
            📋 Demo: prova con B001, B002, B003, B004, B005
          </div>
        </div>
      )}

      {/* ERRORE BADGE */}
      {step==="errore" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:40 }}>
          <div style={{ fontSize:64 }}>❌</div>
          <div style={{ fontSize:22, color:"#FF3B30", fontWeight:700 }}>Badge non riconosciuto</div>
          <div style={{ fontSize:15, color:"#777" }}>Contatta il responsabile</div>
        </div>
      )}

      {/* FORM SEGNALAZIONE */}
      {step==="form" && (
        <div style={{ flex:1, padding:"24px 32px", overflowY:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <div style={{ fontSize:20, color:"#1A1A1A" }}>Nuova Segnalazione</div>
            <button onClick={logout} style={{ ...B, background:"#F0EBE5", border:"1px solid #333", color:"#555", padding:"6px 12px", fontSize:11, fontWeight:400, borderRadius:6 }}>Esci</button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:500 }}>
            {/* Operaio identificato */}
            <div style={{ padding:"12px 16px", background:"#34C75915", border:"1px solid #34C75940", borderRadius:10, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:20 }}>✅</span>
              <div>
                <div style={{ fontSize:13, color:"#34C759", fontWeight:700 }}>Identificato come: {operaio?.nome}</div>
  
              </div>
            </div>

            <div>
              <div style={{ fontSize:11, color:"#777", letterSpacing:"0.12em", marginBottom:8 }}>MACCHINA *</div>
              <select value={form.macchina} onChange={e=>setForm({...form,macchina:e.target.value})} style={{ width:"100%", padding:"14px", background:"#F0EBE5", border:"1px solid #333", borderRadius:10, color:form.macchina?"#1A1A1A":"#777", fontFamily:"Georgia,serif", fontSize:15 }}>
                <option value="">Seleziona macchina...</option>
                {macchine.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <div style={{ fontSize:11, color:"#777", letterSpacing:"0.12em", marginBottom:8 }}>TIPO GUASTO *</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {tipiGuasto.map(t=>(
                  <button key={t} onClick={()=>setForm({...form,tipo:t,sottotipo:""})} style={{ ...B, padding:"14px", background:form.tipo===t?"#FF4D0020":"#F0EBE5", border:`1px solid ${form.tipo===t?"#FF4D00":"#D0C8C0"}`, color:form.tipo===t?"#FF4D00":"#555", fontSize:14, fontWeight:400 }}>{t}</button>
                ))}
              </div>
            </div>

            {form.tipo && problemiPerTipo[form.tipo] && (
              <div>
                <div style={{ fontSize:11, color:"#777", letterSpacing:"0.12em", marginBottom:8 }}>PROBLEMA SPECIFICO *</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {problemiPerTipo[form.tipo].map(p=>(
                    <button key={p} onClick={()=>setForm({...form,sottotipo:p})} style={{ ...B, padding:"14px", background:form.sottotipo===p?"#FF4D0020":"#F0EBE5", border:`1px solid ${form.sottotipo===p?"#FF4D00":"#D0C8C0"}`, color:form.sottotipo===p?"#FF4D00":"#555", fontSize:14, fontWeight:400, textAlign:"left" }}>
                      {form.sottotipo===p?"✓ ":""}{p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize:11, color:"#777", letterSpacing:"0.12em", marginBottom:8 }}>URGENZA</div>
              <div style={{ display:"flex", gap:8 }}>
                {["bassa","media","alta","macchina ferma"].map(u=>(
                  <button key={u} onClick={()=>setForm({...form,urgenza:u})} style={{ ...B, flex:1, padding:"12px", background:form.urgenza===u?urgCol[u]+"20":"#F0EBE5", border:`1px solid ${form.urgenza===u?urgCol[u]:"#D0C8C0"}`, color:form.urgenza===u?urgCol[u]:"#555", textTransform:"uppercase", fontSize:12, fontWeight:400 }}>{u}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize:11, color:"#777", letterSpacing:"0.12em", marginBottom:8 }}>DESCRIZIONE (opzionale)</div>
              <textarea value={form.descrizione} onChange={e=>setForm({...form,descrizione:e.target.value})} placeholder="Descrivi il problema..." rows={3} style={{ width:"100%", padding:"14px", background:"#F0EBE5", border:"1px solid #333", borderRadius:10, color:"#1A1A1A", fontFamily:"Georgia,serif", fontSize:14, resize:"none", boxSizing:"border-box" }}/>
            </div>


            <button onClick={invia} style={{ ...B, padding:"18px", background:form.macchina&&form.tipo&&form.sottotipo&&form.operaio?"#FF4D00":"#F0EBE5", color:form.macchina&&form.tipo&&form.sottotipo&&form.operaio?"#fff":"#555", fontSize:17, borderRadius:12 }}>
              🔔 INVIA — NOTIFICA IL TEAM
            </button>
          </div>
        </div>
      )}

      {/* VOTO */}
      {step==="voto" && votoPending && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center", gap:16 }}>
          <div style={{ fontSize:56 }}>🔧</div>
          <div style={{ fontSize:22, color:"#1A1A1A", fontWeight:700 }}>Guasto risolto!</div>
          <div style={{ padding:"10px 20px", background:"#34C75915", border:"1px solid #34C75940", borderRadius:10 }}>
            <div style={{ fontSize:14, color:"#555" }}>{votoPending.macchina}</div>
            <div style={{ fontSize:15, color:"#34C759", marginTop:4 }}>Risolto da <strong>{votoPending.inCarico}</strong></div>
          </div>

          <div style={{ width:"100%", maxWidth:400 }}>
            <div style={{ fontSize:13, color:"#555", marginBottom:12 }}>Dai un voto al lavoro fatto (1-10)</div>

            {/* Griglia voti 1-10 */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:16 }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => {
                const c = n>=8?"#34C759":n>=5?"#FF9500":"#FF3B30";
                const sel = votoNum === n;
                return (
                  <button key={n} onClick={()=>setVotoNum(n)}
                    style={{ ...B, padding:"14px 0", background:sel?c+"25":"#F0EBE5", border:`2px solid ${sel?c:"#E0D8D0"}`, color:sel?c:"#555", fontSize:18, fontWeight:700, borderRadius:10 }}>
                    {n}
                  </button>
                );
              })}
            </div>

            {/* Commento opzionale */}
            <div style={{ textAlign:"left", marginBottom:14 }}>
              <div style={{ fontSize:11, color:"#777", letterSpacing:"0.1em", marginBottom:6 }}>COMMENTO (opzionale)</div>
              <textarea
                value={votoTesto}
                onChange={e=>setVotoTesto(e.target.value)}
                placeholder="Es. Ottimo lavoro, risolto velocemente..."
                rows={3}
                style={{ width:"100%", padding:"12px", background:"#F0EBE5", border:"1px solid #2A2A2A", borderRadius:10, color:"#1A1A1A", fontFamily:"Georgia,serif", fontSize:13, resize:"none", boxSizing:"border-box" }}
              />
            </div>

            <button
              onClick={()=>{ if(votoNum>0) daiVoto(votoPending.id, votoNum); }}
              style={{ ...B, width:"100%", padding:"16px", background:votoNum>0?"#FF4D00":"#F0EBE5", color:votoNum>0?"#fff":"#555", fontSize:16, borderRadius:12, marginBottom:8 }}>
              ✓ INVIA FEEDBACK
            </button>
            <button onClick={()=>{ setVotoNum(0); setVotoTesto(""); setStep("form"); }} style={{ ...B, background:"none", color:"#777", padding:"8px", fontSize:12, fontWeight:400, width:"100%" }}>Salta — non voglio lasciare un voto</button>
          </div>
        </div>
      )}

      {/* GRAZIE */}
      <Footer/>
      {step==="grazie" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, textAlign:"center", gap:16 }}>
          <div style={{ fontSize:80 }}>✅</div>
          <div style={{ fontSize:26, color:"#34C759", fontWeight:700 }}>Inviato!</div>
          <div style={{ fontSize:15, color:"#555" }}>Il team è stato notificato. Grazie {operaio?.nome}!</div>
          <div style={{ fontSize:12, color:"#555", marginTop:8 }}>Logout automatico in corso...</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════ APP MANUTENTORI (TELEFONO) ═══════════════════
// ─── STATISTICHE OPERAI PER LINEA ──────────────────────────────
function StatOperai({ segnalazioni, macchine }) {
  const [lineaSel, setLineaSel] = React.useState(null);
  const tuttiReparti = [...macchine, "Miscelazione"];

  if (!lineaSel) {
    return (
      <div style={{padding:16}}>
        <div style={{fontSize:11,color:"#777",marginBottom:14,background:"#F5F0EB",padding:"10px 14px",borderRadius:8}}>
          📊 Seleziona una linea per vedere chi segnala di più
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {tuttiReparti.map(m=>{
            const cnt = m==="Miscelazione"
              ? segnalazioni.filter(s=>s.macchina?.includes("Miscelazione")).length
              : segnalazioni.filter(s=>s.macchina===m).length;
            return (
              <button key={m} onClick={()=>setLineaSel(m)} style={{background:"#FFFFFF",border:"1px solid #E0D8D0",borderLeft:"3px solid #8B1A2B",borderRadius:10,padding:"12px",textAlign:"left",cursor:"pointer",fontFamily:"Georgia,serif"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#1A1A1A"}}>{m==="Miscelazione"?"⚗️ "+m:"🏭 "+m}</div>
                <div style={{fontSize:11,color:"#8B1A2B",marginTop:3}}>{cnt} segnalazioni</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const segLinea = lineaSel==="Miscelazione"
    ? segnalazioni.filter(s=>s.macchina?.includes("Miscelazione"))
    : segnalazioni.filter(s=>s.macchina===lineaSel);

  const perOperaio = {};
  segLinea.forEach(s=>{
    if (!s.operaio) return;
    if (!perOperaio[s.operaio]) perOperaio[s.operaio]={nome:s.operaio,totale:0,problemi:{}};
    perOperaio[s.operaio].totale++;
    const prob = s.tipo+(s.sottotipo&&s.sottotipo!=="Altro"?" — "+s.sottotipo:"");
    perOperaio[s.operaio].problemi[prob]=(perOperaio[s.operaio].problemi[prob]||0)+1;
  });

  const tuttiProblemi = {};
  segLinea.forEach(s=>{
    const prob = s.tipo+(s.sottotipo&&s.sottotipo!=="Altro"?" — "+s.sottotipo:"");
    tuttiProblemi[prob]=(tuttiProblemi[prob]||0)+1;
  });
  const topProblemi = Object.entries(tuttiProblemi).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const listaOperai = Object.values(perOperaio).sort((a,b)=>b.totale-a.totale);

  return (
    <div style={{padding:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button onClick={()=>setLineaSel(null)} style={{background:"#F0EBE5",border:"1px solid #E0D8D0",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,color:"#777"}}>← Indietro</button>
        <div style={{fontSize:15,fontWeight:700,color:"#1A1A1A",flex:1}}>{lineaSel==="Miscelazione"?"⚗️ "+lineaSel:"🏭 "+lineaSel}</div>
        <div style={{fontSize:12,color:"#8B1A2B"}}>{segLinea.length} segnalazioni</div>
      </div>

      {segLinea.length===0 ? (
        <div style={{textAlign:"center",padding:40,color:"#777",fontSize:13}}>Nessuna segnalazione su questa linea</div>
      ) : (
        <div>
          {topProblemi.length>0 && (
            <div style={{background:"#FFF8F0",border:"1px solid #FFB80030",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
              <div style={{fontSize:10,color:"#777",letterSpacing:"0.1em",marginBottom:8}}>PROBLEMI PIÙ FREQUENTI</div>
              {topProblemi.map(([prob,cnt])=>(
                <div key={prob} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{flex:1,fontSize:12,color:"#444"}}>{prob}</div>
                  <div style={{fontSize:12,fontWeight:700,color:"#8B1A2B"}}>{cnt}x</div>
                  <div style={{width:50,height:5,background:"#F0EBE5",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:(cnt/segLinea.length*100)+"%",background:"#8B1A2B",borderRadius:3}}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{fontSize:10,color:"#777",letterSpacing:"0.1em",marginBottom:8}}>SEGNALAZIONI PER OPERAIO</div>
          {listaOperai.map((op,i)=>(
            <div key={op.nome} style={{background:"#FFFFFF",border:"1px solid #E0D8D0",borderLeft:"4px solid "+(i===0?"#FFB800":i===1?"#C0C0C0":i===2?"#CD7F32":"#E0D8D0"),borderRadius:10,padding:"12px 14px",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <div style={{fontSize:18}}>{ ["🥇","🥈","🥉"][i]||"👷" }</div>
                <div style={{flex:1,fontSize:14,fontWeight:700,color:"#1A1A1A"}}>{op.nome}</div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:22,fontWeight:900,color:"#8B1A2B"}}>{op.totale}</div>
                  <div style={{fontSize:9,color:"#777"}}>SEGNALAZIONI</div>
                </div>
              </div>
              {Object.entries(op.problemi).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([prob,cnt])=>(
                <div key={prob} style={{fontSize:11,color:"#777",marginTop:2}}>• {prob} × {cnt}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TelefonoTeam({ segnalazioni, setSegnalazioni, archivio, setArchivio, team, setTeam }) {
  const [view, setView]       = useState("guasti");
  const [selected, setSel]    = useState(null);
  const [utente, setUtente]   = useState(null);
  const [loginForm, setLoginForm] = useState({ nome:"", password:"" });
  const [loginErr, setLoginErr]   = useState("");
  const [filtro, setFiltro]   = useState("tutti");
  const [durataForm, setDurataForm] = useState("");
  const [lavoroFatto, setLavoroFatto] = useState("");
  const [cerca, setCerca]     = useState("");
  const [cercaMac, setCercaMac] = useState("");
  const [formSeg, setFormSeg] = useState({ macchina:"", tipo:"", sottotipo:"", descrizione:"", urgenza:"media" });
  const [segnalatoTeam, setSegnalatoTeam] = useState(false);
  const [nuovoM, setNuovoM]   = useState({ nome:"", ruolo:"", password:"", telefono:"" });
  const [cambioPass, setCambioPass] = useState({ vecchia:"", nuova:"", conferma:"" });
  const [passMsg, setPassMsg] = useState("");



  // Banner notifica nuovi guasti
  const [nuovoGuasto, setNuovoGuasto] = useState(null);
  const [messaggioMese, setMessaggioMese] = useState(null); // {tipo: "avviso"|"countdown"|"vincitore", testo, vincitore}
  const [premioVisibile, setPremioVisibile] = useState(false);
  const macchineFermeAperte = segnalazioni.filter(s=>s.urgenza==="macchina ferma"&&s.stato==="aperto"&&!s.inCarico);
  const [emergenza, setEmergenza] = useState(macchineFermeAperte.length>0 ? macchineFermeAperte[0] : null);
  const prevAperteRef = useRef(null);
  useEffect(() => {
    const nuoveAperte = segnalazioni.filter(s=>s.stato==="aperto").length;
    if (prevAperteRef.current !== null && nuoveAperte > prevAperteRef.current) {
      const ultima = [...segnalazioni].reverse().find(s=>s.stato==="aperto");
      if (ultima) {
        if (ultima.urgenza === "macchina ferma") {
          setEmergenza(ultima);
          suonaNotifica("macchina ferma");
        } else {
          setNuovoGuasto(ultima);
          suonaNotifica(ultima.urgenza);
          setTimeout(()=>setNuovoGuasto(null), 5000);
        }
      }
    }
    prevAperteRef.current = nuoveAperte;
    // Also show emergency if there are unhandled macchina ferma
    const fermeAperte = segnalazioni.filter(s=>s.urgenza==="macchina ferma"&&s.stato==="aperto"&&!s.inCarico);
    if (fermeAperte.length>0 && !emergenza) {
      setEmergenza(fermeAperte[0]);
    }
  }, [segnalazioni]);

  const aperte  = segnalazioni.filter(s=>s.stato==="aperto").length;
  const inCorso = segnalazioni.filter(s=>s.stato==="in corso").length;
  const risolte = segnalazioni.filter(s=>s.stato==="risolto").length;
  const liberi  = team.filter(t=>t.stato==="libero").length;
  const filtrate = (() => {
    let lista = filtro==="tutti" ? [...segnalazioni] : segnalazioni.filter(s=>s.stato===filtro);
    // Macchina ferma sempre in cima
    lista.sort((a,b)=>{
      if(a.urgenza==="macchina ferma" && b.urgenza!=="macchina ferma") return -1;
      if(b.urgenza==="macchina ferma" && a.urgenza!=="macchina ferma") return 1;
      // Poi aperti, poi in corso, poi risolti
      const ord = {"aperto":0,"in corso":1,"risolto":2};
      return (ord[a.stato]||0)-(ord[b.stato]||0);
    });
    return lista;
  })();
  const membroTeam = nome => team.find(t=>t.nome===nome);
  const isAdmin = utente?.isAdmin;

  const login = () => {
    const trovato = team.find(t => t.nome.toLowerCase()===loginForm.nome.toLowerCase() && t.password===loginForm.password);
    if (trovato) {
      setUtente(trovato);
      setLoginErr("");
    } else {
      setLoginErr("Nome o password errati");
    }
  };

  const cambiaPassword = () => {
    if (cambioPass.vecchia !== utente.password) { setPassMsg("❌ Password attuale errata"); return; }
    if (cambioPass.nuova !== cambioPass.conferma) { setPassMsg("❌ Le password non coincidono"); return; }
    if (cambioPass.nuova.length < 6) { setPassMsg("❌ Password troppo corta (min 6 caratteri)"); return; }
    setTeam(prev => prev.map(t => t.id===utente.id ? {...t, password:cambioPass.nuova} : t));
    setUtente(prev => ({...prev, password:cambioPass.nuova}));
    setCambioPass({ vecchia:"", nuova:"", conferma:"" });
    setPassMsg("✅ Password cambiata!");
    setTimeout(() => setPassMsg(""), 3000);
  };

  // Calcola ultimo giorno lavorativo del mese
  const ultimoGiornoLavorativo = (anno, mese) => {
    let giorno = new Date(anno, mese + 1, 0); // ultimo del mese
    while (giorno.getDay() === 0 || giorno.getDay() === 6) {
      giorno.setDate(giorno.getDate() - 1);
    }
    return giorno;
  };

  // Controlla se oggi è il giorno e l'ora giusta per mandare messaggi
  const controllaMese = () => {
    const ora = new Date();
    const ultimoLav = ultimoGiornoLavorativo(ora.getFullYear(), ora.getMonth());
    const isUltimoGiorno = ora.toDateString() === ultimoLav.toDateString();
    const oraCorrente = ora.getHours() * 60 + ora.getMinutes();
    const ore12 = 12 * 60;
    const ore14 = 14 * 60;

    if (!isUltimoGiorno) return;

    // Trova vincitore
    const vincitore = stats[0];

    if (oraCorrente >= ore14) {
      // Fine classifica - annuncia vincitore
      setMessaggioMese({
        tipo: "vincitore",
        vincitore: vincitore?.nome || "—",
        guasti: vincitore?.interventi || 0,
        voto: vincitore?.votoMedio || "—",
        icona: vincitore?.icona || "🏆"
      });
    } else if (oraCorrente >= ore12) {
      // Mancano 2 ore
      setMessaggioMese({ tipo: "countdown" });
    } else if (oraCorrente >= ore12 - 30) {
      // Avviso mattina
      setMessaggioMese({ tipo: "avviso" });
    }
  };

  // Check ogni minuto
  useEffect(() => {
    controllaMese();
    const interval = setInterval(controllaMese, 60000);
    return () => clearInterval(interval);
  }, [segnalazioni]);

  const prendiInCarico = id => {
    const now = new Date();
    const oraPreso = now.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});
    setSegnalazioni(prev=>prev.map(s=>s.id===id?{...s,stato:"in corso",inCarico:utente.nome,oraPreso}:s));
    setTeam(prev=>prev.map(t=>t.nome===utente.nome?{...t,stato:"occupato"}:t));
    setSel(prev=> prev ? {...prev,stato:"in corso",inCarico:utente.nome,oraPreso} : null);
  };

  const risolvi = id => {
    const now = new Date();
    const oraRisolto = now.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});
    const seg = segnalazioni.find(s=>s.id===id);
    // Calcola durata automatica in minuti
    let durata = 0;
    if (seg?.oraPreso) {
      const [h1,m1] = seg.oraPreso.split(":").map(Number);
      const [h2,m2] = oraRisolto.split(":").map(Number);
      durata = (h2*60+m2) - (h1*60+m1);
      if (durata < 0) durata += 24*60;
    }
    setSegnalazioni(prev=>prev.map(s=>s.id===id?{...s,stato:"risolto",oraRisolto,durata}:s));
    if (seg?.inCarico) setTeam(prev=>prev.map(t=>t.nome===seg.inCarico?{...t,stato:"libero"}:t));
    setArchivio(prev=>[{ id:crypto.randomUUID(), macchina:seg.macchina, reparto:seg.reparto||"Linee", intervento:lavoroFatto||seg.tipo+" — "+seg.descrizione.substring(0,25), tecnico:seg.inCarico, data:now.toLocaleDateString("it-IT"), durata, note:seg.descrizione+(lavoroFatto?" | Lavoro: "+lavoroFatto:""), voto:null }, ...prev]);
    setSel(prev=> prev ? {...prev,stato:"risolto",oraRisolto,durata} : null);
  };

  const assegnaManutentore = (guastoId, nomeManutentore) => {
    setSegnalazioni(prev=>prev.map(s=>s.id===guastoId?{...s,stato:"in corso",inCarico:nomeManutentore}:s));
    setTeam(prev=>prev.map(t=>t.nome===nomeManutentore?{...t,stato:"occupato"}:t));
    if(selected?.id===guastoId) setSel(prev=>prev?{...prev,stato:"in corso",inCarico:nomeManutentore}:null);
  };

  

  const nonRiescoARisolvere = (id) => {
    const seg = segnalazioni.find(s=>s.id===id);
    const now = new Date();
    const ora = now.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});
    // Reopen the fault, free the technician, add to cronologia
    setSegnalazioni(prev=>prev.map(s=>s.id===id?{
      ...s,
      stato:"aperto",
      inCarico:null,
      oraPreso:null,
      passaggi:[...(s.passaggi||[]),{
        da:utente.nome,
        ora,
        data:now.toLocaleDateString("it-IT"),
        motivo:"Non riuscito a risolvere"
      }],
      nonRisolti:[...(s.nonRisolti||[]),utente.nome]
    }:s));
    setTeam(prev=>prev.map(t=>t.nome===utente.nome?{...t,stato:"libero"}:t));
    setSel(null);
  };

  const inviaSegnalazione = () => {
    const campiOk = formSeg.reparto==="Miscelazione" 
      ? formSeg.componente
      : formSeg.macchina && formSeg.tipo && formSeg.sottotipo;
    if (!campiOk) return;
    const now = new Date();
    const macchinaFinale = formSeg.reparto==="Miscelazione" 
      ? "Miscelazione — "+formSeg.componente 
      : formSeg.macchina;
    setSegnalazioni(prev=>[{ 
      id:crypto.randomUUID(), 
      ...formSeg, 
      macchina: macchinaFinale,
      descrizione:formSeg.descrizione||"Segnalato dal team", 
      operaio:utente.nome, 
      ora:now.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}), 
      data:now.toLocaleDateString("it-IT"), 
      stato:"aperto", inCarico:null, durata:null, voto:null, commento:"" 
    }, ...prev]);
    suonaNotifica(formSeg.urgenza);
    setSegnalatoTeam(true);
    setTimeout(()=>{ setSegnalatoTeam(false); setView("guasti"); setFormSeg({ reparto:"Linee", macchina:"", componente:"", tipo:"", sottotipo:"", descrizione:"", urgenza:"media", foto:"" }); }, 2200);
  };

  const aggiungiMembro = () => {
    if (!nuovoM.nome || !nuovoM.ruolo || !nuovoM.password) return;
    setTeam(prev=>[...prev, { id:crypto.randomUUID(), ...nuovoM, colore:"#00C2FF", icona:"👤", stato:"libero", isAdmin:false }]);
    setNuovoM({ nome:"", ruolo:"", password:"", telefono:"" });
  };

  const stats = team.map(p=>{
    const ints = archivio.filter(a=>a.tecnico===p.nome && a.tecnico);
    const segRisolte = segnalazioni.filter(s=>s.inCarico===p.nome&&s.stato==="risolto");
    
    // Voto medio
    const tuttiVoti = [...ints.filter(a=>a.voto).map(a=>a.voto), ...segnalazioni.filter(s=>s.inCarico===p.nome&&s.voto).map(s=>s.voto)];
    const votoMedio = tuttiVoti.length>0 ? (tuttiVoti.reduce((a,b)=>a+b,0)/tuttiVoti.length).toFixed(1) : null;
    
    // Tempo medio risoluzione (minuti)
    const durataMedia = ints.length>0 ? Math.round(ints.reduce((s,a)=>s+a.durata,0)/ints.length) : 0;
    
    // Tempo medio risposta (da segnalazione a presa in carico)
    const tempiRisposta = segRisolte.filter(s=>s.ora&&s.oraPreso&&s.inCarico===p.nome).map(s=>{
      const [h1,m1] = s.ora.split(":").map(Number);
      const [h2,m2] = s.oraPreso.split(":").map(Number);
      let diff = (h2*60+m2)-(h1*60+m1);
      if(diff<0) diff+=24*60;
      return diff;
    });
    const tempoRispostaMedia = tempiRisposta.length>0 ? Math.round(tempiRisposta.reduce((a,b)=>a+b,0)/tempiRisposta.length) : null;
    
    // Non risolti
    const nonRisolti = segnalazioni.filter(s=>(s.nonRisolti||[]).includes(p.nome)).length;
    
    // Punteggio finale (formula base - da personalizzare)
    const puntoGuasti = Math.min(100, (ints.length / 15) * 100);
    const puntoVoto = votoMedio ? (parseFloat(votoMedio) / 10) * 100 : 50;
    const puntoRisposta = tempoRispostaMedia !== null ? Math.max(0, 100 - tempoRispostaMedia * 5) : 50;
    const penalita = nonRisolti * 10;
    const punteggio = Math.max(0, Math.round((puntoGuasti * 0.4) + (puntoVoto * 0.4) + (puntoRisposta * 0.2) - penalita));
    
    return { ...p, interventi:ints.length, durataMedia, votoMedio, nonRisolti, tempoRispostaMedia, punteggio };
  }).sort((a,b)=>b.punteggio-a.punteggio);

  const archFiltrato = archivio.filter(a=>{
    const t = cerca===""||
      a.intervento.toLowerCase().includes(cerca.toLowerCase())||
      a.tecnico.toLowerCase().includes(cerca.toLowerCase())||
      (a.note||"").toLowerCase().includes(cerca.toLowerCase())||
      a.macchina.toLowerCase().includes(cerca.toLowerCase());
    const m = cercaMac===""||
      (cercaMac==="L" && !a.macchina.toLowerCase().includes("miscelazione"))||
      (cercaMac==="Miscelazione" && a.macchina.toLowerCase().includes("miscelazione"))||
      a.macchina===cercaMac;
    return t&&m;
  });

  const navItems = [
    { id:"guasti",      icon:"⚠️", label:"Guasti" },
    { id:"segnala",     icon:"➕", label:"Segnala" },
    { id:"team",        icon:"👥", label:"Team" },
    { id:"archivio",    icon:"📁", label:"Archivio" },
    { id:"statistiche", icon:"📊", label:"Stats" },
    ...(utente?.canSeeOperai ? [{ id:"statoperai", icon:"👷", label:"Operai" }] : []),
    { id:"profilo",     icon:"👤", label:"Profilo" },
  ];

  const titoli = { guasti:"Guasti", segnala:"Segnala Guasto", team:"Team", archivio:"Archivio", statistiche:"Statistiche", statoperai:"👷 Statistiche Operai", admin:"Admin ⚙️", profilo:"Il mio profilo" };

  // ── LOGIN ──
  if (!utente) return (
    <div style={{ background:"#F5F0EB", fontFamily:"Georgia,serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28 }}>
      <div style={{ marginBottom:16 }}><LogoMoroniAmato size="big"/></div>
      <div style={{ fontSize:32, color:"#FF4D00", fontStyle:"italic", fontWeight:700, marginBottom:4 }}>FixLine 🔧</div>
      <div style={{ fontSize:13, color:"#777", marginBottom:32 }}>Accedi con le tue credenziali</div>

      <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
        <div>
          <div style={{ fontSize:10, color:"#777", letterSpacing:"0.12em", marginBottom:6 }}>IL TUO NOME</div>
          <input value={loginForm.nome} onChange={e=>setLoginForm({...loginForm,nome:e.target.value})} placeholder="Es. Samuele" style={{ width:"100%", padding:"14px", background:"#FFFFFF", border:"1px solid #2A2A2A", borderRadius:10, color:"#1A1A1A", fontFamily:"Georgia,serif", fontSize:15, boxSizing:"border-box" }}/>
        </div>
        <div>
          <div style={{ fontSize:10, color:"#777", letterSpacing:"0.12em", marginBottom:6 }}>PASSWORD</div>
          <input type="password" value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="••••••••" style={{ width:"100%", padding:"14px", background:"#FFFFFF", border:"1px solid #2A2A2A", borderRadius:10, color:"#1A1A1A", fontFamily:"Georgia,serif", fontSize:15, boxSizing:"border-box" }}/>
        </div>
        {loginErr && <div style={{ color:"#FF3B30", fontSize:13, textAlign:"center" }}>{loginErr}</div>}
        <button onClick={login} style={{ ...B, padding:"16px", background:"#FF4D00", color:"#fff", fontSize:16, borderRadius:12, marginTop:4 }}>ACCEDI</button>

        <Footer/>
        <div style={{ marginTop:16, padding:"12px 14px", background:"#FFFFFF", border:"1px solid #2A2A2A", borderRadius:10, fontSize:11, color:"#777" }}>
          <div style={{ marginBottom:6, color:"#555" }}>🔑 Password demo:</div>
          {teamIniziale.map(t=>(
            <div key={t.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ color:t.colore }}>{t.icona} {t.nome}</span>
              <span style={{ color:"#555" }}>{t.password}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── DETTAGLIO GUASTO ──
  if (selected) return (
    <div style={{ background:"#F5F0EB", fontFamily:"Georgia,serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", overflowY:"auto" }}>
      <div style={{ background:"#FFFFFF", padding:"16px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid #1E1E1E", position:"sticky", top:0, zIndex:10 }}>
        <button onClick={()=>setSel(null)} style={{ ...B, background:"none", color:"#FF4D00", fontSize:20, padding:0, fontWeight:400 }}>←</button>
        <div style={{ fontSize:15, fontWeight:700, color:"#1A1A1A", flex:1 }}>{selected.macchina}</div>
        <span style={{ fontSize:10, padding:"3px 8px", borderRadius:4, background:stCol[selected.stato]+"20", color:stCol[selected.stato] }}>{stLbl[selected.stato]}</span>
      </div>
      <div style={{ padding:16 }}>
        <div style={{ background:"#FFFFFF", border:`1px solid ${urgCol[selected.urgenza]}30`, borderTop:`3px solid ${urgCol[selected.urgenza]}`, borderRadius:12, padding:16, marginBottom:14 }}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <span style={{fontSize:11,background:selected.reparto==="Miscelazione"?"#8B1A2B":"#1A6B8B",color:"white",padding:"3px 10px",borderRadius:8,fontWeight:700}}>
              {selected.reparto==="Miscelazione"?"⚗️ MISCELAZIONE":"🏭 LINEE"}
            </span>
            <span style={{fontSize:13,color:"#555"}}>⚠ {selected.tipo}{selected.sottotipo?" — "+selected.sottotipo:""}</span>
          </div>
          <div style={{ fontSize:14, color:"#333", lineHeight:1.6, marginBottom:16 }}>{selected.descrizione}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:12 }}>
            <div style={{color:"#777"}}>Segnalato da</div><div style={{color:"#777"}}>{selected.operaio}</div>
            <div style={{color:"#777"}}>Data/Ora</div><div style={{color:"#777"}}>{selected.data} {selected.ora}</div>
            <div style={{color:"#777"}}>Urgenza</div><div style={{color:urgCol[selected.urgenza],textTransform:"uppercase",fontSize:10}}>{selected.urgenza}</div>
          </div>
          {selected.inCarico && (
            <div style={{ marginTop:12, padding:"10px 12px", background:"#FF950015", border:"1px solid #FF950040", borderRadius:8, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{fontSize:18}}>{membroTeam(selected.inCarico)?.icona}</span>
              <div>
                <div style={{fontSize:12,color:"#FF9500",fontWeight:700}}>IN CARICO: {selected.inCarico}</div>
                <div style={{fontSize:11,color:"#777"}}>{membroTeam(selected.inCarico)?.ruolo}</div>
              </div>
            </div>
          )}
          {!selected.inCarico && selected.stato==="aperto" && (
            <div style={{ marginTop:12, padding:"10px", background:"#FF3B3015", border:"1px solid #FF3B3040", borderRadius:8, fontSize:12, color:"#FF3B30" }}>⚠ Nessuno ha ancora preso in carico</div>
          )}
          {selected.voto && <div style={{marginTop:12,padding:"10px 12px",background:"#FFFFFF",borderRadius:8}}><div style={{fontSize:11,color:"#777",marginBottom:6}}>FEEDBACK OPERAIO</div><VotoDisplay voto={selected.voto}/>{selected.commento&&<div style={{fontSize:12,color:"#777",marginTop:6,fontStyle:"italic"}}>"{selected.commento}"</div>}</div>}
        </div>

        {selected.stato==="aperto" && (
          <div style={{marginBottom:14}}>
            <button onClick={()=>prendiInCarico(selected.id)} style={{ ...B, width:"100%", padding:14, background:"#FF9500", color:"#000", fontSize:15, borderRadius:12, marginBottom:8 }}>🙋 PRENDO IN CARICO IO</button>
            {utente?.canAssign && (
              <div>
                <div style={{fontSize:10,color:"#777",letterSpacing:"0.12em",marginBottom:6,marginTop:8}}>OPPURE ASSEGNA A:</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {team.filter(t=>t.stato==="libero"&&t.nome!==utente.nome).map(t=>(
                    <button key={t.nome} onClick={()=>assegnaManutentore(selected.id,t.nome)}
                      style={{...B,padding:"10px 14px",background:t.colore+"15",border:"1px solid "+t.colore+"40",borderRadius:8,color:t.colore,fontSize:13,fontWeight:400,textAlign:"left",display:"flex",alignItems:"center",gap:8}}>
                      <span>{t.icona}</span>
                      <span style={{fontWeight:700}}>{t.nome}</span>
                      <span style={{fontSize:11,opacity:0.7}}>— {t.ruolo}</span>
                      <span style={{marginLeft:"auto",fontSize:10,color:"#34C759"}}>✓ libero</span>
                    </button>
                  ))}
                  {team.filter(t=>t.stato==="libero"&&t.nome!==utente.nome).length===0 && (
                    <div style={{fontSize:12,color:"#FF3B30",padding:"8px",background:"#FF3B3010",borderRadius:8,textAlign:"center"}}>⚠ Nessun manutentore disponibile</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {selected.stato==="in corso" && selected.inCarico===utente.nome && (
          <div style={{marginBottom:14}}>
            <div style={{padding:"10px 14px",background:"#34C75910",border:"1px solid #34C75930",borderRadius:10,fontSize:12,color:"#34C759",marginBottom:12}}>
              ⏱ Preso in carico alle {selected.oraPreso} — tempo calcolato automaticamente
            </div>

            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:"#777",letterSpacing:"0.12em",marginBottom:6}}>COSA HAI FATTO? * <span style={{color:"#8B1A2B"}}>(salvato in archivio per macchina)</span></div>
              <input
                value={lavoroFatto}
                onChange={e=>setLavoroFatto(e.target.value)}
                placeholder="Es. Cambiato pompa, Sostituito sensore, Regolato cinghia..."
                style={{width:"100%",padding:"12px",background:"#fff",border:"2px solid #34C759",borderRadius:10,color:"#1A1A1A",fontFamily:"Georgia,serif",fontSize:13,boxSizing:"border-box"}}
              />
              <div style={{fontSize:11,color:"#888",marginTop:4}}>💡 Fra mesi potrai cercare questo per macchina nell'archivio</div>
            </div>

            <button
              onClick={()=>{ if(lavoroFatto.trim()) risolvi(selected.id); }}
              style={{...B,width:"100%",padding:14,background:lavoroFatto.trim()?"#34C759":"#E0D8D0",color:lavoroFatto.trim()?"#000":"#AAA",fontSize:15,borderRadius:12,marginBottom:8}}
            >
              ✓ PROBLEMA RISOLTO
            </button>
            {!lavoroFatto.trim() && (
              <div style={{fontSize:11,color:"#FF9500",textAlign:"center",marginBottom:8}}>⚠ Scrivi cosa hai fatto prima di risolvere</div>
            )}
            <button onClick={()=>nonRiescoARisolvere(selected.id)} style={{...B,width:"100%",padding:12,background:"#FF3B3015",border:"1px solid #FF3B3040",color:"#FF3B30",fontSize:13,borderRadius:12}}>
              ⚠ Non riesco a risolvere — Riapri guasto
            </button>
          </div>
        )}
        {selected.stato==="in corso" && selected.inCarico!==utente.nome && (
          <div style={{padding:"14px",background:"#FF950015",border:"1px solid #FF950040",borderRadius:12,textAlign:"center",color:"#FF9500",fontSize:13}}>🔧 {selected.inCarico} sta già intervenendo!</div>
        )}
        {selected.stato==="risolto" && (
          <div style={{padding:"14px",background:"#34C75915",border:"1px solid #34C75940",borderRadius:12,textAlign:"center",color:"#34C759",fontSize:13}}>✅ Risolto da {selected.inCarico} alle {selected.oraRisolto} — {selected.durata} minuti di intervento</div>
        )}

        <div style={{fontSize:10,color:"#777",letterSpacing:"0.12em",margin:"16px 0 8px"}}>CRONOLOGIA</div>
        {[
          { t:"🔴 Segnalato da "+selected.operaio, ora:selected.data+" ore "+selected.ora, c:"#FF3B30" },
          { t:"🔔 Notifica inviata a tutto il team", ora:selected.data+" ore "+selected.ora, c:"#FF4D00" },
          ...(selected.inCarico?[{t:"🟡 "+selected.inCarico+" ha preso in carico", ora:selected.data+" ore "+(selected.oraPreso||"—"), c:"#FF9500"}]:[]),
          ...(selected.stato==="risolto"?[{t:"✅ Risolto da "+selected.inCarico+(selected.lavoroFatto?" — "+selected.lavoroFatto:""), ora:selected.data+" ore "+(selected.oraRisolto||"—")+" ("+selected.durata+" min)", c:"#34C759"}]:[]),
          ...(selected.passaggi||[]).map(p=>({t:"⚠ "+p.da+" non è riuscito a risolvere — guasto riaperto",ora:p.data+" ore "+p.ora,c:"#FF3B30"})),
          ...(selected.voto?[{t:"⭐ Feedback operaio: "+selected.voto+"/10"+(selected.commento?" — "+selected.commento:""),ora:"—",c:"#FFB800"}]:[]),
        ].map((ev,i)=>(
          <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:ev.c,marginTop:4,flexShrink:0}}/>
            <div>
              <div style={{fontSize:12,color:"#333"}}>{ev.t}</div>
              <div style={{fontSize:10,color:"#555"}}>{ev.ora}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background:"#F5F0EB", fontFamily:"Georgia,serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:"#FFFFFF", padding:"14px 20px", borderBottom:"1px solid #1E1E1E", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
        <div>
          <LogoMoroniAmato size="small"/>
          <div style={{fontSize:14,fontWeight:700,color:"#1A1A1A",marginTop:2}}>{titoli[view]||"FixLine"}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setView("profilo")} style={{...B,background:"none",padding:0,fontWeight:400,display:"flex",alignItems:"center",gap:8}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:12,color:"#1A1A1A",fontWeight:700}}>{utente.nome}</div>
              <div style={{fontSize:10,color:utente.colore}}>{utente.ruolo}</div>
            </div>
            <div style={{width:36,height:36,borderRadius:"50%",background:utente.colore+"20",border:"2px solid "+utente.colore,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{utente.icona}</div>
          </button>
        </div>
      </div>

      
        <style>{`
        @keyframes lampeggia { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      {/* BANNER NUOVO GUASTO */}
        {nuovoGuasto && (
          <div style={{
            position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",
            width:"92%",maxWidth:370,
            background: nuovoGuasto.urgenza==="macchina ferma" ? "#7B0000" : nuovoGuasto.urgenza==="alta" ? "#FF3B30" : "#FF9500",
            borderRadius:12,padding:"14px 16px",zIndex:100,
            boxShadow: nuovoGuasto.urgenza==="macchina ferma" ? "0 0 30px rgba(123,0,0,0.8)" : "0 4px 20px rgba(0,0,0,0.4)",
            display:"flex",alignItems:"center",gap:12,
            border: nuovoGuasto.urgenza==="macchina ferma" ? "2px solid #FF0000" : "none",
            animation: nuovoGuasto.urgenza==="macchina ferma" ? "pulse 0.5s infinite" : "none"
          }}>
            <span style={{fontSize:28}}>{nuovoGuasto.urgenza==="macchina ferma"?"🚨":"🔴"}</span>
            <div style={{flex:1}}>
              {nuovoGuasto.urgenza==="macchina ferma" && (
                <div style={{fontSize:14,fontWeight:900,color:"#FFD700",letterSpacing:"0.05em",marginBottom:2}}>
                  ⚠ MACCHINA FERMA!
                </div>
              )}
              <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>
                {nuovoGuasto.urgenza==="macchina ferma" ? nuovoGuasto.macchina+" È FERMA!" : "NUOVO GUASTO — "+nuovoGuasto.urgenza.toUpperCase()}
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.85)",marginTop:2}}>{nuovoGuasto.tipo}{nuovoGuasto.sottotipo?" — "+nuovoGuasto.sottotipo:""}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:1}}>Segnalato da {nuovoGuasto.operaio}</div>
            </div>
            <button onClick={()=>{setSel(nuovoGuasto);setNuovoGuasto(null);}} style={{background:"rgba(255,255,255,0.25)",border:"none",borderRadius:8,color:"#fff",padding:"8px 10px",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,fontWeight:700}}>
              VEDI
            </button>
          </div>
        )}

      <div style={{flex:1,overflowY:"auto",paddingBottom:80}}>

        {/* GUASTI */}
        {view==="guasti" && (
          <div style={{padding:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
              {[{l:"APERTI",v:aperte,c:"#FF3B30"},{l:"IN CORSO",v:inCorso,c:"#FF9500"},{l:"RISOLTI",v:risolte,c:"#34C759"}].map(s=>(
                <div key={s.l} style={{background:"#FFFFFF",border:"1px solid "+s.c+"30",borderTop:"3px solid "+s.c,borderRadius:10,padding:"12px 8px",textAlign:"center"}}>
                  <div style={{fontSize:26,fontWeight:700,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:9,color:"#777",letterSpacing:"0.08em"}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
              {["tutti","aperto","in corso","risolto"].map(f=>(
                <button key={f} onClick={()=>setFiltro(f)} style={{...B,padding:"5px 10px",background:filtro===f?"#FF4D00":"#FFFFFF",border:"1px solid "+(filtro===f?"#FF4D00":"#E0D8D0"),color:filtro===f?"#fff":"#555",fontSize:10,fontWeight:400,textTransform:"uppercase",borderRadius:6}}>{f}</button>
              ))}
            </div>
            {filtrate.some(s=>s.urgenza==="macchina ferma"&&s.stato==="aperto"&&!s.inCarico) && (
              <div onClick={()=>{ const mf=segnalazioni.find(s=>s.urgenza==="macchina ferma"&&s.stato==="aperto"&&!s.inCarico); if(mf){setEmergenza(mf);suonaNotifica("macchina ferma");}}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"#7B0000",border:"2px solid #FF0000",borderRadius:10,marginBottom:10,cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:22}}>🚨</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:900,color:"#FFD700",letterSpacing:"0.05em"}}>MACCHINA FERMA!</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>Tocca per vedere l'emergenza</div>
                  </div>
                </div>
                <span style={{fontSize:20,color:"#FFD700"}}>▶</span>
              </div>
            )}
            {filtrate.map(s=>(
              <div key={s.id} onClick={()=>setSel(s)} style={{background:"#FFFFFF",border:"1px solid #222",borderLeft:"3px solid "+urgCol[s.urgenza],borderRadius:10,padding:"12px 14px",marginBottom:8,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1A1A1A"}}>{s.macchina}</div>
                  <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:s.urgenza==="macchina ferma"?"rgba(255,255,255,0.2)":""+stCol[s.stato]+"20",color:s.urgenza==="macchina ferma"?"#FFD700":stCol[s.stato]}}>{stLbl[s.stato]}</span>
                  {s.urgenza==="macchina ferma" && s.stato==="aperto" && (
                    <span style={{fontSize:12,animation:"lampeggia 0.6s infinite"}}>🚨</span>
                  )}
                </div>
                <div style={{fontSize:11,color:"#555",marginBottom:4}}>⚠ {s.tipo}{s.sottotipo&&s.sottotipo!=="Altro"?" — "+s.sottotipo:""}</div>
                <div style={{fontSize:11,color:"#777",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.descrizione}</div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:10,color:"#555"}}>
                  <span>👤 {s.operaio}</span>
                  {s.inCarico?<span style={{color:s.urgenza==="macchina ferma"?"#FFD700":"#FF9500"}}>🔧 {s.inCarico}</span>:<span style={{color:s.urgenza==="macchina ferma"?"#FF6666":"#FF3B30"}}>⚠ Nessuno</span>}
                  <span>📅 {s.data}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEGNALA */}
        {view==="segnala" && (
          <div style={{padding:16}}>
            {segnalatoTeam ? (
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <div style={{fontSize:64,marginBottom:16}}>✅</div>
                <div style={{fontSize:18,fontWeight:700,color:"#34C759"}}>INVIATO!</div>
                <div style={{fontSize:13,color:"#777",marginTop:8}}>Tutto il team è stato notificato</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{background:"#FF4D0010",border:"1px solid #FF4D0040",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#FF4D00"}}>
                  🔔 Segnalazione da <strong>{utente.nome}</strong> — notifica a tutto il team
                </div>

                {/* SCELTA REPARTO */}
                <div>
                  <div style={{fontSize:10,color:"#777",letterSpacing:"0.12em",marginBottom:6}}>REPARTO *</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {["Linee","Miscelazione"].map(r=>(
                      <button key={r} onClick={()=>setFormSeg({...formSeg,reparto:r,macchina:"",componente:"",tipo:"",sottotipo:""})}
                        style={{...B,padding:"14px",background:formSeg.reparto===r?"#8B1A2B":"#FFFFFF",border:"2px solid "+(formSeg.reparto===r?"#8B1A2B":"#E0D8D0"),color:formSeg.reparto===r?"#fff":"#777",fontSize:14,fontWeight:formSeg.reparto===r?700:400,borderRadius:10}}>
                        {r==="Linee"?"🏭 Linee":"⚗️ Miscelazione"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LINEE */}
                {formSeg.reparto==="Linee" && <>
                  <div>
                    <div style={{fontSize:10,color:"#777",letterSpacing:"0.12em",marginBottom:6}}>MACCHINA *</div>
                    <select value={formSeg.macchina} onChange={e=>setFormSeg({...formSeg,macchina:e.target.value})} style={{width:"100%",padding:"12px",background:"#F0EBE5",border:"1px solid #E0D8D0",borderRadius:10,color:formSeg.macchina?"#1A1A1A":"#777",fontFamily:"Georgia,serif",fontSize:13}}>
                      <option value="">Seleziona macchina...</option>
                      {macchine.map(m=><option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#777",letterSpacing:"0.12em",marginBottom:6}}>TIPO GUASTO *</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {tipiGuasto.map(t=>(
                        <button key={t} onClick={()=>setFormSeg({...formSeg,tipo:t,sottotipo:""})} style={{...B,padding:"10px",background:formSeg.tipo===t?"#FF4D0020":"#FFFFFF",border:"1px solid "+(formSeg.tipo===t?"#FF4D00":"#E0D8D0"),color:formSeg.tipo===t?"#FF4D00":"#777",fontSize:12,fontWeight:400,borderRadius:8}}>{t}</button>
                      ))}
                    </div>
                  </div>
                  {formSeg.tipo && problemiPerTipo[formSeg.tipo] && (
                    <div>
                      <div style={{fontSize:10,color:"#777",letterSpacing:"0.12em",marginBottom:6}}>PROBLEMA SPECIFICO *</div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {problemiPerTipo[formSeg.tipo].map(p=>(
                          <button key={p} onClick={()=>setFormSeg({...formSeg,sottotipo:p})} style={{...B,padding:"10px",background:formSeg.sottotipo===p?"#FF4D0020":"#FFFFFF",border:"1px solid "+(formSeg.sottotipo===p?"#FF4D00":"#E0D8D0"),color:formSeg.sottotipo===p?"#FF4D00":"#777",fontSize:12,fontWeight:400,borderRadius:8,textAlign:"left"}}>
                            {formSeg.sottotipo===p?"✓ ":""}{p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>}

                {/* MISCELAZIONE */}
                {formSeg.reparto==="Miscelazione" && <>
                  <div>
                    <div style={{fontSize:10,color:"#777",letterSpacing:"0.12em",marginBottom:6}}>PROBLEMA *</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {["Problemi pompa","Problemi Unimix","Problemi impianto acqua","Altro"].map(c=>(
                        <button key={c} onClick={()=>setFormSeg({...formSeg,componente:c,tipo:"Miscelazione",sottotipo:c})}
                          style={{...B,padding:"14px",background:formSeg.componente===c?"#8B1A2B":"#FFFFFF",border:"2px solid "+(formSeg.componente===c?"#8B1A2B":"#E0D8D0"),color:formSeg.componente===c?"#fff":"#777",fontSize:14,fontWeight:formSeg.componente===c?700:400,borderRadius:10,textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:18}}>{c==="Problemi pompa"?"🔄":c==="Problemi Unimix"?"⚙️":c==="Problemi impianto acqua"?"💧":"📋"}</span>
                          <span>{c}</span>
                          {formSeg.componente===c && <span style={{marginLeft:"auto"}}>✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </>}

                {/* URGENZA */}
                <div>
                  <div style={{fontSize:10,color:"#777",letterSpacing:"0.12em",marginBottom:6}}>URGENZA</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {["bassa","media","alta","macchina ferma"].map(u=>(
                      <button key={u} onClick={()=>setFormSeg({...formSeg,urgenza:u})} style={{...B,flex:1,padding:"10px",background:formSeg.urgenza===u?urgCol[u]+"20":"#FFFFFF",border:"1px solid "+(formSeg.urgenza===u?urgCol[u]:"#E0D8D0"),color:formSeg.urgenza===u?urgCol[u]:"#777",fontSize:10,textTransform:"uppercase",fontWeight:400,borderRadius:8,minWidth:60}}>{u}</button>
                    ))}
                  </div>
                </div>

                {/* DESCRIZIONE */}
                <div>
                  <div style={{fontSize:10,color:"#777",letterSpacing:"0.12em",marginBottom:6}}>DESCRIZIONE (opzionale)</div>
                  <textarea value={formSeg.descrizione} onChange={e=>setFormSeg({...formSeg,descrizione:e.target.value})} placeholder="Descrivi il problema..." rows={3} style={{width:"100%",padding:"12px",background:"#FFFFFF",border:"1px solid #E0D8D0",borderRadius:10,color:"#1A1A1A",fontFamily:"Georgia,serif",fontSize:13,resize:"none",boxSizing:"border-box"}}/>
                </div>

                {/* FOTO */}
                <label style={{border:"2px dashed #8B1A2B",borderRadius:10,padding:"16px",textAlign:"center",color:"#8B1A2B",fontSize:13,cursor:"pointer",display:"block",background:"#8B1A2B08"}}>
                  📷 Aggiungi foto del guasto
                  <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{ if(e.target.files[0]) setFormSeg(p=>({...p,foto:e.target.files[0].name})); }}/>
                  {formSeg.foto && <div style={{fontSize:12,color:"#34C759",marginTop:6,fontWeight:700}}>✓ {formSeg.foto}</div>}
                </label>

                <button onClick={inviaSegnalazione} style={{...B,padding:"14px",background:"#FF4D00",color:"#fff",fontSize:15,borderRadius:12}}>
                  🔔 NOTIFICA TUTTO IL TEAM
                </button>
              </div>
            )}
          </div>
        )}

        {/* STATISTICHE OPERAI */}
        {view==="statoperai" && utente?.canSeeOperai && (
          <StatOperai segnalazioni={segnalazioni} macchine={macchine} />
        )}

        {/* TEAM */}
        {view==="team" && (
          <div style={{padding:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              <div style={{background:"#FFFFFF",border:"1px solid #34C75930",borderTop:"3px solid #34C759",borderRadius:10,padding:12,textAlign:"center"}}>
                <div style={{fontSize:26,fontWeight:700,color:"#34C759"}}>{liberi}</div>
                <div style={{fontSize:9,color:"#777"}}>LIBERI</div>
              </div>
              <div style={{background:"#FFFFFF",border:"1px solid #FF3B3030",borderTop:"3px solid #FF3B30",borderRadius:10,padding:12,textAlign:"center"}}>
                <div style={{fontSize:26,fontWeight:700,color:"#FF3B30"}}>{team.filter(t=>t.stato==="occupato").length}</div>
                <div style={{fontSize:9,color:"#777"}}>OCCUPATI</div>
              </div>
            </div>
            {team.map((p,i)=>{
              const guastoAttivo = segnalazioni.find(s=>s.inCarico===p.nome&&s.stato==="in corso");
              return (
                <div key={i} style={{background:"#FFFFFF",border:"1px solid "+p.colore+"20",borderLeft:"3px solid "+p.colore,borderRadius:10,padding:"14px 16px",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:42,height:42,borderRadius:"50%",background:p.colore+"15",border:"2px solid "+p.colore,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{p.icona}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:700,color:"#1A1A1A"}}>{p.nome}</div>
                      <div style={{fontSize:11,color:p.colore,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2}}>{p.ruolo}</div>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color:p.stato==="libero"?"#34C759":"#FF3B30",textTransform:"uppercase"}}>{p.stato==="libero"?"✓ LIBERO":"✗ OCCUPATO"}</div>
                  </div>
                  {guastoAttivo&&<div style={{marginTop:10,padding:"8px 10px",background:"#FF950010",border:"1px solid #FF950030",borderRadius:8,fontSize:11,color:"#FF9500"}}>🔧 Sta intervenendo su: {guastoAttivo.macchina}</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ARCHIVIO */}
        {view==="archivio" && (
          <div style={{padding:16}}>
            <input value={cerca} onChange={e=>setCerca(e.target.value)} placeholder="🔍 Cerca intervento, tecnico..." style={{width:"100%",padding:"12px",background:"#FFFFFF",border:"1px solid #2A2A2A",borderRadius:10,color:"#1A1A1A",fontFamily:"Georgia,serif",fontSize:13,boxSizing:"border-box",marginBottom:8}}/>
            <select value={cercaMac} onChange={e=>setCercaMac(e.target.value)} style={{width:"100%",padding:"12px",background:"#FFFFFF",border:"1px solid #2A2A2A",borderRadius:10,color:cercaMac?"#1A1A1A":"#777",fontFamily:"Georgia,serif",fontSize:13,marginBottom:12}}>
              <option value="">Tutte le macchine</option>
              {macchine.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              {["Tutti","Linee","Miscelazione"].map(r=>(
                <button key={r} onClick={()=>setCercaMac(r==="Tutti"?"":r==="Linee"?"L":r)} style={{...B,padding:"5px 10px",background:cercaMac===(r==="Tutti"?"":r==="Linee"?"L":r)?"#8B1A2B":"#F0EBE5",border:"1px solid "+(cercaMac===(r==="Tutti"?"":r==="Linee"?"L":r)?"#8B1A2B":"#E0D8D0"),color:cercaMac===(r==="Tutti"?"":r==="Linee"?"L":r)?"#fff":"#777",fontSize:10,fontWeight:400,borderRadius:6}}>{r}</button>
              ))}
            </div>
            <div style={{fontSize:11,color:"#777",marginBottom:10}}>{archFiltrato.length} interventi trovati</div>
            {archFiltrato.map(a=>{
              const m=membroTeam(a.tecnico);
              return(
                <div key={a.id} style={{background:"#FFFFFF",border:"1px solid #222",borderLeft:"3px solid "+(m?.colore||"#777"),borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#1A1A1A"}}>{a.macchina}</div>
                    <div style={{fontSize:10,color:"#777"}}>📅 {a.data}</div>
                  </div>
                  <div style={{fontSize:12,color:"#DDD",marginBottom:4}}>🔧 {a.intervento}</div>
                  <div style={{fontSize:11,color:"#777",marginBottom:8}}>{a.note}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11}}>
                    <span style={{color:m?.colore||"#555"}}>{m?.icona} {a.tecnico}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {a.voto&&<VotoDisplay voto={a.voto}/>}
                      <span style={{color:a.durata<=20?"#34C759":a.durata<=45?"#FF9500":"#FF3B30"}}>⏱ {a.durata}min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STATISTICHE */}
        {view==="statistiche" && (
          <div style={{padding:16}}>
            <div style={{fontSize:10,color:"#777",letterSpacing:"0.15em",marginBottom:16}}>CLASSIFICA 🏆</div>
            {stats.filter(s=>s.totale>0).map((p,i)=>(
              <div key={p.nome} style={{background:"#FFFFFF",border:"1px solid "+p.colore+"25",borderLeft:"3px solid "+p.colore,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{fontSize:22}}>{ ["🥇","🥈","🥉"][i]||"🎖" }</div>
                  <div style={{fontSize:18}}>{p.icona}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:700,color:"#1A1A1A"}}>{p.nome}</div>
                    <div style={{fontSize:11,color:p.colore,textTransform:"uppercase",letterSpacing:"0.07em"}}>{p.ruolo}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:28,fontWeight:900,color:p.colore}}>{p.punteggio}</div>
                    <div style={{fontSize:9,color:"#777",letterSpacing:"0.08em"}}>PUNTI/100</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
                  {[
                    {l:"Risolti",v:p.interventi,c:"#34C759"},
                    {l:"Non risolti",v:(p.nonRisolti||0),c:(p.nonRisolti||0)>0?"#FF3B30":"#34C759"},
                    {l:"Voto medio",v:p.votoMedio?p.votoMedio+"⭐":"—",c:"#FFB800"},
                    {l:"Tempo risoluz.",v:p.durataMedia?p.durataMedia+"min":"—",c:!p.durataMedia?"#777":p.durataMedia<=20?"#34C759":p.durataMedia<=40?"#FF9500":"#FF3B30"},
                    {l:"Tempo risposta",v:p.tempoRispostaMedia!==null?p.tempoRispostaMedia+"min":"—",c:p.tempoRispostaMedia===null?"#777":p.tempoRispostaMedia<=5?"#34C759":p.tempoRispostaMedia<=15?"#FF9500":"#FF3B30"},
                    {l:"Penalità",v:(p.nonRisolti||0)>0?"-"+(p.nonRisolti*10)+"pt":"0",c:(p.nonRisolti||0)>0?"#FF3B30":"#34C759"},
                  ].map(s=>(
                    <div key={s.l} style={{textAlign:"center",background:"#F5F0EB",borderRadius:8,padding:"8px 4px"}}>
                      <div style={{fontSize:14,fontWeight:700,color:s.c}}>{s.v}</div>
                      <div style={{fontSize:9,color:"#777"}}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{height:4,background:"#E0D8D0",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:Math.min(100,p.punteggio)+"%",background:p.colore,borderRadius:2}}/>
                </div>
                {i===0&&<div style={{marginTop:8,fontSize:11,color:"#FFB800",textAlign:"center"}}>⭐ MVP — Grazie {p.nome}!</div>}
              </div>
            ))}
          </div>
        )}

        {/* PROFILO + CAMBIO PASSWORD */}
        {view==="profilo" && (
          <div style={{padding:16}}>
            <div style={{background:"#FFFFFF",border:"1px solid "+utente.colore+"30",borderTop:"3px solid "+utente.colore,borderRadius:12,padding:20,marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:8}}>{utente.icona}</div>
              <div style={{fontSize:20,fontWeight:700,color:"#1A1A1A"}}>{utente.nome}</div>
              <div style={{fontSize:13,color:utente.colore,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:4}}>{utente.ruolo}</div>
              {utente.isAdmin && <div style={{marginTop:8,fontSize:11,background:"#FF4D0020",color:"#FF4D00",padding:"4px 12px",borderRadius:20,display:"inline-block"}}>ADMIN</div>}
            </div>

            <div style={{background:"#FFFFFF",border:"1px solid #2A2A2A",borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontSize:12,color:"#FF9500",letterSpacing:"0.1em",marginBottom:14}}>🔑 CAMBIA PASSWORD</div>
              {[{label:"Password attuale",key:"vecchia"},{label:"Nuova password",key:"nuova"},{label:"Conferma nuova",key:"conferma"}].map(f=>(
                <div key={f.key} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#777",letterSpacing:"0.1em",marginBottom:4}}>{f.label}</div>
                  <input type="password" value={cambioPass[f.key]} onChange={e=>setCambioPass(p=>({...p,[f.key]:e.target.value}))} style={{width:"100%",padding:"10px 12px",background:"#F5F0EB",border:"1px solid #2A2A2A",borderRadius:8,color:"#1A1A1A",fontFamily:"Georgia,serif",fontSize:13,boxSizing:"border-box"}}/>
                </div>
              ))}
              {passMsg && <div style={{fontSize:12,marginBottom:8,color:passMsg.startsWith("✅")?"#34C759":"#FF3B30"}}>{passMsg}</div>}
              <button onClick={cambiaPassword} style={{...B,width:"100%",padding:"12px",background:"#FF9500",color:"#000",fontSize:14,borderRadius:10}}>Cambia Password</button>
            </div>

            <button onClick={()=>{ setUtente(null); setLoginForm({nome:"",password:""}); }} style={{...B,width:"100%",padding:"14px",background:"#FF3B3015",border:"1px solid #FF3B3040",color:"#FF3B30",fontSize:14,borderRadius:12}}>
              Esci dal profilo
            </button>
          </div>
        )}

        {/* ADMIN */}
        {view==="admin" && isAdmin && (
          <div style={{padding:16}}>
            <div style={{fontSize:10,color:"#777",letterSpacing:"0.15em",marginBottom:16}}>GESTIONE TEAM</div>
            {team.map(p=>(
              <div key={p.id} style={{background:"#FFFFFF",border:"1px solid "+p.colore+"20",borderLeft:"3px solid "+p.colore,borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>{p.icona}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1A1A1A"}}>{p.nome}</div>
                  <div style={{fontSize:11,color:p.colore,textTransform:"uppercase",letterSpacing:"0.07em"}}>{p.ruolo}</div>
                  <div style={{fontSize:10,color:"#555"}}>{p.telefono||"—"}</div>
                </div>
                {p.nome!==utente.nome&&(
                  <button onClick={()=>setTeam(prev=>prev.filter(t=>t.id!==p.id))} style={{...B,background:"#FF3B3015",border:"1px solid #FF3B3040",color:"#FF3B30",padding:"6px 10px",fontSize:11,fontWeight:400,borderRadius:6}}>Rimuovi</button>
                )}
              </div>
            ))}
            <div style={{background:"#FFFFFF",border:"1px solid #34C75930",borderRadius:12,padding:16,marginTop:16}}>
              <div style={{fontSize:12,color:"#34C759",letterSpacing:"0.1em",marginBottom:12}}>+ AGGIUNGI MEMBRO</div>
              {[{label:"Nome",key:"nome",ph:"Es. Denis"},{label:"Ruolo",key:"ruolo",ph:"Es. Manutentore"},{label:"Password",key:"password",ph:"Scegli una password"},{label:"Telefono",key:"telefono",ph:"+39 333..."}].map(f=>(
                <div key={f.key} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#777",letterSpacing:"0.1em",marginBottom:4}}>{f.label}{f.key!=="telefono"?" *":""}</div>
                  <input value={nuovoM[f.key]} onChange={e=>setNuovoM(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} type={f.key==="password"?"password":"text"} style={{width:"100%",padding:"10px 12px",background:"#F5F0EB",border:"1px solid #2A2A2A",borderRadius:8,color:"#1A1A1A",fontFamily:"Georgia,serif",fontSize:13,boxSizing:"border-box"}}/>
                </div>
              ))}
              <button onClick={aggiungiMembro} style={{...B,width:"100%",padding:"12px",background:nuovoM.nome&&nuovoM.ruolo&&nuovoM.password?"#34C759":"#F0EBE5",color:nuovoM.nome&&nuovoM.ruolo&&nuovoM.password?"#000":"#555",fontSize:14,borderRadius:10}}>Aggiungi al Team</button>
            </div>
          </div>
        )}
      </div>

      {/* MESSAGGIO FINE MESE */}
      {messaggioMese && !premioVisibile && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"#fff",borderRadius:20,padding:28,maxWidth:360,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>

            {messaggioMese.tipo === "avviso" && (
              <>
                <div style={{fontSize:52,marginBottom:12}}>🏆</div>
                <div style={{fontSize:11,color:"#8B1A2B",letterSpacing:"0.15em",marginBottom:8}}>MORONI AMATO — FIXLINE</div>
                <div style={{fontSize:22,fontWeight:900,color:"#1A1A1A",marginBottom:12}}>Attenzione manutentori!</div>
                <div style={{fontSize:15,color:"#555",lineHeight:1.7,marginBottom:20}}>
                  La classifica del mese sta per terminare.<br/>
                  Hai ancora tempo per scalare la classifica e vincere il premio!<br/><br/>
                  <strong style={{color:"#8B1A2B"}}>Dai il massimo fino alle 14:00! 💪</strong>
                </div>
                <button onClick={()=>setMessaggioMese(null)} style={{...B,width:"100%",padding:14,background:"#8B1A2B",color:"#fff",fontSize:15,borderRadius:12}}>Ho capito!</button>
              </>
            )}

            {messaggioMese.tipo === "countdown" && (
              <>
                <div style={{fontSize:52,marginBottom:12}}>⏰</div>
                <div style={{fontSize:11,color:"#FF9500",letterSpacing:"0.15em",marginBottom:8}}>MORONI AMATO — FIXLINE</div>
                <div style={{fontSize:22,fontWeight:900,color:"#1A1A1A",marginBottom:12}}>Mancano solo 2 ore!</div>
                <div style={{fontSize:15,color:"#555",lineHeight:1.7,marginBottom:20}}>
                  La classifica di questo mese si chiude alle <strong>14:00</strong>.<br/><br/>
                  Chi sarà il Manutentore del Mese?<br/>
                  <strong style={{color:"#FF9500"}}>Ogni intervento conta! 🔧</strong>
                </div>
                <button onClick={()=>setMessaggioMese(null)} style={{...B,width:"100%",padding:14,background:"#FF9500",color:"#000",fontSize:15,borderRadius:12}}>Vai a lavorare! 💪</button>
              </>
            )}

            {messaggioMese.tipo === "vincitore" && (
              <>
                <div style={{fontSize:52,marginBottom:8}}>{messaggioMese.icona}</div>
                <div style={{fontSize:11,color:"#8B1A2B",letterSpacing:"0.15em",marginBottom:8}}>MORONI AMATO — FIXLINE</div>
                <div style={{fontSize:20,fontWeight:900,color:"#FFB800",marginBottom:4}}>🥇 Manutentore del Mese!</div>
                <div style={{fontSize:26,fontWeight:900,color:"#1A1A1A",marginBottom:12}}>{messaggioMese.vincitore}</div>
                <div style={{background:"#F5F0EB",borderRadius:12,padding:"12px 16px",marginBottom:16}}>
                  <div style={{fontSize:13,color:"#555"}}>Ha risolto <strong style={{color:"#8B1A2B"}}>{messaggioMese.guasti} guasti</strong> con voto medio <strong style={{color:"#FFB800"}}>{messaggioMese.voto}⭐</strong></div>
                </div>
                {utente?.nome === messaggioMese.vincitore ? (
                  <button onClick={()=>{ setMessaggioMese(null); setPremioVisibile(true); }} style={{...B,width:"100%",padding:14,background:"#FFB800",color:"#000",fontSize:15,borderRadius:12,marginBottom:8}}>
                    🎁 Ritira il tuo premio!
                  </button>
                ) : (
                  <div style={{fontSize:14,color:"#555",marginBottom:16}}>
                    Congratulazioni <strong>{messaggioMese.vincitore}</strong>! 🎉
                  </div>
                )}
                <button onClick={()=>setMessaggioMese(null)} style={{...B,width:"100%",padding:12,background:"#F0EBE5",border:"1px solid #E0D8D0",color:"#777",fontSize:13,borderRadius:12}}>Chiudi</button>
              </>
            )}

          </div>
        </div>
      )}

      {/* SCHERMATA PREMIO */}
      {premioVisibile && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"linear-gradient(135deg,#8B1A2B,#c0392b)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{textAlign:"center",maxWidth:340,width:"100%"}}>
            <div style={{fontSize:72,marginBottom:16}}>🏆</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",letterSpacing:"0.2em",marginBottom:8}}>MORONI AMATO — FIXLINE</div>
            <div style={{fontSize:24,fontWeight:900,color:"#FFD700",marginBottom:8}}>Il tuo premio</div>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:16,padding:"20px",marginBottom:24,lineHeight:1.8}}>
              <div style={{fontSize:15,color:"rgba(255,255,255,0.9)",marginBottom:12}}>
                Questo mese hai dimostrato<br/>
                <strong style={{color:"#FFD700"}}>dedizione, velocità e professionalità.</strong>
              </div>
              <div style={{fontSize:14,color:"rgba(255,255,255,0.8)",marginBottom:12}}>
                Gli operai ti hanno riconosciuto con il loro voto.
              </div>
              <div style={{fontSize:15,color:"#FFD700",fontWeight:700}}>
                La gratitudine dell'azienda e dei tuoi colleghi è il tuo premio.
              </div>
              <div style={{fontSize:14,color:"rgba(255,255,255,0.7)",marginTop:12}}>
                <strong>Grazie {utente?.nome} — sei il migliore! ⭐</strong>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:8}}>
                — Moroni Amato
              </div>
            </div>
            <button onClick={()=>setPremioVisibile(false)} style={{...B,width:"100%",padding:14,background:"#FFD700",color:"#8B1A2B",fontSize:16,borderRadius:12,fontWeight:900}}>
              Grazie! 🙏
            </button>
          </div>
        </div>
      )}

      {/* SCHERMATA EMERGENZA MACCHINA FERMA */}
      {emergenza && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, bottom:0,
          background:"#7B0000",
          zIndex:9999,
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          padding:24, textAlign:"center",
          animation:"emergenzaPulse 0.8s infinite"
        }}>
          <style>{`@keyframes emergenzaPulse { 0%,100%{background:#7B0000} 50%{background:#AA0000} }`}</style>
          
          <div style={{fontSize:64, marginBottom:8}}>🚨</div>
          <div style={{fontSize:11, letterSpacing:"0.3em", color:"rgba(255,255,255,0.7)", marginBottom:8, textTransform:"uppercase"}}>MoroniAmato.srl — FixLine 🔧</div>
          
          <div style={{fontSize:28, fontWeight:900, color:"#FFD700", letterSpacing:"0.05em", marginBottom:4}}>
            MACCHINA FERMA!
          </div>
          <div style={{fontSize:20, color:"#fff", fontWeight:700, marginBottom:16}}>
            {emergenza.macchina}
          </div>
          
          <div style={{background:"rgba(0,0,0,0.3)", borderRadius:12, padding:"12px 20px", marginBottom:24, width:"100%", maxWidth:320}}>
            <div style={{fontSize:13, color:"rgba(255,255,255,0.7)", marginBottom:4}}>Tipo guasto</div>
            <div style={{fontSize:15, color:"#fff", fontWeight:700}}>{emergenza.tipo}{emergenza.sottotipo?" — "+emergenza.sottotipo:""}</div>
            <div style={{fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:8}}>Segnalato da <strong style={{color:"#fff"}}>{emergenza.operaio}</strong></div>
            <div style={{fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:4}}>Ore {emergenza.ora} del {emergenza.data}</div>
          </div>

          <div style={{fontSize:14, color:"#FFD700", fontWeight:700, marginBottom:20, letterSpacing:"0.05em"}}>
            ⚡ INTERVENTO IMMEDIATO RICHIESTO
          </div>

          <div style={{display:"flex", flexDirection:"column", gap:10, width:"100%", maxWidth:320}}>
            <button onClick={()=>{ prendiInCarico(emergenza.id); setEmergenza(null); setSel(emergenza); setView("dettaglio"); }} style={{
              padding:"16px", background:"#FFD700", border:"none", borderRadius:12,
              color:"#7B0000", fontSize:16, fontWeight:900, cursor:"pointer",
              fontFamily:"Georgia,serif", letterSpacing:"0.05em"
            }}>
              🙋 PRENDO IN CARICO IO
            </button>
            <button onClick={()=>{ setSel(emergenza); setEmergenza(null); setView("dettaglio"); }} style={{
              padding:"14px", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.4)",
              borderRadius:12, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer",
              fontFamily:"Georgia,serif"
            }}>
              Vedi dettaglio
            </button>
            <button onClick={()=>setEmergenza(null)} style={{
              padding:"10px", background:"none", border:"none",
              color:"rgba(255,255,255,0.4)", fontSize:12, cursor:"pointer",
              fontFamily:"Georgia,serif"
            }}>
              Chiudi avviso
            </button>
          </div>
        </div>
      )}

      <Footer/>

      {/* Bottom nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:390,background:"#FFFFFF",borderTop:"1px solid #1E1E1E",display:"flex",zIndex:20}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>setView(n.id)} style={{...B,flex:1,padding:"10px 4px",background:"none",color:view===n.id?"#FF4D00":"#777",fontWeight:400,borderRadius:0,borderTop:view===n.id?"2px solid #FF4D00":"2px solid transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative"}}>
            <span style={{fontSize:16}}>{n.icon}</span>
            <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.06em"}}>{n.label}</span>
            {n.id==="guasti"&&aperte>0&&<span style={{position:"absolute",top:4,right:"50%",marginRight:-18,fontSize:9,background:"#FF3B30",color:"#fff",borderRadius:"50%",width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{aperte}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════ ROOT ═══════════════════
export default function App() {
  const [mode, setMode]        = useState(null);
  const [segnalazioni, setSeg] = useState(segnalazioniIniziali);
  const [archivio, setArch]    = useState(archivioIniziale);
  const [team, setTeam]        = useState(teamIniziale);
  const operai                 = operaiIniziali;

  if (!mode) return (
    <div style={{ background:"#F5F0EB", fontFamily:"Georgia,serif", maxWidth:500, margin:"0 auto", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center" }}>
      <div style={{ marginBottom:16 }}><LogoMoroniAmato size="big"/></div>
      <div style={{ fontSize:40, color:"#FF4D00", fontStyle:"italic", fontWeight:700, marginBottom:4 }}>FixLine 🔧</div>
      <div style={{ fontSize:13, color:"#777", marginBottom:48 }}>Sistema di gestione manutenzione</div>
      <div style={{ display:"flex", flexDirection:"column", gap:16, width:"100%", maxWidth:320 }}>
        <button onClick={()=>setMode("tablet")} style={{ ...B, padding:"24px", background:"#FFFFFF", border:"1px solid #FF4D0040", borderRadius:16, color:"#1A1A1A", fontWeight:400, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <span style={{fontSize:40}}>📟</span>
          <div style={{fontWeight:700,color:"#FF4D00",fontSize:18}}>TABLET OPERAIO</div>
          <div style={{fontSize:12,color:"#777"}}>Login con badge · Segnala guasti</div>
        </button>
        <button onClick={()=>setMode("telefono")} style={{ ...B, padding:"24px", background:"#FFFFFF", border:"1px solid #00C2FF40", borderRadius:16, color:"#1A1A1A", fontWeight:400, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <span style={{fontSize:40}}>📱</span>
          <div style={{fontWeight:700,color:"#00C2FF",fontSize:18}}>APP MANUTENTORI</div>
          <div style={{fontSize:12,color:"#777"}}>Login con password · Gestisci interventi</div>
        </button>
      </div>
      <Footer/>
    </div>
  );

  return (
    <div>
      <div style={{background:"#F5F0EB",padding:"6px 12px",display:"flex",justifyContent:"flex-end"}}>
        <button onClick={()=>setMode(null)} style={{...B,background:"none",color:"#777",fontSize:11,padding:0,fontWeight:400}}>← home</button>
      </div>
      {mode==="tablet"
        ? <TabletOperaio segnalazioni={segnalazioni} setSegnalazioni={setSeg} operai={operai}/>
        : <TelefonoTeam segnalazioni={segnalazioni} setSegnalazioni={setSeg} archivio={archivio} setArchivio={setArch} team={team} setTeam={setTeam}/>
      }
    </div>
  );
}
