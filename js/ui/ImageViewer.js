/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {

    this.element = element;
    this.imagesList = this.element.querySelector('.images-list');
    this.image = this.element.querySelector('.image');
    this.row = this.imagesList.querySelector('.row');
    this.selectAll = this.imagesList.querySelector('.select-all');
    this.send = this.imagesList.querySelector('.send');
    this.showFiles = this.imagesList.querySelector('.show-uploaded-files');

    this.registerEvents()
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
 
    this.row.addEventListener('dblclick', (e) => {
      const tag = e.target;
      if (tag.tagName === 'IMG') {
        App.imageViewer.image.src = tag.src;
        tag.classList.toggle('selected');
        this.checkButtonText();
      }
    })

    this.row.addEventListener('click', (e) => {
      const tag = e.target;
      if (tag.tagName === 'IMG') {
        tag.classList.toggle('selected');
        this.checkButtonText();
      }
    })

    this.selectAll.addEventListener('click', () => {
      const images = [...App.imageViewer.row.querySelectorAll('img')];

      if (this.selectAll.textContent === 'Выбрать всё') {
        images.map(image => {
          image.classList.add('selected');
        })
        this.checkButtonText();
      } 
      else {
        images.map(image => {
          image.classList.remove('selected');
        })
        this.checkButtonText();
      }
    })

    this.showFiles.addEventListener('click', () => {
      const modal = App.getModal('filePreviewer');
      modal.open();
      Yandex.getUploadedFiles((err, data) => {
        if (err) {
          alert('Не удалось загрузить' + data);
        }
        App.getModal('filePreviewer').showImages(data.items);
      })
    })

    this.send.addEventListener('click', () => {
      const images = this.imagesList.querySelectorAll('.selected');

      images.forEach(image => image.classList.remove('selected'));
      this.checkButtonText();
      
      const modal = App.getModal('fileUploader');
      modal.open();
      modal.showImages(images);
    })
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    App.imageViewer.row.innerHTML = '';
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    const selectAll = App.imageViewer.imagesList.querySelector('.select-all');

    if (images.length > 0) {
      selectAll.classList.remove('disabled');
    } 
    else {
      selectAll.classList.add('disabled');
    }

    const imgSrcs = [...images].map(image => 
      `<div class='four wide column ui medium image-wrapper'><img src="${image.url}" /></div>`).join('');

    App.imageViewer.row.insertAdjacentHTML('afterbegin', imgSrcs);
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText(){
    const images = [...App.imageViewer.row.querySelectorAll('img')];

    if (images.every(image => image.className.includes('selected'))) {
      this.selectAll.textContent = 'Снять выделение';
    }
    else {
      this.selectAll.textContent = 'Выбрать всё';
    }

    if (images.some(image => image.className.includes('selected'))) {
      this.send.classList.remove('disabled');
    }
    else {
      this.send.classList.add('disabled');
    }
  }
}