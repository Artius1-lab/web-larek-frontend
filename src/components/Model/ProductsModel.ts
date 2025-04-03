import { IProductApi } from '../../types/api';
import { IProductsModel, Product } from '../../types/models';
import { isApiError } from '../../utils/api';
import { EventsNames, ProductFetchedEvent } from '../../types/events';
import { IEvents } from '../base/events';
import { BaseModel } from '../base/model';

export class ProductsModel extends BaseModel implements IProductsModel {
	/**
	 * API для работы с продуктами
	 */
	private api: IProductApi;

	/**
	 * State для хранения всех продуктов
	 */
	private products: Product[];

	constructor(productApi: IProductApi, events: IEvents) {
		super(events);

		this.api = productApi;
	}

	/**
	 * Получаем продукты с сервера
	 */
	async fetchProducts() {
		try {
			const data = await this.api.getProducts();

			if (isApiError(data)) throw new Error(data.error);

			this.products = data.items;

			this.events.emit<ProductFetchedEvent>(EventsNames.PRODUCTS_FETCHED, {
				products: this.products,
			});
		} catch (error) {
			console.error('Ошибка при получении продуктов');
			console.log(error);
		}
	}
}
