import { ICheckoutContactsView } from '../../types/view';
import {
	CheckoutContactFormChangedEvent,
	CheckoutFormChangeEvent,
	EventsNames,
} from '../../types/events';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';
import Inputmask from 'inputmask';

export class CheckoutContacts
	extends BaseView
	implements ICheckoutContactsView
{
	private emailInputEl: HTMLInputElement;
	private phoneInputEl: HTMLInputElement;
	private submitBtnEl: HTMLButtonElement;
	private formErrorsEl: HTMLElement;

	constructor(template: string, events: IEvents) {
		super(template, events);
		this.emailInputEl = this.rootElement.querySelector('[name="email"]');
		this.phoneInputEl = this.rootElement.querySelector('[name="phone"]');
		this.submitBtnEl = this.rootElement.querySelector('.button');
		this.formErrorsEl = this.rootElement.querySelector('.form__errors');

		// Устанавливаем маску
		const im = new Inputmask('+7 (999) 999-99-99');
		im.mask(this.phoneInputEl);
		this.addEventListeners();
	}

	render() {
		return this.rootElement;
	}

	/**
	 * Добавляем обработчики событий
	 */
	private addEventListeners() {
		this.submitBtnEl.addEventListener('click', this.submitForm.bind(this));

		this.emailInputEl.addEventListener('change', this.emailChange.bind(this));
		this.emailInputEl.addEventListener('keyup', this.emailChange.bind(this));

		this.phoneInputEl.addEventListener('change', this.phoneChange.bind(this));
		this.phoneInputEl.addEventListener('keyup', this.phoneChange.bind(this));

		this.events.on<CheckoutContactFormChangedEvent>(
			EventsNames.CHECKOUT_CONTACTS_UPDATED,
			this.updateChanges.bind(this)
		);
	}

	/**
	 * Подтверждение формы
	 */
	private submitForm(e: Event) {
		e.preventDefault();

		this.events.emit(EventsNames.CHECKOUT_CONTACTS_SUBMIT);
	}

	/**
	 * Обработчик ввода email
	 */
	private emailChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;

		this.events.emit<CheckoutFormChangeEvent>(
			EventsNames.CHECKOUT_ORDER_CHANGE,
			{
				name: 'email',
				value: input.value,
			}
		);
	}

	/**
	 * Обработчик ввода телефона
	 */
	private phoneChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;

		this.events.emit<CheckoutFormChangeEvent>(
			EventsNames.CHECKOUT_ORDER_CHANGE,
			{
				name: 'phone',
				value: input.value,
			}
		);
	}

	/**
	 * Отрисовка обновлений
	 */
	private updateChanges(data: CheckoutContactFormChangedEvent) {
		const phone = data.phone === undefined ? '' : data.phone;
		const email = data.email ? data.email : '';
		const errors = data.errors ? data.errors : '';
		const valid = data.valid ? data.valid : false;

		// Нужно для хорошей работы с маской телефона
		if (phone !== null) {
			this.phoneInputEl.value = phone;
		}

		this.emailInputEl.value = email;

		this.formErrorsEl.innerHTML = errors;

		this.submitBtnEl.disabled = !valid;
	}
}
