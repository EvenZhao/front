// obj list中的一行 sp手机  se 邮箱 type: 1已报名 2已选 3员工
function alertsCont(obj, sp, se, type) {
    var s = ''
        , str = ""
        , { phone, email } = obj;
    if (sp == phone && se == email) {
        s = '手机号码、电子邮箱'
    } else if (sp == phone) {
        s = '手机号码'
    } else if (se == email) {
        s = '电子邮箱'
    }
    if (s) {
        if (type == 1) {
            str = "该人员" + s + "与已成功报名";
            s = "本课的学员";
        } else if (type == 2) {
            str = "该人员" + s + "与已选员工";
            s = "名单中学员";
        } else if (type == 3) {
            str = "该人员" + s + "与贵公司已有员工";
            s = "账号";
        }
    }
    return {
        alert_title: str,
        alert_cont: s,
    }
}
module.exports = {
    // 已选，所有人员数据
    selectedList: (selectedList, _people, _data, _flag) => {
        // 1、先判断已报名
        if (_people) {
            // CHECK._filterByType(this._people, 1)
            for (var i = 0; i < _people.length; i++) {
                var item = _people[i]['data'] || [];
                for (var j = 0; j < item.length; j++) {
                    var current = item[j] || {};
                    if (current.status == 1) {
                        var res = alertsCont(current, _data.phone, _data.email, 1);
                        if (res.alert_cont) {
                            return res
                        }
                    }
                }
            }
        }
        // 2、判断是否已选
        if (selectedList) {
            for (var i = 0; i < selectedList.length; i++) {
                var current = selectedList[i];
                var res = alertsCont(current, _data.phone, _data.email, 2);
                if (res.alert_cont) {
                    return res
                }
            }
        }
        // 3、判断是否员工
        // _flag 不校验标记 true：不校验
        if (!_flag && _people) {
            // 校验是否已存在手机或邮箱的员工账号
            // CHECK._filterByType(this._people, 1)
            for (var i = 0; i < _people.length; i++) {
                var item = _people[i]['data'] || [];
                for (var j = 0; j < item.length; j++) {
                    var current = item[j] || {};
                    if (current.id != null && current.selected == false && current.status == 0) { //排除新增的，只比较已有员工中未选中(selected==false)、未报名(status == 0 )的
                        var res = alertsCont(current, _data.phone, _data.email, 3);
                        if (res.alert_cont) {
                            return res
                        }
                    }
                }
            }
        }
        return {
            alert_title: '',
            alert_cont: '',
        }
    },
    // 根据当前tab filter数据
    _filterByType: (data, type) => {
        var tm_array = []
        data.map((item, index) => {
            var _data = item.data.filter(function (currentValue) {
                return currentValue.actType == type || currentValue.actType == 3;
            })
            if (_data.length > 0) {
                tm_array = tm_array.concat(item)
            }
        })
        return tm_array;
    }
}