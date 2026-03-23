// Set test environment variables before anything else
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-unit-tests';
process.env.STRIPE_SECRET_KEY = 'sk_test_placeholder';
