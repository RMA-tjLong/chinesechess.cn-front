document.write('<script type="text/javascript" src="/js/common.js"></script>');
document.write('<script type="text/javascript" src="/js/chinese-chess/board.js"></script>');
document.write('<script type="text/javascript" src="/js/chinese-chess/piece.js"></script>');

window.onload = function() {
	screen.init();
	board.init();

	let self = 'black';
	piece.init(self);
};
