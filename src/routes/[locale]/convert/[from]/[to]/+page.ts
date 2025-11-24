import type { PageLoad } from './$types';
import { getConversionInfo } from '$lib/conversion-data';
import { redirect, type LoadEvent } from '@sveltejs/kit';

// Включаем prerender для этих страниц, так как они будут сгенерированы статически
export const prerender = true;

export const load: PageLoad = async (event: LoadEvent) => {
	const { params, url } = event;
	const { from, to, locale } = params;

	// Проверяем, что локаль поддерживается
	const supportedLocales = ['en', 'es', 'fr', 'de', 'it', 'hr', 'tr', 'ja', 'ko', 'el', 'id', 'zh-Hans', 'zh-Hant', 'ru'];
	if (!supportedLocales.includes(locale)) {
		// Если локаль не поддерживается, перенаправляем на основной маршрут
		redirect(302, `/convert/${from}/${to}`);
	}

	const conversionInfo = getConversionInfo('.' + from, '.' + to);

	return {
		conversionInfo
	};
};