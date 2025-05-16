
function roundToDecimalPlaces(num, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(num * factor) / factor;
}

function process_setlist_roipage(dataList) {
    console.log('process_setlist_roipage');
    console.log(dataList);
    let output = [];
    for (var i = 0; i < dataList.length; i++) {
        const document = dataList[i];
        var item = document["_doc"]
        const price = item["productPrices"]["Pack"][0];
        const ev = item["productPrices"]["Pack"][1];
        const roi = roundToDecimalPlaces((ev - price) / price, 2);
        var obj = {
            'id': item["_id"],
            'set': item["set"],
            'packPrice': price,
            'expectedValue': ev,
            'simpleROI': roi,
        }
        output.push(obj);
    }
    return output;
}

export { process_setlist_roipage };