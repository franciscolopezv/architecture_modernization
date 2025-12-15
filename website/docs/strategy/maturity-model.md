# Server-Side Architecture Maturity Model

This model helps teams assess where a system is today, set realistic targets, and track progress. Use it whether you're modernizing legacy systems, building new systems, or evolving existing architecture.

> **Note**: This model measures technical maturity. For multi-team organizations, it assumes teams are aligned to domains. Without that foundation, even technically mature systems will behave like distributed monoliths.

## Maturity Levels

### Level 0 – Legacy

**Characteristics:**
- Tight coupling to ESB, DataPower, or legacy integration layer
- No clear domain boundary or ownership
- Shared databases with multiple systems reading/writing
- Little or no automated tests
- No SLOs or centralized observability
- Manual deployments or infrequent releases
- Unclear on-call model or reactive support only

**Team Impact:**
- High cognitive load (complex, undocumented systems)
- Slow delivery (weeks to months for changes)
- High risk (changes break unexpected things)
- Frequent production incidents

**Typical Systems:**
- 10+ year old monoliths
- ESB-based integration hubs
- Batch-heavy data flows
- Systems with "no one knows how it works"

---

### Level 1 – Wrapped

**Characteristics:**
- Legacy system accessible via a well-defined façade (API gateway or adapter service)
- Basic monitoring and logging in place (can see errors, latency)
- Read-only or limited new use cases exposed through modern APIs
- Legacy system still handles writes and core logic
- Some documentation exists (API contracts, basic architecture)
- Strangler plan drafted

**Team Impact:**
- Slightly reduced cognitive load (façade hides some complexity)
- New read use cases can be added faster
- Still dependent on legacy for writes
- Incidents still require deep legacy knowledge

**Purpose:**
- Buy time to plan proper modernization
- Enable new consumers without touching legacy internals
- Gather metrics to understand usage patterns
- Validate domain boundaries before building new services

**Typical Duration:** 3-6 months while planning next phase

---

### Level 2 – Domain-aligned

**Characteristics:**
- Domain APIs exist with clear contracts (OpenAPI/gRPC) and ownership
- One stream-aligned team owns the domain
- Some business logic moved from legacy to new domain services
- New writes go to new services; legacy may still handle some flows
- Events used for at least one integration scenario (AsyncAPI documented)
- Dual-write or synchronization between legacy and new data stores
- Automated tests for new services (unit, integration, contract)
- Basic CI/CD pipeline for new services

**Team Impact:**
- Team can deploy new services independently
- Clear ownership and on-call responsibility
- Faster delivery for new features (days to weeks)
- Legacy still creates drag for some changes

**Purpose:**
- Prove the domain model works
- Build team confidence with new stack
- Incrementally migrate functionality
- Reduce dependency on legacy for new features

**Typical Duration:** 6-18 months depending on domain complexity

---

### Level 3 – Cloud-native & Observable

**Characteristics:**
- Domain services own their data and APIs (no shared databases)
- Standardized CI/CD with automated testing and progressive delivery
- Comprehensive observability: structured logs, metrics, traces with correlation IDs
- SLOs defined and monitored with error budgets
- Majority of consumer traffic (70%+) goes through modern APIs/BFFs
- Legacy system handles only edge cases or is in read-only mode
- Event-driven integration for multiple scenarios
- Security hardened (secrets management, least privilege, audit logging)
- Runbooks and incident response procedures documented

**Team Impact:**
- Team deploys multiple times per week with confidence
- Incidents are rare and quickly resolved with good observability
- Low cognitive load (well-structured, documented systems)
- Team can innovate without legacy constraints

**Purpose:**
- Operate at modern standards
- Enable fast, safe delivery
- Prepare for legacy decommission

**Typical Duration:** 12-24 months to reach this level from Level 2

---

### Level 4 – Optimized

**Characteristics:**
- Legacy components fully decommissioned or scheduled for imminent retirement
- Domain events widely used for cross-domain integration
- Cost and performance optimized (right-sized infrastructure, efficient queries)
- Teams deploy independently and frequently (daily or on-demand) with low risk
- Chaos engineering or resilience testing in place
- Continuous improvement culture (blameless postmortems, experimentation)
- Platform capabilities mature and self-service
- Documentation and service catalog up-to-date

**Team Impact:**
- Team operates with high autonomy and low friction
- Fast flow of change (hours to days for most features)
- Proactive optimization and innovation
- Team satisfaction high (modern stack, clear ownership, low toil)

**Purpose:**
- Sustain competitive advantage
- Enable rapid experimentation
- Minimize operational toil

**Maintenance:** Continuous improvement to stay at this level

---

## How to Use This Model

### 1. Assess Current State
For each system or bounded context:
- Evaluate against the characteristics above
- Assign a maturity level (0-4)
- Document evidence (metrics, architecture diagrams, team feedback)
- Identify gaps to next level

Use the **System Inventory Template** (`05-templates/system-inventory-template.md`) to capture this assessment.

### 2. Set Target Level
- Define target level for next 12-18 months
- Be realistic: moving one level typically takes 6-18 months
- Consider business priority, risk, and team capacity
- Don't aim for Level 4 immediately—incremental progress is safer

**Prioritization factors:**
- Business criticality (revenue impact, customer-facing)
- Technical risk (out-of-currency, security vulnerabilities, frequent incidents)
- Dependency impact (how many other systems depend on this)
- Team readiness (skills, capacity, organizational support)

### 3. Plan the Journey
- Use `03-process/modernization-process.md` as the playbook
- Select patterns from `04-patterns/` appropriate for target level
- Create a **Strangler Plan** (`05-templates/strangler-plan-template.md`)
- Define success metrics (traffic %, incident reduction, deployment frequency)

### 4. Track Progress
- Review maturity level quarterly
- Celebrate moving up a level (it's real progress!)
- Adjust plans based on learnings
- Share progress with stakeholders using this common language

---

## Maturity vs Team Topologies Readiness

**Important distinction:**

This maturity model measures **technical modernization** of systems. It assumes you have already completed **organizational modernization** (Team Topologies alignment).

| Dimension | What it measures | Where to assess |
|-----------|------------------|-----------------|
| **Technical Maturity** | Architecture, observability, deployment practices | This document |
| **Organizational Readiness** | Team structure, domain alignment, cognitive load | `01-strategy/prerequisites.md` and `01-strategy/team-topologies.md` |

**You need both:**
- High technical maturity + poor team alignment = Distributed monolith
- Good team alignment + low technical maturity = Slow but improving

---

## Common Patterns by Level

### Moving from Level 0 → Level 1
- Add API gateway or façade in front of legacy
- Implement basic observability (logs, metrics)
- Document current architecture and dependencies
- Identify domain boundaries (even if not implemented yet)

**Patterns:** API gateway, adapter/façade, strangler plan

---

### Moving from Level 1 → Level 2
- Build first domain service for new capabilities
- Implement outbox pattern for events
- Set up CI/CD for new services
- Migrate read-only use cases first, then writes
- Establish dual-write or CDC for data synchronization

**Patterns:** Domain API service, event-driven, strangler, CQRS (optional)

---

### Moving from Level 2 → Level 3
- Migrate majority of traffic to new services
- Harden observability (SLOs, dashboards, alerts)
- Implement progressive delivery (canary, blue/green)
- Decouple from legacy data stores
- Expand event-driven integration
- Put legacy in read-only or maintenance mode

**Patterns:** All patterns mature, focus on operational excellence

---

### Moving from Level 3 → Level 4
- Decommission legacy systems
- Optimize cost and performance
- Implement chaos engineering
- Mature platform capabilities
- Focus on continuous improvement

**Patterns:** Optimization patterns, resilience testing, cost management

---

## Anti-Patterns to Avoid

**Skipping levels:**
- Trying to jump from Level 0 to Level 4 in one go (big-bang rewrite)
- Result: High risk, long delivery time, likely failure

**Measuring maturity without organizational readiness:**
- Building Level 3 systems but teams are organized by layers
- Result: Cannot deploy independently, coordination overhead negates benefits

**Optimizing prematurely:**
- Focusing on performance optimization at Level 1-2
- Result: Wasted effort; focus on domain boundaries and ownership first

**Declaring victory too early:**
- Calling a system "modernized" at Level 2 while legacy still handles 80% of traffic
- Result: Dual maintenance burden, no real benefit

---

## Success Metrics by Level

Track these metrics to validate progress:

| Metric | Level 1 | Level 2 | Level 3 | Level 4 |
|--------|---------|---------|---------|---------|
| **% traffic on modern APIs** | 10-20% (reads) | 30-50% | 70-90% | 95-100% |
| **Deployment frequency** | Monthly | Weekly | Daily | On-demand |
| **Lead time for changes** | Weeks | Days-weeks | Hours-days | Hours |
| **MTTR (mean time to recovery)** | Hours-days | Hours | Minutes-hours | Minutes |
| **Change failure rate** | 20-30% | 10-20% | 5-10% | &lt;5% |
| **Team autonomy** | Low | Medium | High | Very high |

---

## Next Steps

After assessing maturity:
1. Document findings in **System Inventory** (`05-templates/system-inventory-template.md`)
2. Prioritize systems for modernization (high business value + high risk first)
3. For each system, follow **Modernization Process** (`03-process/modernization-process.md`)
4. Review progress quarterly and adjust plans