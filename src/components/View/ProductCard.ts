import { Product } from '../../types/models';
import { IActions, IProductCardView } from '../../types/view';
import { getFormatedPrice, getImageSrc } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';

/**
 * Внешний вид карточки продукта в каталоге
 */
export class ProductCard extends BaseView implements IProductCardView {
	protected cardCategoryEl: HTMLElement;
	protected cardTitleEl: HTMLElement;
	protected cardImageEl: HTMLImageElement;
	protected cardPriceEl: HTMLElement;
	protected classes = <Record<string, string>>{
		дополнительное: 'additional',
		'софт-скил': 'soft',
		кнопка: 'button',
		'хард-скил': 'hard',
		другое: 'other',
	};

	constructor(
		protected templateId: string,
		events: IEvents,
		actions?: IActions
	) {
		super(templateId, events);

		this.cardCategoryEl = this.rootElement.querySelector('.card__category');
		this.cardTitleEl = this.rootElement.querySelector('.card__title');
		this.cardPriceEl = this.rootElement.querySelector('.card__price');
		this.cardImageEl = this.rootElement.querySelector('.card__image');

		if (actions?.onClick) {
			this.rootElement.addEventListener('click', actions.onClick);
		}
	}

	/**
	 * Обновление класса категории
	 */
	protected updateCategoryClass(value: string) {
		this.cardCategoryEl.className = `card__category card__category_${this.classes[value]}`;
	}

	render(data: Product) {
		this.cardCategoryEl.textContent = data.category;
		this.cardCategoryEl.textContent = data.category;
		this.cardTitleEl.textContent = data.title;
		this.cardImageEl.src = getImageSrc(data.image);
		this.cardImageEl.alt = data.title;
		this.cardPriceEl.textContent = getFormatedPrice(data.price);
		this.updateCategoryClass(data.category);
		return this.rootElement;
	}
}
