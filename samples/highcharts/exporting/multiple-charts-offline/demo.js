/**
 * Create a global getSVG method that takes an array of charts as an argument.
 * The SVG is returned.
 */
Highcharts.getSVG = async function (charts, options) {
    let top = 0,
        width = 0;

    const svgArr = [],
        addSVG = function (svgres) {
            // Grab width/height from exported chart
            const svgWidth = +svgres.match(
                    /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
                )[1],
                svgHeight = +svgres.match(
                    /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
                )[1];

            // Offset the position of this chart in the final SVG
            let svg = svgres.replace(
                '<svg',
                `<g transform="translate(0,${top})" `
            );
            svg = svg.replace('</svg>', '</g>');
            top += svgHeight;
            width = Math.max(width, svgWidth);
            svgArr.push(svg);
        },
        exportChart = async function (i) {
            try {
                if (charts[i]) {
                    charts[i].exporting.downloadSVG = () => {
                        console.log('Single chart export disabled');
                    };
                    const svg = await charts[i].exporting.localExport(
                        options,
                        {}
                    );
                    addSVG(svg);
                    // Export next only when this SVG is received
                    return exportChart(i + 1);
                }
            } catch {
                console.log('Failed to get SVG', i);
            }
        };
    await exportChart(0);
    return `<svg version="1.1" width="${width}" height="${top}"
            viewBox="0 0 ${width} ${top}"
            xmlns="http://www.w3.org/2000/svg">
        ${svgArr.join('')}
    </svg>`;
};

/**
 * Create a global exportCharts method that takes an array of charts as an
 * argument, and exporting options as the second argument
 */
Highcharts.exportCharts = async function (charts, options) {
    options = Highcharts.merge(Highcharts.getOptions().exporting, options);

    try {
        // Get SVG asynchronously
        const svg = await Highcharts.getSVG(charts, options);

        // Download the resulting SVG
        await Highcharts.downloadSVGLocal(svg, options);
    } catch {
        console.log('Failed to export on client side');
    }
};

// Set global default options for all charts
Highcharts.setOptions({
    exporting: {
        // Ensure the export happens on the client side or not at all
        fallbackToExportServer: false
    }
});

// Create the charts
const chart1 = Highcharts.chart('container1', {

    chart: {
        height: 200,
        type: 'pie'
    },

    title: {
        text: 'First Chart'
    },

    credits: {
        enabled: false
    },

    series: [{
        data: [
            ['Apples', 5],
            ['Pears', 9],
            ['Oranges', 2]
        ]
    }],

    exporting: {
        enabled: false // hide button
    }

});
const chart2 = Highcharts.chart('container2', {

    chart: {
        type: 'column',
        height: 200
    },

    title: {
        text: 'Second Chart'
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },

    series: [{
        data: [
            176.0, 135.6, 148.5, 216.4, 194.1, 95.6,
            54.4, 29.9, 71.5, 106.4, 129.2, 144.0
        ],
        colorByPoint: true,
        showInLegend: false
    }],

    exporting: {
        enabled: false // hide button
    }

});

document.getElementById('export-png').addEventListener('click', async () => {
    await Highcharts.exportCharts([chart1, chart2]);
});

document.getElementById('export-pdf').addEventListener('click', async () => {
    await Highcharts.exportCharts([chart1, chart2], {
        type: 'application/pdf'
    });
});