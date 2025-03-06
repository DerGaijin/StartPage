var IsInPrivate = false;

document.addEventListener("DOMContentLoaded", () => {
	Update();
	setInterval(Update, 500);

	detectIncognito()
		.then(function (result) {
			IsInPrivate = result.isPrivate;
			LoadLinkGroups();

			if (IsInPrivate) {
				// Do Private Stuff
			}
		})
		.catch(function (error) {
			LoadLinkGroups();
		});
});

function LoadLinkGroups() {
	var LinkList = document.getElementById("LinkList");
	LinkList.innerHTML = "";

	for (var LinkGroup of LinkGroups) {
		var IsEncrypted = "IsEncoded" in LinkGroup && LinkGroup["IsEncrypted"];
		var IsPrivate = "IsPrivate" in LinkGroup && LinkGroup["IsPrivate"];

		if (IsPrivate && !IsInPrivate) {
			continue;
		}

		var GroupElement = document.createElement("ul");
		GroupElement.className = "LinkGroup";
		LinkList.appendChild(GroupElement);

		if ("Label" in LinkGroup) {
			var GroupLabel = document.createElement("p");
			GroupLabel.className = "LinkGroupLabel";
			GroupLabel.innerText = LinkGroup.Label;
			GroupElement.appendChild(GroupLabel);
		}

		if ("Links" in LinkGroup) {
			var Links = LinkGroup["Links"];
			for (var Link of Links) {
				var LinkItem = document.createElement("a");
				LinkItem.className = "LinkItem";

				if ("URL" in Link) {
					// Decrypt Encrypted URLs
					LinkItem.href = Link["URL"];
				}

				var IconURL = LinkItem.href;
				if ("Icon" in Link) {
					IconURL = Link["Icon"];
				}

				var LinkIcon = document.createElement("img");
				LinkIcon.className = "LinkIcon";
				LinkIcon.src = "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + IconURL + "&size=256";
				LinkItem.appendChild(LinkIcon);

				if ("Label" in Link) {
					var LinkLabel = document.createElement("p");
					LinkLabel.className = "LinkLabel";
					// Decrypt Encrypted Labels
					LinkLabel.innerText = Link["Label"];
					LinkItem.appendChild(LinkLabel);
				}

				GroupElement.appendChild(LinkItem);
			}
		}
	}
}

function Update() {
	function PrettyNumber(Number) {
		return Number <= 9 ? "0" + Number : Number;
	}

	const Now = new Date();

	var CurrTime = PrettyNumber(Now.getHours()) + ":" + PrettyNumber(Now.getMinutes()) + ":" + PrettyNumber(Now.getSeconds());
	document.getElementById("TimeDisplay").innerText = CurrTime;

	var CurrDay = "";
	if (Now.getDay() == 0) {
		CurrDay = "Sonntag";
	} else if (Now.getDay() == 1) {
		CurrDay = "Montag";
	} else if (Now.getDay() == 2) {
		CurrDay = "Dienstag";
	} else if (Now.getDay() == 3) {
		CurrDay = "Mittwoch";
	} else if (Now.getDay() == 4) {
		CurrDay = "Donnerstag";
	} else if (Now.getDay() == 5) {
		CurrDay = "Freitag";
	} else if (Now.getDay() == 6) {
		CurrDay = "Samstag";
	}
	document.getElementById("DayDisplay").innerText = CurrDay;

	var CurrDate = PrettyNumber(Now.getDate()) + "." + PrettyNumber(Now.getMonth() + 1) + "." + Now.getFullYear();
	document.getElementById("DateDisplay").innerText = CurrDate;
}

function Decrypt(Value) {
	return Value;
}

function Encrypt(Value) {
	return Value;
}

function DecryptionPasswordChange() {}
