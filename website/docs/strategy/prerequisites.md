# Prerequisites for Architecture Modernization

> **Important**: This document is for **medium to large organizations with multiple teams (4+)** working on interconnected server-based systems. If you're a small team (1-3 people), you can skip these prerequisites and go directly to the patterns and principles.

## Who Needs These Prerequisites?

**You need these prerequisites if:**
- You have **4 or more teams** working on server-based applications or backend systems
- Teams have **cross-dependencies** that slow down delivery
- You're experiencing **coordination overhead** (long meetings, release trains)
- Multiple teams modify the same services or databases
- You're in an **enterprise agile environment** with multiple squads

**You can skip these prerequisites if:**
- You have 1-3 teams with clear ownership
- Teams already work independently
- No significant coordination challenges
- You're a startup or small company

---

## Quick Navigation

1. [Why Prerequisites Matter](#why-prerequisites-matter-for-multi-team-organizations)
2. [Assess Your Readiness Level](#assess-your-readiness-level)
3. [Three Key Prerequisites](#three-key-prerequisites)
4. [What to Do Based on Your Readiness](#what-to-do-based-on-your-readiness)
5. [Common Failure Scenarios](#common-failure-scenarios)

---

## Why Prerequisites Matter (For Multi-Team Organizations)

When you have **multiple teams working on interconnected server-based systems**, architecture modernization requires **both** organizational and technical transformation. The patterns in this playbook work best when:

1. ✅ Teams are organized around **business domains**, not technical layers
2. ✅ Each team has **end-to-end ownership** of their services and data
3. ✅ Teams can **deploy independently** with minimal coordination
4. ✅ Platform capabilities are **self-service**, not bottlenecks

**Without this foundation:** You risk creating a **distributed monolith** - microservices with all the complexity but none of the benefits.

**For small teams:** If you have 1-3 teams, you likely already have clear ownership and can focus directly on the technical patterns (domain boundaries, contracts, observability).

---

## Assess Your Readiness Level

You don't need perfection to start. Assess where you are:

### Level 1: Minimum Viable ✅ Can Start with Pilot

- Leadership aware of need for organizational change
- At least one domain boundary identified
- One team willing to own a domain end-to-end
- Basic platform capabilities exist or can be bootstrapped

**Action:** Start with a pilot domain to prove the model

### Level 2: Transformation in Progress ✅ Can Scale Gradually

- Domain discovery underway or partially complete
- Some teams reorganized around domains
- Platform team forming or established
- Leadership actively supporting transformation

**Action:** Modernize domains as teams are formed (don't wait for all teams)

### Level 3: Foundation Established ✅ Can Scale Broadly

- Most domains identified and validated
- Stream-aligned teams established for key domains
- Platform capabilities available as self-service
- Leadership fully aligned and funding secured

**Action:** Execute modernization across multiple domains in parallel

### Level 0: Not Ready ⚠️ Build Foundation First

- No domain discovery done
- Teams organized by technical layers or projects
- No platform team
- No leadership support

**Action:** Focus on foundation (see [What to Do](#what-to-do-based-on-your-readiness))

---

## Three Key Prerequisites

### 1. Domain Discovery

**What you need:**
- Bounded contexts identified (via event storming, context mapping)
- Domain boundaries validated with business stakeholders
- Clear data ownership (which domain owns which entities)

**If you don't have this:**
- Conduct domain discovery workshops
- Start with one domain, expand incrementally
- Engage domain experts and business stakeholders

**Timeline:** Varies by size. Can be done incrementally.

---

### 2. Team Reorganization

**What you need:**
- Stream-aligned teams formed around domains (one team per domain)
- Platform team providing self-service capabilities
- Enabling teams available for coaching
- Team interaction modes defined (X-as-a-Service, collaboration, facilitating)

**If you don't have this:**
- Engage leadership to sponsor transformation
- Run Team Topologies workshops
- Start with one team, expand incrementally
- Establish platform team first

**Timeline:** Ongoing transformation. Start modernization as initial teams are formed.

---

### 3. Leadership Support

**What you need:**
- Executive sponsorship for transformation
- Budget for long-lived teams (not just projects)
- Success measured by flow and outcomes
- Patience for incremental progress

**If you don't have this:**
- Build business case (show cost of current state)
- Propose pilot to prove the model
- Show examples of successful transformations
- Engage external consultants if needed

**Timeline:** Varies. Start with pilot to build credibility.

---

## What to Do Based on Your Readiness

### At Level 1: Start with Pilot

1. Choose one domain with clear boundaries and business value
2. Form one stream-aligned team
3. Modernize that domain end-to-end
4. Use success to build case for broader transformation
5. Expand incrementally

**Parallel work:** Continue domain discovery, build platform capabilities, secure leadership support

---

### At Level 2: Scale Gradually

1. Modernize domains as teams are formed (don't wait)
2. Let early teams establish patterns
3. Use enabling teams to spread knowledge
4. Build platform capabilities based on real needs
5. Adjust domain boundaries based on learnings

**Parallel work:** Complete domain discovery, continue team reorganization, strengthen platform

---

### At Level 3: Execute Broadly

1. Modernize multiple domains in parallel
2. Leverage established platform capabilities
3. Apply proven patterns across teams
4. Focus on coordination and consistency
5. Optimize for speed and efficiency

**Parallel work:** Refine boundaries, mature platform, measure and improve flow metrics

---

### At Level 0: Build Foundation

**Focus on:**
- Improving observability of current systems
- Documenting current architecture and dependencies
- Reducing critical technical debt and security risks
- Building initial platform capabilities (CI/CD, monitoring)
- Conducting domain discovery workshops
- Building leadership awareness and support

**Then:** Return to this playbook when you reach Level 1

---

## Readiness Checklist

Quick self-assessment:

### Domain Discovery
- [ ] Bounded contexts identified and documented
- [ ] Context maps created showing domain relationships
- [ ] Domain events and aggregates defined
- [ ] Data ownership mapped to domains
- [ ] Business stakeholders validated domain boundaries

### Team Structure
- [ ] Stream-aligned teams formed around domains
- [ ] Platform team(s) established with clear capabilities
- [ ] Enabling teams available for coaching
- [ ] Team interaction modes defined
- [ ] Teams have end-to-end ownership (build, run, support)

### Organizational Support
- [ ] Executive sponsorship secured
- [ ] Budget allocated for long-lived teams
- [ ] Success metrics defined and agreed
- [ ] Communication plan in place
- [ ] Patience for incremental approach

### Technical Foundation
- [ ] Platform capabilities available or planned (CI/CD, observability)
- [ ] Contract standards chosen (OpenAPI, AsyncAPI)
- [ ] Observability stack available (logs, metrics, traces)

### Cultural Readiness
- [ ] Teams understand long-term ownership
- [ ] On-call expectations set and accepted
- [ ] Blameless postmortem culture exists
- [ ] Experimentation and learning encouraged

---

## Common Failure Scenarios

Learn from these common mistakes:

### Failure 1: Modernization Without Domain Discovery

**What happens:**
- Teams split monolith based on technical layers or gut feel
- Create services without clear boundaries
- Discover "Customer" means different things in different contexts
- End up with overlapping responsibilities

**Result:** Services that duplicate logic, constant debates about ownership, need to refactor after building

**Prevention:** Conduct domain discovery first, validate boundaries with business stakeholders

---

### Failure 2: Modernization Without Team Reorganization

**What happens:**
- Keep layer-based teams (UI team, API team, database team)
- Build microservices but require all teams to coordinate for every feature
- Create shared services that become bottlenecks

**Result:** Distributed monolith - services exist but can't deploy independently, slower than before

**Prevention:** Reorganize teams around domains before building services

---

### Failure 3: Modernization Without Leadership Support

**What happens:**
- Try to modernize "under the radar"
- Can't get budget for platform capabilities
- Can't reorganize teams
- New services bolted onto old structure

**Result:** Modernization stalls, new services become legacy, engineers leave, initiative cancelled

**Prevention:** Secure executive sponsorship, build business case, start with pilot

---

### Failure 4: Conway's Law and the Distributed Monolith

**"Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations." - Melvin Conway, 1967**

**What happens:**
- Organization adopts microservices but keeps feature teams (not domain teams)
- Teams organized by project/feature, not by domain ownership
- Multiple teams modify the same services
- Every feature requires coordination across 4-5 teams
- Services must deploy together in "release trains"

**The Conway's Law effect:**
- Unclear team boundaries → Unclear service boundaries
- Cross-team coordination → Cross-service coupling
- No ownership → No accountability
- Feature-based thinking → Tightly coupled services

**Result:** Distributed monolith - all the complexity of microservices, none of the benefits:
- Lead time increases (not decreases)
- More incidents, longer MTTR
- Higher coordination overhead
- Developer frustration and turnover
- Infrastructure costs increase without business value

**Example scenario:**

Company builds microservices (order-service, payment-service, inventory-service, etc.) but organizes teams by feature:
- "Checkout Team" modifies order-service, payment-service, inventory-service
- "Loyalty Team" modifies order-service, loyalty-service, notification-service
- Every feature touches multiple services
- Every service is touched by multiple teams
- Release trains required to coordinate deployments
- 4-hour coordination meetings weekly
- Security issues from uncoordinated changes
- 40% engineer turnover

After 3 years: Lead time 67% worse, incidents 400% higher, costs 140% higher than the original monolith.

**Prevention:**
1. **Organize teams by domain first** - One team per bounded context
2. **Define clear boundaries** - Domain discovery before building services
3. **Assign ownership** - Each team owns their domain end-to-end
4. **Enforce boundaries** - Teams integrate via contracts (APIs/events), not code changes
5. **Measure independently** - Teams should deploy without coordination

**Red flags you're doing this wrong:**
- [ ] Teams organized by feature/project, not domain
- [ ] Multiple teams modify the same service
- [ ] Services must deploy together ("release trains")
- [ ] "Integration sprints" required
- [ ] No clear owner when a service breaks
- [ ] 4+ hour coordination meetings
- [ ] High engineer turnover

**If you see 3+ of these, STOP. Fix the organization first, then modernize the architecture.**

**Key takeaway:** Your architecture will mirror your organization structure whether you want it to or not. The only way to build decoupled microservices is to first build decoupled teams with clear domain ownership.

**Learn more:** 
- [team-topologies.md](team-topologies) - How to organize teams correctly
- [domain-ownership-guide.md](../principles/domain-ownership-guide) - How to define boundaries

---

## Next Steps

### If Prerequisites Are Met

Proceed to:
1. [vision.md](vision) - Understand the target state
2. [target-architecture.md](target-architecture) - See the goal architecture
3. [principles.md](../principles) - Learn the guiding principles

### If Prerequisites Are Not Met

1. Engage leadership to sponsor organizational transformation
2. Conduct domain discovery workshops
3. Form initial stream-aligned and platform teams
4. Return to this playbook when foundation is established

---

## Key Takeaways

1. **Organizational transformation is mandatory** - Technical modernization alone creates distributed monoliths
2. **Domain boundaries come first** - Establish before building services
3. **One team, one domain** - Teams integrate via contracts, not code changes
4. **Start small, scale gradually** - Pilot with one domain, expand incrementally
5. **Leadership support is critical** - Secure sponsorship and budget
6. **Don't wait for perfection** - Start at Level 1, improve as you go

**Remember:** Modernization is a journey. Get the teams right, and the architecture will follow.
