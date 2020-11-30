const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];
const courses = ['N', 'NW', 'W', 'SW', 'S', 'SE', 'E', 'NE'];

const getBreakpointFromWidth = ( width ) => {
  return breakpoints[ ( width >= 1920 * 1 ) + ( width >= 1280 * 1 ) + ( width >= 960 * 1 ) + ( width >= 600 * 1 ) ];
}

const downloadCsv = (columns, data, name) => {
	let csv = convertToCsv(columns, data);
	
	if (name !== '' && name !== undefined) {
		name = '-' + name;
	} else {
		name = '';
	}

	let element = document.createElement('a');
	element.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
	element.target = '_blank';
	element.download = 'report' + name + '.csv';
	element.click();
	return;
}

const convertToCsv = (columns, data) => {
	let csv = '';

	columns.map((column, index) => {
		csv += column + ((columns.length - 1) === index ? '' : ',');
	});
	csv += "\n";	

	for (let i = 0; i < data.length; i++) {
    if (i % columns.length === 0 && i >= columns.length) {
		csv = csv.substring(0, csv.length - 1);
     	csv += "\n";
	}
    csv += data[i] + ',';
	}
	
	return csv;
}

const getCourse = (degrees) => {
	return courses[ (degrees > 45 * 1) + (degrees > 90 * 1) + (degrees > 135 * 1) + (degrees > 180 * 1) + (degrees > 225 * 1) + (degrees > 270 * 1) + (degrees > 315 * 1)];
}

export {
  getBreakpointFromWidth,
  downloadCsv,
  convertToCsv,
  getCourse,
}
