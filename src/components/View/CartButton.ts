import { ICartButtonView } from '../../types/view';
import { EventsNames } from '../../types/events';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';

/**
 * Внешний вид кнопки корзины
 */
export class CartButton extends BaseView implements ICartButtonView {
	constructor(templateId: string, events: IEvents) {
		super(templateId, events);

		this.addEventListeners();
	}

	render({ child }: { child?: HTMLElement }) {
		this.rootElement.innerHTML = '';
		if (child) {
			this.rootElement.appendChild(child);
		}
		return this.rootElement;
	}

	/**
	 * Добавляем обработчики событй
	 */
	private addEventListeners() {
		this.rootElement.addEventListener('click', () => {
			this.events.emit(EventsNames.VIEW_CART);
		});
	}
}
