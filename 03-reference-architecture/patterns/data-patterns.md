---
title: Data Patterns
sidebar_position: 5
---

# Data Patterns

Patterns for the Data & Read Models Layer - storing operational data and providing optimized read models.

---

## Single Writer

**Pattern:** One service owns writes to a database.

**When to use:**
- All domain databases
- Preventing data corruption
- Clear ownership

**Implementation:**
- Prevents conflicting updates from multiple services
- Clear ownership and accountability
- Other services read via APIs or events
- Database credentials only available to owning service

**Benefits:**
- No conflicting writes
- Clear ownership
- Easier to reason about data

**Trade-offs:**
- Other services depend on owner's API
- Can create bottlenecks
- Need events or APIs for data sharing

---

## CQRS

**Pattern:** Separate read and write models when patterns diverge.

**When to use:**
- Complex queries don't match write model
- High read/write ratio
- Different scaling needs

**Implementation:**
- Write model optimized for commands (normalized)
- Read model optimized for queries (denormalized)
- Sync via events or CDC (Change Data Capture)
- Eventual consistency is acceptable

**Example:**
```
Write Model (Orders Service):
- orders table (normalized)
- order_items table
- Optimized for transactional writes

Read Model (Order History):
- order_history table (denormalized)
- Includes customer name, product names, etc.
- Optimized for queries and reporting
```

**Benefits:**
- Optimized for different access patterns
- Independent scaling
- Better query performance

**Trade-offs:**
- Eventual consistency
- More complexity
- Need to keep models in sync

---

## Event-Driven Projections

**Pattern:** Build read models by consuming events.

**When to use:**
- Implementing CQRS
- Building analytics dashboards
- Cross-domain reporting

**Implementation:**
- Subscribe to relevant domain events
- Update projection in event handler
- Eventual consistency is acceptable
- Can rebuild from event history

**Example:**
```javascript
// Listen to events and build projection
eventBus.subscribe('OrderPlaced', async (event) => {
  await db.orderHistory.insert({
    orderId: event.payload.orderId,
    customerId: event.payload.customerId,
    customerName: event.payload.customerName,
    totalAmount: event.payload.totalAmount,
    placedAt: event.timestamp
  });
});

eventBus.subscribe('OrderShipped', async (event) => {
  await db.orderHistory.update({
    orderId: event.payload.orderId,
    status: 'SHIPPED',
    shippedAt: event.timestamp
  });
});
```

**Benefits:**
- Loose coupling
- Can rebuild from events
- Multiple projections from same events

**Trade-offs:**
- Eventual consistency
- Need to handle out-of-order events
- More moving parts

---

## Soft Deletes

**Pattern:** Mark as deleted, don't physically delete.

**When to use:**
- Audit requirements
- Regulatory compliance
- Preventing accidental data loss

**Implementation:**
- Preserves audit trail
- Enables recovery from mistakes
- Filter deleted records in queries
- Add `deleted_at` timestamp column

**Example:**
```sql
-- Soft delete
UPDATE users SET deleted_at = NOW() WHERE id = 123;

-- Query active users
SELECT * FROM users WHERE deleted_at IS NULL;

-- Include deleted (admin view)
SELECT * FROM users;
```

**Benefits:**
- Can recover from mistakes
- Maintains audit trail
- Regulatory compliance

**Trade-offs:**
- Database grows larger
- Need to filter in all queries
- Eventually need hard delete process

---

## Data Quality Checks

**Pattern:** Validate data at boundaries.

**When to use:**
- All data writes
- Event publishing
- Data migrations

**Implementation:**
- Check constraints on write (NOT NULL, foreign keys, check constraints)
- Validate event payloads against schema
- Monitor data quality metrics
- Automated data quality tests

**Validation layers:**
1. **Database constraints:** NOT NULL, UNIQUE, CHECK, foreign keys
2. **Application validation:** Business rules, format checks
3. **Schema validation:** OpenAPI, AsyncAPI, JSON Schema
4. **Data quality monitoring:** Completeness, accuracy, consistency

**Benefits:**
- Catch errors early
- Prevent data corruption
- Better data reliability

**Trade-offs:**
- Can slow down writes
- Need to maintain validation rules
- Can be overly restrictive

---

## Related Patterns

- [Domain Service Patterns](domain-service-patterns) - Outbox pattern
- [Event Patterns](event-patterns) - Event-driven projections
- [Resilience Patterns](resilience-patterns) - Handling failures

**See also:**
- [Target Architecture - Data Layer](../target-architecture#5-data--read-models-layer)
- [Data Ownership Guide](../../principles/data-ownership-guide)
