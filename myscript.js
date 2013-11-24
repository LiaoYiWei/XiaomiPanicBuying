buyingTime = new Date(2013, 10, 26, 12, 0, 0).getTime();
/**
 * this method is used for mention
 */
function createOrUpadateElement(str) {
	// create a new div element
	// and give it some content
	var my_body = document.getElementsByTagName("body");
	var div = document.getElementById("my_div");

	if (div) {
		if (div.childNodes[0].nodeValue !== str) {
			div.childNodes[0].nodeValue = str;
		}
	} else {
		div = document.createElement("div");
		var div_id = document.createAttribute("id");
		div_id.nodeValue = "my_div"
		var div_style = document.createAttribute("style");

		div_style.nodeValue = "position:absolute;top:250px;left:300px;background-color:white;z-index:99999;font: 30px/32px sans-serif;height:80px;color:red";
		div.setAttributeNode(div_id);
		div.setAttributeNode(div_style);

		var img = document.createElement("image");
		var img_src = document.createAttribute("src");
		img_src.nodeValue = chrome.extension.getURL("images/loading.gif");
		img.setAttributeNode(img_src);

		var newContent = document.createTextNode(str);

		div.appendChild(newContent); // add the text node to the newly
		// created
		// div.
		div.appendChild(img);
		// add the newly created element and its content into the DOM
		document.body.insertBefore(div, my_body);
	}

}

function getRealControl() {
	// buy phone start at 12:00:00
	var timestamp = new Date().getTime();
	if(timestamp < buyingTime){
	       timestamp = buyingTime;
	}
	// this url is for getting the real selection page
	var url = "http://tc.hd.xiaomi.com/hdget?callback=hdcontrol&_=" + timestamp;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send(null);
	console.log(xhr.responseText);
	return xhr.responseText;
}
  /**
  get time seconds diff between server and local
  */
 function getServerLocalDiffTime(){
     var config = getHdcontrolObject();
     var diffTime = parseInt(parseInt(buyingTime/1000) - config.stime);
     return diffTime;
 }

 function getHdcontrolObject(){
     var realControl = getRealControl();
     if (realControl) {
     var hdObject = eval(realControl.substring(9, realControl.length));
     if(hdObject){
         return hdObject;
     }
     return null;
     }
 }
/**
*buy phone logic
*/
function buyPhone() {
    console.log("enter buyPhone method");
    try {
        var hdObject = getHdcontrolObject();
        var c = hdObject.status, d = c.miphone.hdurl, b = c.mibox.hdurl, a = c.mitv.hdurl, f = hdObject.d22a51 ?hdObject.d22a51 * 0x3e8
                    : 0x1388;
       if (d) {
            m.locationNext(d)
       }
       else{
            ajaxInter = window.setTimeout(function() {
                    buyPhone();
            }, f)
       }
    } catch (err) {
        console.log(err.message);
    }
    console.log("out buyPhone method");
}
(function start(){
     var diffTime = getServerLocalDiffTime();

     if (diffTime < 0) {
    	createOrUpadateElement("小米助手正在拼命帮您抢购。。。。。。。。。。。");
    	buyPhone();
     }
    else {
        createOrUpadateElement("不要着急，时间未到，(时间一到小米助手会自动帮您抢购)");
        ajaxInter = window.setTimeout(function() {
                            buyPhone();
                    }, diffTime)
    }
 })();


