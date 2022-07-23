const form = document.getElementById("form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

const getFormData=()=>{
	let bodyFormData = {
		username: username.value,
		password: password.value,
	}
return bodyFormData;
}

loginBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    let data = getFormData();
	axios({
		method: "post",
		url: "/login",
		crossdomain: true,
		data: data,
	})
		.then((response) => {
            console.log(response)
            if(response.status === 200) {
				form.reset();
				let currentUrl = window.location.href;
				let baseUrl = currentUrl.replace('login', "");
				window.location.href = `${baseUrl}dashboard`
            }else{
                alert('Username or Password Incorrect')
			}
		})
		.catch((error) => {
			alert('login error, please try again')
			console.log(">>>>>.....>>>>: " + error.message);
		});
})