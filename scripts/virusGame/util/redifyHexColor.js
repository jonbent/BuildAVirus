module.exports = (color, percent) => {
  	const num = parseInt(color,16),
		amt = Math.round(-1 * Math.round(percent / 500000)),
		R = (num >> 16) + amt,
		B = (num >> 8 & 0x00FF) + amt,
		G = (num & 0x0000FF) - amt;

		return "#" + (0x1000000 + (R<221?R<1?0:R:221)*0x10000 + (B<26?B<1?0:B:26)*0x100 + (G<28?G<1?0:G:28)).toString(16).slice(1);
};
221,28,26