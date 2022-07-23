const waterValveSlider = document.querySelector('.water-valve-open-percentage');
const waterValveValue = document.querySelector(
  '.water-valve-open-percentage-value'
);
const conveyorSlider = document.querySelector('.conveyor-open-speed');
const conveyorValue = document.querySelector('.conveyor-open-speed-value');
const hammerMillSlider = document.querySelector('.hammer-mill-open-speed');
const hammerMillValue = document.querySelector('.hammer-mill-open-speed-value');

waterValveSlider.oninput = function () {
  waterValveValue.innerHTML = this.value;
};

conveyorSlider.oninput = function () {
  conveyorValue.innerHTML = this.value;
};

hammerMillSlider.oninput = function () {
  hammerMillValue.innerHTML = this.value;
};

const getOperationDiv = (data) => {
  const parentDiv = data.parentNode.parentNode;
  return parentDiv;
};
const allStartBtns = document.querySelectorAll('.start-btn');
const [...allStartBtnsArray] = allStartBtns;

const allStopBtns = document.querySelectorAll('.stop-btn');
const [...allStopBtnsArray] = allStopBtns;

const disableStartBtn = (div) => {
  const btn = div.querySelector('.start-btn');
  btn.classList.add('disabled')
};

const enableStartBtn = (div) => {
  const btn = div.querySelector('.start-btn');
  btn.classList.remove('disabled')
};

const executeOperation=(div, url, state, action)=>{
  axios({
    method: 'post',
    url: url,
    crossdomain: true, 
    data: {state: state}
  })
  .then((response) => {
    if (response.data.status === 'NOK') {
      alert('Operation Failed. Please try again');
    } else {
      if(action === 'start'){
        alert('Operation Started. Thank you');
        disableStartBtn(div);
      }
      else{
        alert('Operation Stopped. Thank you');
        enableStartBtn(div);
      }
    }             
  })
  .catch((error) => {
  console.log(">>>>>.....>>>>: " + error.message)    
  });
}

const buttonAction = (div, action) => {
  const operationName = div
    .querySelector('.operation-name')
    .innerText.toLowerCase();

    action === 'start' ? (state = 'true') : (state = 'false');
 
  switch (operationName) {
    case 'hammer mill':
      const hammerMillSpeed = div.querySelector('.value-span').innerText;

      if(Number(hammerMillSpeed) >= 600 && Number(hammerMillSpeed) <=3000 ){
        axios({
          method: 'post',
          url: "/api/manrun/hammermill",
          crossdomain: true, 
          data: {
            state: state,
             speed: (state==='true')? Number(hammerMillSpeed) : 0,
            }
        })
        .then((response) => {
          if (response.data.status === 'NOK') {
            alert('Operation Failed. Please try again');
          } else {
            if(action === 'start'){
              alert('Operation Started. Thank you');
              disableStartBtn(div);
            }
            else{
              alert('Operation Stopped. Thank you');
              enableStartBtn(div);
              div.querySelector('.value-span').innerText = '0';
              div.querySelector('input').value = '0'
            }
          }        
        })
        .catch((error) => {
        console.log(">>>>>.....>>>>: " + error.message)    
        });
      }else{
        alert('Invalid input. Kindly choose a value between 600 and 3000')
      }
      break;

    case 'conveyor':
      const conveyorSpeed = div.querySelector('.value-span').innerText;
    
      if(Number(conveyorSpeed) >= 600 && Number(conveyorSpeed) <=3000 ){
        axios({
          method: 'post',
          url: "/api/manrun/conveyor",
          crossdomain: true, 
          data: {
            state: state,
            speed: (state==='true')? Number(conveyorSpeed) : 0,
          }
        })
        .then((response) => {
          if (response.data.status === 'NOK') {
            alert('Operation Failed. Please try again');
          } else {
            if(action === 'start'){
              alert('Operation Started. Thank you');
              disableStartBtn(div);
            }
            else{
              alert('Operation Stopped. Thank you');
              enableStartBtn(div);
              div.querySelector('.value-span').innerText = '0';
              div.querySelector('input').value = '0'
            }
          }          
        })
        .catch((error) => {
        console.log(">>>>>.....>>>>: " + error.message)    
        });
      }else{
        alert('Invalid input. Kindly choose a value between 600 and 3000')
      }
      break;

    case 'water valve':
      const waterValvePercent = div.querySelector('.value-span').innerText;
     
      if(Number(waterValvePercent) >= 1 && Number(waterValvePercent) <=100 ){
        axios({
          method: 'post',
          url: "/api/manrun/watervalve",
          crossdomain: true, 
          data: {
            state: state,
             percent: (state==='true')? Number(waterValvePercent) : 0,
            }
        })
        .then((response) => {
          console.log(JSON.stringify(response.data));
          if (response.data.status === 'NOK') {
            alert('Operation Failed. Please try again');
          } else {
            if(action === 'start'){
              alert('Operation Started. Thank you');
              disableStartBtn(div);
            }
            else{
              alert('Operation Stopped. Thank you');
              enableStartBtn(div);
              div.querySelector('.value-span').innerText = '0';
              div.querySelector('input').value = '0'

            }
          }        
        })
        .catch((error) => {
        console.log(">>>>>.....>>>>: " + error.message)    
        });
      }else{
        alert('Invalid input. Kindly choose a value between 1 and 100')
      }
      break;

    case 'collector pump':
     executeOperation(div, '/api/manrun/collectpump', state, action )
      break;

    case 'collector mixer':
      executeOperation(div, "/api/manrun/collectmixer", state, action );
      break;

    case 'slurry hold pump':
      executeOperation(div, "/api/manrun/slurryholdpump", state, action );
      break;

    case 'slurry hold mixer':
      executeOperation(div, "/api/manrun/slurryholdmixer", state, action );
      break;
      
    case 'reactor jacket inlet':
      executeOperation(div, "/api/manrun/reactorjacketinlet", state, action );
      break;
      
    case 'reactor mixer':
      executeOperation(div,  "/api/manrun/reactormixer", state, action );
      break;
    
    case 'reactor pump':
      executeOperation(div, "/api/manrun/reactorpump", state, action );
      break;

    case 'reactor heater':
      executeOperation(div, "/api/manrun/reactorheater", state, action );
      break;

    case 'pasteurizer heater':
      executeOperation(div, "/api/manrun/pasteurizerheater", state, action );
      break;
     
    case 'pasteurizer mixer':
      executeOperation(div, "/api/manrun/pasteurizermixer", state, action );
      break;

    case 'pasteurizer pump':
      executeOperation(div, "/api/manrun/pasteurizerpump", state, action );
      break;

    case 'auto clean':
      executeOperation(div, "/api/manrun/autoclean", state, action );
      break;
    
    case 'separator':
      executeOperation(div, "/api/manrun/separator", state, action );
      break;
   
    case 'reactor jacket out valve':
      executeOperation(div, "/api/manrun/reactorjacketoutvalve", state, action );
      break;

    case 'pasteurizer jacket inlet valve':
      executeOperation(div, "/api/manrun/pasteurizerjacketinvalve", state, action );
      break;

    case 'pasteurizer jacket outlet valve':
      executeOperation(div, "/api/manrun/pasteurizerjacketoutvalve", state, action );
      break;
      
    case 'collection tank drain valve':
      executeOperation(div, "/api/manrun/collecttankdrainvalve", state, action );
      break;
     
    case 'hold tank drain valve':
      executeOperation(div, "/api/manrun/holdtankdrainvalve", state, action );
      break;
    
    case 'product tank mixer':
      executeOperation(div, "/api/manrun/producttankmixer", state, action );
      break;
     
    default:
      break;
  }
};

allStartBtnsArray.map((element) => {
  element.addEventListener('click', () => {
    if (confirm("Are You Sure You Want To Start This Operation?")) {
      const operationDiv = getOperationDiv(element);
      buttonAction(operationDiv, 'start');
    } else {
      console.log('Operation not started')
    }
  });
});
allStopBtnsArray.map((element) => {
  element.addEventListener('click', () => {
    if (confirm("Are You Sure You Want To End This Operation?")) {
      const operationDiv = getOperationDiv(element);
      buttonAction(operationDiv, 'stop');
    } else {
      console.log('Operation not ended')
    }
  });
});
