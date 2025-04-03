import { ICheckoutOrderView } from '../../types/view';
import { CheckoutOrderFormSumitEvent, EventsNames } from '../../types/events';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';

export class CheckoutOrder extends BaseView implements ICheckoutOrderView {
	private paymentBtnEls: HTMLButtonElement[];
	private submitBtnEl: HTMLButtonElement;
	private addressEl: HTMLInputElement;
	private formErrorsEl: HTMLElement;

	/**
	 * Способ оплаты
	 */
	private paymentType: string | null = null;

	/**
	 * Адресс доставки
	 */
	private adress: string | null = null;

	constructor(template: string, events: IEvents) {
		super(template, events);
		this.paymentBtnEls = Array.from(
			this.rootElement.querySelectorAll('.button_alt')
		);
		this.submitBtnEl = this.rootElement.querySelector('.order__button');
		this.addressEl = this.rootElement.querySelector('.form__input');
		this.formErrorsEl = this.rootElement.querySelector('.form__errors');

		this.addEventListeners();
	}

	render() {
		return this.rootElement;
	}

	/**
	 * Валидация формы и паралельное разблокирование кнопки
	 */
	public validate() {
		let valid = true;

		const errors = [];

		if (!this.adress || this.adress.length < 5) {
			valid = false;
			errors.push('Введён некорректный адрес');
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

		this.paymentBtnEls.forEach((btn) => {
			btn.addEventListener('click', this.clickPaymentType.bind(this));
		});

		this.addressEl.addEventListener('change', this.addressChange.bind(this));
		this.addressEl.addEventListener('keyup', this.addressChange.bind(this));
	}

	/**
	 * Подтверждение формы
	 */
	private submitForm(e: Event) {
		e.preventDefault();

		this.events.emit<CheckoutOrderFormSumitEvent>(
			EventsNames.CHECKOUT_ORDER_SUBMIT,
			{
				formData: {
					adress: this.adress,
					paymentType: this.paymentType,
				},
			}
		);

		// Обнуляем все данные

		this.adress = null;
		this.paymentType = null;

		this.paymentBtnEls.forEach((btn) => {
			btn.classList.remove('button_alt-active');
		});

		this.addressEl.value = '';

		this.formErrorsEl.innerHTML = '';
	}

	/**
	 * Обработчик для кнопок платежа
	 */
	private clickPaymentType(e: Event) {
		const clickedBtn = e.currentTarget as HTMLButtonElement;
		this.paymentType = clickedBtn.name;

		this.paymentBtnEls.forEach((btn) => {
			btn.classList.toggle('button_alt-active', btn.name === this.paymentType);
		});

		this.validate();
	}

	/**
	 * Обработчик для инпута
	 */
	private addressChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;

		this.adress = input.value;

		this.validate();
	}
}
