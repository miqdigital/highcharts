(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/fr-2024/fr-cvl-all-2024.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-cvl-in', 10], ['fr-cvl-il', 11], ['fr-cvl-el', 12],
        ['fr-cvl-lc', 13], ['fr-cvl-ch', 14], ['fr-cvl-lt', 15]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/historical/countries/fr-2024/fr-cvl-all-2024.topo.json">Centre-Val de Loire (2024) (2024)</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
