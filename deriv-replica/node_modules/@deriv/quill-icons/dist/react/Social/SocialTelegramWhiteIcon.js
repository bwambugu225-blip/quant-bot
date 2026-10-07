import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const SocialTelegramWhiteIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16m-15.426-4.189q-2.335.971-9.331 4.02-1.136.451-1.19.884c-.062.486.548.678 1.378.94l.35.11c.817.266 1.916.577 2.488.59q.777.016 1.735-.642 6.536-4.412 6.749-4.46c.1-.023.237-.052.33.032s.085.24.075.283c-.06.257-2.454 2.482-3.692 3.634-.386.359-.66.613-.716.672q-.19.194-.377.372c-.758.731-1.328 1.28.032 2.176.653.43 1.176.787 1.698 1.142.57.388 1.137.774 1.873 1.256q.28.186.54.375c.663.473 1.259.897 1.994.83.428-.04.87-.442 1.094-1.641.53-2.834 1.572-8.973 1.813-11.503a2.8 2.8 0 0 0-.027-.63.67.67 0 0 0-.228-.433c-.192-.156-.488-.189-.62-.186-.602.01-1.525.331-5.969 2.18', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(SocialTelegramWhiteIcon);
export default ForwardRef;
