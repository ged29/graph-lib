module.exports = function (grunt) {

    grunt.initConfig({
        testem: {
            unit: {
                options: {
                    framework: "jasmine2",
                    launch_in_dev: ["Chrome"],
                    serve_files: [
                        "src/**/*spec.js"
                    ],
                    watch_files: [
                        "src/**/*spec.js"
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-testem');
    grunt.registerTask('default', ['testem:run:unit']);
}