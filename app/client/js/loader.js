(function () {
  /** Create a new HTML element */
  function tag(name, attributes) {
    const element = document.createElement(name);
    if (attributes.text) {
      element.innerText = attributes.text;
      delete attributes.text;
    }
    for (const [attribute, value] of Object.entries(attributes)) {
      element.setAttribute(attribute, value);
    }
    return element;
  }

  //Loader
  const loader = document.querySelector(".loader .loaded");
  loader.addEventListener("gracidea.loaded", ({ data: { text, type, options: { update = false } } }) => {
    const message = tag("span", { text });
    message.append(tag("span", { class: "loading" }));
    if (type) {
      message.setAttribute("style", `color:${{ error: "red", warn: "orange" }[type]};`);
    }
    if (update) {
      loader.querySelector(":first-child")?.remove();
    }
    loader.querySelectorAll(".loading").forEach((element) => element.remove());
    loader.prepend(message);
  }, false);

  //Gracidea app global reference
  const gracidea = {
    sha: document.querySelector("#sha").innerHTML.trim(),
    loaded(text = "", type = null, options = {}) {
      loader.dispatchEvent(Object.assign(new Event("gracidea.loaded"), { data: { text, type, options } }));
    },
  };
  globalThis.gracidea = gracidea;
  console.log(`Gracidea ${gracidea.sha.substring(0, 7)} - https://github.com/lowlighter/gracidea`);
  console.log("All dreams are but another reality. Never forget…");

  //Loading
  globalThis.onload = async function () {
    //Load stylesheet
    const css = tag("link", { rel: "stylesheet", href: `/css/styles.css?sha=${gracidea.sha}` });
    document.querySelector("head").append(css);
    await new Promise((solve) => css.onload = solve);

    //Browser compatibility mode (for bad browsers)
    const compat = (navigator.userAgent.includes("Safari")) && (!navigator.userAgent.includes("Chrome"));
    if (compat) {
      gracidea.loaded("browser compatibility mode enabled", "warn");
    }

    //Debug mode
    const debug = location.hostname === "localhost";
    if (debug) {
      console.warn("debug mode enabled (served from localhost)");
    }

    //Load main script
    gracidea.loaded("loading /js/app.js");
    document.querySelector("body").append(tag("script", { type: "module", src: `/js/app.js?sha=${gracidea.sha}&debug=${debug}` }));
  };

  //Errors display
  globalThis.onerror = function (error) {
    gracidea.loaded(error, "error");
  };
})();
