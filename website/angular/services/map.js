portal.service('Map', function($http) {

  var map = undefined;
  var markers = [];
    var 
    vectorSource = new ol.source.Vector(),
    vectorLayer = new ol.layer.Vector({
      source: vectorSource
    })

  this.loadMap = function()
  {
    map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          vectorLayer
        ],
        target: 'map',
        controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
          })
        }),
        view: new ol.View({
          center: [-6655.5402445057125, 6709968.258934638],
          zoom: 5
        })
      });
  }  

    /**
     * @param {double} lon Longitude.
     * @param {double} lat Latitude.
     * @param {function} callback Returns ID assigned to marker.
    */
    this.addMarker = function(label, lon, lat, callback)
    {
         var iconStyle = new ol.style.Style({
          image: new ol.style.Icon({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              opacity: 1,
              src: 'markers/museums.png'
          }),
          text: new ol.style.Text({
              font: '12px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 2
              }),
              text: label
          })
      });

      var feature = new ol.Feature(
        new ol.geom.Point(
                ol.proj.transform([lat,lon], 'EPSG:4326', 'EPSG:3857')
            )
       );
      feature.setStyle(iconStyle);
      vectorSource.addFeature(feature);
      markers.push(feature)
      callback(markers.length - 1);
    }

    this.removeMarker = function(id)
    {
        vectorSource.removeFeature(markers[id]);
        delete markers[id];   
    }
});