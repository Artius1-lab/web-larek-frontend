import { IEvents } from './events';

/**
 * Базовый класс модели
 */
export class BaseModel {
	/**
	 * Будем хранить внутри себя события
	 * Например, чтобы не повторять себя при создании других моделей
	 * Так как везде нужен доступ к брокеру событий
	 */
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}
}
