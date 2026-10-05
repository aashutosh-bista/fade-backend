import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
    setupFiles: ['./src/test/setUp.ts'],
    exclude: ["dist/**", "node_modules/**"],
    fileParallelism: false
    }
})