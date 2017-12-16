module.exports = (config) => {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            { pattern: "src/**/*.ts" },
        ],
        preprocessors: {
            "src/**/*.ts": ["karma-typescript"],
        },
        reporters: ["kjhtml", "karma-typescript"],
        karmaTypescriptConfig: {
            coverageOptions: {
                instrumentation: false
            }
        },

        browsers: ["Chrome"],
        singleRun: false,
        autoWatch: true,
        autoWatchBatchDelay: 1000,
        logLevel: config.LOG_DISABLE
    });
}