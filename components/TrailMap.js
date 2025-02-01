"use client"

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function TrailMap() {
  const [lines, setLines] = useState([]);
  const [imageDimensions, setImageDimensions] = useState([0, 0]); // Store image dimensions

  useEffect(() => {
    fetch("/detected_lines.json")
      .then((response) => response.json())
      .then((data) => setLines(data))
      .catch((error) => console.error("Error loading lines:", error));

      // Get Image Dimensions (Method 1: If you have the image readily available)
      const img = new Image();
      img.onload = () => {
        setImageDimensions([img.width, img.height]); 
      };
      img.src = "/brown_map.jpeg"; // Path to your image

    //Method 2: If you can read image data (e.g. from backend)
    // fetch("/image_dimensions") // Example endpoint
    // .then(r=>r.json())
    // .then(d=>setImageDimensions(d))


  }, []);

  function SetBounds() {
    const map = useMap();
    useEffect(()=>{
      if(imageDimensions[0] > 0 && imageDimensions[1] > 0){
        const bounds = [[0, 0], [imageDimensions[1], imageDimensions[0]]]; // Important: [height, width]
        map.fitBounds(bounds);
      }
    }, [map, imageDimensions])
    return null;
  }

  return (
    <MapContainer
      center={[imageDimensions[1]/2, imageDimensions[0]/2]} // Center of the image
      zoom={0} // Start at zoom 0
      style={{ height: "80vh", width: "100%" }}
      crs={L.CRS.Simple} // Important: Use L.CRS.Simple
    >
      <SetBounds/>
      {/* <TileLayer url="" />  Remove or comment out TileLayer for CRS.Simple */}
      {lines.map((coords, index) => (
        <Polyline key={index} positions={coords} color="red" weight={2} />
      ))}
    </MapContainer>
  );
}