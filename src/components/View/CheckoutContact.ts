import { ICheckoutContactsView } from '../../types/view';
import { CheckoutContactFormSumitEvent, EventsNames } from '../../types/events';
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

	/**
	 * Введённая почта
	 */
	private email: string | null;

	/**
	 * Введённый телефон
	 */
	private phone: string | null;

	constructor(template: string, events: IEvents) {
		super(template, events);
		this.emailInputEl = this.rootElement.querySelector('[name="email"]');
		this.phoneInputEl = this.rootElement.querySelector('[name="phone"]');
		this.submitBtnEl = this.rootElement.querySelector('.button');
		this.formErrorsEl = this.rootElement.querySelector('.form__errors');

		// Устанавливаем маску
		const im = new Inputmask('+7 (999) 999-99-99');
		im.mask(this.phoneInputEl);
	}

	render() {
		this.addEventListeners();

		return this.rootElement;
	}

	/**
	 * Валидация формы и паралельное разблокирование кнопки
	 */
	public validate() {
		let valid = true;

		const errors = [];

		if (!this.email || !this.isValidEmail(this.email)) {
			valid = false;
			errors.push('Введён некорректный email');
		}

		if (!this.phone || !this.isValidPhone(this.phone)) {
			valid = false;
			errors.push('Введён некорректный номер телефона');
		}

		const errorMsg = errors.join('<br/>');

		this.formErrorsEl.innerHTML = errorMsg;

		this.submitBtnEl.disabled = !valid;
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
	}

	/**
	 * Подтверждение формы
	 */
	private submitForm(e: Event) {
		e.preventDefault();

		this.events.emit<CheckoutContactFormSumitEvent>(
			EventsNames.CHECKOUT_CONTACTS_SUBMIT,
			{
				formData: {
					phone: this.phone,
					email: this.email,
				},
			}
		);

		// Обнуляем все данные
		this.email = null;
		this.phone = null;

		this.emailInputEl.value = '';
		this.phoneInputEl.value = '';

		this.formErrorsEl.innerHTML = '';
	}

	/**
	 * Обработчик ввода email
	 */
	private emailChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		this.email = input.value;
		this.validate();
	}

	/**
	 * Обработчик ввода телефона
	 */
	private phoneChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		this.phone = input.value;
		this.validate();
	}

	/**
	 * Валидация номера телефона
	 */
	private isValidPhone(phone: string): boolean {
		return /^(\+7|8)[0-9]{10}$/.test(phone.replace(/[-\s()]/g, ''));
	}

	/**
	 * Валидация email
	 */
	private isValidEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
}
