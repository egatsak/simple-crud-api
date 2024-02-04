/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        esModuleInterop: true
      }
    ]
  },
  moduleFileExtensions: ["ts", "js", "json"],
  setupFiles: ["<rootDir>/jest/setEnvVars.js"]
};
