/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.modal = this;

    this.timesIcon = this.elementDOM.querySelector('.x');
    this.closeBtn = this.elementDOM.querySelector('.close');
    this.sendAllBtn = this.elementDOM.querySelector('.send-all');
    this.contentArea = this.elementDOM.querySelector('.content');

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
    this.contentArea.onclick = (e) => {
      const btn = e.target.closest('.button');
      const inputBlock = e.target.closest('.input')

      if (e.target.tagName === 'INPUT') {
        inputBlock.classList.remove('error');
      }
      
      if (btn) {
        const image = e.target.closest('.image-preview-container');
        this.sendImage(image);
      }
    }

    this.closeBtn.onclick = (e) => {
      this.contentArea.innerHTML = '';
      this.close();
    }

    this.timesIcon.onclick = (e) => {
      this.contentArea.innerHTML = '';
      this.close();
    }

    this.sendAllBtn.onclick = (e) => {
      this.sendAllImages();
    }
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна 
   */
  showImages(images) {
    const imgSrcs = [...images].map(image => this.getImageHTML(image.src)).join('');
    this.contentArea.insertAdjacentHTML('afterbegin', imgSrcs);
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `<div class="image-preview-container">
      <img src="${item}" />
      <div class="ui action input">
        <input type="text" placeholder="Путь к файлу">
        <button class="ui button"><i class="upload icon"></i></button>
      </div>
    </div>`;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    const images = this.contentArea.querySelectorAll('.image-preview-container');
    images.forEach(image => {
      this.sendImage(image);
    })
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const path = imageContainer.querySelector('input').value.trim();
    const inputBlock = imageContainer.querySelector('.input');

    if (path === '') {
      inputBlock.classList.add('error');
      return;
    }

    inputBlock.classList.add('disabled');
    const urlImg = imageContainer.querySelector('img').src;

    Yandex.uploadFile(path, urlImg, (err, data) => {
      if (err) {
        inputBlock.classList.add('error');
        inputBlock.classList.remove('disabled');
        return;
      }

      imageContainer.remove();

      if ([...this.contentArea.querySelectorAll('img')].length === 0) {
        this.close();
      }
    })
  }
}