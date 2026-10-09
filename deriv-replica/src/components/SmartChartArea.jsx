import React from 'react';
import { SmartChart, setSmartChartsPublicPath } from '@deriv-com/smartcharts-champion';
import '@deriv-com/smartcharts-champion/dist/smartcharts.css';
import ChartArea from './ChartArea.jsx';

// Deriv's own charting library (the same one app.deriv.com uses). The host
// answers its data requests over the public market socket; SmartCharts owns
// the rendering, tools, indicators and look, so the chart is the real thing
// rather than an imitation.
setSmartChartsPublicPath('/smartcharts/');

const toTQuote = msg => {
  if (msg.tick) {
    const { epoch, quote } = msg.tick;
    return { Date: new Date(epoch * 1000).toISOString(), Close: quote, tick: msg.tick, DT: new Date(epoch * 1000) };
  }
  if (msg.ohlc) {
    const { open_time, open, high, low, close } = msg.ohlc;
    return {
      Date: new Date(open_time * 1000).toISOString(),
      Open: +open, High: +high, Low: +low, Close: +close,
      ohlc: msg.ohlc, DT: new Date(open_time * 1000),
    };
  }
  return null;
};

export default function SmartChartArea({ client, sym, granularity = 0, prices, up }) {
  const [failed, setFailed] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [chartData, setChartData] = React.useState(null);
  const [timedOut, setTimedOut] = React.useState(false);
  const subs = React.useRef({});

  // SmartCharts reads active_symbols/trading_times only when it initialises, so
  // mount it after that data lands (with a timeout so a slow socket still gets
  // a chart). Data is fetched once the market socket is up.
  React.useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 6000);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (!client) return;
    let cancelled = false;
    const load = async () => {
      try {
        const [symRes, ttRes] = await Promise.all([
          client.requestOnce({ active_symbols: 'brief' }),
          client.requestOnce({ trading_times: new Date().toISOString().slice(0, 10) }),
        ]);
        if (cancelled) return;
        const simplified = {};
        ttRes?.trading_times?.markets?.forEach(market => {
          market.submarkets?.forEach(sub => {
            sub.symbols?.forEach(s => {
              const { open = [], close = [] } = s.times || {};
              const dateStr = new Date().toISOString().substring(0, 11);
              const allDay = open.length === 1 && open[0] === '00:00:00' && close[0] === '23:59:59';
              let isOpen = allDay, openTime = '', closeTime = '';
              if (!(open.length === 1 && open[0] === '--')) {
                openTime = `${dateStr}${open[0]}Z`;
                closeTime = `${dateStr}${close[0]}Z`;
                isOpen = new Date() >= new Date(openTime) && new Date() < new Date(closeTime);
              }
              simplified[s.symbol] = { isOpen, openTime, closeTime };
            });
          });
        });
        setChartData({ activeSymbols: symRes?.active_symbols || [], tradingTimes: simplified });
      } catch (e) {
        // Quotes still render without the widget data.
      }
    };
    load();
    return () => { cancelled = true; };
  }, [client]);

  const getQuotes = React.useCallback(
    ({ symbol, granularity: g, count, start, end }) =>
      new Promise((resolve, reject) => {
        if (!client) return reject(new Error('no client'));
        const fields = {
          ticks_history: symbol || sym,
          style: g ? 'candles' : 'ticks',
          count: count || 1000,
          end: end ? String(end) : 'latest',
          adjust_start_time: 1,
        };
        if (g) fields.granularity = g;
        if (start) fields.start = String(start);
        const id = client.requestHistory(fields, msg => {
          if (msg.error) return reject(new Error(msg.error.message));
          if (msg.candles) {
            resolve({ candles: msg.candles.map(c => ({ open: +c.open, high: +c.high, low: +c.low, close: +c.close, epoch: +c.epoch })) });
          } else if (msg.history) {
            resolve({ history: { prices: msg.history.prices.map(Number), times: msg.history.times.map(Number) } });
          } else {
            resolve({});
          }
        });
        if (id == null) reject(new Error('no socket'));
      }),
    [client, sym],
  );

  const subscribeQuotes = React.useCallback(
    ({ symbol, granularity: g, style }, callback) => {
      if (!client) return () => {};
      const key = `${symbol}-${g || 0}`;
      const fields = {
        ticks_history: symbol,
        style: style || g ? 'candles' : 'ticks',
        count: 1,
        end: 'latest',
        adjust_start_time: 1,
      };
      if (g) fields.granularity = g;
      const id = client.requestHistory(fields, msg => {
        if (msg.subscription?.id) subs.current[key] = msg.subscription.id;
        const q = toTQuote(msg);
        if (q) callback(q);
      }, true);
      return () => {
        const subId = subs.current[key];
        if (subId) { client.forgetHistory(subId); delete subs.current[key]; }
        if (id != null && client._histCbs) delete client._histCbs[id];
      };
    },
    [client],
  );

  const unsubscribeQuotes = React.useCallback(({ symbol, granularity: g } = {}) => {
    const key = `${symbol}-${g || 0}`;
    const subId = subs.current[key];
    if (subId && client) { client.forgetHistory(subId); delete subs.current[key]; }
  }, [client]);

  if (failed || !client) {
    return <ChartArea prices={prices} up={up} sym={sym} />;
  }

  if (!chartData && !timedOut) {
    return (
      <div className="chart-area chart-area--smart">
        <div className="chart-area__loading" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="chart-area chart-area--smart">
      <SmartChart
        id="dtrader-chart"
        symbol={sym}
        granularity={granularity}
        chartType="mountain"
        isMobile={false}
        enableRouting={false}
        feedCall={{ activeSymbols: false, tradingTimes: false }}
        chartData={chartData || undefined}
        settings={{ theme: 'dark', countdown: false }}
        getQuotes={getQuotes}
        subscribeQuotes={subscribeQuotes}
        unsubscribeQuotes={unsubscribeQuotes}
        isConnectionOpened={client.connected}
        stateChangeListener={state => { if (state === 'READY') setReady(true); }}
        onMessage={() => {}}
      />
      {!ready && <div className="chart-area__loading" aria-hidden="true" />}
    </div>
  );
}
