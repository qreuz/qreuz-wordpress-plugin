const { render, useState } = wp.element;

export default function QreuzAjax(action,form,props,params) {

	const handleAjaxSuccess = (res) => {
		setDoingAjax(false);
		setResponse(res);
	}

	const handleAjaxError = (err) => {
		setDoingAjax(false);
		setError(true);
		setResponse(err);
	}

	const ajaxObjBase = {
		action: action,
		qreuz_current_time: new Date().toLocaleTimeString(),
		_wpnonce: qreuzEnv._wpnonce,
		_wp_http_referer: qreuzEnv._wp_http_referer,
		form: form
	}

	const ajaxObj = {...ajaxObjBase}

	if ( params !== undefined ) {

		ajaxObj['data'] = JSON.stringify(params);

	}
	
	async function doAjax() {		

		var postBody = [];

		for (var property in ajaxObj) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(ajaxObj[property]);
			postBody.push(encodedKey + "=" + encodedValue);
			}
		postBody = postBody.join("&");

		const response = await fetch(qreuzEnv._wp_ajax_url, {
			method: "POST",
			body: postBody,
			headers:{
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			}
		})
		.then(res => {
			if(res.ok) {
				return res.json();
			} else {
				throw new Error('Server response was not OK');
			}
		})
		.then(data => {
				return data.response;
		});

		return ( response != undefined ? response : '{"error":"response undefined"}');
	}

	return doAjax();
}
