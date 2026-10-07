import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowRightArrowLeftRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm24.555 11.969-3.75 3.75a.66.66 0 0 1-.899 0 .66.66 0 0 1 0-.899l2.696-2.695H7.875a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h14.727l-2.696-2.656a.66.66 0 0 1 0-.899.66.66 0 0 1 .899 0l3.75 3.75a.66.66 0 0 1 0 .899m-13.399 13.75-3.75-3.75a.66.66 0 0 1 0-.899l3.75-3.75a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899l-2.696 2.656h14.766c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H9.359l2.696 2.695a.66.66 0 0 1 0 .899.66.66 0 0 1-.899 0' })));
const ForwardRef = forwardRef(StandaloneArrowRightArrowLeftRegularIcon);
export default ForwardRef;
