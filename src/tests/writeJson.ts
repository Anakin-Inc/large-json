import LargeJson from "../index";
import path from "path";

const main = async () => {
	const largeJson = new LargeJson(path.join(__dirname, "test.json"), {
		charactersLimitBeforeWrite: 100,
		overwrite: true,
	});

	await largeJson.beginArray();

	await largeJson.beginArray();
	await largeJson.beginArray();
	await largeJson.beginArray();
	await largeJson.beginObject();
	await largeJson.writeJson("name", "John");
	await largeJson.endObject();
	await largeJson.beginObject();
	await largeJson.endObject();

	await largeJson.endArray();

	await largeJson.beginObject();
	await largeJson.endObject();

	await largeJson.endArray();
	await largeJson.endArray();


	await largeJson.beginArray();
	await largeJson.beginObject();
	await largeJson.writeJson("name", "John");
	await largeJson.endObject();
	await largeJson.beginObject();
	await largeJson.endObject();

	await largeJson.endArray();

	await largeJson.endArray();
	await largeJson.end();
};
main();
