import "@testing-library/jest-dom";

// Mock the `env` object to prevent server-side environment variable access during tests
jest.mock("@t3-oss/env-nextjs", () => ({
  createEnv: jest.fn(() => ({
    DATABASE_URL: "postgres://user:password@localhost:5432/testdb", // Valid mock URL
    NODE_ENV: "test",
  })),
}));
