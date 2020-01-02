global.setParametersForApp = (openid, code, bolueClient, bolueVer, UUIDIMEI, devToken, params) => {
    localStorage.clear();
    localStorage.setItem("credentials.code", code);
    localStorage.setItem("credentials.openid", openid);
    localStorage.setItem("bolueClient", bolueClient);
    localStorage.setItem("boluever", bolueVer);
    localStorage.setItem("UUIDIMEI", UUIDIMEI);
    localStorage.setItem("devToken", devToken);
    try {
        if (params) {
            params = JSON.parse(params);
            var keys = Object.keys(params);
            // document.getElementById('markTest').innerHTML  = params
            for (var i = 0; i < keys.length; i++) {
                localStorage.removeItem(keys[i]);
                localStorage.setItem(keys[i], params[keys[i]])
            }
        }
    } catch (e) {
    }
}