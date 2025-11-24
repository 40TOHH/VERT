import type { RequestEvent } from './$types';

// Файл для указания корректного HTTP статуса для динамических локализованных маршрутов
// Это поможет при сканировании сайта, чтобы маршруты не воспринимались как ошибки
export const GET = async (event: RequestEvent) => {
	return new Response('', {
		status: 200,
		headers: {
			'Content-Type': 'text/html'
		}
	});
};