import { VertFile } from "$lib/types";
import { Converter, FormatInfo } from "./converter.svelte";
import { browser } from "$app/environment";
import { error, log } from "$lib/logger";
import { ToastManager } from "$lib/toast/index.svelte";
import { m } from "$lib/paraglide/messages";
import { Pandoc as PandocWasm } from "pandoc-wasm";

type Format =
	| ".md"
	| ".docx"
	| ".csv"
	| ".tsv"
	| ".json"
	| ".doc"
	| ".rtf"
	| ".rst"
	| ".epub"
	| ".odt"
	| ".docbook"
	| ".html"
	| ".markdown";

export class PandocConverter extends Converter {
	public name = "pandoc";
	public ready = $state(false);

	private pandocInstance: PandocWasm | null = null;
	private initPromise: Promise<void> | null = null;

	constructor() {
		super();
		if (!browser) return;
		// Initialize pandoc when needed
		this.status = "ready";
		this.ready = true;
	}

	private async ensureInitialized(): Promise<PandocWasm> {
		if (this.pandocInstance) {
			return this.pandocInstance;
		}

		if (this.initPromise) {
			await this.initPromise;
			return this.pandocInstance!;
		}

		this.initPromise = (async () => {
			try {
				this.status = "downloading";
				this.pandocInstance = new PandocWasm();
				await this.pandocInstance.init();
				this.status = "ready";
			} catch (err) {
				this.status = "error";
				error(
					["converters", this.name],
					`Failed to initialize Pandoc: ${err}`,
				);
				ToastManager.add({
					type: "error",
					message: m["workers.errors.pandoc"](),
				});
				throw err;
			}
		})();

		await this.initPromise;
		return this.pandocInstance!;
	}

	public async convert(file: VertFile, to: string): Promise<VertFile> {
		const pandoc = await this.ensureInitialized();

		try {
			const inputText = await file.file.text();
			const result = await pandoc.run({
				text: inputText,
				options: {
					from: this.formatToReader(file.from),
					to: this.formatToReader(to)
				},
			});

			if (!to.startsWith(".")) to = `.${to}`;

			return new VertFile(
				new File([result], `${file.name.split('.')[0] || 'converted'}${to}`),
				to
			);
		} catch (err) {
			error(
				["converters", this.name],
				`Failed to convert document: ${err}`,
			);
			throw err;
		}
	}

	public async cancel(input: VertFile): Promise<void> {
		// No active worker in this implementation, cancellation not needed
		// pandoc-wasm runs synchronously in the main thread
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

	// Helper function to convert format to pandoc reader format
	private formatToReader(format: string): string {
		switch (format) {
			case ".md":
			case ".markdown":
				return "markdown";
			case ".doc":
			case ".docx":
				return "docx";
			case ".csv":
				return "csv";
			case ".tsv":
				return "tsv";
			case ".docbook":
				return "docbook";
			case ".epub":
				return "epub";
			case ".html":
				return "html";
			case ".json":
				return "json";
			case ".odt":
				return "odt";
			case ".rtf":
				return "rtf";
			case ".rst":
				return "rst";
			default:
				return format.substring(1); // Remove the dot and return as is
		}
	}
}
