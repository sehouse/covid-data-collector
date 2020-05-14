$(function () {
  $("#stats").remove();
  displayLoader("#frontPageStat")    
  getAddress();
  displayRegionOptions();
  displayStatsOption();
});

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

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
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

function displayToast(){
  $(".section-search > .field").hide(400);
  $(".notification").show(400)
}

function removeToast(){
  $(".notification").hide(400);
  $(".section-search > .field").show(400)
}

function displayData(data) {
    // CONDITIONALLY REMOVE SPINNER & ADD DIV FOR CHART TO RESIDE IN 
    let parent = $(".loaderContainer").parent();
    $('.loaderContainer').remove()
    parent.prepend("<div id='stats'></div>");

    $("#stats").append(
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
      $("#stats").append(
        `<li><u>${covidStatsList[option]}</u>: <em>${data.data[option] == null ? 'Unknown/Untracked' : data.data[option]}</em></li>`
      )
    }
  }
};

function displayRegionOptions() {
  for (state in stateList) {
    $("#state").append(`<option value="${state}">${state}</option>`);
  }
}

function getCheckboxChoices(){
  let inputs = $('#options').children('input');
  inputs.each(function() {
      if(this.checked){
          displayOptions[this.id] = true;
      }else{
          displayOptions[this.id] = false;
      }
  })
}

function setCheckboxChoices(){
  let choices = $('#options').children('input');
  choices.prop("checked", !choices.prop("checked"));
}

function passToCovidAPI(data) {
  let abbr;
  // IF COMING FROM IP ADDRESS, DATA WILL BE AN OBJECT :  ELSE, DATA WILL BE A STRING FROM THE FRONTEND OPTIONS LIST
  if (typeof data == "object") {
    abbr =
      data.country !== "US" ? data.country : getStateTwoDigitCode(data.region);
  } else {
    abbr = getStateTwoDigitCode(data);
  }

  getData(abbr);
}

function getStateTwoDigitCode(stateFullName) {
  return stateList[stateFullName];
}
function madeSelection(){
    let selected = false;
    getCheckboxChoices()
    for(option in displayOptions) {
      if(displayOptions[option] == true){
        selected = true;
      }
    }
    return selected;
}

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

async function getAddress(region) {
  let getIP = async (region) => {
    return await fetch(
      `https://ipinfo.io?token=5fcea70b36eb66`
    ).then((response) => response.json());
  };
  let ip = await getIP();
  passToCovidAPI(ip);
}

$(".control-search").on("click", () => {
  if(madeSelection()){
    $("#stats").remove();
    displayLoader("#resultPageStat")
    passToCovidAPI($("#state").val());
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
})

$(".delete").on("click", () => {
  removeToast()
});