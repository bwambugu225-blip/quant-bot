import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFourBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm15.883 9.156-4.922 9.219h8.164v-5.937c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938v5.937h1.563a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H21v4.063c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937V20.25H9.438c-.352 0-.665-.156-.82-.43a1 1 0 0 1-.04-.937l5.625-10.625c.274-.43.82-.625 1.29-.39.429.234.624.82.39 1.288' })));
const ForwardRef = forwardRef(StandaloneFourBoldIcon);
export default ForwardRef;
