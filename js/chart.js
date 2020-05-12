$(function(){
    displayRegionOptions()
    // LOAD DEFAULT VIEW
    getStateData('NH', displayOptions)
})

let displayOptions = {
    hospitalizedCumulative : false,
    hospitalizedCurrently : false,
    inIcuCumulative : false,
    inIcuCurrently : false,
    onVentilatorCumulative : false,
    onVentilatorCurrently : false,
    recovered : false,
    death : true,
    totalTestResults : false,
    negative : false,
    positive : false,
    dataQualityGrade : false
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
    "Virgin Islands": "VI",
};

function displayRegionOptions() {
    for (state in stateList) {
      $("#state").append(`<option value="${state}">${state}</option>`);
    }
}

function getCheckboxChoices(parent){
    let inputs = parent.children('input');
    inputs.each(function() {
        if(this.checked){
            displayOptions[this.id] = true;
        }else{
            displayOptions[this.id] = false;
        }
    })

    return displayOptions;
}

// todo need to sort by date, not certain if it'll come back sorted being all async and stuff
function redoSeries(dates, display){
    let arr = [];
    for(option in display){
        if(display[option] === true){
            let obj = {};
            obj.name = option;
            obj.data = [];

            dates.forEach(date => {
                obj.data.unshift(date[option])
            })
            arr.push(obj)
        }
    }
    return arr;
}

async function getStateData(region, choices) {
    let today = moment();
    let dates = [];
    let pastToPresent = [];
    let data;

    for(let i = 0; i < 5; i++){
        dates.push(today.format('YYYYMMDD'));
        today.subtract(7, "days");
    }

    let getCovidStatsBy = async (regionAndTime) => {
      return await fetch(
        `https://covidtracking.com/api/v1/${regionAndTime}.json`
      ).then((response) => response.json());
    };

    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
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

    Highcharts.chart('container', {

        title: {
            text: `${data[0].state} Covid-19 Data, ${startDate} - ${endDate}`
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
                rangeDescription: `Range: ${startDate} to ${endDate}`
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
// todo formating this shit is ugly, maybe just show day
// todo Date.UTC(2010, 0, 1),
                pointStart: data[4].date
            }
        },
// todo names and data need to be dynamic for calls to covidtracking
        series: dataToPlot,
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

// TODO MAKE THE CALL ON STATE SELECTION AND OR DISPLAY OPTIONS AND REMOVE THE SEARCH BUTTON
// todo search without state selected is 404ing
$(".control-search").on("click", function(){
    let choices = getCheckboxChoices($('.data-selector'));
    getStateData(stateList[$("#state").val()], choices);
});