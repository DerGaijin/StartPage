document.addEventListener("DOMContentLoaded", () => {
	UpdateDateTime();
	setInterval(UpdateDateTime, 500);
	UpdateLinks();
	UpdateAurum();
});

function UpdateDateTime() {
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

function UpdateLinks() {
	var LinkList = document.getElementById("LinkList");
	LinkList.innerHTML = "";

	for (var LinkGroup of LinkGroups) {
		var GroupElement = document.createElement("div");
		GroupElement.className = "LinkGroup";
		LinkList.appendChild(GroupElement);

		if ("Label" in LinkGroup) {
			var GroupLabel = document.createElement("p");
			GroupLabel.className = "LinkGroupLabel";
			GroupLabel.innerText = LinkGroup.Label;
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
					LinkItem.href = Link.URL;
				}

				var IconURL = LinkItem.href;
				var LinkIcon = document.createElement("img");
				LinkIcon.className = "LinkIcon";
				if ("Icon" in Link) {
					LinkIcon.src = Link.Icon;
				} else {
					LinkIcon.src = "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + IconURL + "&size=256";
				}
				LinkItem.appendChild(LinkIcon);

				if ("Label" in Link) {
					var LinkLabel = document.createElement("p");
					LinkLabel.className = "LinkLabel";
					LinkLabel.innerText = Link.Label;
					LinkItem.appendChild(LinkLabel);
				}

				LinkItems.appendChild(LinkItem);
			}
		}
	}
}

function UpdateAurum() {
	const AurumData = {
		Overview: {
			Balance: 0,
			Equity: 0,
			Margin: 0,
			Positions: 0,
		},
		Experts: [
			{ Name: "Total", "09.2025": 0, "08.2025": 0, "07.2025": 0, "06.2025": 0 },
			{ Name: "Aurum Expert 01", "09.2025": 0, "08.2025": 0, "07.2025": 0, "06.2025": 0 },
			{ Name: "Aurum Expert 02", "09.2025": 0, "08.2025": 0, "07.2025": 0, "06.2025": 0 },
			{ Name: "Aurum Expert 03", "09.2025": 0, "08.2025": 0, "07.2025": 0, "06.2025": 0 },
			{ Name: "Aurum Expert 04", "09.2025": 0, "08.2025": 0, "07.2025": 0, "06.2025": 0 },
		],
	};

	document.getElementById("AurumOverview_Balance").innerText = "Balance: " + AurumData.Overview.Balance + " $";
	document.getElementById("AurumOverview_Equity").innerText = "Equity: " + AurumData.Overview.Equity + " $";
	document.getElementById("AurumOverview_Margin").innerText = "Free Margin: " + AurumData.Overview.Margin + " $";
	document.getElementById("AurumOverview_Positions").innerText = "Positions: " + AurumData.Overview.Positions;

	var AurumList = document.getElementById("AurumList");
	AurumList.innerHTML = "";

	function AddRow(Elem, Text1, Text2) {
		var Row = document.createElement("div");
		Row.className = "AurumRow";
		Elem.appendChild(Row);

		var Text1Elem = document.createElement("p");
		Text1Elem.className = "AurumText1";
		Text1Elem.innerText = Text1;
		Row.appendChild(Text1Elem);

		var Text2Elem = document.createElement("p");
		Text2Elem.className = "AurumText2";
		Text2Elem.innerText = Text2;
		Row.appendChild(Text2Elem);
	}

	for (var Item of AurumData.Experts) {
		var Elem = document.createElement("li");
		Elem.className = "AurumItem";
		AurumList.appendChild(Elem);

		var Name = document.createElement("h4");
		Name.className = "AurumName";
		Name.innerText = Item.Name;
		Elem.appendChild(Name);

		var Idx = 0;
		for (const [Key, Value] of Object.entries(Item)) {
			if (Idx == 0) {
				Idx++;
				continue;
			} else if (Idx == 1) {
				if (Value > 0) {
					Elem.classList.add("AurumItem_Profit");
				}
				if (Value < 0) {
					Elem.classList.add("AurumItem_Loss");
				}
			}
			AddRow(Elem, Key, Value);
			Idx += 1;
		}
	}
}
