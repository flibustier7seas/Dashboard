requirejs.config({
    // configure loading modules from the libs directory, except 'app' ones.
    "baseUrl": "scripts/libs",
    "paths": {
        "app":      "../app",
        "jquery":   "jquery-2.1.0",
        "ko":       "knockout-3.3.0",
        "moment":   "moment"
    },
    "shim": {
        //"jquery.blockUI": ["jquery"],
        //"jquery.columns": ["jquery", "mustache", "jquery.columns.plugin.smartschema"]
    }
});

// load the main app module to start the app
requirejs(["app/main"]);