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
				url = url + '?' + _params;
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

	/**
	 * 对象转成 url 查询字符串
	 * @param {*} obj 
	 * @returns string like 'a=1&b=2'
	 */
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

/**
1. 通过改 BASE_URL 更换调用的接口，网络上找测试用 API；
2. GET 方法测试没问题，POST 方法未测
3. 从公司项目的 ts 代码改写而来。用 ts 做类似封装，需要动用“类”的概念，将它定义为一个单例，然后添加静态属性、方法，权限控制方面用 private、public 关键字控制。对于JS 来说，封装由闭包实现，具体来说，先开启一个函数作用域，如function(){ // 开启了一个函数作用域 }，函数内部实现功能逻辑，函数最后只返回供外界调用的方法，执行这个函数，并把结果赋给一个变量HTTPHelper，调用这个 HTTPHelper 对象的 GET、POST 方法就能分别发起不同请求。
4. JS 怎么把这个 HTTPHelper 导出来供其他地方使用？
 */