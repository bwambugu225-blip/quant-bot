import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowDownToBracketBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm21.664 14.977-5 5c-.39.39-.977.39-1.328 0l-5-5a.856.856 0 0 1 0-1.29.856.856 0 0 1 1.289 0l3.398 3.399V7.438a.95.95 0 0 1 .938-.938c.547 0 .937.43.937.938v9.648l3.399-3.398c.39-.391.976-.391 1.328 0 .39.351.39.937 0 1.289zm-12.539 4.96v3.125c0 .899.664 1.563 1.563 1.563h10.625c.859 0 1.562-.664 1.562-1.562v-3.125c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938v3.125a3.443 3.443 0 0 1-3.437 3.437H10.688a3.42 3.42 0 0 1-3.438-3.437v-3.125c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938' })));
const ForwardRef = forwardRef(StandaloneArrowDownToBracketBoldIcon);
export default ForwardRef;
