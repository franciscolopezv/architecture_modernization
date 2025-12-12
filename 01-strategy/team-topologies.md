# Team Topologies & Domain Ownership

> **⚠️ PREREQUISITE**: Organizational alignment to domains is a **mandatory prerequisite** for backend modernization. Attempting to modernize architecture without first aligning teams to domain boundaries will result in a distributed monolith—microservices with monolithic coupling.

This document explains how to align teams to domains and the target architecture so cognitive load stays healthy and ownership is clear.

## Why Team Structure Must Come First

**Conway's Law**: Organizations design systems that mirror their communication structures.

If you modernize your architecture (split services, introduce APIs, add event streams) but keep teams organized by:
- Technical layers (UI team, API team, database team)
- Shared services (integration team, middleware team)
- Project-based squads that disband after delivery

You will create a **distributed monolith**:
- Services that cannot be deployed independently
- Every change requires coordination across multiple teams
- Shared databases with implicit coupling
- Synchronous call chains that span team boundaries
- No clear ownership when things break
- Slower delivery than the monolith you replaced

### The Reverse Conway Maneuver

Instead of letting team structure dictate architecture, **design the target domain boundaries first, then reorganize teams to match**:

1. **Discover domains** (via domain-driven design, event storming, value stream mapping)
2. **Define bounded contexts** with clear interfaces (APIs, events, data ownership)
3. **Assign one stream-aligned team per bounded context**
4. **Then** modernize the architecture incrementally

This ensures:
- Teams can work independently with minimal coordination
- Services have clear ownership and can evolve separately
- Communication patterns (APIs/events) match team boundaries
- Cognitive load per team stays manageable
- Fast flow of change with low risk

### What Happens Without This Prerequisite

Real-world anti-patterns observed in organizations:

**Scenario 1: Layer-based teams**
- "API team" builds REST endpoints
- "Integration team" owns message flows  
- "Database team" manages schemas
- Result: Every feature requires handoffs across 3+ teams, takes weeks, and creates implicit coupling through shared databases

**Scenario 2: Shared service teams**
- "Customer team" owns a god service with 200+ endpoints
- Every domain needs customer data, so everyone depends on this team
- Result: Customer team is a bottleneck, cannot deploy independently, and accumulates conflicting requirements from 10+ consumers

**Scenario 3: Project-based squads**
- Teams form for a project, build services, then disband
- Services are orphaned or reassigned to a "maintenance team"
- Result: No one understands the domain, on-call is reactive, and technical debt accumulates

### Prerequisites Before Modernization

Before using this playbook, your organization should have:

1. **Completed domain discovery** (see separate initiative)
   - Bounded contexts identified and validated
   - Context maps showing relationships
   - Domain events and aggregates defined

2. **Completed organizational transformation** (see separate initiative)
   - Stream-aligned teams formed around domains
   - Platform and enabling teams established
   - Team interaction modes defined
   - Cognitive load assessed and balanced

3. **Leadership alignment**
   - Executives understand and support domain ownership model
   - Budget and headcount aligned to long-lived teams, not projects
   - Success metrics shifted from project completion to flow and outcomes

If these prerequisites are not met, **pause** and complete the organizational transformation first. Modernizing architecture without organizational alignment wastes time and money.

## Core Team Types

- **Stream-aligned (domain) teams**
  - Own a bounded context/capability and its APIs/events, data stores, SLOs, and runbooks.
  - Build and run domain services, BFF slices (if channel-specific), and read models.
  - Default interaction mode with others: X-as-a-Service.
- **Platform teams**
  - Provide paved roads: CI/CD, IaC, observability, gateways, secrets, service mesh, schemas, golden templates.
  - Offer self-service interfaces with SLOs and docs; avoid bespoke work.
- **Enabling teams**
  - Short-lived coaches that unblock domain teams (e.g., GraphQL practices, gRPC, testing, SRE, data quality).
  - Engagements are time-boxed with clear exit criteria.
- **Complicated-subsystem teams**
  - Own specialized subsystems requiring deep expertise (e.g., risk engines, core banking, cryptography).
  - Provide clear APIs/events; minimize tight coupling to their internals.

## Domain & Team Alignment

1. Identify bounded contexts/capabilities (use Domain-Driven Design maps and value streams).
2. Assign **one stream-aligned team per context**; they own the code, contracts, data, and on-call.
3. Limit cognitive load: a team should actively own a small set of services/components in one domain (avoid “ten services per team”).
4. Avoid shared databases across domains; cross-domain access is via APIs/events with versioned contracts.
5. For each API/event, name the owning team and contact/on-call; publish in service catalog.

## Interaction Modes (Team Topologies)

- **X-as-a-Service (default)**: platform capabilities and shared services provide stable APIs, docs, quotas, and support SLOs.
- **Collaboration (time-boxed)**: use when creating new cross-cutting capabilities; set a clear end date to return to service boundaries.
- **Facilitating**: enabling teams pair with domain teams to raise skills, then exit.

## Conway's Law and Reverse Conway Maneuver

- Architecture mirrors communication. If two domains talk constantly, the software will too. Make that intentional.
- Use the **reverse Conway maneuver** to shape the architecture: design target domain/service boundaries first, then align teams and communication paths to them.
- Reduce cross-team handoffs on a critical user journey; co-locate ownership (one stream-aligned team, one on-call rotation) to keep latency low.
- Avoid organizing teams around shared layers (UI team, DB team) or generic integration hubs; that creates tight coupling and slow flow.

## Applying to the Architecture Layers

- **Edge/BFF**: Stream-aligned teams own channel-specific BFF slices; platform provides gateway, authN/Z, and traffic management.
- **Domain Services**: Stream-aligned teams own their domain services, schemas, and events; platform supplies paved-road runtime and CI/CD.
- **Async/Event Backbone**: Platform runs the broker/mesh; domain teams own their topics, schemas, and consumers.
- **Data & Read Models**: Domain teams own OLTP schemas and projections; data platform provides warehouses/search with clear contracts.

## Guardrails for Modernization Initiatives

- Before starting a slice, name the domain team owner, on-call rotation, and success measures (SLOs).
- Use enabling teams to bootstrap new patterns (gRPC, GraphQL, sagas) instead of outsourcing ownership.
- Time-box collaboration; revert to X-as-a-Service once the capability is stable.
- Keep a service catalog updated with owners, contracts (OpenAPI/AsyncAPI/SDL), dependencies, and SLOs.
- Watch for **distributed monolith** signals: many synchronous calls across teams on critical paths, shared databases, and changes requiring multiple teams to ship together. If seen, regroup teams and interfaces to restore locality.

## Validating Team-Domain Alignment

Before proceeding with modernization, validate that your team structure supports independent flow:

### Team Independence Test
For each stream-aligned team, ask:
- Can this team deploy their services without coordinating with other teams?
- Does this team own all the data their services need (no shared databases)?
- Can this team make most decisions without cross-team approval?
- Does this team have end-to-end ownership (build, run, support)?

If the answer to any question is "no," the team boundaries need adjustment.

### Cognitive Load Assessment
For each team, evaluate:
- Number of services/components actively maintained (target: 2-5 for most teams)
- Number of technologies/platforms in use (minimize variety)
- Number of domains/bounded contexts owned (target: 1, maximum 2 if tightly related)
- Number of external dependencies requiring coordination (minimize)

If cognitive load is too high, either:
- Split the domain and create two teams
- Move some capabilities to platform teams as self-service
- Simplify the technical landscape

### Communication Pattern Audit
Map actual communication patterns:
- How many synchronous API calls cross team boundaries on critical paths?
- How many meetings per week involve cross-team coordination?
- How many deployments require multiple teams to release together?
- How many incidents require multiple teams to resolve?

High numbers indicate misaligned boundaries. Redesign domains or team assignments to increase locality.

### Anti-Pattern Detection

**Red flags that indicate you're not ready:**

1. **Shared Database Syndrome**
   - Multiple teams read/write the same database tables
   - Schema changes require cross-team coordination
   - No clear data owner for critical entities

2. **Distributed Monolith Indicators**
   - Services cannot be deployed independently
   - Synchronous call chains span 4+ services across teams
   - Every feature requires changes in 3+ services owned by different teams
   - Integration tests require spinning up 10+ services

3. **Conway's Law Violation**
   - Architecture diagram shows clean domain boundaries
   - But teams are organized by technology layers or shared services
   - Result: constant coordination overhead and slow delivery

4. **Phantom Ownership**
   - Services have "owners" on paper but no dedicated team
   - On-call rotation includes people who didn't build the service
   - "Everyone owns it" (which means no one does)

5. **Platform as Bottleneck**
   - Platform teams do work "for" stream-aligned teams instead of providing self-service
   - Every deployment, infrastructure change, or tool setup requires a ticket to platform
   - Platform teams are organized by technology (Kubernetes team, database team) instead of capabilities

If you see these patterns, **stop modernization work** and fix the organizational structure first.

## Link to Organizational Transformation Initiative

This playbook assumes your organization has completed (or is actively executing) a Team Topologies transformation. That initiative should cover:

- **Domain Discovery**: Event storming, context mapping, bounded context identification
- **Team Formation**: Creating stream-aligned teams, platform teams, and enabling teams
- **Organizational Change Management**: Leadership alignment, budget restructuring, communication strategy
- **Cognitive Load Management**: Assessing and balancing team responsibilities
- **Interaction Mode Definition**: Establishing X-as-a-Service, collaboration, and facilitating patterns

If your organization has not started this work, refer to:
- **Team Topologies** book by Matthew Skelton and Manuel Pais
- **Domain-Driven Design** by Eric Evans (for domain discovery)
- Your organization's internal transformation program (if one exists)

**Do not proceed with backend modernization until team-domain alignment is established.** The technical patterns in this playbook will fail without the organizational foundation.
