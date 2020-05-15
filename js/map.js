$(function(){
    // SET INITIAL LOAD TO DEATH, CUZ WE SO EDGY
    displayLoader("#frontPageChart");
    displayStatsOption();
    loadMap('death');
})

const covidStatsList = {
    "hospitalizedCumulative" : "Total Hospitalizations",
    "hospitalizedCurrently" : "Current Hospitalizations",
    "inIcuCumulative" : "Total ICUs",
    "inIcuCurrently" : "Current ICUs",
    "onVentilatorCumulative" : "Total Ventilators Used",
    "onVentilatorCurrently" : "Current Ventilators In Use",
    "recovered" : "Total Recoveries",
    "death" : "Total Deaths",
    "totalTestResults" : "Total Test Results",
    "negative" : "Total Test Results (Negative)",
    "positive" : "Total Test Results (Positive)",
    "dataQualityGrade" : "Data Quality",
};

function displayLoader(){
    $("#map").append(
        `<div class='loaderContainer'>
            <div class='loading'>
                <div id='largeBox'></div>
                <div id='smallBox'></div>
            </div>
        </div>`
    )
}

function displayStatsOption() {
    for (stat in covidStatsList) {
      $(".control").append(
          `<label class="radio">
                <input type="radio" name="datum" value=${stat}> ${covidStatsList[stat]}</label>
           </label>`
      );
    }
    $("input[type='radio']").on('click', function(){
        loadMap(this.value)
    })
}

function displayMap(data, datum){
    // SET THE MIN/MAX RANGE FOR COLOR SCALE
    let min = Math.min.apply(Math, data.map(function(state) { return state.value; })); 
    let max = Math.max.apply(Math, data.map(function(state) { return state.value; }));
    $("#map").html('');
    Highcharts.mapChart('map', {
        chart: {
            map: 'countries/us/us-all',
            borderWidth: 2,
            borderColor: '#FF0000'
        },

        title: {
            text: `US Covid-19 ${covidStatsList[datum]} / State`
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
}

function loadMap(datum){
    fetch('https://covidtracking.com/api/v1/states/current.json')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // REMOVE TERRITORIES & RENAME STATE PROPERTY TO PLAY NICE WITH HIGHCHARTS MAP
            data.splice(51, 5)
            data.forEach((state) => {
                state.code = state.state;
                state.value = state[datum];
                delete state.state;
                delete state[datum];
            })
            displayMap(data, datum)
    });
}

$(".control-home").on("click", () => {
    window.location.href = "../index.html";
});

$(".navbar-burger").on("click", () => {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
});