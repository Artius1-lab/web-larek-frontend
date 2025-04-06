import { ICartView } from '../../types/view';
import { EventsNames } from '../../types/events';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';
import { getFormatedPrice } from '../../utils/utils';

/**
 * Внешний вид корзины
 */
export class Cart extends BaseView implements ICartView {
	private cartItemsListEl: HTMLElement;
	private checkoutButtonEL: HTMLButtonElement;
	private totalEl: HTMLElement;

	constructor(templateId: string, events: IEvents) {
		super(templateId, events);

		this.cartItemsListEl = this.rootElement.querySelector('.basket__list');
		this.checkoutButtonEL = this.rootElement.querySelector('.basket__button');
		this.totalEl = this.rootElement.querySelector('.basket__price');

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

		this.totalEl.textContent = `${getFormatedPrice(total)}`;

		this.checkoutButtonEL.classList.remove('hidden');

		cartItemsViews.map((el) => {
			this.cartItemsListEl.appendChild(el);
		});

		return this.rootElement;
	}

	/**
	 * Добавляем обработчики событй
	 */
	private addEventListeners() {
		this.checkoutButtonEL.addEventListener('click', () => {
			this.events.emit(EventsNames.CHECKOUT_START);
		});
	}
}
