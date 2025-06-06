const chart = new Highcharts.StockChart({

    chart: {
        renderTo: 'container'
    },

    navigator: {
        series: {
            includeInDataExport: false
        }
    },
    series: [{
        data: [
            29.9, 71.5,
            106.4, 129.2,
            144.0, 176.0,
            135.6, 148.5,
            216.4, 194.1,
            95.6, 54.4
        ],
        pointStart: '2013-01-01',
        pointInterval: 24 * 36e5
    }],

    exporting: {
        csv: {
            dateFormat: '%Y-%m-%d'
        }
    }

});

document.getElementById('getcsv').addEventListener('click', function () {
    alert(chart.exporting.getCSV());
});
