# Phase 1 Plan — Architecture Validation Verdict

*Validated by software-architect · 2026-06-26 · against `docs/plan.md` + `docs/spec.md`*

## Overall verdict: APPROVED — proceed (yes, with minor caveats)

The plan is technically sound and faithfully executes the spec, correctly scoped for a
small-business informational site. The domain seam (`get*()` + Zod + integer centavos) is the
right long-lived bet, and the WebGL progressive-enhancement strategy directly addresses the
owner's stated past pain. The caveats are about a few experimental dependencies and a couple of
under-specified seams, not about the design.

## Sequencing & dependencies: correct
M0 → M1 → M2 → M3 → M4 → M5 → M6 → M7 with no broken prerequisites. M3 consumes M2 seams; M4
JSON-LD/sitemap consume M2 data + M3.9 routes; M5 layers onto the M3.2 hero DOM (bottom-up tiers
4→1). Nit: M1.4 (View Transitions) is wired before routes exist — its verification is effectively
deferred to M3.9 / M6.3b.

## Consistency with the spec: strong; declared extensions
- Stack, money discipline, repo structure, WebGL fallback chain, SSG, analytics, maps — all match.
- **Avisos & Gallery** are new content types (not in spec) but extend the spec's Zod + data-file +
  `get*()` pattern — legitimate; worth an explicit owner sign-off line.
- **Fonts:** plan uses Anton/Oswald/Nunito/Pacifico. The spec Appendix A was provisional
  ("Inter/Poppins"); the authoritative source is `brand-visual-direction.md`, which mandates this
  four-family stack — so no real conflict, but watch the perf budget (Risk 4).
- **IA:** spec was "single-page-first + optional routes"; plan promotes to fuller multi-page IA,
  explicitly framed as extension, with `/avisos` & `/galeria` behind a decision gate. Consistent.
- No contradictions on geography (Villa de Álvarez / Colima — this validation predates the
  rebrand and originally checked Ciudad Guzmán / Jalisco / never Colima), NAP, or no-backend
  non-goals.

## Routing integration: coherent and feasible
"Real routes for crawlers, single-page feel for humans" is low-risk because each section is one
component with a `variant` prop, mounted on both `/` and its dedicated route (single source of
truth). `generateStaticParams()` over `getBranches()` for `/sucursales/[id]` (404 on unknown id)
is the correct SSG pattern. Watch: (a) View Transitions is experimental in Next — keep isolated so
version churn can't break routing; (b) self-referential canonicals so home previews don't compete
with `/menu` / `/sucursales`; (c) anchor-vs-route nav behavior (a `#avisos` click from `/menu`
must route to `/#avisos`).

## Over-engineering / scope: well-restrained
Cut/defer for launch (most already cut-first in the plan): full R3F 3D hero (ship tier-2 video
first), `/avisos` & `/galeria` as routes (keep as home sections unless they earn query volume),
View Transitions polish (ship plain soft-nav first), GalleryLightbox (optional).
Under-specified, will bite: avisos freshness on SSG (hydration), `branchId` referential integrity
(add a build-time/test assertion), Tailwind v4 CSS-first config friction.

## Top 3 to fix / watch
1. **De-risk launch: ship the video/static hero, treat R3F (M5.3) as fast-follow.** Tiers 4→2 fully
   satisfy "premium + never breaks"; 3D depends on assets that don't exist yet. Biggest schedule lever.
2. **Lock the avisos freshness + hydration approach now (M2.5/M3.6):** ISR `revalidate` baseline +
   client recompute in a post-mount effect (not render-time) to avoid hydration mismatch; quiet empty
   state, no CLS; add `branchId` referential-integrity check.
3. **Reconcile fonts + canonical discipline:** confirm four-family stack (done — brand doc mandates
   it), preload only the 2 always-visible faces, verify ~0 font CLS; verify in M4.1 that home previews
   vs `/menu` and `/sucursales` never compete (self-referential canonicals); isolate the experimental
   View Transitions flag.

**Net:** approve and proceed. Execution just needs to honor the plan's own Risks table rather than
treat the mitigations as optional.
