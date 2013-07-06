﻿$(document).ready(function () {
    $('#fromgroundzero').click(function () {
        $("section#from_groundzero").toggle('slow');
        $("section#from_onepoint").toggle('slow');
    });

    $("#switchtide").click(function () {
        var elt1 = $("section#tide_selection").children().eq(0);
        var elt2 = $("section#tide_selection").children().eq(1);
        elt2.insertBefore(elt1);
        isDescendant != isDescendant;
    });

    $("#compute").click(function () {
        $("#input").toggle('slow');
        $("#chart").empty();
        ComputeGraph();
        $("#graph").toggle('slow');
    });

    $("#back").click(function () {
        $("#input").toggle('slow');
        $("#graph").toggle('slow');
    });
});

function ComputeGraph() {
    var isFromGroundZero = $("#fromgroundzero").is(':checked')
    if (isFromGroundZero) {
        alert("feature not ready yet");
    }
    var lowTideTime = timeToFloat($("#lowtide_time").val());
    var highTideTime = timeToFloat($("#hightide_time").val());
    var M = parseFloat($("#tidal_value").val());
    var localPointTime = timeToFloat($("#onepoint_time").val());
    var localPointValue = parseFloat($("#onepoint_value").val());

    //TODO add validation.
    var isEbb = isEbbTide(highTideTime, lowTideTime);
    var D = isEbb ? smartDuration(highTideTime ,lowTideTime) : smartDuration(lowTideTime, highTideTime);
    var data = [];
    var start = isEbb ? highTideTime : lowTideTime;
    var h0 = hFromt(D, M, localPointTime - highTideTime) - localPointValue;
    for (var i = 0; i < 1000; i++) {
        var t1 = i * D / 1000;
        var t2 = start + t1 - lowTideTime;
        data.push({ x: start + t1, y: hFromt(D, M, t2) + h0 });
    }

    var graph = new Rickshaw.Graph({
        element: document.querySelector("#chart"),
        width: 580,
        height: 250,
		renderer: 'line',
        series: [{
            color: 'steelblue',
            data: data,
            name: 'depth'
        }]
    });

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        xFormatter: function(x) { return floatToTime(x)},
        yFormatter: function (y) { return y.toFixed(2) + " m" }
    });

    var axes = new Rickshaw.Graph.Axis.X({
        graph: graph,
        tickFormat: floatToTime
    });

    var axes = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT
    });

    graph.render();

}

Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
}

function smartDuration(start, end) {
    var duration = end - start;
    return (Math.floor(duration).mod(24)) + (duration - Math.floor(duration));
}

function isEbbTide(highTideTime, lowTideTime) {
    var m1 = smartDuration(highTideTime, lowTideTime);
    var m2 = smartDuration(lowTideTime,highTideTime);
    return m1 < m2; 
}

function hFromt(D, M, t, isEbb){
    var y = Math.sin(Math.PI * t / (2 * D));
    return M * y * y;
}

function floatToTime(value) {
    var hours = Math.floor(value).mod(24);
    var minutes = Math.floor((value - Math.floor(value)) * 60);
    if(minutes < 10){
        minutes = '0'+minutes;
    }
    if(hours < 10) {
        hours = '0' + hours;
    }
    return  hours+ ':' + minutes;
}

function timeToFloat(timeString) {
    var splitted = timeString.split(':');
    var hours = parseFloat(splitted[0]);
    var minutes = parseFloat(splitted[1]);

    return hours + minutes / 60.0;
}

function ValidateInput() {
    var lowTideTime = timeToFloat($("#lowtide_time").val());
    var highTideTime = timeToFloat($("#hightide_time").val());
    var M = parseFloat($("#tidal_value").val());
    var localPointTime = timeToFloat($("#onepoint_time").val());
    var localPointValue = parseFloat($("#onepoint_value").val());

}