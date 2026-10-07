import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLinkedinIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M23.5 7.75c.664 0 1.25.586 1.25 1.29V24c0 .703-.586 1.25-1.25 1.25H8.46c-.663 0-1.21-.547-1.21-1.25V9.04c0-.704.547-1.29 1.21-1.29zm-10.977 15v-8.32H9.945v8.32zm-1.289-9.492c.82 0 1.485-.664 1.485-1.485 0-.82-.664-1.523-1.485-1.523-.859 0-1.523.703-1.523 1.523s.664 1.485 1.523 1.485M22.25 22.75v-4.57c0-2.227-.508-3.985-3.125-3.985-1.25 0-2.11.703-2.46 1.367h-.04V14.43h-2.46v8.32h2.577v-4.102c0-1.093.195-2.148 1.563-2.148 1.328 0 1.328 1.25 1.328 2.188v4.062z' })));
const ForwardRef = forwardRef(StandaloneLinkedinIcon);
export default ForwardRef;
