import React, { useRef, useEffect } from "react";
import mapboxgl from 'mapbox-gl'

import "./Map.css";

function Map(props) {
  const mapRef = useRef();
  const { center, zoom } = props;
  console.log(center);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1Ijoicmlub3J6ZWthaiIsImEiOiJja2Z6dGY5dTgwNmY0MnBxdTVodHZmcjQxIn0.iLwlg8I0uKvTPN5FW7ENNQ"
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: zoom
    });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      id="map"
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
}

export default Map;
