import {
	ApiResponse,
	CreateOrderDTO,
	createOrderParams,
	IOrderApi,
} from '../../types/api';
import { API_URL } from '../../utils/constants';
import { Api } from '../base/api';

/**
 * API по работе с заказами
 */
export class OrderApi extends Api implements IOrderApi {
	private readonly apiPath: string = '/order';

	constructor() {
		super(`${API_URL}`);
	}

	/**
	 * Создаёт заказ
	 * @param data - необходимые параметры для создания заказа @see /src/types/api.ts
	 * @returns Object:
	 * total - тотал заказа
	 * id - id заказа
	 * В случае неудачи - error
	 */
	async createOrder(data: createOrderParams): ApiResponse<CreateOrderDTO> {
		const result = (await this.post(
			this.apiPath,
			data
		)) as ApiResponse<CreateOrderDTO>;

		return result;
	}
}
