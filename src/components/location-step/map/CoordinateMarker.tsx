import React from 'react';
import { useMapEvents } from 'react-leaflet';
import type { LatLng } from 'leaflet';
import { isInGermany } from '@/actions/CoordinateValidation';

interface CoordinateMarkerProps {
  onSelect: (latlng: LatLng) => void;
  flyTo?: boolean;
  onInvalidAttempt?: (lat: number, lng: number) => void;
}

const CoordinateMarker: React.FC<CoordinateMarkerProps> = ({ onSelect, onInvalidAttempt }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (isInGermany(lat, lng)) {
        onSelect(e.latlng);
      } else {
        onInvalidAttempt?.(lat, lng);
      }
    }
  });
  return null;
};

export default CoordinateMarker;