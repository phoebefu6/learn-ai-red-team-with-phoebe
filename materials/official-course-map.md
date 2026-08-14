# Official course map - learn-ai-red-team-with-phoebe

**Course question:** how do you test an AI system you own, honestly, and what may you claim afterwards?

**FRAMING - non-negotiable, on every page.** This is a course about **authorized testing of systems
you own or are engaged to test**. It names attack CLASSES so a defender can build test cases, and
pairs every class with the defence that addresses it. It contains **no exploit strings and teaches no
attack craft**. Where a technique is named, it is named the way a defender names it: as a thing to
test for and a thing to bound. Every page carries the authorization line.

**Verified 2026-08-14.** Two of the four core frameworks changed within nine months. Re-verify before
delivering.

## Positioning

| Sibling | Owns | We assume it |
|---|---|---|
| `learn-agent-launch` (ai d3) | The go/no-go decision, six-gate scorecard, Wilson intervals | yes - **its safety gate assumes an adversarial slice; this course is where you build one** |
| `learn-ai-observability` (ai d3) | The trace, telemetry, detection | yes - detection is where findings surface |
| `learn-ai-agents` (ai d3) | What an agent is, tools, memory, guardrails | yes |
| `learn-ai-evals` (ai d3) | Metrics, golden sets, judges | yes |
| `learn-cyber-security` (emrg d3, **status:planned**) | General security literacy | Leave it planned. This is the AI-specific course; that one is the general on-ramp |

**Line for the course:** you cannot make the model refuse to be fooled. You can bound what being
fooled gets an attacker. Everything else is detail.

## Running case: the Beacon engagement

Same company as `learn-agent-launch` and `learn-ai-observability`. Beacon commissions an **authorized
internal red-team engagement** against its own three bots before a board review. Support Bot (T3, can
issue refund credits), Analyst Bot (text-to-query over the warehouse), Insight Bot (reads data it did
not author, renders code it wrote). One engagement, scoped in b1, executed across the builder track.

**The simulator (`surface-live.js`) canon - VERIFIED LIVE, do not restate differently:**

| Rung | State | Coverage | Risk index | Unknown |
|---|---|---|---|---|
| 1 | Before the engagement (prompt guard only) | 0% | 100.0 | 100% |
| 2 | Probe the obvious one (direct injection) | 13% | 99.3 | 86.1% |
| 3 | Probe the whole surface | **100%** | 96.4 | **0%** |
| 4 | Add detection (input + output filters) | 100% | 54.9 | 0% |
| 5 | Bound the capability (least-priv + HITL) | 100% | 21.8 | 0% |
| 6 | Close the rest (sandbox + rate caps) | 100% | **14.0** | 0% all gates green |

**Rung 3 is the heart of the course:** a fortnight of testing moves the total from 99.3 to 96.4 while
moving unknown risk from 86% to zero. The quantity barely moved; ALL of it changed from guessed to
measured. That is what a red team delivers, and why it is unpopular.

**The anti-lever, verified:** the system-prompt "ignore injected instructions" guard removes **3.6
risk points** on a bare system (100.0 -> 96.4). Least-privilege + human approval alone removes **55**
(100.0 -> 45.0). On the fully hardened config, deleting the prompt guard entirely costs **0.63
points**. In the effectiveness matrix it scores a flat **zero** against indirect injection, context
poisoning, improper output handling and unbounded consumption.

**The accounting rule that matters more than any number: an untested class counts at FULL inherent
risk.** The board reports "unknown", never "safe".

---

## Session map

### Leader track (6 x 45 min) - crumb exactly `Leader session N of 6`

| # | File | Title | Spine |
|---|---|---|---|
| a1 | `a1-what-a-red-team-is-for.html` | What a red team is for | Existence not absence; the Constitutional Classifiers sequence; red teaming vs benchmarking; what a report may and may not claim |
| a2 | `a2-the-threat-model.html` | The threat model | Microsoft's System/Actor/TTPs/Weakness/Impact ontology; the lethal trifecta; Rule of Two; why STRIDE fits awkwardly |
| a3 | `a3-reading-a-red-team-report.html` | Reading a red-team report | k of N not pass/fail; what a near-zero ASR means; the questions to ask; why cross-vendor ASR comparison is invalid |
| a4 | `a4-severity-and-triage.html` | Severity and triage | MSRC's rubric; severity is what it chains to; CVSS fits the consequence not the reliability; the five axes |
| a5 | `a5-what-defences-actually-hold.html` | What defences actually hold | Prompt-level vs architectural; the measured bypass evidence; every durable real-world fix cut the egress leg |
| a6 | `a6-when-to-stop.html` | When to stop | Residual risk; "may not be a good use case for LLMs" as a legitimate finding; governance hooks; disclosure |

### Builder track (10 x 45 min) - crumb exactly `Builder session N of 10`

| # | File | Title | Spine |
|---|---|---|---|
| b1 | `b1-scope-and-rules-of-engagement.html` | Scope and rules of engagement | **HAND-AUTHORED TEMPLATE.** Authorization first; the RoE table; N trials; blast-radius limits; psychological safety |
| b2 | `b2-the-attack-surface.html` | The attack surface | The class taxonomy; OWASP 2026 + ATLAS + NIST mapping; **mount `data-mode="matrix"`** |
| b3 | `b3-prompt-injection.html` | Prompt injection | Direct vs indirect vs triggered; why unsolved; the defence ladder and its measured limits |
| b4 | `b4-jailbreaks-and-refusal.html` | Jailbreaks and refusal | Rate not binary; the benign set and overrefusal; why bounties scope this out absent a chain |
| b5 | `b5-data-extraction.html` | Data extraction | Disclosure, memorisation, cross-tenant, hidden context; design so disclosure is non-critical |
| b6 | `b6-tool-abuse-and-agency.html` | Tool abuse and agency | The agentic surface; ATLAS agent techniques; confused deputy; MCP security |
| b7 | `b7-build-the-suite.html` | Build the suite | **SIMULATOR SESSION.** Coverage; **mount board + `data-mode="ladder"`**; untested = unknown |
| b8 | `b8-run-the-engagement.html` | Run the engagement | Execution, recording fields, k of N, adaptive budget, when to stop a run |
| b9 | `b9-harden-and-retest.html` | Harden and retest | Break-fix rounds; **mount the board with defences**; measure the delta honestly |
| b10 | `b10-the-standing-suite.html` | The standing suite | Findings become CI tests; avoid overfitting; re-test triggers; why green is not safe |

---

## THE FRAMEWORK IDS - use these exactly

### OWASP Top 10 for LLM Applications is the **2026** edition. Four IDs moved.

| ID 2026 | Title | Was in 2025 |
|---|---|---|
| **LLM01:2026** | Prompt Injection | LLM01 (steady) |
| **LLM02:2026** | Sensitive Information Disclosure | LLM02 (steady) |
| **LLM03:2026** | Excessive Agency | **LLM06 - up 3** |
| **LLM04:2026** | Supply Chain | LLM03 |
| **LLM05:2026** | Data and Model Poisoning | LLM04 |
| **LLM06:2026** | Unbounded Consumption | **LLM10 - up 4** |
| **LLM07:2026** | Misinformation | LLM09 |
| **LLM08:2026** | Hidden Context Exposure | **LLM07 System Prompt Leakage - renamed and re-scoped** |
| **LLM09:2026** | Vector and Embedding Weaknesses | LLM08 |
| **LLM10:2026** | Improper Output Handling | **LLM05 - down 5, furthest fall** |

Source: https://github.com/GenAI-Security-Project/GenAI-LLM-Top10 (`2026/final/`)
**If a blog shows Improper Output Handling at LLM05, it is teaching the 2025 list.**

**How the 2026 ranking was made, and why it is a teaching moment:** 75% community vote + 25% incident
data from **7,714 real incidents**, 6,639 classifiable. Ranked by raw incident count alone, **Prompt
Injection falls out of the top 10 entirely** - OWASP keeps it at #1 and reads the absence as a
*defence effect* (mature teams spend real money holding it off, so fewer clean exploits reach public
databases). Misinformation was voted near the bottom but sits near the top of the incident record.
**Teach this: an incident count measures what got through AND what got reported, not what is
dangerous.**

OWASP's stated design philosophy, which is also this course's: **stop trying to build a model that
cannot be fooled; build the surrounding system so that when the model is fooled, nothing important
breaks.**

### OWASP Top 10 for Agentic Applications (ASI01-ASI10), released 9-10 Dec 2025

ASI01 Agent Goal Hijack* · ASI02 Tool Misuse and Exploitation · ASI03 Identity and Privilege Abuse ·
ASI04 Agentic Supply Chain · ASI05 Unexpected Code Execution · ASI06 Memory and Context Poisoning ·
ASI07 Insecure Inter-Agent Communication · ASI08 Cascading Failures · ASI09 Human-Agent Trust
Exploitation · ASI10 Rogue Agents

**\* ASI01 title is UNCONFIRMED.** OWASP's own repo file is `ASI01_Agent_Behaviour_Hijack.md` and the
December announcement says "Agent Behavior Hijacking"; secondary coverage of the final release says
"Agent Goal Hijack". **Verify against the released PDF before publishing, or write it as
"ASI01 (agent behaviour / goal hijack)".**

**Boundary rule:** the LLM list owns risk when the model is a *component inside* your application.
Once the model becomes an *actor* (tools, cross-session memory, downstream consequences), risk moves
to the Agentic list. Neither covers the ground alone.

### MITRE ATLAS - collection 2026.07, format-version 6.0.0

**16 tactics, 178 techniques (101 top-level + 77 sub), 37 mitigations, 68 case studies.**
Source: the machine-readable `dist/v6/ATLAS-2026.07.yaml` in https://github.com/mitre-atlas/atlas-data

**CAUTION, and say this on the page:** a second research pass could not load atlas.mitre.org and found
conflicting counts circulating in secondary sources (16/84 and 16/167 both appear). The numbers above
come from the machine-readable dataset the site is built from, which is the strongest available
source, but the rendered site may lag or lead it. **If you cite counts, cite the dataset version.**

14 of 16 tactics map to ATT&CK. Two are AI-specific: **AML.TA0000 AI Model Access** and
**AML.TA0001 AI Attack Staging**. Only 37 of 178 techniques carry an ATT&CK cross-reference.

**Schema trap:** the cross-reference key was renamed `ATT&CK-reference` (v5) -> `attack-reference`
(v6). Tooling written against v5 silently returns null mappings.

**Two v6 fields worth teaching.** `maturity` grades evidence: **Realized 68, Demonstrated 92,
Feasible 18** - a ready-made test-prioritisation axis, test Realized first. `platforms` shows
**Agentic AI 119, Generative AI 92, Predictive AI 70, Enterprise 61** - Agentic AI is now the largest
tag in ATLAS.

**The technique IDs to use (all verified from the dataset):**

| ID | Name | Tactic | Maturity |
|---|---|---|---|
| AML.T0051 (+.000 Direct, .001 Indirect, .002 Triggered) | LLM Prompt Injection | Execution | Realized |
| AML.T0054 | LLM Jailbreak | Defense Evasion, PrivEsc | Realized |
| AML.T0053 | AI Agent Tool Invocation | Execution, PrivEsc, Lateral Movement | Demonstrated |
| **AML.T0086** | Exfiltration via AI Agent Tool Invocation | Exfiltration | **Realized** |
| AML.T0080 (+.000 Memory, .001 Thread) | AI Agent Context Poisoning | Persistence | Demonstrated |
| **AML.T0110** (+.000/.001/.002) | AI Agent Tool Poisoning | Persistence | **Realized, NO mitigation mapped** |
| AML.T0070 / T0071 | RAG Poisoning / False RAG Entry Injection | Persistence / Defense Evasion | Demonstrated |
| AML.T0056 / T0057 | Extract LLM System Prompt / LLM Data Leakage | Exfiltration | Feasible / Demonstrated |
| AML.T0084 (+.000-.003) | Discover AI Agent Configuration | Discovery | Demonstrated |
| AML.T0077 | LLM Response Rendering | Exfiltration | Demonstrated, **no mitigation mapped** |
| AML.T0098 / T0082 / T0083 | Credential harvesting via tools / RAG / agent config | Credential Access | Demonstrated |
| **AML.T0101** | Data Destruction via AI Agent Tool Invocation | Impact | **Realized** |
| **AML.T0109** | AI Supply Chain Rug Pull | Defense Evasion | **Realized, NO mitigation mapped** |
| AML.T0034.002 | Agentic Resource Consumption | Impact | Feasible |
| AML.T0061 | LLM Prompt Self-Replication | Persistence | Demonstrated |

**Teaching point worth its own callout:** several **Realized** techniques (T0110 Tool Poisoning, T0109
Rug Pull, T0011.002 Poisoned Tool, T0067, T0077, T0092, T0093, T0083) have **no ATLAS mitigation
mapped at all**. That is not an omission to gloss over - it is the residual-risk column of an honest
course, in the framework's own words.

**Key mitigations:** M0020 GenAI Guardrails · M0024 AI Telemetry Logging · M0026/27/28 permission
configuration · **M0029 Human In-the-Loop** · **M0030 Restrict Tool Invocation on Untrusted Data** ·
M0031 Memory Hardening · M0032 Segmentation · M0033 I/O Validation · **M0035 AI Red Team** · M0036
Limit Resource Consumption.

**AML.M0035 defines AI red teaming as recurring, AUTHORIZED, threat-informed exercises, pre-deployment
AND throughout operation.** That is the course thesis in the framework's own words - use it on a1.

### NIST AI 100-2e2025 - Adversarial ML taxonomy (March 2025, 127pp)

https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf

PredAI and GenAI are taxonomised **separately**. Attacker objectives: **NISTAML.01** Availability
Breakdown · **.02** Integrity Violation · **.03** Privacy Compromise · **.04 Misuse Enablement (GenAI
only)** · **.05** Supply Chain. Attacks classified on five axes: system type, lifecycle stage,
properties violated, attacker capability/access, attacker knowledge.

**NIST's position on injection (§3.4.4)**, close paraphrase: current mitigations do not offer full
protection, so designers **may design systems on the assumption that prompt injection is possible
whenever a model is exposed to untrusted input** - for example multiple LLMs with different
permissions, or interaction with untrusted sources only through well-defined interfaces. This is the
origin of the dual-LLM and CaMeL patterns.

**NIST on agents (§3.5):** agents inherit GenAI attacks, but tool use creates *additional* risks
including arbitrary code execution and environment exfiltration. NIST states agent-security research
is **"still in its early stages."**

**NIST on measurement (§4.1.3) - quote this in a3:** benchmarks are unreliable and results "routinely
incomparable"; a mitigation must be tested against **unforeseen** attacks, and new mitigations "appear
very powerful, but are quickly shown [to] lack robustness to unforeseen types of attacks"; attributes
must be evaluated **simultaneously on a Pareto plot**, because a mitigation better on one axis and
worse on another is not an improvement.

Benchmarks NIST itself names: JailbreakBench, AdvBench, HarmBench, StrongREJECT, AgentHarm,
Do-Not-Answer, TrustLLM, AgentDojo. Tools: **garak and PyRIT**.

### NIST AI 600-1 GenAI Profile - 12 risk categories

Security-relevant ones: **Data Privacy**, **Human-AI Configuration** (automation bias and
over-reliance - underpins approval-fatigue attacks), **Information Integrity**, **Information
Security**, **Value Chain and Component Integration**. The four GAI PWG considerations: Governance,
Content Provenance, **Pre-deployment Testing**, Incident Disclosure.

---

## THE MEASURED EVIDENCE (this is what makes the course credible)

### Why prompt injection is unsolved - three independent official statements

1. **OWASP LLM01:2026:** LLMs make no architectural distinction between instructions and data, and
   behaviour is stochastic, so **"no reliable prevention mechanism exists today"**. There is "no clean
   equivalent to parameterized queries."
2. **NIST §3.4.4:** current mitigations do not offer full protection; assume injection is possible.
3. **UK NCSC, 8 Dec 2025** - the most quotable: *"SQL injection **can** be properly mitigated with
   parameterised queries, but there's a good chance prompt injection will **never** be properly
   mitigated in the same way."* And: *"Rather than hoping we can apply a mitigation that fixes prompt
   injection, we instead need to approach it by seeking to reduce the risk and the impact. If the
   system's security cannot tolerate the remaining risk, **it may not be a good use case for LLMs**."*
   Also: *"Under the hood of an LLM, there's no distinction made between 'data' or 'instructions';
   there is only ever 'next token'."* And on deny-listing: *"since LLMs are so complex there are
   infinite ways to rephrase an attack."*
   https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection

**That NCSC sentence - "it may not be a good use case for LLMs" - must be taught as a LEGITIMATE
ENGAGEMENT OUTCOME.** "Do not ship this workflow as an agent" is a finding, not a failure.

### The defence-bypass evidence - the spine of a5 and b3

| Finding | Source |
|---|---|
| **12 recent defences, most originally reporting near-zero ASR, bypassed at >90% ASR** using gradient descent, RL, random search and human-guided exploration | *The Attacker Moves Second*, Nasr, Carlini, Sitawarin, Schulhoff, Hayes, Shumailov, Terzis, Tramèr et al. (OpenAI/Anthropic/Google DeepMind), Oct 2025, https://arxiv.org/abs/2510.09023 |
| **All 8** evaluated indirect-injection defences for agents bypassed, **consistently >50% ASR** | Zhan et al., NAACL 2025 Findings, https://arxiv.org/abs/2503.00061 |
| **Six production guardrails** (incl. Azure Prompt Shield, Meta Prompt Guard) evaded by character injection (zero-width, Unicode tags, homoglyphs, emoji smuggling), **"in some instances up to 100% evasion success"** | https://arxiv.org/abs/2504.11168 |
| Spotlighting: ASR **>50% -> <2%** *non-adaptively* | https://arxiv.org/abs/2403.14720 |
| ...but spotlighting alone had **Team Success Rate 0.529** in LLMail-Inject, and DeepMind found spotlighting and self-reflection "became much less effective against adaptive attacks" | LLMail-Inject https://arxiv.org/abs/2506.09956 · https://deepmind.google/blog/advancing-geminis-security-safeguards/ |
| Instruction hierarchy: **up to +63%** robustness, generalising to unseen attacks - **with documented over-refusal regressions** | OpenAI, https://arxiv.org/abs/2404.13208 |
| **CaMeL: 77% of AgentDojo tasks with PROVABLE security vs 84% undefended** - a 7-point utility cost for a guarantee | Google Research, https://arxiv.org/abs/2503.18813 |
| Constitutional Classifiers: jailbreak success **86% -> 4.4%**, refusal increase only 0.38%, **23.7% compute overhead** | https://www.anthropic.com/news/constitutional-classifiers |

**LLMail-Inject** (Microsoft MSRC + IEEE SaTML 2025), the largest public adaptive-injection dataset:
370,724 + 90,916 submissions; end-to-end success **0.8%** then **0.3%**. Phase 1 Level 4 Team Success
Rate: Prompt Shield **0.600**, Spotlighting **0.529**, TaskTracker **0.440**, LLM Judge **0.318**,
**all combined 0.166**.
**The two teachable numbers: every individual defence was beaten by between a third and 60% of teams
that tried; stacking cut that to 16.6%, but not to zero.** Defence in depth is measurably real and
measurably insufficient.

### Non-determinism changes the whole methodology - the spine of b8

- **NIST CAISI: repeating the same attack 25 times instead of once raised average attack success from
  57% to 80%.** https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations
  **Consequence: the RoE must specify N trials, and findings report k of N, never a binary.**
- **Target-tailored novel attacks raised hijacking success from 11% (best baseline) to 81%** on the
  same system. NIST's conclusion: "Evaluations need to be adaptive."
- **CAISI competition: 250,000+ attempts, 400+ participants, 13 frontier models - at least one
  successful attack was found against EVERY model.** "Universal" attack families transferred across
  scenarios and models; attacks working on more robust models transferred *down* to weaker ones but
  not the reverse. https://www.nist.gov/blogs/caisi-research-blog/insights-ai-agent-security-large-scale-red-teaming-competition
- Microsoft's theoretical corollary: **"For any output which has a non-zero probability of being
  generated by an LLM, there exists a sufficiently long prompt that will elicit this response."**

### The absence-of-evidence lesson - a1's centrepiece

Anthropic's Constitutional Classifiers ran two exercises:
- Prototype bug bounty: **183 participants, >3,000 hours over two months. No universal jailbreak found.**
- Public demo: **339 jailbreakers, ~3,700 hours. One universal jailbreak found.**

**Nothing about the first result was wrong. It simply did not mean what "we red-teamed it and found
nothing" is usually taken to mean.** https://www.anthropic.com/news/constitutional-classifiers

### The architectural heuristics

- **Simon Willison's lethal trifecta:** access to private data + exposure to untrusted content +
  ability to communicate externally. Any one alone is safe; all three together mean attacker text can
  move your data out. **Removing any leg removes the risk.**
  https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
- **Meta's Rule of Two**, cited by OWASP as a floor: treat simultaneous (A) untrusted input, (B)
  sensitive data, (C) state change or external communication as high risk. An `[A,B,C]` agent needs
  **per-action human approval**. OWASP notes the rule is **silent on autonomy depth** - a real gap.

**The generalisation from every real incident below: every durable fix cut the egress leg or the
untrusted-content leg. NONE of them fixed the model.**

---

## REAL INCIDENTS - graded by evidence strength

### Strongest: CVE-assigned or vendor postmortem

**EchoLeak, M365 Copilot** - `[P]` **CVE-2025-32711**, "Ai command injection in M365 Copilot allows an
unauthorized attacker to disclose information over a network", **CVSS 3.1 9.3 CRITICAL**,
`AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N`, CWE-74, published 11 Jun 2025.
https://nvd.nist.gov/vuln/detail/CVE-2025-32711
Zero-click: hidden instructions in an inbound email, retrieved later by RAG during an unrelated query.
**Note the `S:C` scope-changed and `UI:N` no-user-interaction - this is the shape of a well-scored AI
finding**, and it is exactly MSRC's Critical pivot.

**Amazon Q Developer v1.84.0** - `[P]` AWS Security Bulletin AWS-2025-015, 23 Jul 2025.
https://aws.amazon.com/security/security-bulletins/AWS-2025-015/
Root cause: **"an inappropriately scoped GitHub token in their CodeBuild configuration"** let an
outside actor commit code included in a release. The injected prompt instructed the assistant to wipe
resources. **Outcome: it did not execute - "unsuccessful in executing due to a syntax error."**
*Do not cite CVE-2025-8217 - surfaced from the bulletin page but not corroborated in NVD.*

**Nx "s1ngularity"** - `[P]` https://nx.dev/blog/s1ngularity-postmortem
Chain: `pull_request_target` + unsanitised PR title + read/write default Actions token +
`workflow_dispatch`. Payload "Scanned user systems for sensitive data" and **"Attempted to use local
AI tools (like Claude and Gemini)"**. Remediation: npm Trusted Publishers/OIDC, no publish tokens,
manual 2FA.
**DO NOT state that the payload used AI-CLI permission-bypass flags** - that circulates widely but is
**not in the postmortem**. Blast-radius figures (1,346 repos, 2,349 secrets) are third-party `[S]`.

### Strong researcher primary + confirmed vendor fix

**CamoLeak, GitHub Copilot Chat** - `[P-researcher]`
https://www.legitsecurity.com/blog/camoleak-critical-github-copilot-vulnerability-leaks-private-source-code
Invisible injection in a PR comment, executing with the requesting user's permissions; exfiltration
via a **pre-computed dictionary of validly signed GitHub Camo image-proxy URLs**, one per character,
so leaked bytes travel as image loads from GitHub's own trusted domain, defeating CSP.
**GitHub's fix, 14 Aug 2025: disabled image rendering in Copilot Chat entirely.**
**CRITICAL CORRECTION - do not repeat the circulating CVE.** CVE-2025-59145 is the compromised
`color-name` npm package (CWE-506, CVSS 8.8), **unrelated to Copilot**. The "CVSS 9.6" is the
researcher's/programme rating, not an NVD record.

**Promptware against Gemini assistants** - `[P]` https://arxiv.org/abs/2508.12175
14 scenarios via poisoned calendar invitations, emails, shared documents. **73% of analysed threats
rated High-Critical to end users**; after Google deployed dedicated mitigations the authors reassessed
to **Very Low-Medium**. **The best available published before/after on a real vendor's mitigations.**

**ChatGPT `url_safe` bypass** - `[P]` Tenable TRA-2025-06
https://www.tenable.com/security/research/tra-2025-06
The output-side exfiltration control was defeated because **"URLs from bing.com are always allowed"**,
making Bing-indexed redirects an open redirect. Reported 10 Dec 2024; advisory 10 Mar 2025 stating
**"A solution has yet to be deployed."**

**Anthropic GTG-1002** - `[P]` https://www.anthropic.com/news/disrupting-AI-espionage
~30 targets, "succeeded in a small number of cases"; **AI performed 80-90% of the campaign with 4-6
human decision points**. Guardrails bypassed by task decomposition **plus telling Claude "it was an
employee of a legitimate cybersecurity firm, and was being used in defensive testing."**
**Put this in b1:** "we are doing authorized red teaming" must NEVER be a model-level assertion that
unlocks capability. **Authorization lives in the control plane - credentials, tenancy, tool scoping -
not in the prompt.** Also note Anthropic's own caveat: the model "occasionally hallucinated
credentials."

### Weaker - use with explicit caveats

Slack AI private-channel exfiltration (Aug 2024) - researcher + press only, no primary Slack advisory.
ForcedLeak/Agentforce - the CSP-allowlisted domain had **expired and was re-registrable for $5**;
CVSS 9.4 is the researcher's rating, no NVD entry, no primary Salesforce advisory.
ShadowLeak - press-sourced only; notable because exfiltration happened **server-side inside OpenAI's
cloud**, so no client-side artefact existed for endpoint controls to catch.

---

## SEVERITY AND TRIAGE (a4)

**MSRC's "Vulnerability Severity Classification for AI Systems"** is the most usable published rubric.
https://www.microsoft.com/en-us/msrc/aibugbar

- **Inference Manipulation** - *Prompt Injection*: **Critical** where it lets an attacker "exfiltrate
  another user's data or perform privileged actions" with **zero user interaction**; **Important** for
  the same impact **requiring user interaction**.
- **Inferential Information Disclosure** - severity keyed to **data classification**: Model Theft
  Critical (Highly Confidential) down to Low (Public); Input Extraction / system-prompt leakage
  Important (Confidential), Low otherwise.
- **Content-related issues** are classified **In Scope / Out of Scope with NO severity rating** - a
  deliberate separation of the safety track from the security track.

**Two design decisions to copy: severity turns on (a) user-interaction requirement and (b) data
classification of what is reachable - not on how clever the prompt was.**

**OWASP LLM08:2026 gives a worked severity ladder that generalises:** Informational (no secrets,
nothing depends on confidentiality) -> Medium (internal rules meaningfully aid an attacker) -> High
(embedded credentials, or secrecy relied on for authorization) -> **Critical (chains to RCE, broad
exfiltration, or privilege escalation)**.

**The generalisable principle: severity is set by what the finding CHAINS TO, not by whether the model
misbehaved.** A jailbreak in a system with no tools, no private data and no egress is informational.
The same jailbreak in an `[A,B,C]` Rule-of-Two agent is critical. This also explains why vendors scope
bare jailbreaking out of bounty programmes.

**Where CVSS breaks for AI findings:** no exploit-reliability dimension (a 40%-of-the-time finding and
a 100% one score identically, despite the NIST 57%->80% result); non-determinism breaks the
reproducibility gate most triage assumes; patch semantics differ (often no fix closes the class, only
mitigations that lower a rate); agent autonomy and tool scope are unmodelled. **OWASP AIVSS** targets
this but is **v0.8, pre-1.0** - teach it as promising, verify the maths yourself.
**Google's AI VRP scope is the cleanest published security-vs-content boundary:** direct injection,
jailbreaks and alignment failures are **out of scope for security bounties**; **indirect** injection
with production impact is in scope.

**The five-axis triage rubric to teach:** Reachability (zero-click vs one-click) · **Reliability (k of
N, N stated)** · Blast radius, data (highest classification reachable) · Blast radius, action (which
irreversible tools) · Durability (does it persist - memory, poisoned tool, poisoned index).
**For agents, the dominant term is action blast radius, not model behaviour.**

---

## ENGAGEMENT PRACTICE (b1, b8)

**Microsoft's operating guidance** https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/red-teaming
- Test at several layers: base model + safety system via API; the application via its UI; **before and
  after mitigations**. "Conduct testing of application(s) on the production UI as much as possible
  because this most closely resembles real-world usage." **"When reporting results, make clear which
  endpoints were used for testing."**
- Team: diverse across experience, demographics, expertise; recruit **both benign and adversarial
  mindsets** - "red teamers who are ordinary users of your application system and haven't been
  involved in its development can bring valuable perspectives"; rotate assignments between rounds.
- Two-stage execution: **open-ended first** ("enables them to creatively explore a wide range of
  issues, uncovering blind spots in your understanding of the risk surface"), then build a harms list,
  then **guided** testing against it.
- Minimum recording fields: **date · a unique identifier for the input/output pair for reproducibility
  · the input prompt · a description or screenshot of the output.**
- **The report line to copy verbatim into every template:** *"be sure to clarify that the role of RAI
  red teaming is to expose and raise understanding of risk surface and is not a replacement for
  systematic measurement and rigorous mitigation work. It is important that people do not interpret
  specific examples as a metric for the pervasiveness of that harm."*

**Microsoft's threat-model ontology:** **System · Actor · TTPs · Weakness · Impact**, with TTPs mapped
to ATT&CK and ATLAS. **The ontology explicitly does NOT assume adversarial intent** - they emulate
benign users who hit failures unintentionally. **This is the cleanest justification for framing red
teaming as reliability engineering rather than attacker cosplay.** The Microsoft AI Red Team was
established in **2018**.

**Microsoft's eight lessons** (https://arxiv.org/abs/2501.07238), verbatim: understand what the system
can do and where it is applied · **you don't have to compute gradients to break an AI system** · **AI
red teaming is not safety benchmarking** · automation can help cover more of the risk landscape · the
human element is crucial · RAI harms are pervasive but difficult to measure · LLMs amplify existing
security risks and introduce new ones · **the work of securing AI systems will never be complete**.

**OWASP GenAI Red Teaming Guide v1.0** (22 Jan 2025) - four scope areas: model evaluation,
implementation testing, infrastructure assessment, runtime behaviour analysis, through security
(operator), safety (users) and trust (users) lenses. https://genai.owasp.org/resource/genai-red-teaming-guide/

**CSA Agentic AI Red Teaming Guide** (28 May 2025) - red teaming as **"a continuous function"**;
objective is validating that implementations "enforce role boundaries, maintain context integrity,
detect anomalies, and **minimize attack blast radius**." Categories named on the readable page:
permission escalation, hallucination chains, orchestration flaws, memory manipulation, supply chain,
multi-agent collusion, agent untraceability. **Do not cite "12 categories" - only five were confirmed
on the accessible page.**

**Google's terminology distinction:** *red teaming* = end-to-end adversarial simulation with a goal in
a scenario; *adversarial testing* = "much more atomic", applied narrowly. **Conflating them is a
common error.** Google's lessons: pair security and AI experts; **"addressing red team findings can be
challenging, and some attacks may not have simple fixes"**; traditional security controls
significantly mitigate many attacks; **newly developed techniques should be reapplied to the subjects
of prior tests** (the regression argument). Report is **July 2023 - flag its age**.
https://services.google.com/fh/files/blogs/google_ai_red_team_digital_final.pdf

**OpenAI's published limitations of red teaming** (the most valuable page for a4/a6): point-in-time
relevance ("should not be seen as a panacea"); resource intensity; **harms to participants** -
psychological harm from sustained adversarial thinking, mitigated by mental-health resources, fair
compensation, informed consent; **information hazards** - exposing a not-yet-known jailbreak can
accelerate misuse; picking early winners; rising sophistication thresholds.
**Participant welfare belongs in the operating procedure, not just an ethics slide.**

---

## TOOLING (b7, b10)

| | **PyRIT** (Microsoft, MIT) | **garak** (NVIDIA, Apache 2.0) | **promptfoo redteam** |
|---|---|---|---|
| Mental model | Orchestration **framework** you compose | **Scanner** you point and run | **Test-suite generator + grader** for CI |
| Unit of work | Objective + attack strategy | Probe -> Detector | Plugin (what) x Strategy (how) |
| Multi-turn | Crescendo, TAP, Skeleton Key | limited (`atkgen`) | Hydra, Crescendo, GOAT, Goblin |
| Persistence/regression | **Memory DB (SQLite/Azure SQL)** - strongest | report artifacts | **Retry** re-runs past failures |
| Named by NIST §3.6 | **yes** | **yes** | no |

**Repo relocation trap:** `github.com/Azure/PyRIT` is **archived read-only as of 2026-03-27**; use
`github.com/microsoft/PyRIT`.
**PyRIT's memory layer is why it is a regression tool, not just a probe tool** - prior successful
attacks become a retained corpus you re-run after every model, prompt or tool change.
**Recommended layering:** garak for the cheap broad baseline -> promptfoo as the CI gate wired to your
policy -> PyRIT for the adaptive application-specific campaign whose findings become regression cases.
**PyRIT is a library; CI wiring is yours to build** - claims about built-in "pre-commit security
gates" are vendor-blog level.

**Benchmarks:** HarmBench (510 behaviours, 7 semantic + 4 functional categories) · JailbreakBench
(**100 harmful + 100 benign**, 10 categories) · AgentHarm (110 malicious agent tasks, 11 categories,
measuring refusal AND post-jailbreak capability retention) · AgentDojo (97 tasks, 629 security test
cases).
**Include the benign set.** JailbreakBench's 100 benign behaviours are the only cheap guard against
"improving security" by making the system refuse everything - and the Instruction Hierarchy paper's
own over-refusal regression is the cautionary tale.

**The formal ASR definition (HarmBench):** `ASR(y,g,f) = (1/N) Σ c(f_T(x_i), y)`. **Three variables
hide inside it, and each is a place to interrogate a vendor claim: the classifier `c`, the token
budget `T`, and `N`.** HarmBench found token budget "drastically impacts" ASR and is not standardised
across papers. promptfoo's own docs: **"Attack Success Rate (ASR) depends heavily on attempt budget,
prompt set composition, and judge choice."**

**On comparing ASRs at all** - Chouldechova, Cooper, Barocas, Palia, Vann, Wallach, **NeurIPS 2025**,
https://arxiv.org/abs/2601.18076: conclusions about relative system safety "are often not supported by
evidence provided by ASR comparisons", resting on **apples-to-oranges comparisons** or **low-validity
measurements**.
**Defensible position: report ASR only as a pinned-configuration trend within your own system over
time, alongside (a) the full attack-and-defence spec given to testers, (b) `T`, `N` and the judge, (c)
an overrefusal counter-metric, and (d) a regression-suite pass rate. NEVER as a cross-vendor
comparison.**

**Coverage proxies and their limits:** taxonomy coverage (trivially gamed) · surface coverage (needs a
complete inventory; agents change theirs at runtime) · maturity-weighted (weights are judgement) ·
**regression coverage - the only proxy that measures something real** · ASR under fixed budget
(comparable only to itself).

---

## GOVERNANCE (a6)

- **EU AI Act Art. 15** (high-risk): measures to "prevent, detect, respond to, resolve and control
  for" data poisoning, model poisoning, adversarial examples/model evasion and confidentiality
  attacks. https://artificialintelligenceact.eu/article/15/
- **EU AI Act Art. 55** (GPAI with systemic risk), **applicable from 2 Aug 2025 - the clearest hard
  legal hook for adversarial testing anywhere today**: providers must "perform model evaluation... 
  **including conducting and documenting adversarial testing of the model**", mitigate systemic risk,
  report serious incidents to the AI Office without undue delay, and ensure adequate cybersecurity.
  **It requires DOCUMENTATION - which is why the reporting template matters legally, not just
  operationally.** https://artificialintelligenceact.eu/article/55/
  *Scoping trap: Art. 15 sits in the high-risk chapter; GPAI models are governed separately under
  Arts. 51-56, and at least one peer-reviewed analysis argues GPAI carries no equivalent explicit
  robustness obligation.*
- **NIST AI RMF Playbook MEASURE 2.6:** "Use red-team exercises to actively test the system under
  adversarial or stress conditions." **MEASURE 2.7:** "Establish and track AI system security tests and
  metrics (e.g., red-teaming activities, frequency and rate of anomalous events...)." **This is the
  compliance anchor for a standing programme with metrics, not one-off exercises.**
  https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook/Measure
- **CISA/NCSC-UK/NSA + 21 partners**, *Guidelines for Secure AI System Development* (Nov 2023):
  secure-by-design; responsible release contingent on testing including red teaming; continuous
  monitoring in operation. https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development
- **Singapore IMDA / AI Verify** *Starter Kit for Safety Testing of LLM-Based Applications* - names
  benchmarking and red teaming as the two methods. Their AI Safety Red Teaming Challenge ran 350+
  participants across nine countries on four LLMs for cultural bias in non-English languages.
  https://aiverifyfoundation.sg/resources/
- **Disclosure reality** - Piao, Li & Woods (Edinburgh), 264 AI vendors: **36% have no disclosure
  policy, only 18% mention AI risks**; jailbreaking and hallucination are the most commonly
  out-of-scope items; postures split 46 proactive / 115 silent / 103 restrictive. Vendors address AI
  vulnerability disclosure **later** than research and real incidents.
  https://arxiv.org/abs/2509.06136

---

## WHAT A REPORT MAY CLAIM (a1 and a6 both land here)

Only these four things:
1. These specific attacks succeeded, **at these measured rates, under these conditions**, against
   **this build at this date**.
2. These specific weaknesses and impacts exist, **with these blast radii**.
3. These specific mitigations changed those rates **by these amounts**.
4. These risk surfaces **were explored** and these **were not**.

**It cannot claim the system is safe, secure, or robust.** If a stakeholder wants that sentence, the
correct answer is NCSC's: reduce the risk and the impact, and if the system's security cannot tolerate
the remaining risk, it may not be a good use case for an LLM.

Supporting quotes: **OpenAI GPT-5.6 system card** - *"evaluations represent a lower bound for
potential capabilities; additional prompting or fine-tuning, longer rollouts, novel interactions, or
different forms of scaffolding could elicit behaviors beyond what we observed."*
**Anthropic** - "no system is completely immune to all attacks."
**Microsoft** - "it is still possible that some injections might evade these defenses", and "The idea
that it is possible to guarantee or 'solve' AI safety through technical advances alone is unrealistic."

---

## HONESTY DISCIPLINE (every page)

1. **Authorization line on every page.** Testing systems you own or are engaged to test.
2. **The simulator is a teaching model; the arithmetic is real.** Inherent-risk figures and the
   effectiveness matrix encode the *direction* the literature reports, not measurements. Coverage,
   residual risk and the untested-class accounting compute live.
3. **Never state a near-zero ASR as evidence of safety.** Cite Nasr et al. every time it comes up.
4. **k of N, never a binary.** Cite the NIST 57%->80% result.
5. **Label `[S]` secondary claims**, and use the "could not verify" list below.
6. **No exploit strings anywhere.** Classes, signals, defences, and the residual risk. If a page needs
   an example, describe the *shape* and the *defence*, never a working payload.

## COULD NOT VERIFY - do not teach as fact

- **ASI01's exact final title** (repo says "Agent Behaviour Hijack", secondary says "Agent Goal
  Hijack"). Write it as "ASI01 (agent behaviour / goal hijack)" until the PDF is checked.
- ASI02-ASI10 exact final titles - from draft filenames plus agreeing secondary summaries.
- **CamoLeak's CVE** - the circulating CVE-2025-59145 is a DIFFERENT vulnerability. Do not cite one.
- **CVE-2025-8217** for the Amazon Q incident - not corroborated in NVD.
- **"GPT-Red 84% vs humans 13%"** - the 84% is `[S]`-verified; **the 13% appears only in an
  aggregator**. Do not teach the comparison.
- **Nx malware using AI-CLI permission-bypass flags** - widely circulated, **not in the postmortem**.
- ForcedLeak CVSS 9.4 and Slack's response narrative - researcher/press ratings, no NVD, no primary
  vendor advisory.
- **Approval-fatigue rates for AI agents** - no primary study located. All sources are vendor and
  practitioner blogs. If used, label as hypothesis, or cite the general security-warning habituation
  literature explicitly as a **non-AI analog**.
- CSA guide "12 categories" - only five confirmed on the accessible page.
- **OWASP AIVSS formula and weightings** - described only in secondary sources.
- **Any "re-test every N weeks" cadence** - no standards body publishes one. Published practice is
  continuous automation plus **event-triggered** human rounds. Trigger list: base-model version change,
  system-prompt change, new tool or MCP server, new connector or data source, new renderer, new user
  population or language, any permission-scope change.
- MITRE ATLAS counts as rendered on atlas.mitre.org - cite the dataset version instead.
