import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneQuestionRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.375 9c-2.07 0-3.75 1.68-3.75 3.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625c0-2.734 2.227-5 5-5h1.25c2.734 0 5 2.266 5 5a4.39 4.39 0 0 1-1.758 3.516l-2.383 1.797c-.547.39-.859 1.054-.859 1.718v.469a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-.469c0-1.054.508-2.07 1.367-2.734l2.383-1.797a3.09 3.09 0 0 0 1.25-2.5c0-2.07-1.68-3.75-3.75-3.75zm-.312 15c0-.508.39-.937.937-.937a.95.95 0 0 1 .938.937c0 .547-.43.938-.938.938-.547 0-.937-.391-.937-.938' })));
const ForwardRef = forwardRef(StandaloneQuestionRegularIcon);
export default ForwardRef;
