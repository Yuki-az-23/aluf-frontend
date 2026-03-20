import { createContext, useContext, useState, type ReactNode } from 'react';

interface PCBuilderContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const PCBuilderContext = createContext<PCBuilderContextValue>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export function PCBuilderProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PCBuilderContext.Provider value={{ open: () => setIsOpen(true), close: () => setIsOpen(false), isOpen }}>
      {children}
    </PCBuilderContext.Provider>
  );
}

export function usePCBuilder() {
  return useContext(PCBuilderContext);
}
