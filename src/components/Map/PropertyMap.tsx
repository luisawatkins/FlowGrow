import React from 'react';
import {
  Box,
  AspectRatio,
  Skeleton,
} from '@chakra-ui/react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
  zoom?: number;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  address,
  zoom = 15,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const mapCenter = {
    lat: latitude,
    lng: longitude,
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    scrollwheel: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  if (loadError) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        bg="red.50"
        color="red.500"
      >
        Error loading map
      </Box>
    );
  }

  if (!isLoaded) {
    return <Skeleton height="400px" borderRadius="lg" />;
  }

  return (
    <AspectRatio ratio={16 / 9}>
      <Box borderRadius="lg" overflow="hidden">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={zoom}
          options={mapOptions}
        >
          <Marker
            position={mapCenter}
            title={address}
          />
        </GoogleMap>
      </Box>
    </AspectRatio>
  );
};
