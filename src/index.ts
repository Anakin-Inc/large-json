import fs, {FileHandle} from "fs/promises";

export interface IConfig {
	charactersLimitBeforeWrite: number;
	overwrite: boolean;
}

export const defaultConfig: IConfig = {
	charactersLimitBeforeWrite: 0,
	overwrite: false,
};

export class largeJson {
	path: string;
	config: IConfig = defaultConfig;
	private jsonStack = new Array<"[" | "{" | ",">();
	private currentJson: string = "";
	private fileHandler: FileHandle | null = null;

	public constructor(path: string, config?: Partial<IConfig>) {
		this.path = path;
		if (config?.charactersLimitBeforeWrite) {
			this.config.charactersLimitBeforeWrite =
				config.charactersLimitBeforeWrite;
		}
		if (config?.overwrite) {
			this.config.overwrite = config.overwrite;
		}
	}

	private async write(): Promise<void> {
		if (this.fileHandler === null) {
			await this.cleanup(true);
			throw new Error("No file handler");
		}

		await this.fileHandler.write(this.currentJson);
		this.currentJson = "";
	}

	public async beginObject(): Promise<void> {
		if (this.fileHandler === null) {
			const fileExists = await fs
				.access(this.path)
				.then(() => true)
				.catch(() => false);

			if (fileExists) {
				if (this.config.overwrite) {
					await fs.unlink(this.path);
				} else {
					await this.cleanup(true);
					throw new Error("File already exists");
				}
			}

			this.fileHandler = await fs.open(this.path, "a");
		}

		if (this.jsonStack[this.jsonStack.length - 1] === ",") {
			this.currentJson += ","; // add comma if we are in an array
			this.jsonStack.pop(); // remove comma from the stack
		}

		this.jsonStack.push("{");
		this.currentJson += "{";

		if (this.currentJson.length > this.config.charactersLimitBeforeWrite) {
			await this.write();
		}
	}

	public async endObject(): Promise<void> {
		if (this.jsonStack.length === 0) {
			await this.cleanup(true);
			throw new Error("No object to end");
		}
		if (
			this.jsonStack[this.jsonStack.length - 1] !== "{" &&
			(this.jsonStack[this.jsonStack.length - 2] !== "{" ||
				this.jsonStack[this.jsonStack.length - 1] !== ",")
		) {
			await this.cleanup(true);
			throw new Error("No object to end");
		}

		// If comma, then pop 2 times
		if (this.jsonStack[this.jsonStack.length - 1] === ",") {
			this.jsonStack.pop();
		}

		this.jsonStack.pop();

		if (this.jsonStack[this.jsonStack.length - 1] === "[") {
			this.jsonStack.push(","); // This comma will tell us that we are in an array and we have already written 1 object.
		}

		this.currentJson += "}";

		if (this.currentJson.length > this.config.charactersLimitBeforeWrite) {
			await this.write();
		}
	}

	public async beginArray(): Promise<void> {
		if (this.fileHandler === null) {
			const fileExists = await fs
				.access(this.path)
				.then(() => true)
				.catch(() => false);

			if (fileExists) {
				if (this.config.overwrite) {
					await fs.unlink(this.path);
				} else {
					await this.cleanup(true);
					throw new Error("File already exists");
				}
			}

			this.fileHandler = await fs.open(this.path, "a");
		}

		if (this.jsonStack[this.jsonStack.length - 1] === ",") {
			this.currentJson += ","; // add comma if we are in an array
			this.jsonStack.pop(); // remove comma from the stack
		}

		this.jsonStack.push("[");
		this.currentJson += "[";

		if (this.currentJson.length > this.config.charactersLimitBeforeWrite) {
			await this.write();
		}
	}

	public async endArray(): Promise<void> {
		if (this.jsonStack.length === 0) {
			await this.cleanup(true);
			throw new Error("No array to end");
		}
		if (
			this.jsonStack[this.jsonStack.length - 1] !== "[" &&
			(this.jsonStack[this.jsonStack.length - 2] !== "[" ||
				this.jsonStack[this.jsonStack.length - 1] !== ",")
		) {
			await this.cleanup(true);
			throw new Error("No array to end");
		}

		// If comma, then pop 2 times
		if (this.jsonStack[this.jsonStack.length - 1] === ",") {
			this.jsonStack.pop();
		}

		this.jsonStack.pop();

		if (this.jsonStack[this.jsonStack.length - 1] === "[") {
			this.jsonStack.push(","); // This comma will tell us that we are in an array and we have already written 1 array.
		}

		this.currentJson += "]";

		if (this.currentJson.length > this.config.charactersLimitBeforeWrite) {
			await this.write();
		}
	}

	private async writeJsonStringWithKey(
		key: string,
		jsonString: string,
		validateJson: boolean = false
	): Promise<void> {
		if (this.fileHandler === null) {
			await this.cleanup(true);
			throw new Error("start with beginning either array or object");
		}
		if (this.jsonStack.length === 0) {
			await this.cleanup(true);
			throw new Error(
				"json string can only be written inside an array or provide key if appending inside an object"
			);
		}
		if (
			!(
				this.jsonStack[this.jsonStack.length - 1] === "{" ||
				(this.jsonStack[this.jsonStack.length - 1] === "," &&
					this.jsonStack[this.jsonStack.length - 2] === "{")
			)
		) {
			await this.cleanup(true);
			throw new Error(
				"json string can only be written inside an array or provide key if appending inside an object"
			);
		}
		if (validateJson) {
			try {
				JSON.parse(jsonString);
			} catch (e) {
				await this.cleanup(true);
				throw new Error("Invalid json");
			}
		}

		if (this.jsonStack[this.jsonStack.length - 1] === ",") {
			this.currentJson += `,"${key}":${jsonString}`;
		} else {
			this.currentJson += `"${key}":${jsonString}`;
			this.jsonStack.push(",");
		}

		if (this.currentJson.length > this.config.charactersLimitBeforeWrite) {
			await this.write();
		}
	}

	private async writeJsonStringWithoutKey(
		jsonString: string,
		validateJson: boolean = false
	): Promise<void> {
		if (this.fileHandler === null) {
			await this.cleanup(true);
			throw new Error("start with beginning either array or object");
		}

		if (this.jsonStack.length === 0) {
			await this.cleanup(true);
			throw new Error("start with beginning either array or object");
		}

		if (
			this.jsonStack[this.jsonStack.length - 1] !== "[" &&
			(this.jsonStack[this.jsonStack.length - 1] !== "," ||
				this.jsonStack[this.jsonStack.length - 2] !== "[")
		) {
			await this.cleanup(true);
			throw new Error(
				"json string can only be written inside an array or provide key if appending inside an object"
			);
		}

		if (validateJson) {
			try {
				JSON.parse(jsonString);
			} catch (e) {
				await this.cleanup(true);
				throw new Error("Invalid json");
			}
		}

		if (this.jsonStack[this.jsonStack.length - 1] === ",") {
			this.currentJson += `,${jsonString}`;
		} else {
			this.currentJson += `${jsonString}`;
			this.jsonStack.push(",");
		}

		if (this.currentJson.length > this.config.charactersLimitBeforeWrite) {
			await this.write();
		}
	}

	public async writeJsonString(
		key: string,
		jsonString: string,
		validateJson?: boolean
	): Promise<void>;
	public async writeJsonString(
		jsonString: string,
		validateJson?: boolean
	): Promise<void>;
	public async writeJsonString(
		jsonStringOrKey: string,
		jsonStringOrValidateJson: string | boolean | undefined,
		validateJson?: boolean
	): Promise<void> {
		if (typeof jsonStringOrValidateJson === "string") {
			return await this.writeJsonStringWithKey(
				jsonStringOrKey,
				jsonStringOrValidateJson
			);
		}

		await this.writeJsonStringWithoutKey(
			jsonStringOrKey,
			jsonStringOrValidateJson
		);
	}

	public async writeJson(json: any): Promise<void>;
	public async writeJson(key: string, json: any): Promise<void>;
	public async writeJson(keyOrJson: string | any, json?: any): Promise<void> {
		if (json === undefined) {
			json = keyOrJson;
			keyOrJson = undefined;
		}
		if (keyOrJson !== undefined) {
			await this.writeJsonString(keyOrJson, JSON.stringify(json));
		} else {
			await this.writeJsonString(JSON.stringify(json));
		}
	}

	private async cleanup(isError: boolean = false): Promise<void> {
		if (this.fileHandler !== null) {
			await this.fileHandler.close();
			this.fileHandler = null;
		}
		if(isError) {
			await fs.unlink(this.path);
		}
	}

	public async end(): Promise<void> {
		if (this.fileHandler === null) {
			throw new Error("start with beginning either array or object");
		}
		if (this.jsonStack.length !== 0) {
			throw new Error("end with terminating either array or object");
		}
		await this.write();
		await this.cleanup();
	}
}

export default largeJson;
