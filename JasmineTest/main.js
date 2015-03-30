require.config({
    paths: {
        'jasmine': ['jasmine'],
        'jasmine-html': ['jasmine-html'],
        'jasmine-boot': ['boot']
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
    require(['test'], function() {
        //trigger Jasmine
        window.onload();
    });
});