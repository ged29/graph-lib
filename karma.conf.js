module.exports = (config) => {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            { pattern: "src/**/*.+(js|ts)" },
        ],
        preprocessors: {
            "src/**/*.+(js|ts)": ["karma-typescript"],
        },
        reporters: ["kjhtml", "karma-typescript"],
        karmaTypescriptConfig: {
            compilerOptions: {
                transforms: [require("karma-typescript-es6-transform")()]
            },
        },

        browsers: ["Chrome"]
    });
}