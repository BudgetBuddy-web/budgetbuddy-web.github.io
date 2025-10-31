# Contributing to BudgetBuddy

First off, thank you for considering contributing to BudgetBuddy! 🎉

The following is a set of guidelines for contributing to BudgetBuddy. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. By participating, you are expected to uphold this standard.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible using the bug report template.

**Good Bug Reports:**
- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples
- Describe the behavior you observed and what you expected
- Include screenshots if applicable
- Note your environment (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, use the feature request template and include:

- A clear and descriptive title
- A detailed description of the proposed functionality
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `bug` - Something isn't working
- `enhancement` - New feature or request

### Pull Requests

- Fill in the pull request template
- Follow the coding style guidelines
- Include screenshots/videos for UI changes
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass

## 🛠️ Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Git
- A code editor (VS Code recommended)

### Setup Steps

1. **Fork the Repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/budgetbuddy.git
   cd budgetbuddy
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/budgetbuddy.git
   ```

4. **Install Dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

5. **Setup Environment Variables**
   ```bash
   # Create .env files from examples
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   
   # Edit the .env files with your configuration
   ```

6. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

7. **Seed Demo Data (Optional)**
   ```bash
   cd server
   node utils/seed.js
   ```

## 📏 Coding Standards

### JavaScript/React

- Use ES6+ features
- Use functional components with hooks (no class components)
- Use descriptive variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Use PropTypes or TypeScript for type checking

**Example:**
```javascript
// Good
const calculateSavingsRate = (income, expenses) => {
  if (income <= 0) return 0;
  return ((income - expenses) / income) * 100;
};

// Bad
const calc = (a, b) => {
  return ((a - b) / a) * 100;
};
```

### File Organization

- One component per file
- Use descriptive file names (PascalCase for components)
- Group related files together
- Keep file sizes manageable (< 300 lines)

### CSS Styling

- Use CSS modules or styled-components for component styles
- Follow BEM naming convention for classes
- Use CSS variables for theming
- Ensure responsive design
- Support both light and dark themes

### Backend

- Use async/await instead of callbacks
- Handle errors properly with try/catch
- Validate input data
- Use meaningful HTTP status codes
- Add JSDoc comments for functions

**Example:**
```javascript
/**
 * Get all transactions for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.getTransactions = async (req, res) => {
  try {
    // Implementation
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
```

## 📝 Commit Guidelines

### Commit Message Format

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(dashboard): add savings progress chart
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
style(navbar): improve mobile responsiveness
refactor(api): optimize transaction queries
test(auth): add login integration tests
chore(deps): update dependencies
```

### Commit Best Practices

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep the first line under 72 characters
- Reference issues and pull requests in the footer

## 🔄 Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow the coding standards
   - Add comments where necessary
   - Update documentation

3. **Test Your Changes**
   - Run existing tests
   - Add new tests if needed
   - Test manually in the browser
   - Test on mobile devices

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Link related issues
   - Request review

7. **Address Feedback**
   - Respond to code review comments
   - Make requested changes
   - Push updates to your branch

8. **Merge**
   - Once approved, your PR will be merged
   - Delete your branch after merge

## ✅ Testing Guidelines

### Frontend Testing

- Write unit tests for utility functions
- Write component tests using React Testing Library
- Test user interactions
- Test responsive behavior

**Example:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';

test('displays user name', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
});
```

### Backend Testing

- Write unit tests for controllers
- Write integration tests for API endpoints
- Test error handling
- Test authentication/authorization

**Example:**
```javascript
describe('Transaction API', () => {
  it('should create a new transaction', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'expense', amount: 100, category: 'Food' });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Works in Chrome, Firefox, and Safari
- [ ] Dark mode works correctly
- [ ] Accessibility standards met
- [ ] Performance is acceptable

## 🎨 UI/UX Guidelines

- Follow the existing design patterns
- Maintain consistency with current UI
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test with screen readers if possible
- Use semantic HTML
- Optimize images and assets

## 🚀 Release Process

Releases are managed by the maintainers:

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create a release tag
4. Deploy to production

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Live2D Documentation](https://docs.live2d.com/)

## ❓ Questions?

- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Create a question issue

## 🙏 Thank You!

Your contributions make BudgetBuddy better for everyone. We appreciate your time and effort!

---

**Happy Coding!** 🎉
