# Data Ownership Guide

This guide explains how to implement the "Data Ownership and Locality" principle in practice.

## Core Principle

**One service writes, others read via APIs or events.**

This ensures:
- Clear ownership and accountability
- Independent deployment (no schema coordination)
- Encapsulation of business rules
- Ability to change data model without breaking consumers

---

## The Shared Database Anti-Pattern

### What It Looks Like

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Payment    │     │   Order     │     │  Customer   │
│  Service    │     │  Service    │     │  Service    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Shared    │
                    │   Database  │
                    └─────────────┘
```

### Why It's Bad

1. **Tight coupling**: Schema changes require coordinating all services
2. **No encapsulation**: Business rules leak into multiple services
3. **Deployment dependency**: Can't deploy services independently
4. **Unclear ownership**: Who owns the `customer` table?
5. **Performance issues**: One service's query can slow down others
6. **Security risk**: Every service needs access to all data

### Real Example

```sql
-- PaymentService queries customer table directly
SELECT email FROM customers WHERE id = ?

-- OrderService also queries customer table
SELECT name, address FROM customers WHERE id = ?

-- CustomerService updates customer table
UPDATE customers SET email = ? WHERE id = ?

-- Problem: If CustomerService changes email column to email_address,
-- both PaymentService and OrderService break!
```

---

## Pattern 1: API-Based Data Sharing

### When to Use
- Synchronous access needed
- Strong consistency required
- Low latency requirements
- Simple read operations

### How It Works

```
┌─────────────┐                    ┌─────────────┐
│  Payment    │                    │  Customer   │
│  Service    │─────GET /api──────▶│  Service    │
└─────────────┘   /customers/{id}  └──────┬──────┘
                                          │
                                   ┌──────▼──────┐
                                   │  customer_db│
                                   └─────────────┘
```

### Example

**CustomerService exposes API:**
```yaml
# OpenAPI spec
/api/v1/customers/{id}:
  get:
    summary: Get customer details
    responses:
      200:
        schema:
          type: object
          properties:
            id: string
            name: string
            email: string
            status: string
```

**PaymentService calls API:**
```javascript
// PaymentService code
async function createPayment(customerId, amount) {
  // Call CustomerService API
  const customer = await customerClient.getCustomer(customerId);
  
  // Validate customer status
  if (customer.status !== 'ACTIVE') {
    throw new Error('Customer not active');
  }
  
  // Create payment with customer context
  return await paymentRepo.create({
    customerId: customer.id,
    customerEmail: customer.email, // Cache for notifications
    amount: amount
  });
}
```

### Pros
- Strong consistency
- Simple to understand
- Immediate data access

### Cons
- Synchronous coupling (if CustomerService is down, PaymentService can't create payments)
- Latency adds up across multiple calls
- Can create chatty communication

### Best Practices
- Cache frequently accessed, rarely changing data
- Use circuit breakers and timeouts
- Consider eventual consistency patterns for non-critical paths
- Define SLAs between services

---

## Pattern 2: Event-Based Data Sharing

### When to Use
- Asynchronous processing acceptable
- Eventual consistency is fine
- Need to decouple services
- Multiple consumers need same data

### How It Works

```
┌─────────────┐                    ┌─────────────┐
│  Customer   │                    │   Payment   │
│  Service    │                    │   Service   │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ Publishes                        │ Subscribes
       │ CustomerCreated                  │
       │                                  │
       └────────▶ Event Bus ◀─────────────┘
```

### Example

**CustomerService publishes event:**
```json
// AsyncAPI spec
CustomerCreated:
  payload:
    type: object
    properties:
      customerId: string
      name: string
      email: string
      status: string
      createdAt: timestamp
```

**CustomerService code:**
```javascript
async function createCustomer(data) {
  // Create customer in database
  const customer = await customerRepo.create(data);
  
  // Publish event via outbox pattern
  await outbox.publish({
    eventType: 'CustomerCreated',
    aggregateId: customer.id,
    payload: {
      customerId: customer.id,
      name: customer.name,
      email: customer.email,
      status: customer.status,
      createdAt: customer.createdAt
    }
  });
  
  return customer;
}
```

**PaymentService subscribes:**
```javascript
// PaymentService consumer
eventBus.subscribe('CustomerCreated', async (event) => {
  // Store customer snapshot for payment processing
  await customerCache.upsert({
    id: event.payload.customerId,
    name: event.payload.name,
    email: event.payload.email,
    status: event.payload.status
  });
});

// Later, when creating payment
async function createPayment(customerId, amount) {
  // Read from local cache (eventual consistency)
  const customer = await customerCache.get(customerId);
  
  if (!customer) {
    throw new Error('Customer not found');
  }
  
  return await paymentRepo.create({
    customerId: customer.id,
    customerEmail: customer.email,
    amount: amount
  });
}
```

### Pros
- Loose coupling (services can be deployed independently)
- No synchronous dependency
- Scales well (multiple consumers)
- Natural audit trail

### Cons
- Eventual consistency (data may be stale)
- More complex (need event infrastructure)
- Harder to debug
- Need to handle out-of-order events

### Best Practices
- Use outbox pattern to ensure events are published
- Include event timestamp and version
- Make events immutable (append-only)
- Handle idempotency (same event delivered twice)
- Monitor lag between event publish and consumption

---

## Pattern 3: CQRS (Command Query Responsibility Segregation)

### When to Use
- Read and write patterns are very different
- High read volume, lower write volume
- Need optimized read models for specific use cases
- Want to scale reads independently from writes

### How It Works

```
┌─────────────┐
│  Customer   │
│  Service    │
│  (Write)    │
└──────┬──────┘
       │
       │ Publishes events
       │
       ▼
┌─────────────┐         ┌─────────────┐
│ Event Store │────────▶│  Read Model │
│             │         │  (Payment   │
│             │         │   View)     │
└─────────────┘         └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │  Payment    │
                        │  Service    │
                        │  (Read)     │
                        └─────────────┘
```

### Example

**CustomerService (write side):**
```javascript
// Write model - normalized, enforces invariants
async function updateCustomerEmail(customerId, newEmail) {
  const customer = await customerRepo.findById(customerId);
  
  // Business rule validation
  if (!isValidEmail(newEmail)) {
    throw new Error('Invalid email');
  }
  
  customer.email = newEmail;
  await customerRepo.save(customer);
  
  // Publish event
  await outbox.publish({
    eventType: 'CustomerEmailChanged',
    aggregateId: customerId,
    payload: { customerId, newEmail, changedAt: new Date() }
  });
}
```

**PaymentService (read side):**
```javascript
// Read model - denormalized for payment queries
// Projection: customer_payment_view table
// Columns: customer_id, name, email, payment_count, total_amount

eventBus.subscribe('CustomerEmailChanged', async (event) => {
  // Update read model
  await db.execute(`
    UPDATE customer_payment_view 
    SET email = ? 
    WHERE customer_id = ?
  `, [event.payload.newEmail, event.payload.customerId]);
});

// Query optimized for payment use case
async function getCustomerPaymentSummary(customerId) {
  return await db.query(`
    SELECT customer_id, name, email, payment_count, total_amount
    FROM customer_payment_view
    WHERE customer_id = ?
  `, [customerId]);
}
```

### Pros
- Optimized read models for specific use cases
- Can scale reads and writes independently
- Clear separation of concerns
- Flexible querying without impacting write model

### Cons
- Increased complexity
- Eventual consistency
- Need to maintain projections
- More infrastructure (event store, projection workers)

### Best Practices
- Start simple (API or events), add CQRS only when needed
- Use for high-traffic read paths
- Monitor projection lag
- Provide fallback to source of truth if projection is stale

---

## Pattern 4: Change Data Capture (CDC)

### When to Use
- Migrating from shared database to owned databases
- Need to sync data during strangler migration
- Legacy system can't publish events
- Want to avoid dual writes

### How It Works

```
┌─────────────┐
│  Legacy     │
│  System     │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Legacy DB  │─────▶│ CDC Tool    │─────▶│  Event Bus  │
│             │      │ (Debezium)  │      │             │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                  │
                                           ┌──────▼──────┐
                                           │  Modern     │
                                           │  Service    │
                                           └─────────────┘
```

### Example

**Debezium captures changes:**
```json
// Change event from legacy customer table
{
  "op": "u",  // update
  "before": {
    "id": 123,
    "email": "old@example.com"
  },
  "after": {
    "id": 123,
    "email": "new@example.com"
  },
  "source": {
    "table": "customers",
    "ts_ms": 1638360000000
  }
}
```

**Modern service consumes CDC events:**
```javascript
cdcConsumer.subscribe('legacy.customers', async (change) => {
  if (change.op === 'c' || change.op === 'u') {
    // Create or update in modern service
    await customerRepo.upsert({
      id: change.after.id,
      email: change.after.email,
      // Map other fields
    });
  } else if (change.op === 'd') {
    // Handle delete
    await customerRepo.softDelete(change.before.id);
  }
});
```

### Pros
- No changes to legacy system
- Captures all changes automatically
- Useful for migration phases
- Can replay history

### Cons
- Requires database-level access
- Exposes database schema (not domain events)
- Need to transform DB changes to domain events
- Operational complexity

### Best Practices
- Use during migration, not as permanent solution
- Transform CDC events to domain events at the boundary
- Monitor lag and backpressure
- Have a plan to decommission CDC once migration is complete

---

## Decision Matrix

| Scenario | Recommended Pattern | Why |
|----------|-------------------|-----|
| Need customer email for payment notification | **API call** | Simple, immediate, strong consistency |
| Multiple services need customer updates | **Events** | Loose coupling, scales to many consumers |
| High-volume customer search for payments | **CQRS** | Optimized read model, independent scaling |
| Migrating from shared database | **CDC** | No legacy changes needed, temporary bridge |
| Real-time fraud check needs customer status | **API call** | Strong consistency required |
| Analytics needs customer payment history | **CQRS** | Denormalized view optimized for queries |

---

## Anti-Patterns to Avoid

### 1. Distributed Transactions (Two-Phase Commit)

**Don't do this:**
```javascript
// Trying to update two databases atomically
await db.transaction(async (tx) => {
  await customerDb.update(customerId, data);  // Different DB!
  await paymentDb.create(paymentData);        // Different DB!
});
// This doesn't work across databases/services
```

**Do this instead:**
```javascript
// Use saga pattern or eventual consistency
await customerService.updateCustomer(customerId, data);
await eventBus.publish('CustomerUpdated', { customerId, data });
// PaymentService subscribes and updates its view
```

### 2. Synchronous Chain of Calls

**Don't do this:**
```
UI → BFF → OrderService → PaymentService → CustomerService → FraudService
(Each call waits for the next, latency adds up)
```

**Do this instead:**
```
UI → BFF → OrderService (publishes OrderCreated event)
PaymentService subscribes to OrderCreated
FraudService subscribes to OrderCreated
(Parallel processing, lower latency)
```

### 3. Caching Without Invalidation Strategy

**Don't do this:**
```javascript
// Cache forever, never invalidate
const customer = cache.get(customerId) || await customerService.get(customerId);
cache.set(customerId, customer); // No TTL, no invalidation
```

**Do this instead:**
```javascript
// Cache with TTL and event-based invalidation
const customer = cache.get(customerId);
if (!customer) {
  customer = await customerService.get(customerId);
  cache.set(customerId, customer, { ttl: 300 }); // 5 min TTL
}

// Subscribe to invalidation events
eventBus.subscribe('CustomerUpdated', (event) => {
  cache.delete(event.customerId);
});
```

---

## Migration Strategy: From Shared DB to Owned DBs

### Phase 1: Identify Ownership
- Map tables to domains
- Identify primary writer for each table
- Document current read/write patterns

### Phase 2: Introduce APIs
- Primary writer exposes API for their tables
- Other services start calling APIs instead of direct DB access
- Keep DB access as fallback

### Phase 3: Introduce Events
- Primary writer publishes events for state changes
- Consumers build local caches from events
- Reduce API calls for read-heavy paths

### Phase 4: Separate Databases
- Copy tables to service-owned databases
- Use CDC or dual-write for synchronization
- Validate data consistency

### Phase 5: Cut Over
- Switch services to owned databases
- Remove shared database access
- Decommission shared database

**Timeline**: 6-18 months depending on complexity

---

## Validation Checklist

For each service, validate:

- [ ] Service owns its database (no other service writes to it)
- [ ] Cross-service data access is via APIs or events (no direct DB queries)
- [ ] APIs have OpenAPI specs with versioning
- [ ] Events have AsyncAPI specs with schemas
- [ ] Caching strategy defined with TTL and invalidation
- [ ] Consistency model documented (strong vs eventual)
- [ ] Fallback strategy for downstream failures
- [ ] Monitoring for data freshness and lag

---

## Next Steps

- Review your current architecture for shared database anti-patterns
- Identify the primary owner for each data entity
- Start with one domain and apply API or event-based sharing
- Use `05-templates/strangler-plan-template.md` to plan migration
- Document decisions in ADRs
