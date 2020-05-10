$(function(){
    loadMap('death')
})

$("input[type='radio']").on('click', function(){
    loadMap(this.value)
})

// todo slider for historical data
// TODO FIND A MAP THAT INCLUDES THE TERRRITORIES

function loadMap(datum){
    Highcharts.getJSON('https://covidtracking.com/api/v1/states/current.json', function (data) {
        // console.log(data)
        // REMOVE TERRITORIES & RENAME STATE PROPERTY TO PLAY NICE WITH HIGHCHARTS MAP
        data.splice(51, 5)
        data.forEach((state) => {
            state.code = state.state;
            state.value = state[datum];
            delete state.state;
            delete state[datum];
        })
        // SET THE MIN/MAX RANGE FOR COLOR SCALE
        let min = Math.min.apply(Math, data.map(function(state) { return state.value; })); 
        let max = Math.max.apply(Math, data.map(function(state) { return state.value; }));

        console.log(`${min} | ${max}`)
        // Instantiate the map
        Highcharts.mapChart('map', {
            chart: {
                map: 'countries/us/us-all',
                borderWidth: 2,
    // COLOR
                borderColor: '#FF0000'
            },
    
            title: {
                text: `US Covid-19 ${datum} / State`
            },
    
            exporting: {
                sourceWidth: 600,
                sourceHeight: 500
            },
    
            legend: {
                layout: 'horizontal',
                borderWidth: 0,
                backgroundColor: 'rgba(255,255,255,0.25)',
                floating: true,
                verticalAlign: 'top',
                y: 25
            },
    
            mapNavigation: {
                enabled: true
            },
    
            colorAxis: {
                // MIN OF 0 KILLS THE MAP, DISPLAY AS 1
                min: (min == 0 ? 1 : min),
                max: max,
                type: 'logarithmic',
                stops: [
    // COLOR
                    [0, '#FFA07A'],
                    [0.67, '#FF0000'],
                    [1, '#800000']
                ]
            },
    
            series: [{
                animation: {
                    duration: 1000
                },
                data: data,
                joinBy: ['postal-code', 'code'],
                dataLabels: {
                    enabled: true,
                    color: '#FFFFFF',
                    format: '{point.code}'
                },
                name: datum,
                tooltip: {
                    pointFormat: '{point.code}: {point.value}'
                }
            }]
        });
    });
}