const board = {
	// x轴偏移修正
	xInitial : 0,
	// y轴偏移修正
	yInitial : 0,
	// x轴步长间距
	xPixelInterval : 0,
	// y轴步长间距
	yPixelInterval : 0,

	// 棋盘初始化
	init : function() {
		if (screen.W >= 1320) {
			this.xInitial = -9;
			this.yInitial = -9;
			this.xPixelInterval = 82;
			this.yPixelInterval = 79;
		} else if (screen.W >= 900) {
			this.xInitial = -6;
			this.yInitial = -10;
			this.xPixelInterval = 70;
			this.yPixelInterval = 68;
		} else {
			this.xInitial = -5;
			this.yInitial = -10;
			this.xPixelInterval = 52;
			this.yPixelInterval = 51;
		}
	}
};