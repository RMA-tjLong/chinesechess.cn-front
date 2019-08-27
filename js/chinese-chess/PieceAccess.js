const pieceAccess = {
	// 判断落子
	get : function(obj, side) {
		let accessPoint = [];
		if (Object.prototype.toString.call(obj) != '[object Array]' && Object.prototype.toString.call(obj) != '[object NodeList]') {
			obj = [obj];
		}

		obj.forEach(function(idx, i) {
			let enText = piece.getEnText(idx.text);
			accessPoint.push.apply(accessPoint, pieceAccess.default(enText, idx.x, idx.y, side));
		});

		return this.checkRemove(accessPoint, side);
	},

	// 判断默认可落子点
	default : function(en, x, y, side) {
		x = parseInt(x);
		y = parseInt(y);
		let point = [];
		let allArr = Array.prototype.slice.call(piece.selfArr).concat(Array.prototype.slice.call(piece.oppositeArr));

		switch (en) {
			case 'zu' : {
				if (side == 'self') { // 己方执子判断
					if (y > 4) { // 未过河
						point.push([x, y - 1]);
					} else { // 已过河
						point.push([x, y - 1], [x - 1, y], [x + 1, y]);
					}
				}

				if (side == 'oppo') { // 对方执子判断
					if (y < 5) {
						point.push([x, y + 1]);
					} else {
						point.push([x, y + 1], [x - 1, y], [x + 1, y]);
					}
				}

				break;
			}

			case 'pao' : {
				let res = this.straightLimit(x, y, allArr);
				point = res[0];
				let xArr = res[1], yArr = res[2];
				let xCheck1 = [-1, -1], yCheck1 = [-1, -1];
				let xCheck2 = [50, 50], yCheck2 = [50, 50];
				let noPoint = [];

				point.forEach(function(idx, i) {
					if (idx[1] == y && (pointIdx = point.findIndex(item => (item == idx && xArr.findIndex(item => idx[0] == item.x && idx[1] == item.y) != -1))) != -1) {
						noPoint.push(point[pointIdx]);

						xArr.forEach(function(xIdx, j) {
							if (xIdx.x < point[pointIdx][0] && point[pointIdx][0] < x && xIdx.x > xCheck1[0]) {
								xCheck1[0] = parseInt(xIdx.x);
								xCheck1[1] = parseInt(xIdx.y);
							}

							if (xIdx.x > point[pointIdx][0] && point[pointIdx][0] > x && xIdx.x < xCheck2[0]) {
								xCheck2[0] = parseInt(xIdx.x);
								xCheck2[1] = parseInt(xIdx.y);
							}
						});
					}

					if (idx[0] == x && (pointIdx = point.findIndex(item => (item == idx && yArr.findIndex(item => idx[0] == item.x && idx[1] == item.y) != -1))) != -1) {
						noPoint.push(point[pointIdx]);

						yArr.forEach(function(yIdx, j) {
							if (yIdx.y < point[pointIdx][1] && point[pointIdx][1] < y && yIdx.y > yCheck1[1]) {
								yCheck1[0] = parseInt(yIdx.x);
								yCheck1[1] = parseInt(yIdx.y);
							}

							if (yIdx.y > point[pointIdx][1] && point[pointIdx][1] > y && yIdx.y < yCheck2[1]) {
								yCheck2[0] = parseInt(yIdx.x);
								yCheck2[1] = parseInt(yIdx.y);
							}
						});
					}
				});

				noPoint.forEach(function(idx, i) {
					point.splice(point.findIndex(item => item == idx), 1);
				});
				
				point.push(xCheck1, xCheck2, yCheck1, yCheck2);
				break;
			}

			case 'ju' : {
				let res = this.straightLimit(x, y, allArr);
				point = res[0];

				break;
			}

			case 'ma' : {
				let noPoint = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]; // 有可能“别马腿”的点
				noPoint = this.removeLimit(noPoint, allArr); // 删除“别马腿”的点
				noPoint.forEach(function(idx, i) { // 通过没“别马腿”的点添加合法走子点
					if (idx[0] == x - 1 && idx[1] == y) {
						point.push([x - 2, y - 1], [x - 2, y + 1]);
					}

					if (idx[0] == x + 1 && idx[1] == y) {
						point.push([x + 2, y - 1], [x + 2, y + 1]);
					}

					if (idx[0] == x && idx[1] == y - 1) {
						point.push([x - 1, y - 2], [x + 1, y - 2]);
					}

					if (idx[0] == x && idx[1] == y + 1) {
						point.push([x - 1, y + 2], [x + 1, y + 2]);
					}
				});

				break;
			}

			case 'xiang' : {
				let noPoint = [[x - 1, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y + 1]]; // 有可能“别象腿”的点
				noPoint = this.removeLimit(noPoint, allArr); // 删除“别象腿”的点
				noPoint.forEach(function(idx, i) { // 通过没“别象腿”的点添加合法走子点
					if (idx[0] == x - 1 && idx[1] == y - 1) {
						point.push([x - 2, y - 2]);
					}

					if (idx[0] == x - 1 && idx[1] == y + 1) {
						point.push([x - 2, y + 2]);
					}

					if (idx[0] == x + 1 && idx[1] == y - 1) {
						point.push([x + 2, y - 2]);
					}

					if (idx[0] == x + 1 && idx[1] == y + 1) {
						point.push([x + 2, y + 2]);
					}
				});

				point = this.riverLimit(point, side);

				break;
			}

			case 'shi' : {
				let arr = [[x - 1, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y + 1]];
				arr = this.palaceLimit(arr, side);

				arr.forEach(function(idx, i) {
					point.push(idx);
				});

				break;
			}

			case 'shuai' : {
				let arr = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
				arr = this.palaceLimit(arr, side);

				arr.forEach(function(idx, i) {
					point.push(idx);
				});

				break;
			}
		}

		return point;
	},

	// “宫”限制（将士不出宫）
	palaceLimit : function(arr, side) {
		for (let i = 0; i < arr.length; i++) {
			if (side == 'self' && (arr[i][0] < 3 || arr[i][0] > 5 || arr[i][1] < 7 || arr[i][1] > 9)) {
				arr.splice(i--, 1);
			}

			if (side == 'oppo' && (arr[i][0] < 3 || arr[i][0] > 5 || arr[i][1] > 2)) {
				arr.splice(i--, 1);
			}
		}

		return arr;
	},

	// “象”限制（不能过河）
	riverLimit : function(point, side) {
		point.forEach(function(idx, i) {
			if (side == 'self' && idx[1] < 5) { // 己方
				point.splice(point.findIndex(item => item == idx), 1);
			}

			if (side == 'oppo' && idx[1] > 4) { // 对方
				point.splice(point.findIndex(item => item == idx), 1);
			}
		});

		return point;
	},

	// 判断不合法的默认子
	checkRemove : function(point, side) {
		if (side == 'self') {
			return this.removeLimit(this.removeOut(point), piece.selfArr);
		}

		if (side == 'oppo') {
			return this.removeLimit(this.removeOut(point), piece.oppositeArr);
		}
	},

	// 车炮走直线，返回备选子、横轴上存在的所有子、纵轴上存在的所有子
	straightLimit : function(x, y, allArr) {
		let point = [];
		let xArr = []; // 所选子所处横轴上存在的所有棋子（除所选子）
		let yArr = []; // 所选子所处纵轴上存在的所有棋子（除所选子）

		for (i = 0; i < 9; i++) {
			if (i != x) {
				point.push([i, y]);
			}
		}

		for (i = 0; i < 10; i++) {
			if (i != y) {
				point.push([x, i]);
			}
		}

		allArr.forEach(function(idx, i) {
			if ((idx.x != x && idx.y != y) || (idx.x == x && idx.y == y)) return true;

			if (idx.y == y) xArr.push(idx);
			if (idx.x == x) yArr.push(idx);
		});

		xArr.forEach(function(idx, i) {
			if (idx.x < x) {
				for (j = 0; j < point.length; j++) {
					if (point[j][0] < idx.x) {
						point.splice(j--, 1);
					}
				}
			}
			if (idx.x > x) {
				for (j = 0; j < point.length; j++) {
					if (point[j][0] > idx.x) {
						point.splice(j--, 1);
					}
				}
			}
		});

		yArr.forEach(function(idx, i) {
			if (idx.y < y) {
				for (j = 0; j < point.length; j++) {
					if (point[j][1] < idx.y) {
						point.splice(j--, 1);
					}
				}
			}
			if (idx.y > y) {
				for (j = 0; j < point.length; j++) {
					if (point[j][1] > idx.y) {
						point.splice(j--, 1);
					}
				}
			}
		});

		return [point, xArr, yArr];
	},

	// 移除已出界的点
	removeOut : function(point) {
		for (let i = 0; i < point.length; i++) {
			let idx = point[i];

			if (idx[0] > 8 || idx[0] < 0 || idx[1] > 9 || idx[1] < 0) {
				point.splice(i--, 1);
			}
		}

		return point;
	},

	// 备选点上不能存在限制棋子（己方棋子/别马、象腿的棋子）
	removeLimit : function(point, arr) {
		arr.forEach(function(arrIdx , j) {
			let idx = point.findIndex(item => item[0] == arrIdx.x && item[1] == arrIdx.y);
			if (idx != -1) {
				point.splice(idx, 1);
			}
		});

		return point;
	},

	// 判断将军
	chessCheck : function(side) {
		let allArr = Array.prototype.slice.call(piece.selfArr).concat(Array.prototype.slice.call(piece.oppositeArr));

		if (side == 'self') {
			let accessPoint = this.straightLimit(piece.oppoKingObj.x, piece.oppoKingObj.y, allArr)[0];
			accessPoint.forEach(function(idx, i) {
				let noPointIdx = accessPoint.findIndex(item => item[0] != piece.oppoKingObj.x);
				if (noPointIdx != -1) {
					accessPoint.splice(noPointIdx, 1);
				}
			});

			accessPoint.push.apply(accessPoint, this.get(piece.oppositeArr, 'oppo'));
			if (accessPoint.findIndex(item => item[0] == piece.selfKingObj.x && item[1] == piece.selfKingObj.y) != -1) {
				return true;
			} else {
				return false;
			}
		}

		if (side == 'oppo') {
			let accessPoint = this.straightLimit(piece.selfKingObj.x, piece.selfKingObj.y, allArr)[0];
			accessPoint.forEach(function(idx, i) {
				let noPointIdx = accessPoint.findIndex(item => item[0] != piece.selfKingObj.x);
				if (noPointIdx != -1) {
					accessPoint.splice(noPointIdx, 1);
				}
			});
			
			accessPoint.push.apply(accessPoint, this.get(piece.selfArr, 'self'));
			if (accessPoint.findIndex(item => item[0] == piece.oppoKingObj.x && item[1] == piece.oppoKingObj.y) != -1) {
				return true;
			} else {
				return false;
			}
		}
	},

	// 是否绝杀
	isKill : function() {
		let iKill = true; // 是否准绝杀

		// 判断对方每个棋子走子后是否还会被将军，如果所有走子可能都会被将军则绝杀
		piece.oppositeArr.forEach(function(idx1, i) {
			let x = idx1.x;
			let y = idx1.y;

			pieceAccess.get(idx1, 'oppo').forEach(function(idx2, j) {
				piece.setX(idx1, idx2[0]);
				piece.setY(idx1, idx2[1]);
				let selfItem = '';

				if ((selfIdx = Array.prototype.slice.call(piece.selfArr).findIndex(item => item.x == idx2[0] && item.y == idx2[1])) != -1) { // 被吃子情况
					selfItem = piece.selfArr[selfIdx];
					document.getElementById('chinese-chess-board').removeChild(piece.selfArr[selfIdx]);
				}

				if (!pieceAccess.chessCheck('oppo')) {
					iKill = false;
				}

				if (selfItem) {
					document.getElementById('chinese-chess-board').appendChild(selfItem);
				}

				piece.setX(idx1, x);
				piece.setY(idx1, y);

				return iKill;
			});

			return iKill;
		});

		return iKill;
	},

	// 显示可落子的点
	show : function(accessPoint) {
		accessPoint.forEach(function(idx, i) {
			let obj = document.createElement('div');
			obj.id = 'access-' + i;
			obj.classList.add('access-point');
			obj.setAttribute('name', 'accessPoint');
			obj.setAttribute('data-x', idx[0]);
			obj.setAttribute('data-y', idx[1]);

			document.getElementById('chinese-chess-board').appendChild(obj);
		});

		let accessPointArr = document.getElementsByName('accessPoint');

		accessPointArr.forEach(function(idx, i) {
			piece.initObj(idx, idx.getAttribute('data-x'), idx.getAttribute('data-y'));
			idx.addEventListener('click', function(e) {
				let pieceObj = document.getElementById('chinese-chess-board').getElementsByClassName('active')[0];

				// 未走子前的位置
				let x = pieceObj.x;
				let y = pieceObj.y;

				// 走子
				piece.setX(pieceObj, this.x);
				piece.setY(pieceObj, this.y);
				piece.clearActive();

				// 判断己方是否被照将
				if (pieceAccess.chessCheck('self')) {
					piece.setX(pieceObj, x);
					piece.setY(pieceObj, y);
					warning.showWarning('不能送将，请变招', false); // 显示提示
					return false;
				}

				if ((oppoIdx = Array.prototype.slice.call(piece.oppositeArr).findIndex(item => item.x == this.x && item.y == this.y)) != -1) { // 对方被吃子
					warning.showWarning('吃', true);
					document.getElementById('chinese-chess-board').removeChild(piece.oppositeArr[oppoIdx]);
				}

				// 判断对方是否被将军
				if (pieceAccess.chessCheck('oppo')) { // 对方被将军
					// 判断是否绝杀
					if (pieceAccess.isKill()) { // 绝杀，对局结束
						warning.showWarning('绝杀', true);
					} else { // 将军，播放将军动画
						warning.showWarning('将', true);	
					}
				}
			});
		});
	}
};