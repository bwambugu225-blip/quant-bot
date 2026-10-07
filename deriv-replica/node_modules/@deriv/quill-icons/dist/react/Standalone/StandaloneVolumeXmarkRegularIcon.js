import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneVolumeXmarkRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.648 13.844a.56.56 0 0 1-.39.156h-3.32a.925.925 0 0 0-.938.938v3.124c0 .547.39.938.938.938h3.32c.117 0 .273.078.39.156L16 23.922V9.117zm5.43-6.094c.625 0 1.172.547 1.172 1.172v15.195c0 .625-.547 1.133-1.172 1.133-.312 0-.586-.078-.781-.273l.43-.47-.43.47-5.313-4.727H6.938a2.184 2.184 0 0 1-2.188-2.187v-3.125c0-1.172.977-2.188 2.188-2.188h3.046l5.313-4.687a1.1 1.1 0 0 1 .781-.313m4.727 5.195 2.695 2.696 2.656-2.696a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899L24.359 16.5l2.696 2.695a.66.66 0 0 1 0 .899.66.66 0 0 1-.899 0L23.5 17.398l-2.695 2.696a.66.66 0 0 1-.899 0 .66.66 0 0 1 0-.899l2.696-2.695-2.696-2.656a.66.66 0 0 1 0-.899.66.66 0 0 1 .899 0' })));
const ForwardRef = forwardRef(StandaloneVolumeXmarkRegularIcon);
export default ForwardRef;
