
module.exports = {
    //获取滚动条当前的位置
    getScrollTop: function() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
           scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    },
    //获取当前可是范围的高度
    getClientHeight: function() {
        var clientHeight = 0;
        if (document.documentElement.clientHeight) {
            clientHeight = document.documentElement.clientHeight;
        }
        return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight: function() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    },
    setScrollTo: function(to){
        if (document.documentElement && document.documentElement.scrollTop) { 
            document.documentElement.scrollTop = to; 
        } else if (document.body) {
            document.body.scrollTop = to; 
        } 
    }
    
}

