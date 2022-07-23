const express               = require('express');
const bodyParser            = require('body-parser');
var   flash                   = require("connect-flash");
const { exec }              = require('child_process');
var passport                = require("passport");
var localStrategy           = require("passport-local");
var User                    = require("./models/user");
var middleware              = require("./middleware");
const cmd                   = require('node-cmd');
const internetAvailable     = require("internet-available");
const tools                 = require("./tools/tool");
const logger                = require('./tools/logger');
const getOperationData      = require("./tools/operationData");
const operationData         = require('./models/operationData');
const alarmHistory          = require('./models/alarmHistory');



const app = express();
const port = process.env.PORT || 8080;
var currentUser = null;


app.set("view engine", "ejs");
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret:"I will forever remain connected to the Holy Spirit",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next){
  res.locals.currentUser = req.user;
  currentUser            = req.user;
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
  next();
});




app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var currentOperationData = {};
var activeAlarmList = [];
var theDateTime = false;
var deviceStatus = {};


 function freshStartCheck(){
   tools.checkDeviceStatus()
   .then(deviceStatusRead =>{
        // console.log(deviceStatusRead);
        deviceStatus = {
           internetConnectivity  : deviceStatusRead[0].internetConnectivity,
           initialServerLoading  : deviceStatusRead[0].initialServerLoading,
           serverConnectivity    : deviceStatusRead[0].serverConnectivity,
           sitecommissioned      : deviceStatusRead[0].sitecommissioned,
           itemsInDataBuffer     : deviceStatusRead[0].itemsInDataBuffer,
           itemsInAlarmBuffer    : deviceStatusRead[0].itemsInAlarmBuffer,
           statusName            : deviceStatusRead[0].statusName,
           siteConfigVersion     : deviceStatusRead[0].siteConfigVersion,
           cloudConfigVersion    : deviceStatusRead[0].cloudConfigVersion
         }
         tools.getConfig()
         .then(configData => {
              // console.log("FFFFFFFFFFFFFFFFFFFFFF")
              deviceStatus.siteID   = configData[0].siteID;
              deviceStatus.deviceID = configData[0].deviceID;
              deviceStatus.customerName = configData[0].customerName;
              // console.log(deviceStatus);  
              // console.log("FFFFFFFFFFFFFFFFFFFFFF")
         })
         .catch(err => {
             console.log("failed to get config data Error: ", err);
         })
         //console.log(deviceStatus);   
   })
   .catch(err =>{
     console.log("Failed to get site status", err);
   })
}

freshStartCheck();


setInterval(() => {
  handleInitialization();
  internetAvailable().then(function () {
    currentOperationData.internet = true;
    deviceStatus.internetConnectivity = true;
  })
    .catch(function () {
      currentOperationData.internet = false;
      deviceStatus.internetConnectivity = false;
    });
  getOperationData.getOperationData()
    .then(data1 => {
      let today = new Date();
      let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date + ' ' + time;
      currentOperationData = data1;
      currentOperationData.startDrying = startDrying;
      currentOperationData.serverTime = dateTime;
      currentOperationData.alarms = activeAlarmList;
      currentOperationData.comConnected = true;
      currentOperationData.siteID = deviceStatus.siteID;
      currentOperationData.deviceID = deviceStatus.deviceID;
      currentOperationData.customerName = deviceStatus.customerName;
      currentOperationData.serverConnectivity = deviceStatus.serverConnectivity;
      currentOperationData.itemsInDataBuffer = deviceStatus.itemsInDataBuffer;
      currentOperationData.itemsInAlarmBuffer = deviceStatus.itemsInAlarmBuffer;
      currentOperationData.siteConfigVersion = deviceStatus.siteConfigVersion;
      currentOperationData.cloudConfigVersion = deviceStatus.cloudConfigVersion;
      currentOperationData.initialServerLoading = deviceStatus.initialServerLoading;
      currentOperationData.sitecommissioned = deviceStatus.sitecommissioned;

      if (deviceStatus.sitecommissioned == true){
          tools.getConfig()
          .then(siteConfig => {
              deviceStatus.customerName = siteConfig[0].customerName;
              deviceStatus.siteID       = siteConfig[0].siteID;
              deviceStatus.deviceID     = siteConfig[0].deviceID;
          })
          .catch(err =>{

          })
      }

      //console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
      //console.log(currentOperationData);
      //console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
  
        handleAlarms();
        if (theDateTime === false){
            getOperationData.getDate4rmMeter()
            .then(dateNow =>{
              console.log(dateNow);
              var setDate =  exec(
                              `sudo date ${dateNow.month}${dateNow.day}${dateNow.hour}${dateNow.minute}${dateNow.year}.${dateNow.second}`,
                               (err, data, stderr) => {
                                if(err){
                                    // console.log("Failed to set Pi date: ",err)
                                 }
                                  //console.log('DateSet',data)
                                });
               theDateTime = true;  
            })
            .catch(err => {
              //console.log(`Failed to set system date`);
              logger.error(`Failed to set system date, Error: ${err}`);

            })
          }
    })
    .catch(err => {
     // console.log("Failed to get current operation data : " + err);
      currentOperationData.comConnected = false;
    });
   // console.log(deviceStatus);
    tools.updateDeviceStatus(deviceStatus)
    .then(data =>{
        //console.log(data);
    })
    .catch(err =>{
        //console.log(err);
    })
    getOperationData.getI2Cdata()
    .then(data =>{
      //console.log("i2c data Read, ")
      //console.log(data)         
    })
    .catch(err => {
       //  console.log("i2c data transmission failed, "+ err );
    })

    currentOperationData.siteID = deviceStatus.siteID;
    currentOperationData.deviceID = deviceStatus.deviceID;
    currentOperationData.customerName = deviceStatus.customerName;
    currentOperationData.serverConnectivity = deviceStatus.serverConnectivity;
    currentOperationData.itemsInDataBuffer = deviceStatus.itemsInDataBuffer;
    currentOperationData.itemsInAlarmBuffer = deviceStatus.itemsInAlarmBuffer;
    currentOperationData.siteConfigVersion = deviceStatus.siteConfigVersion;
    currentOperationData.cloudConfigVersion = deviceStatus.cloudConfigVersion;
    currentOperationData.initialServerLoading = deviceStatus.initialServerLoading;
    currentOperationData.sitecommissioned = deviceStatus.sitecommissioned;

    //console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    //console.log(currentOperationData);
    //console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")

}, 4000)



setInterval(() => {
  if (deviceStatus.internetConnectivity == false){
      tools.bufferedSaving(currentOperationData)
      .then(data => {
           deviceStatus.itemsInDataBuffer = deviceStatus.itemsInDataBuffer + 1;
           tools.saveOperationData(currentOperationData)
           .then(data => {
            logger.info(`operation data saved in offline mode`);
           })
           .catch(e => {
            logger.error(`Error in saving operation data in offline mode: ${e}`);
           })
      })
      .catch(err => {
           logger.error(`Error in saving operation data to buffer: ${err}`);
      });   
  } else{
     if (deviceStatus.itemsInDataBuffer > 0){
       tools.uploadBufferedData(deviceStatus.deviceID)
       .then(data => {
           logger.info(`uploaded buffered data success, NumberofData: ${data.uploadedBufferedDataNumber}`);
           tools.bufferedEmptying()
           .then(data1 =>{
               deviceStatus.itemsInDataBuffer = 0;
               logger.info(`emptying buffered data success`);
           })
           .catch(err1 => {
               logger.error(`Failed to empty buffered data Error: ${err1}`);
           });
       })
       .catch(err =>{
           logger.error(`Failed to empty buffered data ${err}`);
       });
     }
       //save operationdata to database
       tools.saveOperationData(currentOperationData)
       .then(data => {
         logger.info("operation data saved");
       })
       .catch(e => {
         logger.info(`Error in saving data: ${e}`);
       })
       //upload operationdata to the cloud
       tools.uploadOperationData(deviceStatus, currentOperationData)
       .then(data =>{
            deviceStatus.serverConnectivity = true;
            logger.info("operation data uploaded");
       })
       .catch(err =>{
            deviceStatus.serverConnectivity = false;
            tools.bufferedSaving(currentOperationData)
            .then(data => {
                 deviceStatus.itemsInDataBuffer = deviceStatus.itemsInDataBuffer + 1;
            })
            .catch(err => {
                 logger.error(`Error in saving operation data to buffer: ${err}`);
            });  
            logger.info(`operation data failed to upload: ${err}`);
       });
  }
}, 120000);

function handleAlarms(){
  getOperationData.getAlarms()
          .then(data2 => {
            activeAlarmList = data2;
            if (activeAlarmList.length > 1 && deviceStatus.sitecommissioned){
                if (deviceStatus.internetConnectivity == false){
                   tools.bufferedAlarmSaving(deviceStatus, activeAlarmList)
                   .then(data => {
                    console.log("Alarm saved to buffered")
                      deviceStatus.itemsInAlarmBuffer = deviceStatus.itemsInAlarmBuffer +1;
                      tools.saveAlarmHistory(deviceStatus.siteID, activeAlarmList)
                      then(data1 => {
                         console.log("Alarm saved to database")
                      })
                      .catch(err => {
                        console.log("Failed to save alarm to database")
                        console.log(err);
                      })
                   })
                   .catch(err => {
                        console.log("Failed to save alarm to buffer")
                        console.log(err);
                   });

                } else {
                  if (deviceStatus.itemsInAlarmBuffer > 1){
                     tools.uploadBufferedAlarm(deviceStatus.deviceID)
                     .then(data => {
                          console.log("Buffered Alarm Uploaded");
                          deviceStatus.temsInAlarmBuffer = 0;
                          tools.bufferedAlarmEmptying()
                          .then(data1 => {
                             console.log("Buffered Alarm Deleted");
                          })
                          .catch(err => {
                             console.log("Failed to delete buffered alarm")
                             console.log(err)
                          })
                     })
                  }
                  tools.saveAlarmHistory(deviceStatus.siteID, alarmHistory)
                  .then(data => {
                      tools.uploadAlarmsHistory(deviceStatus, alarmHistory)
                      .then(data =>{
                          console.log("Alarm uploaded");
                      })
                      .catch(err => {
                          console.log("Failed to upload alarm");
                          console.log(err)
                      })
                  })
                  .catch(err =>{
                    console.log("Failed to save alarm");
                    console.log(err)
                  })
                  
                }
            }
          })
          .catch(e => {
            console.log("Failed to get current active alarms : " + err);
          })

}

function handleInitialization(){
  if (deviceStatus.initialServerLoading == false || (deviceStatus.siteConfigVersion > deviceStatus.cloudConfigVersion)){
    tools.initialServerConf()
    .then(response => {
         if (response.serverConnected == true){
            deviceStatus.initialServerLoading = true;
            deviceStatus.sitecommissioned     = true;
            deviceStatus.siteID               = response.data.siteID;
            deviceStatus.deviceID             = response.data.deviceID;
            deviceStatus.cloudConfigVersion   = deviceStatus.cloudConfigVersion + 1
         }
    })
    .catch(err => {
       if (err.data == false){
         deviceStatus.initialServerLoading = false;
         deviceStatus.sitecommissioned  = true;
       }else if (err.data == true & err.serverConnected == false){
         deviceStatus.initialServerLoading = false;
         deviceStatus.sitecommissioned  = true;
       }
    })
 }
}


app.get('/', middleware.isLoggedIn, (req, res) => {
  res.sendFile(__dirname + '/views/dashboard.html')
  //  res.json(activeAlarmList);
});

app.get('/dashboard', middleware.isLoggedIn, function (req, res) {
  console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
  console.log(req.user.username);
  console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
  currentOperationData.currentUser = req.user.username;
  console.log("Yes I am here to redirect dashboard");
  res.sendFile(__dirname + '/views/dashboard.html')
  //  res.json(activeAlarmList);
});

app.get('/trendlines', middleware.isLoggedIn, function (req, res) {
  res.sendFile(__dirname + '/views/trendlines.html')
  //  res.json(activeAlarmList);
});

app.get("/configOperation", middleware.isLoggedInAdmin, (req, res) => {
  res.sendFile(__dirname + '/views/configuration.html')
})
app.get("/editConfiguration", middleware.isLoggedInAdmin, (req, res) => {
  res.sendFile(__dirname + '/views/editConfiguration.html')
})
app.get("/diagnostics", middleware.isLoggedInAdmin, (req, res) => {
  res.sendFile(__dirname + '/views/diagnostics.html')
})
app.get("/diagnostics-ac-meter", middleware.isLoggedInAdmin, (req, res) => {
  res.sendFile(__dirname + '/views/diagnostics-ac-meter.html')
})
app.get("/diagnostics-dc-meter", middleware.isLoggedInAdmin, (req, res) => {
  res.sendFile(__dirname + '/views/diagnostics-dc-meter.html')
})
app.get("/diagnostics-other-info", middleware.isLoggedInAdmin, (req, res) => {
  res.sendFile(__dirname + '/views/diagnostics-other-info.html')
})
app.get("/reboot-now", middleware.isLoggedInAdmin, (req,res) =>{
  res.sendFile(__dirname + '/views/reboot.html')
})

app.post('/api/reboot-now', middleware.isLoggedInAdmin, function (req, res) {
  console.log("RRRRRRRRRRRrebootTTTTTTTTTTTT")
  res.json({reboot: true})
  var shutdownScript = exec('sudo reboot', 
                     (error, stdout, stderr) => {
                     console.log("the stdout: ", stdout);
                     console.log("the stderr: ", stderr);
                     if (error !== null){
                         console.log(`exec error: ${error}`);
                        //  res.json({internet: false, error: error})
                     }else {
                      // res.json ({internet: true, error: null})  
                     }         
             });   
});


app.get("/login", function(req, res){
  res.sendFile(__dirname + '/views/login.html')
});

app.post("/login", passport.authenticate("local", 
     {
        //successRedirect: "/",
        failureRedirect: "/login"
     }),  function(req, res) {
              User.find({username: req.body.username}, function(err, foundUser){
                  if (err) {
                    console.log(err);
                    return res.json({login : "failed"})
                    }
                req.flash("success", "Welcome to your page "+ foundUser[0].username);
                res.redirect("/dashboard");
                console.log(foundUser);
         
            });
});

//logout route
app.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Log you out!");
  res.redirect("/");
});

app.post("/registerUser", function(req, res){
  let username    = req.body.username;
  let password = req.body.password;
  
  let userDetail = {
       email: username,
       password:  password
    };
    console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
    console.log(userDetail);
    console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
   var newUser = new User({username: userDetail.email});
   if (userDetail.email === "Admin"){
       newUser.isAdmin = true;
   }
   console.log(newUser.username);
    User.register(newUser, userDetail.password, function(err, user) {
          if(err){
           console.log(">>>>>.....>>>>: " + err.message);
           logger.error(`Error in registering a user, Error: ${err.message}`);
           return res.json({UserCreated: false});
    }   
     console.log("New User")
     console.log(user)
    //Note: the username and password must be used in the .ejs form for the paasport.authenticate to work
           passport.authenticate("local")(req, res, function(err){
        if (err){
             logger.error(`Error in authenticating registered user, Error: ${err.message}`)
             return res.json({UserCreated: false});
        }
           logger.info(`User is successfully created`)
            return res.json({UserCreated: true});
              });
       });          
});


app.get("/api/dashboard",middleware.isLoggedIn, (req, res) => {
  // console.log("Boot Data: " + JSON.stringify(tools.bootDataRead));
  // console.log("Dashboard Data: " + currentOperationData);
  res.json(currentOperationData);
});

app.get("/api/getConfig", middleware.isLoggedIn, (req, res) => {
  console.log("I am here to get configuration")
  if (deviceStatus.sitecommissioned == true){
    tools.getConfig()
    .then(data => {
         console.log("Site Config: " + data);
          res.json(data);
     })
     .catch(err => {
      res.json(err);
   })
  }
  else{
    console.log("The site is not configured")
    res.json({data : "Not Configure"})
  }
});


app.post("/api/createoperation", middleware.isLoggedInAdmin, (req, res) => {
  tools.createConfiguration(req.body)
    .then(data => {
      console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
      console.log("Site Configuration: ", data);
      console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
      deviceStatus.siteConfigVersion = deviceStatus.siteConfigVersion + 1;
      deviceStatus.sitecommissioned = true;
      res.redirect("/configOperation")
    })
    .catch(e => {
      res.json(e)
    });
});



app.post("/api/editconfiguration", middleware.isLoggedInAdmin, (req, res) => {
  console.log("UUUUUUUUUUUUUUUUUUUUUUUUUU")
  console.log(req.body);
  console.log("YYYYYYYYYYYYYYYYYYYYYYYYYY")
  tools.editConfiguration(req.body)
    .then(data => {
      console.log(data)
      deviceStatus.siteConfigVersion = deviceStatus.siteConfigVersion + 1;
      res.json({status : "updated"})
    })
    .catch(err => {
      res.json(err);
    })
})

app.post("/deleteoperation", middleware.isLoggedInAdmin, (req, res) => {
  tools.deleteConfiguration()
    .then(data => {
      deviceStatus.sitecommissioned = false;
      console.log(data);
      res.json({status : 200});
    })
    .catch(e => {
      console.log(e)
    })
})





app.get("/api/dashboardchart", middleware.isLoggedIn, (req, res) => {
  // console.log("Boot Data: " + JSON.stringify(tools.bootDataRead));
  tools.getDashboardChartsData()
    .then(data => {
      console.log("Dashboard Charts Data: " + data);
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    })
});

app.get("/api/getCurrentUser", middleware.isLoggedIn, (req, res) => {
    res.json({currentUser: currentOperationData.currentUser});
})



app.get("/dataExport", middleware.isLoggedInAdmin, (req, res) => {
  res.sendFile(__dirname + '/views/exportData.html')
});
app.post("/api/exportData", (req, res) => {
  console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
  console.log(req.body);
  console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
  tools.exportData(req.body)
    .then(data => {
      console.log(data);
      // res.render("exportdata", {exportData: data});
      res.json(data);
    })
    .catch(e => {
      console.log(e)
      res.json(e)
    })
})

app.get("/dataAlarms", middleware.isLoggedIn, (req, res) => {
  res.sendFile(__dirname + '/views/exportAlarms.html')
});
app.get("/api/activeAlarms", middleware.isLoggedIn, (req, res) => {
  res.json(activeAlarmList);
});
app.post("/api/exportAlarms", middleware.isLoggedIn, (req, res) => {
  console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
  console.log(req.body);
  console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
  tools.exportAlarms(req.body)
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(e => {
      console.log(e)
      res.json(e)
    })
})


app.listen(port, () => {
    logger.info(`Listening on port: ${port}`);
  });