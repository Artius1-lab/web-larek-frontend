import { ApiResponse, getProductsDTO, IProductApi } from '../../types/api';
import { Product } from '../../types/models';
import { API_URL } from '../../utils/constants';
import { Api } from '../base/api';

/**
 * API по работе с продуктами
 */
export class ProductApi extends Api implements IProductApi {
	private readonly apiPath: string = '/product';

	constructor() {
		super(`${API_URL}`);
	}

	/**
	 * Запрос для получения всех доступных продуктов
	 * @returns Object:
	 * total - всего найденных товаров
	 * items - массив товаров (Product)
	 * в случае ошибки - error
	 */
	async getProducts(): ApiResponse<getProductsDTO> {
		const result = (await this.get(
			this.apiPath
		)) as ApiResponse<getProductsDTO>;

		return result;
	}

	/**
	 * Получение конкретного продукта
	 * @param id - id продукта
	 * @returns Product - в случае успеха, error - в случае ошибки
	 */
	async getProduct(id: string): ApiResponse<Product> {
		const result = (await this.get(
			this.apiPath + `/${id}`
		)) as ApiResponse<Product>;

		return result;
	}
}
