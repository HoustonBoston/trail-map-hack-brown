import React, { useEffect, useState } from 'react';
import { MapContainer, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import dEdges from './detected_edges.json'; // Adjust the import path as needed

const TrailMap = () => {
  const [edges, setEdges] = useState([]);
  const [imageDimensions, setImageDimensions] = useState([0, 0]);

  useEffect(() => {
    setEdges(dEdges);

    const img = new Image();
    img.onload = () => {
      setImageDimensions([img.width, img.height]); 
    };
    img.src = "/wboro_trail.jpg"; 

    console.log("detected edges", dEdges);
  }, []);

  function SetBounds() {
    const map = useMap();
    useEffect(() => {
      if (imageDimensions[0] > 0 && imageDimensions[1] > 0) {
        const bounds = [[0, 0], [imageDimensions[1], imageDimensions[0]]]; // Important: [height, width]
        map.fitBounds(bounds);
      }
    }, [map, imageDimensions]);
    return null;
  }

  return (
    <MapContainer
      center={[imageDimensions[1] / 2, imageDimensions[0] / 2]} 
      zoom={2} // Increase zoom level
      style={{ height: "80vh", width: "100%" }}
      crs={L.CRS.Simple}
    >
      <SetBounds />
      {/* Render edges */}
      {lines.map((coords, index) => {
        if (!coords || coords.length === 0 || coords.some(c => !Array.isArray(c) || c.length !== 2)) {
          console.warn(`Invalid edge data at index ${index}:`, coords);
          return null; // Skip invalid edge data
        }

        return <Polyline key={index} positions={coords} color="blue" weight={1} />;
      })}
    </MapContainer>
  );
};

export default TrailMap;