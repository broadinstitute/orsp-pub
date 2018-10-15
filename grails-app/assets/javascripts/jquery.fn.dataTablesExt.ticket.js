jQuery.fn.dataTableExt.oSort['ticket-asc'] = function (a, b) {
    /* Remove anchor and non-digit characters */
    var div = $(document.createElement("div"));
    var x = $(div).html(a).text().replace(/^\D*/g, "");
    var y = $(div).html(b).text().replace(/^\D*/g, "");

//    console.log("X value is: " + x);
//    console.log("Y value is: " + y);

    /* Parse and return */
    x = parseInt(x);
    y = parseInt(y);

    return x - y;
};

jQuery.fn.dataTableExt.oSort['ticket-desc'] = function (a, b) {
    /* Remove anchor and non-digit characters */
    var div = $(document.createElement("div"));
    var x = $(div).html(a).text().replace(/^\D*/g, "");
    var y = $(div).html(b).text().replace(/^\D*/g, "");

//    console.log("X value is: " + x);
//    console.log("Y value is: " + y);

    /* Parse and return */
    x = parseInt(x);
    y = parseInt(y);

    return y - x;
};