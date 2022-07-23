if (confirm("Are You Sure You Want To Reboot The System!")) {
      axios({
        method: "post",
        url: "/api/reboot-now",
        crossdomain: true,
      }).then((response) => {
        $(function () {
          console.log(response);
        });
      });  
  } else {
    window.location.href = "dashboard.html";
  }

  