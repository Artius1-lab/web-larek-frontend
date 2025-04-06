import { ICartCounterView } from '../../types/view';
import { ChangeCartEvent, EventsNames } from '../../types/events';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';

/**
 * Внешний вид counter корзины
 */
export class CartCounter extends BaseView implements ICartCounterView {
	constructor(templateId: string, events: IEvents) {
		super(templateId, events);

		this.addEventListeners();
	}

	render() {
		return this.rootElement;
	}

	/**
	 * Перерендривает количество товаров в корзине
	 */
	private rerenderCartItemsCount(qty: number) {
		this.rootElement.textContent = String(qty);
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
	}
}
