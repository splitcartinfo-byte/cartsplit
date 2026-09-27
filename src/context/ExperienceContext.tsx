import React, { createContext, useContext, useState } from 'react';
import { GenderCategory } from '../types';
import { getTheme, menTheme, womenTheme, childrenTheme } from '../theme';

interface ExperienceContextType {
  gender: GenderCategory;
  theme: typeof menTheme | typeof womenTheme | typeof childrenTheme;
  setGender: (gender: GenderCategory) => void;
  toggleGender: () => void;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gender, setGenderState] = useState<GenderCategory>(() => {
    const saved = localStorage.getItem('fg_gender_pref');
    return (saved as GenderCategory) || 'mens';
  });

  const setGender = (g: GenderCategory) => {
    setGenderState(g);
    localStorage.setItem('fg_gender_pref', g);
  };

  const toggleGender = () => {
    setGender(gender === 'mens' ? 'womens' : gender === 'womens' ? 'children' : 'mens');
  };

  const theme = getTheme(gender);

  return (
    <ExperienceContext.Provider value={{ gender, theme, setGender, toggleGender }}>
      {children}
    </ExperienceContext.Provider>
  );
};

export const useExperience = () => {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error('useExperience must be used within ExperienceProvider');
  return context;
};
