function getJSONSync() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "json.json", false);// false means sync way.
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();// the process will hold on, waiting for the xml response
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        document.getElementById("display").innerHTML = "from asyn ajax request: " + xmlhttp.response;
    }
}

function getJSONAsync() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "json.json", true);// if use true , add callback to xmlhtml.onreadystatechange = function(){...}
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("display").innerHTML = "from sync ajax request: " + xmlhttp.response;
            console.log("done");
        }
    }
    xmlhttp.send();
}

/* getJSONObject(url) */
/* getJSONObject(url, params) */
/* getJSONObject(url, callback) */
/* getJSONObject(url, params, callback) */
function getJSONObject(url, params, callback) {
    /*
    var args = Array.prototype.slice(arguments);
    if (args.length == 0 || typeof(args[0]) != 'string') throw new Error('need url.');
    
    var arg, callback, params, url = args.shift();
    while (arg = args.pop()) {
        if (typeof arg == 'function') callback = arg;
        else if (typeof arg == 'string') params = arg;
    }
    */
    
    if (arguments.length < 1) throw new Error("need the url for JSON");
    var xmlhttp = new XMLHttpRequest();
    var hasParams = true;
    if (typeof params === "function" || arguments.length < 2) hasParams = false;
    if (hasParams) {
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
    } else {
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var jsonObject;
            if (!JSON) {
                jsonObject = eval('(' + xmlhttp.responseText + ')');
            } else {
                jsonObject = JSON.parse(xmlhttp.responseText);
            }

            if (typeof params === "function") {
                callback = params;
            }
            callback && callback.call(this,jsonObject);
        }
    }
}

function getJSONs() {
    var results = [];
    var args = Array.prototype.slice.call(arguments);
    var callback = args.pop();

    args.forEach(function (val, key) {
        getJSONObject(val, function (jsonObject) {
            results[key] = jsonObject;
            if (results.length == args.length) {
                callback && callback.call(this, results);
            }
        });
    })
}
