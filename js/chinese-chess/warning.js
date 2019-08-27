const warning = {
	// 棋盘提示
	showWarning : function(text, isAnimate) {
		let obj = document.getElementById('warning-box');
		obj.innerText = text;

		if (isAnimate) { // 以动画形式警告（将、吃、绝杀）
			obj.classList.add('warning-animate');
		} else { // 以文本形式警告（走子送将，请变招）
			obj.classList.add('warning-label');
		}

		setTimeout(function() {
			obj.classList.remove('warning-label');
			obj.classList.remove('warning-animate');
		}, 900);
	}
};