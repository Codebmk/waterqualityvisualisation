import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Box } from "@mui/material";

const MAP_BOX_TOKEN =
  "pk.eyJ1IjoiYWlycW9tYXBzIiwiYSI6ImNrZmNhZHhhbzFkemUyenFzcWFmdW1wa3cifQ.R6XZOSugj-o9oYqmuf1COA";

const ChoroplethMap = ({ sitesData }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = MAP_BOX_TOKEN;

    const initializeMap = ({ setMap, mapContainer }) => {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [32.2903, 1.3733],
        zoom: 5,
      });

      mapInstance.on("load", () => {
        setMap(mapInstance);
      });
    };

    if (!map) {
      initializeMap({ setMap, mapContainer: mapContainerRef.current });
    } else {
      renderMarkers();
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  const renderMarkers = () => {
    map.addSource("water_quality", {
      type: "geojson",
      data: sitesData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "water_quality",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          100,
          "#f1f075",
          750,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "water_quality",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "water_quality",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource("water_quality")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    map.on("mousemove", "unclustered-point", (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div class="popup-body">
                    <div>
                      <span>
                        <b>${
                          e.features[0].properties.district +
                          ", " +
                          e.features[0].properties.village
                        }</b>
                      </span>
                    </div>
                    <div> 
                      <span>
                      ${e.features[0].properties.ph}
                      </span> </hr>  
                      <div>
                        <div>
                        <div>${e.features[0].properties.total_alkalinity}</div>
                        <div>µg/m<sup>3</sup></div>
                        </div> 
                        <div>${e.features[0].properties.water_quality}</div>
                      </div>
                    </div>
                  </div>`
        )
        .addTo(map);
    });

    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });

    map.addControl(
      new mapboxgl.FullscreenControl({
        container: mapContainerRef.current
      }),
      'bottom-right'
    );

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  };

  return (
    <Box width={"100%"} height={"400px"}>
      <div ref={mapContainerRef} style={{width:"100%", height:"100%"}} />
    </Box>
  );
};

export default ChoroplethMap;
