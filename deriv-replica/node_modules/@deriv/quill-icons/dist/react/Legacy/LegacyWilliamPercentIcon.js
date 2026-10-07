import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyWilliamPercentIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF444F', d: 'M3 5h4a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2' }),
    React.createElement("path", { fill: '#85ACB0', d: 'M10.037 2.732c.268-.966 1.633-.98 1.92-.02l2.35 7.833 1.766-2.94a1 1 0 0 1 1.745.056l4.07 7.88a1 1 0 0 1-1.777.918l-3.247-6.287-2.007 3.343c-.447.744-1.565.604-1.815-.228l-2.005-6.684-4.073 14.665c-.278.999-1.705.967-1.938-.043l-3-13a1 1 0 1 1 1.948-.45l2.116 9.166zM21 19a1 1 0 1 1 0 2H10a1 1 0 1 1 0-2z' })));
const ForwardRef = forwardRef(LegacyWilliamPercentIcon);
export default ForwardRef;
