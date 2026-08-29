document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#link-groups").innerHTML = startPageContent.LinkGroups.map(
        ({ Label, Links }, i) =>
            `<section class="${i ? "border-l " : ""}border-white/15 px-[clamp(8px,2vw,24px)] py-4"><h2 class="mb-2 font-mono text-[0.65rem] font-normal tracking-[0.14em] text-[#a5a7ac] uppercase">${Label}</h2><ul class="grid list-none gap-0.5 p-0">${Links.map(({ Label, URL, Icon }) => `<li><a class="group grid min-h-10 grid-cols-[32px_minmax(0,1fr)] items-center gap-2 px-1 py-1 text-sm transition duration-150 hover:bg-white/8 hover:text-[#f4f2ed] active:scale-[0.99] active:bg-white/12 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6c7a1] max-[520px]:grid-cols-[28px_minmax(0,1fr)] max-[520px]:px-0 max-[520px]:text-xs" href="${URL}"><span class="grid size-8 place-items-center border border-white/15 bg-white/4 font-mono text-[0.6rem] text-[#d6c7a1] transition-colors group-hover:border-[#d6c7a1]/50 group-hover:bg-[#d6c7a1]/10 group-hover:text-[#f2d58b] max-[520px]:size-7" aria-hidden="true"><img class="size-5" src="${Icon || `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${URL}&size=256`}" alt=""></span><span class="truncate">${Label}</span></a></li>`).join("")}</ul></section>`,
    ).join("");

    const time = document.querySelector("time");
    const [weekday, date] = document.querySelectorAll('[aria-label="Datum und Uhrzeit"] p');

    function updateTime() {
        const now = new Date();
        time.textContent = now.toLocaleTimeString("de-DE");
        weekday.textContent = now.toLocaleDateString("de-DE", { weekday: "long" });
        date.textContent = now.toLocaleDateString("de-DE");
    }

    updateTime();
    setInterval(updateTime, 1000);

    const searchForm = document.querySelector("#search-form");
    const searchQuery = document.querySelector("#search-query");
    const searchEngine = document.querySelector("#search-engine");
    const searchEngines = {
        google: "https://www.google.com/search?q=",
        duckduckgo: "https://duckduckgo.com/?q=",
        brave: "https://search.brave.com/search?q=",
        bing: "https://www.bing.com/search?q=",
    };
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchQuery.value.trim();
        if (query) window.location.assign(searchEngines[searchEngine.value] + encodeURIComponent(query));
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "/" && document.activeElement !== searchQuery && document.activeElement.tagName !== "INPUT") {
            event.preventDefault();
            searchQuery.focus();
        }
    });

    const serverAddress = document.querySelector("#server-address");
    const secondaryServerAddress = document.querySelector("#server-address-secondary");
    const serverAddressToggle = document.querySelector("#server-address-toggle");
    const secondaryServerAddressToggle = document.querySelector("#server-address-secondary-toggle");
    const serverPanel = document.querySelector("#server-panel");
    const serverPanelOpen = document.querySelector("#server-panel-open");
    const serverPanelClose = document.querySelector("#server-panel-close");

    function setServerPanel(isOpen) {
        serverPanel.classList.toggle("hidden", !isOpen);
        serverPanelOpen.classList.toggle("hidden", isOpen);
        serverPanelOpen.setAttribute("aria-expanded", String(isOpen));
        serverPanel.toggleAttribute("inert", !isOpen);
        (isOpen ? serverAddress : serverPanelOpen).focus();
    }

    serverPanelOpen.addEventListener("click", () => setServerPanel(true));
    serverPanelClose.addEventListener("click", () => setServerPanel(false));
    function toggleServerAddressVisibility(address, toggle) {
        const isHidden = address.type === "password";
        address.type = isHidden ? "text" : "password";
        toggle.setAttribute("aria-pressed", String(isHidden));
        toggle.setAttribute("aria-label", isHidden ? "IP-Adresse verbergen" : "IP-Adresse anzeigen");
    }

    serverAddressToggle.addEventListener("click", () => {
        toggleServerAddressVisibility(serverAddress, serverAddressToggle);
    });
    secondaryServerAddressToggle.addEventListener("click", () => {
        toggleServerAddressVisibility(secondaryServerAddress, secondaryServerAddressToggle);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !serverPanel.classList.contains("hidden")) setServerPanel(false);
    });
});
