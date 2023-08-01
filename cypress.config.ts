import { defineConfig } from "cypress";

const config = {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'src/tests/e2e/**/*.test.ts',
    video:false,
    screenshotOnRunFailure: true,
  },
}

export default defineConfig(config);
