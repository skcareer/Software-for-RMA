const modbus           = require ("./modbus")
const i2cbus           = require ("./i2cbus")

currentOperationData = {};
dateTime = {};


function hex2float(num) {// this function converts float point number in hexadecomal format to float.
    var sign = (num & 0x80000000) ? -1 : 1;
    var exponent = ((num >> 23) & 0xff) - 127;
    var mantissa = 1 + ((num & 0x7fffff) / 0x7fffff);
    return sign * mantissa * Math.pow(2, exponent);
}


 function getOperationData (){
    return new Promise (async function(resolve, reject){
    // list of meter's id 1 is AC meter and 2 is the DC meter.....
    const metersIdList = [1,2];
    const getMetersValue = async (meters) => {
     try{
         // get value of all meters
         for(let meter of meters) {
             // output value to console
             await getMeterValue(meter);
             // wait 100ms before get another device
             await sleep(500);
         }
         // console.log(ovenDataRead);
         resolve (currentOperationData);
     } catch(e){
         // if error, handle them here (it should not)
         reject (e);
     } 
     }
  
     const getMeterValue = async (id) => {
        try {
            if (id == 2){
               modbus.readRegisters(2, 4097, 45)
               .then(data => {
                    console.log(data);
                    currentOperationData.ACMeterWorkingStatus                                     = data[0],
                    currentOperationData.ACcurrenTimeYYMM                                         = data[1],
                    currentOperationData.ACcurrenTimeDDhh                                         = data[2],
                    currentOperationData.ACcurrenTimemmss                                         = data[3],
                    currentOperationData.ACfrequency                                              = data[3]/100,
                    currentOperationData.ACphaseAVoltage                                          = data[4]/10,
                    currentOperationData.ACphaseBVoltage                                          = data[5]/10,
                    currentOperationData.ACphaseCVoltage                                          = data[6]/10,
                    currentOperationData.ACfirstAphaseCurrent                                     = data[7]/100;
                    currentOperationData.ACfirstBphaseCurrent                                     = data[8]/100;
                    currentOperationData.ACfirstCphaseCurrent                                     = data[9]/100;
                    currentOperationData.ACfirstTotalApparentPower                                = data[10];
                    currentOperationData.ACfirstApparentPowerPhaseA                               = data[11];
                    currentOperationData.ACfirstApparentPowerPhaseB                               = data[12];
                    currentOperationData.ACfirstApparentPowerPhaseC                               = data[13];
                    currentOperationData.ACfirstActivePowerPhaseA                                 = data[15]/100;
                    currentOperationData.ACfirstActivePowerPhaseB                                 = data[16]/100;
                    currentOperationData.ACfirstActivePowerPhaseC                                 = data[17]/100;
                    currentOperationData.ACfirstTotalActivePower                                  = (currentOperationData.ACfirstActivePowerPhaseA +currentOperationData.ACfirstActivePowerPhaseB + currentOperationData.ACfirstActivePowerPhaseC).toFixed(2); //data[14];
                    currentOperationData.ACfirstTotalReactivePower                                = data[18];
                    currentOperationData.ACfirstReactivePowerPhaseA                               = data[19];
                    currentOperationData.ACfirstReactivePowerPhaseB                               = data[20];
                    currentOperationData.ACfirstReactivePowerPhaseC                               = data[21];
                    currentOperationData.ACfirstCombinedActiveTotalEnergy1                         = data[22];
                    currentOperationData.ACfirstCombinedActiveTotalEnergy2                         = data[23];
                    currentOperationData.ACfirstPositiveActiveTotalEnergy1                        = data[24]/10;
                    currentOperationData.ACfirstPositiveActiveTotalEnergy2                        = data[25]/10;
                    currentOperationData.ACfirstReverseActivePowerTotalEnergy1                    = data[26];
                    currentOperationData.ACfirstReverseActivePowerTotalEnergy2                    = data[27];
                    currentOperationData.ACfirstCombinedReactivePower1TotalElectricEnergy1        = data[28];
                    currentOperationData.ACfirstCombinedReactivePower1TotalElectricEnergy2        = data[29];
                    currentOperationData.ACfirstCombinedReactivePower2TotalElectricEnergy1        = data[30];
                    currentOperationData.ACfirstCombinedReactivePower2TotalElectricEnergy2        = data[31];
                    currentOperationData.ACFirstTotalPowerFactor                                  = data[32];
                    currentOperationData.ACFirstAphasePowerFactor                                 = data[33];
                    currentOperationData.ACFirstBphasePowerFactor                                 = data[34];
                    currentOperationData.ACFirstCphasePowerFactor                                 = data[35];
                    
                    modbus.readRegisters(2, 16384, 2)
                    .then(data => {
                        currentOperationData.ACSourceTotalPowerDownTime     = data[0];
                        currentOperationData.ACelectricalMeterFailureAlarm  = data[1].toString(2);
                        currentOperationData.AC1stElectParamMeasureNormal   = currentOperationData.ACelectricalMeterFailureAlarm[15];
                        currentOperationData.AC1stVoltagePhaseSequenceErr   = currentOperationData.ACelectricalMeterFailureAlarm[7];
                        currentOperationData.AC1stCurrentPhaseSequenceErr   = currentOperationData.ACelectricalMeterFailureAlarm[3];
                        console.log("AC meter dataRead success")
                    })
                    .catch(err => {
                        console.log("Error Failed to get AC meter Alarms: " + err)
                    });

                })
               .catch(err => {
                      console.log("Error Failed to get AC meter data: " + err)
               });
               return currentOperationData;

            } else if (id = 1) {
                modbus.readRegisters(1, 0, 62)
                .then(data => {
                    // console.log(data) 
                    //this helps to convert floating point number from decimal to hexadecimal and to float number
                    currentOperationData.DCvoltage                       = (hex2float(`0x${(data[0]).toString(16).padStart(4,0)}${(data[1]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch1Current                    = (hex2float(`0x${(data[2]).toString(16).padStart(4,0)}${(data[3]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch1ActivePower                = (hex2float(`0x${(data[4]).toString(16).padStart(4,0)}${(data[5]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch1CombinedActiveEnergy       = (hex2float(`0x${(data[6]).toString(16).padStart(4,0)}${(data[7]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch1PositiveActiveEnergy       = (hex2float(`0x${(data[8]).toString(16).padStart(4,0)}${(data[9]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch1NegativeActiveEnergy       = (hex2float(`0x${(data[10]).toString(16).padStart(4,0)}${(data[11]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch2Current                    = (hex2float(`0x${(data[12]).toString(16).padStart(4,0)}${(data[13]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch2ActivePower                = (hex2float(`0x${(data[14]).toString(16).padStart(4,0)}${(data[15]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch2CombinedActiveEnergy       = (hex2float(`0x${(data[16]).toString(16).padStart(4,0)}${(data[17]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch2PositiveActiveEnergy       = (hex2float(`0x${(data[18]).toString(16).padStart(4,0)}${(data[19]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch2NegativeActiveEnergy       = (hex2float(`0x${(data[20]).toString(16).padStart(4,0)}${(data[21]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch3Current                    = (hex2float(`0x${(data[22]).toString(16).padStart(4,0)}${(data[23]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch3ActivePower                = (hex2float(`0x${(data[24]).toString(16).padStart(4,0)}${(data[25]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch3CombinedActiveEnergy       = (hex2float(`0x${(data[26]).toString(16).padStart(4,0)}${(data[27]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch3PositiveActiveEnergy       = (hex2float(`0x${(data[28]).toString(16).padStart(4,0)}${(data[29]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch3NegativeActiveEnergy       = (hex2float(`0x${(data[30]).toString(16).padStart(4,0)}${(data[31]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch4Current                    = (hex2float(`0x${(data[32]).toString(16).padStart(4,0)}${(data[33]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch4ActivePower                = (hex2float(`0x${(data[34]).toString(16).padStart(4,0)}${(data[35]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch4CombinedActiveEnergy       = (hex2float(`0x${(data[36]).toString(16).padStart(4,0)}${(data[37]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch4PositiveActiveEnergy       = (hex2float(`0x${(data[38]).toString(16).padStart(4,0)}${(data[39]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch4NegativeActiveEnergy       = (hex2float(`0x${(data[40]).toString(16).padStart(4,0)}${(data[41]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch5Current                    = (hex2float(`0x${(data[42]).toString(16).padStart(4,0)}${(data[43]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch5ActivePower                = (hex2float(`0x${(data[44]).toString(16).padStart(4,0)}${(data[45]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch5CombinedActiveEnergy       = (hex2float(`0x${(data[46]).toString(16).padStart(4,0)}${(data[47]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch5PositiveActiveEnergy       = (hex2float(`0x${(data[48]).toString(16).padStart(4,0)}${(data[49]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch5NegativeActiveEnergy       = (hex2float(`0x${(data[50]).toString(16).padStart(4,0)}${(data[51]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch6Current                    = (hex2float(`0x${(data[52]).toString(16).padStart(4,0)}${(data[53]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch6ActivePower                = (hex2float(`0x${(data[54]).toString(16).padStart(4,0)}${(data[55]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch6CombinedActiveEnergy       = (hex2float(`0x${(data[56]).toString(16).padStart(4,0)}${(data[57]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch6PositiveActiveEnergy       = (hex2float(`0x${(data[58]).toString(16).padStart(4,0)}${(data[59]).toString(16).padStart(4,0)}`)).toFixed(2),
                    currentOperationData.DCch6NegativeActiveEnergy       = (hex2float(`0x${(data[60]).toString(16).padStart(4,0)}${(data[61]).toString(16).padStart(4,0)}`)).toFixed(2),
                    
                    // modbus.readRegisters(1, 523, 7)
                    // .then(data => {
                    //     console.log("Getting Date From Meter")
                    //     console.log(data)
                    //     dateTime.year = `20${data[0]}`;
                    //     dateTime.month = data[1].toString().padStart(2, "0");
                    //     dateTime.day = data[2].toString().padStart(2, "0");
                    //     dateTime.hour = data[3].toString().padStart(2, "0");
                    //     dateTime.minute = data[4].toString().padStart(2, "0");
                    //     dateTime.second = data[5].toString().padStart(2, "0");
                    // })
                    // .catch(err => {
                    //       console.log("Error Failed to get date: " + err)
                    // })
                    console.log("DC meter dataRead success");

                })
                .catch(err => {
                    console.log("Error Failed to get DC meter data: " + err)
 
                })


               return currentOperationData;
            }
 
        } catch(e){
            // if error return -1
            console.log(e);
            return -1;
        }
      }
  
 const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));   
  
 // start get value
 const valRead = await getMetersValue(metersIdList);
 return valRead;
  })
 };

 function getI2Cdata(){
    return new Promise(async function (resolve, reject) {
        i2cbus.readBytesKMFBoard()
        .then(data => {
            console.log("i2c data read");
            //console.log(data);
            currentOperationData.outSideTemp = data[0] + data[1]/100;
            currentOperationData.outSideHumi = data[2] + data[3]/100;
            currentOperationData.batTemp = data[4] + data[5]/100;
            currentOperationData.sysVolt = data[6] + data[7]/100;
            currentOperationData.th22Failed = data[8];
            currentOperationData.lm35Failed = data[9];
            currentOperationData.digitalIn1 = data[10];
            currentOperationData.digitalIn2 = data[11];
            currentOperationData.digitalIn3 = data[12];
            currentOperationData.digitalIn4 = data[13];
            currentOperationData.digitalOut1 = data[14];
            currentOperationData.digitalOut2 = data[15];
            currentOperationData.digitalOut3 = data[16];
            currentOperationData.digitalOut4 = data[17];
            resolve(currentOperationData);
        })
        .catch(err =>{
            reject(err);
        });
    })
 }

function getDate4rmMeter(){
     return new Promise(async function (resolve, reject){
        modbus.readRegisters(1, 522, 7)
        .then(data => {
            console.log("Getting Date From Meter")
            console.log(data)
            dateTime.year = `20${data[0]}`;
            dateTime.month = data[1].toString().padStart(2, "0");
            dateTime.day = data[2].toString().padStart(2, "0");
            dateTime.hour = data[3].toString().padStart(2, "0");
            dateTime.minute = data[4].toString().padStart(2, "0");
            dateTime.second = data[5].toString().padStart(2, "0");
            resolve(dateTime);
        })
        .catch(err => {
              console.log("Error Failed to get date: " + JSON.stringify(err));
              reject(err);
        })
     });



}

allAlarmsArray = ["AC Electrical Meter Failure Alarmr", "AC First Electrical Parameter Measurement Normal",
                  "AC first Voltage Phase Sequence Error", "AC First Current Phase Sequence Error"
                  ]
                  


function getAlarms() {
    return new Promise(async function (resolve, reject) {
        allAlarms = [          
                 currentOperationData.ACelectricalMeterFailureAlarm, 
                 currentOperationData.AC1stElectParamMeasureNormal,   
                 currentOperationData.AC1stVoltagePhaseSequenceErr,   
                 currentOperationData.AC1stCurrentPhaseSequenceErr,   
        ];
        activeAlarmList = []
        allAlarms.forEach((state, idx) => {
            if (state === '1') {
                activeAlarmList.push(allAlarmsArray[idx]);
                // console.log("the value is", arr[idx])
            }
        })


        //console.log("rawdata", activeAlarmList);
        resolve(activeAlarmList);
    })
}




module.exports = { getOperationData, getAlarms, getI2Cdata, getDate4rmMeter, dateTime};