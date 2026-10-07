import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartOhlcBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5a.95.95 0 0 1 .938.938V9H18.5a.95.95 0 0 1 .938.938c0 .546-.43.937-.938.937h-1.562v12.188c0 .546-.43.937-.938.937-.547 0-.937-.39-.937-.937V21.5H13.5c-.547 0-.937-.39-.937-.937 0-.508.39-.938.937-.938h1.563V7.438c0-.508.39-.938.937-.938M24.125 9a.95.95 0 0 1 .938.938v7.187h1.562a.95.95 0 0 1 .938.938c0 .546-.43.937-.938.937h-1.562v1.563c0 .546-.43.937-.938.937-.547 0-.937-.39-.937-.937v-7.188h-1.563c-.547 0-.937-.39-.937-.937 0-.508.39-.938.937-.938h1.563V9.938c0-.508.39-.938.937-.938m-16.25 5a.95.95 0 0 1 .938.938v7.187h1.562a.95.95 0 0 1 .938.938c0 .546-.43.937-.938.937H8.813v1.563c0 .546-.43.937-.938.937-.547 0-.937-.39-.937-.937v-7.188H5.375c-.547 0-.937-.39-.937-.937 0-.508.39-.938.937-.938h1.563v-1.562c0-.508.39-.938.937-.938' })));
const ForwardRef = forwardRef(StandaloneChartOhlcBoldIcon);
export default ForwardRef;
