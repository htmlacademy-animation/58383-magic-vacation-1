export default () => {
  const screenStory = document.querySelector(`.screen--story`);

  document.addEventListener(`DOMContentLoaded`, function () {

    function callback(mutations) {

      mutations.forEach((mutation) => {
        if (mutation.type === `attributes`) {
          if (mutation.target.classList.contains(`active`)) {
            if (mutation.target.style.backgroundImage === `url("img/slide1.jpg"), linear-gradient(rgba(83, 65, 118, 0) 0%, rgb(82, 62, 117) 16.85%)` || mutation.target.style.backgroundImage === `url("img/slide1.jpg")`) {
              document.documentElement.style.setProperty(`--menuLinkColor`, `#5f458c`);
              document.documentElement.style.setProperty(`--socialBlockTogglerColor`, `#a67ee5`);
            } else if (mutation.target.style.backgroundImage === `url("img/slide2.jpg"), linear-gradient(rgba(45, 54, 179, 0) 0%, rgb(42, 52, 176) 16.85%)` || mutation.target.style.backgroundImage === `url("img/slide2.jpg")`) {
              document.documentElement.style.setProperty(`--menuLinkColor`, `#a0ceff`);
              document.documentElement.style.setProperty(`--socialBlockTogglerColor`, `#3e72ee`);
            } else if (mutation.target.style.backgroundImage === `url("img/slide3.jpg"), linear-gradient(rgba(92, 138, 198, 0) 0%, rgb(81, 131, 196) 16.85%)` || mutation.target.style.backgroundImage === `url("img/slide3.jpg")`) {
              document.documentElement.style.setProperty(`--menuLinkColor`, `#3e72ee`);
              document.documentElement.style.setProperty(`--socialBlockTogglerColor`, `#a0ceff`);
            } else {
              document.documentElement.style.setProperty(`--menuLinkColor`, `#a67ee5`);
              document.documentElement.style.setProperty(`--socialBlockTogglerColor`, `#5f458c`);
            }
          } else {
            document.documentElement.style.setProperty(`--menuLinkColor`, `#a67ee5`);
            document.documentElement.style.setProperty(`--socialBlockTogglerColor`, `#5f458c`);
          }
        }
      });
    }

    let observer = new MutationObserver(callback);

    const config = {
      attributes: true,
      attributeFile: [`class`, `style`]
    };

    observer.observe(screenStory, config);
  });
};
