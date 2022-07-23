const i2c = require('i2c-bus');

const kmfBoardI2C_Addr = 0x8;
const I2CbusNum = 1;

const I2Cbus1 = i2c.open(I2CbusNum, err =>{
    if (err){
        console.log("Error opening i2c slave")
        console.log(err)
        throw err;
    }else {
        console.log("Connected to i2c Bus 1");
    }

});

function readBytesKMFBoard(){
    return new Promise ( function(resolve, reject){
        try {
            I2Cbus1.i2cRead(kmfBoardI2C_Addr, 20, Buffer.alloc(21), (err, bytesRead, buffer) =>{
                if (err){
                    console.log("Error reading from i2c slave");
                    console.log(err);
                }
                console.log("Number of bytes read: ", bytesRead);
                // console.log("DATA READ: " , buffer);
                // console.log(Array.from(buffer));
                resolve(Array.from(buffer));
            })
        }
        catch (err){
            console.log(err);
            reject(err);
        }
    })
}

    
module.exports = {readBytesKMFBoard};