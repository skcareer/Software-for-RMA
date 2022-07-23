var ModbusRTU                     = require("modbus-serial");
var client                        = new ModbusRTU();



client.connectRTUBuffered("/dev/ttyUSB0", { baudRate: 9600, autoOpen: false })
    .then(function(){
        console.log("connected"); 
    })
    .catch(function(e){
        console.log("....There is error here....")
        console.log(e);
     });
client.setTimeout(5000);


function readRegisters(id, startAddress, numberOfRegisters) {
    return new Promise ( function(resolve, reject){
        client.setID(id);
      // read the 5 registers starting at address 5
        client.readHoldingRegisters(startAddress, numberOfRegisters)
        .then(function(d) {
            // console.log("Received@modbusfile:", d.data);
             resolve(d.data)
        })   
        .catch(function(e) {
             //console.log("Error Reading Registers @modbusfile:", e); 
             reject(e)
        })    
    })
}

function readCoils(id, startAddress, numberOfCoils) {
    return new Promise ( function(resolve, reject){
        client.setID(id);
        // read numberOfCoils coils starting at address startAddress//readCoils replaced readDiscreteInputs//
        client.readCoils(startAddress, numberOfCoils)
          .then(function(d) {
             //console.log("Receive coils @modbus file:", d.data);
             resolve(d.data)
           })
          .catch(function(e) {
             //console.log("Error reading coils @modbus file:", e); 
             reject(e)
         });
    })    
}

function writeHoldingRegsiters(id, startAddress, dataArray) {
    return new Promise ( function(resolve, reject){
        client.setID(id);
    // write 5 registers statrting at holding registers
    // negative values (< 0) have to add 65535 for Modbus registers
        client.writeRegisters(startAddress, dataArray)
           .then(function(d) {
               console.log("Write dataArray to holding registers", d); 
               resolve("Data writen sucessfully")
             })
               
           .catch(function(e) {
               console.log(e); 
               reject(e);
            });
    })
}

function writeMultipleCoils(id, startAddress, CoilsStatus) {
    return new Promise ( function(resolve, reject){
        client.setID(id);
    // write to coil
      client.writeCoils(startAddress, CoilsStatus)
         .then(function(d) {
            console.log("Write to coils", d);
            resolve("Coils written success");
         })   
         .catch(function(e) {
            console.log(e); 
            reject("Coils written failed", e);
         });
    })       
}

function writeSingleCoil(id, startAddress, status) {
    return new Promise ( function(resolve, reject){
        client.setID(id);
    // write to coil
       client.writeCoil(startAddress, status)
         .then(function(d) {
             console.log("Write true to coil 2", d); 
             resolve("Coil writen succesfully");
         })
         .catch(function(e) {
            console.log(e); 
            reject("Coil writen failed", e);
         });
    })
}

module.exports = {readRegisters, readCoils, writeHoldingRegsiters, writeMultipleCoils, writeSingleCoil};