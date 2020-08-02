const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const monthTicks = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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


function updateInfo(slideIdx){
    if(slideIdx == 1){
        d3.select(".chart-info").html("As we can observe in the chart, there are two obvious patterns in the dataset."
        + "</br></br>"
        + "Most of the incidents of forest fire has occured in the months of July, August and Spetember,"
        + "while there are no incidents in the months of January and November."
        + "</br></br>"
        + "This may be due to the fact that the temperatures in the months of July, August and Spetember are generally higher compared to other months."
        + "</br></br>"
        + "There is another interesting pattern to be observed here. On and around weekends, there are more incidents of forest fires."
        );
    }else if(slideIdx == 2){
        d3.select(".chart-info").html("Temperature plays an important role in forest fires."
        + "</br></br>"
        + "As we can see in the scatterplot, as temperature increases, the incidents of forest fires increases."
        + "</br></br>"
        + "Most of the incidents are between temperatures of 15&#8451; - 30&#8451;, while there are very few incidents for lower temperatures."
        + "</br></br>"
        + "Also, with increase in wind speed, the incidents of forest fires increase. In the adjoining scatterplot, wind speed is encoded as the circle radius."
        + "</br></br>"
        + "It is also noteworthy that, once temperature is in the range of 15&#8451; - 30&#8451; and wind speed in the range of 15 km/h - 30km/h,"+
        + "the area of forest under fire does not show a correlation of temperature and wind speed. "
        );
    }else{
        d3.select(".chart-info").html("As we can observe in the chart, there are two obvious patterns in the dataset."
        + "</br></br>"
        + "Most of the incidents of forest fire has occured in the months of July, August and Spetember,"
        + "while there are no incidents in the months of January and November."
        + "</br></br>"
        + "This may be due to the fact that the temperatures in the months of July, August and Spetember are generally higher compared to other months."
        + "</br></br>"
        + "There is another interesting pattern to be observed here. On and around weekends, there are more incidents of forest fires."
        );
    }
    
}

function updateSlideNum(slideIdx) {
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

function updateLegend(maxVal) {
    var svgWidth = document.getElementById("chartId").offsetWidth - 100;
    var svg = d3.select('svg');
    const defs = svg.append('defs');
    const areaGradient = defs
        .append('linearGradient')
        .attr('id', 'gradient-legend');
    areaGradient
        .append('stop')
        .attr('stop-color', '#ffc500')
        .attr('offset', '0%');
    areaGradient
        .append('stop')
        .attr('stop-color', '#c21500')
        .attr('offset', '100%');

    xs = d3.scaleLinear().domain([0, maxVal]).range([0, svgWidth / 5.5]);
    svg.select(".legend")
        .attr("x", svgWidth - svgWidth / 6)
        .attr("y", 55)
        .attr("width", svgWidth / 5.5)
        .attr("height", 10)
        .attr("fill", "url(#gradient-legend)");

    svg.selectAll(".legend-axis")
        .attr("transform", "translate(" + (svgWidth - svgWidth / 6) + "," + 65 + ")")
        .call(d3.axisBottom(xs).tickValues([0, maxVal]));

    svg.selectAll(".legendtext")
        .attr("x", svgWidth - svgWidth / 6 + 20)
        .attr("y", 50)
        .text("Area (acres)");
}

function addLegend(maxVal) {
    var svgWidth = document.getElementById("chartId").offsetWidth - 100;
    var svg = d3.select('svg');
    const defs = svg.append('defs');
    const areaGradient = defs
        .append('linearGradient')
        .attr('id', 'gradient-legend');
    areaGradient
        .append('stop')
        .attr('stop-color', '#ffc500')
        .attr('offset', '0%');
    areaGradient
        .append('stop')
        .attr('stop-color', '#c21500')
        .attr('offset', '100%');

    xs = d3.scaleLinear().domain([0, maxVal]).range([0, svgWidth / 5.5]);

    svg
        .append("rect")
        .attr("class", "legend")
        .attr("x", svgWidth - svgWidth / 6)
        .attr("y", 55)
        .attr("width", svgWidth / 5.5)
        .attr("height", 10)
        .attr("fill", "url(#gradient-legend)");

    svg
        .append("g")
        .attr("class", "legend-axis")
        .attr("transform", "translate(" + (svgWidth - svgWidth / 6) + "," + 65 + ")")
        .call(d3.axisBottom(xs).tickValues([0, maxVal]));

    svg.append("text")
        .attr("class", "legendtext")
        .attr("x", svgWidth - svgWidth / 6 + 20)
        .attr("y", 50)
        .text("Area (acres)");
}

function showSlide1() {
    updateInfo(1);
    updateSelected(1);
    updateSlideNum(1);
    d3.selectAll("svg > *").remove();
    xdomain = [parseInt(Math.min(...monthwiseArea)), parseInt(Math.max(...monthwiseArea))];
    xrange = [0, 100];
    ydomain = [1, 12];
    yrange = [0, 380];
    var tooltip = d3.select("body").append("div").attr("class", "tooltip");
    var svg = d3.select('svg');

    const defs = svg.append('defs');
    const areaGradient = defs
        .append('linearGradient')
        .attr("gradientUnits", "userSpaceOnUse")
        .attr('id', 'area-gradient');
    areaGradient
        .append('stop')
        .attr('stop-color', '#ffc500')
        .attr('offset', '0%');
    areaGradient
        .append('stop')
        .attr('stop-color', '#c21500')
        .attr('offset', '100%');

    xs = d3.scaleLinear().domain(xdomain).range(xrange);
    ys = d3.scaleLinear().domain(ydomain).range(yrange);
    ys1 = d3.scaleBand().domain(monthTicks).range(yrange);
    svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 60 + ")")
        .selectAll('rect')
        .data(monthwiseArea)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', function (d, i) { return i * ys1.bandwidth(); })
        .attr('width', function (d, i) { return xs(d) + "%"; })
        .attr('height', ys1.bandwidth() - 2)
        .style('fill', 'url(#area-gradient)')
        .on("mouseover", function (d) {
            d3.select(this).style("fill", "#9f34eb");
        })
        .on("mousemove", function (d, i) {
            tooltip
                .style("left", d3.event.pageX - 10 + "px")
                .style("top", function (d, i) {
                    return d3.event.pageY + 30 + "px";
                }
                )
                .style("display", "block")
                .html("Total area under fire: " + d.toFixed(2) + " acres"
                    + "</br></br>Daywise observations (in acres):</br>"
                    + "<div class = 'daywise'>"
                    + "<table><tr><td>Sunday:</td><td>" + (monthAndDayWise[i][0]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Monday:</td><td>" + (monthAndDayWise[i][1]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Tuesday:</td><td>" + (monthAndDayWise[i][2]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Wednesday:</td><td>" + (monthAndDayWise[i][3]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Thursday:</td><td>" + (monthAndDayWise[i][4]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Friday:</td><td>" + (monthAndDayWise[i][5]).toFixed(2) + "</td></tr>"
                    + "<tr><td>Saturday:</td><td>" + (monthAndDayWise[i][6]).toFixed(2) + "</td></tr></table></div>"
                );
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", 'url(#area-gradient)');
            tooltip.style("display", "none");
        });



    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 60 + ")")
        .call(d3.axisLeft(ys1));

    var svgWidth = document.getElementById("chartId").offsetWidth - 100;
    d3.select("svg")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 50 + "," + 440 + ")")
        .call(d3.axisBottom(d3.scaleLinear().domain(xdomain).range([0, svgWidth])));

    svg.append("text")
        .attr("transform",
            "translate(" + (svgWidth / 2 + 10) + " ," +
            475 + ")")
        .attr("class", "xlabel")
        .text("Total area (in acres)");

    svg.append("text")
        .attr("class", "ylabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("x", -250)
        .attr("dy", "1em")
        .text("Months");

    

    addLegend(8000);



    svg.append("line")
    .style("stroke", "#9f34eb")
    .style("stroke-width", 2)
        .attr("x1", xs(monthwiseArea[6])+ 50)
        .attr("x2", 450)
        .attr("y1", 265)
        .attr("y2", 200);

    svg.append("line")
    .style("stroke", "#9f34eb")
    .style("stroke-width", 2)
        .attr("x1", xs(monthwiseArea[7]))
        .attr("x2", 450)
        .attr("y1", 300)
        .attr("y2", 200);

    
    svg.append("line")
    .style("stroke", "#9f34eb")
    .style("stroke-width", 2)
        .attr("x1", xs(monthwiseArea[8]))
        .attr("x2", 450)
        .attr("y1", 330)
        .attr("y2", 200);

    svg.append("text")
        .attr("transform",
            "translate(" + 452 + " ," +
            205 + ")")
        .attr("class", "annotation")
        .text("Months with high impact");

    d3.select(".chartheader").html("Month wise forest area(in acres) under fire");
}

function updateXAxis() {
    var slideIdx = document.getElementById("slideIdx").innerHTML;
    if (slideIdx === "1") {
        var svgWidth = document.getElementById("chartId").offsetWidth - 100;
        var svg = d3.select('svg');
        xdomain = [parseInt(Math.min(...monthwiseArea)), parseInt(Math.max(...monthwiseArea))];
        xrange = [0, svgWidth];
        xs = d3.scaleLinear().domain(xdomain).range(xrange);
        svg.selectAll("g.x.axis")
            .call(d3.axisBottom(d3.scaleLinear().domain(xdomain).range([0, svgWidth])));
        svg.selectAll(".xlabel")
            .attr("transform",
                "translate(" + (svgWidth / 2 + 10) + " ," +
                (475) + ")")
            .text("Total area (in acres)");
        updateLegend(8000);
    } else {
        var svgWidth = document.getElementById("chartId").offsetWidth - 100;
        var svg = d3.select('svg');
        xdomain = getAreaRange(areaDataSet);
        xrange = [0, svgWidth];
        xs = d3.scaleLinear().domain(xdomain).range(xrange);
        svg.selectAll("g.x.axis")
            .call(d3.axisBottom(d3.scaleLinear().domain([xdomain[0], Math.exp(xdomain[1])]).range([0, svgWidth])));
        svg.selectAll(".xlabel")
            .attr("transform",
                "translate(" + (svgWidth / 2 + 10) + " ," +
                (475) + ")")
            .text("Area (in acres)");
        updateLegend(2700);
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
    updateSelected(2);
    updateInfo(2);
    areaDataSet = getDataSetWithValidArea();

    xdomain = getAreaRange(areaDataSet);
    xrange = [0, 100];
    ydomain = getTempRange(areaDataSet);
    yrange = [0, 380];


    var tooltip = d3.select("body").append("div").attr("class", "tooltip");
    xs = d3.scaleLinear().domain(xdomain).range(xrange);
    ys = d3.scaleLinear().domain(ydomain).range(yrange);
    xs1 = d3.scaleLinear().domain([xdomain[0], Math.exp(xdomain[0])]).range(xrange);

    d3.selectAll("svg > *").remove();
    var svg = d3.select('svg');

    const defs = svg.append('defs');
    const areaGradient = defs
        .append('linearGradient')
        .attr("gradientUnits", "userSpaceOnUse")
        .attr('id', 'area-gradient');
    areaGradient
        .append('stop')
        .attr('stop-color', '#ffc500')
        .attr('offset', '0%');
    areaGradient
        .append('stop')
        .attr('stop-color', '#c21500')
        .attr('offset', '100%');


    svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 60 + ")")
        .selectAll('circle')
        .data(areaDataSet)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            if (d.area > 1) {
                return xs(Math.log(d.area)) + "%";
            } else {
                return .5;
            }
        })
        .attr("cy", function (d) { return ys(d.temp); })
        .attr("r", function (d) { return 2.8 * Math.log10(d.wind); })
        .style('fill', 'url(#area-gradient)')
        .on("mouseover", function (d) {
            d3.select(this).style("fill", "#9f34eb").attr("r", 7);
            tooltip
                .style("left", d3.event.pageX - 10 + "px")
                .style("top", d3.event.pageY + 20 + "px")
                .style("display", "block")
                .html("Total area under fire: " + d.area.toFixed(2) + " acres."
                    + "</br>"
                    + "Temperture: " + d.temp + " &#8451;"
                    + "</br>"
                    + "Wind: " + d.wind + " km/h"
                );
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", 'url(#area-gradient)').attr("r", function (d) { return 2.8 * Math.log10(d.wind); });
            tooltip.style("display", "none");
        });

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 60 + ")")
        .call(d3.axisLeft(ys));

    var svgWidth = document.getElementById("chartId").offsetWidth - 100;
    d3.select("svg")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 50 + "," + 440 + ")")
        .call(d3.axisBottom(d3.scaleLinear().domain([xdomain[0], Math.exp(xdomain[1])]).range([0, svgWidth])));

    svg.append("text")
        .attr("transform",
            "translate(" + (svgWidth / 2 + 10) + " ," +
            (475) + ")")
        .attr("class", "xlabel")
        .text("Area (in acres)");

    svg.append("text")
        .attr("class", "ylabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("x", -250)
        .attr("dy", "1em")
        .text("Temperature ( degree Celcius)");

    addLegend(2700);

    d3.select(".chartheader").html("Impact of Temperature and Wind on Forest area.");
}

function updateSelected(slideIdx){
    if(slideIdx == 3 ){
        document.getElementById("slide3").style.color = "white";
        document.getElementById("slide3").style.backgroundColor = "#9f34eb";
        document.getElementById("slide1").style.backgroundColor = "#e6e6ff";
        document.getElementById("slide1").style.color = "black";
        document.getElementById("slide2").style.backgroundColor = "#e6e6ff";
        document.getElementById("slide2").style.color = "black";
    }else if(slideIdx == 2){
        document.getElementById("slide2").style.color = "white";
        document.getElementById("slide2").style.backgroundColor = "#9f34eb";
        document.getElementById("slide1").style.backgroundColor = "#e6e6ff";
        document.getElementById("slide1").style.color = "black";
        document.getElementById("slide3").style.backgroundColor = "#e6e6ff";
        document.getElementById("slide3").style.color = "black";
    }else{
        document.getElementById("slide1").style.color = "white";
        document.getElementById("slide1").style.backgroundColor = "#9f34eb";
        document.getElementById("slide2").style.backgroundColor = "#e6e6ff";
        document.getElementById("slide2").style.color = "black";
        document.getElementById("slide3").style.backgroundColor = "#e6e6ff";
        document.getElementById("slide3").style.color = "black";
    }
}

function showSlide3() {
    updateInfo(3);
    updateSelected(3);
    updateSlideNum(3);
    areaDataSet = getDataSetWithValidArea();

    xdomain = getAreaRange(areaDataSet);
    xrange = [0, 100];
    ydomain = getRHRange(areaDataSet);
    yrange = [0, 380];

    xs = d3.scaleLinear().domain(xdomain).range(xrange);
    ys = d3.scaleLinear().domain(ydomain).range(yrange);
    xs1 = d3.scaleLinear().domain([xdomain[0], Math.exp(xdomain[0])]).range(xrange);

    d3.selectAll("svg > *").remove();
    var svg = d3.select('svg');
    var tooltip = d3.select("body").append("div").attr("class", "tooltip");

    const defs = svg.append('defs');
    const areaGradient = defs
        .append('linearGradient')
        .attr("gradientUnits", "userSpaceOnUse")
        .attr('id', 'area-gradient');
    areaGradient
        .append('stop')
        .attr('stop-color', '#ffc500')
        .attr('offset', '0%');
    areaGradient
        .append('stop')
        .attr('stop-color', '#c21500')
        .attr('offset', '100%');

    svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 60 + ")")
        .selectAll('circle')
        .data(areaDataSet)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            if (d.area > 1) {
                return xs(Math.log(d.area)) + "%";
            } else {
                return .5;
            }
        })
        .attr("cy", function (d) { return ys(d.RH); })
        .attr("r", function (d) { return 3 + d.rain })
        .style('fill', function (d, i) {
            if (d.rain === 0) {
                return 'url(#area-gradient)';
            } else {
                return "#009900";
            }
        })
        .on("mouseover", function (d) {
            d3.select(this).style("fill", "#a834eb").attr("r", 7);
            tooltip
                .style("left", d3.event.pageX - 10 + "px")
                .style("top", d3.event.pageY + 20 + "px")
                .style("display", "block")
                .html("Total area under fire: " + d.area.toFixed(2) + " acres."
                    + "</br>"
                    + "Relative humidity: " + d.RH + " %"
                    + "</br>"
                    + "Rain: " + d.rain + " mm/m2"
                );
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", function (d, i) {
                if (d.rain === 0) {
                    return 'url(#area-gradient)';
                } else {
                    return "#009900";
                }
            }).attr("r", function (d) { return 3 + d.rain; });
            tooltip.style("display", "none");
        });

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 60 + ")")
        .call(d3.axisLeft(ys));

    var svgWidth = document.getElementById("chartId").offsetWidth - 100;
    d3.select("svg")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 50 + "," + 440 + ")")
        .call(d3.axisBottom(d3.scaleLinear().domain([xdomain[0], Math.exp(xdomain[1])]).range([0, svgWidth])));

    svg.append("text")
        .attr("transform",
            "translate(" + (svgWidth / 2 + 10) + " ," +
            (475) + ")")
        .attr("class", "xlabel")
        .text("Area (in acres)");

    svg.append("text")
        .attr("class", "ylabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("x", -250)
        .attr("dy", "1em")
        .text("Relative humidity (%)");

    addLegend(2700);

    svg.append("circle")
    .attr("class", "rain")
    .attr("cx", 627)
    .attr("cy", 90)
    .attr("fill", "#009900")
    .attr("r", 7);

    svg.append("text")
    .attr("class", "raintext")
    .attr("x", 647)
    .attr("y", 94)
    .text("Rain");

    svg.append("circle")
    .attr("class", "norain")
    .attr("cx", 627)
    .attr("cy", 110)
    .attr("fill", "#ff751a")
    .attr("r", 7);

    svg.append("text")
    .attr("class", "noraintext")
    .attr("x", 647)
    .attr("y", 114)
    .text("No Rain");

    d3.select(".chartheader").html("Impact of Relative Humidity and Rain on Forest area.");
}