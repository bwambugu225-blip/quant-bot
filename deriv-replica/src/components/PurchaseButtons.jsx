import React from 'react';
import {
  TradeTypesUpsAndDownsRiseIcon,
  TradeTypesUpsAndDownsFallIcon,
  TradeTypesDigitsOverIcon,
  TradeTypesDigitsUnderIcon,
  TradeTypesDigitsMatchesIcon,
  TradeTypesDigitsDiffersIcon,
} from '@deriv/quill-icons';

const LABELS = {
  rise_fall: { buy: 'Rise', sell: 'Fall' },
  digit_over: { single: 'Over' },
  digit_under: { single: 'Under' },
  digit_match: { single: 'Matches' },
  digit_diff: { single: 'Differs' },
};

export default function PurchaseButtons({ contractType, payout, stake, onTrade }) {
  const label = LABELS[contractType];

  if (label.single) {
    return (
      <div className="purchase-row">
        <button className="purchase-btn buy" onClick={() => onTrade('buy')} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: '14px 20px' }}>
          <span className="pb-top">{label.single}</span>
          <span className="pb-bottom">${payout.toFixed(2)}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="purchase-row">
      <button className="purchase-btn buy" onClick={() => onTrade('buy')}>
        <span className="pb-top">{label.buy}</span>
        <span className="pb-bottom">${payout.toFixed(2)}</span>
      </button>
      <button className="purchase-btn sell" onClick={() => onTrade('sell')}>
        <span className="pb-top">{label.sell}</span>
        <span className="pb-bottom">${payout.toFixed(2)}</span>
      </button>
    </div>
  );
}
