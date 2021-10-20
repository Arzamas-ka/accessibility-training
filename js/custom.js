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

// Logic for Tabs
let keys = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46,
};

let direction = {
  37: -1,
  38: -1,
  39: 1,
  40: 1,
};

let tablist = document.querySelectorAll('[role="tablist"]')[0];
let panels = document.querySelectorAll('[role="tabpanel"]');
let tabs = document.querySelectorAll('[role="tab"]');

function deactivateTabs () {
  for (t = 0; t < tabs.length; t++) {
    tabs[t].setAttribute("tabindex", "-1");
    tabs[t].classList.remove("is-active");
    tabs[t].setAttribute("aria-selected", "false");
    tabs[t].removeEventListener("focus", focusEventHandler);
  }

  for (p = 0; p < panels.length; p++) {
    panels[p].setAttribute("hidden", "hidden");
  }
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

function determineOrientation (event) {
  var key = event.keyCode;
  var vertical = tablist.getAttribute("aria-orientation") == "vertical";
  var proceed = false;

  if (vertical) {
    if (key === keys.up || key === keys.down) {
      event.preventDefault();
      proceed = true;
    }
  } else {
    if (key === keys.left || key === keys.right) {
      proceed = true;
    }
  }

  if (proceed) {
    switchTabOnArrowPress(event);
  }
}

function switchTabOnArrowPress (event) {
  var pressed = event.keyCode;
  for (x = 0; x < tabs.length; x++) {
    tabs[x].addEventListener("focus", focusEventHandler);
  }

  if (direction[pressed]) {
    const { target } = event;
    if (target.index !== undefined) {
      if (tabs[target.index + direction[pressed]]) {
        tabs[target.index + direction[pressed]].focus();
      } else if (pressed === keys.left || pressed === keys.up) {
        focusLastTab();
      } else if (pressed === keys.right || pressed == keys.down) {
        focusFirstTab();
      }
    }
  }
}

function focusFirstTab () {
  tabs[0].focus();
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

function keydownEventListener (event) {
  var key = event.keyCode;

  switch (key) {
    case keys.end:
      event.preventDefault();
      activateTab(tabs[tabs.length - 1]);
      break;
    case keys.home:
      event.preventDefault();
      activateTab(tabs[0]);
      break;

    case keys.up:
    case keys.down:
      determineOrientation(event);
      break;
  }
}

function keyupEventListener (event) {
  var key = event.keyCode;

  switch (key) {
    case keys.left:
    case keys.right:
      determineOrientation(event);
      break;
    case keys.delete:
      determineDeletable(event);
      break;
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
  tabs[index].addEventListener("keyup", keyupEventListener);

  tabs[index].index = index;
}

// Logic for Menu
let appsMenuItems = document.querySelectorAll("#appmenu > li");
let subMenuItems = document.querySelectorAll("#appmenu > li li");
let currentIndex, subIndex;

var gotoIndex = function (idx) {
  if (idx == appsMenuItems.length) {
    idx = 0;
  } else if (idx < 0) {
    idx = appsMenuItems.length - 1;
  }
  appsMenuItems[idx].focus();
  currentIndex = idx;
};

var gotoSubIndex = function (menu, idx) {
  if (menu) {
    var items = menu.querySelectorAll("li");
    if (idx == items.length) {
      idx = 0;
    } else if (idx < 0) {
      idx = items.length - 1;
    }
    items[idx].focus();
    subIndex = idx;
  }
  return;
};

Array.prototype.forEach.call(appsMenuItems, function (el, i) {
  if (0 == i) {
    el.setAttribute("tabindex", "0");
    el.addEventListener("focus", function () {
      currentIndex = 0;
    });
  } else {
    el.setAttribute("tabindex", "-1");
  }
  el.addEventListener("focus", function () {
    subIndex = 0;
    Array.prototype.forEach.call(appsMenuItems, function (el, i) {
      el.setAttribute("aria-expanded", "false");
    });
  });
  el.addEventListener("click", function (event) {
    if (
      this.getAttribute("aria-expanded") == "false" ||
      this.getAttribute("aria-expanded") == null
    ) {
      this.setAttribute("aria-expanded", "true");
    } else {
      this.setAttribute("aria-expanded", "false");
    }
    event.preventDefault();
    return false;
  });
  el.addEventListener("keydown", function (event) {
    var prevdef = false;
    switch (event.keyCode) {
      case keys.right:
        gotoIndex(currentIndex + 1);
        prevdef = true;
        break;
      case keys.left:
        gotoIndex(currentIndex - 1);
        prevdef = true;
        break;
      case keys.tab:
        if (event.shiftKey) {
          gotoIndex(currentIndex - 1);
        } else {
          gotoIndex(currentIndex + 1);
        }
        prevdef = true;
        break;
      case keys.enter:
      case keys.down:
        this.click();
        subindex = 0;
        gotoSubIndex(this.querySelector("ul"), 0);
        prevdef = true;
        break;
      case keys.up:
        this.click();
        var submenu = this.querySelector("ul");
        subindex = submenu.querySelectorAll("li").length - 1;
        gotoSubIndex(submenu, subindex);
        prevdef = true;
        break;
      case keys.esc:
        document.querySelector("#escape").setAttribute("tabindex", "-1");
        document.querySelector("#escape").focus();
        prevdef = true;
    }
    if (prevdef) {
      event.preventDefault();
    }
  });
});

Array.prototype.forEach.call(subMenuItems, function (el, i) {
  el.setAttribute("tabindex", "-1");
  el.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
      case keys.tab:
        if (event.shiftKey) {
          gotoIndex(currentIndex - 1);
        } else {
          gotoIndex(currentIndex + 1);
        }
        prevdef = true;
        break;
      case keys.right:
        gotoIndex(currentIndex + 1);
        prevdef = true;
        break;
      case keys.left:
        gotoIndex(currentIndex - 1);
        prevdef = true;
        break;
      case keys.esc:
        gotoIndex(currentIndex);
        prevdef = true;
        break;
      case keys.down:
        gotoSubIndex(this.parentNode, subIndex + 1);
        prevdef = true;
        break;
      case keys.up:
        gotoSubIndex(this.parentNode, subIndex - 1);
        prevdef = true;
        break;
      case keys.enter:
      case keys.space:
        alert(this.innerText);
        prevdef = true;
        break;
    }
    if (prevdef) {
      event.preventDefault();
      event.stopPropagation();
    }
    return false;
  });
  el.addEventListener("click", function (event) {
    alert(this.innerHTML);
    event.preventDefault();
    event.stopPropagation();
    return false;
  });
});