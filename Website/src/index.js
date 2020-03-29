import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

// Problem Data will be Niko's automatically updating database
const sourceData = require('../public/problemdata.json');
console.log(sourceData[0]);

window.initMap = () => {

    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.0195, lng: -118.4912 },
        zoom: 14,
    });

    const overlay = new GoogleMapsOverlay({
        layers: [
            scatterplot(),
            heatmap(),
            hexagon()
        ],
    });


    overlay.setMap(map);

}

// Hexs not utilized in application
const hexagon = () => new HexagonLayer({
    id: 'hex',
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    // Change Elevation depending on amount in certain area
    getElevationWeight: d => d.n_test,
    elevationScale: 0,
    extruded: true,
    radius: 0,
    lowerPercentile: 0
    //test

});
const heatmap = () => new HeatmapLayer({
    id: 'heat',
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    getWeight: d => d.n_killed,
    radiusPixels: 60,


});

function getData(sourceData, imageID) {

}
const scatterplot = () => new ScatterplotLayer({
    id: 'scatter',
    data: sourceData,
    opacity: 0.7,
    filled: true,
    radiusMinPixels: 20,
    radiusMaxPixels: 30,
    getPosition: d => [d.longitude, d.latitude],
    // 
    getFillColor: d => d.n_problems > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],
    pickable: true,
    onHover: ({ object, x, y }) => {
        const el = document.getElementById('tooltip');
        if (object) {
            const { n_problems, incident_id } = object;
            el.innerHTML = `
            <h3 class="thetool">Local Problem:</h3>
            <h4>Description: ${object.notes}</h4>
            <p>Latitude: ${object.latitude}</p>
            <p>Longitude: ${object.longitude}</p>
            <img src=${object.imag3} class="imgpopup">
            `
            el.style.display = 'block';
            el.style.opacity = 0.9;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        } else {
            el.style.opacity = 0.0;
        }
    },

    /* onClick: ({ object, x, y }) => {
        window.open(`https://www.youtube.com/}`)
    }, */
});