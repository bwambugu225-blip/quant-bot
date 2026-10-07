import React from 'react';
import { Button } from '@deriv-com/quill-ui';
import { addComma } from '../lib/market.js';

// Deriv's buy/sell pair: two full-width pills, buy in teal and sell in red,
// each showing the payout on the trailing edge.
export default function PurchaseButton({ labels, payout, currency = 'USD', onTrade }) {
  const value = `${addComma(payout, 2)} ${currency}`;

  if (labels.length === 1) {
    return (
      <Button
        color="purchase"
        size="lg"
        fullWidth
        className="purchase-button purchase-button--single"
        onClick={() => onTrade('buy', 0)}
      >
        <span className="purchase-button__inner">
          <span>{labels[0]}</span>
          <span>{value}</span>
        </span>
      </Button>
    );
  }

  return (
    <div className="purchase-button__pair">
      <Button
        color="purchase"
        size="lg"
        fullWidth
        className="purchase-button"
        onClick={() => onTrade('buy', 0)}
      >
        <span className="purchase-button__inner">
          <span>{labels[0]}</span>
          <span>{value}</span>
        </span>
      </Button>
      <Button
        color="sell"
        size="lg"
        fullWidth
        className="purchase-button"
        onClick={() => onTrade('sell', 1)}
      >
        <span className="purchase-button__inner">
          <span>{labels[1] ?? labels[0]}</span>
          <span>{value}</span>
        </span>
      </Button>
    </div>
  );
}
