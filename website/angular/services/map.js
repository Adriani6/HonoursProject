portal.service('Map', function($http) {

    var self = this;

    var waiting = false;

    var map = undefined;
    var markers = [];
    var vectorSource = new ol.source.Vector(),
        vectorLayer = new ol.layer.Vector({
            source: vectorSource
        })

    this.attachListeners = function()
    {
      map.getView().on('change:center', function()
      {
        var townCoordinates = [57.149651, -2.099075];
        //var s = ol.extent.containsCoordinate(self.getVisible(), )
        var extent = map.getView().calculateExtent(map.getSize());
        extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326')

        var y = extent[0];
        var x = extent[1];
        var zoom = Math.floor(map.getView().getZoom());
        
        if(zoom > 10)
        {
          console.log("X = " + x + "\nAberdeenX = " + townCoordinates[0])
          if(townCoordinates[0] >= x && townCoordinates[1] >= y)
          {
            console.log(true)
          }
          else
            console.log(false)
        }
      })
    }

    this.centerMap = function(x, y)
    {
        map.getView().setCenter(ol.proj.fromLonLat([y, x]));
        map.getView().setZoom(11);
    }

    this.getVisible = function()
    {
      return map.getView().calculateExtent(map.getSize());
    }

    this.loadMap = function(callback) {
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

        this.attachListeners();
        callback();
    }

    /**
     * @param {double} lon Longitude.
     * @param {double} lat Latitude.
     * @param {function} callback Returns ID assigned to marker.
     */
    this.addMarker = function(label, lon, lat, callback) {
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
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 2
                }),
                text: label
            })
        });

        var feature = new ol.Feature(
            new ol.geom.Point(
                ol.proj.transform([lat, lon], 'EPSG:4326', 'EPSG:3857')
            )
        );
        feature.setStyle(iconStyle);
        vectorSource.addFeature(feature);
        markers.push(feature)
        callback(markers.length - 1);
    }

    this.removeMarker = function(id) {
        vectorSource.removeFeature(markers[id]);
        delete markers[id];
    }
});