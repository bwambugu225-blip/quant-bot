import { VirtualItem } from './index.js';
export declare function getMeasurementKey(item: VirtualItem | VirtualItem['key']): VirtualItem['key'];
export declare function createLazyMeasurementsView(cache: Array<VirtualItem | VirtualItem['key']>, flat: Float64Array): Array<VirtualItem>;
