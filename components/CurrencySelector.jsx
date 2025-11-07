"use client";
import { useState } from 'react';

export default function CurrencySelector({ onCurrencyChange }) {
  const [currency, setCurrency] = useState('PYG');
  
  const rates = { 
    USD: 7092,
    BRL: 1321
  };

  const currencies = [
    { code: 'PYG', symbol: '₲', name: 'Guaraníes', flag: '🇵🇾' },
    { code: 'USD', symbol: '$', name: 'Dólares', flag: '🇺🇸' },
    { code: 'BRL', symbol: 'R$', name: 'Reales', flag: '🇧🇷' }
  ];

  const handleChange = (code) => {
    setCurrency(code);
    onCurrencyChange?.(code, rates);
  };

  return (
    <div style={{
      overflowX: 'auto',
      overflowY: 'hidden',
      WebkitOverflowScrolling: 'touch',
      background: 'rgba(10, 15, 25, 0.95)',
      borderBottom: '1px solid rgba(100, 200, 255, 0.15)',
      backdropFilter: 'blur(10px)'
    }}>
      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
      
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '10px 12px'
      }}>
        {currencies.map(curr => (
          <button
            key={curr.code}
            onClick={() => handleChange(curr.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 20,
              border: currency === curr.code 
                ? '2px solid #64c8ff' 
                : '1px solid rgba(100, 200, 255, 0.2)',
              background: currency === curr.code
                ? 'linear-gradient(135deg, #64c8ff 0%, #3b82f6 100%)'
                : 'rgba(30, 40, 60, 0.4)',
              color: currency === curr.code ? '#000' : '#cbd5e1',
              fontWeight: currency === curr.code ? 700 : 500,
              fontSize: 13,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: currency === curr.code 
                ? '0 4px 12px rgba(100, 200, 255, 0.3)'
                : 'none'
            }}
          >
            <span style={{ fontSize: 16 }}>{curr.flag}</span>
            <span>{curr.symbol} {curr.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
