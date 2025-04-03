import { ApiError } from '../types/api';

/**
 * Функция-предикат для проверки ответа с сервера на ошибку
 * @param response - ответ с сервера
 * @returns bool
 */
export function isApiError(response: any): response is ApiError {
	return 'error' in response;
}
