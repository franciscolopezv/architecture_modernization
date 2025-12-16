# Server-Side Architecture Playbook

Patterns, processes, and principles for designing and evolving server-side architecture - whether you're building new systems, modernizing legacy, or fixing a distributed monolith.

**Core topics:** Domain-driven design • Contract-first APIs • Event-driven architecture • Data ownership • Observability • Team organization

> **Technology-agnostic guidance** based on real-world experience. Not a silver bullet, but a reference to guide your journey. [Read more about this playbook →](ABOUT)

---

## 🚀 Start Here

### Pick Your Situation

**🌱 Building a Greenfield Service**  
Starting fresh? Begin with [vision.md](01-strategy/vision.md) → [principles](02-principles/principles.md) → [target-architecture.md](reference-architecture/target-architecture). Apply good patterns from day one: clear boundaries, contract-first APIs, owned data stores.

**🔧 Modernizing One Slice of a Monolith**  
Extracting a domain? Start with [domain-ownership-guide.md](02-principles/domain-ownership-guide.md) to identify bounded contexts, then use the strangler pattern. One domain at a time. [See prerequisites if you have 4+ teams →](01-strategy/prerequisites.md)

**🚨 Fixing a Distributed Monolith**  
Too many dependencies? Fix the organization first: [team-topologies.md](01-strategy/team-topologies.md) → [prerequisites.md](01-strategy/prerequisites.md) (see "Conway's Law" section). Then realign services to match domain boundaries.

---

## 📚 What's Inside

- `01-strategy/` vision, prerequisites, team topologies, target architecture, maturity model
- `02-principles/` domain ownership, data ownership, contract-first guidance
- `03-process/` (in progress) modernization process
- `04-patterns/` (in progress) reusable blueprints
- `05-templates/` (in progress) templates (ADR, strangler plan, inventory)
- `06-checklists/` (in progress) review and go-live checklists
- `07-examples/` (in progress) sanitized case studies

Full structure: [STRUCTURE.md](STRUCTURE)

---

## 🎯 Who This Is For

**Small teams (1-2 teams):** Default to a **Modular Monolith**. Microservices introduce distributed systems overhead (operability, debugging, deployments, schema governance). If you don't need independent deployment across multiple teams, a modular monolith delivers faster value with less risk. **The principles still apply** - domain boundaries, contract-first thinking, data ownership, observability, and incremental modernization are architecture principles, not microservices-only rules.

**Growing teams (3-5 teams):** Consider microservices when you have clear domain boundaries and need independent deployment. Start with the most critical domains. Use this playbook to avoid common pitfalls.

**Medium/large orgs (6+ teams):** Full playbook applies. Start with [prerequisites.md](01-strategy/prerequisites.md) to ensure organizational alignment. Without it, you risk creating a distributed monolith.

**Use this if you:**
- Want to build new systems with good architecture from the start (monolith or microservices)
- Need to modernize legacy systems incrementally
- Have microservices but too many cross-team dependencies
- Want faster deployments with fewer incidents

[How to use this in your organization →](USAGE)

---

## 📖 Documentation Site

View the full documentation at: **https://franciscolopezv.github.io/architecture_modernization/**

---

## 🤝 Contributing

Improvements welcome via pull requests. Use ADRs for significant changes.

---

## 📄 License

[MIT License](LICENSE)
