require.config({
    paths: {
        "app": "../scripts/app",
        "ko": "../scripts/libs/knockout-3.3.0",
        "jquery": "../scripts/libs/jquery-2.1.0",
        "moment": "../scripts/libs/moment",
        'jasmine': ['libs/jasmine'],
        'jasmine-html': ['libs/jasmine-html'],
        'jasmine-boot': ['libs/boot']
    },
    shim: {
        'jasmine-html': {
            deps: ['jasmine']
        },
        'jasmine-boot': {
            deps: ['jasmine', 'jasmine-html']
        }
    }
});


require(['jasmine-boot'], function () {
    require(['tests/testsPullRequestViewModel'], function () {
        //trigger Jasmine
        window.onload();
    });
});