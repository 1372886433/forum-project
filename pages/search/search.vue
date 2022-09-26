<template>
	<view>
		<h3 style="margin: 15px 20px;">搜索历史</h3>
		<text v-for="(content, index) in searchHistory" :id="content" class="history-block"
		@click="search(content)">{{content}}</text>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchHistory: [],
				currentInput: ''
			}
		},
		methods: {
			search(content) {
				let index = this.searchHistory.findIndex((element) => element === content);
				//如果搜索历史里已经有该内容了，则将他提到最前，否则在列表最前加入该内容
				if (index !== -1) {
					this.searchHistory.splice(index, 1)
				}
				this.searchHistory.unshift(content);
				uni.setStorageSync('searchHistory', this.searchHistory);
			}
		},
		onNavigationBarButtonTap() {
			this.search(this.currentInput);
		},
		onNavigationBarSearchInputConfirmed() {
			this.search(this.currentInput);
		},
		onNavigationBarSearchInputChanged(e) {
			this.currentInput = e.text;
		}
	}
</script>

<style scoped lang="scss">
	.history-block {
		font-size: 15px;
		display: inline-block;
		margin: 0px 10px 10px 20px;
		padding: 0px 10px;
		border: solid 1px lightgray;
	}
</style>