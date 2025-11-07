/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    this.element = element;

    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents(){
    const user = this.element.querySelector('input');
    const replace = this.element.querySelector('.replace');
    const add = this.element.querySelector('.add');

    replace.onclick = () => {
      App.imageViewer.clear();
      VK.get(user.value, App.imageViewer.drawImages);
    }

    add.onclick = () => {
      VK.get(user.value, App.imageViewer.drawImages);
    }
  }
}