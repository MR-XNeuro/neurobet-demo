
// ==UserScript==
// @name         ScriptEngine Handler #7521
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Demo access code required to unlock this handler.
// @author       Unknown
// @match        *://freebitco.in/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    const VALID_CODES = []; // No valid code provided in public version
    const USED_KEY = 'used_demo_code';

    if (GM_getValue(USED_KEY, false)) {
        alert("❌ Access code expired. Demo is locked.");
        return;
    }

    const userCode = prompt("Enter your Mr. X Demo Access Code:");
    if (!VALID_CODES.includes(userCode)) {
        alert("❌ Invalid access code. Demo unavailable.");
        return;
    }

    GM_setValue(USED_KEY, true);
    console.log("✅ Demo access granted. Running limited test...");

    // Simulated demo action
    setTimeout(() => {
        console.log("🧠 Executing test sequence...");
        setTimeout(() => {
            console.log("🔒 Demo complete.");
            alert("Demo complete. Contact wilicower@gmail.com to request your personal access.");
        }, 3000);
    }, 2000);
})();
