"use client";
import React from 'react';
import 'leaflet/dist/leaflet.css';
import Card from '@mui/material/Card';
import { MapContainer, Marker, TileLayer, Polygon } from 'react-leaflet';
import CoordinateMarker from './CoordinateMarker';
import CardContent from '@mui/material/CardContent';
import { GERMANY_POLYGON } from '../../../actions/CoordinateValidation';
import { divIcon, Point } from 'leaflet';
import { renderToString } from 'react-dom/server';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';

interface MapProps {
  onChange: (coords: { lat: number; lng: number }) => void;
  fillParent?: boolean;
  initialCenter?: [number, number];
  zoom?: number;
  onInvalidAttempt?: (lat: number, lng: number) => void;
  showGermanyOutline?: boolean;
}

const markerIcon = divIcon({
  html: renderToString(<LocationOnOutlined />),
  className: "marker-icon",
  iconSize: [40, 40],
  iconAnchor: new Point(20, 40),
  popupAnchor: new Point(0, -40),
});

const Map: React.FC<MapProps> = ({
  onChange,
  initialCenter = [51.10342, 10.26401],
  zoom = 7,
  onInvalidAttempt,
  showGermanyOutline = false,
}) => {
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);

  const mapRef = React.useRef<L.Map | null>(null);

  return (
    <Card
      sx={{
        position: 'relative',
        flex: 1,
        height: 'auto',
        minHeight: '500px',
        display: 'flex',
        '& .leaflet-container': {
          position: 'absolute',
          inset: 0,
          cursor: 'crosshair'
        }
      }}
    >
      <CardContent>

        <MapContainer
          ref={(instance: L.Map | null) => { if (instance) { mapRef.current = instance; } }}
          center={initialCenter}
          zoom={zoom}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {showGermanyOutline && (
            <Polygon
              positions={GERMANY_POLYGON.map((p: [number, number]) => [p[0], p[1]]) as [number, number][]}
              pathOptions={{ color: '#1a73e8', weight: 2, opacity: 0.4, dashArray: '4 4', fillOpacity: 0 }}
            />
          )}
          {location && <Marker position={[location.lat, location.lng]} icon={markerIcon} />}
          <CoordinateMarker
            onSelect={(latlng) => {
              const coords = { lat: latlng.lat, lng: latlng.lng };
              setLocation(coords);
              onChange(coords);
            }}
            onInvalidAttempt={(lat, lng) => {
              onInvalidAttempt?.(lat, lng);
            }}
          />
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default Map;
