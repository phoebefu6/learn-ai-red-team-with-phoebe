/* surface-live.js - the attack-surface board: what you tested, what you deployed, what is left.
   Usage:
     <div class="slbox" data-bot="chatbot"></div>          full board for one archetype
     <div class="slbox" data-bot="sql" data-tested="direct,jailbreak"></div>
     <div class="slbox" data-mode="ladder"></div>          scripted engagement rungs
     <div class="slbox" data-mode="matrix"></div>          defence-vs-class effectiveness matrix

   data-bot    = chatbot | sql | analytics
   data-tested = attack classes your suite probes (comma list)
   data-def    = defences deployed (comma list)

   DEFENSIVE FRAMING - this is a course about testing systems you own or are engaged to test. The
   board models an AUTHORIZED engagement against a fictional company's own bots. It names attack
   CLASSES so a defender can build test cases for them and pairs each with the defence that
   addresses it. It contains no exploit strings and teaches no attack craft.

   HONESTY RAIL (also printed on every page that mounts this): the inherent-risk figures and the
   defence-effectiveness matrix are a TEACHING MODEL. They encode the direction and rough
   proportion that the published literature reports - notably that prompt-level instructions are
   near-useless against indirect injection while architectural controls do the work - but they are
   not measurements of your system or anyone's. What is REAL is the arithmetic: coverage, residual
   risk and the untested-class accounting are computed live in your browser from the matrix and
   your settings. The single most important thing the arithmetic encodes is not a number at all:
   AN UNTESTED CLASS COUNTS AT FULL INHERENT RISK, because absence of evidence is not evidence of
   absence, and a coverage meter that treats "we did not look" as "we are fine" is worse than no
   meter at all. */
(function () {
  "use strict";

  /* ---------- attack classes ---------- */
  var CLASSES = [
    { key: "direct", label: "Direct prompt injection", owasp: "LLM01:2026",
      what: "A user instructs the model to disregard its operating instructions. The oldest class and the easiest to test, which is why teams over-index on it." },
    { key: "indirect", label: "Indirect prompt injection", owasp: "LLM01:2026",
      what: "Instructions arrive inside content the bot reads rather than from the user: a document, a ticket, a web page, a spreadsheet cell. The user is not the attacker and may be the victim." },
    { key: "jailbreak", label: "Refusal bypass", owasp: "LLM01:2026",
      what: "Framing that moves the model off its safety behaviour. Measured as a rate over many trials rather than a pass or fail, because the same input does not give the same answer twice." },
    { key: "disclosure", label: "Sensitive information disclosure", owasp: "LLM02:2026",
      what: "The system reveals what it should not: another tenant's data, system-prompt contents, retrieved documents the requester has no right to, or credentials sitting in context." },
    { key: "agency", label: "Excessive agency and tool abuse", owasp: "LLM03:2026",
      what: "The agent is induced to use a tool it holds but should not have used here. Severity is set by blast radius, not by cleverness: the question is what the credential can do, not how it was reached." },
    { key: "output", label: "Improper output handling", owasp: "LLM10:2026",
      what: "Model output is passed to something that executes or renders it - a database, a shell, a browser, a chart renderer - without treating it as untrusted input." },
    { key: "poison", label: "Context and memory poisoning", owasp: "LLM05:2026 / ASI06",
      what: "Attacker-influenced content persists into memory, a cache, or a retrieval index and shapes later answers for other people, long after the request that planted it." },
    { key: "wallet", label: "Unbounded consumption", owasp: "LLM06:2026",
      what: "Unbounded loops, recursive tool calls or oversized retrievals turned into a cost or availability problem. The agent architecture makes this cheaper to trigger than it used to be." }
  ];

  /* ---------- defences ---------- */
  var DEFENCES = [
    { key: "promptguard", label: "System-prompt instruction to ignore injected commands", kind: "prompt", anti: 1,
      hint: "The first thing every team reaches for, and the weakest control on this board. It asks the model to police text that arrives looking exactly like the text it is meant to follow. Watch it against indirect injection in particular: the published position across vendors is that instruction-level defences do not solve injection, and the matrix here encodes that as a flat zero rather than a small number." },
    { key: "inputfilter", label: "Input classifier and injection detector", kind: "detect",
      hint: "A model or ruleset that scores incoming content before it reaches the main call. Genuinely useful, genuinely bypassable, and it degrades quietly as attackers adapt. Treat it as a filter that raises cost, never as a boundary." },
    { key: "outputfilter", label: "Output filter and redaction", kind: "detect",
      hint: "Scanning what comes back for secrets, PII, and policy breaches. The last chance to catch a disclosure, and the only layer that sees what the model actually said rather than what it was asked." },
    { key: "leastpriv", label: "Least-privilege tool scoping", kind: "arch",
      hint: "Read-only roles, allowlisted operations, per-tenant credentials, row limits. Architectural rather than instructional: it does not ask the model to behave, it removes the capability. This is the lever that moves agency and disclosure furthest." },
    { key: "hitl", label: "Human approval on irreversible actions", kind: "arch",
      hint: "Draft-and-hold. The agent proposes, a person commits. It does not prevent the attempt, it prevents the consequence - which is the only thing that matters once an action cannot be undone." },
    { key: "sandbox", label: "Sandboxed execution and output escaping", kind: "arch",
      hint: "Treat every model output crossing into an executor or renderer as untrusted input, and run it somewhere it cannot hurt you. The classical control, and the one that transfers unchanged from ordinary application security." },
    { key: "ratelimit", label: "Rate and spend caps per principal", kind: "arch",
      hint: "Per-user and per-tenant ceilings on calls, tokens, steps and money. Unglamorous, and the only thing standing between a recursive tool loop and an invoice." }
  ];

  /* effectiveness: fraction of a class's inherent risk removed by a deployed defence.
     Deliberately encoded: promptguard is 0.00 against indirect injection and poisoning. */
  var EFF = {
    direct:     { promptguard: 0.05, inputfilter: 0.45, outputfilter: 0.15, leastpriv: 0.30, hitl: 0.35, sandbox: 0.10, ratelimit: 0.00 },
    indirect:   { promptguard: 0.00, inputfilter: 0.30, outputfilter: 0.20, leastpriv: 0.55, hitl: 0.60, sandbox: 0.15, ratelimit: 0.00 },
    jailbreak:  { promptguard: 0.10, inputfilter: 0.40, outputfilter: 0.45, leastpriv: 0.00, hitl: 0.15, sandbox: 0.00, ratelimit: 0.00 },
    disclosure: { promptguard: 0.05, inputfilter: 0.15, outputfilter: 0.65, leastpriv: 0.40, hitl: 0.10, sandbox: 0.00, ratelimit: 0.00 },
    agency:     { promptguard: 0.05, inputfilter: 0.10, outputfilter: 0.00, leastpriv: 0.75, hitl: 0.85, sandbox: 0.20, ratelimit: 0.10 },
    output:     { promptguard: 0.00, inputfilter: 0.05, outputfilter: 0.35, leastpriv: 0.20, hitl: 0.15, sandbox: 0.80, ratelimit: 0.00 },
    poison:     { promptguard: 0.00, inputfilter: 0.35, outputfilter: 0.15, leastpriv: 0.25, hitl: 0.30, sandbox: 0.10, ratelimit: 0.00 },
    wallet:     { promptguard: 0.00, inputfilter: 0.15, outputfilter: 0.00, leastpriv: 0.10, hitl: 0.20, sandbox: 0.00, ratelimit: 0.85 }
  };

  /* ---------- the three archetypes, with per-class inherent risk ---------- */
  var BOTS = {
    chatbot: {
      name: "Beacon Support Bot",
      what: "Customer-facing support chatbot over the help centre. Reads customer tickets, and can issue a refund credit.",
      tier: "T3 - irreversible financial action",
      inherent: { direct: 70, indirect: 80, jailbreak: 65, disclosure: 75, agency: 85, output: 25, poison: 55, wallet: 50 },
      note: { agency: "It can move money. That single capability sets the tier and dominates the board.",
              indirect: "It reads text written by strangers all day. Indirect injection is its native hazard, not an exotic one." }
    },
    sql: {
      name: "Beacon Analyst Bot",
      what: "Text-to-query bot over the warehouse. Analysts ask in English, it writes and runs SQL.",
      tier: "T2 - reads everything, writes nothing (if you scoped it properly)",
      inherent: { direct: 65, indirect: 40, jailbreak: 50, disclosure: 80, agency: 70, output: 85, poison: 35, wallet: 60 },
      note: { output: "Its output is executable by design. Insecure output handling is not a corner case here, it is the main event.",
              disclosure: "The warehouse holds every tenant's data. Scoping is the control, not the prompt." }
    },
    analytics: {
      name: "Beacon Insight Bot",
      what: "Analytics bot for executives. Queries, computes, charts, and writes the takeaway.",
      tier: "T2 - reads data it did not author, renders code it wrote",
      inherent: { direct: 60, indirect: 85, jailbreak: 45, disclosure: 70, agency: 55, output: 75, poison: 80, wallet: 65 },
      note: { indirect: "It reads spreadsheet cells. A cell is a place a stranger can put a sentence.",
              poison: "It caches. Anything that lands in the cache shapes tomorrow's answers for people who never saw the attack." }
    }
  };

  var BAR = 20; /* residual-risk index a defensible engagement must get under */

  /* ---------- the real arithmetic ---------- */
  function score(botKey, tested, deployed) {
    var bot = BOTS[botKey];
    var rows = CLASSES.map(function (c) {
      var inherent = bot.inherent[c.key];
      var isTested = !!tested[c.key];
      var mult = 1;
      DEFENCES.forEach(function (d) {
        if (deployed[d.key]) mult *= (1 - (EFF[c.key][d.key] || 0));
      });
      /* an untested class counts at FULL inherent risk - you have no evidence the defences work here */
      var residual = isTested ? inherent * mult : inherent;
      return { cls: c, inherent: inherent, tested: isTested, residual: residual,
               reduction: isTested ? (1 - mult) : 0, note: bot.note[c.key] || null };
    });

    var applicable = rows.length;
    var testedCount = rows.filter(function (r) { return r.tested; }).length;
    var coverage = testedCount / applicable;
    var totalInherent = rows.reduce(function (a, r) { return a + r.inherent; }, 0);
    var totalResidual = rows.reduce(function (a, r) { return a + r.residual; }, 0);
    var riskIndex = totalResidual / totalInherent * 100;
    var unknown = rows.filter(function (r) { return !r.tested; })
                      .reduce(function (a, r) { return a + r.inherent; }, 0) / totalInherent * 100;

    /* architectural controls are the ones that survive an adaptive attacker */
    var archOn = DEFENCES.filter(function (d) { return d.kind === "arch" && deployed[d.key]; }).length;
    var archTotal = DEFENCES.filter(function (d) { return d.kind === "arch"; }).length;

    var gates = [
      { key: "coverage", label: "Suite coverage",
        pass: coverage === 1,
        detail: testedCount + " of " + applicable + " classes probed",
        why: coverage === 1 ? "Every class in scope has at least one test. Findings are now about what you found, not about where you looked."
             : "Untested classes are counted at full inherent risk on this board, because that is the honest accounting. " + (applicable - testedCount) + " class(es) contribute risk you have no evidence about." },
      { key: "residual", label: "Residual risk",
        pass: riskIndex <= BAR,
        detail: riskIndex.toFixed(1) + " vs " + BAR + " bar",
        why: riskIndex <= BAR ? "Under the bar, on a fully probed surface. That is a defensible position to write down."
             : "Above the bar. Look at which rows are still red rather than at the total - one unmitigated class is not averaged away by six good ones." },
      { key: "arch", label: "Architectural controls",
        pass: archOn >= 3,
        detail: archOn + " of " + archTotal + " deployed",
        why: archOn >= 3 ? "The controls that remove capability rather than request good behaviour are carrying the weight."
             : "You are leaning on detection and instruction. Both degrade against an adaptive attacker; scoping, approval and sandboxing do not." },
      { key: "injection", label: "Injection classes held",
        pass: !!(tested.indirect && (deployed.leastpriv || deployed.hitl)),
        detail: tested.indirect ? (deployed.leastpriv || deployed.hitl ? "probed, and capability is bounded" : "probed, capability unbounded") : "indirect injection never probed",
        why: !tested.indirect ? "Indirect injection is the class most likely to reach you through content you did not write. Not testing it is the single largest gap on this board."
             : (deployed.leastpriv || deployed.hitl) ? "You cannot reliably stop the instruction arriving, so you bound what it can cause. That is the current state of the art, not a workaround."
             : "You are probing it but nothing limits the consequence. Detection alone is a filter, not a boundary." }
    ];

    return { bot: bot, rows: rows, coverage: coverage, riskIndex: riskIndex, unknown: unknown,
             testedCount: testedCount, applicable: applicable, gates: gates,
             green: gates.every(function (g) { return g.pass; }) };
  }

  /* ---------- formatting ---------- */
  function pct(x) { return (x * 100).toFixed(0) + "%"; }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x !== undefined && x !== null) e.textContent = x; return e; }
  function band(v) { return v >= 55 ? "hi" : v >= 25 ? "mid" : "lo"; }

  /* ---------- styles ---------- */
  var CSS = [
    ".slbox{border:1px solid var(--hairline);border-radius:var(--radius);background:#fff;padding:1.25rem 1.25rem 1.4rem;margin:1.5rem 0;}",
    ".sl-head{display:flex;flex-wrap:wrap;gap:.5rem;align-items:baseline;justify-content:space-between;}",
    ".sl-bot{font-weight:800;font-size:1.02rem;color:var(--indigo);}",
    ".sl-tier{font-size:.78rem;color:var(--amber);font-weight:700;}",
    ".sl-what{color:var(--muted);font-size:.86rem;line-height:1.6;margin:.15rem 0 1rem;}",
    ".sl-cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:1.3rem;}",
    "@media(max-width:880px){.sl-cols{grid-template-columns:1fr;}}",
    ".sl-sub{font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:var(--muted);margin:.9rem 0 .5rem;}",
    ".sl-sub:first-child{margin-top:0;}",
    ".sl-lev{display:flex;gap:.55rem;align-items:flex-start;padding:.38rem .5rem;border-radius:9px;cursor:pointer;}",
    ".sl-lev:hover{background:var(--indigo-50);}",
    ".sl-lev input{margin-top:.3rem;accent-color:var(--indigo);width:15px;height:15px;flex:0 0 auto;cursor:pointer;}",
    ".sl-lev-t{font-size:.85rem;font-weight:650;line-height:1.42;}",
    ".sl-lev-k{font-size:.68rem;font-weight:800;letter-spacing:.05em;padding:.05rem .3rem;border-radius:4px;margin-left:.3rem;vertical-align:middle;}",
    ".sl-lev-k.arch{background:var(--indigo);color:#fff;}",
    ".sl-lev-k.detect{background:var(--indigo-mid);color:#fff;}",
    ".sl-lev-k.prompt{background:#FEF2F2;color:#991B1B;}",
    ".sl-lev-h{font-size:.78rem;color:var(--muted);line-height:1.6;margin-top:.14rem;display:none;}",
    ".sl-lev.open .sl-lev-h{display:block;}",
    ".sl-meters{display:grid;grid-template-columns:1fr 1fr;gap:.7rem;}",
    ".sl-m{border:1px solid var(--hairline);border-radius:11px;padding:.6rem .75rem;}",
    ".sl-m b{display:block;font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);}",
    ".sl-m i{font-style:normal;display:block;font-size:1.55rem;font-weight:800;line-height:1.15;letter-spacing:-.02em;font-variant-numeric:tabular-nums;color:var(--indigo);}",
    ".sl-m i.bad{color:#991B1B;}",
    ".sl-m u{text-decoration:none;display:block;font-size:.73rem;color:var(--muted);line-height:1.5;}",
    ".sl-tbl{width:100%;border-collapse:collapse;font-size:.8rem;margin-top:.9rem;}",
    ".sl-tbl th{text-align:left;font-size:.65rem;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);padding:.4rem .35rem;border-bottom:2px solid var(--hairline);}",
    ".sl-tbl td{padding:.4rem .35rem;border-bottom:1px solid var(--hairline);vertical-align:top;}",
    ".sl-tbl tr.untested{background:#FEF2F2;}",
    ".sl-cn{font-weight:700;}",
    ".sl-ow{font-size:.68rem;color:var(--muted);font-family:ui-monospace,Menlo,monospace;}",
    ".sl-bar{position:relative;height:9px;border-radius:99px;background:var(--indigo-50);overflow:hidden;min-width:70px;}",
    ".sl-bf{position:absolute;left:0;top:0;bottom:0;border-radius:99px;}",
    ".sl-bf.hi{background:#991B1B;}.sl-bf.mid{background:var(--amber);}.sl-bf.lo{background:#166534;}",
    ".sl-tag{font-size:.66rem;font-weight:800;padding:.06rem .34rem;border-radius:4px;}",
    ".sl-tag.no{background:#FEF2F2;color:#991B1B;}",
    ".sl-tag.yes{background:#F0FDF4;color:#166534;}",
    ".sl-gates{margin-top:.9rem;border:1px solid var(--hairline);border-radius:12px;overflow:hidden;}",
    ".sl-g{display:flex;gap:.65rem;align-items:flex-start;padding:.55rem .8rem;border-top:1px solid var(--hairline);}",
    ".sl-g:first-child{border-top:0;}",
    ".sl-g.fail{background:#FEF2F2;}",
    ".sl-dot{flex:0 0 auto;width:9px;height:9px;border-radius:50%;margin-top:.4rem;background:#991B1B;}",
    ".sl-g.pass .sl-dot{background:#166534;}",
    ".sl-gl{font-size:.83rem;font-weight:700;}",
    ".sl-gd{font-size:.76rem;color:var(--muted);font-variant-numeric:tabular-nums;}",
    ".sl-gw{font-size:.77rem;color:var(--muted);line-height:1.55;margin-top:.12rem;}",
    ".sl-note{font-size:.74rem;color:var(--amber-ink);background:var(--amber-50);border-left:2px solid var(--amber);padding:.2rem .45rem;border-radius:0 5px 5px 0;margin-top:.2rem;line-height:1.5;}",
    ".sl-rail{margin-top:.9rem;font-size:.76rem;color:var(--muted);line-height:1.65;border-top:1px dashed var(--hairline);padding-top:.7rem;}",
    ".sl-lad{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.9rem;}",
    ".sl-ladb{font:inherit;font-size:.79rem;font-weight:650;padding:.3rem .68rem;border-radius:999px;border:1px solid var(--hairline);background:#fff;color:var(--muted);cursor:pointer;}",
    ".sl-ladb.on{background:var(--amber);border-color:var(--amber);color:#fff;}",
    ".sl-ladsay{font-size:.87rem;line-height:1.7;background:var(--amber-50);border-left:3px solid var(--amber);padding:.6rem .85rem;border-radius:0 9px 9px 0;margin-bottom:.9rem;}",
    ".sl-mx{width:100%;border-collapse:collapse;font-size:.74rem;font-variant-numeric:tabular-nums;}",
    ".sl-mx th{padding:.35rem .25rem;border-bottom:2px solid var(--hairline);font-size:.62rem;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);text-align:center;}",
    ".sl-mx th:first-child{text-align:left;}",
    ".sl-mx td{padding:.3rem .25rem;border-bottom:1px solid var(--hairline);text-align:center;}",
    ".sl-mx td:first-child{text-align:left;font-weight:650;}",
    ".sl-mx .z{background:#FEF2F2;color:#991B1B;font-weight:800;}",
    ".sl-mx .s{background:#F0FDF4;color:#166534;font-weight:700;}"
  ].join("");

  function injectCss() {
    if (document.getElementById("sl-css")) return;
    var s = document.createElement("style"); s.id = "sl-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- render: the board ---------- */
  function render(box, botKey, tested, deployed, opts) {
    opts = opts || {};
    box.innerHTML = "";
    var r = score(botKey, tested, deployed);

    var head = el("div", "sl-head");
    head.appendChild(el("span", "sl-bot", r.bot.name));
    head.appendChild(el("span", "sl-tier", r.bot.tier));
    box.appendChild(head);
    box.appendChild(el("p", "sl-what", r.bot.what));

    var cols = el("div", "sl-cols");

    var left = el("div", "");
    left.appendChild(el("div", "sl-sub", "What your suite probes"));
    CLASSES.forEach(function (c) {
      var row = el("label", "sl-lev");
      var cb = el("input", ""); cb.type = "checkbox"; cb.checked = !!tested[c.key];
      if (opts.scripted) cb.disabled = true;
      else cb.onchange = function () { tested[c.key] = cb.checked; render(box, botKey, tested, deployed, opts); };
      row.appendChild(cb);
      var b = el("div", "");
      var t = el("div", "sl-lev-t", c.label);
      t.appendChild(el("span", "sl-ow", " " + c.owasp));
      b.appendChild(t);
      b.appendChild(el("div", "sl-lev-h", c.what));
      row.appendChild(b);
      row.onmouseenter = function () { row.classList.add("open"); };
      row.onmouseleave = function () { row.classList.remove("open"); };
      left.appendChild(row);
    });
    left.appendChild(el("div", "sl-sub", "What you deployed"));
    DEFENCES.forEach(function (d) {
      var row = el("label", "sl-lev");
      var cb = el("input", ""); cb.type = "checkbox"; cb.checked = !!deployed[d.key];
      if (opts.scripted) cb.disabled = true;
      else cb.onchange = function () { deployed[d.key] = cb.checked; render(box, botKey, tested, deployed, opts); };
      row.appendChild(cb);
      var b = el("div", "");
      var t = el("div", "sl-lev-t", d.label);
      t.appendChild(el("span", "sl-lev-k " + d.kind, d.kind === "arch" ? "ARCHITECTURAL" : d.kind === "detect" ? "DETECTION" : "PROMPT"));
      b.appendChild(t);
      b.appendChild(el("div", "sl-lev-h", d.hint));
      row.appendChild(b);
      row.onmouseenter = function () { row.classList.add("open"); };
      row.onmouseleave = function () { row.classList.remove("open"); };
      left.appendChild(row);
    });
    cols.appendChild(left);

    var right = el("div", "");
    var mets = el("div", "sl-meters");
    mets.appendChild(meter("Suite coverage", pct(r.coverage), r.coverage < 1,
      r.testedCount + " of " + r.applicable + " classes probed"));
    mets.appendChild(meter("Residual risk index", r.riskIndex.toFixed(1), r.riskIndex > BAR,
      "bar is " + BAR + " · lower is better"));
    mets.appendChild(meter("Risk you have no evidence about", r.unknown.toFixed(1) + "%",
      r.unknown > 0, r.unknown > 0 ? "from classes you never probed" : "every class was probed"));
    mets.appendChild(meter("Verdict", r.green ? "Defensible" : "Not yet", !r.green,
      r.green ? "coverage complete, risk under bar, capability bounded" : "see the gates below"));
    right.appendChild(mets);

    var t = el("table", "sl-tbl");
    var thead = el("thead", ""), hr = el("tr", "");
    ["Attack class", "Probed", "Inherent", "Residual", ""].forEach(function (h) { hr.appendChild(el("th", "", h)); });
    thead.appendChild(hr); t.appendChild(thead);
    var tb = el("tbody", "");
    r.rows.forEach(function (row) {
      var tr = el("tr", row.tested ? "" : "untested");
      var c1 = el("td", "");
      c1.appendChild(el("div", "sl-cn", row.cls.label));
      c1.appendChild(el("div", "sl-ow", row.cls.owasp));
      if (row.note) c1.appendChild(el("div", "sl-note", row.note));
      tr.appendChild(c1);
      var c2 = el("td", "");
      c2.appendChild(el("span", "sl-tag " + (row.tested ? "yes" : "no"), row.tested ? "yes" : "no"));
      tr.appendChild(c2);
      tr.appendChild(el("td", "", String(row.inherent)));
      var c4 = el("td", "");
      c4.appendChild(el("span", "", row.residual.toFixed(0)));
      tr.appendChild(c4);
      var c5 = el("td", "");
      var bar = el("div", "sl-bar");
      var f = el("div", "sl-bf " + band(row.residual));
      f.style.width = Math.max(2, row.residual) + "%";
      bar.appendChild(f); c5.appendChild(bar);
      tr.appendChild(c5);
      tb.appendChild(tr);
    });
    t.appendChild(tb); right.appendChild(t);

    var gl = el("div", "sl-gates");
    r.gates.forEach(function (g) {
      var row = el("div", "sl-g " + (g.pass ? "pass" : "fail"));
      row.appendChild(el("span", "sl-dot"));
      var b = el("div", "");
      var line = el("div", "");
      line.appendChild(el("span", "sl-gl", g.label + " "));
      line.appendChild(el("span", "sl-gd", g.detail));
      b.appendChild(line);
      b.appendChild(el("div", "sl-gw", g.why));
      row.appendChild(b); gl.appendChild(row);
    });
    right.appendChild(gl);
    cols.appendChild(right);
    box.appendChild(cols);

    box.appendChild(el("p", "sl-rail",
      "Honesty rail: the inherent-risk figures and the effectiveness matrix are a teaching model encoding the direction the published literature reports, not measurements of any system. The arithmetic is real and runs in your browser. The rule it encodes matters more than any number on screen: an untested class is counted at FULL inherent risk, because a coverage meter that treats \"we did not look\" as \"we are fine\" is worse than no meter at all."));
    return r;
  }

  function meter(label, big, bad, note) {
    var m = el("div", "sl-m");
    m.appendChild(el("b", "", label));
    m.appendChild(el("i", bad ? "bad" : "", big));
    m.appendChild(el("u", "", note));
    return m;
  }

  /* ---------- render: the effectiveness matrix ---------- */
  function renderMatrix(box) {
    box.innerHTML = "";
    box.appendChild(el("div", "sl-bot", "What each control actually removes"));
    box.appendChild(el("p", "sl-what",
      "Percentage of a class's inherent risk removed by each control, in the model this board runs on. Read the top row before anything else: the control every team reaches for first is the only one with zeroes in it, and they sit under the two classes that arrive through content nobody on your team wrote."));
    var t = el("table", "sl-mx");
    var thead = el("thead", ""), hr = el("tr", "");
    hr.appendChild(el("th", "", "Control"));
    CLASSES.forEach(function (c) { hr.appendChild(el("th", "", c.label.split(" ")[0])); });
    thead.appendChild(hr); t.appendChild(thead);
    var tb = el("tbody", "");
    DEFENCES.forEach(function (d) {
      var tr = el("tr", "");
      var c0 = el("td", "", d.label.length > 34 ? d.label.slice(0, 33) + "..." : d.label);
      tr.appendChild(c0);
      CLASSES.forEach(function (c) {
        var v = EFF[c.key][d.key] || 0;
        var td = el("td", v === 0 ? "z" : v >= 0.5 ? "s" : "", v === 0 ? "0" : Math.round(v * 100));
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    t.appendChild(tb); box.appendChild(t);
    box.appendChild(el("p", "sl-rail",
      "The zeroes are the lesson. A system-prompt instruction cannot police text that arrives looking exactly like the text it is meant to obey, which is why it scores zero against indirect injection, context poisoning, insecure output handling and resource exhaustion alike. The controls with the large numbers are all architectural: they remove a capability rather than request good behaviour. This matrix is a teaching model, not a measurement - but its shape is the consistent finding across published vendor guidance."));
  }

  /* ---------- render: the scripted engagement ladder ---------- */
  var LADDER = [
    { name: "Before the engagement", bot: "chatbot", tested: {}, deployed: { promptguard: 1 },
      say: "Beacon's support bot is live. Security asked whether it had been tested and got \"we put an instruction in the system prompt telling it to ignore injected commands\". Nothing has been probed. Read the risk-you-have-no-evidence-about meter: it is at 100%, because not one class has a test behind it. Note that the board does not call this safe. It calls it unknown, and those are very different words." },
    { name: "Probe the obvious one", bot: "chatbot", tested: { direct: 1 }, deployed: { promptguard: 1 },
      say: "The team tests direct prompt injection first, because it is the class everyone has heard of and the easiest to write cases for. Coverage moves to one of eight. The residual barely moves, because the prompt-level control they are relying on removes 5% of that class and nothing at all of the others." },
    { name: "Probe the whole surface", bot: "chatbot", tested: { direct: 1, indirect: 1, jailbreak: 1, disclosure: 1, agency: 1, output: 1, poison: 1, wallet: 1 }, deployed: { promptguard: 1 },
      say: "Now every class has at least one test. Look carefully at what happened to the total: almost nothing, 99.3 down to 96.4. But the risk-you-have-no-evidence-about meter went from 86% to zero. The quantity of risk barely moved; ALL of it changed from guessed to measured. This is the moment a red team earns its budget and also the moment it becomes unpopular, because a fortnight of work produced no improvement - only an honest number where an assumption used to be." },
    { name: "Add detection", bot: "chatbot", tested: { direct: 1, indirect: 1, jailbreak: 1, disclosure: 1, agency: 1, output: 1, poison: 1, wallet: 1 }, deployed: { promptguard: 1, inputfilter: 1, outputfilter: 1 },
      say: "An input classifier and an output filter go in. Real progress - refusal bypass and disclosure both fall hard, because those are exactly the classes where inspecting the text is a sensible control. Agency barely moves, because no filter can tell a legitimate refund from an induced one." },
    { name: "Bound the capability", bot: "chatbot", tested: { direct: 1, indirect: 1, jailbreak: 1, disclosure: 1, agency: 1, output: 1, poison: 1, wallet: 1 }, deployed: { promptguard: 1, inputfilter: 1, outputfilter: 1, leastpriv: 1, hitl: 1 },
      say: "Least-privilege scoping and human approval on the refund path. This is the largest single move on the board, and it does not make the bot better at resisting anything - it makes the consequence of losing bounded. You stop trying to win the argument with the attacker and start limiting what winning gets them." },
    { name: "Close the rest", bot: "chatbot", tested: { direct: 1, indirect: 1, jailbreak: 1, disclosure: 1, agency: 1, output: 1, poison: 1, wallet: 1 }, deployed: { promptguard: 1, inputfilter: 1, outputfilter: 1, leastpriv: 1, hitl: 1, sandbox: 1, ratelimit: 1 },
      say: "Sandboxing for anything rendered or executed, and per-principal spend caps. All four gates green on a fully probed surface. Now turn the prompt-level instruction OFF and watch what happens to the total: almost nothing. It was never carrying the load, and it was the only control the team had on day one." }
  ];

  function renderLadder(box) {
    box.innerHTML = "";
    var step = 0;
    var nav = el("div", "sl-lad"), say = el("p", "sl-ladsay"), host = el("div", "");
    LADDER.forEach(function (L, i) {
      var b = el("button", "sl-ladb", (i + 1) + ". " + L.name);
      b.type = "button";
      b.onclick = function () { step = i; draw(); };
      nav.appendChild(b);
    });
    box.appendChild(nav); box.appendChild(say); box.appendChild(host);
    function draw() {
      Array.prototype.forEach.call(nav.children, function (b, i) { b.className = "sl-ladb" + (i === step ? " on" : ""); });
      say.textContent = LADDER[step].say;
      host.innerHTML = "";
      var inner = el("div", "");
      host.appendChild(inner);
      render(inner, LADDER[step].bot, Object.assign({}, LADDER[step].tested), Object.assign({}, LADDER[step].deployed), { scripted: true });
    }
    draw();
  }

  /* ---------- mount ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    injectCss();
    document.querySelectorAll(".slbox").forEach(function (box) {
      var mode = box.getAttribute("data-mode") || "board";
      if (mode === "ladder") { renderLadder(box); return; }
      if (mode === "matrix") { renderMatrix(box); return; }
      var botKey = box.getAttribute("data-bot") || "chatbot";
      if (!BOTS[botKey]) botKey = "chatbot";
      var tested = {}, deployed = {};
      var pt = box.getAttribute("data-tested");
      if (pt !== null && pt !== "") pt.split(",").forEach(function (k) { if (k.trim()) tested[k.trim()] = true; });
      var pd = box.getAttribute("data-def");
      if (pd !== null && pd !== "") pd.split(",").forEach(function (k) { if (k.trim()) deployed[k.trim()] = true; });
      render(box, botKey, tested, deployed, { scripted: false });
    });
  });

  window.SURFACE_LIVE = { score: score, CLASSES: CLASSES, DEFENCES: DEFENCES, EFF: EFF, BOTS: BOTS, LADDER: LADDER, BAR: BAR };
})();
