export function exportJSONFile(items, fileTitle) {
  var jsonObject = JSON.stringify(items);
  var json = jsonObject;
  var exportedFilenmae = fileTitle + '.json' || 'export.json';
  var blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  var link = document.createElement("a");

  if (link.download !== undefined) {
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", exportedFilenmae);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}