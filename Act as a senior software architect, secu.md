Act as a senior software architect, security auditor, and e-commerce payment systems expert.

Perform a complete audit of my entire codebase and verify that all e-commerce, payment, security, and production requirements are implemented correctly.

Analyze the frontend, backend, database schema, APIs, payment integration, authentication, deployment configuration, and business logic.

Create a detailed report with the following sections:

1. PAYMENT INTEGRATION AUDIT
- Verify payment gateway integration is implemented correctly.
- Check if payment verification happens on the backend.
- Check webhook implementation.
- Check webhook signature validation.
- Check duplicate payment protection.
- Check payment failure handling.
- Check payment timeout handling.
- Check refund support.
- Check payment status tracking.
- Check transaction logging.
- Check idempotency protection.

4. SECURITY AUDIT
- HTTPS enforcement.
- Authentication and authorization.
- JWT/session security.
- Password security.
- SQL injection protection.
- XSS protection.
- CSRF protection.
- Rate limiting.
- Input validation.
- Secrets management.
- Environment variables.
- Sensitive data exposure.
- API security.



6. CART & CHECKOUT AUDIT
- Verify cart validation.
- Product availability checks.
- Price verification before payment.
- Coupon validation.
- Tax calculation.
- Shipping calculation.
- Duplicate order prevention.

7. USER EXPERIENCE AUDIT
- Loading states.
- Error handling.
- Payment success page.
- Payment failure page.
- Order confirmation page.
- Email notifications.
- Mobile responsiveness.



9. PERFORMANCE AUDIT
- Slow database queries.
- API bottlenecks.
- N+1 query issues.
- Caching opportunities.
- Scalability concerns.



10. PRODUCTION READINESS AUDIT
- Logging.
- Monitoring.
- Error tracking.
- CI/CD.
- Environment configuration.
- Deployment security.
- Backup and recovery.

For every issue found:
- Show file path.
- Show exact code causing the issue.
- Explain the risk.
- Assign severity:
  - Critical
  - High
  - Medium
  - Low
- Provide production-ready code fixes.

Finally provide:
1. Security Score (/100)
2. Payment Reliability Score (/100)
3. Production Readiness Score (/100)
4. Scalability Score (/100)
5. Missing Features Checklist
6. Critical Fixes Required Before Launch
7. Launch Recommendation:
   - Safe to Launch
   - Launch After Minor Fixes
   - Not Ready for Production

Do not assume anything. Inspect the actual codebase and configuration files before making conclusions.
