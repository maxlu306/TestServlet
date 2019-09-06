/**
 * 
 */


var modal;
var btn;
var span;
var subtotal;

function send(url) {
	var req = new XMLHttpRequest();
	req.open("get", url);
	req.onload = function() {
		//alert(this.responseText);
		var content = document.getElementById("content");
		content.innerHTML = this.responseText;
	}
	req.send();
}

// index.html use.
function go_store() {
	//alert("go_store");
	send("http://localhost:8080/TestServlet/store.html");	
}

function go_shopping_cart() {
	
	var req = new XMLHttpRequest();
	req.open("post", "webServlet");
	req.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
	req.onload = function() {
		//alert(this.responseText);
		if (this.responseText != null) {
			var content = document.getElementById("content");
			content.innerHTML = this.responseText;
		} else {
			alert("連線購物車失敗!");
		}
	}
	req.send("mxCmd=6d78020103&tabName=bebuke");
}

function init(){
	//alert("init");
}

2
	

/*
windows.addEventListener("message", getMessage, false);
function getMessage(event){
	alert("message");
	document.getElementById( "receiveID" ).innerHTML = event.data;
	switch(){
	case "bebuke": alert("bebuke"); break;
	}
}*/

/*
var myMsg = function(e) {
	alert("接收到的訊息：" + e.data);
	alert("訊息來源網域：" + e.origin);
	if (e.origin != "http://demo.cinc.biz") {
		alert("不明來源,不處理");
		return; //不明來源,不處理
	}

	//document.getElementById("res").innerHTML = "接收到的訊息：" + e.data;
};
window.addEventListener("message", myMsg, false);//監聽message事件
*/
function bebuke_init(){
	//alert("bebuke_init");
	modal = document.getElementById("myModal");

	// Get the button that opens the modal
	//btn = document.getElementById("myBtn");

	// Get the <span> element that closes the modal
	span = document.getElementsByClassName("close")[0];
	
	//btn.onclick = function() {
	//	modal.style.display = "block";
	//}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	
}

// store.html use.
function bebuke_menu() {
	//alert("bebuke_menu");
	//		var msg = window.open("http://localhost:8080/TestServlet/index.html");
	//		msg.postMessage("bebuke", "http://localhost:8080");
	//send("http://localhost:8080/TestServlet/bebuke.html");
	
	var req = new XMLHttpRequest();
	req.open("get", "http://localhost:8080/TestServlet/bebuke.html");
	req.onload = function() {
		//alert(this.responseText);
		var content = document.getElementById("content");
		content.innerHTML = this.responseText;
		// page complete! call bebuke_init();
		bebuke_init();
		
		var ret = sendMxCmd("mxCmd=6d78020101&dbName=orderdb");		
		//if(ret!="00"){ alert("連線資料庫失敗!"); }
	}
	req.send();

//	var ret = sendMxCmd("mxCmd=6d78020101&dbName=orderdb");		
//	if(ret!="00"){ alert("連線資料庫失敗!"); }

}

function sendMxCmd(cmd) {
	var req = new XMLHttpRequest();
	req.open("post", "webServlet");
	req.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
	req.onload = function() {
		return this.responseText;
//		if (this.responseText != null) {
//			//var content = document.getElementById("content");
//			//content.innerHTML = this.responseText;
//		} else {
//			alert("連線資料庫失敗!");
//		}
	}
	req.send(cmd);
}
// bebuke.html use.
function sweetness_level(obj){
	
	modal.style.display = "block";	
	var type=document.getElementById("tea_type");
	var money=document.getElementById("money");
	var total=document.getElementById("total");
	subtotal=obj.value;
	type.innerHTML = obj.name;
	money.innerHTML = obj.value;
	total.value = "1";
}

function total_change(obj){
	var total=document.getElementById("total");
	money.innerHTML = subtotal*total.value;
}

function add2cart(){
	//alert(money);
	// get order item :　name, content, amount, money
	var type=document.getElementById("tea_type");
	var money=document.getElementById("money");
	var total=document.getElementById("total");
	
	var data = type.innerHTML + ",";
	data = data + getContent() + ",";
	data = data + total.value + ",";
	data = data + money.innerHTML;	
	//alert(data);
	

	var ret = sendMxCmd("mxCmd=6d78020104&param=" + data);
	
	modal.style.display = "none";
}

function getContent() {
	var ice = document.querySelector('input[name="ice"]:checked').value;
	var sugar = document.querySelector('input[name="sugar"]:checked').value;
	return ice+sugar;
}

