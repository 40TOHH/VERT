import { VertFile, type WorkerMessage } from "$lib/types";
import { Converter, FormatInfo } from "./converter.svelte";
import { browser } from "$app/environment";
import PandocWorker from "$lib/workers/pandoc?worker&url";
import { error, log } from "$lib/logger";
import { ToastManager } from "$lib/toast/index.svelte";
import { m } from "$lib/paraglide/messages";

export class PandocConverter extends Converter {
	public name = "pandoc";
	public ready = $state(false);

	private activeConversions = new Map<string, Worker>();
	private wasmCache: ArrayBuffer | null = null;

	constructor() {
		super();
		if (!browser) return;
		// Initialize without preloading WASM to reduce initial load
		this.status = "ready";
		this.ready = true;
	}

	public async convert(file: VertFile, to: string): Promise<VertFile> {
		// Load WASM if not cached
		if (!this.wasmCache) {
			this.status = "downloading";
			try {
				// Load from GitCDN which serves files with proper CORS headers
				const response = await fetch("https://gitcdn.xyz/repo/VERT-sh/VERT/main/static/pandoc.wasm");
				if (!response.ok) {
					throw new Error(`Failed to download pandoc.wasm: ${response.status} ${response.statusText}`);
				}
				this.wasmCache = await response.arrayBuffer();
			} catch (err) {
				this.status = "error";
				error(
					["converters", this.name],
					`Failed to load Pandoc WASM: ${err}`,
				);
				ToastManager.add({
					type: "error",
					message: m["workers.errors.pandoc"](),
				});
				throw err;
			}
			this.status = "ready";
		}

		const worker = new Worker(PandocWorker, {
			type: "module",
		});

		this.activeConversions.set(file.id, worker);

		const loadMsg: WorkerMessage = {
			type: "load",
			wasm: this.wasmCache,
			id: file.id,
		};
		worker.postMessage(loadMsg);

		// Wait for worker to load the WASM
		await new Promise((resolve, reject) => {
			const timeout = setTimeout(() => reject(new Error("Pandoc worker load timeout")), 30000);

			const onLoadMessage = (e: MessageEvent) => {
				if (e.data.type === "loaded" && e.data.id === "0") {
					clearTimeout(timeout);
					worker.removeEventListener("message", onLoadMessage);
					resolve(e.data);
				}
			};

			worker.addEventListener("message", onLoadMessage);
		});

		const convertMsg: WorkerMessage = {
			type: "convert",
			to,
			input: {
				file: file.file,
				name: file.name,
				from: file.from,
				to,
			},
			compression: null,
			id: file.id,
		};
		worker.postMessage(convertMsg);

		// Wait for conversion result
		const result = await new Promise((resolve, reject) => {
			const timeout = setTimeout(() => reject(new Error("Pandoc conversion timeout")), 60000);

			const onResultMessage = (e: MessageEvent) => {
				if (e.data.id === file.id) {
					clearTimeout(timeout);
					worker.removeEventListener("message", onResultMessage);
					if (e.data.type === "error") {
						// Handle different error types as needed
						reject(new Error(e.data.error));
					} else {
						resolve(e.data);
					}
				}
			};

			worker.addEventListener("message", onResultMessage);
		});

		if (!to.startsWith(".")) to = `.${to}`;
		this.activeConversions.delete(file.id);
		worker.terminate();

		return new VertFile(
			new File([result.output], file.name),
			result.isZip ? ".zip" : to,
		);
	}

	public async cancel(input: VertFile): Promise<void> {
		const worker = this.activeConversions.get(input.id);
		if (!worker) {
			error(
				["converters", this.name],
				`no active conversion found for file ${input.name}`,
			);
			return;
		}

		log(
			["converters", this.name],
			`cancelling conversion for file ${input.name}`,
		);

		worker.terminate();
		this.activeConversions.delete(input.id);
	}

	public supportedFormats = [
		new FormatInfo("docx", true, true),
		new FormatInfo("doc", true, true),
		new FormatInfo("md", true, true),
		new FormatInfo("html", true, true),
		new FormatInfo("rtf", true, true),
		new FormatInfo("csv", true, true),
		new FormatInfo("tsv", true, true),
		new FormatInfo("json", true, true), // must be a pandoc-converted json
		new FormatInfo("rst", true, true),
		new FormatInfo("epub", true, true),
		new FormatInfo("odt", true, true),
		new FormatInfo("docbook", true, true),
	];
}
