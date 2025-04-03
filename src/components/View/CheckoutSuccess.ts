import { ICheckoutSuccessdView } from '../../types/view';
import { EventsNames } from '../../types/events';
import { getFormatedPrice } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';

export class CheckoutSuccess extends BaseView implements ICheckoutSuccessdView {
	private descriptionEl: HTMLElement;
	private closeBtnEl: HTMLButtonElement;

	constructor(template: string, events: IEvents) {
		super(template, events);
		this.descriptionEl = this.rootElement.querySelector(
			'.order-success__description'
		);
		this.closeBtnEl = this.rootElement.querySelector('.order-success__close');
		this.addEventListeners();
	}

	render(total: number) {
		this.descriptionEl.textContent = String(
			`Списано ${getFormatedPrice(total)}`
		);
		return this.rootElement;
	}

	private addEventListeners() {
		this.closeBtnEl.addEventListener('click', () => {
			this.events.emit(EventsNames.CHECKOUT_SUCCESS_CLOSE);
		});
	}
}
