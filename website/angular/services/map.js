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
        map.on('click', function(evt) {

        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                console.log(feature.markerID)
            });
        });

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
          //console.log("X = " + x + "\nAberdeenX = " + townCoordinates[0])
          if(townCoordinates[0] >= x && townCoordinates[1] >= y)
          {
            //console.log(true)
          }
          else
          {
            //console.log(false)
          }
        }
      })
    }

    this.centerMap = function(x, y)
    {
        map.getView().setCenter(ol.proj.fromLonLat([y, x]));
    }

    this.setZoom = function(zoom)
    {
        map.getView().setZoom(zoom);
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
        markers.push(feature)

        feature.markerID = markers.length - 1;
        vectorSource.addFeature(feature);
        callback(markers.length - 1);
    }

    this.removeMarker = function(id) {
        vectorSource.removeFeature(markers[id]);
        delete markers[id];
    }

    this.apiDistance = function(flat, flng, tlat, tlng)
    {
        $http.get("/api/route/distance?flat="+flat+"&flng="+flng+"&tlat="+tlat+"&tlng="+tlng+"").then(function(d)
        {
            console.log(d.data.distance)
            return d.data.distance
        })
    }

    this.getDistanceBetween = function(firstPoint, secondPoint)
    {
        projection = 'EPSG:4326';

        length = 0;
        var sourceProj = map.getView().getProjection();
        var c1 = ol.proj.transform(firstPoint, sourceProj, projection);
        var c2 = ol.proj.transform(secondPoint, sourceProj, projection);

        var wgs84Sphere = new ol.Sphere(6378137);
        length += wgs84Sphere.haversineDistance(c1, c2);

        //console.log(length)

        return length;
    }

    this.filter = 
    {
        efficient : function(callback)
        {
            var points = markers.slice();
            var bestMatch = points[0];
            var bestDisnace = undefined;
            var bestIndex = 0;
            var out = [];
            
            out.push(bestMatch.markerID)
            points.splice(0, 1);

            while(points.length > 0)
            {
                var found = null;
                var foundIndex = null;

                for(var i = 0; i < points.length; i++)
                {
                    //console.log(i);
                    if(bestDisnace == undefined)
                    {
                        found = points[i];
                        foundIndex = i;
                        //bestDisnace = self.getDistanceBetween(bestMatch.getGeometry().getCoordinates(), points[i].getGeometry().getCoordinates());
                        bestDisnace = parseInt(self.apiDistance(bestMatch.getGeometry().getCoordinates()[0], bestMatch.getGeometry().getCoordinates()[1], points[i].getGeometry().getCoordinates()[0], points[i].getGeometry().getCoordinates()[1]))
                        console.log(bestDisnace)
                    }
                    else
                    {
                        //var newDistance = self.getDistanceBetween(bestMatch.getGeometry().getCoordinates(), points[i].getGeometry().getCoordinates());
                        var newDistance = parseInt(self.apiDistance(bestMatch.getGeometry().getCoordinates()[0], bestMatch.getGeometry().getCoordinates()[1], points[i].getGeometry().getCoordinates()[0], points[i].getGeometry().getCoordinates()[1]))
                        if(bestDisnace > newDistance)
                        {
                            //console.log(newDistance)
                            found = points[i];
                            foundIndex = i;
                        }

                        if(i >= points.length - 1)
                        {
                            if(found != null)
                            {
                                //console.log(points.length - 1)
                                bestMatch = found;
                                bestIndex = foundIndex;
                                bestDisnace = undefined;
                                out.push(bestMatch.markerID);
                                //console.log("Removed " + i)
                                points.splice(foundIndex, 1);

                                if(points.length == 1)
                                {
                                    out.push(points[0].markerID);
                                    points.splice(0, 1);
                                    //Note to self... 6 hours, 3x coffees and 2x 500ml Monsters... it works...
                                }
                            }
                        }
                    }
                }
            } 

            callback(out);                                                             
        }
    }

    this.savePlannedJourney = function(journey, callback)
    {
        $http.post("/api/user/journey/new", journey).then(function(r)
        {
            console.log(r.data);
            callback(r.data);
        })
    }
});

