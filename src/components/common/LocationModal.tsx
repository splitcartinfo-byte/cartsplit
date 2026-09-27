import React, { useState } from 'react';
import { useLocation, PRESET_LOCATIONS } from '../../context/LocationContext';
import { useExperience } from '../../context/ExperienceContext';
import { MapPin, Navigation, Search, X, Check, Compass } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { location, radiusKm, updateLocation, setRadiusKm, requestGPSLocation, searchLocation, isSearching } = useLocation();
  const { theme } = useExperience();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const suggestions = searchLocation(searchQuery);

  const handleSelectPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    updateLocation({
      address: preset.address,
      city: preset.city,
      lat: preset.lat,
      lng: preset.lng,
    });
    onClose();
  };

  const handleUseGPS = async () => {
    const success = await requestGPSLocation();
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-extrabold text-slate-900">Select Discovery Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* GPS Current Location Button */}
          <button
            onClick={handleUseGPS}
            disabled={isSearching}
            className="w-full py-3 px-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-extrabold flex items-center justify-center gap-2 transition-all text-xs"
          >
            <Navigation className={`w-4 h-4 ${isSearching ? 'animate-spin' : 'animate-pulse'}`} />
            <span>{isSearching ? 'Fetching GPS Location...' : '📍 Use My Current Location'}</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search city, area, pincode or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white"
            />
          </div>

          {/* Radius Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Discovery Radius</span>
              <span className="text-blue-600 font-black">{radiusKm} KM</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 25].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadiusKm(r)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    radiusKm === r
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {r} KM
                </button>
              ))}
            </div>
          </div>

          {/* Location Suggestions List */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Popular Fashion Hubs
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {suggestions.map((item, idx) => {
                const isSelected = location.address === item.address;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(item)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs font-bold">{item.address}</p>
                        <p className="text-[10px] text-slate-500">{item.city}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
