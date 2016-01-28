
// CHARTS
$( document ).ready(function() {
    // register function to change the diagram from the map
    changeHighcharts = {
        /*
        * function to change the diagram
        * @param options {object} it should contain 'type' and 'features'
        * */
        setDiagram: function(options) {
            var categories =[],
                series = [];
            for (var i = 0; i < options.features.length; i++) {
                if (options.features[i].population != undefined) {
                    series.push({
                        name:options.features[i].name,
                        data: []
                    });
                    for (var year in options.features[i].population) {
                        series[series.length-1].data.push(options.features[i].population[year]);
                        categories.push(year);
                    }
                }
            }
            if (series.length != 0) {
                $('#chart_1').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: null
                    },
                    subtitle: {
                        text: null
                    },
                    xAxis: {
                        categories: categories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: language[getCookieObject().language].map.panel.highCharts.yAxis
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: series,
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    }
                });
            }
            else {
                $('#chart_1').html('Data missing');
            }
        }
    };
});
