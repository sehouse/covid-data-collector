$(function(){
    getAddress()
    displayRegionOptions()

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

function displayData(data, display){
    if(data.region == 'country'){
        console.log('country level data is present');
  
    }
    // TODO BONUS: TIME PERMITTING, MAP OF US WITH STATE SPECIFIC DATA ON HOVER
    // if(data.region == 'states'){
    //     console.log('states level data is present')
    // }
    if(data.region == 'state'){

        console.log(`single state ${data.data.state} level data is present`);
      
    }
    // TODO DON'T DISPLAY null OR undefined VALUES
    $('#stats').html(
        `<h1>Region Level: ${data.region} ${data.data.state ? data.data.state : ''}</h1>
        <ul>
            <li>Current as of: ${data.region == 'country' ? data.data.lastModified : data.data.dateModified}</li>

            ${display.hospitalizedCumulative ? `<li>Total hospitalizaitons: ${data.data.hospitalizedCumulative}</li>` : ''}
            ${display.hospitalizedCurrently ? `<li>Current Hospitalizations: ${data.data.hospitalizedCurrently}</li>` : ''}
            ${display.inIcuCumulative ? `<li>Total ICUs: ${data.data.inIcuCumulative}</li>` : ''}
            ${display.inIcuCurrently ? `<li>Current ICUs: ${data.data.inIcuCurrently}</li>` : ''}
            ${display.onVentilatorCumulative ? `<li>Total Ventilators used: ${data.data.onVentilatorCumulative}</li>` : ''}
            ${display.onVentilatorCurrently ? `<li>Current Ventilators in use: ${data.data.onVentilatorCurrently}</li>` : ''}
            ${display.recovered ? `<li>Total Recoveries: ${data.data.recovered}</li>` : ''}
            ${display.death ? `<li>Total Deaths: ${data.data.death}</li>` : ''}
            ${display.totalTestResults ? `<li>Total Test Results: ${data.data.totalTestResults}</li>` : ''}
            ${display.negative ? `<li>Total Test Results (Negative): ${data.data.negative}</li>` : ''}
            ${display.positive ? `<li>Total Test Results (Positive): ${data.data.positive}</li>` : ''}
            ${display.dataQualityGrade ? `<li>Data Quality: ${data.data.dataQualityGrade ? data.data.dataQualityGrade : 'N/A'}</li>` : ''}
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
    // IF COMING FROM IP ADDRESS, LOCATION DATA WILL BE AN OBJECT
    // ELSE, LOCATION DATA WILL BE A STRING FROM THE FRONTEND OPTIONS LIST
    if(typeof data == 'object'){
        abbr = (data.country !== 'US' ? data.country : getStateTwoDigitCode(data.region));
    }else{
        abbr = getStateTwoDigitCode(data);
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
        displayData({region: 'state', data: totalState}, confirmCheckBoxes($('.data-selector')));
    }else{
        totalUs = await getCovidStatsBy(`us/current`);
        displayData({region: 'country', data: totalUs[0]}, confirmCheckBoxes($('.data-selector')));
    }
}

async function getAddress(region){
    let getIP = async (region) => {
        return await fetch(`https://ipinfo.io?token=5fcea70b36eb66`).then(response => response.json());
    }
    let ip = await getIP();
    passToCovidAPI(ip);
}

$('.search').on('click', () => {
    // TODO PULL CHECKBOX VALUES TO FILTER DATA
    passToCovidAPI($('#state').val());
    
});

function confirmCheckBoxes(parent){
    let inputs = parent.children('input');
    let displayOptions = {
        hospitalizedCumulative : false,
        hospitalizedCurrently : false,
        inIcuCumulative : false,
        inIcuCurrently : false,
        onVentilatorCumulative : false,
        onVentilatorCurrently : false,
        recovered : false,
        death : false,
        totalTestResults : false,
        negative : false,
        positive : false,
        dataQualityGrade : false
    };

    inputs.each(function() {
        if(this.checked){
            displayOptions[this.id] = true;
        }
    })

    return displayOptions;
  
}

$('.search').on('click', () => { passToCovidAPI($('#state').val()) })
