import { IGalleryView } from '../../types/view';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';

/**
 * Внешний вид кнопки корзины
 */
export class Gallery extends BaseView implements IGalleryView {
	constructor(templateId: string, events: IEvents) {
		super(templateId, events);
	}

	render({ productCards }: { productCards: HTMLElement[] }) {
		this.rootElement.innerHTML = '';

		productCards.map((el) => {
			this.rootElement.appendChild(el);
		});
		return this.rootElement;
	}
}
