const screen = {
	// 屏幕宽度
	W: 0,
	// 屏幕高度
	H: 0,
	
	// 初始化屏幕宽高
	init : function() {
		this.W = document.body.clientWidth;
		this.H = document.body.clientHeight;
	}
};