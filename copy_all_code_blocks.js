// ==UserScript==
// @name         Gemini - Copy All Code Blocks
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a floating button to concatenate and copy all code blocks from a Gemini conversation.
// @author       You
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract and copy all code
    function copyAllCode() {
        // Find all code blocks on the page. Gemini typically uses <pre><code> structures.
        const codeBlocks = document.querySelectorAll('pre code');

        if (codeBlocks.length === 0) {
            alert('No code blocks found on this page.');
            return;
        }

        let concatenatedCode = '';

        codeBlocks.forEach((block, index) => {
            // Append the actual code
            concatenatedCode += block.innerText + '\n';
        });

        // Copy to clipboard using Tampermonkey's built-in function for better cross-site reliability
        GM_setClipboard(concatenatedCode, 'text');

        // Provide visual feedback on the button
        const btn = document.getElementById('tm-copy-all-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Copied to Clipboard! ✓';
        btn.style.backgroundColor = '#188038'; // Change to green success color

        // Reset button text and color after 2 seconds
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = '#1a73e8'; // Back to Google Blue
        }, 2000);
    }

    // Function to inject the floating button into the DOM
    function injectButton() {
        // Prevent injecting multiple buttons
        if (document.getElementById('tm-copy-all-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'tm-copy-all-btn';
        btn.innerText = 'Copy All Code Blocks';

        // Button Styling
        btn.style.position = 'fixed';
        btn.style.bottom = '24px';
        btn.style.right = '24px';
        btn.style.zIndex = '999999';
        btn.style.padding = '12px 20px';
        btn.style.backgroundColor = '#1a73e8';
        btn.style.color = '#ffffff';
        btn.style.border = 'none';
        btn.style.borderRadius = '24px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        btn.style.fontFamily = '"Google Sans", Roboto, Arial, sans-serif';
        btn.style.fontSize = '14px';
        btn.style.fontWeight = '500';
        btn.style.transition = 'background-color 0.2s';

        // Add hover effect
        btn.onmouseover = () => { if (btn.innerText === 'Copy All Code Blocks') btn.style.backgroundColor = '#1557b0'; };
        btn.onmouseout = () => { if (btn.innerText === 'Copy All Code Blocks') btn.style.backgroundColor = '#1a73e8'; };

        btn.addEventListener('click', copyAllCode);
        document.body.appendChild(btn);
    }

    // Because Gemini is a Single Page Application (SPA), the UI constantly re-renders.
    // We use an interval to ensure the button stays on the screen even after navigation.
    setInterval(injectButton, 1000);

})();
