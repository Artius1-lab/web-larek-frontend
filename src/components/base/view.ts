import { IEvents } from './events';

/**
 * Базовый класс для создания всех View
 * Содержит все нужные методы для UI
 */
export abstract class BaseView {
	protected rootElement: HTMLElement;
	protected events: IEvents;

	constructor(protected templateId: string, events: IEvents) {
		const template = document.getElementById(
			this.templateId
		) as HTMLTemplateElement;

		this.rootElement = template.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;
		this.events = events;
	}

	/**
	 * Обязательный метод с разной реализацией у наследников
	 * @param data - данные для рендера
	 */
	abstract render(data?: unknown): HTMLElement;

	/**
	 * Уничтожение элемента
	 */
	destroy(): void {
		if (this.rootElement.parentNode) {
			this.rootElement.parentNode.removeChild(this.rootElement);
		}
	}

	/**
	 * Получение элемента
	 */
	getElement(): HTMLElement {
		return this.rootElement;
	}

	/**
	 * Очистка элемента
	 */
	protected clear(): void {
		this.rootElement.innerHTML = '';
	}
}
