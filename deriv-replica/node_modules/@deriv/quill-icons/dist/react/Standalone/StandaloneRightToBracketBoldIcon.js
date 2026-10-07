import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneRightToBracketBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm13.5 20.797 4.297-4.297-4.297-4.258v2.07c0 .547-.43.938-.937.938H7.875v2.5h4.688a.95.95 0 0 1 .937.938zm6.25-4.297c0 .469-.195.898-.508 1.21l-4.531 4.532c-.352.352-.82.508-1.29.508a1.77 1.77 0 0 1-1.796-1.797v-1.328h-3.75A1.85 1.85 0 0 1 6 17.75v-2.5c0-1.016.82-1.875 1.875-1.875h3.75v-1.29c0-1.015.781-1.835 1.797-1.835.469 0 .937.195 1.289.547l4.531 4.531c.313.313.508.742.508 1.172m-.312 6.875h3.125c.859 0 1.562-.664 1.562-1.562V11.188c0-.86-.703-1.563-1.562-1.563h-3.125c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h3.125C24.438 7.75 26 9.313 26 11.188v10.625a3.443 3.443 0 0 1-3.437 3.437h-3.125c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938' })));
const ForwardRef = forwardRef(StandaloneRightToBracketBoldIcon);
export default ForwardRef;
