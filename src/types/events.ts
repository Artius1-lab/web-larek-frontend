import {
	CartItem,
	CheckoutContactFormData,
	CheckoutOrderFormData,
	Product,
} from './models';

export enum EventsNames {
	/**
	 * Инициализация приложения
	 */
	INIT = 'init',

	/**
	 * Успешная загрузка всех продуктов
	 */
	PRODUCTS_FETCHED = 'products:fetched',

	/**
	 * Открытие продукта в модалке
	 */
	PRODUCT_PREVIEW = 'product:preview',

	/**
	 * Добавление в корзину
	 */
	ADD_TO_CART = 'cart:add',

	/**
	 * Удаление из корзины
	 */
	REMOVE_FROM_CART = 'cart:remove',

	/**
	 * Изменение корзины
	 */
	CART_CHANGED = 'cart:changed',

	/**
	 * Посмотреть содержимое корзины
	 */
	VIEW_CART = 'cart:view',

	/**
	 * Открыть корзину (это событие передаёт данные)
	 */
	OPEN_CART = 'cart:open',

	/**
	 * Открыте модалки
	 */
	MODAL_OPEN = 'modal:open',

	/**
	 * Закрытие модалки
	 */
	MODAL_CLOSE = 'modal:close',

	/**
	 * Начать checkout
	 */
	CHECKOUT_START = 'checkout:start',

	/**
	 * Checkout начался
	 */
	CHECKOUT_STARTED = 'checkout:started',

	/**
	 * Подтверждение формы заказа на view
	 */
	CHECKOUT_ORDER_SUBMIT = 'checkout:order:submit',

	/**
	 * Форма заказа подтвердилась на model
	 */
	CHECKOUT_ORDER_SUBMITED = 'checkout:order:submited',

	/**
	 * Подтверждение формы контактов на view
	 */
	CHECKOUT_CONTACTS_SUBMIT = 'checkout:contacts:submit',

	/**
	 * Показать модалку с успехом
	 */
	CHECKOUT_SUCCESS = 'checkout:success',

	/**
	 * Скрыть модалку с успехом
	 */
	CHECKOUT_SUCCESS_CLOSE = 'checkout:success:close',
}

export interface ProductFetchedEvent {
	products: Product[];
}

export interface ProductPreviewEvent {
	product: Product;
}

export interface AddToCartEvent {
	product: Product;
}

export interface RemoveFromCartEvent {
	itemId: string;
}

export interface ChangeCartEvent {
	cartItems: CartItem[];
}

export interface OpenCartEvent {
	cartItems: CartItem[];
}

export interface CheckoutStartedEvent {
	cartItems: CartItem[];
}

export interface CheckoutOrderFormSumitEvent {
	formData: CheckoutOrderFormData;
}

export interface CheckoutContactFormSumitEvent {
	formData: CheckoutContactFormData;
}

export interface CheckoutSuccessEvent {
	total: number;
}
