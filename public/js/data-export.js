// Table Generator

let dataDisplay = document.querySelector('#displaySearchData')
let getDataBtn = document.querySelector('#getData')
let startDate = document.querySelector('#datePickerStart')
let endDate = document.querySelector('#datePickerEnd')




const createTable=(tableData)=>{

  let table = new Tabulator("#displaySearchData", {
      data: tableData,
      autoResize: true,
      height: 400,
      virtualDomBuffer:300,
      // virtualDomHoz:true,
      placeholder: 'Data Not Found',
      // layout:"fitColumns",
      layout:"fitDataStretch",
  
      columns:[
        {title:"Site ID", field:"siteID", sorter: 'string', editor:"false"},
        {title:"Timestamp", field:"createdAt", sorter: 'string', editor:"false"},
        {title:"Com connected", field:"comConnected", align:"center", sorter: 'string', editor:false},
        {title:"AC First A Phase power factor", field:"ACFirstAphasePowerFactor", align:"center", sorter: 'number', editor:false},
        {title:"AC First B Phase power factor", field:"ACFirstBphasePowerFactor", align:"center", sorter: 'number', editor:false},
        {title:"AC First C Phase power factor", field:"ACFirstCphasePowerFactor", align:"center", sorter: 'number', editor:false},
        {title:"AC First Total power factor", field:"ACFirstTotalPowerFactor", align:"center", sorter: 'number', editor:false},
        {title:"AC Meter working status", field:"ACMeterWorkingStatus", align:"center", sorter: 'number', editor:false},
        {title:"AC source total power downtime", field:"ACSourceTotalPowerDownTime", align:"center", sorter: 'number', editor:false},
        {title:"AC current time DDhh", field:"ACcurrenTimeDDhh", align:"center", sorter: 'number', editor:false},
        {title:"AC current time YYMM", field:"ACcurrenTimeYYMM", align:"center", sorter: 'number', editor:false},
        {title:"AC current time MMSS", field:"ACcurrenTimemmss", align:"center", sorter: 'number', editor:false},
        {title:"AC electrical meter failure alarm", field:"ACelectricalMeterFailureAlarm", align:"center", sorter: 'number', editor:false},
        {title:"AC first active power phase A", field:"ACfirstActivePowerPhaseA", align:"center", sorter: 'number', editor:false},
        {title:"AC first active power phase B", field:"ACfirstActivePowerPhaseB", align:"center", sorter: 'number', editor:false},
        {title:"AC first active power phase C", field:"ACfirstActivePowerPhaseC", align:"center", sorter: 'number', editor:false},
        {title:"AC first apparent power phase A", field:"ACfirstApparentPowerPhaseA", align:"center", sorter: 'number', editor:false},
        {title:"AC first apparent power phase B", field:"ACfirstApparentPowerPhaseB", align:"center", sorter: 'number', editor:false},
        {title:"AC first apparent power phase C", field:"ACfirstApparentPowerPhaseC", align:"center", sorter: 'number', editor:false},
        {title:"AC first phase A current", field:"ACfirstAphaseCurrent", align:"center", sorter: 'number', editor:false},
        {title:"AC first phase B current", field:"ACfirstBphaseCurrent", align:"center", sorter: 'number', editor:false},
        {title:"AC first phase C current", field:"ACfirstCphaseCurrent", align:"center", sorter: 'number', editor:false},
        {title:"AC first combined active total power 1", field:"ACfirstCombinedActiveTotalPower1", align:"center", sorter: 'number', editor:false},
        {title:"AC first combined active total power 2", field:"ACfirstCombinedActiveTotalPower2", align:"center", sorter: 'number', editor:false},
        {title:"AC first combined reactive power 1 total electric energy 1", field:"ACfirstCombinedReactivePower1TotalElectricEnergy1", align:"center", sorter: 'number', editor:false},
        {title:"AC first combined reactive power 1 total electric energy 2", field:"ACfirstCombinedReactivePower1TotalElectricEnergy2", align:"center", sorter: 'number', editor:false},
        {title:"AC first combined reactive power 2 total electric energy 1", field:"ACfirstCombinedReactivePower2TotalElectricEnergy1", align:"center", sorter: 'number', editor:false},
        {title:"AC first combined reactive power 2 total electric energy 2", field:"ACfirstCombinedReactivePower2TotalElectricEnergy2", align:"center", sorter: 'number', editor:false},
        {title:"AC first positive active total energy 1", field:"ACfirstPositiveActiveTotalEnergy1", align:"center", sorter: 'number', editor:false},
        {title:"AC first positive active total energy 2", field:"ACfirstPositiveActiveTotalEnergy2", align:"center", sorter: 'number', editor:false},
        {title:"AC first reactive power phase A", field:"ACfirstReactivePowerPhaseA", align:"center", sorter: 'number', editor:false},
        {title:"AC first reactive power phase B", field:"ACfirstReactivePowerPhaseB", align:"center", sorter: 'number', editor:false},
        {title:"AC first reactive power phase C", field:"ACfirstReactivePowerPhaseC", align:"center", sorter: 'number', editor:false},
        {title:"AC first reverse active power total energy 1", field:"ACfirstReverseActivePowerTotalEnergy1", align:"center", sorter: 'number', editor:false},
        {title:"AC first reverse active power total energy 2", field:"ACfirstReverseActivePowerTotalEnergy2", align:"center", sorter: 'number', editor:false},
        {title:"AC first total active power", field:"ACfirstTotalActivePower", align:"center", sorter: 'number', editor:false},
        {title:"AC first total apparent power", field:"ACfirstTotalApparentPower", align:"center", sorter: 'number', editor:false},
        {title:"AC first total reactive power", field:"ACfirstTotalReactivePower", align:"center", sorter: 'number', editor:false},
        {title:"AC Frequency", field:"ACfrequency", align:"center", sorter: 'number', editor:false},
        {title:"AC phase A voltage", field:"ACphaseAVoltage", align:"center", sorter: 'number', editor:false},
        {title:"AC phase B voltage", field:"ACphaseBVoltage", align:"center", sorter: 'number', editor:false},
        {title:"AC phase C voltage", field:"ACphaseCVoltage", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 1 Active Power", field:"DCch1ActivePower", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 1 Combined Active Energy", field:"DCch1CombinedActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 1 current", field:"DCch1Current", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 1 Negative active energy", field:"DCch1NegativeActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 1 Positive active energy", field:"DCch1PositiveActiveEnergy", align:"center", sorter: 'number', editor:false},

        {title:"DC Channel 2 Active Power", field:"DCch2ActivePower", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 2 Combined Active Energy", field:"DCch2CombinedActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 2 current", field:"DCch2Current", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 2 Negative active energy", field:"DCch2NegativeActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 2 Positive active energy", field:"DCch2PositiveActiveEnergy", align:"center", sorter: 'number', editor:false},

        {title:"DC Channel 3 Active Power", field:"DCch3ActivePower", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 3 Combined Active Energy", field:"DCch3CombinedActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 3 current", field:"DCch3Current", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 3 Negative active energy", field:"DCch3NegativeActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 3 Positive active energy", field:"DCch3PositiveActiveEnergy", align:"center", sorter: 'number', editor:false},

        {title:"DC Channel 4 Active Power", field:"DCch4ActivePower", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 4 Combined Active Energy", field:"DCch4CombinedActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 4 current", field:"DCch4Current", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 4 Negative active energy", field:"DCch4NegativeActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 4 Positive active energy", field:"DCch4PositiveActiveEnergy", align:"center", sorter: 'number', editor:false},

        {title:"DC Channel 5 Active Power", field:"DCch5ActivePower", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 5 Combined Active Energy", field:"DCch5CombinedActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 5 current", field:"DCch5Current", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 5 Negative active energy", field:"DCch5NegativeActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 5 Positive active energy", field:"DCch5PositiveActiveEnergy", align:"center", sorter: 'number', editor:false},

        {title:"DC Channel 6 Active Power", field:"DCch6ActivePower", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 6 Combined Active Energy", field:"DCch6CombinedActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 6 current", field:"DCch6Current", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 6 Negative active energy", field:"DCch6NegativeActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC Channel 6 Positive active energy", field:"DCch6PositiveActiveEnergy", align:"center", sorter: 'number', editor:false},
        {title:"DC voltage", field:"DCvoltage", align:"center", sorter: 'number', editor:false},

        {title:"Alarms", field:"alarms", align:"center", sorter: 'number', editor:false},
        {title:"Battery Temperature", field:"batTemp", align:"center", sorter: 'number', editor:false},

        {title:"Digital In 1", field:"digitalIn1", align:"center", sorter: 'number', editor:false},
        {title:"Digital In 2", field:"digitalIn2", align:"center", sorter: 'number', editor:false},
        {title:"Digital In 3", field:"digitalIn3", align:"center", sorter: 'number', editor:false},
        {title:"Digital In 4", field:"digitalIn4", align:"center", sorter: 'number', editor:false},
        {title:"Digital Out 1", field:"digitalOut1", align:"center", sorter: 'number', editor:false},
        {title:"Digital Out 2", field:"digitalOut2", align:"center", sorter: 'number', editor:false},
        {title:"Digital Out 3", field:"digitalOut3", align:"center", sorter: 'number', editor:false},
        {title:"Digital Out 4", field:"digitalOut4", align:"center", sorter: 'number', editor:false},

        {title:"Internet", field:"internet", align:"center", sorter: 'string', editor:false},
        {title:"LM35 Failed", field:"lm35Failed", align:"center", sorter: 'number', editor:false},
        {title:"Outside humidity", field:"outSideHumi", align:"center", sorter: 'number', editor:false},
        {title:"Outside Temperature", field:"outSideTemp", align:"center", sorter: 'number', editor:false},
        {title:"Server connectivity", field:"serverConnectivity", align:"center", sorter: 'string', editor:false},
        {title:"System voltage", field:"sysVolt", align:"center", sorter: 'number', editor:false},
        {title:"TH22 Failed", field:"th22Failed", align:"center", sorter: 'number', editor:false},
        
      ],
      
    });
    $("#downloadDataButton").click(function(){
      table.download("xlsx", "data.xlsx", {sheetName:"My Data"});
    });
}

// $(window).resize(function(){
//   $("#displaySearchData").tabulator("redraw", true); //trigger full rerender including all data and rows
// });


let addSpinnerDiv =()=>{
  let spinnerDiv = document.createElement('div')
      spinnerDiv.classList = 'flex-col spinner-div'
    
  let spinnerImage = document.createElement('img')
      spinnerImage.classList = 'spinner-image'
      spinnerImage.src = './assets/images/spinner.gif'

  let spinnerText = document.createElement('p')
      spinnerText.classList = 'spinner-text'
      spinnerText.innerText = 'Fetching Data, please wait'
    
  spinnerDiv.appendChild(spinnerImage)
  spinnerDiv.appendChild(spinnerText)

  dataDisplay.appendChild(spinnerDiv)
}

let removeSpinnerDiv =()=>{
    let spinnerDiv = document.querySelector('.spinner-div')
    spinnerDiv.remove();
}

let checkDateValue=()=>{
    if ((startDate.value === "") || (endDate.value === "")){
      alert('Please select a valid start and/or end date')
      return false;
    }
    else{
      return true;
    }
}

let compareDateValue =()=>{
  let start = new Date(startDate.value)
  let end = new Date(endDate.value)
    if (start > end){
      alert('Your start date is ahead of the end date, kindly correct this and try again')
      return false;
    }
    else{
      return true;
    }
}

    $("#getData").click(function () {
        dataDisplay.innerText = ''

        if(checkDateValue() === false){
        console.log('empty dates')
      }
      else if(compareDateValue() === false){
        console.log('invalid date order')
      }
      else{
          addSpinnerDiv()  
          axios({
            method: 'post',
            url: "/api/exportData",
            crossdomain: true,
            data: {
              startDate: formatDate(startDate.value),
              endDate:   formatDate(endDate.value)
            }
          })
            .then((response) => {
              $(function () {
                removeSpinnerDiv()
                console.log(response)
                  createTable(response.data)
               })
            })
            .catch((error) => {
              console.log(">>>>>.....>>>>: " + error.message)
            });
      }
    })
        
const formatDate=(data)=>{
  let dateArray = data.split("-").reverse();
  return `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`
}