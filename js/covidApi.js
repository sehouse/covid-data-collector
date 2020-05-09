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
    $('#stats').html(
        `<h1 class="data-region"><u>Region Level: ${data.region} ${data.data.state ? data.data.state : ''}</u></h1>
        <ul class="list">
        <br>
            <li><u>Current as of:</u> <em>${data.region == 'country' ? data.data.lastModified : data.data.dateModified}</em></li>
            <li><u>Total hospitalizations:</u> <em>${data.data.hospitalizedCumulative}</em></li>
            <li><u>Current Hospitalizations:</u> <em>${data.data.hospitalizedCurrently}</em></li>
            <li><u>Total ICUs:</u> <em>${data.data.inIcuCumulative}</em></li>
            <li><u>Current ICUs:</u> <em>${data.data.inIcuCurrently}</em></li>
            <li><u>Total Ventilators used:</u> <em>${data.data.onVentilatorCumulative}</em></li>
            <li><u>Current Ventilators in use:</u> <em>${data.data.onVentilatorCurrently}</em></li>
            <li><u>Total Recoveries:</u> <em>${data.data.recovered}</em></li>
            <li><u>Total Deaths:</u> <em>${data.data.death}</em></li>
            <li><u>Total Test Results:</u> <em>${data.data.totalTestResults}</em></li>
            <li><u>Total Test Results (Negative):</u> <em>${data.data.negative}</em></li>
            <li><u>Total Test Results (Positive):</u> <em>${data.data.positive}</em></li>
            <li><u>Data Quality:</u> <em>${data.data.dataQualityGrade ? data.data.dataQualityGrade : 'N/A'}</em></li>
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

$('.section-search').on('click', () => { passToCovidAPI($('#state').val()) })
