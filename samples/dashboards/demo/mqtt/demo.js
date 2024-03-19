let board = null;
const powerUnit = 'kWh';


const kpiGaugeOptions = {
    chart: {
        type: 'solidgauge'
    },
    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    yAxis: {
        labels: {
            distance: '105%',
            y: 5,
            align: 'auto'
        },
        lineWidth: 2,
        minorTicks: false,
        tickWidth: 2,
        tickAmount: 2,
        visible: true
    },
    accessibility: {
        typeDescription: 'The gauge chart with 1 data point.'
    }
};


const xAxisOptions = {
    type: 'datetime',
    labels: {
        format: '{value:%H:%M}',
        accessibility: {
            description: 'Hours, minutes'
        }
    }
};

const yAxisOptions = {
    title: {
        text: powerUnit
    }
};


function getDataConnector(id) {
    return {
        id: id,
        type: 'JSON',
        options: {
            firstRowAsNames: true,
            data: [
                ['time', 'power'],
                // Test data: to be removed
                [Date.UTC(2024, 0, 1), 0]
            ],
            dataModifier: {
                type: 'Sort',
                orderByColumn: 'time'
            }
        }
    };
}


function getKpiComponent(domEl, title) {
    return {
        type: 'KPI',
        renderTo: domEl,
        value: 0,
        valueFormat: '{value}',
        title: title,
        chartOptions: {
            chart: kpiGaugeOptions.chart,
            pane: kpiGaugeOptions.pane,
            yAxis: {
                ...kpiGaugeOptions.yAxis,
                min: 0,
                max: 20,
                accessibility: {
                    description: title
                }
            }
        }
    };
}


function getChartComponent(connId, domEl, title) {
    return {
        type: 'Highcharts',
        renderTo: domEl,
        connector: {
            id: connId,
            columnAssignment: [{
                seriesId: title,
                data: ['time', 'power']
            }]
        },
        sync: {
            visibility: true,
            extremes: true,
            highlight: true
        },
        chartOptions: {
            chart: {
                type: 'spline',
                styledMode: true,
                animation: true
            },
            xAxis: xAxisOptions,
            yAxis: yAxisOptions,
            credits: {
                enabled: false
            },
            legend: {
                enabled: true,
                verticalAlign: 'top'
            },
            title: {
                text: ''
            },
            tooltip: {
                valueSuffix: powerUnit
            }
        }
    };
}


function getGridComponent(connId, domEl, title) {
    return {
        type: 'DataGrid',
        renderTo: domEl,
        connector: {
            id: connId
        },
        sync: {
            highlight: true,
            extremes: true,
            visibility: true
        },
        dataGridOptions: {
            editable: false,
            columns: {
                time: {
                    headerFormat: 'Time UTC',
                    cellFormatter: function () {
                        // eslint-disable-next-line max-len
                        return Highcharts.dateFormat('%Y-%m-%d', this.value) + ' ' + Highcharts.dateFormat('%H:%M', this.value);
                    }
                },
                power: {
                    headerFormat: title
                }
            }
        }
    };
}


// Launches the Dashboards application
async function setupDashboard() {
    // TBD: Calculate based on available data
    function getPowerUnits(numUnits) {
        const powerUnits = {
            connectors: [],
            components: []
        };

        for (let i = 0; i < numUnits; i++) {
            // Data connectors
            const id = i + 1;
            const connId = 'mqtt-data-' + id;
            powerUnits.connectors.push(getDataConnector(connId));

            // Dash components
            const title = 'Aggregate ' + id;

            let name = 'kpi-agg-' + id;
            powerUnits.components.push(getKpiComponent(name, title));

            name = 'chart-agg-' + id;
            powerUnits.components.push(getChartComponent(connId, name, title));

            name = 'data-grid-' + id;
            powerUnits.components.push(getGridComponent(connId, name, title));
        }

        return powerUnits;
    }

    // Get data for two power units (TBD: use data stream content to calculate)
    const pu = getPowerUnits(2);

    return await Dashboards.board('container', {
        dataPool: {
            connectors: pu.connectors
        },
        components: pu.components
    });
}


async function updateBoard(mqttPacket) {
    const dataTable1 = await board.dataPool.getConnectorTable('mqtt-data-1');
    const dataTable2 = await board.dataPool.getConnectorTable('mqtt-data-2');

    const data = JSON.parse(mqttPacket.payloadString);

    if (dataTable1.getRowCount() === 0) {
        // Get history
        const hist = data.aggs[1].P_hist;
        const d = new Date(hist.start);
        let time = Number(d.valueOf());

        const step = hist.res * 1000; // P_hist resolution: seconds
        const rowData1 = [];
        const rowData2 = [];
        const histLen = hist.values.length;

        for (let i = 0; i < histLen; i++) {
            const p1 = 0; // TBD: grab data
            const p2 = hist.values[i];

            // Add row with historical data (reversed)
            rowData1.push([time, p1]);
            rowData2.push([time, p2]);

            // Next measurement
            time += step;
        }
        // Add the rows to the data table
        await dataTable1.setRows(rowData1);
        await dataTable2.setRows(rowData2);
    } else {
        const d = new Date(data.tst_iso);
        const time = d.valueOf();

        const p1 = data.aggs[0].P_gen;
        const p2 = data.aggs[1].P_gen;

        // Add row with latest data
        await dataTable1.setRow([time, p1]);
        await dataTable2.setRow([time, p2]);
    }
    // Refresh all components
    await updateComponents();
}


async function connectBoard() {
    // Launch  Dashboard
    if (board === null) {
        board = await setupDashboard();
    }

    const dataTable1 = await board.dataPool.getConnectorTable('mqtt-data-1');
    const dataTable2 = await board.dataPool.getConnectorTable('mqtt-data-2');

    // Clear the data
    await dataTable1.deleteRows();
    await dataTable2.deleteRows();

    await updateComponents();
}


async function updateComponents() {
    // Update charts and datagrids
    for (let i = 0; i < board.mountedComponents.length; i++) {
        const comp = board.mountedComponents[i].component;
        if (comp.type !== 'KPI') {
            await comp.initConnector();
        }

        if (comp.type === 'Highcharts') {
            await comp.update({
                connector: {
                    columnAssignment: [{
                        seriesId: 'power',
                        data: ['time', 'power']
                    }]
                }
            });
        }
    }

    // Update the KPI components
    const dataTable1 = await board.dataPool.getConnectorTable('mqtt-data-1');
    const dataTable2 = await board.dataPool.getConnectorTable('mqtt-data-2');
    const rowCount = await dataTable1.getRowCount();
    let data1, data2;

    if (rowCount > 0) {
        data1 = dataTable1.getCellAsNumber('power', rowCount - 1);
        data2 = dataTable2.getCellAsNumber('power', rowCount - 1);
    } else {
        data1 = 0;
        data2 = 0;
    }

    // TBD: calculate indexes
    const kpiAgg1 = board.mountedComponents[0].component;
    await kpiAgg1.update({
        value: data1
    });

    const kpiAgg2 = board.mountedComponents[3].component;
    await kpiAgg2.update({
        value: data2
    });
}


/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

// MQTT handle
let mqtt;

// Connection parameters
const host = 'mqtt.sognekraft.no';
const port = 8083;
const reconnectTimeout = 10000;

// Connection status
let msgCount = 0;
let connectFlag = false;

// Contains id's of UI elements
let uiId;

window.onload = () => {
    msgCount = 0;
    connectFlag = false;

    uiId = {
        status: document.getElementById('status'),
        statusMsg: document.getElementById('status_messages')
    };
    topicEnable(false);
};


function setConnectionStatus(connected) {
    setUiElement('status', connected ? 'Connected' : 'Disconnected');
    const el = document.getElementById('status_bar');
    el.style.backgroundColor = connected ? 'green' : 'red';
}


async function onConnectionLost() {
    setConnectionStatus(false);
    setUiElement('statusMsg', '');
    subscribeEnable(false);
}


function onFailure(message) {
    setUiElement('statusMsg', 'Failed: ' + message);
    subscribeEnable(false);
}


function onMessageArrived(rawMessage) {
    msgCount += 1;

    // Test
    updateBoard(rawMessage);
}


function onConnected(recon, url) {
    console.log(' in onConnected ' + recon);
}


async function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    setUiElement('statusMsg', 'Connected to ' + host + ' on port ' + port);
    connectFlag = true;
    setConnectionStatus(true);

    connectBoard();
    subscribeEnable(true);
}


function disconnect() {
    if (connectFlag) {
        mqtt.disconnect();
        connectFlag = false;
    }
}


function MQTTconnect() {
    const connBtn = document.getElementsByName('conn')[0];

    if (connectFlag) {
        setUiElement('statusMsg', 'disconnecting...');
        disconnect();
        connBtn.value = 'Connect';

        return false;
    }

    const userName = document.forms.connform.username.value;
    const password = document.forms.connform.password.value;

    setUiElement('statusMsg', 'connecting...');

    const cname = 'orderform-' + Math.floor(Math.random() * 10000);

    // eslint-disable-next-line no-undef
    mqtt = new Paho.MQTT.Client(host, port, cname);

    const options = {
        useSSL: true,
        timeout: 3,
        cleanSession: true,
        onSuccess: onConnect,
        onFailure: onFailure
    };

    if (userName !== '') {
        options.userName = document.forms.connform.username.value;
    }

    if (password !== '') {
        options.password = document.forms.connform.password.value;
    }

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.onConnected = onConnected;

    mqtt.connect(options);

    connBtn.value = 'Disconnect';

    return false;
}


function subTopics() {
    if (connectFlag === 0) {
        setUiElement('statusMsg', 'Not connected, subscription not possible');

        return false;
    }

    const stopic = document.forms.subs.Stopic.value;
    const sqos = 0;

    // document.getElementById('status_messages').innerHTML = 'Subscribing to topic =' + stopic;
    setUiElement('statusMsg', 'Subscribing to topic =' + stopic);

    const soptions = {
        qos: sqos
    };

    mqtt.unsubscribe('/#');
    mqtt.subscribe(stopic, soptions);

    return false;
}

function subscribeEnable(enabled) {
    document.getElementById('subscribe').disabled = !enabled;
}


function topicEnable(enabled) {
    // TBD: static topic until application is made scalable
    document.getElementById('topic').disabled = true; // enabled;
}


function setUiElement(elName, msg) {
    uiId[elName].innerHTML = msg;
}