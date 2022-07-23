const configuration          = require("../models/configuration.js");
const savingOperationData    = require("../models/operationData");
const savingAlarmHistory     = require("../models/alarmHistory");
const deviceStatusData       = require("../models/deviceStatus");
const bufferedOperationData  = require("../models/bufferedOperationData");
const bufferedAlarmHistory   = require("../models/bufferedAlarmHistory");
const axios                  = require("axios");
const writeModbusOpe         = require("./operationData");     
var mongoose                 = require('mongoose');



mongoose.connect("mongodb://localhost/rma-data");


function getDashboardChartsData(){
    return new Promise (async function(resolve, reject){
        savingOperationData.find({
            createdAt: {
                $gt:new Date(Date.now() - (24*60*60 * 1000)*90),
              },
        }, function(err, foundData){
            if (err){
                console.log("Cant find data; ERR: " +err)
                reject("Cant find data; ERR: " +err)
            }else {
               //  console.log(">>>>>  Data >>>>>")
               //  console.log(foundData);
                resolve(foundData.slice(foundData.length - 100, foundData.length));
            }
          })       
    }) 
}

function exportData(dateObj){
    return new Promise (async function(resolve, reject){
        let startYear = dateObj.startDate.slice(-4)
        let startMonth = dateObj.startDate.slice(0, -8)
        let startDay = dateObj.startDate.slice(3, -5)
        let endYear = dateObj.endDate.slice(-4)
        let endMonth = dateObj.endDate.slice(0, -8)
        let endDay = dateObj.endDate.slice(3, -5)
        savingOperationData.find({
            createdAt: {
                $gte:new Date(startYear+"-"+startMonth+"-"+startDay+"T00:00:50+06:00"),
                $lt:new Date(endYear+"-"+endMonth+"-"+endDay+"T23:59:50+06:00")
              },
        }, function(err, foundData){
            if (err){
                console.log("Cant find data; ERR: " +err)
                reject("Cant find data; ERR: " +err)
            }else {
                console.log(">>>>>  Data >>>>>")
                console.log(foundData);
                resolve(foundData);
            }
          })       
    }) 
}
function exportAlarms(dateObj){
    return new Promise (async function(resolve, reject){
        let startYear = dateObj.startDate.slice(-4)
        let startMonth = dateObj.startDate.slice(0, -8)
        let startDay = dateObj.startDate.slice(3, -5)
        let endYear = dateObj.endDate.slice(-4)
        let endMonth = dateObj.endDate.slice(0, -8)
        let endDay = dateObj.endDate.slice(3, -5)
        savingAlarmHistory.find({
            createdAt: {
                $gte:new Date(startYear+"-"+startMonth+"-"+startDay+"T00:00:50+06:00"),
                $lt:new Date(endYear+"-"+endMonth+"-"+endDay+"T23:59:50+06:00")
              },
        }, function(err, foundData){
            if (err){
                console.log("Cant find alarms; ERR: " +err)
                reject("Cant find alarms; ERR: " +err)
            }else {
               //  console.log(">>>>>  Data >>>>>")
               //  console.log(foundData);
                resolve(foundData);
            }
          })       
    }) 
}

function checkDeviceStatus(){
    return new Promise (async function(resolve, reject){
        deviceStatusData.find(function (err, founDeviceStatus){
            if(err || !(founDeviceStatus.length > 0)){
                 let deviceStatusVal = {
                    internetConnectivity  : false,
                    initialServerLoading  : false,
                    serverConnectivity    : false,
                    sitecommissioned      : false,
                    siteID                : null,
                    deviceID              : null,
                    customerName          : null,
                    itemsInDataBuffer     : 0,
                    itemsInAlarmBuffer    : 0,
                    siteConfigVersion     : 0,
                    cloudConfigVersion    : 0,
                    statusName            : "joy",
                    siteName              : false,
                 }
                 deviceStatusData.create(deviceStatusVal, function(err, createdDeviceStatusData){
                    if (err){
                        console.log("Failed to set  device Status default Data");
                        console.log(err);
                        reject("No device Status data found and failed to create one: ", err)
                     } else {
                        console.log("First device status data just created : ", createdDeviceStatusData)
                        resolve(createdDeviceStatusData)
                     }
                 });
            }else {
                console.log("Device Status Available")
                resolve(founDeviceStatus);
            }
        });
     });
}

function bufferedSaving (dataToSave){
    return new Promise (async function(resolve, reject){
        bufferedOperationData.create(dataToSave , function(err, savedBufferData){
            if(err){
                console.log("Failed to save data to buffer");
                console.log(err);
                reject(err);
            } else {
                console.log("data saved to buffer")
                resolve({bufferedData : true})
            }
        })
    })    
}
function bufferedAlarmSaving (deviceStatus, alarmArray){
    return new Promise (async function(resolve, reject){
        alarmArray.forEach(alarm => {
            toSaveBufferedAlarmHistory = {
                customerName : deviceStatus.customerName,
                siteID       : deviceStatus.siteID,
                alarmName    : alarm,
                severity     : "Medium",
            }
            console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
            console.log(toSaveBufferedAlarmHistory);
            console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
            bufferedAlarmHistory.create(toSaveBufferedAlarmHistory, function(err, createdBufferedSavedAlarm){
                if (err){
                    console.log("Failed to save buffered alarm data: " +err);
                    reject(0)
                }
                console.log("saving buffered alarm data to the database");
                console.log(createdBufferedSavedAlarm);               
            });            
        });
        resolve(1)
    });   
}

function bufferedEmptying(){
    return new Promise (async function(resolve, reject){
        bufferedOperationData.remove({}, function(err){
            if (err){
                console.log("Failed to delete buffered data")
                console.log(err);
                reject(err)
            } else {
                console.log(" deleted buffered data")
                resolve({bufferedDataDeleted : true})
            }
        });
    });
}

function bufferedAlarmEmptying(){
    return new Promise (async function(resolve, reject){
        bufferedAlarmHistory.delete({}, function(err){
            if (err){
                console.log("Failed to delete buffered data")
                console.log(err);
                reject({bufferedAlarmDeleted : false, err : err})
            } else {
                console.log(" deleted buffered data")
                resolve({bufferedAlarmDeleted : true})
            }
        });
    });

}

function uploadBufferedData(){
    return new Promise (async function(resolve, reject){
        bufferedOperationData.find({}, function(err, foundBufferedData){
            if (err){
                console.log("Failed to retrieve data buffered");
                console.log(err);
            }else{
                axios({
                    method: 'post',
                    url: 'https://rmsv-neunx.run-us-west2.goorm.io/savebuffereddata',
                    crossdomain: true, 
                    data: foundBufferedData
                  })
                  .then(function(response){
                      console.log(response.data); 
                      resolve({uploadedBufferedDataNumber : foundBufferedData.length, bufferedDataUploaded : true});
                  })
                  .catch(function(error){
                      console.log(">>>>>.....>>>>: " + error.message);
                      reject({data : true, bufferedDataUploaded : false});
                  }); 
            }
        });
    })
}

function uploadBufferedAlarm(){
    return new Promise (async function(resolve, reject){
        bufferedAlarmHistory.find({}, function(err, foundBufferedAlarm){
            if (err){
                console.log("Failed to retrieve alarm buffered");
                console.log(err);
            }else{
                axios({
                    method: 'post',
                    url: 'https://rmsv-neunx.run-us-west2.goorm.io/event',
                    crossdomain: true, 
                    data: foundBufferedAlarm
                  })
                  .then(function(response){
                      console.log(response.data); 
                      resolve({data : true, bufferedAlarmUploaded : true});
                  })
                  .catch(function(error){
                      console.log(">>>>>.....>>>>: " + error.message);
                      reject({data : true, bufferedAlarmUploaded : false});
                  }); 
            }
        });
    })
}


function initialServerConf(){
    return new Promise (async function(resolve, reject){
        configuration.find({}, function(err, foundConfiguration){
            if (err || !(foundConfiguration.length > 0)){
                console.log("No site configuration data yet");
                reject({data : false, err : err})
            }else{
                let siteConfiguration = {
                    
                    siteName      :foundConfiguration[0].siteName,
                    siteID        :foundConfiguration[0].siteID,
                    region        :foundConfiguration[0].region,
                    address       :foundConfiguration[0].address,
                    latitude      :foundConfiguration[0].latitude,
                    longitude     :foundConfiguration[0].longitude,
                    tenant1       :foundConfiguration[0].tenant1,
                    tenant2       :foundConfiguration[0].tenant2,
                    tenant3       :foundConfiguration[0].tenant3,
                    tenant4       :foundConfiguration[0].tenant4,
                    tenant5       :foundConfiguration[0].tenant5,
                    deviceID      :foundConfiguration[0].deviceID,
                    customerName  :foundConfiguration[0].customerName,
                    gensetCapacity:foundConfiguration[0].gensetCapacity,
                    siteCreatedAt :foundConfiguration[0].createdAt
                }
                axios({
                    method: 'post',
                    url: 'https://rmsv-neunx.run-us-west2.goorm.io/registerDevice',
                    crossdomain: true, 
                    data: siteConfiguration
                  })
                  .then(function(response){
                      console.log(response.data); 
                      resolve({data : siteConfiguration, serverConnected : true});
                  })
                  .catch(function(error){
                      console.log(">>>>>.....>>>>: " + error.message) 
                      reject({data : true, serverConnected : false})
                  }); 
            }
        })
    })

}


function editConfiguration(dataReceived){
    return new Promise (async function(resolve, reject){


        var opeData = {
            siteName        :dataReceived.siteName,
            siteID          :dataReceived.siteId,
            region          :dataReceived.region,
            address         :dataReceived.address,
            latitude        :Number(dataReceived.latitude),
            longitude       :Number(dataReceived.longitude),
            tenant1         :dataReceived.tenant1,
            tenant2         :dataReceived.tenant2,
            tenant3         :dataReceived.tenant3,
            tenant4         :dataReceived.tenant4,
            tenant5         :dataReceived.tenant5,
            gensetCapacity  :Number(dataReceived.gensetCapacity),
            deviceID        :"80:00:00:00:01:1F:00:A3",
            customerName    :"TestCustomer",
            dumName         :"ref"
        };
        configuration.updateOne({dumName: opeData.dumName}, opeData, function(err, updatedInfo){
            if(err){
              console.log("failed to update operation 3");
              console.log(err);
              reject("Failed to update data! ERR: ", err);
            }else {
              console.log("Updated operation:::::::::::::");
              configuration.find({}, function(err, allOperations){
                  if (err) console.log(err);
                  console.log("All operations:::::::::::::");
                  console.log(allOperations);
                  console.log("All operations operations:::::::::::::");
                resolve( allOperations);
              })
              
            }
         });

    })
}

function updateDeviceStatus(deviceStatus){
    return new Promise (async function(resolve, reject){
        // console.log("Looking for bug2")
        // console.log(deviceStatus);
        deviceStatusData.updateOne({ statusName: deviceStatus.statusName }, deviceStatus, function(err, updatedInfo){
            if(err){
              console.log("failed to update device status");
              console.log(err);
              reject(err);
            }else {
              console.log("divece status updated")  
              resolve(updatedInfo);     
            }
         });

    })

}

function getConfig(){
    return new Promise (async function(resolve, reject){
        configuration.find({}, function(err, foundConfiguration){
            if (err || !(foundConfiguration.length > 0) ){
                reject("Config not in Database")
            }else {
               console.log("configuration is in database");
            //    console.log(foundConfiguration);
               resolve(foundConfiguration)
            }
        });
    }) 
}


function createConfiguration(dataReceived){
    return new Promise (async function(resolve, reject){
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHhHHHH");
    console.log(dataReceived);
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");

    var opeData = {
        siteName       :dataReceived.siteName,
        siteID         :dataReceived.siteId,
        region         :dataReceived.region,
        address        :dataReceived.address,
        latitude       :Number(dataReceived.latitude),
        longitude      :Number(dataReceived.longitude),
        tenant1        :dataReceived.tenant1,
        tenant2        :dataReceived.tenant2,
        tenant3        :dataReceived.tenant3,
        tenant4        :dataReceived.tenant4,
        tenant5        :dataReceived.tenant5,
        gensetCapacity :dataReceived.gensetCapacity,
        deviceID       :"80:00:00:00:01:09:A2:B8",
        customerName   :"TestCustomer",
        dumName        :"ref"
    };
    console.log(opeData);
    configuration.find({siteID: opeData.siteID}, function(err, foundConfiguration){
        if (err || !(foundConfiguration.length > 0) ){
          configuration.create(opeData, function(err, createdCongiguration){
             if (err){
                console.log("Failed to create operation");
                console.log(err);
                reject("Failed to Create Operation: ", err)
             } else {
                console.log("Just Created Operation3 : ", createdCongiguration)
                resolve("Operation Created!: ",createdCongiguration )
             }

           });
        }else {
           console.log("operation3 is in database");
           console.log(foundConfiguration);
           resolve("Operation Name is used already. Use another name")
        }
    });
    });
}



function saveOperationData(opeData){
    return new Promise (async function(resolve, reject){
        toSaveData = {
            siteID                                            :opeData.siteID,
            deviceID                                          :opeData.deviceID,
            customerName                                      :opeData.customerName, 
            ACMeterWorkingStatus                              :opeData.ACMeterWorkingStatus,                                              
            ACfrequency                                       :opeData.ACfrequency,       
            ACphaseAVoltage                                   :opeData.ACphaseAVoltage,       
            ACphaseBVoltage                                   :opeData.ACphaseBVoltage,       
            ACphaseCVoltage                                   :opeData.ACphaseCVoltage,       
            ACfirstAphaseCurrent                              :opeData.ACfirstAphaseCurrent,     
            ACfirstBphaseCurrent                              :opeData.ACfirstBphaseCurrent,   
            ACfirstCphaseCurrent                              :opeData.ACfirstCphaseCurrent,
            ACfirstTotalApparentPower                         :opeData.ACfirstTotalApparentPower,       
            ACfirstApparentPowerPhaseA                        :opeData.ACfirstApparentPowerPhaseA,       
            ACfirstApparentPowerPhaseB                        :opeData.ACfirstApparentPowerPhaseB,       
            ACfirstApparentPowerPhaseC                        :opeData.ACfirstApparentPowerPhaseC,       
            ACfirstTotalActivePower                           :opeData.ACfirstTotalActivePower,       
            ACfirstActivePowerPhaseA                          :opeData.ACfirstActivePowerPhaseA,       
            ACfirstActivePowerPhaseB                          :opeData.ACfirstActivePowerPhaseB,       
            ACfirstActivePowerPhaseC                          :opeData.ACfirstActivePowerPhaseC,       
            ACfirstTotalReactivePower                         :opeData.ACfirstTotalReactivePower,       
            ACfirstReactivePowerPhaseA                        :opeData.ACfirstReactivePowerPhaseA,       
            ACfirstReactivePowerPhaseB                        :opeData.ACfirstReactivePowerPhaseB,       
            ACfirstReactivePowerPhaseC                        :opeData.ACfirstReactivePowerPhaseC,       
            ACfirstCombinedActiveTotalPower1                  :opeData.ACfirstCombinedActiveTotalPower1,       
            ACfirstCombinedActiveTotalPower2                  :opeData.ACfirstCombinedActiveTotalPower2,       
            ACfirstPositiveActiveTotalEnergy1                 :opeData.ACfirstPositiveActiveTotalEnergy1,       
            ACfirstPositiveActiveTotalEnergy2                 :opeData.ACfirstPositiveActiveTotalEnergy2,       
            ACfirstReverseActivePowerTotalEnergy1             :opeData.ACfirstReverseActivePowerTotalEnergy1,       
            ACfirstReverseActivePowerTotalEnergy2             :opeData.ACfirstReverseActivePowerTotalEnergy2,       
            ACfirstCombinedReactivePower1TotalElectricEnergy1 :opeData.ACfirstCombinedReactivePower1TotalElectricEnergy1,       
            ACfirstCombinedReactivePower1TotalElectricEnergy2 :opeData.ACfirstCombinedReactivePower1TotalElectricEnergy2,       
            ACfirstCombinedReactivePower2TotalElectricEnergy1 :opeData.ACfirstCombinedReactivePower2TotalElectricEnergy1,       
            ACfirstCombinedReactivePower2TotalElectricEnergy2 :opeData.ACfirstCombinedReactivePower2TotalElectricEnergy2,       
            ACFirstTotalPowerFactor                           :opeData.ACFirstTotalPowerFactor,       
            ACFirstAphasePowerFactor                          :opeData.ACFirstAphasePowerFactor,       
            ACFirstBphasePowerFactor                          :opeData.ACFirstBphasePowerFactor,       
            ACFirstCphasePowerFactor                          :opeData.ACFirstCphasePowerFactor,       
            DCvoltage                                         :opeData.DCvoltage,      
            DCch1Current                                      :opeData.DCch1Current,      
            DCch1ActivePower                                  :opeData.DCch1ActivePower,      
            DCch1CombinedActiveEnergy                         :opeData.DCch1CombinedActiveEnergy,      
            DCch1PositiveActiveEnergy                         :opeData.DCch1PositiveActiveEnergy,      
            DCch1NegativeActiveEnergy                         :opeData.DCch1NegativeActiveEnergy,      
            DCch2Current                                      :opeData.DCch2Current,      
            DCch2ActivePower                                  :opeData.DCch2ActivePower,      
            DCch2CombinedActiveEnergy                         :opeData.DCch2CombinedActiveEnergy,      
            DCch2PositiveActiveEnergy                         :opeData.DCch2PositiveActiveEnergy,      
            DCch2NegativeActiveEnergy                         :opeData.DCch2NegativeActiveEnergy,      
            DCch3Current                                      :opeData.DCch3Current,      
            DCch3ActivePower                                  :opeData.DCch3ActivePower,      
            DCch3CombinedActiveEnergy                         :opeData.DCch3CombinedActiveEnergy,      
            DCch3PositiveActiveEnergy                         :opeData.DCch3PositiveActiveEnergy,      
            DCch3NegativeActiveEnergy                         :opeData.DCch3NegativeActiveEnergy,      
            DCch4Current                                      :opeData.DCch4Current,      
            DCch4ActivePower                                  :opeData.DCch4ActivePower,      
            DCch4CombinedActiveEnergy                         :opeData.DCch4CombinedActiveEnergy,      
            DCch4PositiveActiveEnergy                         :opeData.DCch4PositiveActiveEnergy,      
            DCch4NegativeActiveEnergy                         :opeData.DCch4NegativeActiveEnergy,      
            DCch5Current                                      :opeData.DCch5Current,      
            DCch5ActivePower                                  :opeData.DCch5ActivePower,      
            DCch5CombinedActiveEnergy                         :opeData.DCch5CombinedActiveEnergy,      
            DCch5PositiveActiveEnergy                         :opeData.DCch5PositiveActiveEnergy,      
            DCch5NegativeActiveEnergy                         :opeData.DCch5NegativeActiveEnergy,      
            DCch6Current                                      :opeData.DCch6Current,      
            DCch6ActivePower                                  :opeData.DCch6ActivePower,      
            DCch6CombinedActiveEnergy                         :opeData.DCch6CombinedActiveEnergy,      
            DCch6PositiveActiveEnergy                         :opeData.DCch6PositiveActiveEnergy,      
            DCch6NegativeActiveEnergy                         :opeData.DCch6NegativeActiveEnergy,
            ACSourceTotalPowerDownTime                        :opeData.ACSourceTotalPowerDownTime, 
            ACelectricalMeterFailureAlarm                     :opeData.ACelectricalMeterFailureAlarm, 
            AC1stElectParamMeasureNormal                      :opeData.AC1stElectParamMeasureNormal, 
            AC1stVoltagePhaseSequenceErr                      :opeData.AC1stVoltagePhaseSequenceErr, 
            AC1stCurrentPhaseSequenceErr                      :opeData.AC1stCurrentPhaseSequenceErr,  
            outSideTemp                                       : opeData.outSideTemp, 
            outSideHumi                                       : opeData.outSideHumi, 
            batTemp                                           : opeData.batTemp, 
            sysVolt                                           : opeData.sysVolt, 
            th22Failed                                        : opeData.th22Failed,
            lm35Failed                                        : opeData.lm35Failed,
            digitalIn1                                        : opeData.digitalIn1,
            digitalIn2                                        : opeData.digitalIn2,
            digitalIn3                                        : opeData.digitalIn3,
            digitalIn4                                        : opeData.digitalIn4,
            digitalOut1                                       : opeData.digitalOut1,
            digitalOut2                                       : opeData.digitalOut2,
            digitalOut3                                       : opeData.digitalOut3,
            digitalOut4                                       : opeData.digitalOut4,     
            comConnected                                      : opeData.comConnected,
            internet                                          : opeData.internet,
        }
        // console.log("OOOOOOOOOOOOOopeData.OO");
        // console.log(toSaveData);
        // console.log("OOOOOOOOOOOOOOOOOOOOOO");
        savingOperationData.create(toSaveData, function(err, createdOperationData){
            if (err){
                console.log("Failed to save operation data: " +err);
                reject(0)
            }
            console.log("Operation data is saved to the database");
            console.log(createdOperationData);
            resolve(1)
        });

    });
}

function deleteConfiguration(){
    return new Promise (async function(resolve, reject){
        configuration.remove({}, function(err){
            if(err){
              console.log("failed to delete Site Configuration: ");
              console.log(err);
              reject("failed to delete Site Configuration: ");
            }else {
              console.log("Configuration deleted");
              resolve("Configuration  deleted")
            }
         });

    })
}

function uploadOperationData(deviceStatus, currentOperationData){
    return new Promise(async function (resolve, reject) {
        axios({
            method: 'post',
            url: 'https://rmsv-neunx.run-us-west2.goorm.io/savelivedata',
            crossdomain: true,
            data: currentOperationData
            })
            .then(function (response) {
                console.log(response.data);
                resolve({ data : true, operationDataUploaded : true });
            })
            .catch(function (error) {
                console.log(">>>>>.....>>>>: " + error.message);
                reject({ data : true, operationDataUploaded : false });
            });
    })

}

function uploadAlarmsHistory(deviceStatus, alarmArray) {
    return new Promise(async function (resolve, reject) {
        axios({
            method: 'post',
            url: 'https://rmsv-neunx.run-us-west2.goorm.io/event',
            crossdomain: true,
            data: { customerName: deviceStatus.customerName,
                    siteID: deviceStatus.siteID,
                    data: alarmArray }
        })
            .then(function (response) {
                console.log(response.data);
                resolve({ data : true, bufferedAlarmUploaded : true });
            })
            .catch(function (error) {
                console.log(">>>>>.....>>>>: " + error.message);
                reject({ data : true, bufferedAlarmUploaded : false });
            });
    })

}

function saveAlarmHistory(siteID, alarmArray){
    return new Promise (async function(resolve, reject){
        alarmArray.forEach(alarm => {
            toSaveAlarmHistory = {
                siteID    : siteID,
                alarmName : alarm,
                severity  : "Medium",
            }
            console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
            console.log(toSaveAlarmHistory);
            console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
            savingAlarmHistory.create(toSaveAlarmHistory, function(err, createdSavedAlarm){
                if (err){
                    console.log("Failed to save alarm data: " +err);
                    reject(0)
                }
                console.log("Alarm data is saved to the database");
                console.log(createdSavedAlarm);               
            });            
        });
        resolve(1)
    });
}
 




module.exports = {exportData, bufferedSaving, bufferedAlarmSaving, bufferedEmptying, updateDeviceStatus,
                  bufferedAlarmEmptying, uploadBufferedData, uploadBufferedAlarm, initialServerConf, getConfig, 
                  checkDeviceStatus, exportAlarms, editConfiguration, createConfiguration, saveOperationData,
                  saveAlarmHistory, uploadAlarmsHistory, uploadOperationData, getDashboardChartsData,
                   deleteConfiguration};