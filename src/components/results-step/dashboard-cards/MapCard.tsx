"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Location } from '@/types';
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon, Point } from 'leaflet';
import { renderToString } from 'react-dom/server';
import MyLocationIcon from '@mui/icons-material/MyLocation';

export interface MapCardProps {
  location: Location | null;
  radiusKm?: number;
}

const markerIcon = divIcon({
  html: renderToString(<MyLocationIcon />),
  className: 'marker-icon',
  iconSize: [36, 36],
  iconAnchor: new Point(18, 36),
  popupAnchor: new Point(0, -36),
});

const MapCard: React.FC<MapCardProps> = ({ location, radiusKm }) => {
  const center: [number, number] = location ? [location.lat, location.lng] : [51.10342, 10.26401];
  const radiusMeters = (radiusKm ?? 5) * 1000;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Selected location" />
      <CardContent sx={{ position: 'relative', flex: 1, p: 0 }}>
        <MapContainer center={center} zoom={location ? 11 : 6} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {location && <Marker position={center} icon={markerIcon} />}
          {location && <Circle center={center} radius={radiusMeters} pathOptions={{ color: '#1a73e8', weight: 2, opacity: 0.6, fillOpacity: 0.1 }} />}
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default MapCard;
