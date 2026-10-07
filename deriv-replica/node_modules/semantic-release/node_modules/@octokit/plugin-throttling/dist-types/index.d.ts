import type { Octokit, OctokitOptions } from "@octokit/core";
import type { ThrottlingOptions } from "./types.js";
import { VERSION } from "./version.js";
declare const triggersNotification: (string: string) => boolean;
export declare function throttling(octokit: Octokit, octokitOptions: OctokitOptions): {};
export declare namespace throttling {
    export { VERSION };
    export { triggersNotification };
}
declare module "@octokit/core" {
    interface OctokitOptions {
        throttle?: ThrottlingOptions;
    }
}
declare module "@octokit/types" {
    interface OctokitResponse<T, S extends number = number> {
        retryCount: number;
    }
}
export type { ThrottlingOptions };
