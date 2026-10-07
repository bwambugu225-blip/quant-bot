import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const MarketDerivedSkewStepIndex5DownIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#0AA0B0', fillRule: 'evenodd', d: 'M21.463 32H26v-3h-2.463l-10-27H0v3h11.463z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#FF444F', d: 'M26 29h3v-3h-3z' }),
    React.createElement("path", { fill: '#414652', d: 'M0 24a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z' }),
    React.createElement("path", { fill: '#fff', d: 'M8.778 25.464H6.242l-.12 1.768h.064q.08-.2.176-.36.104-.168.24-.28.135-.12.328-.184.192-.064.456-.064.36 0 .672.12t.544.352a1.6 1.6 0 0 1 .368.56q.136.328.136.744 0 .424-.144.792-.137.36-.416.624a1.9 1.9 0 0 1-.672.416q-.4.144-.912.144a2.7 2.7 0 0 1-.72-.088 2.3 2.3 0 0 1-.552-.232 2 2 0 0 1-.416-.344 2.5 2.5 0 0 1-.304-.408l.872-.688q.183.328.44.56.256.224.688.224t.648-.248q.224-.248.224-.656v-.064q0-.384-.224-.608-.225-.224-.616-.224-.329 0-.544.136-.21.127-.32.256l-.984-.136.208-3.16h3.416z' })));
const ForwardRef = forwardRef(MarketDerivedSkewStepIndex5DownIcon);
export default ForwardRef;
