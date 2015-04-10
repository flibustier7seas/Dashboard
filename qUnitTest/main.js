requirejs.config({
    paths: {
        "app": "../scripts/app",
        "jquery": "../scripts/libs/jquery-2.1.0",
        "ko": "../scripts/libs/knockout-3.3.0",
        "moment": "../scripts/libs/moment",
        "qUnit" : "libs/qunit-1.17.1"
    }
    ,
    shim: {
        'qUnit': {
            exports: 'qUnit',
            init: function () {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
});

// require the unit tests.
require(
['qUnit', 'tests/testsReviewerViewModel', 'tests/testsPullRequestViewModel'],
    function (qUnit, testsReviewerViewModel, testsPullRequestViewModel) {

        // run the tests.
        testsReviewerViewModel.run();
        testsPullRequestViewModel.run();

        // start QUnit.
        QUnit.load();
        QUnit.start();
    }
);