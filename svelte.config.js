import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Языки, поддерживаемые приложением
const locales = ["en", "es", "fr", "de", "it", "hr", "tr", "ja", "ko", "el", "id", "zh-Hans", "zh-Hant", "ru"];

// Наиболее популярные форматы для каждого типа
const popularImageFormats = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff", "ico"];
const popularAudioFormats = ["mp3", "wav", "flac", "ogg", "aac", "m4a"];
const popularVideoFormats = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];
const popularDocumentFormats = ["pdf", "doc", "docx", "txt", "html", "rtf", "odt"];

// Объединяем все популярные форматы
const popularFormats = [
  ...popularImageFormats,
  ...popularAudioFormats,
  ...popularVideoFormats,
  ...popularDocumentFormats
];

// Функция для вычисления маршрутов
function calculateEntries() {
	const routes = [];

	// Include base convert page
	routes.push('/convert');
	for (const locale of locales) {
		routes.push(`/${locale}/convert`);
	}

	// Add sitemap routes
	routes.push('/sitemap-convert.xml');

	// Generate routes for popular formats combinations
	for (const from of popularFormats) {
		for (const to of popularFormats) {
			if (from !== to) {
				for (const locale of locales) {
					routes.push(`/${locale}/convert/${from}/${to}`);
				}
			}
		}
	}

	return routes;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// Настройки для SSR
		}),
		paths: {
			relative: false,
		},
		prerender: {
			// Включить популярные маршруты в сборку для улучшения производительности
			entries: calculateEntries(),
			handleUnseenRoutes: (details) => {
				if (details.path === '/sitemap.xml') {
					// Don't treat sitemap.xml as an error during prerendering
					return false;
				}
				// For any other unseen routes, continue normally (could fail or handle as needed)
				return false;
			}
		},
		env: {
			publicPrefix: "PUB_",
			privatePrefix: "PRI_",
		},
	},
};

export default config;
