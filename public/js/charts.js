
// CHARTS
$( document ).ready(function() {
    // register function to change the diagram from the map
    changeHighcharts = {
        /*
        * function to change the diagram
        * @param options {object} it should contain 'type' and 'features'
        * */
        setDiagram: function(options) {
            if (populationType == 'main' || populationType == 'entitled') {
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
                    $('#chart').highcharts({
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
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
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
                    $('#chart').html('Data missing');
                }
            }
            else if (populationType == 'female' || populationType == 'male'){
                var categories =[],
                    series = [];
                for (var i = 0; i < options.features.length; i++) {
                    if (options.features[i].population != undefined) {
                        series.push({
                            name:options.features[i].name,
                            data: []
                        });
                        for (var year in options.features[i].population) {
                            for (var ageGroup in options.features[i].population[year]) {
                                series[series.length-1].data.push(options.features[i].population[year][ageGroup]);
                                categories.push(ageGroup);
                            }

                        }
                    }
                }
                if (series.length != 0) {
                    $('#chart').highcharts({
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
                            '<td style="padding:0"><b>{point.y:}</b></td></tr>',
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
                    $('#chart').html('Data missing');
                }
            }
            else {
                var categories =[],
                    series = [];

                for (var i = 0; i < options.features.length; i++) {
                    if (options.features[i].population != undefined) {
                        var name = options.features[i].name
                        for (var gender in options.features[i].population) {
                            series.push({
                                name:gender,
                                data: []
                            });
                            for (var year in options.features[i].population[gender]) {
                                for (var ageGroup in options.features[i].population[gender][year]) {
                                    series[series.length-1].data.push(options.features[i].population[gender][year][ageGroup]);
                                    categories.push(ageGroup);
                                }
                            }

                        }
                    }
                }
                if (series.length != 0) {
                    $('#chart').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: name + ' ' + selectedYear
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
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
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
                    $('#chart').html('Data missing');
                }
            }
        }
    };
});
