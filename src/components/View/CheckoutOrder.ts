import { ICheckoutOrderView } from '../../types/view';
import {
	CheckoutFormChangeEvent,
	CheckoutOrderFormChangedEvent,
	EventsNames,
} from '../../types/events';
import { IEvents } from '../base/events';
import { BaseView } from '../base/view';

export class CheckoutOrder extends BaseView implements ICheckoutOrderView {
	private paymentBtnEls: HTMLButtonElement[];
	private submitBtnEl: HTMLButtonElement;
	private addressEl: HTMLInputElement;
	private formErrorsEl: HTMLElement;

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
	 * Добавляем обработчики событий
	 */
	private addEventListeners() {
		this.submitBtnEl.addEventListener('click', this.submitForm.bind(this));

		this.paymentBtnEls.forEach((btn) => {
			btn.addEventListener('click', this.clickPaymentType.bind(this));
		});

		this.addressEl.addEventListener('change', this.addressChange.bind(this));
		this.addressEl.addEventListener('keyup', this.addressChange.bind(this));

		this.events.on<CheckoutOrderFormChangedEvent>(
			EventsNames.CHECKOUT_ORDER_UPDATED,
			this.updateChanges.bind(this)
		);
	}

	/**
	 * Подтверждение формы
	 */
	private submitForm(e: Event) {
		e.preventDefault();

		this.events.emit(EventsNames.CHECKOUT_ORDER_SUBMIT);
	}

	/**
	 * Обработчик для кнопок платежа
	 */
	private clickPaymentType(e: Event) {
		const clickedBtn = e.currentTarget as HTMLButtonElement;

		this.events.emit<CheckoutFormChangeEvent>(
			EventsNames.CHECKOUT_ORDER_CHANGE,
			{
				name: 'paymentType',
				value: clickedBtn.name,
			}
		);
	}

	/**
	 * Обработчик для инпута
	 */
	private addressChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;

		this.events.emit<CheckoutFormChangeEvent>(
			EventsNames.CHECKOUT_ORDER_CHANGE,
			{
				name: 'address',
				value: input.value,
			}
		);
	}

	/**
	 * Отрисовка обновлений
	 */
	private updateChanges(data: CheckoutOrderFormChangedEvent) {
		const paymentType = data.paymentType ? data.paymentType : '';
		const address = data.address ? data.address : '';
		const errors = data.errors ? data.errors : '';
		const valid = data.valid ? data.valid : false;

		this.paymentBtnEls.forEach((btn) => {
			btn.classList.remove('button_alt-active');

			this.paymentBtnEls.forEach((btn) => {
				btn.classList.toggle('button_alt-active', btn.name === paymentType);
			});
		});

		this.addressEl.value = address;

		this.formErrorsEl.innerHTML = errors;

		this.submitBtnEl.disabled = !valid;
	}
}
