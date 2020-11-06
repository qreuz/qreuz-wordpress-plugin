export function QreuzTrackerAjax() {

	const ajaxObjBase = {
		action: 'qreuz_track_pageview',
		_wpnonce: qreuzEnv._wpnonce,
		_wp_http_referer: qreuzEnv._wp_http_referer,
	}

	const ajaxObj = {...ajaxObjBase}

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
				return false;
			}
		})
		.then(data => {
				return data.response;
		});

		return ( response != undefined ? response : false );
	}

	return doAjax();
}
