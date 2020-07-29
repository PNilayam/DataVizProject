const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
var dataset = [];
var monthwiseArea = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var monthAndDayWise = [[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0]];

function updateSlideNum(slideIdx){
    document.getElementById("slideIdx").innerHTML = slideIdx;
}

function prepareMonthwiseData(datarow) {
    monthwiseArea[months.indexOf(datarow["month"])] = monthwiseArea[months.indexOf(datarow["month"])] + datarow["area"];
    monthAndDayWise[months.indexOf(datarow["month"])][days.indexOf(datarow["day"])] = monthAndDayWise[months.indexOf(datarow["month"])][days.indexOf(datarow["day"])] + datarow["area"];
}

async function prepareData() {
    dataset = await d3.csv("https://pnilayam.github.io/DataVizProject/forestfire.csv");
    for (var i = 0; i < dataset.length; i++) {
        dataset[i].area = parseFloat(dataset[i].area) * 2.47105;
        dataset[i].temp = parseFloat(dataset[i].temp);
        dataset[i].wind = parseFloat(dataset[i].temp);
        dataset[i].rain = parseFloat(dataset[i].rain);
        dataset[i].RH = parseFloat(dataset[i].RH);
        prepareMonthwiseData(dataset[i]);
    }
    showSlide1();
}

function showSlide1() {
    updateSlideNum(1);
    d3.selectAll("svg > *").remove();
    xdomain = [parseInt(Math.min(...monthwiseArea)), parseInt(Math.max(...monthwiseArea))];
    xrange = [0, 100];
    ydomain = [1, 12];
    yrange = [0, 400];
    var tooltip = d3.select("body").append("div").attr("class", "tooltip");
    var svg = d3.select('svg');

    xs = d3.scaleLinear().domain(xdomain).range(xrange);
    ys = d3.scaleLinear().domain(ydomain).range(yrange);
    ys1 = d3.scaleBand().domain(months).range(yrange);
    svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 50 + ")")
        .selectAll('rect')
        .data(monthwiseArea)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', function (d, i) { return i * ys1.bandwidth(); })
        .attr('width', function (d, i) { return xs(d) + "%"; })
        .attr('height', ys1.bandwidth() - 2)
        .style('fill', "#348ceb")
        .on("mouseover", function(d){
            d3.select(this).style("fill", "#eb8034");
        })
        .on("mousemove", function (d, i) {
            tooltip
                .style("left", d3.event.pageX - 10 + "px")
                .style("top", d3.event.pageY + 20 + "px")
                .style("display", "block")
                .html("Total area under fire: " + d.toFixed(2) + "acres"
                    + "</br>"
                    + "Daywise observations(aggregated):</br></br>"
                    + "<table><tr><td>Sunday:</td><td>" + (monthAndDayWise[i][0]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Monday:</td><td>" + (monthAndDayWise[i][1]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Tuesday:</td><td>" + (monthAndDayWise[i][2]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Wednesday:</td><td>" + (monthAndDayWise[i][3]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Thursday:</td><td>" + (monthAndDayWise[i][4]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Friday:</td><td>" + (monthAndDayWise[i][5]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Saturday:</td><td>" + (monthAndDayWise[i][6]).toFixed(2) + "</td></tr></table>"
                );
        })
        .on("mouseout", function (d) { 
            d3.select(this).style("fill", "#348ceb");
            tooltip.style("display", "none"); 
        });

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 50 + ")")
        .call(d3.axisLeft(ys1));

    var svgWidth = document.getElementById("chartId").offsetWidth - 100;
    d3.select("svg")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 50 + "," + 450 + ")")
        .call(d3.axisBottom(d3.scaleLinear().domain(xdomain).range([0, svgWidth])));
    d3.select(".chartheader").html("Month wise forest area(in acres) under fire");
}

function updateXAxis() {
    var slideIdx = document.getElementById("slideIdx").innerHTML;
    if (slideIdx === "1"){
        var svgWidth = document.getElementById("chartId").offsetWidth - 100;
        var svg = d3.select('svg');
        xdomain = [parseInt(Math.min(...monthwiseArea)), parseInt(Math.max(...monthwiseArea))];
        xrange = [0, svgWidth];
        xs = d3.scaleLinear().domain(xdomain).range(xrange);
        svg.selectAll("g.x.axis")
            .call(d3.axisBottom(d3.scaleLinear().domain(xdomain).range([0, svgWidth])));
    }else{
        var svgWidth = document.getElementById("chartId").offsetWidth - 100;
        var svg = d3.select('svg');
        xdomain = getAreaRange(areaDataSet);
        xrange = [0, svgWidth];
        xs = d3.scaleLinear().domain(xdomain).range(xrange);
        svg.selectAll("g.x.axis")
        .call(d3.axisBottom(d3.scaleLinear().domain([xdomain[0], Math.exp(xdomain[1])]).range([0, svgWidth])));
    }
}

function getAreaRange(areaDataSet) {
    var minArea = 0;
    var maxArea = 0;
    for (var i = 0; i < areaDataSet.length; i++) {
        var areaF = parseFloat(areaDataSet[i].area);
        if (areaF < minArea) {
            minArea = areaF;
        }
        if (areaF > maxArea) {
            maxArea = areaF;
        }
    }
    return [0, Math.log(maxArea)];
}

function getTempRange(areaDataSet) {
    var minTemp = 0;
    var maxTemp = 0;
    for (var i = 0; i < areaDataSet.length; i++) {
        var tempF = parseFloat(areaDataSet[i].temp);
        if (tempF < minTemp) {
            minTemp = tempF;
        }
        if (tempF > maxTemp) {
            maxTemp = tempF;
        }
    }
    return [maxTemp, minTemp];
}

function getDataSetWithValidArea() {
    areaDataSet = []
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].area > 0) {
            areaDataSet.push(dataset[i]);
        }
    }
    return areaDataSet;
}

function getRHRange(areaDataSet) {
    var minRH = 0;
    var maxRH = 0;
    for (var i = 0; i < areaDataSet.length; i++) {
        var rhF = parseFloat(areaDataSet[i].RH);
        if (rhF < minRH) {
            minRH = rhF;
        }
        if (rhF > maxRH) {
            maxRH = rhF;
        }
    }
    return [maxRH, minRH];
}

function showSlide2() {
    updateSlideNum(2);
    areaDataSet = getDataSetWithValidArea();

    xdomain = getAreaRange(areaDataSet);
    xrange = [0, 800];
    ydomain = getTempRange(areaDataSet);
    yrange = [0, 400];


    var tooltip = d3.select("body").append("div").attr("class", "tooltip");
    xs = d3.scaleLinear().domain(xdomain).range(xrange);
    ys = d3.scaleLinear().domain(ydomain).range(yrange);
    xs1 = d3.scaleLinear().domain([xdomain[0], Math.exp(xdomain[0])]).range(xrange);

    d3.selectAll("svg > *").remove();
    var svg = d3.select('svg');

    svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 50 + ")")
        .selectAll('circle')
        .data(areaDataSet)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            if (d.area > 1) {
                return xs(Math.log(d.area));
            } else {
                return .5;
            }
        })
        .attr("cy", function (d) { return ys(d.temp); })
        .attr("r", function (d) { return d.wind / 5; })
        .style('fill', "#348ceb")
        .on("mouseover", function(d){
            d3.select(this).style("fill", "#eb8034").attr("r", 5);
            tooltip
                .style("left", d3.event.pageX - 10 + "px")
                .style("top", d3.event.pageY + 20 + "px")
                .style("display", "block")
                .html("Total area under fire: " + d.area.toFixed(2) + " acres."
                    + "</br>"
                    +"Temperture: "+d.temp+" &#8451;"
                    + "</br>"
                    +"Wind: "+d.wind+" km/h"
                );
        })
        .on("mouseout", function (d) { 
            d3.select(this).style("fill", "#348ceb").attr("r", function (d) { return d.wind / 5; });
            tooltip.style("display", "none"); 
        });

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 50 + ")")
        .call(d3.axisLeft(ys));

    var svgWidth = document.getElementById("chartId").offsetWidth - 100;
    d3.select("svg")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 50 + "," + 450 + ")")
        .call(d3.axisBottom(d3.scaleLinear().domain([xdomain[0], Math.exp(xdomain[1])]).range([0, svgWidth])));

    d3.select(".chartheader").html("Impact of Temperature and Wind on Forest area.");
}

function showSlide3() {
    updateSlideNum(3);
    areaDataSet = getDataSetWithValidArea();

    xdomain = getAreaRange(areaDataSet);
    xrange = [0, 800];
    ydomain = getRHRange(areaDataSet);
    yrange = [0, 400];

    xs = d3.scaleLinear().domain(xdomain).range(xrange);
    ys = d3.scaleLinear().domain(ydomain).range(yrange);
    xs1 = d3.scaleLinear().domain([xdomain[0], Math.exp(xdomain[0])]).range(xrange);

    d3.selectAll("svg > *").remove();
    var svg = d3.select('svg');
    var tooltip = d3.select("body").append("div").attr("class", "tooltip");
    svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 50 + ")")
        .selectAll('circle')
        .data(areaDataSet)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            if (d.area > 1) {
                return xs(Math.log(d.area));
            } else {
                return .5;
            }
        })
        .attr("cy", function (d) { return ys(d.RH); })
        .attr("r", function (d) { return 3 + d.rain })
        .style('fill', "#348ceb")
        .on("mouseover", function(d){
            d3.select(this).style("fill", "#eb8034").attr("r", 5);
            tooltip
                .style("left", d3.event.pageX - 10 + "px")
                .style("top", d3.event.pageY + 20 + "px")
                .style("display", "block")
                .html("Total area under fire: " + d.area.toFixed(2) + " acres."
                    + "</br>"
                    +"Relative humidity: "+d.RH+" %"
                    + "</br>"
                    +"Rain: "+d.rain+" mm/m2"
                );
        })
        .on("mouseout", function (d) { 
            d3.select(this).style("fill", "#348ceb").attr("r", function (d) { return 3 + d.rain; });
            tooltip.style("display", "none"); 
        });

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 50 + ")")
        .call(d3.axisLeft(ys));

    var svgWidth = document.getElementById("chartId").offsetWidth - 100;
    d3.select("svg")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 50 + "," + 450 + ")")
        .call(d3.axisBottom(d3.scaleLinear().domain([xdomain[0], Math.exp(xdomain[1])]).range([0, svgWidth])));

    d3.select(".chartheader").html("Impact of Relative Humidity and Rain on Forest area.");
}