let acTrendsDiv = document.querySelector("#acTrend-display-div");
let dcTrendsDiv = document.querySelector("#dcTrend-display-div");
let tempHumiTrendsDiv = document.querySelector("#tempHumi-display-div");

let shortenDate=(value)=>{
	let date = new Date(value);
	return date.toDateString();
}
let trendline = (result) => {
	let ACfirstActivePowerPhaseA = []
	let ACfirstActivePowerPhaseB = []
	let ACfirstActivePowerPhaseC = []
	let ACphaseAVoltage = []
	let ACphaseBVoltage = []
	let ACphaseCVoltage = []
	let ACphaseACurrent = []
	let ACphaseBCurrent = []
	let ACphaseCCurrent = []

	let dcPower =[]
	let dcCurrent = []
	let dcVoltage = []

	let batteryTemp =[]
	let outsideTemp = []
	let outsideHumi = []

	let xAxisValues = [];

	result.map((element) => {
		ACfirstActivePowerPhaseA.push(element.ACfirstActivePowerPhaseA);
		ACfirstActivePowerPhaseB.push(element.ACfirstActivePowerPhaseB);
		ACfirstActivePowerPhaseC.push(element.ACfirstActivePowerPhaseC);

		ACphaseAVoltage.push(element.ACphaseAVoltage);
		ACphaseBVoltage.push(element.ACphaseBVoltage);
		ACphaseCVoltage.push(element.ACphaseCVoltage);

		ACphaseACurrent.push(element.ACfirstAphaseCurrent);
		ACphaseBCurrent.push(element.ACfirstBphaseCurrent);
		ACphaseCCurrent.push(element.ACfirstCphaseCurrent);

		let totalDCPower = element.DCch1ActivePower + element.DCch2ActivePower + element.DCch3ActivePower + element.DCch4ActivePower + element.DCch5ActivePower + element.DCch6ActivePower;
		dcPower.push(totalDCPower);
		dcVoltage.push(element.DCvoltage);
		let totalDCCurrent = element.DCch1Current + element.DCch2Current + element.DCch3Current + element.DCch4Current + element.DCch5Current + element.DCch6Current;
		dcCurrent.push(totalDCCurrent);

		batteryTemp.push(element.batTemp);
		outsideTemp.push(element.outSideTemp);
		outsideHumi.push(element.outSideHumi);

		xAxisValues.push(shortenDate(element.createdAt));
	});
console.log(xAxisValues, 'eee')
	var acTrendsData = {
		series: [
			{
				name: "AC Phase A Power",
				data: ACfirstActivePowerPhaseA,
			},
			{
				name: "AC Phase B Power",
				data: ACfirstActivePowerPhaseB,
			},
			{
				name: "AC Phase C Power",
				data: ACfirstActivePowerPhaseC,
			},
			{
				name: "AC Phase A Voltage",
				data: ACphaseAVoltage,
			},
			{
				name: "AC Phase B Voltage",
				data: ACphaseBVoltage,
			},
			{
				name: "AC Phase C Voltage",
				data: ACphaseCVoltage,
			},
			{
				name: "AC Phase A Current",
				data: ACphaseACurrent,
			},
			{
				name: "AC Phase B Current",
				data: ACphaseBCurrent,
			},
			{
				name: "AC Phase C Current",
				data: ACphaseCCurrent,
			},
		],
		chart: {
			height: 400,
			type: "line",
			zoom: {
				enabled: true,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 2, 1, 1, 2, 1, 1, 2, 1],
			curve: "straight",
			dashArray: [0, 5, 2, 0, 5, 2, 0, 5, 2],
		},
		title: {
			text: "AC Trend Data",
			align: "center",
		},
		legend: {
			tooltipHoverFormatter: function (val, opts) {
				return (
					val +
					" - " +
					opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
					""
				);
			},
		},
		markers: {
			size: 0,
			hover: {
				sizeOffset: 6,
			},
		},
		xaxis: {
			categories: xAxisValues,
		},
		tooltip: {
			y: [
				{
					title: {
						formatter: function (val) {
							return val + " (W)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (W)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (W)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (v)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (v)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (v)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (A)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (A)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (A)";
						},
					},
				},
			],
		},
		grid: {
			borderColor: "#f1f1f1",
		},
	};

	var dcTrendsData = {
		series: [
			{
				name: "DC Power",
				data: dcPower,
			},
			{
				name: "DC Voltage",
				data: dcVoltage,
			},
			{
				name: "DC Current",
				data: dcCurrent,
			},
		],
		chart: {
			height: 400,
			type: "line",
			zoom: {
				enabled: true,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 2, 1],
			curve: "straight",
			dashArray: [0, 5, 2],
		},
		title: {
			text: "DC Trend Data",
			align: "center",
		},
		legend: {
			tooltipHoverFormatter: function (val, opts) {
				return (
					val +
					" - " +
					opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
					""
				);
			},
		},
		markers: {
			size: 0,
			hover: {
				sizeOffset: 6,
			},
		},
		xaxis: {
			categories: xAxisValues,
		},
		tooltip: {
			y: [
				{
					title: {
						formatter: function (val) {
							return val + " (W)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (v)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (A)";
						},
					},
				},
			],
		},
		grid: {
			borderColor: "#f1f1f1",
		},
	};

	var tempHumiTrendsData = {
		series: [
			{
				name: "Battery Temperature",
				data: batteryTemp,
			},
			{
				name: "Outside Air Temperature",
				data: outsideTemp,
			},
			{
				name: "Outside Air Humidity",
				data: outsideHumi,
			},
		],
		chart: {
			height: 400,
			type: "line",
			zoom: {
				enabled: true,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 2, 1],
			curve: "straight",
			dashArray: [0, 5, 2],
		},
		title: {
			text: "Temperature and Humidity Trend Data",
			align: "center",
		},
		legend: {
			tooltipHoverFormatter: function (val, opts) {
				return (
					val +
					" - " +
					opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
					""
				);
			},
		},
		markers: {
			size: 0,
			hover: {
				sizeOffset: 6,
			},
		},
		xaxis: {
			categories: xAxisValues,
		},
		tooltip: {
			y: [
				{
					title: {
						formatter: function (val) {
							return val + " (C)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (C)";
						},
					},
				},
				{
					title: {
						formatter: function (val) {
							return val + " (%)";
						},
					},
				},
			],
		},
		grid: {
			borderColor: "#f1f1f1",
		},
	};

	var acTrends = new ApexCharts(
		document.querySelector("#acTrend-display-div"),
		acTrendsData
	);
	acTrendsDiv.innerText = "";
	acTrends.render();

	var dcTrends = new ApexCharts(
		document.querySelector("#dcTrend-display-div"),
		dcTrendsData
	);
	dcTrendsDiv.innerText = "";
	dcTrends.render();

	var tempHumiTrends = new ApexCharts(
		document.querySelector("#tempHumi-display-div"),
		tempHumiTrendsData
	);
	tempHumiTrendsDiv.innerText = "";
	tempHumiTrends.render();
};

setInterval(() => {
	axios({
		method: "get",
		url: "api/dashboardchart",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	})
		.then(function (response) {
			// console.log(response, 'trendlines data');
			trendline(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
}, 10000);
let testData = [
	{
	ACfirstActivePowerPhaseA: 9,
	ACfirstActivePowerPhaseB: 10,
	ACfirstActivePowerPhaseC: 20,

	ACfrequency: 0,

	ACphaseAVoltage: 0,
	ACphaseBVoltage: 0,
	ACphaseCVoltage: 0,

	ACfirstAphaseCurrent: 4,
	ACfirstBphaseCurrent: 5,
	ACfirstCphaseCurrent: 9,

	createdAt: '2021-09-02T13:06:53.422Z',


	DCch1ActivePower: 10,
	DCch1Current: 50,
	DCch2ActivePower: 9,
	DCch2Current: 11,
	DCch3ActivePower: 12,
	DCch3Current: 2,
	DCch4ActivePower: 5,
	DCch4Current: 8,
	DCch5ActivePower: 0,
	DCch5Current: 9,
	DCch6ActivePower: 1,
	DCch6Current: 9,
	DCvoltage: 1640,
	batTemp: 17.6,
	outSideHumi: 44,
	outSideTemp: 28,
	},
	{
		ACfirstActivePowerPhaseA: 10,
		ACfirstActivePowerPhaseB: 40,
		ACfirstActivePowerPhaseC: 30,
	
		ACfrequency: 10,
	
		ACphaseAVoltage: 10,
		ACphaseBVoltage: 20,
		ACphaseCVoltage: 25,

		ACfirstAphaseCurrent: 12,
		ACfirstBphaseCurrent: 15,
		ACfirstCphaseCurrent: 19,

		createdAt: '2022-07-02T13:06:53.422Z',
	
		DCch1ActivePower: 4,
		DCch1Current: 5,
		DCch2ActivePower: 6,
		DCch2Current: 8,
		DCch3ActivePower: 8,
		DCch3Current: 8,
		DCch4ActivePower: 8,
		DCch4Current: 8,
		DCch5ActivePower: 8,
		DCch5Current: 8,
		DCch6ActivePower: 8,
		DCch6Current: 8,
		DCvoltage: 1660,
		batTemp: 24.6,
		outSideHumi: 74,
		outSideTemp: 38,
		},
		{
			ACfirstActivePowerPhaseA: 10,
			ACfirstActivePowerPhaseB: 40,
			ACfirstActivePowerPhaseC: 30,
		
			ACfrequency: 10,
		
			ACphaseAVoltage: 10,
			ACphaseBVoltage: 20,
			ACphaseCVoltage: 25,
	
			ACfirstAphaseCurrent: 12,
			ACfirstBphaseCurrent: 15,
			ACfirstCphaseCurrent: 19,
	
			createdAt: '2022-07-02T13:06:53.422Z',
		
			DCch1ActivePower: 4,
			DCch1Current: 5,
			DCch2ActivePower: 6,
			DCch2Current: 8,
			DCch3ActivePower: 8,
			DCch3Current: 8,
			DCch4ActivePower: 8,
			DCch4Current: 8,
			DCch5ActivePower: 8,
			DCch5Current: 8,
			DCch6ActivePower: 8,
			DCch6Current: 8,
			DCvoltage: 1660,
			batTemp: 24.6,
			outSideHumi: 74,
			outSideTemp: 38,
			}
]

// setInterval(() => {
	// trendline(testData);
// }, 60000);