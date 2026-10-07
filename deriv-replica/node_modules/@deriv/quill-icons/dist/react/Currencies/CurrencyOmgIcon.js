import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const CurrencyOmgIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#101010', d: 'M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16' }),
    React.createElement("path", { fill: '#fff', d: 'M10.59 16.002c0-.756.446-1.322 1.192-1.322.747 0 1.194.56 1.194 1.32s-.448 1.321-1.194 1.321-1.192-.563-1.192-1.319' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M10.343 10.343a8 8 0 1 1 11.314 11.315 8 8 0 0 1-11.314-11.315M9.871 16c0 1.125.74 2.001 1.91 2.001 1.172 0 1.913-.882 1.913-2.001s-.742-2.004-1.912-2.004S9.87 14.875 9.87 16m7.566 1.903h.668l.008-3.811h-.903l-1.056 2.913-1.057-2.913h-.903v3.811h.645v-2.685l.982 2.685h.637l.98-2.685zm4.013-1.383c-.064.559-.47.817-.985.817h-.003c-.74 0-1.154-.545-1.154-1.33 0-.734.364-1.339 1.139-1.339.505 0 .914.262.958.692h.724c-.098-.871-.757-1.356-1.66-1.356-1.276 0-1.869.98-1.869 2.026 0 1.122.686 1.971 1.753 1.971.626 0 .976-.289 1.117-.533v.435h.659v-2.042h-1.776v.659z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(CurrencyOmgIcon);
export default ForwardRef;
