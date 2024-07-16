import preset from "../src/index";
import babelCore from "@babel/core";
import envPlugin from "babel-plugin-transform-import-meta-env";
import { resolve } from "path";

describe("babel-preset-transform-import-meta", () => {
    it("should return a preset object", () => {
        const opts = { env: true };
        const result = preset(babelCore, opts);
        expect(result).toEqual({ plugins: [babelCore.createConfigItem(envPlugin)] });
    });
    it("should not return a preset object", () => {
        const opts = { env: false };
        const result = preset(babelCore, opts);
        expect(result).toEqual({ plugins: [] });
    });
    it("should return a preset object with empty option", () => {
        const opts = {};
        const result = preset(babelCore, opts);
        expect(result).toEqual({ plugins: [babelCore.createConfigItem(envPlugin)] });
    });
    it("should return a preset object with mockData options", () => {
        const opts = { env: { mockData: { VITE_APP_NAME: "bar" } } };
        const result = preset(babelCore, opts);
        expect(result).toEqual({ plugins: [babelCore.createConfigItem([envPlugin, opts.env])] });
    });
    it("should return a preset object with envFile options", () => {
        const opts = { env: { envFile: resolve(process.cwd(), './fixtures/.env') } };
        const result = preset(babelCore, opts);
        expect(result).toEqual({ plugins: [babelCore.createConfigItem([envPlugin, opts.env])] });
    });
});