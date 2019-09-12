/**
 * 
 */

document.write('<script src="https://code.jquery.com/jquery-3.4.1.js"" type="text/javascript"></script>');

var modal;
var btn;
var span;
var subtotal;
var storeName;

function callhtml(url) {
	var req = new XMLHttpRequest();
	req.open("get", url);
	req.onload = function() {
		var content = document.getElementById("content");
		content.innerHTML = this.responseText;
	}
	req.send();
}

function callhtmlNcallback(url, callback) {
	var req = new XMLHttpRequest();
	req.open("get", url);
	req.onload = function() {
		var content = document.getElementById("content");
		content.innerHTML = this.responseText;
		callback();
	}
	req.send();
}

// index.html use.
function go_store() {
	// call store.html
	callhtmlNcallback("http://localhost:8080/TestServlet/store.html",
			function() {
			});
}

function init() {
	sendMxCmd("mxCmd=6d78020101&dbName=orderdb", function() {
	});
}
function sendMxCmd(cmd) {
	var req = new XMLHttpRequest();
	req.open("post", "webServlet");
	req.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded;charset=utf-8");
	req.onload = function() {
		return this.responseText;
	}
	req.send(cmd);
}

// use ajax post xmcommand to servlet.
function sendxmCmd(cmd, callback) {
	var req = new XMLHttpRequest();
	req.open("post", "webServlet");
	req.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded;charset=utf-8");
	req.onload = function() {
		// alert(this.responseText);
		callback(this);
	}
	req.send(cmd); // send xmcmd.
}

// shopping_cart.html use.
function go_shopping_cart() {
	callhtmlNcallback("http://localhost:8080/TestServlet/shopping_cart.html",
			showStore);
}

function showStore() {

	// 讀取已訂購的店家名稱
	sendxmCmd(
			"mxCmd=6d78020105",
			function(obj) {
				var res = JSON.parse(obj.responseText);
				var list = res.list;
				// add stroe list to UI (id"store_list")
				var li = "<ul>";
				for (var i = 0; i < list.length; i++) {
					var tmp = "<li style=\"cursor:pointer\" onClick=\"store_click(this)\">"
							+ list[i]
							+ "</li><button type=\"button\" class=\"list_del\" onClick=\"list_del_click(this)\"" 
							+ "name=\"" + list[i] + "\""
							+">delete</button>";
					li += tmp;
				}
				var ul = document.getElementById("store_list");
				ul.innerHTML = li + "</ul>";
			});
}

function store_click(obj) {
	var storeName = obj.innerHTML;
	displayDetail(storeName);
}

function displayDetail(name){
	//alert(name);
	storeName = name;
	sendxmCmd("mxCmd=6d78020103&param=" + name, function(obj) {
		if (obj.responseText != null) {
			var res = JSON.parse(obj.responseText);
			var list = res.list;
			updateShopping(list);
		}
	});
}

function updateShopping(list) {
	// 顯示訂購明細
	var content = document.getElementById("shopping_content");
	content.innerHTML = "";

	for (var i = 0; i < list.length; i++) {
		var element = list[i];
		var tokens = element.split(",");	
		var id = tokens[0];
		$("#shopping_content").append("<div class=\"row\">");
		$("#shopping_content").append("<div class=\"col-md-2\"></div>");
		$("#shopping_content").append(
				"<div class=\"col-md-8\">" + element + "</div>");
		
		//<button type=\"button\" class=\"list_del\" onClick=\"list_del_click(this)
		var line = "<div class=\"col-md-2\">" 
			+ "<button type=\"button\" onClick=\"delItem(this)\" name=\"" + id + "\"" 
			+ ">刪除</button>"
			+ "</div>";			
		$("#shopping_content").append(line);
		$("#shopping_content").append("</div>");
		$("#shopping_content").append("<br>");
		$("#shopping_content").append("<hr>");
	}
}

function list_del_click(obj) {
	var name = obj.name;
	//alert(name);
	sendxmCmd("mxCmd=6d78020106&param=" + name, function(obj) {
		showStore();
	});
}

function delItem(obj){
	var num = parseInt(obj.name, 10);
	var hexstr = ("00" + num.toString(16)).substr(-2);
	//alert(hexString);
	var cmd = "mxCmd=6d78030107" + hexstr + "&param=" + storeName;
	sendxmCmd(cmd, function(obj) {
		displayDetail(storeName);
	});
}

// store.html use.
function tp_tea_menu(){
	//alert("tp_tea_menu");
	callhtmlNcallback("http://localhost:8080/TestServlet/tp_tea.html",
			function() {
				bebuke_init();
				storeName = "tp_tea"
			});
}

function bebuke_menu() {
	callhtmlNcallback("http://localhost:8080/TestServlet/bebuke.html",
			function() {
				bebuke_init();
				storeName = "bebuke"
			});
}

function bebuke_init() {
	// alert("bebuke_init");
	modal = document.getElementById("myModal");

	// Get the button that opens the modal
	// btn = document.getElementById("myBtn");

	// Get the <span> element that closes the modal
	span = document.getElementsByClassName("close")[0];

	// btn.onclick = function() {
	// modal.style.display = "block";
	// }

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

// tp-tea.html use.



// bebuke.html use.
function sweetness_level(obj) {

	modal.style.display = "block";
	var type = document.getElementById("tea_type");
	var money = document.getElementById("money");
	var total = document.getElementById("total");
	subtotal = obj.value;
	type.innerHTML = obj.name;
	money.innerHTML = obj.value;
	total.value = "1";
}

function total_change(obj) {
	var total = document.getElementById("total");
	money.innerHTML = subtotal * total.value;
}

function add2cart() {
	// alert(money);
	// get order item : name, content, amount, money
	var type = document.getElementById("tea_type");
	var money = document.getElementById("money");
	var total = document.getElementById("total");

	var data = type.innerHTML + ",";
	data = data + getContent() + ",";
	data = data + total.value + ",";
	data = data + money.innerHTML;
	// alert(data);

	var json = {
		"store" : storeName,
		"param" : data
	}	
	var jout = JSON.stringify(json);
	sendxmCmd("mxCmd=6d78020104&param=" + jout, function(){
		// TODO: check status.
	});

	modal.style.display = "none";
}

function getContent() {
	var ice = document.querySelector('input[name="ice"]:checked').value;
	var sugar = document.querySelector('input[name="sugar"]:checked').value;
	return ice + sugar;
}
