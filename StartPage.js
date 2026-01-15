const Content = {
  Links: [
    {
      Label: "Google",
      Links: [
        {
          Label: "Youtube",
          URL: "https://www.youtube.de",
        },
        {
          Label: "Google",
          URL: "https://www.google.de",
        },
        {
          Label: "GMail",
          URL: "https://mail.google.com",
        },
        {
          Label: "Tabellen",
          URL: "https://docs.google.com/spreadsheets/",
          Icon: "https://cdn-icons-png.flaticon.com/512/5968/5968557.png",
        },
        {
          Label: "Dokumente",
          URL: "https://docs.google.com/document/",
          Icon: "https://cdn-icons-png.flaticon.com/512/5968/5968517.png",
        },
      ],
    },
    {
      Label: "Programmieren",
      Links: [
        {
          Label: "Github",
          URL: "https://www.github.com",
        },
        {
          Label: "ChatGPT",
          URL: "https://www.chatgpt.com",
        },
        {
          Label: "Overleaf",
          URL: "https://de.overleaf.com",
        },
      ],
    },
    {
      Label: "Unterhaltung",
      Links: [
        {
          Label: "Serien",
          URL: "https://serienstream.to",
        },
        {
          Label: "Serien",
          URL: "https://bs.to",
        },
        {
          Label: "Aniworld",
          URL: "https://aniworld.to",
        },
        {
          Label: "Aniwatch",
          URL: "https://aniwatchtv.to",
        },
      ],
    },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  UpdateDateTime();
  UpdateLinks();
  UpdateAurum();
  setInterval(UpdateDateTime, 500);
});

function PrettyPrice(Price, Prefix = true, Fixed = 2) {
  Result = parseFloat(Price).toFixed(Fixed);
  if (Prefix && Result >= 0.0) {
    return "+" + Result + " €";
  }
  return Result + " €";
}

function PrettyNumber(Number) {
  return Number <= 9 ? "0" + Number : Number;
}

function DoRequest(Path) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", Path, false);
  xmlHttp.send(null);
  try {
    return JSON.parse(xmlHttp.responseText);
  } catch (error) {
    return null;
  }
}

function UpdateDateTime() {
  const Now = new Date();

  document.getElementById("Time").innerText =
    PrettyNumber(Now.getHours()) +
    ":" +
    PrettyNumber(Now.getMinutes()) +
    ":" +
    PrettyNumber(Now.getSeconds());

  var DayStr = "";
  if (Now.getDay() == 0) {
    DayStr = "Sonntag";
  } else if (Now.getDay() == 1) {
    DayStr = "Montag";
  } else if (Now.getDay() == 2) {
    DayStr = "Dienstag";
  } else if (Now.getDay() == 3) {
    DayStr = "Mittwoch";
  } else if (Now.getDay() == 4) {
    DayStr = "Donnerstag";
  } else if (Now.getDay() == 5) {
    DayStr = "Freitag";
  } else if (Now.getDay() == 6) {
    DayStr = "Samstag";
  }
  document.getElementById("Day").innerText = DayStr;

  document.getElementById("Date").innerText =
    PrettyNumber(Now.getDate()) +
    "." +
    PrettyNumber(Now.getMonth() + 1) +
    "." +
    Now.getFullYear();
}

function UpdateLinks() {
  var LinkList = document.getElementById("LinkList");
  LinkList.innerHTML = "";

  for (var LinkGroup of Content.Links) {
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
          LinkIcon.src =
            "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" +
            IconURL +
            "&size=256";
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
  var AurumExperts = document.getElementById("AurumExperts");
  AurumExperts.innerHTML = "";

  const Endpoint = localStorage.getItem("Aurum");
  if (Endpoint == null) {
    return;
  }

  const PAccount = fetch(Endpoint + "/account_info");
  const PExperts = fetch(Endpoint + "/experts");
  const PPositions = fetch(Endpoint + "/positions_get");
  const POrders = fetch(Endpoint + "/orders_get");
  var PDeals = [];
  var Today = new Date();
  for (let Idx = 0; Idx < 4; Idx++) {
    var MonthDate = new Date(Today.getFullYear(), Today.getMonth() - Idx);
    const StartParam = new Date(
      MonthDate.getFullYear(),
      MonthDate.getMonth(),
      1,
      0,
      0,
      0,
      0
    ).toISOString();
    const StopParam = new Date(
      MonthDate.getFullYear(),
      MonthDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ).toISOString();
    var Deals = fetch(
      Endpoint + "/history_deals_get?Start=" + StartParam + "&Stop=" + StopParam
    );
    PDeals.push(Deals);
  }

  Promise.all([PAccount, PExperts, PPositions, POrders, ...PDeals]).then(
    async (Values) => {
      var Account = await Values[0].json();
      var Experts = await Values[1].json();
      var Positions = await Values[2].json();
      var Orders = await Values[3].json();
      var MonthlyDeals = [];
      for (var Idx = 4; Idx < Values.length; Idx++) {
        MonthlyDeals.push(await Values[Idx].json());
      }

      document.getElementById("Aurum").classList.remove("hidden");
      document.getElementById("Aurum_Balance").innerText =
        "Balance: " + PrettyPrice(Account.balance, false);
      document.getElementById("Aurum_Equity").innerText =
        "Equity: " + PrettyPrice(Account.equity, false);
      document.getElementById("Aurum_Profit").innerText =
        "Profit: " + PrettyPrice(Account.profit);
      document.getElementById("Aurum_Positions").innerText =
        "Positions: " + Positions.length;
      document.getElementById("Aurum_Orders").innerText =
        "Orders: " + Orders.length;
      document.getElementById("Aurum_Insight").href = Endpoint;

      for (const Expert of Experts) {
        var ExpertElem = document.createElement("li");
        ExpertElem.className = "ExpertCard min-w-40 p-2 border";
        AurumExperts.appendChild(ExpertElem);

        var NameElem = document.createElement("h3");
        NameElem.className = "text-center";
        NameElem.innerText = Expert.Name;
        ExpertElem.appendChild(NameElem);

        function AddMonthRow(Month, Profit) {
          var Row = document.createElement("div");
          Row.className = "flex justify-between";
          ExpertElem.appendChild(Row);

          var Elem1 = document.createElement("p");
          Elem1.innerText = Month;
          Row.appendChild(Elem1);

          var Elem2 = document.createElement("p");
          Elem2.innerText = PrettyPrice(Profit);
          Row.appendChild(Elem2);

          if (Profit > 0) {
            Elem2.classList.add("text-green-500");
          } else if (Profit < 0) {
            Elem2.classList.add("text-red-500");
          }
        }

        var Today = new Date();
        for (let Idx = 0; Idx < 4; Idx++) {
          var MonthDate = new Date(Today.getFullYear(), Today.getMonth() - Idx);

          var Profit = 0;
          if (Idx == 0) {
            for (const Position of Positions) {
              if (Position.magic == Expert.MagicNumber) {
                Profit += Position.profit + Position.swap;
              }
            }
          }

          for (const Deal of MonthlyDeals[Idx]) {
            if (Deal.magic == Expert.MagicNumber) {
              Profit += Deal.profit + Deal.swap + Deal.commission;
            }
          }

          AddMonthRow(
            (MonthDate.getMonth() + 1 <= 9 ? "0" : "") +
              (MonthDate.getMonth() + 1) +
              "." +
              MonthDate.getFullYear(),
            Profit
          );
        }
      }
    }
  );
}
