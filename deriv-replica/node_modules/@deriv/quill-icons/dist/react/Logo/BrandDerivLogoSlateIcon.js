import * as React from 'react';
import { forwardRef } from 'react';
const BrandDerivLogoSlateIcon = ({ title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 72 72', role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#414652', d: 'M0 28C0 12.536 12.536 0 28 0h16c15.464 0 28 12.536 28 28v16c0 15.464-12.536 28-28 28H28C12.536 72 0 59.464 0 44z' }),
    React.createElement("path", { fill: '#fff', d: 'm45.167 14.917-2.321 13.166h-8.06c-7.518 0-14.684 6.091-16.012 13.61l-.563 3.2c-1.322 7.518 3.695 13.61 11.213 13.61h6.722c5.48 0 10.7-4.436 11.664-9.916L54 13.497zM39.45 47.346c-.296 1.692-1.82 3.07-3.513 3.07h-4.084c-3.38 0-5.64-2.743-5.047-6.128l.352-1.996c.6-3.38 3.824-6.128 7.203-6.128h7.06z' })));
const ForwardRef = forwardRef(BrandDerivLogoSlateIcon);
export default ForwardRef;
