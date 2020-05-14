$(function(){
    // SET INITIAL LOAD TO DEATH, CUZ WE SO EDGY
    displayLoader();
    loadMap('death');
    getAddress();
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
    "dataQualityGrade" : "Data Quality"
};

let displayOptions = {
    hospitalizedCumulative : true,
    hospitalizedCurrently : true,
    inIcuCumulative : true,
    inIcuCurrently : true,
    onVentilatorCumulative : true,
    onVentilatorCurrently : true,
    recovered : true,
    death : true,
    totalTestResults : true,
    negative : true,
    positive : true,
    dataQualityGrade : true
};

const stateList = {
    "American Samoa": "AS",
    "Arizona": "AZ",
    "Alabama": "AL",
    "Alaska": "AK",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Guam": "GU",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Marshall Islands": "MH",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Micronesia": "FM",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Northern Marianas": "MP",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Palau": "PW",
    "Pennsylvania": "PA",
    "Puerto Rico": "PR",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "Washington, D.C.": "DC",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
    "Virgin Islands": "VI"
};

function displayLoader(){
    $("#indexMap").append(
        `<div class='loaderContainer indexMap'>
            <div class='loading'>
                <div id='largeBox'></div>
                <div id='smallBox'></div>
            </div>
        </div>`
    )

    $("#indexChart").append(
        `<div class='loaderContainer indexChart'>
            <div class='loading'>
                <div id='largeBox'></div>
                <div id='smallBox'></div>
            </div>
        </div>`
    )

    $("#indexStats").append(
        `<div class='loaderContainer indexStats'>
            <div class='loading'>
                <div id='largeBox'></div>
                <div id='smallBox'></div>
            </div>
        </div>`
    )
}

// ==================================== MAP ====================================

function displayMap(data, datum){
    // SET THE MIN/MAX RANGE FOR COLOR SCALE
    let min = Math.min.apply(Math, data.map(function(state) { return state.value; })); 
    let max = Math.max.apply(Math, data.map(function(state) { return state.value; }));
    console.log(data)
    let date = moment(data[0].dateChecked, 'YYYYMMDD').format('MM/DD/YYYY')
    $("#indexMap").html('');
    Highcharts.mapChart('indexMap', {
        chart: {
            map: 'countries/us/us-all'
        },

        title: {
            text: `US Covid-19 ${covidStatsList[datum]} / State <br/> ${date}`
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
            verticalAlign: 'bottom',
            y: 0
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

// ==================================== CHART ====================================

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function redoSeries(dates, display){
    let arr = [];
    for(option in display){
        if(display[option] === true){
            let obj = {};
            obj.name = covidStatsList[option];
            obj.data = [];

            dates.forEach(date => {
                obj.data.unshift(date[option])
            })
            arr.push(obj)
        }
    }
    return arr;
}

async function getAddress() {
    let getIP = async () => {
      return await fetch(
        `https://ipinfo.io?token=5fcea70b36eb66`
      ).then((response) => response.json());
    };
    let ip = await getIP();
    passToCovidAPI(ip);
}

function passToCovidAPI(data) {
    // MODIFY DATA IF REQUESITNG A TERRITORY
    let abbr = data.country !== "US" ? data.country : getStateTwoDigitCode(data.region);  
    getStateData(abbr, displayOptions);
    getData(abbr)
}

function getStateTwoDigitCode(stateFullName) {
    return stateList[stateFullName];
}

async function getStateData(region, choices) {
    let yesterday = moment().subtract(1, "days");
    let dates = [];
    let pastToPresent = [];
    let data;

    for(let i = 0; i < 5; i++){
        dates.push(yesterday.format('YYYYMMDD'));
        yesterday.subtract(7, "days");
    }

    let getCovidStatsBy = async (regionAndTime) => {
      return await fetch(
        `https://covidtracking.com/api/v1/${regionAndTime}.json`
      ).then((response) => response.json());
    };

    for (date of dates) {
        data = await getCovidStatsBy(`states/${region}/${date}`)
        pastToPresent.push(data);
    }

    displayChart(pastToPresent, choices)
}

function displayChart(data, display){
    let dataToPlot = redoSeries(data, display);
    let startDate = moment(data[4].date, 'YYYYMMDD').format('MM/DD/YYYY');
    let endDate = moment(data[0].date, 'YYYYMMDD').format('MM/DD/YYYY');
    // UGLY BUT COULDN'T FIND A SUITABLE METHOD FROM MOMENTJS
    let utcArr = [
        parseInt(moment.utc(data[4].date, 'YYYYMMDD').format('YYYY')),
        parseInt(moment.utc(data[4].date, 'YYYYMMDD').format('MM')),
        parseInt(moment.utc(data[4].date, 'YYYYMMDD').format('DD')),
    ];

    $("#indexChart").html('');

    // CREATE CHART
    Highcharts.chart('indexChart', {
        title: {
            text: `${getKeyByValue(stateList, data[0].state)} Covid-19 Data <br/>${startDate} - ${endDate}`
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
            type: 'datetime',
            accessibility: {
                rangeDescription: `Range: ${startDate} to ${endDate}`
            }
        },
    
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                // Highcharts like utc, because life is suffering
                pointStart: Date.UTC(utcArr[0], utcArr[1] - 1, utcArr[2]), 
                pointInterval: 24 * 3600 * 1000 * 7 // ONE WEEK INTERVALS
            }
        },
        series: dataToPlot,
        responsive: {
            rules: [{
                condition: {
                    width: 800
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

// ==================================== STATS ====================================

function displayData(data) {

    $("#indexStats").html('');
    $("#indexStats").append(
    `<h1 class="data-region"><u>Region Level: 
        ${data.region} ${data.data.state ? getKeyByValue(stateList ,data.data.state) : ""}
        </u></h1>
        <li><u>Current as of</u>: <em>
        ${moment(data.region == "country"
            ? data.data.lastModified
            : data.data.dateModified).format('MM/DD/YYYY')
        }</em></li>`
    );

    for(option in displayOptions) {
        if(displayOptions[option] == true){
        $("#indexStats").append(
            `<li><u>${covidStatsList[option]}</u>: <em>${data.data[option] == null ? 'Unknown/Untracked' : data.data[option]}</em></li>`
        )
        }
    }
};

async function getData(region) {
    let totalUs;
    let totalState;

    let getCovidStatsBy = async (region) => {
        return await fetch(
        `https://covidtracking.com/api/v1/${region}.json`
        ).then((response) => response.json());
    };

    if (region) {
        totalState = await getCovidStatsBy(`states/${region}/current`);
        displayData({ region: "State/Territory of", data: totalState });
    } else {
        totalUs = await getCovidStatsBy(`us/current`);
        displayData({ region: "country", data: totalUs[0] });
    }
}

  