import { CartItem, ICartModel } from '../../types/models';
import {
	AddToCartEvent,
	ChangeCartEvent,
	CheckoutStartedEvent,
	EventsNames,
	OpenCartEvent,
	RemoveFromCartEvent,
} from '../../types/events';
import { IEvents } from '../base/events';
import { BaseModel } from '../base/model';

/**
 * Модель для работы с корзиной
 */
export class CartModel extends BaseModel implements ICartModel {
	private cartItems: CartItem[];

	constructor(events: IEvents) {
		super(events);

		this.cartItems = [];

		this.initCache();

		this.addEventListeners();
	}

	/**
	 * Добавление товара в корзину
	 * @param item - товар, который добавляем в корзину
	 */
	addToCart(item: CartItem) {
		// Если товар уже есть в корзине
		if (this.cartItems.find((el) => el.id == item.id)) {
			alert('Товар уже есть в корзине');
			return;
		}

		this.cartItems.push(item);

		this.emitChangeCart();

		alert(`Товар "${item.title}" добавлен в корзину`);

		this.saveCache();
	}

	/**
	 * Удаление товара из корзины
	 * @param itemid - id товара который нужно удалить
	 */
	removeFromCart(itemId: string) {
		// Если товара нет в корзине
		if (!this.cartItems.find((el) => el.id == itemId)) {
			console.warn('Товара с таким id нет в корзине');
			return;
		}

		this.cartItems = this.cartItems.filter((el) => el.id != itemId);
		this.emitChangeCart();

		this.saveCache();
	}

	/**
	 * Просмотр корзины
	 */
	viewCart() {
		this.events.emit<OpenCartEvent>(EventsNames.OPEN_CART, {
			cartItems: this.getCartItems(),
		});
	}

	/**
	 * Начать оформление чекаута
	 */
	checkout() {
		if (this.cartItems.length == 0) {
			console.warn('Нельзя оформить заказ с 0 товаров');
			return;
		}

		this.events.emit<CheckoutStartedEvent>(EventsNames.CHECKOUT_STARTED, {
			cartItems: this.getCartItems(),
		});
	}

	/**
	 * Получить товары из корзины
	 */
	getCartItems(): CartItem[] {
		return JSON.parse(JSON.stringify(this.cartItems));
	}

	/**
	 * Обработчики ошибок
	 */
	private addEventListeners() {
		this.events.on<AddToCartEvent>(
			EventsNames.ADD_TO_CART,
			this.addToCartHandler.bind(this)
		);

		this.events.on<RemoveFromCartEvent>(
			EventsNames.REMOVE_FROM_CART,
			this.removeFromCartHandler.bind(this)
		);

		this.events.on(EventsNames.VIEW_CART, this.viewCart.bind(this));

		this.events.on(EventsNames.CHECKOUT_SUCCESS, this.cleanUp.bind(this));

		this.events.on(EventsNames.CHECKOUT_START, this.checkout.bind(this));
	}

	/**
	 * Обработчик события на добавление в корзину
	 */
	private addToCartHandler(data: AddToCartEvent) {
		this.addToCart(data.product);
	}

	/**
	 * Обработчик события на удаление из корзины
	 */
	private removeFromCartHandler(data: RemoveFromCartEvent) {
		this.removeFromCart(data.itemId);
	}

	/**
	 * Сохранить кеш корзины
	 */
	private saveCache() {
		localStorage.setItem('cart', JSON.stringify(this.cartItems));
	}

	/**
	 * Удалить кеш корзины
	 */
	private removeCache() {
		localStorage.removeItem('cart');
	}

	/**
	 * Инициализация кеша корзины
	 */
	private initCache() {
		const cache = localStorage.getItem('cart');
		if (cache) {
			this.cartItems = JSON.parse(cache);

			// Добавляем обработчик события на init, чтобы отправить сообщения о корзине
			this.events.on(EventsNames.INIT, this.emitChangeCart.bind(this));
		}
	}

	/**
	 * Уборка
	 */
	private cleanUp() {
		this.cartItems = [];
		this.removeCache();
		this.emitChangeCart();
	}

	/**
	 * Вызов события на изменение корзины
	 */
	private emitChangeCart() {
		this.events.emit<ChangeCartEvent>(EventsNames.CART_CHANGED, {
			cartItems: this.getCartItems(),
		});
	}
}
