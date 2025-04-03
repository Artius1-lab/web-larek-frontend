import { CartItem } from '../../types/models';
import { IActions, ICartItemLineView } from '../../types/view';
import { getFormatedPrice } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';

/**
 * Внешний вид картайтема
 */
export class CartItemLine extends BaseView implements ICartItemLineView {
	private indexEL: HTMLElement;
	private titleEl: HTMLElement;
	private priceEL: HTMLElement;
	private buttonRemoveEl: HTMLButtonElement;

	constructor(template: string, events: IEvents, actions?: IActions) {
		super(template, events);
		this.indexEL = this.rootElement.querySelector('.basket__item-index');
		this.titleEl = this.rootElement.querySelector('.card__title');
		this.priceEL = this.rootElement.querySelector('.card__price');
		this.buttonRemoveEl = this.rootElement.querySelector(
			'.basket__item-delete'
		);

		if (actions?.onRemoveCartItem) {
			this.buttonRemoveEl.addEventListener('click', actions.onRemoveCartItem);
		}
	}

	render({ cartItem, index }: { cartItem: CartItem; index: number }) {
		this.indexEL.textContent = String(index);
		this.titleEl.textContent = cartItem.title;
		this.priceEL.textContent = getFormatedPrice(cartItem.price);
		return this.rootElement;
	}
}
