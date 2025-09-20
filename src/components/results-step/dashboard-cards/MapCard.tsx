"use client";
import React from "react";
import Card from "@mui/material/Card";
import { Location } from "@/types";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { divIcon, Point } from "leaflet";
import { renderToString } from "react-dom/server";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";

// Dynamically import leaflet components (disable SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

export interface MapCardProps {
  location: Location | null;
  radiusKm?: number;
}

// Custom marker icon using MUI icon
const markerIcon = divIcon({
  html: renderToString(<LocationOnOutlined fontSize="large" />),
  className: "marker-icon",
  iconSize: [40, 40],
  iconAnchor: new Point(20, 40),
  popupAnchor: new Point(0, -40),
});

const MapCard: React.FC<MapCardProps> = ({ location, radiusKm }) => {
  const center: [number, number] = location
    ? [location.lat, location.lng]
    : [51.10342, 10.26401]; // fallback: middle of Germany

  const radiusMeters = (radiusKm ?? 5) * 1000;

  return (
    <Card sx={{ height: "100%", padding: "0 !important" }}>
      <MapContainer
        center={center}
        zoom={location && radiusKm ? 15 - radiusKm * 0.7 : 6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {location && <Marker position={[location.lat, location.lng]} icon={markerIcon} />}
        {location && (
          <Circle
            center={center}
            radius={radiusMeters}
            pathOptions={{
              color: "#1a73e8",
              weight: 2,
              opacity: 0.6,
              fillOpacity: 0.1,
            }}
          />
        )}
      </MapContainer>
    </Card>
  );
};

export default MapCard;
