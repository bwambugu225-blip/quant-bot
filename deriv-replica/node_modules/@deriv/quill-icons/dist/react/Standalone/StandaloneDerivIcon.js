import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneDerivIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm20.063 7.164 3.906-.664-2.735 15.625c-.43 2.422-2.734 4.375-5.195 4.375H13.07c-3.36 0-5.586-2.695-5-6.016l.274-1.445c.586-3.32 3.75-6.055 7.11-6.055h3.554zm-2.54 14.414.86-5h-3.125c-1.524 0-2.93 1.25-3.203 2.735l-.157.898c-.273 1.484.743 2.695 2.227 2.695h1.836c.742 0 1.406-.586 1.562-1.328' })));
const ForwardRef = forwardRef(StandaloneDerivIcon);
export default ForwardRef;
