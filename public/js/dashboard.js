let siteName = document.querySelector('#site-name');
let siteID = document.querySelector('#site-id');
let serverConnection = document.querySelector('#server-connection');
let systemVoltage = document.querySelector('#system-voltage');
let internet = document.querySelector('#internet');
let timeAndDate = document.querySelector('#time-and-date');
let alarmCount = document.querySelector('#alarm-count');
let logOutBtn = document.querySelector('#logOut-button');
let leftTenantColumn = document.querySelector('#leftTenantColumn');
let rightTenantColumn = document.querySelector('#rightTenantColumn');
let gensetCapacity = document.querySelector('#gensetCapacity');

setInterval(() => {
  let date = new Date();
  alarmCount.innerText = dashboardData?.alarms?.length || 0;
  timeAndDate.innerText = `${date.toDateString(dashboardData.serverTime)};  ${date.getHours(dashboardData.serverTime)}:${date.getMinutes(dashboardData.serverTime)}:${date.getMinutes(dashboardData.serverTime)}:${date.getSeconds(dashboardData.serverTime)}`;
  serverConnection.innerText = dashboardData.serverConnectivity ? 'Connected' : 'Not Connected';
  systemVoltage.innerText = dashboardData.DCvoltage || 'Not Available';
internet.innerText = dashboardData?.internet ? 'Online' : 'Offline';
  displayTenantDetails(dashboardData);
  displayGeneratorDetails(dashboardData);
}, 2500);


const displayTenantDetails =(data)=>{
  for(let id=1; id <= 6; id++){
   let tenantId = document.querySelector(`#tenant-${id}`);
   let currentValue = tenantId.querySelector('.current-value');
   let energyValue = tenantId.querySelector('.energy-value');
   let powerValue = tenantId.querySelector('.power-value');

   currentValue.innerText = data[`DCch${id}Current`] !== undefined ? `${data[`DCch${id}Current`]}  A` : 'Not Available';
   energyValue.innerText = data[`DCch${id}CombinedActiveEnergy`] !== undefined ? `${data[`DCch${id}CombinedActiveEnergy`]}  kWh` :  'Not Available';
   powerValue.innerText = data[`DCch${id}ActivePower`] !== undefined ? `${data[`DCch${id}ActivePower`]}  W` : 'Not Available';
  }
}

const displayGeneratorDetails=(data)=> {
  let l1Voltage = document.querySelector('#l1-voltage');
  let l2Voltage = document.querySelector('#l2-voltage');
  let l3Voltage = document.querySelector('#l3-voltage');
  let l1Current = document.querySelector('#l1-current');
  let l2Current = document.querySelector('#l2-current');
  let l3Current = document.querySelector('#l3-current');

  let frequency = document.querySelector('#frequency-value')
  let power = document.querySelector('#power-value')
  let energy = document.querySelector('#energy-value')
  let runHour = document.querySelector('#run-hour-value')
  renderGauge(data)

  l1Voltage.innerText = data.ACphaseAVoltage !== undefined ?  `${data.ACphaseAVoltage} V` : 'N/A';
  l2Voltage.innerText = data.ACphaseBVoltage !== undefined ?  `${data.ACphaseBVoltage} V` : 'N/A';
  l3Voltage.innerText = data.ACphaseCVoltage !== undefined ?  `${data.ACphaseCVoltage} V` : 'N/A';

  l1Current.innerText = data.ACfirstAphaseCurrent !== undefined ?  `${data.ACfirstAphaseCurrent} A` : 'N/A';
  l2Current.innerText = data.ACfirstBphaseCurrent !== undefined ?  `${data.ACfirstBphaseCurrent} A` : 'N/A';
  l3Current.innerText = data.ACfirstCphaseCurrent !== undefined ?  `${data.ACfirstCphaseCurrent} A` : 'N/A';

  frequency.innerText = data.ACfrequency !== undefined ? `${data.ACfrequency} Hz` : "N/A";
  power.innerText = data?.ACfirstTotalActivePower !== undefined ? `${data.ACfirstTotalActivePower} kW` : "N/A";
  energy.innerText = data?.ACfirstPositiveActiveTotalEnergy2 !== undefined ? `${data.ACfirstPositiveActiveTotalEnergy2} kWh` : "N/A";
  runHour.innerText = data?.runHour !== undefined ? `${data.runHour} hr` : "N/A";
}

const displayTenantName = (data)=>{
  for(let id=1; id <= 6; id++){
    let tenantId = document.querySelector(`#tenant-${id}`);
    let tenantName = tenantId.querySelector('.card-header');
    tenantName.innerText = data[0][`tenant${id}`] !== undefined ? data[0][`tenant${id}`] : 'Not Available';
   }
}

const siteDetailsData = {
	address: "1 Olatundun Ayanleke Close Off Ponle Street Alimosho ",
createdAt: "2021-10-30T00:51:48.857Z",
customerName: "TestCustomer",
deviceID: "80:00:00:00:01:09:A2:B8",
latitude: 7,
longitude: 3,
region: "Lagos",
siteName: "ABC",
tenant1: "MTN",
tenant2: "Airtel",
tenant3: "9mobile",
tenant4: "Glo",
tenant5: "Swift",
tenant6: 'Smile',
siteID: 'IHS_LAG_001'
}

const getSiteDetails=()=> { 
  axios({
		method: "get",
		url: "/api/getConfig",
		crossdomain: true,
	})
		.then((response) => {
      console.log(response.data.data)
      if(response.data.data === 'Not Configure'){
          displayTenantName([{}]);
          siteName.innerText = 'Not Available';
          gensetCapacity.innerText = 'N/A';
      }else{
        siteName.innerText = response?.data[0].siteName || 'Not Available';
        siteID.innerText = response?.data[0].siteID || 'Not Available';
        gensetCapacity.textContent = response?.data[0].gensetCapacity !== undefined ? `${response?.data[0].gensetCapacity} kVa` : "N/A";
        displayTenantName(response.data)
      }
     
		})
		.catch((error) => {
			console.log(">>>>>.....>>>>: " + error.message);
		});
};
getSiteDetails();

// to be deleted after integration
// siteName.innerText = siteDetailsData?.siteName || 'Not Available';
// siteID.innerText = siteDetailsData?.siteID || 'Not Available';
// displayTenantName(siteDetailsData)

const renderGauge=(data)=>{
  let batteryTemperature = document.querySelector('#battery-temperature-gauge')
  let outsideTemperature = document.querySelector('#outside-temperature-gauge')
  let outsideHumidity = document.querySelector('#outside-humidity-gauge')
  let panelDoor = document.querySelector('#panel-door')

  batteryTemperature.innerText = '';
  outsideHumidity.innerText = '';
  outsideTemperature.innerText = '';
  panelDoor.innerText = '';

 new PercentChart("battery-temperature-gauge",{
      delay: '.2s',
      textDuration: '.1s',
      chartDuration: '1s',
      easing: 'linear',
      data:{
          percent: data.batTemp > 100 ? 100 : data.batTemp,
          actual: data.batTemp > 100 ? 100 : data.batTemp,
          unit: ''
      },
      enableHover:false,
      direction: "ccw"
  })

  new PercentChart("outside-temperature-gauge",{
    delay: '.2s',
    textDuration: '.1s',
    chartDuration: '1s',
    easing: 'linear',
    data:{
        percent:data.outSideTemp,
        actual:data.outSideTemp,
        unit: ''
    },
    enableHover:false,
    direction: "ccw"
})

new PercentChart("outside-humidity-gauge",{
  delay: '.2s',
  textDuration: '.1s',
  chartDuration: '1s',
  easing: 'linear',
  data:{
      percent:data.outSideHumi,
      actual:data.outSideHumi,
      unit: ''
  },
  enableHover:false,
  direction: "ccw"
})

new PercentChart("panel-door",{
  delay: '0s',
  textDuration: '0s',
  chartDuration: '0s',
  easing: 'linear',
  data:{
      percent: data?.digitalIn1 === 0 ? 0 : 100,
      actual: data?.digitalIn1 === 0 ? 'Closed' : 'Opened',
      unit: ''
  },
  enableHover:false,
  direction: "ccw"
})

}


  




