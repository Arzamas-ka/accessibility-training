(function () {
  var burger = document.querySelector(".burger");
  var menu = document.querySelector("#" + burger.dataset.target);
  burger.addEventListener("click", function () {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");
  });
})();

document.querySelectorAll("#nav li").forEach(function (navEl) {
  navEl.onclick = function () {
    toggleTab(this.id, this.dataset.target);
  };
});

function toggleTab (selectedNav, targetId) {
  var navEls = document.querySelectorAll("#nav li");

  navEls.forEach(function (navEl) {
    if (navEl.id == selectedNav) {
      navEl.classList.add("is-active");
    } else {
      if (navEl.classList.contains("is-active")) {
        navEl.classList.remove("is-active");
      }
    }
  });

  var tabs = document.querySelectorAll(".tab-pane");

  tabs.forEach(function (tab) {
    if (tab.id == targetId) {
      tab.style.display = "block";
    } else {
      tab.style.display = "none";
    }
  });
}


// Custom logic
// Activates any given tab panel
panels = document.querySelectorAll('[role="tabpanel"]');
tabs = document.querySelectorAll('[role="tab"]');

function deactivateTabs () {
  for (t = 0; t < tabs.length; t++) {
    tabs[t].classList.remove("is-active");
    tabs[t].setAttribute("aria-selected", "false");
    tabs[t].setAttribute("tabindex", "-1");
    tabs[t].removeEventListener("focus", focusEventHandler);
  }

  for (p = 0; p < panels.length; p++) {
    panels[p].setAttribute("hidden", "hidden");
  }
}

function focusEventHandler (event) {
  const { target } = event;
  setTimeout((target) => {
    focused = document.activeElement;

    if (target === focused) {
      activateTab(target, false);
    }
  }, 500, target);
}

function activateTab (tab, setFocus) {
  setFocus = setFocus || true;
  deactivateTabs();
  // remove tabindex attribute
  tab.removeAttribute("tabindex");
  // set selected tab
  tab.classList.add("is-active");
  tab.setAttribute("aria-selected", "true");
  // get the value of aria-controls
  var controls = tab.getAttribute("aria-controls");
  // make tab panel is visible
  document.getElementById(controls).removeAttribute("hidden");
  // set focus when required
  if (setFocus) {
    tab.focus();
  }
}

function clickEventListener (event) {
  var tab = event.currentTarget;
  activateTab(tab, false);
}

for (i = 0; i < tabs.length; ++i) {
  addListeners(i);
}
function addListeners (index) {
  tabs[index].addEventListener("click", clickEventListener);
  tabs[index].addEventListener("keydown", keydownEventListener);
  // tabs[index].addEventListener("keyup", keyupEventListener);

  tabs[index].index = index;
}