import { CartItem, Product } from './models';

/**
 * Вспомогательный интерфейс для передачи действий
 */
export interface IActions {
	onClick?: (event: MouseEvent) => void;
	onAddToCart?: (event: MouseEvent) => void;
	onRemoveCartItem?: (event: MouseEvent) => void;
}

/**
 * Интерфейс модалки
 */
export interface IModalView {
	open: () => void;
	close: () => void;
	render: (value: HTMLElement) => HTMLElement;
}

/**
 * Интерфейс карточки товара
 */
export interface IProductCardView {
	render: (data: Product) => HTMLElement;
}

/**
 * Интерфейс Модалки товара
 */
export interface IProductModalView {
	render: (data: Product) => HTMLElement;
	updateButtonClickHandler: (handler: () => void) => void;
}

/**
 * Интерфейс корзины
 */
export interface ICartView {
	render: (data: {
		cartItemsViews: HTMLElement[];
		total: number;
	}) => HTMLElement;
}

/**
 * Интерфейс карт айтема
 */
export interface ICartItemLineView {
	render: (data: { cartItem: CartItem; index: number }) => HTMLElement;
}

/**
 * Интерфейс оформления заказа шага заказа
 */
export interface ICheckoutOrderView {
	render: () => void;
	validate: () => void;
}

/**
 * Интерфейс оформления заказа шага контакта
 */
export interface ICheckoutContactsView {
	render: () => void;
	validate: () => void;
}

/**
 * Интерфейс оформления заказа - успех
 */
export interface ICheckoutSuccessdView {
	render: (total: number) => void;
}
