
import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  isNextDayDisabled: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentDate,
  onPrevDay,
  onNextDay,
  isNextDayDisabled,
  darkMode,
  toggleDarkMode,
}) => {
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-md p-4 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold font-serif text-slate-900 dark:text-white">
          Devocional Diário
        </h1>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onPrevDay}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Dia anterior"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <span className="text-center text-sm md:text-base font-semibold w-32 md:w-auto">{formattedDate}</span>
          <button
            onClick={onNextDay}
            disabled={isNextDayDisabled}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Próximo dia"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
          
          <button
            onClick={toggleDarkMode}
            className="ml-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Alternar modo escuro"
          >
            {darkMode ? <SunIcon className="h-6 w-6 text-yellow-400" /> : <MoonIcon className="h-6 w-6 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
