/**
 * Checks that the timezone option is applied and works.
 */
QUnit.test('timezone', function (assert) {
    var chart, oct27Point;

    Highcharts.setOptions({
        time: {
            timezone: 'Europe/Oslo',

            // This should be ignored
            getTimezoneOffset: function (timestamp) {
                var zone = 'America/New_York',
                    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                return timezoneOffset;
            }
        }
    });

    chart = Highcharts.chart('container', {
        title: {
            text: 'timezone with local DST crossover'
        },

        lang: {
            locale: 'en-GB'
        },

        subtitle: {
            text: 'From October 27, UTC midnight is 01:00 AM in Oslo'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [
            {
                data: (function () {
                    var arr = [],
                        i;
                    for (i = 0; i < 5; i = i + 1) {
                        arr.push(i);
                    }
                    return arr;
                }()),
                dataLabels: {
                    enabled: true,
                    format: '{x:%H:%M}'
                },
                pointStart: Date.UTC(2014, 9, 24),
                pointInterval: 24 * 36e5,
                name: 'UTC Midnight',
                tooltip: {
                    pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
                }
            }
        ]
    });

    oct27Point = chart.series[0].data[3];

    /*
    assert.equal(
        typeof Highcharts.time.getTimezoneOffset,
        'function',
        'timezone option is applied'
    );
    */

    assert.equal(
        Highcharts.dateFormat('%H:%M', oct27Point.x),
        '01:00',
        'From October 27, UTC midnight is 01:00 AM in Oslo'
    );

    // This one should fail gracefully
    chart.update({
        time: {
            timezone: 'SomeUnsupported/TimeZone'
        }
    });

    // Non full-hour timezones
    chart.update({
        time: {
            timezone: 'Asia/Calcutta'
        }
    });

    assert.equal(
        chart.time.dateFormat('%H:%M', oct27Point.x),
        '05:30',
        'Non full-hour timezone - UTC midnight should render 05:30 in Calcutta'
    );

    assert.equal(
        chart.time.dateFormat({
            hour: '2-digit',
            minute: 'numeric'
        }, oct27Point.x),
        '05:30',
        'Non full-hour timezone - UTC midnight should render 05:30 in Calcutta'
    );

    chart.update({
        time: {
            timezone: 'Asia/Katmandu'
        }
    });

    assert.equal(
        chart.time.dateFormat('%H:%M', oct27Point.x),
        '05:45',
        'Non full-hour timezone - UTC midnight should render 05:45 in Katmandu'
    );

    chart.update({
        time: {
            timezone: undefined
        }
    });
    assert.equal(
        chart.time.timezone,
        undefined,
        'Undefined time zone should be supported and fall back to local'
    );
    const ts = Date.UTC(2024, 11, 5, 6, 7);
    assert.equal(
        chart.time.dateFormat('%k:00', ts),
        new Date(ts).getHours() + ':00',
        'Undefined timezone should fall back to local time'
    );

    // Tear down
    Highcharts.setOptions({
        time: {
            timezone: 'UTC',
            getTimezoneOffset: undefined
        }
    });
});

/**
 * Checks that specified getTimezoneOffset function is used if timezone option
 * is not.
 */
QUnit.skip('getTimezoneOffset', function (assert) {
    var chart, oct27Point;

    Highcharts.setOptions({
        time: {
            getTimezoneOffset: function (timestamp) {
                var zone = 'Europe/Oslo',
                    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                return timezoneOffset;
            }
        }
    });

    chart = Highcharts.chart('container', {
        title: {
            text: 'timezone with local DST crossover'
        },

        subtitle: {
            text: 'From October 27, UTC midnight is 01:00 AM in Oslo'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [
            {
                data: (function () {
                    var arr = [],
                        i;
                    for (i = 0; i < 5; i = i + 1) {
                        arr.push(i);
                    }
                    return arr;
                }()),
                dataLabels: {
                    enabled: true,
                    format: '{x:%H:%M}'
                },
                pointStart: Date.UTC(2014, 9, 24),
                pointInterval: 24 * 36e5,
                name: 'UTC Midnight',
                tooltip: {
                    pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
                }
            }
        ]
    });

    oct27Point = chart.series[0].data[3];

    /*
    assert.equal(
        typeof Highcharts.time.getTimezoneOffset,
        'function',
        'getTimezoneOffset function is applied'
    );
    */

    assert.equal(
        Highcharts.dateFormat('%H:%M', oct27Point.x),
        '01:00',
        'From October 27, UTC midnight is 01:00 AM in Oslo'
    );

    // Reset
    Highcharts.setOptions({
        time: {
            getTimezoneOffset: undefined
        }
    });
});

QUnit.test('Time class', assert => {
    // The timezone option
    const time1 = new Highcharts.Time({
        timezone: 'Europe/Oslo',
        locale: 'en-GB'
    });

    assert.strictEqual(
        time1.dateFormat('%H:%M', Date.UTC(2014, 6, 3)),
        '02:00',
        'Time class should respect the timezone option with string format'
    );

    assert.strictEqual(
        time1.dateFormat({
            hour: 'numeric',
            minute: 'numeric'
        }, Date.UTC(2014, 6, 3)),
        '02:00',
        'Time class should respect the timezone option with object format'
    );

    // The timezoneOffset option
    const time2 = new Highcharts.Time({
        timezoneOffset: 6 * 60,
        locale: 'en-GB'
    });

    assert.strictEqual(
        time2.dateFormat('%H:%M', Date.UTC(2014, 6, 3)),
        '18:00',
        'Time class should respect the timezoneOffset option with string format'
    );

    assert.strictEqual(
        time2.dateFormat({
            hour: 'numeric',
            minute: 'numeric'
        }, Date.UTC(2014, 6, 3)),
        '18:00',
        'Time class should respect the timezoneOffset option with object format'
    );

});
