/// GLOBAL VALUES

/** Template for the map marker annotations */
const TPL_MARKER = document.querySelector("template.marker");
/** Default map zoom */
const MARKER_COUNT = 3;
/** Default map focus point */
const CENTER_COORDS = [37, -95];
/** Index-coordinate mapping */
const LAT = 0;
/** Index-coordinate mapping */
const LOG = 1;

/** Global map context */
var map = L.map("map", {
    center: CENTER_COORDS,
    zoom: 4
});

/** Number of markers generated with `makeMarker()` */
var markerCount = 0;

/// ENTRY POINT | MAIN

// attribution
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

for (let i = 0; i < MARKER_COUNT; i++) {
    let coords = getBoundedCoords();
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords[LAT]}&longitude=${coords[LOG]}&localityLanguage=en`)
        .then(resp => resp.json())
        .then(obj => {
            console.log(obj.locality)
            makeMarker(coords, obj.locality);
        })
}

/// DEFINITIONS

/**
 * Generates a random number between `lower` and `upper` with `precision` decimals.
 * @param {Number} lower is the lower bound for the random number
 * @param {Number} upper is the upper bound for the random number
 * @param {Number} precision determines the number of decimal places in the random number
 * @returns {Number}
 */
function randomNumberInRange(lower, upper, precision) {
    return Number((Math.random() * (upper - lower) + lower).toFixed(precision));
}

/**
 * Generates coordinates bounded by design doc specs.
 * @returns {Array} containing bounded random 2-dimension coordinates
 */
function getBoundedCoords() {
    return [randomNumberInRange(30, 35, 3), randomNumberInRange(-90, -100, 3)];
}

/**
 * Creates a map marker and corresponding annotation
 * @param {Number[]} coordinates 2-dimensional global coordinates
 * @param {String} locale String name of locality (from bigdatacloud.net API)
 */
function makeMarker([lat, log], locale) {

    // WARN(chris): ASSUMES CAN MAKE MARKER!
    markerCount++;

    const tpl = TPL_MARKER.content.cloneNode(true);
    const fields = tpl.querySelectorAll("span");

    document.body.appendChild(tpl);

    // put data into template
    fields[0].append(markerCount);
    fields[1].append(lat);
    fields[2].append(log);
    fields[3].append(locale);
    // put cooresponding marker into map
    L.marker([lat, log], {
        title: locale,
    }).addTo(map);
    
}

