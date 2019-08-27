document.write('<script type="text/javascript" src="/js/chinese-chess/pieceAccess.js"></script>');
document.write('<script type="text/javascript" src="/js/chinese-chess/warning.js"></script>');

const piece = {
	// 己方棋色
	self : '',
	// 己方回合
	selfRound : true,
	// 己方执子元素对象
	selfArr : [],
	// 对方执子元素对象
	oppositeArr : [],
	// 红棋
	redName : ['俥','傌','相','仕','帅','仕','相','傌','俥','炮','炮','卒','卒','卒','卒','卒'],
	// 黑棋
	blackName : ['車','馬','象','士','将','士','象','馬','車','砲','砲','兵','兵','兵','兵','兵'],
	// 己方王对象
	selfKingObj : '',
	// 对方王对象
	oppoKingObj : '',

	// 获取棋子英文名
	getEnText : function(text) {
		if (text == '卒' || text == '兵') return 'zu';
		if (text == '炮' || text == '砲') return 'pao';
		if (text == '俥' || text == '車') return 'ju';
		if (text == '傌' || text == '馬') return 'ma';
		if (text == '相' || text == '象') return 'xiang';
		if (text == '仕' || text == '士') return 'shi';
		if (text == '帅' || text == '将') return 'shuai';
	},

	// 初始化棋子、己方所执棋色、己方回合、棋子位置、棋子事件监听
	init : function(self) {
		this.self = self; // 执子色初始化
		this.selfRound = (self == 'red') ? true : false; // 回合初始化

		this.redName.forEach(function(idx, i) {
			let obj = document.createElement('div');
			obj.classList.add('pieces', 'red');
			obj.setAttribute('name', 'redPieces');
			obj.innerText = idx;

			if (idx == '帅') {
				obj.id = 'red-king';
			} else {
				obj.id = 'red-' + i;
			}

			document.getElementById('chinese-chess-board').appendChild(obj);
		});

		this.blackName.forEach(function(idx, i) {
			let obj = document.createElement('div');
			obj.classList.add('pieces', 'black');
			obj.setAttribute('name', 'blackPieces');
			obj.innerText = idx;

			if (idx == '将') {
				obj.id = 'black-king';
			} else {
				obj.id = 'black-' + i;
			}

			document.getElementById('chinese-chess-board').appendChild(obj);
		});

		this.initPos(); // 位置初始化
		this.addListener(); // 监听初始化
	},

	// 初始化棋子位置
	initPos : function() {
		this.selfArr = document.getElementsByName(this.self + 'Pieces');
		this.oppositeArr = document.getElementsByName(((this.self == 'red') ? 'black' : 'red') + 'Pieces');
		this.oppoKingObj = this.self == 'red' ? document.getElementById('black-king') : document.getElementById('red-king');
		this.selfKingObj = this.self == 'red' ? document.getElementById('red-king') : document.getElementById('black-king');

		for (i = 0; i < 16; i++) {
			if (i < 9) {
				this.initObj(this.oppositeArr[i], i, 0);
				this.initObj(this.oppositeArr[0], 3, 3);
				this.initObj(this.selfArr[i], i, 9);
			} else if (i == 9) {
				this.initObj(this.oppositeArr[i], 1, 2);
				this.initObj(this.selfArr[i], 1, 7);
			} else if (i == 10) {
				this.initObj(this.oppositeArr[i], 7, 2);
				this.initObj(this.selfArr[i], 7, 7);
			} else {
				this.initObj(this.oppositeArr[i], (i - 11) * 2, 3);
				this.initObj(this.selfArr[i], (i - 11) * 2, 6);
			}
		}
	},

	// 初始化元素对象
	initObj : function(obj, x, y) {
		obj.text = obj.innerText;

		this.setX(obj, x);
		this.setY(obj, y);
	},

	// 设置棋子x轴属性及偏移
	setX : function(obj, x) {
		obj.x = x;
		obj.style.left = (x * board.xPixelInterval + board.xInitial) + 'px';
	},

	// 设置棋子y轴属性及偏移
	setY : function(obj, y) {
		obj.y = y;
		obj.style.top = (y * board.yPixelInterval + board.yInitial) + 'px';
	},

	// 棋子点击事件监听
	addListener : function() {
		for (i = 0; i < 16; i++) {
			this.selfArr[i].addEventListener('click', function(e) {
				piece.clearActive();

				if (!this.classList.contains('active')) { // 如果所选棋子未曾被选中
					this.classList.add('active'); // 添加选中状态
					pieceAccess.show(pieceAccess.get(this, 'self')); // 获得并显示可落子的点
				}
			});
		}
	},

	// 清除棋子选中状态
	clearActive : function() {
		let activeObj = document.getElementById('chinese-chess-board').getElementsByClassName('active');
		if (activeObj.length) {
			activeObj[0].classList.remove('active');
			let accessPointArr = document.getElementsByName('accessPoint');
			for (let i = 0; i < accessPointArr.length; i++) { // 清空
				accessPointArr[i--].remove();
			}
		}
	}
}