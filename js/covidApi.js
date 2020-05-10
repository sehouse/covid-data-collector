$(function(){
    getAddress()
    displayRegionOptions()
})

const stateList = {

    'American Samoa' : 'AS',
    'Arizona': 'AZ',
    'Alabama': 'AL',
    'Alaska':'AK',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam' : 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Marshall Islands' : 'MH',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Micronesia' : 'FM',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Marianas' : 'MP',
    'Ohio' : 'OH',
    'Oklahoma' : 'OK',
    'Oregon' : 'OR',
    'Palau' : 'PW',
    'Pennsylvania': 'PA',
    'Puerto Rico' : 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'Washington, D.C.' : 'DC',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY',
    'Virgin Islands' : 'VI'
}

function displayData(data){
    if(data.region == 'country'){
        console.log('country level data is present')
    }
    // TODO BONUS: TIME PERMITTING, MAP OF US WITH STATE SPECIFIC DATA ON HOVER
    // if(data.region == 'states'){
    //     console.log('states level data is present')
    // }
    if(data.region == 'state'){
        console.log(`single state ${data.data.state} level data is present`)
    }
    // TODO DON'T DISPLAY null OR undefined VALUES

    var hospitalizationsCumulative = data.data.hospitalizationsCumulative;
    var nullHospitalizationsCumulative = (hospitalizationsCumulative != null ? hospitalizationsCumulative : "Data Unknown");
    
    var hospitalizedCurrently= data.data.hospitalizedCurrently;
    var nullhospitalizedCurrently = (hospitalizedCurrently != null ? hospitalizedCurrently : "Data Unknown");

    var inIcuCumulative = data.data.inIcuCumulative;
    var nullInIcuCumulative = (inIcuCumulative != null ? inIcuCumulative : "Data Unknown");

    var inIcuCurrently = data.data.inIcuCurrently;
    var nullinIcuCurrently = (inIcuCurrently != null ? inIcuCurrently : "Data Unknown");

    var ventilatorCumulative = data.data.onVentilatorCumulative;
    var nullVentilatorCumulative = (ventilatorCumulative != null ? ventilatorCumulative : "Data Unknown");

    var ventilatorCurrently = data.data.onVentilatorCurrently;
    var nullVentilatorCurrently = (ventilatorCurrently != null ? ventilatorCurrently : "Data Unknown");

    var recovered = data.data.recovered;
    var nullRecovered = (recovered != null ? recovered : "Data Unknown");

    var death = data.data.death;
    var nullDeath = (death != null ? death : "Data Unknown");

    var totalTestResults = data.data.totalTestResults;
    var nullTotalTestResults = (totalTestResults != null ? totalTestResults : "Data Unknown");

    var negative = data.data.negative;
    var nullNegative = (negative != null ? negative : "Data Unknown");

    var positive = data.data.positive;
    var nullPositive = (positive != null ? positive : "Data Unknown");

    $('#stats').html(
        `<h1 class="data-region"><u>Region Level: ${data.region} ${data.data.state ? data.data.state : ''}</u></h1>
        <ul class="list">
        <br>
            <li><u>Current as of:</u> <em>${data.region == 'country' ? data.data.lastModified : data.data.dateModified}</em></li>
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
            <li><u>Data Quality:</u> <em>${data.data.dataQualityGrade ? data.data.dataQualityGrade : 'Data Unknown'}</em></li>
        </ul>`
        
    );
}



function displayRegionOptions(){
    for(state in stateList){
        $('#state').append(`<option value="${state}">${state}</option>`);
    }
}

function passToCovidAPI(data){
    let abbr;
    // IF COMING FROM IP ADDRESS, DATA WILL BE AN OBJECT
    // ELSE, DATA WILL BE A STRING FROM THE FRONTEND OPTIONS LIST
    if(typeof data == 'object'){
        abbr = (data.country !== 'US' ? data.country : getStateTwoDigitCode(data.region));
    }else{
        abbr = getStateTwoDigitCode(data)
    }

    getData(abbr)
}

// TODO LINK SOURCE IN README https://stackoverflow.com/questions/33790210/get-a-state-name-from-abbreviation
function getStateTwoDigitCode(stateFullName) {
    return stateList[stateFullName];
}

async function getData(region){
    let totalUs;
    // let totalStates;
    let totalState;

    let getCovidStatsBy = async (region) => {
        return await fetch(`https://covidtracking.com/api/v1/${region}.json`).then(response => response.json());
    }
    // TODO: BONUS: TIME PERMITTING BUILD A MAP, THAT DISPLAYS STATE SPECIFIC INFO ON HOVER
    // if(region == 'states'){
    //     totalStates = await getCovidStatsBy(`states/current`);
    //     displayData({region: 'states', data: totalStates})
    // INITIAL LOAD, PRESUMES IT STARTS AT USER'S STATE
    // }else if(region){
    //     totalState = await getCovidStatsBy(`states/${region}/current`);
    //     displayData({region: 'state', data: totalState})
    // }else{
    //     totalUs = await getCovidStatsBy(`us/current`);
    //     displayData({region: 'country', data: totalUs[0]})
    // }
    if(region){
        totalState = await getCovidStatsBy(`states/${region}/current`);
        displayData({region: 'State/Territory of', data: totalState})
    }else{
        totalUs = await getCovidStatsBy(`us/current`);
        displayData({region: 'country', data: totalUs[0]})
    }
}

async function getAddress(region){
    let getIP = async (region) => {
        return await fetch(`https://ipinfo.io?token=5fcea70b36eb66`).then(response => response.json());
    }
    let ip = await getIP();
    passToCovidAPI(ip)
}

$('.section-search').on('click', () => { passToCovidAPI($('#state').val());
$('.frontPage').hide();
$('.results').show();
})

$('.section-clear').on('click', () => {
location.reload();
})
