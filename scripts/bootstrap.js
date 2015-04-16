﻿requirejs.config({
    // configure loading modules from the libs directory, except 'app' ones.
    "baseUrl": "scripts/libs",
    "paths": {
        "app":      "../app",
        "jquery":   "jquery-2.1.0",
        "ko": "knockout-3.3.0",
        "d3": "d3.v3.min",
        "moment": "moment",
        "i18n": "i18n",
        "bootstrapMin": "bootstrap.min",
        "chart":"Chart"
    },
        "shim": {
            "bootstrapMin": {
                deps:["jquery"]
            }
    }
});

// load the main app module to start the app
requirejs(["bootstrapMin", "app/main"]);