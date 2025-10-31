
import React, { useState, useEffect, useCallback } from 'react';
import { Devotional } from './types';
import { getDevotionalForDate } from './services/geminiService';
import Header from './components/Header';
import DevotionalCard from './components/DevotionalCard';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      return isDarkMode || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [devotionals, setDevotionals] = useState<Record<string, Devotional>>({});
  const [currentDevotional, setCurrentDevotional] = useState<Devotional | null>(null);
  const [themeColor, setThemeColor] = useState<string>('bg-gray-100 dark:bg-gray-900');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const formatDateToKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const loadDevotionalsFromStorage = useCallback(() => {
    try {
      const storedDevotionals = localStorage.getItem('devotionals');
      if (storedDevotionals) {
        setDevotionals(JSON.parse(storedDevotionals));
      }
    } catch (e) {
      console.error("Failed to parse devotionals from localStorage", e);
      setDevotionals({});
    }
  }, []);

  useEffect(() => {
    loadDevotionalsFromStorage();
  }, [loadDevotionalsFromStorage]);

  const fetchDevotional = useCallback(async (date: Date) => {
    setIsLoading(true);
    setError(null);
    const dateKey = formatDateToKey(date);

    if (devotionals[dateKey]) {
      setCurrentDevotional(devotionals[dateKey]);
      setThemeColor(devotionals[dateKey].tailwindColor);
      setIsLoading(false);
      return;
    }

    try {
      const newDevotional = await getDevotionalForDate(date);
      const updatedDevotionals = { ...devotionals, [dateKey]: newDevotional };
      setDevotionals(updatedDevotionals);
      setCurrentDevotional(newDevotional);
      setThemeColor(newDevotional.tailwindColor);
      localStorage.setItem('devotionals', JSON.stringify(updatedDevotionals));
    } catch (err) {
      setError('Não foi possível carregar o devocional. Por favor, tente novamente mais tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devotionals]);

  useEffect(() => {
    fetchDevotional(currentDate);
  }, [currentDate, fetchDevotional]);

  const handlePrevDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };
  
  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  }

  return (
    <div className={`min-h-screen ${themeColor} font-sans text-slate-800 dark:text-slate-200 transition-colors duration-500`}>
      <Header
        currentDate={currentDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        isNextDayDisabled={isToday()}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-white/50 dark:bg-slate-800/50 rounded-lg shadow-md">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : currentDevotional ? (
            <DevotionalCard devotional={currentDevotional} />
          ) : null}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
        <p>Criado com inspiração e tecnologia.</p>
      </footer>
    </div>
  );
};

export default App;
