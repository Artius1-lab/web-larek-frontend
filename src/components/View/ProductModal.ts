import { Product } from '../../types/models';
import { IProductCardView } from '../../types/view';
import { getFormatedPrice, getImageSrc } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ProductCard } from './ProductCard';

/**
 * Внешний вид карточки продукта в модалке
 */
export class ProductModal extends ProductCard implements IProductCardView {
	private textEl: HTMLElement;
	private buttonEl: HTMLElement;
	private handleClick: (event: MouseEvent) => void;

	constructor(templateId: string, events: IEvents) {
		super(templateId, events);
		this.textEl = this.rootElement.querySelector('.card__text');
		this.buttonEl = this.rootElement.querySelector('.card__button');
	}

	render(data: Product) {
		this.cardCategoryEl.textContent = data.category;
		this.cardCategoryEl.textContent = data.category;
		this.cardTitleEl.textContent = data.title;
		this.cardImageEl.src = getImageSrc(data.image);
		this.cardImageEl.alt = data.title;
		this.cardPriceEl.textContent = getFormatedPrice(data.price);
		this.textEl.textContent = data.description;
		this.updateCategoryClass(data.category);
		return this.rootElement;
	}

	/**
	 * Смена обработчика клика на кнопку
	 */
	updateButtonClickHandler(handler: () => void) {
		if (this.handleClick) {
			this.buttonEl.removeEventListener('click', this.handleClick);
		}
		this.handleClick = handler;
		this.buttonEl.addEventListener('click', this.handleClick);
	}
}
