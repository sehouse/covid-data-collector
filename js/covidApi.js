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
    'Vigrin Islands' : 'VI'
}

function displayData(data){
    if(data.region == 'country'){
        console.log('country level data is present')
    }
    if(data.region == 'states'){
        console.log('states level data is present')
    }
    if(data.region == 'state'){
        console.log(`single state ${data.data.state} level data is present`)
    }
    if(data.region == 'county'){
        console.log('county level data is present')
    }
    // TODO WILL NEED TO WRAP THIS IN A forEach IF HANDLING STATES OR COUNTIES
    // TODO DON'T DISPLAY null OR undefined VALUES
    $('#stats').append(
        `<h1>Region Level: ${data.region} ${data.data.state ? data.data.state : ''}</h1>
        <ul>
            <li>Current as of: ${data.region == 'country' ? data.data.lastModified : data.data.dateModified}</li>
            <li>Total hospitalizaitons: ${data.data.hospitalizedCumulative}</li>
            <li>Current Hospitalizations: ${data.data.hospitalizedCurrently}</li>
            <li>Total ICUs: ${data.data.inIcuCumulative}</li>
            <li>Current ICUs: ${data.data.inIcuCurrently}</li>
            <li>Total Ventilators used: ${data.data.onVentilatorCumulative}</li>
            <li>Current Ventilators in use: ${data.data.onVentilatorCurrently}</li>
            <li>Total Recoveries: ${data.data.recovered}</li>
            <li>Total Deaths: ${data.data.death}</li>
            <li>Total Test Results: ${data.data.totalTestResults}</li>
            <li>Total Test Results (Negative): ${data.data.negative}</li>
            <li>Total Test Results (Positive): ${data.data.positive}</li>
            <li>Data Quality: ${data.data.dataQualityGrade ? data.data.dataQualityGrade : 'N/A'}</li>
        </ul>`
    );
}

function displayRegionOptions(){
    for(state in stateList){
        $('#state').append(`<option value="${state}">${state}</option>`);
    }
}
function passToCovidAPI(data){
    let abbr = (data.country !== 'US' ? data.country : getStateTwoDigitCode(data.region));
    getData(abbr)
}

// TODO LINK SOURCE IN README https://stackoverflow.com/questions/33790210/get-a-state-name-from-abbreviation
function getStateTwoDigitCode(stateFullName) {
    return stateList[stateFullName];
}

async function getData(region){
    let totalUs;
    let totalStates;
    let totalState;

    let getCovidStatsBy = async (region) => {
        return await fetch(`https://covidtracking.com/api/v1/${region}.json`).then(response => response.json());
    }

    if(region == 'states'){
        totalStates = await getCovidStatsBy(`states/current`);
        displayData({region: 'states', data: totalStates})
    // INITIAL LOAD, PRESUMES IT STARTS AT USER'S STATE
    }else if(region){
        totalState = await getCovidStatsBy(`states/${region}/current`);
        displayData({region: 'state', data: totalState})
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

$('.search').on('click', () => {
    console.log($('#state').val())
});