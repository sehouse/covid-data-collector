
// Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/us-population-density.json', function (data) {
Highcharts.getJSON('https://covidtracking.com/api/v1/states/current.json', function (data) {
// console.log(data)
    // REMOVE TERRITORIES & RENAME STATE PROPERTY TO PLAY NICE WITH HIGHCHARTS MAP
    data.splice(51, 5)
    data.forEach((state) =>{
        state.code = state.state;
        state.value = state.death;
        delete state.state;
    })
    // Instantiate the map
    Highcharts.mapChart('map', {
        chart: {
            map: 'countries/us/us-all',
            borderWidth: 1
        },

        title: {
            text: 'US Covid-19 Deaths / State'
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
            min: 1,
            max: 10000,
            type: 'logarithmic',
            // minColor: '#AAA',
            // maxColor: '#000',
            minColor: '#EEEEFF',
            maxColor: '#000022',
            stops: [
                [0, '#EFEFFF'],
                [0.67, '#4444FF'],
                [1, '#000022']
                // [0, '#FFF'],
                // [0.67, '#AAA'],
                // [1, '#000']
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
            name: 'Deaths',
            tooltip: {
                pointFormat: '{point.code}: {point.value}'
            }
        }]
    });
});


// return await fetch(`https://covidtracking.com/api/v1/us/current.json`).then(response => response.json());
// $( async function(){
//     let getCovidStatsBy = async () => {
//         return await fetch(`https://covidtracking.com/api/v1/states/current.json`).then(response => response.json());
//     }
//     let totalUs = await getCovidStatsBy()
//     // let test = localStorage.getItem('doug');
//     let removed = totalUs.splice(51, 5)
//     console.log(removed)
// })
// $('.search').on('click', async () => {
//     // let totalUS
//     let getCovidStatsBy = async () => {
//         return await fetch(`https://covidtracking.com/api/v1/states/current.json`).then(response => response.json());
//     }
//     let totalUs = await getCovidStatsBy()
//     // let test = localStorage.getItem('doug');
//     console.log(totalUs)
// });

