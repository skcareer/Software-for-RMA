const dataDiv = document.querySelector('#dc-meter-data-div');

const displayData =()=>{
    let index = 0;
    dataDiv.innerText = ''

    for(const item in dashboardData){
        if(item.substr(0,2).toLowerCase() === 'dc'){
            index++
            let result = `
            <div class="row item-wrapper">
            <div class="col-md-8 title-div">
                <span class='serial-number'>${index.toString().padStart(2,0)}.</span>
                <span class='title-value'>${item}</span>
            </div>
            <div class="col-md-4 value">${dashboardData[item]}</div>
        </div>
        `;    
        dataDiv.insertAdjacentHTML("beforeend", result);
       }
    }
}

setInterval(() => {
    displayData()
}, 2500);