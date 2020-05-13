$(function () {
  getAddress();
  displayRegionOptions();
  displayStatsOption();
});

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

function displayData(data) {
  // TODO CHECKBOXES CONDITIONALLY DISPLAYING THE DATA IN THE MAP / LIST /
  // TODO MIGHT BE ABLE TO LOOP THROUGH THESE VARS, LESS CODE THAT WAY
  console.log(data);
  var hospitalizationsCumulative = data.data.hospitalizedCumulative;
  var nullHospitalizationsCumulative =
    hospitalizationsCumulative != null
      ? hospitalizationsCumulative
      : "Data Unknown";

  var hospitalizedCurrently = data.data.hospitalizedCurrently;
  var nullhospitalizedCurrently =
    hospitalizedCurrently != null ? hospitalizedCurrently : "Data Unknown";

  var inIcuCumulative = data.data.inIcuCumulative;
  var nullInIcuCumulative =
    inIcuCumulative != null ? inIcuCumulative : "Data Unknown";

  var inIcuCurrently = data.data.inIcuCurrently;
  var nullinIcuCurrently =
    inIcuCurrently != null ? inIcuCurrently : "Data Unknown";

  var ventilatorCumulative = data.data.onVentilatorCumulative;
  var nullVentilatorCumulative =
    ventilatorCumulative != null ? ventilatorCumulative : "Data Unknown";

  var ventilatorCurrently = data.data.onVentilatorCurrently;
  var nullVentilatorCurrently =
    ventilatorCurrently != null ? ventilatorCurrently : "Data Unknown";

  var recovered = data.data.recovered;
  var nullRecovered = recovered != null ? recovered : "Data Unknown";

  var death = data.data.death;
  var nullDeath = death != null ? death : "Data Unknown";

  var totalTestResults = data.data.totalTestResults;
  var nullTotalTestResults =
    totalTestResults != null ? totalTestResults : "Data Unknown";

  var negative = data.data.negative;
  var nullNegative = negative != null ? negative : "Data Unknown";

  var positive = data.data.positive;
  var nullPositive = positive != null ? positive : "Data Unknown";
  // TODO SHOW FULL STATE NAME, CAN USE THE LIST CREATED ABOVE
  // TODO CHANGE CURRENT AS OF TIME STAMP TO HUMAN READABLE MM/DD/YYYY
  // TODO CONDITIONALLY SHOW LIST ITEMS BASED ON IF THE ASSOCIATED CHECKBOX WAS CHECKED
  $("#stats").html(
    `<h1 class="data-region"><u>Region Level: ${data.region} ${
      data.data.state ? data.data.state : ""
    }</u></h1>
        <ul class="list">
        <br>
            <li><u>Current as of:</u> <em>${
              data.region == "country"
                ? data.data.lastModified
                : data.data.dateModified
            }</em></li>
            <li><u>Total hospitalizations:</u> <em>${nullHospitalizationsCumulative}</em></li>
            <li><u>Current Hospitalizations:</u> <em>${nullhospitalizedCurrently}</em></li>
            <li><u>Total ICUs:</u> <em>${nullInIcuCumulative}</em></li>
            <li><u>Current ICUs:</u> <em>${nullinIcuCurrently}</em></li>
            <li><u>Total Ventilators used:</u> <em>${nullVentilatorCumulative}</em></li>
            <li><u>Current Ventilators in use:</u> <em>${nullVentilatorCurrently}</em></li>
            <li><u>Total Recoveries:</u> <em>${nullRecovered}</em></li>
            <li><u>Total Deaths:</u> <em>${nullDeath}</em></li>
            <li><u>Total Test Results:</u> <em>${nullTotalTestResults}</em></li>
            <li><u>Total Test Results (Negative):</u> <em>${nullNegative}</em></li>
            <li><u>Total Test Results (Positive):</u> <em>${nullPositive}</em></li>
            <li><u>Data Quality:</u> <em>${
              data.data.dataQualityGrade
                ? data.data.dataQualityGrade
                : "Data Unknown"
            }</em></li>
        </ul>`
  );
}

function displayRegionOptions() {
  for (state in stateList) {
    $("#state").append(`<option value="${state}">${state}</option>`);
  }
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

// TODO LINK SOURCE IN README https://stackoverflow.com/questions/33790210/get-a-state-name-from-abbreviation
function getStateTwoDigitCode(stateFullName) {
  return stateList[stateFullName];
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
  passToCovidAPI($("#state").val());
  $(".frontPage").hide();
  $(".results").show();
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
