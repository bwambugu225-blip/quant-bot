import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const IllustrativeCommoditiesIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm28.627 23.107-2.386-6.467a2 2 0 0 0-1.88-1.307h-1.907L20.24 9.307A2 2 0 0 0 18.36 8h-4.734c-.84 0-1.587.52-1.88 1.307L9.52 15.333H7.614c-.84 0-1.587.52-1.88 1.307l-2.387 6.467c-.08.2-.053.426.08.613.12.173.333.28.547.28H28a.68.68 0 0 0 .546-.28.67.67 0 0 0 .08-.613M13.014 9.773a.66.66 0 0 1 .627-.44h4.733c.28 0 .533.174.627.44l2.053 5.56H10.96zM16 21.413l-1.746-4.746h3.493zM4.96 22.667l2.054-5.56a.66.66 0 0 1 .626-.44h4.734c.28 0 .533.173.627.44l2.053 5.56zm12 0 2.054-5.56a.66.66 0 0 1 .627-.44h4.733c.28 0 .533.173.627.44l2.053 5.56z' })));
const ForwardRef = forwardRef(IllustrativeCommoditiesIcon);
export default ForwardRef;
