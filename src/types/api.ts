import { Product } from './models';

/**
 * Типы запросов для работы с API
 */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/**
 * Тип ошибки API
 * @param error - сообщение об ошибке
 */
export type ApiError = {
	error: string;
};

/**
 * Тип ответа API
 * @param T - тип данных, которые возвращает API
 */
export type ApiResponse<T> = Promise<T | ApiError>;

/**
 * Интерфейс базового API
 */
export interface IBaseApi {
	readonly baseUrl: string;

	get(uri: string): Promise<object>;

	post(uri: string, data: object, method?: ApiPostMethods): Promise<object>;
}

/**
 * DTO получаения продуктов
 */
export type getProductsDTO = {
	total: number;
	items: Product[];
};

/**
 * Интерфейс API для работы с продуктами
 */
export interface IProductApi {
	getProducts(): ApiResponse<getProductsDTO>;

	getProduct(id: string): ApiResponse<Product>;
}

/**
 * Типы параметров для создания заказа
 * @param payment - способ оплаты
 * @param email - email покупателя
 * @param phone - телефон покупателя
 * @param address - адрес доставки
 * @param total - общая сумма заказа
 * @param items - массив идентификаторов продуктов
 */
export type createOrderParams = {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
};

/**
 * DTO успешного создания заказа
 */
export type CreateOrderDTO = {
	total: number;
	id: string;
};

/**
 * Интерфейс API для работы с оформлением заказа
 */
export interface IOrderApi {
	createOrder(data: createOrderParams): ApiResponse<CreateOrderDTO>;
}
