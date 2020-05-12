$(function(){
    loadChart()
})

// $("input[type='radio']").on('click', function(){
//     loadChart(this.value)
// })

// grab state
// https://covidtracking.com/api/v1/states/${state}/${date}.json
// https://covidtracking.com/api/v1/states/NH/20200510.json
// YYYYMMDD
// 20200122 earliest with one state and one data point
// todays date
// make 5 calls to api, today, today -30, today minus 60, etc
//  might want to use moment for the math on that
// push each response into a master array
// 
function loadChart(state){
    let pastToPresent = [];
    // last five weeks
    let hardDates = [20200101, 20200201, 20200301, 20200401, 20200501];
    let date = new Date();

    hardDates.forEach(date => {
        Highcharts.getJSON(`https://covidtracking.com/api/v1/states/NH/${date}.json`, function (data) {
            pastToPresent.push(data)
        });
    })
    console.log(pastToPresent)
    

    Highcharts.chart('container', {

        title: {
            text: '{state} Covid-19 Data, {current minus 5 MM} - {current YYYY-MM-DD}'
        },
    
        subtitle: {
            text: 'Source: https://covidtracking.com/'
        },
    
        yAxis: {
            title: {
                text: 'Totals'
            }
        },
    
        xAxis: {
            accessibility: {
                // TODO MAKE RANGE DYNAMIC, CURRENT MONTH -5 THROUGH TO CURRENT MONTH
                rangeDescription: 'Range: 2010 to 2017'
            }
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
            // TODO MAKE RANGE DYNAMIC, CURRENT MONTH -5 THROUGH TO CURRENT MONTH
                pointStart: 2010
            }
        },
    // todo names and data need to be dynamic for calls to covidtracking
        series: [{
            name: 'Installation',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            name: 'Manufacturing',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
            name: 'Sales & Distribution',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
            name: 'Project Development',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
            name: 'Other',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });
}




    // Highcharts.getJSON('https://covidtracking.com/api/v1/states/current.json', function (data) {
    //     // REMOVE TERRITORIES & RENAME STATE PROPERTY TO PLAY NICE WITH HIGHCHARTS MAP
    //     data.splice(51, 5)
    //     data.forEach((state) => {
    //         state.code = state.state;
    //         state.value = state[datum];
    //         delete state.state;
    //         delete state[datum];
    //     })
    //     // SET THE MIN/MAX RANGE FOR COLOR SCALE
    //     let min = Math.min.apply(Math, data.map(function(state) { return state.value; })); 
    //     let max = Math.max.apply(Math, data.map(function(state) { return state.value; }));

    //     console.log(`${min} | ${max}`)
    //     // Instantiate the map
    //     Highcharts.mapChart('map', {
    //         chart: {
    //             map: 'countries/us/us-all',
    //             borderWidth: 2,
    // // COLOR
    //             borderColor: '#FF0000'
    //         },
    
    //         title: {
    //             text: `US Covid-19 ${datum} / State`
    //         },
    
    //         exporting: {
    //             sourceWidth: 600,
    //             sourceHeight: 500
    //         },
    
    //         legend: {
    //             layout: 'horizontal',
    //             borderWidth: 0,
    //             backgroundColor: 'rgba(255,255,255,0.25)',
    //             floating: true,
    //             verticalAlign: 'top',
    //             y: 25
    //         },
    
    //         mapNavigation: {
    //             enabled: true
    //         },
    
    //         colorAxis: {
    //             // MIN OF 0 KILLS THE MAP, DISPLAY AS 1
    //             min: (min == 0 ? 1 : min),
    //             max: max,
    //             type: 'logarithmic',
    //             stops: [
    // // COLOR
    //                 [0, '#FFA07A'],
    //                 [0.67, '#FF0000'],
    //                 [1, '#800000']
    //             ]
    //         },
    
    //         series: [{
    //             animation: {
    //                 duration: 1000
    //             },
    //             data: data,
    //             joinBy: ['postal-code', 'code'],
    //             dataLabels: {
    //                 enabled: true,
    //                 color: '#FFFFFF',
    //                 format: '{point.code}'
    //             },
    //             name: datum,
    //             tooltip: {
    //                 pointFormat: '{point.code}: {point.value}'
    //             }
    //         }]
    //     });
    // });