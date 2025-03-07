var IsInPrivate = false;

document.addEventListener("DOMContentLoaded", () => {
	Update();
	setInterval(Update, 500);

	detectIncognito()
		.then(function (result) {
			IsInPrivate = result.isPrivate;
			LoadLinkGroups();

			if (IsInPrivate) {
				var TogglePrivateLinksButton = document.createElement("button");
				TogglePrivateLinksButton.id = "TogglePrivateLinksButton";
				TogglePrivateLinksButton.innerText = "Toggle Private Links";
				TogglePrivateLinksButton.onclick = TogglePrivateLinks;
				document.body.appendChild(TogglePrivateLinksButton);
			}
		})
		.catch(function (error) {
			console.error(error);
			LoadLinkGroups();
		});
});

function LoadLinkGroups() {
	var LinkList = document.getElementById("LinkList");
	LinkList.innerHTML = "";

	for (var LinkGroup of LinkGroups) {
		var IsEncrypted = "IsEncrypted" in LinkGroup && LinkGroup["IsEncrypted"];
		var IsPrivate = "IsPrivate" in LinkGroup && LinkGroup["IsPrivate"];

		if (IsPrivate && !IsInPrivate) {
			continue;
		}

		var GroupElement = document.createElement("div");
		GroupElement.className = "LinkGroup";
		if (IsPrivate) {
			GroupElement.classList.add("LinkGroup_Private");
			GroupElement.classList.add("LinkGroup_Hidden");
		}
		LinkList.appendChild(GroupElement);

		if ("Label" in LinkGroup) {
			var GroupLabel = document.createElement("p");
			GroupLabel.className = "LinkGroupLabel";
			GroupLabel.innerText = IsEncrypted ? Decrypt(LinkGroup.Label) : LinkGroup.Label;
			GroupElement.appendChild(GroupLabel);
		}

		if ("Links" in LinkGroup) {
			var LinkItems = document.createElement("ul");
			LinkItems.className = "LinkItems";
			GroupElement.appendChild(LinkItems);

			var Links = LinkGroup["Links"];
			for (var Link of Links) {
				var LinkItem = document.createElement("a");
				LinkItem.className = "LinkItem";

				if ("URL" in Link) {
					LinkItem.href = IsEncrypted ? Decrypt(Link.URL) : Link.URL;
				}

				var IconURL = LinkItem.href;
				var LinkIcon = document.createElement("img");
				LinkIcon.className = "LinkIcon";
				if ("Icon" in Link) {
					LinkIcon.src = IsEncrypted ? Decrypt(Link.Icon) : Link.Icon;
				} else {
					LinkIcon.src = "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + IconURL + "&size=256";
				}
				LinkItem.appendChild(LinkIcon);

				if ("Label" in Link) {
					var LinkLabel = document.createElement("p");
					LinkLabel.className = "LinkLabel";
					LinkLabel.innerText = IsEncrypted ? Decrypt(Link.Label) : Link.Label;
					LinkItem.appendChild(LinkLabel);
				}

				LinkItems.appendChild(LinkItem);
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

function TogglePrivateLinks() {
	var PrivateLinkGroups = document.getElementsByClassName("LinkGroup_Private");

	for (const Element of PrivateLinkGroups) {
		Element.classList.toggle("LinkGroup_Hidden");
	}
}

function Decrypt(Value) {
	var Key = localStorage.getItem("EncryptionKey");
	if (Key == null) {
		Key = "Default";
	}
	var Decrypted = CryptoJS.AES.decrypt(Value, Key);
	return Decrypted ? Decrypted.toString(CryptoJS.enc.Utf8) : Value;
}

function Encrypt(Value) {
	var Key = localStorage.getItem("EncryptionKey");
	if (Key == null) {
		Key = "Default";
	}
	var Encrypted = CryptoJS.AES.encrypt(Value, Key);
	return Encrypted ? Encrypted.toString() : Value;
}

function SetEncryptionKey(Key) {
	localStorage.setItem("EncryptionKey", Key);
}
