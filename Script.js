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
	const AurumEndpoint = localStorage.getItem("Aurum");
	if (AurumEndpoint != null) {
		var AurumRequest = new XMLHttpRequest();
		AurumRequest.open("GET", "http://" + AurumEndpoint, true);
		AurumRequest.onreadystatechange = function () {
			if (AurumRequest.readyState === 4 && AurumRequest.status === 200) {
				try {
					const Data = JSON.parse(AurumRequest.responseText);
					UpdateAurumData(Data);
				} catch (e) {}
			}
		};
		AurumRequest.send();
	}
	/*
	const AurumData = {
		Balance: 10,
		Equity: 20,
		FreeMargin: 30,
		Positions: 12,
		Experts: [
			{ Label: "Aurum Expert 01", Profits: [1, 1, 2, 3] },
			{ Label: "Aurum Expert 02", Profits: [0, 1, 2, 3] },
			{ Label: "Aurum Expert 03", Profits: [0, 1, 2, 3] },
			{ Label: "Aurum Expert 04", Profits: [0, 1, 2, 3] },
		],
	};
	UpdateAurumData(AurumData);
    */
}

function UpdateAurumData(AurumData) {
	// Overview
	document.getElementById("AurumOverview_Balance").innerText = "Balance: " + AurumData.Balance + " $";
	document.getElementById("AurumOverview_Equity").innerText = "Equity: " + AurumData.Equity + " $";
	document.getElementById("AurumOverview_Margin").innerText = "Free Margin: " + AurumData.FreeMargin + " $";
	document.getElementById("AurumOverview_Positions").innerText = "Positions: " + AurumData.Positions;

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

	function GetMonth(offset) {
		const now = new Date();
		// shift months backwards by offset
		let year = now.getFullYear();
		let month = now.getMonth() - offset; // JS months: 0=Jan ... 11=Dec

		// adjust year/month if we go below 0 or above 11
		while (month < 0) {
			month += 12;
			year -= 1;
		}
		while (month > 11) {
			month -= 12;
			year += 1;
		}

		// format as MM.YYYY
		let monthStr = String(month + 1).padStart(2, "0");
		return `${monthStr}.${year}`;
	}

	// Total
	var TotalElem = document.createElement("li");
	TotalElem.className = "AurumItem";
	AurumList.appendChild(TotalElem);
	var TotalLabel = document.createElement("h4");
	TotalLabel.className = "AurumName";
	TotalLabel.innerText = "Total";
	TotalElem.appendChild(TotalLabel);

	var TotalIndex = 0;
	while (true) {
		var Found = false;
		var Profit = 0;
		for (var Item of AurumData.Experts) {
			if (TotalIndex < Item.Profits.length) {
				Found = true;
				Profit += Item.Profits[TotalIndex];
			}
		}

		if (!Found) {
			break;
		}

		if (TotalIndex == 0) {
			if (Profit > 0) {
				TotalElem.classList.add("AurumItem_Profit");
			}
			if (Profit < 0) {
				TotalElem.classList.add("AurumItem_Loss");
			}
		}

		AddRow(TotalElem, GetMonth(TotalIndex), Profit);
		TotalIndex += 1;
	}

	// Experts
	for (var Item of AurumData.Experts) {
		var Elem = document.createElement("li");
		Elem.className = "AurumItem";
		AurumList.appendChild(Elem);

		var Name = document.createElement("h4");
		Name.className = "AurumName";
		Name.innerText = Item.Label;
		Elem.appendChild(Name);

		var Idx = 0;
		for (var Profit of Item.Profits) {
			if (Idx == 0) {
				if (Profit > 0) {
					Elem.classList.add("AurumItem_Profit");
				}
				if (Profit < 0) {
					Elem.classList.add("AurumItem_Loss");
				}
			}
			AddRow(Elem, GetMonth(Idx), Profit);
			Idx += 1;
		}
	}
}
