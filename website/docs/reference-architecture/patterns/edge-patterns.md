---
title: Edge Patterns
sidebar_position: 1
---

# Edge Patterns

Patterns for the Edge & Access Layer - protecting backend services and providing a unified entry point.

---

## Zero-Trust Security

**Pattern:** Validate every request, never trust internal network.

**When to use:**
- All production systems
- Systems handling sensitive data
- Multi-tenant environments

**Implementation:**
- Verify JWT tokens at the gateway
- Check client certificates for partner APIs
- Log all authentication attempts
- Validate token signature and expiration
- Never bypass authentication for "internal" requests

**Benefits:**
- Prevents unauthorized access
- Reduces blast radius of security breaches
- Provides audit trail

**Trade-offs:**
- Adds latency for token validation
- Requires robust identity infrastructure
- More complex local development setup

---

## JWT Validation

**Pattern:** Verify tokens at gateway, propagate claims downstream.

**When to use:**
- OAuth2/OIDC authentication flows
- Microservices architectures
- When backend services need user context

**Implementation:**
- Validate signature and expiration at gateway
- Extract user/client claims from token
- Pass claims in headers to backend services (e.g., `X-User-ID`, `X-Client-ID`)
- Backend services trust gateway-provided headers
- Use short-lived tokens (15-60 minutes)

**Benefits:**
- Backend services don't need to validate tokens
- Centralized token validation logic
- Reduced latency in backend services

**Trade-offs:**
- Backend services must trust the gateway
- Need secure communication between gateway and backends
- Claims in headers can be large

---

## Rate Limiting

**Pattern:** Per-client quotas to prevent abuse.

**When to use:**
- Public APIs
- Partner integrations
- Preventing resource exhaustion

**Implementation:**
- Track requests per client ID (from JWT or API key)
- Return `429 Too Many Requests` when quota exceeded
- Provide quota headers in responses:
  - `X-RateLimit-Limit`: Total quota
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: When quota resets
- Use sliding window or token bucket algorithms
- Different quotas per tier (free, paid, enterprise)

**Benefits:**
- Protects backend from overload
- Fair resource allocation
- Monetization opportunity (tiered pricing)

**Trade-offs:**
- Requires distributed state (Redis, etc.)
- Can frustrate legitimate users if too strict
- Need monitoring and alerting

---

## Request Validation

**Pattern:** Reject malformed requests early.

**When to use:**
- All APIs
- Before expensive backend processing
- To provide clear error messages

**Implementation:**
- Validate against OpenAPI schema at gateway
- Check required headers and parameters
- Validate content types and payload structure
- Return clear, actionable error messages
- Use standard HTTP status codes:
  - `400 Bad Request`: Malformed request
  - `401 Unauthorized`: Missing/invalid auth
  - `403 Forbidden`: Insufficient permissions
  - `422 Unprocessable Entity`: Validation errors

**Benefits:**
- Reduces load on backend services
- Faster feedback to clients
- Prevents injection attacks

**Trade-offs:**
- Gateway needs to know API schemas
- Schema changes require gateway updates
- Can add latency for complex validation

---

## Related Patterns

- [BFF Patterns](bff-patterns) - Channel-specific aggregation
- [Resilience Patterns](resilience-patterns) - Circuit breakers and timeouts

**See also:**
- [Target Architecture - Edge Layer](../target-architecture#1-edge--access-layer)
- [Guardrails](../guardrails)
