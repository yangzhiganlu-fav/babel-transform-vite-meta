/* eslint-disable @typescript-eslint/no-explicit-any */
interface ImportMeta {
    glob: (pattern: string | string[], opts?: ImportMetaGlobOptions) => {
        [key: string]: opts['eager'] extends true ? any : () => Promise<any>;
    };
    globEager: (pattern: string | string[]) => {
        [key: string]: any;
    };
}

declare const importMeta: ImportMeta;