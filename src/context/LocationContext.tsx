import React, { createContext, useContext, useState } from 'react';
import { UserLocation } from '../types';

export interface LocationSuggestion {
  address: string;
  city: string;
  lat: number;
  lng: number;
}

export const PRESET_LOCATIONS: LocationSuggestion[] = [
  {
    address: 'Patia Square, KIIT Road',
    city: 'Bhubaneswar',
    lat: 20.354,
    lng: 85.815,
  },
  {
    address: 'Janpath Road, Saheed Nagar',
    city: 'Bhubaneswar',
    lat: 20.288,
    lng: 85.842,
  },
  {
    address: 'Connaught Place, Block C',
    city: 'Delhi',
    lat: 28.6315,
    lng: 77.2167,
  },
  {
    address: 'Bandra West, Linking Road',
    city: 'Mumbai',
    lat: 19.06,
    lng: 72.834,
  },
  {
    address: '100 Feet Road, Indiranagar',
    city: 'Bangalore',
    lat: 12.978,
    lng: 77.64,
  },
];

interface LocationContextType {
  location: UserLocation;
  radiusKm: number;
  isSearching: boolean;
  searchLocation: (query: string) => LocationSuggestion[];
  updateLocation: (loc: Partial<UserLocation>) => void;
  setRadiusKm: (radius: number) => void;
  requestGPSLocation: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation>({
    address: 'Patia Square, KIIT Road',
    city: 'Bhubaneswar',
    lat: 20.354,
    lng: 85.815,
    isCustom: false,
    radiusKm: 5,
  });

  const [radiusKm, setRadiusState] = useState<number>(5);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const setRadiusKm = (r: number) => {
    setRadiusState(r);
    setLocation((prev) => ({ ...prev, radiusKm: r }));
  };

  const updateLocation = (loc: Partial<UserLocation>) => {
    setLocation((prev) => ({ ...prev, ...loc, isCustom: true }));
  };

  const searchLocation = (query: string): LocationSuggestion[] => {
    if (!query.trim()) return PRESET_LOCATIONS;
    const q = query.toLowerCase();
    return PRESET_LOCATIONS.filter(
      (item) =>
        item.address.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q)
    );
  };

  const requestGPSLocation = (): Promise<boolean> => {
    setIsSearching(true);
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setIsSearching(false);
        resolve(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            address: 'GPS Current Location',
            city: 'Bhubaneswar',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            isCustom: true,
            radiusKm,
          });
          setIsSearching(false);
          resolve(true);
        },
        () => {
          setIsSearching(false);
          resolve(false);
        },
        { timeout: 8000 }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        radiusKm,
        isSearching,
        searchLocation,
        updateLocation,
        setRadiusKm,
        requestGPSLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
};
