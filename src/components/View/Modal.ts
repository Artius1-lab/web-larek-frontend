import { IModalView } from '../../types/view';
import { EventsNames } from '../../types/events';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';

/**
 * Базовый класс модалки
 */
export class Modal extends BaseView implements IModalView {
	protected closeButtonEl: HTMLButtonElement;
	protected contentEl: HTMLElement;
	protected containerEl: HTMLElement;
	protected pageWrapperEl: HTMLElement;

	constructor(templateId: string, events: IEvents) {
		super(templateId, events);

		this.closeButtonEl = this.rootElement.querySelector('.modal__close');
		this.contentEl = this.rootElement.querySelector('.modal__content');
		this.containerEl = this.rootElement.querySelector('.modal__container');
		this.pageWrapperEl = document.querySelector('.page__wrapper');

		this.addEventListeners();
	}

	/**
	 * Открытие модального окна
	 */
	open() {
		this.rootElement.classList.add('modal_active');
		this.events.emit(EventsNames.MODAL_OPEN);
		this.pageWrapperEl.classList.add('page__wrapper_locked');
	}

	/**
	 * Закрытие модального окна
	 */
	close() {
		this.rootElement.classList.remove('modal_active');
		this.contentEl.innerHTML = null; // Очищаем содержимое
		this.events.emit(EventsNames.MODAL_CLOSE);
		this.pageWrapperEl.classList.remove('page__wrapper_locked');
	}

	render(value: HTMLElement): HTMLElement {
		this.contentEl.replaceChildren(value);
		return this.rootElement;
	}

	private addEventListeners() {
		this.closeButtonEl.addEventListener('click', this.close.bind(this));
		this.rootElement.addEventListener('click', this.close.bind(this));
		this.containerEl.addEventListener('click', (event) =>
			event.stopPropagation()
		);
	}
}
