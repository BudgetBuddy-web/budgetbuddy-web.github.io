# Security Policy

## 🔒 Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🐛 Reporting a Vulnerability

We take the security of BudgetBuddy seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please DO NOT:
- Open a public GitHub issue
- Discuss the vulnerability in public forums
- Exploit the vulnerability for malicious purposes

### Please DO:
1. **Report privately** via GitHub Security Advisory:
   - Go to the Security tab
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Email directly** (if GitHub Security is unavailable):
   - Email: security@budgetbuddy.example.com
   - Subject: [SECURITY] Brief description
   - Include detailed information about the vulnerability

### What to Include:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Any potential solutions you've identified

## 🕐 Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

## 🎯 Vulnerability Severity

We use the following severity levels:

### Critical
- Remote code execution
- SQL injection
- Authentication bypass
- Data breach potential

### High
- XSS vulnerabilities
- CSRF vulnerabilities
- Privilege escalation
- Unauthorized data access

### Medium
- Information disclosure
- Denial of service
- Session management issues

### Low
- Minor information leakage
- Security misconfigurations

## 🏆 Recognition

We appreciate security researchers who help keep BudgetBuddy safe. With your permission, we will:
- Credit you in our security advisories
- Add you to our Hall of Fame (coming soon)
- Provide swag for significant findings (if applicable)

## 🔐 Security Best Practices

When using BudgetBuddy, we recommend:

### For Users:
- Use strong, unique passwords
- Enable 2FA when available (Google OAuth)
- Keep your software updated
- Don't share credentials
- Review account activity regularly

### For Developers:
- Keep dependencies updated
- Use environment variables for secrets
- Implement proper input validation
- Follow OWASP security guidelines
- Use HTTPS in production
- Implement rate limiting
- Sanitize user inputs
- Use prepared statements for database queries

## 📋 Known Security Considerations

### Authentication
- JWT tokens expire after 30 days
- Passwords are hashed using bcrypt (10 salt rounds)
- Google OAuth is optional

### Data Protection
- User passwords are never stored in plain text
- Database connections use secure protocols
- CORS is configured for specific origins

### API Security
- Authentication required for protected endpoints
- Rate limiting recommended for production
- Input validation on all endpoints

## 🔄 Updates

This security policy is subject to change. Please check back regularly for updates.

---

Last Updated: October 30, 2025
