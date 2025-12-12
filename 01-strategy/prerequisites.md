# Prerequisites for Backend Modernization

> **Important**: This playbook is designed for organizations that are **aligning or have aligned teams to domain boundaries** using Team Topologies principles. The organizational foundation and technical modernization should progress together.

## Why Prerequisites Matter

Backend modernization is not just a technical transformation—it's an organizational one. The patterns in this playbook (domain APIs, event-driven architecture, strangler patterns) work best when:

1. Teams are organized around business domains, not technical layers
2. Each team has end-to-end ownership of their services and data
3. Teams can deploy independently with minimal coordination
4. Platform capabilities are self-service, not bottlenecks

Without this foundation, you risk creating a **distributed monolith**: microservices with all the complexity of distributed systems but none of the benefits of independent deployment and team autonomy.

## Organizational Readiness Levels

You don't need everything perfect before starting. Assess your readiness level:

### Level 1: Minimum Viable (Can Start with Pilot)
- Leadership aware of need for organizational change
- At least one domain boundary identified
- One team willing to own a domain end-to-end
- Basic platform capabilities exist or can be bootstrapped

**Action**: Start with a pilot domain to prove the model

### Level 2: Transformation in Progress (Can Scale Gradually)
- Domain discovery underway or partially complete
- Some teams reorganized around domains
- Platform team forming or established
- Leadership actively supporting transformation

**Action**: Modernize domains as teams are formed

### Level 3: Foundation Established (Can Scale Broadly)
- Most domains identified and validated
- Stream-aligned teams established for key domains
- Platform capabilities available as self-service
- Leadership fully aligned and funding secured

**Action**: Execute modernization across multiple domains in parallel

## Key Prerequisites (Flexible Approach)

### 1. Domain Discovery Completed

**What this means:**
- Business capabilities and bounded contexts have been identified
- Domain boundaries are clear and validated with business stakeholders
- Context maps show relationships between domains (upstream/downstream, anti-corruption layers, shared kernels)
- Core domain events and aggregates are defined
- Value streams are mapped to understand flow

**Deliverables you should have:**
- Domain model diagrams (bounded contexts with relationships)
- Event storming outputs or equivalent domain discovery artifacts
- List of domains with clear business ownership
- Initial data ownership mapping (which domain owns which entities)

**If you don't have this:**
- Conduct domain discovery workshops (event storming, domain storytelling)
- Engage domain experts and business stakeholders
- Use techniques from Domain-Driven Design (DDD)
- Consider hiring DDD practitioners or enabling teams to facilitate

**Timeline:** Varies by organization size and complexity. Can be done incrementally—start with one domain and expand.

---

### 2. Organizational Transformation Initiated

**What this means:**
- Teams have been reorganized around domains (stream-aligned teams)
- Platform teams exist to provide self-service capabilities
- Enabling teams are available to coach and unblock
- Team interaction modes are defined (X-as-a-Service, collaboration, facilitating)
- Leadership understands and supports long-lived product teams over project-based squads

**Deliverables you should have:**
- New organizational chart showing stream-aligned teams mapped to domains
- Platform team charter with defined capabilities and SLOs
- Team cognitive load assessments
- Communication and dependency maps
- Budget and headcount aligned to long-lived teams

**If you don't have this:**
- Engage leadership to sponsor organizational transformation
- Run Team Topologies workshops with engineering and product leadership
- Create a phased reorganization plan (don't reorganize everything at once)
- Establish platform and enabling teams first to support stream-aligned teams
- Define success metrics (flow metrics, deployment frequency, lead time)

**Timeline:** Organizational transformation is ongoing. Start modernization as soon as initial teams are formed—don't wait for perfection.

---

### 3. Leadership Alignment and Support

**What this means:**
- Executives understand that modernization requires organizational change, not just new technology
- Budget is allocated for long-lived teams, not just project funding
- Success is measured by flow and outcomes, not project completion dates
- Leaders are prepared for the "J-curve" (temporary slowdown during transition)
- There is patience for incremental progress over big-bang rewrites

**Deliverables you should have:**
- Executive sponsorship for transformation
- Approved budget for team formation and platform capabilities
- Agreed success metrics (business and technical)
- Communication plan for stakeholders
- Risk acceptance for phased, incremental approach

**If you don't have this:**
- Build business case showing cost of current state (incidents, slow delivery, tech debt)
- Show examples of successful transformations (case studies, industry benchmarks)
- Propose pilot with one domain to prove the model
- Engage external consultants or coaches if needed to build credibility

**Timeline:** Varies by organization. Can start with pilot to build credibility while securing broader support.

---

## What Happens If You Skip Prerequisites

### Scenario: Modernization Without Domain Discovery

**What teams do:**
- Start splitting the monolith into services based on technical layers or gut feel
- Create services like "CustomerService," "OrderService," "PaymentService" without clear boundaries
- Discover later that "Customer" means different things in different contexts
- End up with overlapping responsibilities and unclear ownership

**Result:**
- Services that duplicate logic
- Constant debates about "who owns this feature"
- Tight coupling through shared data models
- Need to refactor services after they're built (expensive and risky)

---

### Scenario: Modernization Without Team Reorganization

**What teams do:**
- Keep layer-based teams (UI team, API team, database team)
- Build microservices but require all three teams to coordinate for every feature
- Create shared services that become bottlenecks

**Result:**
- Distributed monolith: services exist but cannot be deployed independently
- Slower delivery than before (now have distributed system complexity without benefits)
- High coordination overhead (meetings, handoffs, waiting)
- Unclear ownership when production issues occur

---

### Scenario: Modernization Without Leadership Support

**What teams do:**
- Try to modernize "under the radar" without organizational change
- Build new services but cannot get budget for platform capabilities
- Cannot reorganize teams, so new services are bolted onto old team structure

**Result:**
- Modernization stalls due to lack of resources
- New services become legacy because no team owns them long-term
- Engineers become frustrated and leave
- Initiative is eventually cancelled as a "failed experiment"

---

## Readiness Checklist

Before proceeding with this playbook, validate:

### Domain Discovery
- [ ] Bounded contexts identified and documented
- [ ] Context maps created showing domain relationships
- [ ] Domain events and aggregates defined
- [ ] Data ownership mapped to domains
- [ ] Business stakeholders validated domain boundaries

### Team Structure
- [ ] Stream-aligned teams formed around domains (one team per bounded context)
- [ ] Platform team(s) established with clear capabilities and SLOs
- [ ] Enabling teams available for coaching and unblocking
- [ ] Team interaction modes defined
- [ ] Cognitive load assessed for each team (not overloaded)
- [ ] Teams have end-to-end ownership (build, run, support)

### Organizational Support
- [ ] Executive sponsorship secured
- [ ] Budget allocated for long-lived teams and platform
- [ ] Success metrics defined and agreed (flow metrics, SLOs, business outcomes)
- [ ] Communication plan in place
- [ ] Patience for incremental approach (no pressure for big-bang delivery)

### Technical Foundation
- [ ] Platform capabilities available or planned (CI/CD, observability, API gateway)
- [ ] Service catalog or registry planned
- [ ] Contract standards chosen (OpenAPI, AsyncAPI, gRPC)
- [ ] Observability stack available (logs, metrics, traces)

### Cultural Readiness
- [ ] Teams understand they will own services long-term (not "build and throw over the wall")
- [ ] On-call expectations set and accepted
- [ ] Blameless postmortem culture exists or is being established
- [ ] Experimentation and learning are encouraged

## Approaches Based on Readiness

### If You're at Level 1 (Minimum Viable)

**Start with a Pilot:**
1. Choose one domain with clear boundaries and business value
2. Form one stream-aligned team (or dedicate existing team)
3. Modernize that domain end-to-end using this playbook
4. Use success to build case for broader transformation
5. Expand incrementally as more teams are formed

**Parallel work:**
- Continue domain discovery for other areas
- Build platform capabilities as needed
- Secure leadership support for broader transformation

### If You're at Level 2 (Transformation in Progress)

**Scale Gradually:**
1. Modernize domains as teams are formed (don't wait for all teams)
2. Let early teams establish patterns and practices
3. Use enabling teams to spread knowledge
4. Build platform capabilities based on real needs
5. Adjust domain boundaries based on learnings

**Parallel work:**
- Complete domain discovery for remaining areas
- Continue team reorganization
- Strengthen platform capabilities
- Document and share learnings

### If You're at Level 3 (Foundation Established)

**Execute Broadly:**
1. Modernize multiple domains in parallel
2. Leverage established platform capabilities
3. Apply proven patterns across teams
4. Focus on coordination and consistency
5. Optimize for speed and efficiency

**Parallel work:**
- Refine domain boundaries as needed
- Mature platform capabilities
- Build centers of excellence
- Measure and improve flow metrics

### If Prerequisites Are Completely Missing

**Focus on Foundation First:**
- Improving observability of current systems
- Documenting current architecture and dependencies
- Reducing critical technical debt and security risks
- Building initial platform capabilities (CI/CD, monitoring)
- Conducting domain discovery workshops
- Building leadership awareness and support

**Then:** Return to this playbook when you reach Level 1 readiness

## Next Steps

If prerequisites are met, proceed to:
1. `01-strategy/vision.md` - Understand the target state
2. `02-principles/principles.md` - Learn the guiding principles
3. `03-process/modernization-process.md` - Follow the step-by-step playbook

If prerequisites are not met:
1. Engage leadership to sponsor organizational transformation
2. Conduct domain discovery workshops
3. Form initial stream-aligned and platform teams
4. Return to this playbook when foundation is established

---

**Remember**: Modernization is a journey, not a destination. The organizational foundation is more important than the technology choices. Get the teams right, and the architecture will follow.
