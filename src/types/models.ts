/**
 * Тип цены
 */
export type Price = number | null;

/**
 * Базовый тип продукта
 */
export type Product = {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: Price;
};

/**
 * Тип товара в корзине
 * в будущем можно расширить и добавить количество и т.д.
 */
export type CartItem = Product;

/**
 * Интерфейс модели корзины
 */
export interface ICartModel {
	addToCart: (item: Product) => void;

	removeFromCart: (itemId: string) => void;

	checkout: () => void;

	viewCart: () => void;

	getCartItems: () => CartItem[];
}

/**
 * Интерфейс Модели Чекаута
 */
export interface ICheckout {
	createOrder: () => Promise<void>;
}

/**
 * Передаваемые параметры из формы заказа
 */
export type CheckoutOrderFormData = {
	adress: string | null;
	paymentType: string | null;
};

/**
 * Передаваемые параметры из формы контактов
 */
export type CheckoutContactFormData = {
	email: string | null;
	phone: string | null;
};

/**
 * Интерфейс Модели Продукта
 */
export interface IProductsModel {
	fetchProducts: () => void;
}
