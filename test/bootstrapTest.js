requirejs.config({
    "paths": {
        "app": "../scripts/app",
        "jquery": "../scripts/libs/jquery-2.1.0",
        "ko": "../scripts/libs/knockout-3.3.0",
        "qunit" : "qunit-1.17.1"
    }
});

// load the main app module to start the app
requirejs(["tests"]);