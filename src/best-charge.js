var loadAllItems = require("./items");
var loadPromotions = require("./promotions");

function countItems(selectedItems, loadAllItems) {
    var result = [];
    var itemsList = loadAllItems();
    selectedItems.forEach((elem) => {
        let itemID = elem.split(" ")[0];
        let itemNum = elem.split(" ")[2];
        let itemName = '',
            itemPrice = 0;
        //找到食物的名称和价格
        itemsList.forEach((obj) => {
            if (obj.id === itemID) {
                itemName = obj.name;
                itemPrice = obj.price;
            }
        });
        // //添加至结果
        // for (let i = 0; i < result.length; i++) {
        //     if (result[i].name === itemName) {
        //         result[i].count += itemNum;
        //         return;//结束最外层循环
        //     }
        // }
        //新的物品
        result.push({
            id:itemID,
            name:itemName,
            count:itemNum,
            price:itemPrice
        });
    });
    return result;
}
function makePromotions(items, loadPromotions) {
    var promotions = {};
    var promotionList = loadPromotions();
    var totalSaving1 = 0,
        totalSaving2 = 0,
        total = 0;
    var halfPriceList = [];//半价食物列表
    items.forEach((elemObj) => {
        total += elemObj.price * elemObj.count;
    });
    if(total >= 30){//满减
        totalSaving1 = 6;
    }
    promotionList[1].items.forEach((promID) => {//指定半价
        items.forEach((elem) => {
            if(elem.id === promID){
                totalSaving2 += parseInt(elem.count) * elem.price / 2;

                halfPriceList.push(elem.name);
            }
        });
    });
    if(totalSaving1 == totalSaving2 && totalSaving2 == 0){
        promotions = {
            type:"none",
            name:"",
            saved:0
        };
        return promotions;

    }
    if(totalSaving1 >= totalSaving2){
        promotions = {
            type:'满30减6',
            name:'',
            saved:totalSaving1
        }
    }else if(totalSaving1 < totalSaving2){
        promotions = {
            type:'指定半价',
            name:halfPriceList,
            saved:totalSaving2
        }
    }
    return promotions;
}
function createOutputText(items, promotions) {
    let foodsStr = '============= 订餐明细 =============\n';
    let total = 0;
    items.forEach((elem) => {
        foodsStr += `${elem.name} x ${elem.count} = ${elem.count * elem.price}元\n`;
        total += elem.count * elem.price;
    });
    switch(promotions.type){
        case "none":
            foodsStr+=`-----------------------------------\n总计：${total - promotions.saved}元\n===================================`;
            break;
        case "满30减6":
            foodsStr+="-----------------------------------\n使用优惠:\n满30减6元，省6元\n-----------------------------------\n";
            foodsStr+=`总计：${total - promotions.saved}元\n===================================`;
            break;
        case "指定半价":
            foodsStr+=`-----------------------------------\n使用优惠:\n`;
            foodsStr+=`指定菜品半价(${promotions.name.join("，")})，省${promotions.saved}元\n-----------------------------------\n`;
            foodsStr+=`总计：${total - promotions.saved}元\n===================================`;
    }
    return foodsStr;

}

module.exports = function bestCharge(selectedItems) {
    var items = countItems(selectedItems, loadAllItems);
    var promotions = makePromotions(items, loadPromotions);
    var output = createOutputText(items, promotions);
   // console.log(output);
    return output;
}

// let inputs = ["ITEM00013 x 4"];
// bestCharge(inputs);
