import throttle from 'lodash/throttle';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.SCREEN_ANIMATION_DELAY_TIMEOUT = 300;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    const screenOverlay = document.querySelector(`.screen__overlay`);
    const formButton = document.querySelector(`.form__button`);
    const chatFooter = document.querySelector(`.chat__footer`);
    let activeElement = this.screenElements[this.activeScreen];
    let beforeActiveElement = this.screenElements[0];

    let changeScreenVisibility = function (item) {
      item.classList.add(`screen--hidden`);
      item.classList.remove(`active`);
    };

    this.screenElements.forEach((screen) => {
      if (screen.classList.contains(`active`)) {
        beforeActiveElement = screen;
      }

      if (beforeActiveElement.classList.contains(`screen--story`) && activeElement.classList.contains(`screen--prizes`)) {
        setTimeout(() => {
          changeScreenVisibility(screen);
        }, this.SCREEN_ANIMATION_DELAY_TIMEOUT);
        screenOverlay.classList.add(`active`);
        beforeActiveElement.classList.add(`screen--hide-content`);

        /* removes screen screenOverlay to have access to the footer in the mobile version on the prizes screen */
        setTimeout(() => {
          screenOverlay.classList.remove(`active`);
          beforeActiveElement.classList.remove(`screen--hide-content`);
        }, this.SCREEN_ANIMATION_DELAY_TIMEOUT);
      } else if (beforeActiveElement.classList.contains(`screen--rules`) && activeElement.classList.contains(`screen--game`)) {
        changeScreenVisibility(screen);
        formButton.classList.add(`form__button-text`);
        chatFooter.classList.add(`chat__footer--game`);
        setTimeout(() => {
          formButton.classList.remove(`form__button-text`);
          chatFooter.classList.remove(`chat__footer--game`);
        }, 500);

      } else {
        changeScreenVisibility(screen);
      }
    });

    if (beforeActiveElement.classList.contains(`screen--story`) && activeElement.classList.contains(`screen--prizes`)) {
      setTimeout(() => {
        this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
      }, this.SCREEN_ANIMATION_DELAY_TIMEOUT);
    } else {
      this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    }

    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
