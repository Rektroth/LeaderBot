exports.formatTime = function(time) {
	if (time > 3600) {
		const h = Math.floor(time / 3600);
		const m = Math.floor(time / 60) - (h * 60);
		const s = time % 60;
		
		var minutes;
		var seconds;
		
		if (m < 10) {
			minutes = "0" + m;
		} else {
			minutes = m;
		}
		
		if (s < 10) {
			seconds = "0" + s;
		} else {
			seconds = s;
		}
		
		return h + ":" + minutes + ":" + seconds;
	} else if (time > 60) {
		var m = Math.floor(time / 60);
		var s = time % 60;
		
		if (s < 10) {
			return m + ":0" + s;
		} else {
			return m + ":" + s;
		}
	} else {
		return time + "s";
	}
};

exports.formatDate = function(date) {
	const m = Number(date.substring(5, 7));
	const d = date.substring(8, 10);
    
    const months = [
        "January",
        "Februrary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
	
	var year = date.substring(0, 4);
	var month = months[m];
	
	if (d % 10 == 1 && d != 11) {
		var day = `${d}st`;
	} else if (d % 10 == 2 && d != 12) {
		var day = `${d}nd`;
	} else if (d % 10 == 3 && d != 13) {
		var day = `${d}rd`;
	} else {
		var day = `${d}th`;
	}
    
    return `${month} ${day}, ${year}`;
}

exports.messageColor = "#0F7A4D";