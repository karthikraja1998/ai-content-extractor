// jest.config.cjs
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  // Transform ALL node_modules except those explicitly ignored
  // This pattern is robust for ESM packages like superjson
  transformIgnorePatterns: [
    "node_modules/(?!(superjson|@blitzjs|@next|@babel|lodash-es|cheerio|@t3-oss/env-nextjs|@t3-oss/env-core)/)",
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
