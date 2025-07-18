(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all-all.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://www.highcharts.com/samples/data/us-counties-unemployment.json'
    ).then(response => response.json());

    // Add state acronym for tooltip
    mapData.objects.default.geometries.forEach(g => {
        const properties = g.properties;
        if (properties['hc-key']) {
            properties.name = properties.name + ', ' +
                        properties['hc-key'].substr(3, 2).toUpperCase();
        }
    });

    document.getElementById('container').innerHTML = 'Rendering map...';

    // Create the map
    setTimeout(function () { // Otherwise innerHTML doesn't update
        Highcharts.mapChart('container', {
            chart: {
                map: mapData,
                height: '80%'
            },

            title: {
                text: 'US Counties unemployment rates, January 2018',
                align: 'left'
            },

            accessibility: {
                description: 'Demo showing a large dataset.'
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                margin: 0,
                backgroundColor: `color-mix(
                    in srgb,
                    var(--highcharts-background-color, white),
                    transparent 15%
                )`
            },

            mapNavigation: {
                enabled: true
            },

            colorAxis: {
                min: 0,
                max: 25,
                tickInterval: 5,
                stops: [[0, '#F1EEF6'], [0.65, '#900037'], [1, '#500007']],
                labels: {
                    format: '{value}%'
                }
            },

            plotOptions: {
                mapline: {
                    showInLegend: false,
                    enableMouseTracking: false
                }
            },

            series: [{
                data: data,
                joinBy: ['hc-key', 'code'],
                name: 'Unemployment rate',
                tooltip: {
                    valueSuffix: '%'
                },
                borderWidth: 0.5,

                shadow: false,
                accessibility: {
                    enabled: false
                }
            }, {
                type: 'mapline',
                name: 'State borders',
                color: 'white',
                shadow: false,
                borderWidth: 2,
                accessibility: {
                    enabled: false
                }
            }]
        });
    }, 0);

})();
