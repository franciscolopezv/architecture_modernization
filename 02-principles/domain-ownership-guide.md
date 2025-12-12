# Domain Ownership Guide

This guide explains how to implement the "Domain First" principle - aligning services to business domains rather than technical layers.

## Core Principle

**Services represent business capabilities, not technical functions.**

This ensures:
- Clear ownership and accountability
- Services can evolve independently
- Business logic is cohesive and localized
- Teams align to business value streams

---

## What is a Domain?

A **domain** is a sphere of knowledge or activity - a business capability that has:
- Clear business purpose
- Specific business rules and invariants
- Natural boundaries with other capabilities
- Identifiable stakeholders and experts

### Examples of Domains

**Good domains (business capabilities):**
- **Payments** - Processing and tracking financial transactions
- **Customer Identity** - Managing customer profiles and authentication
- **Orders** - Order lifecycle from creation to fulfillment
- **Inventory** - Stock management and availability
- **Pricing** - Product pricing rules and calculations
- **Notifications** - Multi-channel customer communications

**Bad domains (technical layers):**
- ❌ **API Layer** - Not a business capability
- ❌ **Database Service** - Technical concern, not business domain
- ❌ **Integration Hub** - Technical plumbing, not domain logic
- ❌ **Middleware** - Infrastructure, not business capability

---

## Domain-Driven Design Concepts

### Bounded Context

A **bounded context** is an explicit boundary within which a domain model is defined and applicable.

**Example: "Customer" means different things in different contexts:**

```
┌─────────────────────┐
│  Sales Context      │
│  Customer =         │
│  - Lead status      │
│  - Sales rep        │
│  - Pipeline stage   │
└─────────────────────┘

┌─────────────────────┐
│  Billing Context    │
│  Customer =         │
│  - Payment method   │
│  - Billing address  │
│  - Credit limit     │
└─────────────────────┘

┌─────────────────────┐
│  Support Context    │
│  Customer =         │
│  - Ticket history   │
│  - Support tier     │
│  - Contact prefs    │
└─────────────────────┘
```

**Key insight**: Don't try to create one "Customer" model for everything. Each context has its own model.

### Ubiquitous Language

The language used by domain experts should be reflected in the code.

**Example - Payment Domain:**

**Domain expert says:**
> "When a customer initiates a payment, we authorize the amount, then capture it once the order ships. If the order is cancelled, we void the authorization."

**Code should reflect this:**
```javascript
class Payment {
  authorize(amount) { ... }
  capture() { ... }
  void() { ... }
}

// NOT:
class Payment {
  process() { ... }  // Too generic
  execute() { ... }  // Not domain language
}
```

### Aggregates

An **aggregate** is a cluster of domain objects treated as a single unit for data changes.

**Example - Order Aggregate:**
```
Order (aggregate root)
├── OrderId
├── CustomerId
├── Status
├── OrderLines []
│   ├── ProductId
│   ├── Quantity
│   └── Price
└── ShippingAddress
```

**Rules:**
- External references only to the aggregate root (Order)
- Changes to OrderLines go through Order
- Order enforces invariants (e.g., "can't add line to cancelled order")

---

## Identifying Domain Boundaries

### Technique 1: Event Storming

**Process:**
1. Gather domain experts and developers
2. Identify domain events (facts that happened)
3. Identify commands (actions that trigger events)
4. Identify aggregates (entities that handle commands)
5. Group related events/commands into bounded contexts

**Example - E-commerce Event Storm:**

```
Commands → Events → Aggregates

PlaceOrder → OrderPlaced → Order
AddLineItem → LineItemAdded → Order
CancelOrder → OrderCancelled → Order

ProcessPayment → PaymentProcessed → Payment
RefundPayment → PaymentRefunded → Payment

ShipOrder → OrderShipped → Shipment
TrackShipment → ShipmentTracked → Shipment

UpdateInventory → InventoryUpdated → InventoryItem
ReserveStock → StockReserved → InventoryItem
```

**Boundaries emerge:**
- **Order Management** (Order aggregate)
- **Payment Processing** (Payment aggregate)
- **Fulfillment** (Shipment aggregate)
- **Inventory** (InventoryItem aggregate)

### Technique 2: Context Mapping

Map relationships between bounded contexts:

```
┌─────────────┐
│   Orders    │
│             │
└──────┬──────┘
       │ Customer/Supplier
       │ (Orders calls Payments)
       ▼
┌─────────────┐
│  Payments   │
│             │
└──────┬──────┘
       │ Published Language
       │ (Publishes events)
       ▼
┌─────────────┐
│ Fulfillment │
│             │
└─────────────┘
```

**Relationship types:**
- **Customer/Supplier**: Downstream depends on upstream API
- **Conformist**: Downstream conforms to upstream model
- **Anti-Corruption Layer**: Downstream translates upstream model
- **Published Language**: Shared contract (events, APIs)
- **Shared Kernel**: Shared code (use sparingly)

### Technique 3: Business Capability Mapping

Map organizational capabilities:

```
E-Commerce Business Capabilities:
├── Customer Management
│   ├── Registration
│   ├── Profile Management
│   └── Authentication
├── Product Catalog
│   ├── Product Information
│   ├── Search & Browse
│   └── Recommendations
├── Order Management
│   ├── Shopping Cart
│   ├── Checkout
│   └── Order Tracking
├── Payment Processing
│   ├── Payment Methods
│   ├── Authorization
│   └── Settlement
├── Fulfillment
│   ├── Inventory
│   ├── Shipping
│   └── Returns
└── Customer Service
    ├── Support Tickets
    ├── Live Chat
    └── Knowledge Base
```

Each capability is a candidate domain.

---

## Validating Domain Boundaries

### Test 1: Single Responsibility

**Ask:** Does this domain have one clear business purpose?

```
✅ Payment Domain
Purpose: Process and track financial transactions
Clear and focused

❌ CustomerPaymentOrderNotification Domain
Purpose: Everything?
Too broad, split into separate domains
```

### Test 2: Cohesion

**Ask:** Do the concepts in this domain naturally belong together?

```
✅ Order Domain includes:
- Order
- OrderLine
- ShippingAddress
These are cohesive (all part of order lifecycle)

❌ Order Domain includes:
- Order
- Customer
- Payment
- Inventory
Too many concerns, split them
```

### Test 3: Coupling

**Ask:** Can this domain change independently of others?

```
✅ Payment Domain
Can change payment processing logic without affecting Orders
Low coupling

❌ Shared "Customer" table
Changes to customer schema affect 5 services
High coupling, needs domain boundaries
```

### Test 4: Team Alignment

**Ask:** Can one team own this domain end-to-end?

```
✅ Payment Domain
One team owns:
- Payment API
- Payment processing logic
- Payment data
- Payment on-call
Clear ownership

❌ "Integration" Domain
Touches every other domain
No clear team ownership
Not a real domain
```

### Test 5: Business Language

**Ask:** Do domain experts use consistent language for this domain?

```
✅ Pricing Domain
Experts talk about: prices, discounts, promotions, rules
Consistent language

❌ "Data" Domain
No business expert talks about "data"
It's a technical concept, not a business domain
```

---

## Common Domain Patterns

### Core Domain

The **core domain** is your competitive advantage - what makes your business unique.

**Example - E-commerce:**
- Core: Personalized recommendations, dynamic pricing
- Supporting: Order management, payment processing (important but not differentiating)
- Generic: Authentication, notifications (commodity)

**Investment strategy:**
- Core: Build in-house, invest heavily, best engineers
- Supporting: Build or buy, standard patterns
- Generic: Buy or use open source

### Subdomain Types

**1. Core Subdomain**
- Competitive advantage
- Complex business rules
- High value
- Example: Fraud detection algorithm, recommendation engine

**2. Supporting Subdomain**
- Necessary but not differentiating
- Moderate complexity
- Example: Order management, inventory tracking

**3. Generic Subdomain**
- Solved problem
- Low complexity
- Example: Authentication, email sending, PDF generation

---

## Anti-Patterns

### 1. God Service

**What it looks like:**
```
CustomerService handles:
- Customer registration
- Customer authentication
- Customer preferences
- Customer orders
- Customer payments
- Customer support tickets
- Customer notifications
→ 200+ endpoints, 50+ database tables
```

**Why it's bad:**
- One team can't understand it all (cognitive overload)
- Changes are risky (everything is coupled)
- Can't deploy independently
- Becomes a bottleneck

**Fix:**
Split into proper domains:
- Identity Service (authentication)
- Profile Service (preferences)
- Order Service (orders)
- Payment Service (payments)
- Support Service (tickets)
- Notification Service (notifications)

### 2. Anemic Domain Model

**What it looks like:**
```javascript
// Just data, no behavior
class Order {
  constructor(id, customerId, items, status) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.status = status;
  }
}

// Business logic in separate "service"
class OrderService {
  cancelOrder(order) {
    if (order.status === 'SHIPPED') {
      throw new Error('Cannot cancel shipped order');
    }
    order.status = 'CANCELLED';
    this.orderRepo.save(order);
  }
}
```

**Why it's bad:**
- Business rules scattered across services
- Easy to bypass invariants
- Not object-oriented, just procedural with objects

**Fix:**
```javascript
// Rich domain model
class Order {
  constructor(id, customerId, items, status) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.status = status;
  }
  
  cancel() {
    if (this.status === 'SHIPPED') {
      throw new Error('Cannot cancel shipped order');
    }
    this.status = 'CANCELLED';
    // Emit domain event
    this.addEvent(new OrderCancelled(this.id));
  }
  
  addItem(productId, quantity, price) {
    if (this.status !== 'DRAFT') {
      throw new Error('Cannot modify non-draft order');
    }
    this.items.push(new OrderLine(productId, quantity, price));
  }
}

// Application service just coordinates
class OrderApplicationService {
  async cancelOrder(orderId) {
    const order = await this.orderRepo.findById(orderId);
    order.cancel();  // Business logic in domain
    await this.orderRepo.save(order);
  }
}
```

### 3. Shared Database as Integration

**What it looks like:**
```
OrderService writes to orders table
PaymentService reads from orders table
FulfillmentService reads from orders table
→ Tight coupling through database
```

**Why it's bad:**
- Schema changes break multiple services
- No clear ownership
- Can't deploy independently
- Business rules leak across services

**Fix:**
- OrderService owns orders table
- Other services call OrderService API or subscribe to OrderEvents
- See `data-ownership-guide.md` for patterns

### 4. Technical Domains

**What it looks like:**
```
Domains organized by technology:
- API Gateway Domain
- Database Domain
- Message Queue Domain
- Cache Domain
```

**Why it's bad:**
- Not aligned to business capabilities
- No clear business ownership
- Doesn't match how business thinks

**Fix:**
Organize by business capability:
- Payment Domain
- Order Domain
- Customer Domain
Each domain uses APIs, databases, queues as needed

---

## Domain Ownership in Practice

### One Team, One Domain

**Recommended structure:**
```
Payment Team owns Payment Domain:
├── Payment API (REST/gRPC)
├── Payment Events (AsyncAPI)
├── Payment Service (business logic)
├── Payment Database (owned schema)
├── Payment Tests
├── Payment Documentation
├── Payment On-call
└── Payment Roadmap
```

**Team responsibilities:**
- Design and implement payment features
- Define and maintain payment contracts (APIs/events)
- Own payment data model
- Monitor payment SLOs
- Respond to payment incidents
- Evolve payment domain

### Cross-Domain Collaboration

**Scenario:** Order needs to process payment

**Wrong approach:**
```
OrderService directly writes to payment_db
→ Tight coupling, no encapsulation
```

**Right approach:**
```
OrderService calls PaymentService API
OR
OrderService publishes OrderPlaced event
PaymentService subscribes and processes payment
→ Loose coupling, clear boundaries
```

**Interaction modes (Team Topologies):**
- **X-as-a-Service** (default): Payment team provides API with SLA
- **Collaboration** (time-boxed): Teams pair to design new integration
- **Facilitating**: Enabling team helps Order team integrate with Payment

---

## Migration Strategy

### From Monolith to Domains

**Phase 1: Identify domains**
- Event storming workshops
- Business capability mapping
- Validate with domain experts

**Phase 2: Establish boundaries**
- Create context maps
- Define APIs and events
- Document ubiquitous language

**Phase 3: Extract domains incrementally**
- Start with one domain (lowest risk)
- Use strangler pattern
- Keep monolith as fallback

**Phase 4: Align teams**
- Assign one team per domain
- Establish ownership and on-call
- Define interaction modes

**Phase 5: Iterate**
- Refine boundaries based on learnings
- Extract next domain
- Decommission monolith pieces

**Timeline:** 12-36 months depending on monolith size

---

## Validation Checklist

For each domain, validate:

- [ ] Has clear business purpose (not technical)
- [ ] Domain experts exist and use consistent language
- [ ] Bounded context is explicit and documented
- [ ] One team owns the domain end-to-end
- [ ] Domain can evolve independently
- [ ] Business rules are cohesive and localized
- [ ] Interfaces (APIs/events) are well-defined
- [ ] Context map shows relationships with other domains
- [ ] Aggregates and entities identified
- [ ] Domain events documented

---

## Tools and Techniques

### Event Storming
- **Tool**: Miro, Mural, or physical sticky notes
- **Participants**: Domain experts, developers, product owners
- **Duration**: 4-8 hours
- **Output**: Domain events, commands, aggregates, bounded contexts

### Context Mapping
- **Tool**: Draw.io, Lucidchart, or whiteboard
- **Output**: Visual map of domain relationships

### Domain Model Canvas
- **Sections**: Name, Description, Ubiquitous Language, Aggregates, Events, Boundaries
- **Output**: One-page domain summary

### C4 Model
- **Levels**: Context, Container, Component, Code
- **Output**: Architecture diagrams at different zoom levels

---

## Next Steps

1. Conduct event storming workshop to identify domains
2. Create context maps showing domain relationships
3. Validate domains using the checklist above
4. Align teams to domains (see `01-strategy/team-topologies.md`)
5. Define contracts between domains (see `contract-first-guide.md`)
6. Implement data ownership patterns (see `data-ownership-guide.md`)
7. Use strangler pattern to extract domains (see `05-templates/strangler-plan-template.md`)

---

## Further Reading

- **Domain-Driven Design: Tackling Complexity in the Heart of Software** by Eric Evans  
  [https://www.domainlanguage.com/ddd/](https://www.domainlanguage.com/ddd/)  
  The original book that introduced DDD concepts

- **Implementing Domain-Driven Design** by Vaughn Vernon  
  [https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/)  
  Practical guide with concrete implementation patterns

- **Domain-Driven Design Distilled** by Vaughn Vernon  
  [https://www.oreilly.com/library/view/domain-driven-design-distilled/9780134434964/](https://www.oreilly.com/library/view/domain-driven-design-distilled/9780134434964/)  
  Quick overview and introduction to DDD (good starting point)

- **Team Topologies: Organizing Business and Technology Teams for Fast Flow** by Matthew Skelton and Manuel Pais  
  [https://teamtopologies.com/book](https://teamtopologies.com/book)  
  Essential for aligning teams to domains

- **Introducing EventStorming** by Alberto Brandolini  
  [https://leanpub.com/introducing_eventstorming](https://leanpub.com/introducing_eventstorming)  
  Workshop technique for discovering domains

- **Learning Domain-Driven Design** by Vlad Khononov  
  [https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/](https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/)  
  Modern take on DDD with practical examples
