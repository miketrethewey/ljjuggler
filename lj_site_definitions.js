// Super special thanks to the LJlogin project from which all this information was gleaned.  There were changes made to make this work in Chrome, but hours of research were saved!

var LJlogin_sites = [
	{
		name: 'Dreamwidth',
		cookieurl: 'https://www.dreamwidth.org',
		userhead: 'https://www.dreamwidth.org/img/silk/identity/user.png'
	},
	{
		name: 'LiveJournal',
		cookieurl: 'https://www.livejournal.com',
		userhead: 'https://l-stat.livejournal.net/img/userinfo_v8.svg'
	},
	{
		name: 'InsaneJournal',
		cookieurl: 'https://www.insanejournal.com'
	},
	{
		name: 'Scribbld',
		cookieurl: 'http://www.scribbld.com'
	},
	{
		name: 'DeadJournal',
		cookieurl: 'http://www.deadjournal.com',
		userhead: 'http://piktures.deadjournal.com/userinfo.gif'
	}
];

// Build a key-based look-up for the above data
var LJlogin_keys = [];
let i = 0;
for (var site of LJlogin_sites) {
	if (! site?.domain) {
		site.domain = site.cookieurl.substring(site.cookieurl.indexOf(".")).replace(/\//g, "")
	}
	if (! site?.cookiename) {
		site.cookiename = "ljmastersession"
	}
	if (! site?.userhead) {
		site.userhead = site.cookieurl + "/img/userinfo.gif"
	}
	if (! site?.interfaceurl) {
		site.interfaceurl = site.cookieurl + "/interface/flat"
	}
	LJlogin_sites[i] = site;
	LJlogin_keys[i] = site.name;
	i++;
}
