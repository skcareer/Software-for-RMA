
const form = document.getElementById("form");

const siteName = document.getElementById("siteName");
const siteId = document.getElementById("siteId");
const region = document.getElementById("region");
const address = document.getElementById("address");
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const tenant1 = document.getElementById("tenant1");
const tenant2 = document.getElementById("tenant2");
const tenant3 = document.getElementById("tenant3");
const tenant4 = document.getElementById("tenant4");
const tenant5 = document.getElementById("tenant5");
const tenant6 = document.getElementById("tenant6");
const gensetCapacity = document.getElementById('gensetCapacity');
const submitBtn = document.getElementById("submitButton");
const editBtn = document.getElementById("editButton");
const resetBtn = document.getElementById("resetButton");
const allInputs = document.querySelectorAll("input");


const getFormData=()=>{
	let bodyFormData = {
		siteName: siteName.value,
		siteId: siteId.value,
		region: region.value,
		address: address.value,
		latitude: latitude.value,
		longitude: longitude.value,
		tenant1: tenant1.value,
		tenant2: tenant2.value,
		tenant3: tenant3.value,
		tenant4: tenant4.value,
		tenant5: tenant5.value,
		tenant6: tenant6.value,
		gensetCapacity: gensetCapacity.value,
	}
return bodyFormData;
}

// const checkSiteID=()=>{
// 	let newOpeArray = JSON.parse(opeArray);
// 	if(newOpeArray.length > 0){
// 		console.log("siteId  Already Exist");
// 		alert("siteId  already exist. You can only edit the current config");
// 		submitBtn.classList.remove('enabled');
// 		submitBtn.classList.add('disabled');
// 	}
// 	else{
// 		submitBtn.classList.remove('disabled');
// 		submitBtn.classList.add('enabled');
// 	}
// }
// checkSiteID();

// to be deleted after integration
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

const createNewConfig =()=>{
	let data = getFormData();
	axios({
		method: "post",
		url: "/api/createoperation",
		crossdomain: true,
		data: data,
		// headers: { "Content-Type": "multipart/form-data" },
	})
		.then((response) => {
	 console.log(response)
	 alert('Config Created Successfully')
		})
		.catch((error) => {
			alert('Config not created, please try again')
			console.log(">>>>>.....>>>>: " + error.message);
		});
}

const editConfig = ()=>{
	console.log(`Edit Form Data: ${JSON.stringify(getFormData())}`);
	let data = getFormData();
	console.log(data);
	axios({
		method: "post",
		url: "/api/editconfiguration",
		crossdomain: true,
		data: data,
		// headers: { "Content-Type": "multipart/form-data" },
	})
		.then((response) => {
		  if(response.data.status === "updated"){
			console.log(response)
			alert('Config Updated Successfully')
		  }
		})
		.catch((error) => {
			alert('Config not updated, please try again')
			console.log(">>>>>.....>>>>: " + error.message);
		});
}

let populateCurrentData=(data)=>{
    siteName.value = data?.siteName || '';
    siteId.value = data?.siteID || '';
    region.value = data?.region || '';
    address.value = data?.address || '';
    longitude.value = data?.longitude || '';
    latitude.value = data?.latitude || '';
    tenant1.value = data?.tenant1 || '';
    tenant2.value = data?.tenant2 || '';
    tenant3.value = data?.tenant3 || '';
    tenant4.value = data?.tenant4 || '';
    tenant5.value = data?.tenant5 || '';
    tenant6.value = data?.tenant6 || '';
    gensetCapacity.value = data?.gensetCapacity || '';
}

function checkInputs() {
	// trim to remove the whitespaces
	const siteIdValue = siteId.value.trim();
	let nameRegex = /[.!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/gi;
	let spaceRegex = /\s/gi;

	if (isFinite(siteIdValue)) {
		alert(siteId, "Site ID cannot be Numbers alone. AlphaNumeric characters only");
	} else if (siteIdValue.match(nameRegex)) {
		alert(siteId, "Site ID can only contain AlphaNumeric characters, dash and underscore");
	} else if (siteIdValue.match(spaceRegex)) {
		alert( siteId, "Site ID cannot contain spaces. Use a single word");
	} 
	else{
		form.submit();
	}
}

resetBtn.addEventListener('click', (e)=>{
	e.preventDefault();

	if (confirm('Are you sure you want to RESET this configuration?')){
		axios({
		method: "post",
		url: `/deleteoperation`,
		crossdomain: true,
	})
		.then((response) => {
			console.log(response.data)
			if(response.data.status === 200) {
				alert('Configuration reset successful')
				populateCurrentData({});
		  submitBtn.classList.add('enabled');
		  submitBtn.classList.remove('disabled');
		  [...allInputs].map(element=>{
			element.setAttribute('readonly', false);
		})
		form.reset()
			}else{
				alert('Configuration reset unsuccessful, please try again')
			}
		})
		.catch((error) => {
			console.log(">>>>>.....>>>>: " + error.message);
		});
	}
})

editBtn.addEventListener('click', (e)=>{
	e.preventDefault();

	if (confirm('Are you sure you want to EDIT this configuration?')){
		[...allInputs].map(element=>{
			element.removeAttribute('readonly');
			})
			submitBtn.classList.add('enabled');
			submitBtn.classList.remove('disabled');
	}
})
let configStatus = '';
const getSiteDetails=()=> {
	axios({
		  method: "get",
		  url: "/api/getConfig",
		  crossdomain: true,
	  })
		  .then((response) => {
		if(response?.data?.data?.toLowerCase() === 'not configure'){
			alert('Device has not been configured, kindly create a configuration')
			populateCurrentData({})
			configStatus = 'new'
		}else{
		  populateCurrentData(response.data[0]);
		  submitBtn.classList.add('disabled');
		  submitBtn.classList.remove('enabled');
		  [...allInputs].map(element=>{
			element.setAttribute('readonly', true)
			// element.disabled = true;
			});
		configStatus = 'existing'
		}
		  })
		  .catch((error) => {
			  alert('An error occured, please try again')
			  console.log(">>>>>.....>>>>: " + error.message);
		  });
  };
  getSiteDetails()

  submitBtn.addEventListener('click', (e)=>{
	  e.preventDefault();
	checkInputs();
	  if(configStatus.toLowerCase() === 'new'){
		  createNewConfig()
	  }else{
		  editConfig();
	  }
  })