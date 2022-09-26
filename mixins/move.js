export default {
	methods: {
		moveToOtherPage(suffix, ifRedirect=false, data={}) {
			var url = '/pages/' + suffix + '/' + suffix;
			if (data !== {}) url = url + '?';
			for (let key in data) {
				url = url + key + '=' + data[key] + '&';
			}
			if (data !== {}) url = url.slice(0, url.length - 1);
			if (ifRedirect){
				uni.redirectTo({
					url
				});
			}else {
				uni.navigateTo({
					url
				});
			}
		}
	}
}