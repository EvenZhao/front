export function isPayed(authFlag) {
    var isPayed = false;
    if (authFlag == 1 || authFlag == 13 || authFlag == 12) {
        isPayed = true;
    }
    return isPayed;
}

export function isFree(authFlag) {
    var isFree = false;
    if (authFlag == 10) {
        isFree = true
    }
    return isFree;
}

export function unit(authFlag){
    var unit = "";
    if(authFlag == 5 || authFlag == 7){
        unit ="点"
    }else if(authFlag == 6 || authFlag == 8){
        unit = "次"
    }
    return unit;
}

export function getTitle(isPayed,isFree,unit,authData){
    var _title ="";
    if(isPayed == false && isFree == false){
        var _postfix = "/人"
        if(unit == "点"){
            _postfix = "/人"
        }
        //没有电和次的情况下，显示的标题有区别。
         _title = `，超出后抵扣${authData.authSingleCount}${unit}${_postfix}`
        if(authData.authFlag == 7 || authData.authFlag == 8){
            _title = `本课程抵扣${authData.authSingleCount}${unit}${_postfix}`
        }
        if(authData.num == null && authData.point == null){
            //没点没次
            _title = "";
        }
    }
    return _title;
}