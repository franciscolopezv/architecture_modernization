# Backend Modernization Playbook

This repository defines the **standard patterns, processes, and artefacts** for backend modernization.

It is intended as a **blueprint for teams** who need to:

- Move from legacy integration layers (ESBs, DataPower, WSB, code generators) to **domain APIs**.
- Introduce **event-driven architecture**, **modern observability**, and **safer deployments**.
- Standardize **how** we design, review, and migrate backend services.

> This repo is **technology-agnostic** at the documentation level. Concrete implementations (Helm charts, CI pipelines, etc.) can live in other repos but should reference patterns here.

## ⚠️ Prerequisites Required

**This playbook assumes your organization has completed organizational transformation using Team Topologies principles.** Specifically:

- **Domain discovery** has identified bounded contexts and domain boundaries
- **Teams are organized around domains**, not technical layers or projects
- **Platform and enabling teams** exist to support stream-aligned teams
- **Leadership supports** long-lived product teams and incremental modernization

**If these prerequisites are not met, start with `01-strategy/prerequisites.md` before proceeding.** Attempting backend modernization without organizational alignment will result in a distributed monolith.

## Structure

- `01-strategy/` – vision, prerequisites, team topologies, target architecture, and maturity model.
- `02-principles/` – architecture principles that guide decisions.
- `03-process/` – step-by-step modernization process for teams.
- `04-patterns/` – reusable architecture blueprints (API, events, GraphQL BFF, data).
- `05-templates/` – ADR, strangler plan, and system inventory templates.
- `06-checklists/` – architecture review, data migration, and pre–go-live checklists.
- `07-examples/` – worked examples from real domains (sanitized).

## How teams should use this

### Before You Start
1. **Validate prerequisites** - Read `01-strategy/prerequisites.md` and ensure your organization has completed domain discovery and team reorganization. If not, pause and complete that work first.

### Getting Started
2. Start with `01-strategy/vision.md` and `02-principles/principles.md` to understand the target state.
3. Review `01-strategy/team-topologies.md` to validate your team structure supports independent flow.
4. Assess current systems using `01-strategy/maturity-model.md` to prioritize modernization efforts.
5. Use `03-process/modernization-process.md` as the **playbook**.

### For Each Service/System
5. Fill **system inventory** and optionally **strangler plan** from `05-templates/`.
6. Design using the relevant **pattern** in `04-patterns/`.
7. Capture key decisions using **ADR template**.
8. Run **checklists** before implementation and before go-live.

### Continuous Improvement
9. Contribute improvements via pull requests and ADRs.

---
