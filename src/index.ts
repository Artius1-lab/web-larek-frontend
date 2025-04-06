import { OrderApi } from './components/api/OrderApi';
import { ProductApi } from './components/api/ProductApi';
import { EventEmitter } from './components/base/events';
import { CartModel } from './components/Model/CartModel';
import { ChekoutModel } from './components/Model/CheckoutModel';
import { ProductsModel } from './components/Model/ProductsModel';
import { Cart } from './components/View/Cart';
import { CartItemLine } from './components/View/CartItemLine';
import { CheckoutContacts } from './components/View/CheckoutContact';
import { CheckoutOrder } from './components/View/CheckoutOrder';
import { CheckoutSuccess } from './components/View/CheckoutSuccess';
import { Modal } from './components/View/Modal';
import { ProductCard } from './components/View/ProductCard';
import { ProductModal } from './components/View/ProductModal';
import './scss/styles.scss';
import {
	AddToCartEvent,
	CheckoutSuccessEvent,
	EventsNames,
	OpenCartEvent,
	ProductFetchedEvent,
	ProductPreviewEvent,
	RemoveFromCartEvent,
} from './types/events';
import { CartButton } from './components/View/CartButton';
import { CartCounter } from './components/View/CartCounter';
import { Gallery } from './components/View/Gallery';

/**
 * Получаем все шаблоны
 */
const galleryTemplateId = 'gallery';
const productCardTemplateId = 'card-catalog';
const modalTemplateId = 'modal';
const productModalTemplateId = 'card-preview';
const cartTemplateId = 'basket';
const cartButtonTemplateId = 'card-button';
const cartCounterTemplateId = 'card-counter';
const cartItemTemplateId = 'card-basket';
const checkoutOrderTemplateId = 'order';
const checkoutContactsTemplateId = 'contacts';
const checkoutSuccessTemplateId = 'success';

/**
 * Создаём брокер событий
 */
const events = new EventEmitter();

/**
 * Инициализируем api
 */
const productApi = new ProductApi();
const orderApi = new OrderApi();

/**
 * Создаём модели
 */
const productsModel = new ProductsModel(productApi, events);
new CartModel(events);
new ChekoutModel(orderApi, events);

/**
 * Создаём и добавляем нужные элементы
 */
const modal = new Modal(modalTemplateId, events);
document.body.appendChild(modal.getElement());

const gallery = new Gallery(galleryTemplateId, events);
const cart = new Cart(cartTemplateId, events);
const cartCounter = new CartCounter(cartCounterTemplateId, events);
const cartButton = new CartButton(cartButtonTemplateId, events);
const checkoutOrder = new CheckoutOrder(checkoutOrderTemplateId, events);
const checkoutContacts = new CheckoutContacts(
	checkoutContactsTemplateId,
	events
);
const checkoutSuccess = new CheckoutSuccess(checkoutSuccessTemplateId, events);
const modalProductCart = new ProductModal(productModalTemplateId, events);

/**
 * Заменяем текущие элементы на наши
 */
document
	.querySelector('.header__basket')
	.replaceWith(cartButton.render({ child: cartCounter.render() }));
document
	.querySelector('.gallery')
	.replaceWith(gallery.render({ productCards: [] }));

/**
 * Добавление карточек товара после получения
 */
events.on<ProductFetchedEvent>(EventsNames.PRODUCTS_FETCHED, ({ products }) => {
	const productsEl: HTMLElement[] = [];
	products.map((p) => {
		const card = new ProductCard(productCardTemplateId, events, {
			onClick: () =>
				events.emit<ProductPreviewEvent>(EventsNames.PRODUCT_PREVIEW, {
					product: p,
				}),
		});

		productsEl.push(card.render(p));
	});

	gallery.render({ productCards: productsEl });
});

/**
 * События модалки
 */

// Просмотр товара
events.on<ProductPreviewEvent>(EventsNames.PRODUCT_PREVIEW, ({ product }) => {
	const onAddToCart = () => {
		// Маму не отдадим
		if (!product.price) {
			alert('К сожалению мама у нас только одна, и мы её не отдадим :(');
			return;
		}

		events.emit<AddToCartEvent>(EventsNames.ADD_TO_CART, {
			product: product,
		});
		modal.close();
	};

	modalProductCart.updateButtonClickHandler(onAddToCart);
	modal.render(modalProductCart.render(product));
	modal.open();
});

// Открытие корзины
events.on<OpenCartEvent>(EventsNames.OPEN_CART, ({ cartItems }) => {
	let total = 0;

	const cartItemsViews = cartItems.map((el, i) => {
		total += el.price;
		return new CartItemLine(cartItemTemplateId, events, {
			onRemoveCartItem: () => {
				// Сначала удаляем
				events.emit<RemoveFromCartEvent>(EventsNames.REMOVE_FROM_CART, {
					itemId: el.id,
				});

				// Затем перерендриваем корзину
				events.emit(EventsNames.VIEW_CART);
			},
		}).render({
			cartItem: el,
			index: i + 1,
		});
	});

	modal.render(cart.render({ cartItemsViews, total }));
	modal.open();
});

// Открытие модалки чекаута
events.on(EventsNames.CHECKOUT_STARTED, () => {
	modal.render(checkoutOrder.render());
	modal.open();
});

// Открытие модалки чекаута контакта
events.on(EventsNames.CHECKOUT_ORDER_SUBMITED, () => {
	modal.render(checkoutContacts.render());
	modal.open();
});

// Открытие модалки чекаута успеха
events.on<CheckoutSuccessEvent>(EventsNames.CHECKOUT_SUCCESS, ({ total }) => {
	modal.render(checkoutSuccess.render(total));
	modal.open();
});

// Закрытие модалки чекаута успеха
events.on(EventsNames.CHECKOUT_SUCCESS_CLOSE, () => {
	modal.close();
});

/**
 * Вешаем глобальные обработчики событий
 */
events.on(EventsNames.INIT, () => {
	productsModel.fetchProducts();
});

/**
 * Инициализируем приложение
 */
events.emit(EventsNames.INIT);
