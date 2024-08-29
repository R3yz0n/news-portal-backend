function groupBy(key, array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    var added = false;
    for (var j = 0; j < result.length; j++) {
      if (result[j]["ads_type"] == array[i][key]["type"]) {
        let x = { ...JSON.parse(JSON.stringify(array[i])) };
        delete x["advertisement"];
        result[j].items.push(x);
        added = true;
        break;
      }
    }
    if (!added) {
      var entry = { items: [] };
      entry["ads_type"] = array[i][key]["type"];
      let x = { ...JSON.parse(JSON.stringify(array[i])) };
      delete x["advertisement"];
      entry.items.push(x);
      result.push(entry);
    }
  }
  return result;
}

module.exports = groupBy;
