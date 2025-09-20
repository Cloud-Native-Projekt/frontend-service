"use client";
import React from 'react';
import Card from '@mui/material/Card';
import { Location } from '@/types';
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon, Point } from 'leaflet';
import { renderToString } from 'react-dom/server';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';

export interface MapCardProps {
  location: Location | null;
  radiusKm?: number;
}

const markerIcon = divIcon({
  html: renderToString(<LocationOnOutlined />),
  className: "marker-icon",
  iconSize: [40, 40],
  iconAnchor: new Point(20, 40),
  popupAnchor: new Point(0, -40),
});

const MapCard: React.FC<MapCardProps> = ({ location, radiusKm }) => {
  const center: [number, number] = location ? [location.lat, location.lng] : [51.10342, 10.26401];
  const radiusMeters = (radiusKm ?? 5) * 1000;

  return (
    <Card sx={{ height: '100%', padding: '0 !important' }}>
      <MapContainer
        center={center}
        zoom={location && radiusKm ? (15 - radiusKm * 0.7) : 6}
        style={{ height: '100%', width: '100%' }}
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
            pathOptions={{ color: '#1a73e8', weight: 2, opacity: 0.6, fillOpacity: 0.1 }}
          />
        )}
      </MapContainer>
    </Card>
  );
};

export default MapCard;
