const button = document.getElementById("menuToggle");
const panel = document.getElementById("settingsPanel");

button.addEventListener("click", () => {
    panel.classList.toggle("open");
});

const settingsContent = document.getElementById("settingsContent");
const DEFAULT_SETTINGS = {
    cursorShape: "circle",
    cursorSize: 20,
    cursorColor: "#8b0000",
    cursorBorderColor: "#000000",
    cursorBorderWidth: 1,
    cursorOpacity: 1,
    pointerModeEnabled: true,
    pointerModeColor: "#ffffff",
    cursorSmoothing: 0.15,
    cursorAcceleration: false,
    reducedMotion: false,
    trailEnabled: true,
    trailFrequency: 40,
    accentColor: "#8b0000",
    backgroundColor: "#d8d8d8",
    textColor: "#000000",
    pointerBgColor: "#111111",
    invertPage: false,
    grayscaleMode: false,
    headingFont: "Arial",
    bodyFont: "Arial",
    uppercaseText: false,
    letterSpacing: 0,
    fontWeight: 400,
    uiRadius: 10,
    hoverEnabled: true,
    hoverType: "scale",
    hoverScale: 1.05,
    hoverRotation: 0,
    hoverOpacity: 1,
    hoverSpeed: 1,
    cursorGlow: false,
    cursorGlowColor: "#8b0000",
    trailColor: "#8b0000",
    cursorShadow: false,
    cursorShadowColor: "#000000",
    rippleEnabled: true,
    rippleColor: "#ffffff",
    invertPage: false,
    grayscaleMode: false,
    uppercaseText: false,
};

let settings = JSON.parse(
        localStorage.getItem("cursorSettings")
    ) || { ...DEFAULT_SETTINGS };

function saveSettings() {
    localStorage.setItem(
        "cursorSettings",
        JSON.stringify(settings)
    );
}

function updateSetting(key, value) {
    settings[key] = value;
    saveSettings();
}

function resetSettings() {

    settings = { ...DEFAULT_SETTINGS };

    saveSettings();

    location.reload();
}

/* ==========================================
   CURSOR REFERENCES
========================================== */

const cursor =
    document.getElementById("cursor");

let currentTheme = "cursor";

let mouseX = 0;
let mouseY = 0;

let cursorX = 0;
let cursorY = 0;

let cursorState = "default";

/* ==========================================
   APPLY SETTINGS
========================================== */

function applySettings() {

    cursor.style.width =
        settings.cursorSize + "px";

    cursor.style.height =
        settings.cursorSize + "px";

    cursor.style.background =
        settings.cursorColor;

    cursor.style.borderColor =
        settings.cursorBorderColor;

    cursor.style.borderWidth =
        settings.cursorBorderWidth + "px";

    cursor.style.opacity =
        settings.cursorOpacity;

    cursor.classList.remove(
        "circle",
        "square",
        "diamond",
        "ring",
        "dot"
    );

    cursor.classList.add(
        settings.cursorShape
    );

    document.documentElement
        .style
        .setProperty(
            "--pointer-bg",
            settings.pointerBgColor
        );

    document.body.style.letterSpacing =
        settings.letterSpacing + "px";

    document.body.style.fontWeight =
        settings.fontWeight;

    document.documentElement
        .style
        .setProperty(
            "--radius",
            settings.uiRadius + "px"
        );

    document.body.dataset.hoverEnabled =
        settings.hoverEnabled;

    document.body.dataset.hoverType =
        settings.hoverType;

    if (settings.cursorGlow) {

        cursor.style.boxShadow =
            `0 0 25px ${settings.cursorGlowColor}`;

    } else {

        cursor.style.boxShadow = "none";
    }

    if (settings.cursorShadow) {

        cursor.style.filter =
            `drop-shadow(0 0 12px ${settings.cursorShadowColor})`;

    } else {

        cursor.style.filter = "none";
    }

    document.querySelector(".newspaper").style.textTransform =
    settings.uppercaseText
        ? "uppercase"
        : "none";
}

applySettings();

/* ==========================================
   CURSOR STATES
========================================== */

function setCursorState(state) {

    if (cursorState === state) return;

    cursorState = state;

    cursor.classList.remove(
        "cursor--default",
        "cursor--pointer",
        "cursor--active"
    );

    cursor.classList.add(
        `cursor--${state}`
    );
}

function detectCursorState(target) {

    const isPointerTarget =
        target.closest(
            ".hoverable, button, a, input, select, textarea, [data-clickable]"
        );

    if (
        isPointerTarget &&
        settings.pointerModeEnabled
    ) {
        setCursorState("pointer");
    } else {
        setCursorState("default");
    }
}

/* ==========================================
   MOUSE TRACKING
========================================== */

document.addEventListener("mousemove", e => {

    mouseX = e.clientX;
    mouseY = e.clientY;

    detectCursorState(e.target);

    if (
        settings.trailEnabled &&
        Math.random() < (settings.trailFrequency / 100)
    ) {
        createTrail(e.clientX, e.clientY);
    }
});

/* ==========================================
   CURSOR ANIMATION
========================================== */

function animateCursor() {

    const dx =
        mouseX - cursorX;

    const dy =
        mouseY - cursorY;

    const factor =
        settings.cursorAcceleration
            ? settings.cursorSmoothing * 1.8
            : settings.cursorSmoothing;

    cursorX += dx * factor;
    cursorY += dy * factor;

    cursor.style.left =
        cursorX + "px";

    cursor.style.top =
        cursorY + "px";

    if (!settings.reducedMotion) {

        requestAnimationFrame(
            animateCursor
        );
    }
}

animateCursor();

/* ==========================================
   TRAIL SYSTEM
========================================== */

function createTrail(x, y) {

    const trail = document.createElement("div");
    trail.classList.add("trail");

    trail.style.left = x + "px";
    trail.style.top = y + "px";

    trail.style.background = settings.trailColor;

    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 600);
}

/* ==========================================
   CLICK STATES
========================================== */

document.addEventListener(
    "mousedown",
    () => {

        setCursorState("active");
    }
);

document.addEventListener(
    "mouseup",
    () => {

        setCursorState("default");
    }
);

/* ==========================================
   NAVIGATION
========================================== */

const navItems =
    document.querySelectorAll(".nav-item");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(btn =>
            btn.classList.remove("active")
        );

        item.classList.add("active");

        selectTheme(
            item.dataset.theme
        );
    });

});

/* ==========================================
   LOAD SETTINGS INTO CURRENT TAB
========================================== */

function loadSettingsIntoUI() {

    Object.keys(settings)
        .forEach(key => {

            const element =
                document.getElementById(key);

            if (!element) return;

            if (
                element.type === "checkbox"
            ) {

                element.checked =
                    settings[key];

            } else {

                element.value =
                    settings[key];
            }
        });
}

/* ==========================================
   THEME SWITCHER
========================================== */

function selectTheme(name) {

    currentTheme = name;

    settingsContent.innerHTML =
        themes[name];

    loadSettingsIntoUI();

    setupThemeEvents();
}

/* ==========================================
   THEMES / PANELS
========================================== */

const themes = {

cursor: `

<div class="setting-row">
    <span>Cursor Shape</span>
    <select id="cursorShape">
        <option value="circle">Circle</option>
        <option value="square">Square</option>
        <option value="diamond">Diamond</option>
        <option value="ring">Ring</option>
        <option value="dot">Dot</option>
    </select>
</div>

<div class="setting-row">
    <span>Cursor Size</span>
    <input
        type="range"
        id="cursorSize"
        min="5"
        max="100"
        value="20"
    >
</div>

<div class="setting-row">
    <span>Cursor Color</span>
    <input
        type="color"
        id="cursorColor"
        value="#8b0000"
    >
</div>

<div class="setting-row">
    <span>Border Color</span>
    <input
        type="color"
        id="cursorBorderColor"
        value="#000000"
    >
</div>

<div class="setting-row">
    <span>Border Width</span>
    <input
        type="range"
        id="cursorBorderWidth"
        min="0"
        max="10"
        value="1"
    >
</div>

<div class="setting-row">
    <span>Opacity</span>
    <input
        type="range"
        id="cursorOpacity"
        min="0.1"
        max="1"
        step="0.05"
        value="1"
    >
</div>

<div class="setting-row">
    <span>Smoothing</span>
    <input
        type="range"
        id="cursorSmoothing"
        min="0.02"
        max="0.5"
        step="0.01"
        value="0.15"
    >
</div>

<div class="setting-row">
    <span>Acceleration</span>
    <input
        type="checkbox"
        id="cursorAcceleration"
    >
</div>

<div class="setting-row">
    <span>Reduced Motion</span>
    <input
        type="checkbox"
        id="reducedMotion"
    >
</div>

`,

colors: `

<div class="setting-row">
    <span>Accent Color</span>
    <input
        type="color"
        id="accentColor"
        value="#8b0000"
    >
</div>

<div class="setting-row">
    <span>Background Color</span>
    <input
        type="color"
        id="backgroundColor"
        value="#d8d8d8"
    >
</div>

<div class="setting-row">
    <span>Text Color</span>
    <input
        type="color"
        id="textColor"
        value="#000000"
    >
</div>

<div class="setting-row">
    <span>Invert Page</span>
    <input
        type="checkbox"
        id="invertPage"
    >
</div>

<div class="setting-row">
    <span>Grayscale Mode</span>
    <input
        type="checkbox"
        id="grayscaleMode"
    >
</div>

`,

fonts: `

<div class="setting-row">
    <span>Heading Font</span>
    <select id="headingFont">

        <option>Arial</option>
        <option>Georgia</option>
        <option>Tahoma</option>
        <option>Times New Roman</option>

    </select>
</div>

<div class="setting-row">
    <span>Body Font</span>
    <select id="bodyFont">

        <option>Arial</option>
        <option>Georgia</option>
        <option>Tahoma</option>
        <option>Times New Roman</option>

    </select>
</div>

<div class="setting-row">
    <span>Font Weight</span>
    <input
        type="range"
        id="fontWeight"
        min="100"
        max="900"
        step="100"
    >
</div>

<div class="setting-row">
    <span>Border Radius</span>
    <input
        type="range"
        id="uiRadius"
        min="0"
        max="40"
    >
</div>

<div class="setting-row">
    <span>Uppercase Text</span>
    <input
        type="checkbox"
        id="uppercaseText"
    >
</div>

`,

hover: `

<div class="setting-row">
    <span>Hover Enabled</span>
    <input
        type="checkbox"
        id="hoverEnabled"
    >
</div>

<div class="setting-row">
    <span>Scale</span>
    <input
        type="range"
        id="hoverScale"
        min="1"
        max="2"
        step="0.05"
    >
</div>

<div class="setting-row">
    <span>Rotation</span>
    <input
        type="range"
        id="hoverRotation"
        min="0"
        max="30"
    >
</div>

<div class="setting-row">
    <span>Opacity</span>
    <input
        type="range"
        id="hoverOpacity"
        min="0.1"
        max="1"
        step="0.05"
    >
</div>

<div class="setting-row">
    <span>Speed</span>
    <input
        type="range"
        id="hoverSpeed"
        min="0.1"
        max="3"
        step="0.1"
    >
</div>

`,

effects: `

<div class="setting-row">
    <span>Trail Enabled</span>
    <input
        type="checkbox"
        id="trailEnabled"
    >
</div>

<div class="setting-row">
    <span>Trail Density</span>
    <input
        type="range"
        id="trailFrequency"
        min="1"
        max="100"
        value="50"
    >
</div>

<div class="setting-row">
    <span>Trail Color</span>
    <input
        type="color"
        id="trailColor"
        value="#8b0000"
    >
</div>

<div class="setting-row">
    <span>Cursor Glow</span>
    <input
        type="checkbox"
        id="cursorGlow"
    >
</div>

<div class="setting-row">
    <span>Glow Color</span>
    <input
        type="color"
        id="cursorGlowColor"
        value="#8b0000"
    >
</div>

<div class="setting-row">
    <span>Cursor Shadow</span>
    <input
        type="checkbox"
        id="cursorShadow"
    >
</div>

<div class="setting-row">
    <span>Shadow Color</span>
    <input
        type="color"
        id="cursorShadowColor"
        value="#000000"
    >
</div>

<div class="setting-row">
    <span>Ripple Enabled</span>
    <input
        type="checkbox"
        id="rippleEnabled"
    >
</div>

<div class="setting-row">
    <span>Ripple Color</span>
    <input
        type="color"
        id="rippleColor"
        value="#ffffff"
    >
</div>

<div class="setting-row">
    <button id="resetSettings">
        Reset Settings
    </button>
</div>

`
};

/* ==========================================
   SETTINGS EVENTS
========================================== */

function setupThemeEvents() {

    bindRange("cursorSize", value => {

        updateSetting("cursorSize", Number(value));

        cursor.style.width = value + "px";
        cursor.style.height = value + "px";

    });

    bindColor("cursorColor", value => {

        updateSetting("cursorColor", value);

        document.documentElement
            .style
            .setProperty(
                "--cursor-color",
                value
            );

        cursor.style.background = value;

    });

    bindColor("cursorBorderColor", value => {

        updateSetting(
            "cursorBorderColor",
            value
        );

        cursor.style.borderColor = value;

    });

    bindRange("cursorBorderWidth", value => {

        updateSetting(
            "cursorBorderWidth",
            Number(value)
        );

        cursor.style.borderWidth =
            value + "px";

    });

    bindRange("cursorOpacity", value => {

        updateSetting(
            "cursorOpacity",
            Number(value)
        );

        cursor.style.opacity = value;

    });

    bindSelect("cursorShape", value => {

        updateSetting(
            "cursorShape",
            value
        );

        cursor.classList.remove(
            "circle",
            "square",
            "diamond",
            "ring",
            "dot"
        );

        cursor.classList.add(value);

    });

    bindCheckbox(
        "pointerModeEnabled",
        value => {

            updateSetting(
                "pointerModeEnabled",
                value
            );

        }
    );

    bindColor(
        "pointerModeColor",
        value => {

            updateSetting(
                "pointerModeColor",
                value
            );

            document.documentElement
                .style
                .setProperty(
                    "--pointer-color",
                    value
                );

        }
    );

    bindRange(
        "cursorSmoothing",
        value => {

            updateSetting(
                "cursorSmoothing",
                parseFloat(value)
            );

        }
    );

    bindCheckbox(
        "cursorAcceleration",
        value => {

            updateSetting(
                "cursorAcceleration",
                value
            );

        }
    );

    bindCheckbox(
        "reducedMotion",
        value => {

            updateSetting(
                "reducedMotion",
                value
            );

            if (!value) {

                animateCursor();

            }

        }
    );

    /* COLORS */

    bindColor(
        "accentColor",
        value => {

            updateSetting(
                "accentColor",
                value
            );

            document.documentElement
                .style
                .setProperty(
                    "--red",
                    value
                );

        }
    );

    bindColor(
        "backgroundColor",
        value => {

            updateSetting(
                "backgroundColor",
                value
            );

            document.documentElement
                .style
                .setProperty(
                    "--gray",
                    value
                );

        }
    );

    bindColor(
        "textColor",
        value => {

            updateSetting(
                "textColor",
                value
            );

            document.documentElement.style.setProperty(
    "--text-color",
    value
);

        }
    );

    bindColor(
        "pointerBgColor",
        value => {

            updateSetting(
                "pointerBgColor",
                value
            );

            document.documentElement
                .style
                .setProperty(
                    "--pointer-bg",
                    value
                );

        }
    );

    bindCheckbox(
    "invertPage",
    value => {

        updateSetting(
            "invertPage",
            value
        );

        updatePageFilter();

    }
);

bindCheckbox(
    "grayscaleMode",
    value => {

        updateSetting(
            "grayscaleMode",
            value
        );

        updatePageFilter();

    }
);

    /* FONTS */

    bindSelect(
        "headingFont",
        value => {

            updateSetting(
                "headingFont",
                value
            );

            document
                .querySelectorAll("h1,h2,h3")
                .forEach(el => {

                    el.style.fontFamily =
                        value;

                });

        }
    );

bindCheckbox(
    "uppercaseText",
    value => {

        updateSetting(
            "uppercaseText",
            value
        );

        const el =
            document.querySelector(".newspaper");

        el.style.textTransform =
            value ? "uppercase" : "none";

        el.style.fontSize =
            value ? "85%" : "100%";

    }
);

    bindSelect(
        "bodyFont",
        value => {

            updateSetting(
                "bodyFont",
                value
            );

            document
                .querySelector(".newspaper")
                .style.fontFamily =
                value;

        }
    );

    bindRange(
        "letterSpacing",
        value => {

            updateSetting(
                "letterSpacing",
                Number(value)
            );

            document.body.style.letterSpacing =
                value + "px";

        }
    );

    bindRange(
        "fontWeight",
        value => {

            updateSetting(
                "fontWeight",
                Number(value)
            );

            document.body.style.fontWeight =
                value;

        }
    );

    bindRange(
        "uiRadius",
        value => {

            updateSetting(
                "uiRadius",
                Number(value)
            );

            document.documentElement
                .style
                .setProperty(
                    "--radius",
                    value + "px"
                );

        }
    );

    /* HOVER */

    bindCheckbox(
        "hoverEnabled",
        value => {

            updateSetting(
                "hoverEnabled",
                value
            );

            document.body.dataset.hoverEnabled =
                value;

        }
    );

    bindSelect(
        "hoverType",
        value => {

            updateSetting(
                "hoverType",
                value
            );

        }
    );

    bindRange(
        "hoverScale",
        value => {

            updateSetting(
                "hoverScale",
                Number(value)
            );

            document.documentElement
                .style
                .setProperty(
                    "--hover-scale",
                    value
                );

        }
    );

    bindRange(
        "hoverRotation",
        value => {

            updateSetting(
                "hoverRotation",
                Number(value)
            );

            document.documentElement
                .style
                .setProperty(
                    "--hover-rotation",
                    value + "deg"
                );

        }
    );

    bindRange(
        "hoverOpacity",
        value => {

            updateSetting(
                "hoverOpacity",
                Number(value)
            );

            document.documentElement
                .style
                .setProperty(
                    "--hover-opacity",
                    value
                );

        }
    );

    bindRange(
    "hoverSpeed",
    value => {

        updateSetting(
            "hoverSpeed",
            Number(value)
        );

        document.documentElement
            .style
            .setProperty(
                "--hover-speed",
                value + "s"
            );

    }
);

    /* EFFECTS */

    bindCheckbox(
        "trailEnabled",
        value => {

            updateSetting(
                "trailEnabled",
                value
            );

        }
    ); 

    bindRange(
        "trailFrequency",
        value => {

            updateSetting(
                "trailFrequency",
                parseFloat(value)
            );

        }
    );

        bindColor(
        "trailColor",
        value => {

            updateSetting(
                "trailColor",
                value
            );

        }
    );

    bindCheckbox(
        "cursorGlow",
        value => {

            updateSetting(
                "cursorGlow",
                value
            );

            applySettings();

        }
    );

    bindColor(
        "cursorGlowColor",
        value => {

            updateSetting(
                "cursorGlowColor",
                value
            );

            applySettings();

        }
    );

    bindCheckbox(
        "cursorShadow",
        value => {

            updateSetting(
                "cursorShadow",
                value
            );

            applySettings();

        }
    );

    bindColor(
        "cursorShadowColor",
        value => {

            updateSetting(
                "cursorShadowColor",
                value
            );

            applySettings();

        }
    );

    bindCheckbox(
        "rippleEnabled",
        value => {

            updateSetting(
                "rippleEnabled",
                value
            );

        }
    );

    bindColor(
        "rippleColor",
        value => {

            updateSetting(
                "rippleColor",
                value
            );

        }
    );

    setupUtilityButtons();
}

/* ==========================================
   HELPERS
========================================== */

function bindRange(id, callback) {

    const el =
        document.getElementById(id);

    if (!el) return;

    el.addEventListener(
        "input",
        e => callback(e.target.value)
    );
}

function bindColor(id, callback) {

    const el =
        document.getElementById(id);

    if (!el) return;

    el.addEventListener(
        "input",
        e => callback(e.target.value)
    );
}

function bindSelect(id, callback) {

    const el =
        document.getElementById(id);

    if (!el) return;

    el.addEventListener(
        "change",
        e => callback(e.target.value)
    );
}

function bindCheckbox(id, callback) {

    const el =
        document.getElementById(id);

    if (!el) return;

    el.addEventListener(
        "change",
        e => callback(e.target.checked)
    );
}

/* ==========================================
   PRESET BUTTONS
========================================== */

function setupUtilityButtons() {

    const resetBtn =
        document.getElementById(
            "resetSettings"
        );

    if (resetBtn) {

        resetBtn.onclick = () => {

            localStorage.removeItem(
                "cursorSettings"
            );

            location.reload();
        };
    }

    const exportBtn =
        document.getElementById(
            "exportPreset"
        );

    if (exportBtn) {

        exportBtn.onclick = () => {

            navigator.clipboard.writeText(
                JSON.stringify(
                    settings,
                    null,
                    2
                )
            );

            alert(
                "Preset copied."
            );
        };
    }

    const importBtn =
        document.getElementById(
            "importPreset"
        );

    if (importBtn) {

        importBtn.onclick = () => {

            const data =
                prompt(
                    "Paste preset JSON"
                );

            if (!data) return;

            try {

                settings =
                    JSON.parse(data);

                saveSettings();

                location.reload();

            } catch {

                alert(
                    "Invalid preset."
                );
            }
        };
    }
}

/* ==========================================
   RIPPLE EFFECT
========================================== */

document.addEventListener(
    "click",
    e => {

        if (
            !settings.rippleEnabled
        ) return;

        const ripple =
            document.createElement("div");

        ripple.className =
            "click-ripple";

        ripple.style.left =
            e.clientX + "px";

        ripple.style.top =
            e.clientY + "px";

        ripple.style.borderColor =
            settings.rippleColor;

        document.body.appendChild(
            ripple
        );

        setTimeout(() => {

            ripple.remove();

        }, 600);
    }
);

  function updatePageFilter() {

    let filters = [];

    if (settings.invertPage)
        filters.push("invert(1)");

    if (settings.grayscaleMode)
        filters.push("grayscale(1)");

    document.querySelector(".layout").style.filter =
    filters.join(" ");
}

/* ==========================================
   INITIALIZE
========================================== */

selectTheme("cursor");
applySettings();
updatePageFilter();