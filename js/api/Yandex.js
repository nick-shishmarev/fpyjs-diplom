/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken(){
    const yaToken = prompt("Укажите Яндекс-токен");
    localStorage.setItem('ya-token', yaToken);
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
    const obj = {
      'method': 'POST',
      'pathRequest': '/resources/upload',
      'path': encodeURIComponent(path),
      'url': encodeURIComponent(url),
      'callback': callback,
    };

    createRequest(obj);
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    const obj = {
      'method': 'DELETE',
      'pathRequest': '/resources',
      'path': encodeURIComponent(path),
      'callback': callback,
    };

    createRequest(obj);
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    const obj = {
      'method': 'GET',
      'pathRequest': '/resources/files',
      'media_type': 'image',
      'preview_size': 'M',
      'limit': 100,
      'callback': callback,
    };

    createRequest(obj);
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url){
    const link = document.createElement('a');
    link.href = url;
    link.click();
    link.remove();
  }
}
