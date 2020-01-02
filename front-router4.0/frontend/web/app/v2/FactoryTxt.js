var React = require('react');
function makeHighlight(keyWord, txt, isPureStr){
	var regex = new RegExp('(' + keyWord + ')', 'ig');
	var tag_ = isPureStr ? '«Ô' : '<span class="searchHighlight">';
	var _tag = isPureStr ? 'Ô»' : '</span>';
	txt = txt.replace(regex, tag_ + '$1' + _tag);
    var re = isPureStr ? txt : <span dangerouslySetInnerHTML={ { __html: txt } } />;
    return re;
}
module.exports = {
	highLight: function(keyWord, txt){
		keyWord=keyWord.split(".")
		if( (keyWord instanceof Array) && keyWord.length > 0) {
			var pre = keyWord.reduce(function(prev, curr){
				prev = makeHighlight(curr, prev, true);
				return prev;
			}, txt);
			pre = pre.replace(/(«Ô)/g, '<span class="searchHighlight">');
			pre = pre.replace(/(Ô»)/g, '</span>');
			return <span dangerouslySetInnerHTML={ { __html: pre } } />;
		}else{
			return makeHighlight(keyWord, txt, false);
		}
	}
};
