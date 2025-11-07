/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {

    let urlRequest = Yandex.HOST + options.pathRequest;
    const callback = options.callback;
    const method = options.method;
    delete options.pathRequest;
    delete options.callback;
    delete options.method;

    const params = Object.entries(options).map(o => `${o[0]}=${o[1]}`).join('&');

    urlRequest = urlRequest + '?' + params;

    const xhr = new XMLHttpRequest();
    
    try {
        xhr.open(method, urlRequest);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Authorization', localStorage.getItem('ya-token'))

        xhr.addEventListener('load', () => {

            if (xhr.status >= 200 && xhr.status < 300) {
                callback(null, xhr.response);
            }
            else {
                callback(xhr.status, xhr.response);
            }
        })
        xhr.send();
    }
    catch (error) {
        callback('error', error);
    }
};
