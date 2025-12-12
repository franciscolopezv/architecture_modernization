# Contract-First API and Event Design

This guide explains how to implement the "APIs and Events as Contracts" principle in practice.

## Core Principle

**Contracts are defined first, versioned, and treated as the interface between teams.**

This ensures:
- Clear expectations between producers and consumers
- Independent evolution of services
- Breaking changes are explicit and managed
- Documentation is always up-to-date

---

## Why Contract-First Matters

### Without Contracts (Code-First)

```
Team A builds PaymentService:
- Implements /createPayment endpoint
- Returns whatever fields seem useful
- No documentation

Team B builds OrderService:
- Reverse-engineers API by reading code or testing
- Depends on undocumented fields
- Breaks when Team A refactors

Result: Tight coupling, frequent breakage, slow delivery
```

### With Contracts (Contract-First)

```
Team A defines OpenAPI spec:
- Documents /payments endpoint
- Specifies request/response schemas
- Versions the contract (v1)

Team B reads spec:
- Understands exactly what to expect
- Can mock responses for testing
- Knows when breaking changes occur (v2)

Result: Loose coupling, independent work, safe evolution
```

---

## API Contracts with OpenAPI

### Basic Structure

```yaml
openapi: 3.0.0
info:
  title: Payment API
  version: 1.0.0
  description: Domain API for payment processing

servers:
  - url: https://api.example.com/payments/v1

paths:
  /payments:
    post:
      summary: Create a new payment
      operationId: createPayment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePaymentRequest'
      responses:
        '201':
          description: Payment created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payment'
        '400':
          description: Invalid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '409':
          description: Duplicate payment (idempotency)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payment'

  /payments/{paymentId}:
    get:
      summary: Get payment by ID
      operationId: getPayment
      parameters:
        - name: paymentId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Payment found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payment'
        '404':
          description: Payment not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  schemas:
    CreatePaymentRequest:
      type: object
      required:
        - customerId
        - amount
        - currency
      properties:
        customerId:
          type: string
          format: uuid
          description: ID of the customer making the payment
        amount:
          type: number
          format: decimal
          minimum: 0.01
          description: Payment amount
        currency:
          type: string
          enum: [USD, EUR, GBP]
          description: ISO 4217 currency code
        idempotencyKey:
          type: string
          description: Client-provided key for idempotent requests
        metadata:
          type: object
          additionalProperties: true
          description: Optional metadata

    Payment:
      type: object
      required:
        - id
        - customerId
        - amount
        - currency
        - status
        - createdAt
      properties:
        id:
          type: string
          format: uuid
        customerId:
          type: string
          format: uuid
        amount:
          type: number
          format: decimal
        currency:
          type: string
          enum: [USD, EUR, GBP]
        status:
          type: string
          enum: [PENDING, COMPLETED, FAILED, CANCELLED]
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        metadata:
          type: object
          additionalProperties: true

    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
          description: Machine-readable error code
        message:
          type: string
          description: Human-readable error message
        details:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              issue:
                type: string
```

### Best Practices

**1. Version in URL path:**
```
✅ /payments/v1/payments
✅ /payments/v2/payments
❌ /payments (no version)
```

**2. Use semantic versioning:**
- Major version (v1 → v2): Breaking changes
- Minor version (v1.1): Backward-compatible additions
- Patch version (v1.1.1): Bug fixes

**3. Make fields optional by default:**
```yaml
# Good: Can add fields without breaking consumers
properties:
  name:
    type: string
  email:
    type: string  # Optional, can be added later
  phone:
    type: string  # Optional, can be added later

# Bad: All fields required, can't add new ones
required:
  - name
  - email
  - phone
```

**4. Use enums carefully:**
```yaml
# Good: Can add new values
status:
  type: string
  enum: [PENDING, COMPLETED, FAILED]
  # Consumers should handle unknown values gracefully

# Document in description:
description: |
  Payment status. Consumers should handle unknown values.
  New statuses may be added in minor versions.
```

**5. Include examples:**
```yaml
CreatePaymentRequest:
  type: object
  example:
    customerId: "550e8400-e29b-41d4-a716-446655440000"
    amount: 99.99
    currency: "USD"
    idempotencyKey: "payment-123-retry-1"
```

---

## Event Contracts with AsyncAPI

### Basic Structure

```yaml
asyncapi: 2.6.0
info:
  title: Payment Events
  version: 1.0.0
  description: Domain events published by Payment Service

servers:
  production:
    url: kafka.example.com:9092
    protocol: kafka
    description: Production Kafka cluster

channels:
  payment.events:
    description: Payment domain events
    subscribe:
      summary: Subscribe to payment events
      message:
        oneOf:
          - $ref: '#/components/messages/PaymentCreated'
          - $ref: '#/components/messages/PaymentCompleted'
          - $ref: '#/components/messages/PaymentFailed'

components:
  messages:
    PaymentCreated:
      name: PaymentCreated
      title: Payment Created
      summary: Published when a new payment is created
      contentType: application/json
      payload:
        $ref: '#/components/schemas/PaymentCreatedPayload'
      examples:
        - payload:
            eventId: "evt_123"
            eventType: "PaymentCreated"
            eventTime: "2024-01-15T10:30:00Z"
            aggregateId: "pay_456"
            aggregateType: "Payment"
            version: 1
            data:
              paymentId: "pay_456"
              customerId: "cust_789"
              amount: 99.99
              currency: "USD"
              status: "PENDING"

    PaymentCompleted:
      name: PaymentCompleted
      title: Payment Completed
      summary: Published when a payment completes successfully
      contentType: application/json
      payload:
        $ref: '#/components/schemas/PaymentCompletedPayload'

    PaymentFailed:
      name: PaymentFailed
      title: Payment Failed
      summary: Published when a payment fails
      contentType: application/json
      payload:
        $ref: '#/components/schemas/PaymentFailedPayload'

  schemas:
    PaymentCreatedPayload:
      type: object
      required:
        - eventId
        - eventType
        - eventTime
        - aggregateId
        - aggregateType
        - version
        - data
      properties:
        eventId:
          type: string
          format: uuid
          description: Unique event identifier
        eventType:
          type: string
          const: PaymentCreated
        eventTime:
          type: string
          format: date-time
          description: When the event occurred (ISO 8601)
        aggregateId:
          type: string
          description: ID of the payment aggregate
        aggregateType:
          type: string
          const: Payment
        version:
          type: integer
          description: Event schema version
        correlationId:
          type: string
          description: Correlation ID for tracing
        causationId:
          type: string
          description: ID of the command that caused this event
        data:
          type: object
          required:
            - paymentId
            - customerId
            - amount
            - currency
            - status
          properties:
            paymentId:
              type: string
            customerId:
              type: string
            amount:
              type: number
            currency:
              type: string
            status:
              type: string
              enum: [PENDING]
            metadata:
              type: object
              additionalProperties: true

    PaymentCompletedPayload:
      type: object
      required:
        - eventId
        - eventType
        - eventTime
        - aggregateId
        - data
      properties:
        eventId:
          type: string
          format: uuid
        eventType:
          type: string
          const: PaymentCompleted
        eventTime:
          type: string
          format: date-time
        aggregateId:
          type: string
        version:
          type: integer
        data:
          type: object
          properties:
            paymentId:
              type: string
            completedAt:
              type: string
              format: date-time
            transactionId:
              type: string

    PaymentFailedPayload:
      type: object
      required:
        - eventId
        - eventType
        - eventTime
        - aggregateId
        - data
      properties:
        eventId:
          type: string
          format: uuid
        eventType:
          type: string
          const: PaymentFailed
        eventTime:
          type: string
          format: date-time
        aggregateId:
          type: string
        version:
          type: integer
        data:
          type: object
          properties:
            paymentId:
              type: string
            failedAt:
              type: string
              format: date-time
            errorCode:
              type: string
            errorMessage:
              type: string
```

### Event Design Best Practices

**1. Include event envelope:**
```json
{
  "eventId": "evt_123",           // Unique event ID
  "eventType": "PaymentCreated",  // Event type
  "eventTime": "2024-01-15T10:30:00Z",  // When it happened
  "aggregateId": "pay_456",       // What entity changed
  "aggregateType": "Payment",     // Type of entity
  "version": 1,                   // Schema version
  "correlationId": "req_789",     // For tracing
  "causationId": "cmd_012",       // What caused this
  "data": { ... }                 // Event payload
}
```

**2. Events are facts, not commands:**
```
✅ PaymentCreated (past tense, fact)
✅ PaymentCompleted
❌ CreatePayment (command, not event)
❌ CompletePayment
```

**3. Events are immutable:**
```
✅ Publish new event: PaymentCorrected
❌ Update existing event: PaymentCreated
```

**4. Include enough context:**
```json
// Good: Consumers don't need to call back
{
  "eventType": "PaymentCompleted",
  "data": {
    "paymentId": "pay_123",
    "customerId": "cust_456",  // Include for context
    "amount": 99.99,           // Include for context
    "completedAt": "2024-01-15T10:30:00Z"
  }
}

// Bad: Consumers must call API to get details
{
  "eventType": "PaymentCompleted",
  "data": {
    "paymentId": "pay_123"  // Not enough context
  }
}
```

**5. Version events explicitly:**
```json
{
  "eventType": "PaymentCreated",
  "version": 2,  // Schema version
  "data": {
    // v2 fields
  }
}
```

---

## Versioning Strategies

### What is a Breaking Change?

**Breaking changes (require major version bump):**
- Removing a field
- Renaming a field
- Changing field type (string → number)
- Making optional field required
- Removing enum value
- Changing URL path structure

**Non-breaking changes (minor version bump):**
- Adding optional field
- Adding new endpoint
- Adding enum value (if consumers handle unknown values)
- Deprecating field (but still returning it)

### Strategy 1: URL Versioning (Recommended for REST)

```
/payments/v1/payments  → Version 1
/payments/v2/payments  → Version 2 (breaking changes)

Both versions run simultaneously during migration
```

**Example migration:**
```yaml
# v1: Original API
/payments/v1/payments:
  post:
    requestBody:
      schema:
        properties:
          amount:
            type: number  # Simple number

# v2: Breaking change (structured amount)
/payments/v2/payments:
  post:
    requestBody:
      schema:
        properties:
          amount:
            type: object  # Now an object!
            properties:
              value:
                type: number
              currency:
                type: string
```

**Migration plan:**
1. Deploy v2 alongside v1
2. Migrate consumers to v2 over 6-12 months
3. Deprecate v1 with sunset date
4. Remove v1 after all consumers migrated

### Strategy 2: Event Versioning

**Option A: Version in event type**
```json
{
  "eventType": "PaymentCreated.v2",
  "data": { ... }
}
```

**Option B: Version in envelope (Recommended)**
```json
{
  "eventType": "PaymentCreated",
  "version": 2,
  "data": { ... }
}
```

**Consumer handles multiple versions:**
```javascript
eventBus.subscribe('PaymentCreated', async (event) => {
  if (event.version === 1) {
    // Handle v1 schema
    const amount = event.data.amount;
  } else if (event.version === 2) {
    // Handle v2 schema
    const amount = event.data.amount.value;
  } else {
    // Unknown version, log and skip
    logger.warn('Unknown event version', { version: event.version });
  }
});
```

### Strategy 3: Expand-Contract Pattern

For gradual migration without versioning:

**Phase 1: Expand (add new field)**
```json
// Producer sends both old and new fields
{
  "amount": 99.99,           // Old field (deprecated)
  "amountDetails": {         // New field
    "value": 99.99,
    "currency": "USD"
  }
}
```

**Phase 2: Migrate consumers**
```javascript
// Consumers update to use new field
const amount = event.amountDetails || { value: event.amount, currency: 'USD' };
```

**Phase 3: Contract (remove old field)**
```json
// Producer stops sending old field
{
  "amountDetails": {
    "value": 99.99,
    "currency": "USD"
  }
}
```

---

## Contract Testing

### Consumer-Driven Contract Testing

**Producer (PaymentService) defines contract:**
```yaml
# payment-api-contract.yaml
POST /payments:
  request:
    amount: 99.99
    currency: USD
  response:
    status: 201
    body:
      id: "pay_123"
      status: "PENDING"
```

**Consumer (OrderService) tests against contract:**
```javascript
// Using Pact or similar tool
describe('Payment API Contract', () => {
  it('should create payment', async () => {
    // Mock based on contract
    const mockProvider = new Pact.MockProvider({
      contract: 'payment-api-contract.yaml'
    });
    
    // Test consumer code
    const payment = await paymentClient.createPayment({
      amount: 99.99,
      currency: 'USD'
    });
    
    expect(payment.id).toBeDefined();
    expect(payment.status).toBe('PENDING');
  });
});
```

**Producer verifies contract:**
```javascript
// PaymentService tests
describe('Payment API Contract Verification', () => {
  it('should satisfy consumer contracts', async () => {
    // Verify actual API matches contract
    const response = await request(app)
      .post('/payments')
      .send({ amount: 99.99, currency: 'USD' });
    
    expect(response.status).toBe(201);
    expect(response.body).toMatchSchema(contractSchema);
  });
});
```

### Schema Validation

**Validate requests:**
```javascript
// Express middleware
const { validateRequest } = require('express-openapi-validator');

app.use(validateRequest({
  apiSpec: './openapi.yaml',
  validateRequests: true,
  validateResponses: true
}));

// Invalid requests automatically rejected with 400
```

**Validate events:**
```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const eventSchema = require('./asyncapi-schemas/PaymentCreated.json');
const validate = ajv.compile(eventSchema);

function publishEvent(event) {
  // Validate before publishing
  if (!validate(event)) {
    throw new Error(`Invalid event: ${ajv.errorsText(validate.errors)}`);
  }
  
  return eventBus.publish(event);
}
```

---

## Contract Governance

### 1. Store Contracts in Source Control

```
payment-service/
├── src/
├── contracts/
│   ├── openapi.yaml          # API contract
│   ├── asyncapi.yaml         # Event contract
│   └── schemas/
│       ├── Payment.json
│       └── PaymentCreated.json
└── tests/
    └── contract-tests/
```

### 2. Review Process

**Before merging contract changes:**
- [ ] Breaking changes identified and documented
- [ ] Version bumped appropriately (major vs minor)
- [ ] Migration plan created for breaking changes
- [ ] Consumers notified of upcoming changes
- [ ] Deprecation notices added to old fields
- [ ] Contract tests updated

### 3. Schema Registry

Use a schema registry (e.g., Confluent Schema Registry) for events:

```javascript
// Producer registers schema
await schemaRegistry.register('PaymentCreated', {
  type: 'JSON',
  schema: paymentCreatedSchema
});

// Consumer validates against registered schema
const schema = await schemaRegistry.getLatestSchema('PaymentCreated');
const isValid = validateEvent(event, schema);
```

### 4. API Documentation Portal

Publish contracts to a developer portal:
- OpenAPI specs → Swagger UI / Redoc
- AsyncAPI specs → AsyncAPI UI
- Include examples, authentication details, SLAs
- Keep up-to-date automatically from source control

---

## Anti-Patterns to Avoid

### 1. Code-First Without Contract

```javascript
// Bad: No contract, just code
app.post('/payments', (req, res) => {
  const payment = createPayment(req.body);
  res.json(payment);
});
// Consumers don't know what fields to send or expect
```

### 2. Breaking Changes Without Versioning

```yaml
# v1 (deployed)
properties:
  amount:
    type: number

# "v1" (updated - BREAKS CONSUMERS!)
properties:
  amount:
    type: object  # Breaking change!
```

### 3. Tight Coupling Through Shared Models

```javascript
// Bad: Sharing internal domain models
// payment-service/models/Payment.js
class Payment {
  // Internal implementation details exposed
}

// order-service imports Payment model directly
const { Payment } = require('payment-service/models');
// Now tightly coupled to internal structure
```

### 4. No Deprecation Period

```
// Bad: Remove field immediately
v1: { "amount": 99.99 }
v2: { "amountDetails": {...} }  // amount removed!

// Good: Deprecate first
v1: { "amount": 99.99 }
v1.1: { "amount": 99.99, "amountDetails": {...} }  // Both fields
      // Deprecation notice: "amount" will be removed in v2
v2: { "amountDetails": {...} }  // Remove after 6 months
```

---

## Checklist

Before deploying a new API or event:

- [ ] OpenAPI or AsyncAPI spec created and reviewed
- [ ] Version number assigned (major.minor.patch)
- [ ] Examples included in spec
- [ ] Error responses documented
- [ ] Schema validation implemented
- [ ] Contract tests written
- [ ] Breaking changes identified and migration plan created
- [ ] Consumers notified of changes
- [ ] Documentation published to developer portal
- [ ] Monitoring for contract violations in place

---

## Next Steps

- Review existing APIs and events for missing contracts
- Create OpenAPI specs for all REST APIs
- Create AsyncAPI specs for all events
- Implement schema validation
- Set up contract testing
- Establish deprecation policy (e.g., 6-month notice for breaking changes)
- Publish contracts to developer portal
