function page_loaded()
{
}
function click_logout_div()
{
	chrome.extension.sendRequest({"command":"logout"});
	window.close();
}
function mouseover_this_element(element_id)
{
	draw_ui_highlights("mouseover", element_id);
}
function mouseout_this_element(element_id)
{
	draw_ui_highlights("mouseout", element_id);
}
function click_this_user_div(this_account)
{
	chrome.extension.sendRequest({"command":"login","account":this_account});
	window.close();
}
	
function generate_option(this_account)
{
	var this_div = document.createElement("li");
	this_div.setAttribute("class","nohover");
	this_div.id = this_account.site_info.name + this_account.username;
	this_div.innerHTML = this_account.username;
	this_div.onmouseover = function (this_div)
	{
		return function ()
		{
			mouseover_this_element(this_div.id);
		};
	}(this_div);
	this_div.onmouseout = function (this_div)
	{
		return function()
		{
			mouseout_this_element(this_div.id);
		};
	}(this_div);
	this_div.onclick = function (this_account)
	{ 
		return function ()
		{
			click_this_user_div(this_account);
		};
	}(this_account);
	return this_div;
}
function accountsort(account_one, account_two)
{
	if(account_one.site_info.name < account_two.site_info.name) return -1;
	else if(account_one.site_info.name > account_two.site_info.name) return 1;
	else if(account_one.username < account_two.username) return -1;
	else if(account_one.username > account_two.username) return 1;
	else return 0;
}
function highlight_account(account, hover_id)
{
	chrome.cookies.get({"url":account.site_info.cookieurl,"name":account.site_info.cookiename}, function (cookie) {
		var target_element = document.getElementById(account.site_info.name + account.username);
		if(cookie != undefined)
		{
			var saved_uid = cookie.value.split(":")[1];
			if(saved_uid == account.uid)
			{
				if(hover_id == target_element.id)
					target_element.setAttribute("class","select-hover");
				else
					target_element.setAttribute("class","select-nohover");
			}
			else
			{
				if(hover_id == target_element.id)
					target_element.setAttribute("class","hover");
				else
					target_element.setAttribute("class","nohover");
			}
		}
		else if(hover_id == target_element.id)
			target_element.setAttribute("class","hover");
		else
			target_element.setAttribute("class","nohover");
	});
}
function draw_ui_highlights(mode, hover_id)
{
	chrome.extension.sendRequest({"command":"localStorage","mode":"get","key":"lj_juggler_accounts"}, function (response)
	{
		var account_list = [];
		if(response.value != undefined) account_list = JSON.parse(response.value);
		if(mode == "initialize")
		{
			for(var i = 0; i < account_list.length; i++)
			{
				highlight_account(account_list[i], hover_id);
			}
		}
		else
		{
			for(var i = 0; i < account_list.length; i++)
			{
				if(account_list[i].site_info.name + account_list[i].username == hover_id)
				{
					if(mode == "mouseover") highlight_account(account_list[i], hover_id);
					else if(mode == "mouseout") highlight_account(account_list[i], 0);
				}
			}
		}
		var option_list = document.getElementById("option_list").childNodes;
		for(var i = 0; i < option_list.length; i++)
		{
			if(option_list[i].nodeName == "LI")
			{
				if(hover_id == option_list[i].id) option_list[i].setAttribute("class","hover");
				else option_list[i].setAttribute("class","nohover");
			}
		}
	});
}
function get_username_from_uid(uid, account_list)
{
	for(var i = 0; i < account_list.length; i++)
		if(account_list[i].uid == uid)
			return account_list[i].username;
	return false;
}
window.onload = function()
{
	// First dynamically build the page.
	chrome.extension.sendRequest({"command":"localStorage","mode":"get","key":"lj_juggler_accounts"}, function (response)
	{
		var account_list = [];
		if(response.value != undefined) account_list = JSON.parse(response.value);
		account_list.sort(accountsort);
		
		var current_site = '';
		for(var i = 0; account_list[i]; i++)
		{
			// If this is the first account from this site, add a heading for the site.
			if(account_list[i].site_info.name != current_site)
			{
				var this_header = document.createElement('div');
				this_header.setAttribute('class','site-label');
				this_header.innerHTML = account_list[i].site_info.name;
				document.getElementById('user_list').appendChild(this_header);
				current_site = account_list[i].site_info.name;
			}
			var next_option = generate_option(account_list[i]);
			document.getElementById("user_list").appendChild(next_option);
		}
		// If all the accounts are from a single site, we can actually remove the site label as extraneous.
		var kill_me = document.getElementsByClassName('site-label');
		if(kill_me.length < 2)
			kill_me[0].parentNode.removeChild(kill_me[0]);
		draw_ui_highlights("initialize", 0);
	});

	// Now attach some event handlers.
	logout_link = document.getElementById('livejournal_logout');
	logout_link.onmouseover = function(evt) {
		mouseover_this_element(evt.target.id);
	}
	logout_link.onmouseout = function(evt) {
		mouseout_this_element(evt.target.id);
	}
	logout_link.onclick = function(evt) {
		click_logout_div();
	}
	document.getElementById('options_page_link').onclick = function() {
		chrome.tabs.create({'url': chrome.extension.getURL('options.html')});
	}

}
