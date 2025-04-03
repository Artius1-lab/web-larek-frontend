import { IOrderApi } from '../../types/api';
import { CartItem, ICheckout } from '../../types/models';
import { isApiError } from '../../utils/api';
import {
	CheckoutContactFormSumitEvent,
	CheckoutOrderFormSumitEvent,
	CheckoutStartedEvent,
	CheckoutSuccessEvent,
	EventsNames,
} from '../../types/events';
import { IEvents } from '../base/events';
import { BaseModel } from '../base/model';

export class ChekoutModel extends BaseModel implements ICheckout {
	/**
	 * API для работы c заказами
	 */
	private api: IOrderApi;

	/**
	 * Товары, которые оформляются при заказае
	 */
	private cartItems: CartItem[];

	/**
	 * Адрес доставки
	 */
	private address: string;

	/**
	 * Выбранный метод оплаты
	 */
	private paymentType: string;

	/**
	 * Почта при доставке
	 */
	private email: string;

	/**
	 * Номер телефона
	 */
	private phone: string;

	constructor(checkoutApi: IOrderApi, events: IEvents) {
		super(events);

		this.api = checkoutApi;

		this.addEventListeners();
	}

	/**
	 * Создаём заказ из сохранённых данных
	 */
	async createOrder() {
		try {
			const total = this.cartItems.reduce((t, c) => t + c.price, 0);
			const cartItemIds = this.cartItems.map((el) => el.id);

			const createOrderData = {
				payment: this.paymentType,
				email: this.email,
				phone: this.phone,
				address: this.address,
				total: total,
				items: cartItemIds,
			};

			const resonse = await this.api.createOrder(createOrderData);

			if (isApiError(resonse)) throw new Error(resonse.error);

			this.events.emit<CheckoutSuccessEvent>(EventsNames.CHECKOUT_SUCCESS, {
				total: resonse.total,
			});

			this.cleanUp();
		} catch (error) {
			console.error('Ошибка при получении продуктов');
			console.log(error);
		}
	}

	/**
	 * Регистриурем обработчики событий
	 */
	private addEventListeners() {
		this.events.on<CheckoutStartedEvent>(
			EventsNames.CHECKOUT_STARTED,
			this.startCheckout.bind(this)
		);

		this.events.on<CheckoutOrderFormSumitEvent>(
			EventsNames.CHECKOUT_ORDER_SUBMIT,
			this.saveOrderForm.bind(this)
		);

		this.events.on<CheckoutContactFormSumitEvent>(
			EventsNames.CHECKOUT_CONTACTS_SUBMIT,
			this.saveContactForm.bind(this)
		);
	}

	/**
	 * При начале чекаута - сохраняем товары из корзины
	 */
	private startCheckout({ cartItems }: CheckoutStartedEvent) {
		this.cartItems = cartItems;
	}

	/**
	 * Проверяем и сохраняем данные из OrderForm
	 */
	private saveOrderForm({ formData }: CheckoutOrderFormSumitEvent) {
		if (!formData.adress || !formData.paymentType) {
			console.error('Некоторые данные не пришли в CheckoutModel');
			return;
		}

		this.address = formData.adress;
		this.paymentType = formData.paymentType;

		this.events.emit(EventsNames.CHECKOUT_ORDER_SUBMITED);
	}

	/**
	 * Проверяем и сохраняем данные из ContactForm
	 */
	private saveContactForm({ formData }: CheckoutContactFormSumitEvent) {
		if (!formData.phone || !formData.email) {
			console.error('Некоторые данные не пришли в CheckoutModel');
			return;
		}

		this.phone = formData.phone;
		this.email = formData.email;

		this.createOrder();
	}

	/**
	 * Делаем очистку
	 */
	private cleanUp() {
		this.cartItems = [];
		this.address = null;
		this.email = null;
		this.phone = null;
		this.paymentType = null;
	}
}
