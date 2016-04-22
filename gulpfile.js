var gulp = require("gulp");
var spawn = require("child_process").spawn;
var node;

gulp.task("server", function() {
    if (node) node.kill();

    node = spawn("node", ["index.js"], {
        stdio: "inherit"
    });

    node.on("close", function(code) {
        if (code === 8) {
            gulp.log("Error detected, waiting for changes...");
        }
    });
});


gulp.task("watch", function() {
    gulp.watch(["./**/*.js", "!./node_modules/**/*.js"], ["server"]);
});

process.on("exit", function() {
    if (node) node.kill();
});
gulp.task("default", ['watch']);
