//Month Filter
function loadXMLDoc(str) {
	var new_table = "<tr><th>Date</th><th>Number Tested</th><th>Number Positive</th><th>Positive Ratio</th><th>Female Tested</th><th>Male Tested</th><th>Female Positive Rate</th><th>Male Positive Rate</th></tr>";
	var dates = [];
	var sort_dates = [];
	var txt = "";
	for (i=0; i<x.length;i++){
		time = parseInt(z[i].childNodes[0].nodeValue.slice(5,7));
		if (time == parseInt(str) && str != "00"){
			dates.push(i);
		}
	}
	for (i=0; i<dates.length;i++){
		let k = 0;
		date1 = dates[i];
		a = parseInt(z[date1].childNodes[0].nodeValue.slice(8,10));
		for (j=0; j<dates.length;j++){
			date2 = dates[j];
			b = parseInt(z[date2].childNodes[0].nodeValue.slice(8,10));
			if (a>b){
				k = k+1;			
			}
		}
		sort_dates[k] = dates[i];
	}
	for (j=0; j<dates.length;j++){
		date = sort_dates[j];
		new_table += "<tr><td>"+ z[date].childNodes[0].nodeValue.slice(0,10) + "</td><td>" + x[date].childNodes[0].nodeValue + "</td><td>" + y[date].childNodes[0].nodeValue + "</td><td>" + (y[date].childNodes[0].nodeValue/x[date].childNodes[0].nodeValue).toFixed(2) +"</td><td>"+ x2[date].childNodes[0].nodeValue + "</td><td>" + y2[date].childNodes[0].nodeValue + "</td><td>" + (xdoc.getElementsByTagName('people_positive_female')[date].childNodes[0].nodeValue/x2[date].childNodes[0].nodeValue).toFixed(2) + "</td><td>" + (xdoc.getElementsByTagName('people_positive_male')[date].childNodes[0].nodeValue/y2[date].childNodes[0].nodeValue).toFixed(2) + "</td></tr>";
	}
	if (str != "00"){
		document.getElementById("database").innerHTML = new_table;
	} else {
		document.getElementById("database").innerHTML = table;
	}
}


//Create Table
var xhttp = new XMLHttpRequest();
xhttp.open("POST","Covid19.xml",false);
xhttp.send();
var data = [];
var order = [];
var xdoc = xhttp.responseXML;
var x = xdoc.getElementsByTagName('people_tested_total');
var y = xdoc.getElementsByTagName('people_positive_total');
var z = xdoc.getElementsByTagName('date');
var x2 = xdoc.getElementsByTagName('people_tested_female');
var y2 = xdoc.getElementsByTagName('people_tested_male');
var z2 = xdoc.getElementsByTagName('people_positive_female');
var table = "<tr><th>Date</th><th>Number Tested</th><th>Number Positive</th><th>Positive Ratio</th><th>Female Tested</th><th>Male Tested</th><th>Female Positive Rate</th><th>Male Positive Rate</th></tr>";

for (i=0; i<x.length;i++){
		let k = 0;
		let g = 0;
		a = 100*parseInt(z[i].childNodes[0].nodeValue.slice(5,7))+parseInt(z[i].childNodes[0].nodeValue.slice(8,10));
		for (j=0; j<x.length;j++){
			b = 100*parseInt(z[j].childNodes[0].nodeValue.slice(5,7))+parseInt(z[j].childNodes[0].nodeValue.slice(8,10));
			if (a>b){
				k = k+1;			
			}
		}
		order[k] = i;
}

for (j=0; j<x.length;j++){
	let i = order[j];
	table += "<tr><td>"+ z[i].childNodes[0].nodeValue.slice(0,10) + "</td><td>" + x[i].childNodes[0].nodeValue + "</td><td>" + y[i].childNodes[0].nodeValue
	+ "</td><td>" + (y[i].childNodes[0].nodeValue/x[i].childNodes[0].nodeValue).toFixed(2) +"</td><td>"+ x2[i].childNodes[0].nodeValue + "</td><td>" + y2[i].childNodes[0].nodeValue + "</td><td>" + (xdoc.getElementsByTagName('people_positive_female')[i].childNodes[0].nodeValue/x2[i].childNodes[0].nodeValue).toFixed(2) + "</td><td>" + (xdoc.getElementsByTagName('people_positive_male')[i].childNodes[0].nodeValue/y2[i].childNodes[0].nodeValue).toFixed(2) + "</td></tr>";
	
	data.push(parseInt(y[i].childNodes[0].nodeValue));
}
document.getElementById("database").innerHTML = table;

//Visualization
var padding = 10;
var dataset = data;

var svg = d3.select('svg'),
		margin = 200,
		width = svg.attr("width") - margin,
		height = svg.attr("height") - margin
		
var yScale = d3.scaleLinear()
		.domain([0,d3.max(dataset)])
		.range([0, height]).nice();
		
var xScale = d3.scaleBand()
		.domain(d3.range(0, dataset.length))
		.range([0,width])
		.padding(.2);

var vScale = d3.scaleLinear()
		.domain([0,d3.max(dataset)])
		.range([height, 0]).nice();
		
var hScale = d3.scaleBand()
		.domain(d3.range(0, dataset.length))
		.range([0,width])
		.padding(.2);
	
var g = svg.append('g')
	.attr("transform", "translate(" + 100 + "," + 100 + ")");

g.append('g')
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(xScale));
	
g.append('g')
	.call(d3.axisLeft(vScale).tickFormat(function(d){
		return d;
	}).ticks(10));

g.selectAll('rect')
	.data(dataset)
	.enter().append('rect')
		.style('fill','brown')
		.attr("x", function(d, i) { return xScale(i); })
		.attr("y", function(d){
				return height - yScale(d);
			})
		.attr("width", xScale.bandwidth())
		.attr("height", function(d){
				return yScale(d);
			})