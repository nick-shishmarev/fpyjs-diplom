/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = '1425ca211425ca211425ca21a517020abc114251425ca2173ae0076042bd21cac4b6f26';
  static lastCallback;

  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    this.lastCallback = callback;

    const script = document.createElement('script');
    script.id = 'request-script';

    let url = 'https://api.vk.ru/method/photos.get?'
    const params = `owner_id=${id}&album_id=wall&access_token=${this.ACCESS_TOKEN}&v=5.199`;
    url += params;
    url += `&callback=VK.processData`;
    script.src = url;

    document.body.append(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){

    if ('error' in result) {
      alert('Error: ' + result.error.error_msg);
      return;
    }

    const script = document.querySelector('#request-script')
    script.remove();
    
    const photos = result.response.items;
    const images = [];

    for (const photo of photos) {
      const photoUrls = photo.sizes;  // Список фото разного размера
      const photoUrl = photoUrls[photoUrls.length - 1]; // Последнее в списке фото имеет максимальный размер
      images.push({
        id: photo.id, 
        date: photo.date, 
        url: photoUrl.url})
    }

    this.lastCallback(images);
    this.lastCallback = () => {};
  }
}
