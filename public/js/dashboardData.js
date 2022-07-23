var dashboardData = {};

setInterval(() => {
	axios({
		method: "get",
		url: "/api/dashboard",
		crossdomain: true,
	})
		.then((response) => {
			console.log(response.data);
			dashboardData = response.data;
		})
		.catch((error) => {
			console.log(">>>>>.....>>>>: " + error.message);
		});
}, 2500);

// var dashboardData = {
//     ACFirstAphasePowerFactor: 100,
// ACFirstBphasePowerFactor: 100,
// ACFirstCphasePowerFactor: 0,
// ACFirstTotalPowerFactor: 100,
// ACMeterWorkingStatus: 5386,
// ACSourceTotalPowerDownTime: 19,
// ACcurrenTimeDDhh: 12293,
// ACcurrenTimeYYMM: 5907,
// ACcurrenTimemmss: 0,
// ACfirstActivePowerPhaseA: 0,
// ACfirstActivePowerPhaseB: 0,
// ACfirstActivePowerPhaseC: 0,
// ACfirstApparentPowerPhaseA: 0,
// ACfirstApparentPowerPhaseB: 0,
// ACfirstApparentPowerPhaseC: 0,

// ACfirstCombinedActiveTotalPower1: 0,
// ACfirstCombinedActiveTotalPower2: 0,

// ACfirstCombinedReactivePower1TotalElectricEnergy1: 0,
// ACfirstCombinedReactivePower1TotalElectricEnergy2: 0,
// ACfirstCombinedReactivePower2TotalElectricEnergy1: 0,
// ACfirstCombinedReactivePower2TotalElectricEnergy2: 100,
// ACfirstAphaseVoltage: 0,
// ACfirstBphaseVoltage: 0,
// ACfirstCphaseVoltage: 0,

// ACfirstPositiveActiveTotalEnergy1: 0,
// ACfirstPositiveActiveTotalEnergy2: 0,
// ACfirstReactivePowerPhaseA: 0,
// ACfirstReactivePowerPhaseB: 0,
// ACfirstReactivePowerPhaseC: 0,
// ACfirstReverseActivePowerTotalEnergy1: 0,
// ACfirstReverseActivePowerTotalEnergy2: 0,

// ACfirstTotalActivePower: 0,
// ACfirstTotalApparentPower: 0,
// ACfirstTotalReactivePower: 0,

// ACfrequency: 0,
// ACphaseAVoltage: 0,
// ACphaseBVoltage: 0,
// ACphaseCVoltage: 0,

// DCch1ActivePower: 0,
// DCch1CombinedActiveEnergy: 0,
// DCch1Current: 0,
// DCch1NegativeActiveEnergy: 0,
// DCch1PositiveActiveEnergy: 0,

// DCch2ActivePower: 0,
// DCch2CombinedActiveEnergy: 34191,
// DCch2Current: 0,
// DCch2NegativeActiveEnergy: 34191,
// DCch2PositiveActiveEnergy: 0,
// DCch3ActivePower: 0,
// DCch3CombinedActiveEnergy: 47669,
// DCch3Current: 0,
// DCch3NegativeActiveEnergy: 0,
// DCch3PositiveActiveEnergy: 47669,
// DCch4ActivePower: 0,
// DCch4CombinedActiveEnergy: 78955,
// DCch4Current: 0,
// DCch4NegativeActiveEnergy: 78955,
// DCch4PositiveActiveEnergy: 0,
// DCch5ActivePower: 0,
// DCch5CombinedActiveEnergy: 36900,
// DCch5Current: 0,
// DCch5NegativeActiveEnergy: 0,
// DCch5PositiveActiveEnergy: 36900,
// DCch6ActivePower: 0,
// DCch6CombinedActiveEnergy: 66116,
// DCch6Current: 0,
// DCch6NegativeActiveEnergy: 66116,
// DCch6PositiveActiveEnergy: 0,
// DCvoltage: 16960,

// alarms: [],
// batTemp: 27.6,
// comConnected: false,
// digitalIn1: 1,
// digitalIn2: 0,
// digitalIn3: 0,
// digitalIn4: 0,
// digitalOut1: 0,
// digitalOut2: 0,
// digitalOut3: 0,
// digitalOut4: 0,
// internet: false,
// lm35Failed: 0,
// outSideHumi: 84,
// outSideTemp: 28,
// serverTime: "2021-10-17 0:33:23",
// serverConnectivity: false,
// siteID: 'IHS_LAG_001',
// sysVolt: 4,
// th22Failed: 0,
// }
