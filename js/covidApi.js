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

    // ALL THE DATA, UNFILTERED
    console.log(data.data)
}
// TODO PASS THE region TO THE getData FUNCTION, SO WE ONLY CALL THE DATA WE NEED WHEN WE NEED IT, ATM WE'RE MAKING 4 CALLS EVERY PAGE LOAD
async function getData(region){
    let getCovidStatsBy = async (region) => {
        return await fetch(`https://covidtracking.com/api/v1/${region}.json`).then(response => response.json())
    }
    
    let totalUs = await getCovidStatsBy('us/current');
    let totalStates = await getCovidStatsBy('states/current')
// TODO HARDCODED TO NH HERE, WILL NEED TO DYNAMICALLY CHANGE THAT BASED ON GEOLOCAITON API
    let totalState = await getCovidStatsBy('states/NH/current');
    let totalCounties = await getCovidStatsBy('counties');
// TODO MAKE THIS LOOPABLE, IF NEEDED, OR SEND ALL OF THE DATA AT ONCE?
    // displayData({region: 'country', data: totalUs[0]})
    // displayData({region: 'states', data: totalStates})
    displayData({region: 'state', data: totalState})
    // displayData({region: 'counties', data: totalCounties})
}

getData()




