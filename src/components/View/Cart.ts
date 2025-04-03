import { ICartView } from '../../types/view';
import { ChangeCartEvent, EventsNames } from '../../types/events';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';

/**
 * Внешний вид корзины
 */
export class Cart extends BaseView implements ICartView {
	private cartItemsListEl: HTMLElement;
	private checkoutButtonEL: HTMLButtonElement;
	private totalEl: HTMLElement;
	private headerCartButtonEl: HTMLButtonElement;
	private headerCartCounterEl: HTMLElement;

	constructor(templateId: string, events: IEvents) {
		super(templateId, events);

		this.cartItemsListEl = this.rootElement.querySelector('.basket__list');
		this.checkoutButtonEL = this.rootElement.querySelector('.basket__button');
		this.totalEl = this.rootElement.querySelector('.basket__price');
		this.headerCartButtonEl = document.querySelector('.header__basket');
		this.headerCartCounterEl = document.querySelector(
			'.header__basket-counter'
		);

		this.addEventListeners();
	}

	render({
		cartItemsViews,
		total,
	}: {
		cartItemsViews: HTMLElement[];
		total: number;
	}) {
		this.cartItemsListEl.innerHTML = '';

		// Пустая корзина
		if (!cartItemsViews.length) {
			this.cartItemsListEl.innerHTML = '<p>Пока пусто :(</p>';
			this.totalEl.textContent = '';
			this.checkoutButtonEL.classList.add('hidden');
			return this.rootElement;
		}

		this.totalEl.textContent = `${total}`;

		this.checkoutButtonEL.classList.remove('hidden');

		cartItemsViews.map((el) => {
			this.cartItemsListEl.appendChild(el);
		});

		return this.rootElement;
	}

	/**
	 * Перерендривает количество товаров в корзине
	 */
	private rerenderCartItemsCount(qty: number) {
		this.headerCartCounterEl.textContent = String(qty);
	}

	/**
	 * Добавляем обработчики событй
	 */
	private addEventListeners() {
		this.events.on<ChangeCartEvent>(
			EventsNames.CART_CHANGED,
			({ cartItems }) => {
				this.rerenderCartItemsCount(cartItems.length);
			}
		);

		this.headerCartButtonEl.addEventListener('click', () => {
			this.events.emit(EventsNames.VIEW_CART);
		});

		this.checkoutButtonEL.addEventListener('click', () => {
			this.events.emit(EventsNames.CHECKOUT_START);
		});
	}
}
