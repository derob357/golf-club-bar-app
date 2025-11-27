# Contributing to Golf Club Bar Management App

First off, thank you for considering contributing to this project! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and harassment-free experience for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples and screenshots
- Describe the behavior you observed and what you expected
- Include device and OS information

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing style
5. Write a clear commit message

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/derob357/golf-club-bar-app.git
cd golf-club-bar-app
```

2. Install dependencies
```bash
npm install
```

3. Follow setup instructions in `docs/INSTALLATION.md`

4. Configure Firebase (see `docs/FIREBASE_SETUP.md`)

5. Run the app
```bash
npm run ios  # for iOS
npm run android  # for Android
```

## Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Write self-documenting code

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:
```
Add member search by name feature

- Implement fuzzy search algorithm
- Add search input to member lookup screen
- Update FirebaseService with search query
- Add unit tests for search function

Closes #123
```

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Test on both iOS and Android devices
- Test edge cases and error scenarios

## Documentation

- Update README.md if needed
- Document new features in appropriate docs/ files
- Add JSDoc comments to functions
- Update API documentation if endpoints change

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🚀
