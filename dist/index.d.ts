export interface IConfig {
    charactersLimitBeforeWrite: number;
    overwrite: boolean;
}
export declare const defaultConfig: IConfig;
export declare class largeJson {
    path: string;
    config: IConfig;
    private jsonStack;
    private currentJson;
    private fileHandler;
    constructor(path: string, config?: Partial<IConfig>);
    private write;
    beginObject(): Promise<void>;
    endObject(): Promise<void>;
    beginArray(): Promise<void>;
    endArray(): Promise<void>;
    private writeJsonStringWithKey;
    private writeJsonStringWithoutKey;
    writeJsonString(key: string, jsonString: string, validateJson?: boolean): Promise<void>;
    writeJsonString(jsonString: string, validateJson?: boolean): Promise<void>;
    writeJson(json: any): Promise<void>;
    writeJson(key: string, json: any): Promise<void>;
    private cleanup;
    end(): Promise<void>;
}
export default largeJson;
