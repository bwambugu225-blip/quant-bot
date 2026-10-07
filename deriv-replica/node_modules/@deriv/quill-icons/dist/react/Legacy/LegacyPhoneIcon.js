import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyPhoneIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.53 1a1.41 1.41 0 0 1 1.4 1.18 9 9 0 0 0 .49 2 1.4 1.4 0 0 1-.32 1.48l-.89.9a11.2 11.2 0 0 0 4.2 4.21l.9-.89a1.39 1.39 0 0 1 1.48-.32 9 9 0 0 0 2 .5A1.4 1.4 0 0 1 15 11.48v2.11A1.41 1.41 0 0 1 13.6 15h-.13a13.9 13.9 0 0 1-6.08-2.16 13.7 13.7 0 0 1-4.22-4.22A13.86 13.86 0 0 1 1 2.53 1.4 1.4 0 0 1 2.28 1zm0 1H2.41a.41.41 0 0 0-.41.44 12.9 12.9 0 0 0 2 5.64 12.7 12.7 0 0 0 3.93 3.93 13 13 0 0 0 5.64 2 .41.41 0 0 0 .43-.41v-2.11a.41.41 0 0 0-.35-.43 10.5 10.5 0 0 1-2.19-.55h-.14a.43.43 0 0 0-.29.12l-.89.89a1 1 0 0 1-1.2.16 12.2 12.2 0 0 1-4.6-4.59 1 1 0 0 1 .16-1.2L5.4 5a.42.42 0 0 0 .08-.47 10.2 10.2 0 0 1-.55-2.19.4.4 0 0 0-.4-.34' })));
const ForwardRef = forwardRef(LegacyPhoneIcon);
export default ForwardRef;
