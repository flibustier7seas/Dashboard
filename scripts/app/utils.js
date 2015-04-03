define(["moment"], function (moment) {
    return {
        timeTCTemplate: "YYYYMMDD-HHmmss",
        getMaxOfArray: function (arr, funcCompare) {
            if (arr.length > 0) {
                var max = arr[0];
                arr.forEach(function (item) {
                    if (funcCompare(item, max) == 1) {
                        max = item;
                    }
                });
                return max;
            }
            return null;
        },
        getFunctionCompare: function (property, asc) {
            if (asc === undefined) {
                asc = true;
            }
            if (asc) {
                return function (a, b) { return a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : a[property] == b[property] ? 0 : 0; }
            } else {
                return function (a, b) { return a[property] > b[property] ? -1 : a[property] < b[property] ? 1 : a[property] == b[property] ? 0 : 0; };
            }
        },
        dateToText: function (date) {

            if (moment().diff(date, 'days') < 7) {
                return moment(date).fromNow();
            }

            return moment(date).format('LLLL');
        },
        dateToTextTC: function (startDate) {
            var date = moment(startDate, [this.timeTCTemplate]);
            if (moment().diff(date, 'days') < 7) {
                return date.fromNow();
            }
            return date.format('LLLL');
        },
        timeDifference: function (start, finish) {
            var startDate = moment(start, [this.timeTCTemplate]);
            var finishDate = moment(finish, [this.timeTCTemplate]);
            var result = moment(finishDate.diff(startDate));
            return result.format('mm:ss');
        }
    }
}
);
