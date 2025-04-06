import { IOrderApi } from '../../types/api';
import { CartItem, ICheckout } from '../../types/models';
import { isApiError } from '../../utils/api';
import {
	CheckoutContactFormChangedEvent,
	CheckoutFormChangeEvent,
	CheckoutOrderFormChangedEvent,
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

		this.events.on(
			EventsNames.CHECKOUT_ORDER_SUBMIT,
			this.saveOrderForm.bind(this)
		);

		this.events.on(
			EventsNames.CHECKOUT_CONTACTS_SUBMIT,
			this.saveContactForm.bind(this)
		);

		this.events.on<CheckoutFormChangeEvent>(
			EventsNames.CHECKOUT_ORDER_CHANGE,
			this.inputChange.bind(this)
		);
	}

	/**
	 * При начале чекаута - сохраняем товары из корзины
	 */
	private startCheckout({ cartItems }: CheckoutStartedEvent) {
		this.cartItems = cartItems;
	}

	/**
	 * Сохранение изменений по инпутам
	 */
	private inputChange({ name, value }: CheckoutFormChangeEvent) {
		switch (name) {
			case 'paymentType':
				this.paymentType = value;
				this.validateOrderForm();
				break;

			case 'address':
				this.address = value;
				this.validateOrderForm();
				break;

			case 'phone':
				this.phone = value;
				this.validateContactForm();
				break;

			case 'email':
				this.email = value;
				this.validateContactForm();
				break;

			default:
				break;
		}
	}

	/**
	 * Валидация формы заказа
	 */
	private validateOrderForm() {
		let valid = true;

		const errors = [];

		if (!this.address || this.address.length < 5) {
			valid = false;
			errors.push('Введён некорректный адрес');
		}

		if (!this.paymentType) {
			valid = false;
			errors.push('Не выбран тип оплаты');
		}

		const errorMsg = errors.join('<br/>');

		this.events.emit<CheckoutOrderFormChangedEvent>(
			EventsNames.CHECKOUT_ORDER_UPDATED,
			{
				paymentType: this.paymentType,
				address: this.address,
				valid,
				errors: errorMsg,
			}
		);

		return valid;
	}

	/**
	 * Валидация формы контакта
	 */
	private validateContactForm() {
		let valid = true;

		const errors = [];

		if (!this.email || !this.isValidEmail(this.email)) {
			valid = false;
			errors.push('Введён некорректный email');
		}

		if (!this.phone || !this.isValidPhone(this.phone)) {
			valid = false;
			errors.push('Введён некорректный номер телефона');
		}

		const errorMsg = errors.join('<br/>');

		this.events.emit<CheckoutContactFormChangedEvent>(
			EventsNames.CHECKOUT_CONTACTS_UPDATED,
			{
				phone: null,
				email: this.email,
				valid,
				errors: errorMsg,
			}
		);

		return valid;
	}

	/**
	 * Проверяем и сохраняем данные из OrderForm
	 */
	private saveOrderForm() {
		if (!this.validateOrderForm()) {
			console.error('Некоторые данные не пришли в CheckoutModel');
			return;
		}

		this.events.emit(EventsNames.CHECKOUT_ORDER_SUBMITED);
	}

	/**
	 * Проверяем и сохраняем данные из ContactForm
	 */
	private saveContactForm() {
		if (!this.validateContactForm()) {
			console.error('Некоторые данные не пришли в CheckoutModel');
			return;
		}

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

		this.events.emit<CheckoutOrderFormChangedEvent>(
			EventsNames.CHECKOUT_ORDER_UPDATED,
			{
				paymentType: this.paymentType,
				address: this.address,
				valid: false,
				errors: '',
			}
		);

		this.events.emit<CheckoutContactFormChangedEvent>(
			EventsNames.CHECKOUT_CONTACTS_UPDATED,
			{
				phone: '',
				email: this.email,
				valid: false,
				errors: '',
			}
		);
	}

	/**
	 * Валидация номера телефона
	 */
	private isValidPhone(phone: string): boolean {
		return /^(\+7|8)[0-9]{10}$/.test(phone.replace(/[-\s()]/g, ''));
	}

	/**
	 * Валидация email
	 */
	private isValidEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
}
