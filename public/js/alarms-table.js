// Table Generator
let activeAlarmsGroup = document.querySelector('.active-alarms-group')
let alarmHistoryDisplay = document.querySelector('#alarms-display-div')
let getDataBtn = document.querySelector('#getData');
let startDate = document.querySelector('#datePickerStart')
let endDate = document.querySelector('#datePickerEnd')

let createActiveAlarms = (data) =>{

  activeAlarmsGroup.innerText = '';

  if(data.length === 0){
    activeAlarmsGroup.innerText = 'There is no alarm in the system'
  }
  else{
    for(let x=0; x < data.length; x++){
      console.log(data[x])
      let listItem = document.createElement('li')
      
      let numberSpan = document.createElement('span') 
          numberSpan.classList = 'numberingSpan'
          numberSpan.innerText = `${x+1} - `
        
      let valueSpan = document.createElement('span')
          valueSpan.classList = 'alarm-item'
          valueSpan.innerText = data[x];
  
      listItem.appendChild(numberSpan)
      listItem.appendChild(valueSpan)
  
      activeAlarmsGroup.appendChild(listItem)
    }
  }
}

fetch('../api/activeAlarms')
.then(resp=>resp.json())
.then(data=>{
  createActiveAlarms(data)
})

const createAlarmHistoryTable=(tableData)=>{

  let table = new Tabulator("#alarms-display-div", {
      data: tableData,
      autoResize: true,
      height: 400,
      virtualDomBuffer:300,
      placeholder: 'Data Not Found',
      layout:"fitColumns",
      columnMinWidth:160, // Minimum column width in px (default = 40)
  
      columns:[
      {title:"Operation Name", field:"operationName", sorter: 'string', editor:"false", },
      {title:"Alarm Name", field:"alarmName", sorter: 'string', editor:"false"},
      {title:"Severity", field:"severity", sorter: 'string', editor:"false"},
    ],
      
    });

    $("#downloadDataButton").click(function(){
      table.download("xlsx", "Alarm History.xlsx", {sheetName:"Alarm History Data"});
    });
}

// $(window).resize(function(){
//   $("#alarms-display-div").tabulator("redraw", true); //trigger full rerender including all data and rows
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

  alarmHistoryDisplay.appendChild(spinnerDiv)
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
console.log(start, end)
  if (start > end){
    alert('Your start date is ahead of the end date, kindly correct this and try again')
    return false;
  }
  else{
    return true;
  }
}

$("#getData").click(function () {

    alarmHistoryDisplay.innerText = ''

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
      url: "/api/exportAlarms",
      crossdomain: true,
      data: {
        startDate: formatDate(startDate.value),
        endDate:   formatDate(endDate.value)
      }
    })
      .then((response) => {
        $(function () {
          removeSpinnerDiv()
          createAlarmHistoryTable(response.data)
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





