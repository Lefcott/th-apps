import * as XLSX from 'xlsx';

/**
 * Processes a set of data and builds a CSV or XLSX file.
 * Configuration object is used to help sort the data, rename headers, and
 * filter out data thats not needed/wanted.
 *
 * Optionally, if skipFileWrite is true, it will skip writing the file
 *
 * Configuration file should have structure like:
 * {
 *  'fieldKey': {
 *    order: integer,
 *    label: 'Updated header label',
 *  }
 * }
 * If the field is not included in this configuration, then it will be removed.
 *
 * @param {array} data Data to process for the export
 * @param {object} configuration Structure to help filter and order output
 * @param {string} fileName The filename that should be written
 * @param {string} fileType The file type that should be used, will error if incorrect value
 * @param {bool} skipFileWrite Skip writing file
 * @returns
 */

export default function fileExport(
  data,
  configuration,
  fileName = 'data-export',
  fileType = 'csv',
  skipFileWrite = false
) {
  // Generates and writes the CSV file
  const generateFile = (entries) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(entries);
    XLSX.utils.book_append_sheet(wb, ws, 'test');
    let fullFileName = `${fileName}.${fileType}`;
    XLSX.writeFile(wb, fullFileName);
  };

  // Sorts the keys
  const sortDataKeys = (keys) => {
    keys.sort((a, b) => {
      const aOrder = configuration[a]?.order;
      const bOrder = configuration[b]?.order;

      if (aOrder < bOrder) {
        return -1;
      }
      if (aOrder > bOrder) {
        return 1;
      }
      return 0;
    });
    return keys;
  };

  // Sorts the entrys fields and relabels them
  // this actually builds a whole new object, making it easier
  // as the XLSX generator library doesn't allow us to customize the
  // object keys used or what order they're use in when mapping to cells
  const sortAndLabel = (entry, keys) => {
    const newObj = {};
    keys.forEach((key) => {
      if (configuration[key]) {
        const { label, transform } = configuration[key];
        newObj[label] = transform ? transform(entry[key]) : entry[key];
      }
    });
    return newObj;
  };

  // main funtion iterates over data and builds the new data object
  // to reflect desired output
  const orderFilterLabelData = (data) => {
    const cleanOrderedFilteredData = data.map((entry) => {
      const keys = Object.keys(entry);
      const sortedKeys = sortDataKeys(keys);
      const cleanEntry = sortAndLabel(entry, sortedKeys);
      return cleanEntry;
    });
    return cleanOrderedFilteredData;
  };

  const preparedData = orderFilterLabelData(data);
  if (!skipFileWrite) {
    generateFile(preparedData);
  }
  return preparedData;
}
