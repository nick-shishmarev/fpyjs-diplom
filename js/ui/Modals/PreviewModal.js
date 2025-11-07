/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.modal = this;

    this.timesIcon = this.elementDOM.querySelector('.x');
    this.contentArea = this.elementDOM.querySelector('.content');

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.contentArea.onclick = (e) => {
      const btnDel = e.target.closest('.delete');
      const btnDownload = e.target.closest('.download');

      if (btnDel) {
        e.target.className = 'icon spinner loading';
        btnDel.classList.add('disabled')
        const image = e.target.closest('.image-preview-container');
        console.log(image);
        Yandex.removeFile(btnDel.dataset.path, (err, data) => {
          if (err) {
            alert("Error: " + data)
            return;
          }
          image.remove();
        });
        return;
      }

      if (btnDownload) {
        const image = e.target.closest('.image-preview-container');
        Yandex.downloadFileByUrl(btnDownload.dataset.file);
        return;
      }
    }

    this.timesIcon.onclick = (e) => {
      this.contentArea.innerHTML = '<i class="asterisk loading icon massive"></i>';
      this.close();
    }
  }


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    const imgSrcs = data.reverse().map(image => this.getImageInfo(image)).join('');
    this.contentArea.querySelector('.asterisk').remove();
    this.contentArea.insertAdjacentHTML('afterbegin', imgSrcs);
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", 
            "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const imgDate = new Date(date);
    const month = imgDate.getMonth();
    return `${imgDate.getDate()} ${months[month]} ${imgDate.getFullYear()} г. в ${imgDate.getHours()}:${imgDate.getMinutes()}} `
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    const urlImg = item.preview;
    const nameImg = item.name;
    const dateImg = item.created;
    const sizeImg = item.size;
    const pathImg = item.path;
    const linkImg = item.file;

    return `<div class="image-preview-container">
      <img src="${urlImg}" />
      <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${nameImg}</td><td>${this.formatDate(dateImg)}</td><td>${sizeImg}Кб</td></tr>
        </tbody>
      </table>
      <div class="buttons-wrapper">
        <button class="ui labeled icon red basic button delete" data-path="${pathImg}">
          Удалить
          <i class="trash icon"></i>
        </button>
        <button class="ui labeled icon violet basic button download" data-file="${linkImg}">
          Скачать
          <i class="download icon"></i>
        </button>
      </div>
    </div>`;
  }
}
