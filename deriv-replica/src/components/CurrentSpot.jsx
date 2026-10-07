import React, { useEffect, useRef, useState } from 'react';
import { formatPrice } from '../lib/market.js';

// "Current spot / Last digit" strip that Deriv shows above the chart for
// digit-based contracts. The digit tile flashes on each new tick.
export default function CurrentSpot({ market, price }) {
  const lastDigit = market.lastDigit();
  const [flash, setFlash] = useState(false);
  const prev = useRef(lastDigit);

  useEffect(() => {
    if (prev.current !== lastDigit) {
      prev.current = lastDigit;
      setFlash(true);
      const id = setTimeout(() => setFlash(false), 180);
      return () => clearTimeout(id);
    }
  }, [lastDigit]);

  return (
    <div className="current-spot">
      <div>
        <span className="current-spot__label">Current spot</span>
        <span className="current-spot__value">{formatPrice(price, market.decimals)}</span>
      </div>
      <div className="current-spot__digit-wrap">
        <span className="current-spot__label">Last digit</span>
        <span className={`current-spot__digit${flash ? ' is-flash' : ''}`}>{lastDigit}</span>
      </div>
    </div>
  );
}
