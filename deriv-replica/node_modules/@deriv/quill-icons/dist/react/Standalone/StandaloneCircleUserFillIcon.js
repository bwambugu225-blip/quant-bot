import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleUserFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.586 21.54c-.898-1.524-2.5-2.54-4.336-2.54h-2.5a4.95 4.95 0 0 0-4.336 2.54C11.781 23.062 13.774 24 16 24c2.188 0 4.18-.937 5.586-2.46M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m10 .625c.977 0 1.914-.508 2.422-1.406.508-.86.508-1.914 0-2.813-.508-.86-1.445-1.406-2.422-1.406a2.87 2.87 0 0 0-2.46 1.406c-.509.899-.509 1.953 0 2.813.507.898 1.444 1.406 2.46 1.406' })));
const ForwardRef = forwardRef(StandaloneCircleUserFillIcon);
export default ForwardRef;
