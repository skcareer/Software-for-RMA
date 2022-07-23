if (confirm("Are You Sure You Want To Shutdown!")) {
  shutdown();
} else {
  window.location.href = "dashboard.html";
}

let shutdown = () => {
  axios({
    method: "get",
    url: "/api/shutdown",
    crossdomain: true,
  }).then((response) => {
    $(function () {
      console.log(response);
    });
  });
};
