# learn-ai-red-team-with-phoebe

**Testing the AI systems you own, honestly - and what you may claim afterwards.**

Live: https://phoebefu6.github.io/learn-ai-red-team-with-phoebe/

Part of [Learn with Phoebe](https://phoebefu6.github.io/learn-with-phoebe/) - by Phoebe Fu.

---

## Authorized testing only

This course is about testing AI systems **you own, or are contracted in writing to test**. Every
exercise runs against a fictional company inside a scope document you write in the first session.

It names attack **classes** so a defender can build test cases, and pairs every class with the
defence that addresses it. **It contains no exploit payloads and teaches no attack craft.** Testing a
system you are not authorized to test is a crime in most jurisdictions, and no framing in a scope
document changes that.

## The result that frames the course

A bug bounty ran **183 participants over 3,000+ hours** against a new safety system and found no
universal jailbreak. A later public exercise with **339 people over ~3,700 hours** found one.

Nothing about the first result was wrong. It simply did not mean what "we red-teamed it and found
nothing" is usually taken to mean. Red teaming establishes presence, never absence.

## What this course is

Two tracks, 16 sessions of 45 minutes.

- **Leader track (6)** - for the people who commission and read the report. What a red team can and
  cannot establish, the threat model in two heuristics, how to read a report without being fooled by
  a number, how to score severity by what a finding chains to, which defences the measured evidence
  supports, and when the right answer is that the workflow should not ship as an agent at all.
- **Builder track (10)** - for security engineers, AI engineers and platform leads. Write the rules of
  engagement, map the surface to current framework IDs, work through injection, refusal, extraction
  and tool abuse as classes to test rather than tricks to perform, build the suite, run the
  engagement, harden and honestly measure the delta, and leave a standing suite behind.

## The live attack-surface board

`assets/surface-live.js` runs offline in the browser. Toggle which classes your suite probes and
which controls you have deployed, and watch coverage and residual risk move.

| Rung | Coverage | Residual risk | Risk with no evidence |
|---|---|---|---|
| Before the engagement | 0% | 100.0 | 100% |
| Probe the obvious class | 13% | 99.3 | 86.1% |
| **Probe the whole surface** | **100%** | **96.4** | **0%** |
| Add detection | 100% | 54.9 | 0% |
| Bound the capability | 100% | 21.8 | 0% |
| Close the rest | 100% | **14.0** | 0% |

**The third row is the point.** A fortnight of testing moved the total from 99.3 to 96.4 while moving
unknown risk from 86% to zero. The quantity of risk barely changed; all of it changed from guessed to
measured. That is what a red team delivers, and it is why the work is unpopular.

**The accounting rule that matters more than any number: an untested class counts at full inherent
risk.** The board reports "unknown", never "safe", because a coverage meter that treats "we did not
look" as "we are fine" is worse than no meter at all.

**The control comparison, computed live:** the system-prompt "ignore injected instructions" guard
removes **3.6** risk points. Least-privilege scoping plus human approval on irreversible actions
removes **55**. On a fully hardened configuration, deleting the prompt guard entirely costs **0.63**.
In the effectiveness matrix it scores a flat **zero** against indirect injection, context poisoning,
improper output handling and resource exhaustion.

**The arithmetic is real** and computed in your browser. **The inherent-risk figures and the
effectiveness matrix are a teaching model** encoding the direction the published literature reports,
not measurements of any system. Every page mounting the board says so.

## Sources

Every framework ID, figure and quotation traces to a primary source listed with its URL in
[`materials/official-course-map.md`](materials/official-course-map.md), verified 2026-08-14.
Secondary claims are labelled `[S]`, and the map carries an explicit **could not verify** list that
the course respects.

Two things worth knowing before reading anything else on this topic:

1. The OWASP Top 10 for LLM Applications is the **2026** edition and four IDs moved. Excessive Agency
   is now **LLM03**, Unbounded Consumption **LLM06**, Improper Output Handling fell to **LLM10**, and
   System Prompt Leakage was renamed and re-scoped to **LLM08 Hidden Context Exposure**. If a blog
   shows Improper Output Handling at LLM05, it is teaching the 2025 list.
2. **Prompt injection has no reliable prevention mechanism today** - the position of OWASP, NIST and
   the UK NCSC alike. The NCSC puts it plainly: SQL injection can be properly mitigated with
   parameterised queries, and there is a good chance prompt injection never will be.

## Neighbours, deliberately not duplicated

- [Agent Launch](https://phoebefu6.github.io/learn-agent-launch-with-phoebe/) - the go/no-go decision. Its safety gate requires an adversarial slice; this course builds one.
- [AI Observability](https://phoebefu6.github.io/learn-ai-observability-with-phoebe/) - the trace your findings surface in.
- [AI Agents](https://phoebefu6.github.io/learn-ai-agents-with-phoebe/) - what an agent is and how to build one.

## Running locally

No build step. Static HTML, CSS and vanilla JS.

```bash
python3 -m http.server 8000
```
