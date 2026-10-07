import * as React from 'react';
import { Ref } from 'react';
import { QuillSvgProps } from '../../types';
interface SVGRProps {
    title?: string;
    titleId?: string;
}
export declare const MarketForexChfjpyIcon: ({ iconSize, title, titleId, ...props }: QuillSvgProps & SVGRProps, ref: Ref<SVGSVGElement>) => React.JSX.Element;
declare const ForwardRef: React.ForwardRefExoticComponent<Omit<QuillSvgProps & SVGRProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
export default ForwardRef;
