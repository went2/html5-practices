const HttpHelper = (function () {
    const BASE_URL = "https://api.publicapis.org/entries";
  
    const _request = function ({
      method = "GET",
      url,
      params = {},
      headers = {}
    }) {
      // 验证 url 格式
      if (!/^https?:\/\//.test(url)) {
        // url = BASE_URL + url;
        url = BASE_URL;
      }
  
      // 处理 params 与 headers
      let _headers = {}, _params = {};
      _headers["Content-Type"] = "application/x-www-form-urlencoded";
  
      // 覆盖 headers
      for (let key in headers) {
        _headers[key] = headers[key];
      }
  
      if (_headers["Content-Type"] === "application/json") {
        _params = JSON.stringify(params);
      } else {
        // 手动序列化：对象转为 url 查询字符串
        _params = _objToParams(params);
        
        if (method === "GET" && _params) {
          url = url +  '?' + _params;
        }
      }
  
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.responseType = "text";
        request.open(method, url);
        for (let key in _headers) {
          request.setRequestHeader(key, _headers[key]);
        }
  
        if (method === "GET") {
          request.send(null);
        } else {
          request.send(_params);
        }
  
        request.addEventListener("load", (evt) => {
					// evt 是 XMLHttpRequestEvent 对象
          const res = evt.currentTarget;
          resolve(res);
        });
  
        request.addEventListener("loadend", (evt) => {
          const res = evt.currentTarget;
          reject(res);
        });
      });
    };

    const _objToParams = function (obj) {
        let str = '';
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                str += `${key}=${obj[key]}&`;
            }
        }
        return str.substring(0, str.length - 1);
    }
  
    const _reqResultHandler = function (res) {
			// res 是 XMLHttpRequestEventTarget 对象
			// 数据在 res.response 中
      try {
        if (res && res.response) {
          const result = JSON.parse(res.response);
					return result;
  
          // if (result.code === 0) {
          //   return result.data;
          // } else {
          //   return Promise.reject(res);
          // }
        }
      } catch (e) {
        return Promise.reject(e);
      }
    };
  
    const _reqErrorHandler = function (err) {
      throw err;
    };
  
    const POST = async function (
      url,
      params = {},
      headers = { "Content-Type": "application/json" }
    ) {
      try {
        const res = await _request({
          method: "POST",
          url,
          params,
          headers
        });
        return _reqResultHandler(res);
      } catch (err) {
        return _reqErrorHandler(err);
      }
    };
  
    const GET = async function (url, params = {}) {
      try {
        const res = await _request({ url, params });
        return _reqResultHandler(res);
      } catch (err) {
        return _reqErrorHandler(err);
      }
    };
  
    return {
      POST,
      GET
    };
  })();

  HttpHelper.GET().then((res) => {
		console.log('==>success, res:', res)
	}).catch((e) => {
		console.log('==>failed', e)
	}) 