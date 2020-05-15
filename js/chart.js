$(function(){
    displayRegionOptions();
    displayStatsOption();
    $("#chart").remove();
    displayLoader("#frontPageChart");  
    // GETS IP ADDRESS DATA, PASSES IT THROUGH A FILTER FUNCTION, THEN TO COVID API, THEN TO HIGHCHARTS
    // LOAD STATE / DEATH DATA BASED ON USER GEOLOCATION
    getAddress();
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

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function displayRegionOptions() {
    for (state in stateList) {
      $("#state").append(`<option value="${state}">${state}</option>`);
    }
}

function displayStatsOption() {
    for (stat in covidStatsList) {
      $("#options").append(
          `<input type="checkbox" id=${stat} />
          <label for=${stat}>${covidStatsList[stat]}</label>
          <br />
          <br />`
      );
    }
}

function displayLoader(view){
    $(view).append(
        `<div class='loaderContainer'>
            <div class='loading'>
                <div id='largeBox'></div>
                <div id='smallBox'></div>
            </div>
        </div>`
    )
}

function displayToast(){
    $(".section-search > .field").hide(400);
    $(".notification").show(400)
  }
  
  function removeToast(){
    $(".notification").hide(400);
    $(".section-search > .field").show(400)
  }

  function madeSelection(){
    let selected = false;
    for(option in displayOptions) {
      if(displayOptions[option] == true){
        selected = true;
      }
    }
    return selected;
}

function madeChoice(choice){
    if(choice == false){
        return false;
    }
    return true;
}

function setCheckboxChoices(){
    let choices = $('#options').children('input');
    choices.prop("checked", !choices.prop("checked"));
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
// TODO ASK SCOTT IF DESIRED TO LOAD INITIAL CHART BASED ON GEO DATA
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
    if(dataToPlot.length == 0){
// TODO toast ASKIGN FOR A MIN OF ONE SELECTED VALUE
        return;
    }
    let startDate = moment(data[4].date, 'YYYYMMDD').format('MM/DD/YYYY');
    let endDate = moment(data[0].date, 'YYYYMMDD').format('MM/DD/YYYY');
    // UGLY BUT COULDN'T FIND A SUITABLE METHOD FROM MOMENTJS
    let utcArr = [
        parseInt(moment.utc(data[4].date, 'YYYYMMDD').format('YYYY')),
        parseInt(moment.utc(data[4].date, 'YYYYMMDD').format('MM')),
        parseInt(moment.utc(data[4].date, 'YYYYMMDD').format('DD')),
    ];
    // CONDITIONALLY REMOVE SPINNER & ADD DIV FOR CHART TO RESIDE IN 
    let parent = $(".loaderContainer").parent();
    $('.loaderContainer').remove()
    parent.prepend("<div id='chart'></div>");

    // CREATE CHART
    Highcharts.chart('chart', {
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

$(".control-search").on("click", function(){
    if(madeSelection() && madeChoice($("#state").val())){
        let choices = getCheckboxChoices($('#options'));
        $("#chart").remove();
        displayLoader("#resultsChart")
        getStateData(stateList[$("#state").val()], choices);
        $(".frontPage").hide();
        $(".results").show();
    }else{
        displayToast()
  }
});

$(".control-clear").on("click", () => {
  location.reload();
});

$(".control-home").on("click", () => {
  window.location.href = "index.html";
});

$(".navbar-burger").on("click", () => {
  $(".navbar-burger").toggleClass("is-active");
  $(".navbar-menu").toggleClass("is-active");
});

$("#checkAll").on("click", () => {
    setCheckboxChoices()
});

$(".delete").on("click", () => {
    removeToast()
});
