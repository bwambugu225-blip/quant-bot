import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyIndicatorActiveIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm8.888 5.95 2.12-2.98c.206-.34.202-.726.01-1.03a.95.95 0 0 0-.898-.438L7.84 1.5a.99.99 0 0 0-.861.46l-4 6.23c-.185.343-.167.718.027 1.009a.95.95 0 0 0 .882.419l2.725.002-1.573 3.684c-.218.512.437.944.822.541l6.07-6.36.06-.076a.95.95 0 0 0-.887-1.457zm2.172 1-4.017 4.209.787-1.843a.5.5 0 0 0-.46-.696H3.89L7.82 2.5h2.296L7.512 6.16a.5.5 0 0 0 .408.79z' })));
const ForwardRef = forwardRef(LegacyIndicatorActiveIcon);
export default ForwardRef;
