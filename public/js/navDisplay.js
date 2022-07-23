let adminNavs = document.querySelectorAll(".admin");
let operatorNavs = document.querySelectorAll(".operator");

const getUser=()=>{
    axios({
      method: "get",
      url: "/api/getCurrentUser",
      crossdomain: true,
    })
      .then((response) => {
              console.log(response)
              if(response.data.currentUser.toLowerCase() === 'admin') {
                   [...adminNavs].map(element=>{
            return element.setAttribute('style', 'display: block !important;');
        })
              }else{
                [...operatorNavs].map(element=>{
                    return element.setAttribute('style', 'display: block !important;');
                });
              }
      })
      .catch((error) => {
        [...operatorNavs].map(element=>{
            return element.setAttribute('style', 'display: block !important;');
        });
        console.log(">>>>>.....>>>>: " + error.message);
      });
};
getUser();
