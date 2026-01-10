import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate relative to USD
}

export const SUPPORTED_CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.0 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.5 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currencyCode: string) => void;
  formatAmount: (amount: number, currencyCode?: string) => string;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(SUPPORTED_CURRENCIES.USD);

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('systemCurrency');
    if (savedCurrency && SUPPORTED_CURRENCIES[savedCurrency]) {
      setCurrencyState(SUPPORTED_CURRENCIES[savedCurrency]);
    }
  }, []);

  const setCurrency = (currencyCode: string) => {
    if (SUPPORTED_CURRENCIES[currencyCode]) {
      const newCurrency = SUPPORTED_CURRENCIES[currencyCode];
      setCurrencyState(newCurrency);
      localStorage.setItem('systemCurrency', currencyCode);
      console.log('💰 Currency updated to:', currencyCode);
    }
  };

  const formatAmount = (amount: number, currencyCode?: string): string => {
    const targetCurrency = currencyCode ? SUPPORTED_CURRENCIES[currencyCode] : currency;
    if (!targetCurrency) return `$${amount.toFixed(2)}`;

    // Convert amount if different currency
    let convertedAmount = amount;
    if (currencyCode && currencyCode !== 'USD') {
      convertedAmount = amount * targetCurrency.rate;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: targetCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(convertedAmount);
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = SUPPORTED_CURRENCIES[fromCurrency]?.rate || 1;
    const toRate = SUPPORTED_CURRENCIES[toCurrency]?.rate || 1;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    formatAmount,
    convertAmount,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};