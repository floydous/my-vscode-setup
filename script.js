document.addEventListener("DOMContentLoaded", function () {
    // This interval checks until the command palette element is loaded in VS Code.
    const checkElement = setInterval(() => {
        const commandDialog = document.querySelector(".quick-input-widget");
        if (commandDialog) {
            // Apply the blur effect immediately if the command dialog is already visible on load.
            if (commandDialog.style.display !== "none") {
                runMyScript();
            }

            // This is the best part of your code!
            // The MutationObserver reliably watches for when the command palette appears or disappears.
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "attributes" && mutation.attributeName === "style") {
                        if (commandDialog.style.display === "none") {
                            // If the palette is hidden, remove the blur.
                            handleEscape();
                        } else {
                            // If the palette is visible, apply the blur.
                            runMyScript();
                        }
                    }
                });
            });

            // Tell the observer to watch the commandDialog for changes to its 'style' attribute.
            observer.observe(commandDialog, { attributes: true });

            // Stop checking for the element once we've found it and set up the observer.
            clearInterval(checkElement);
        }
    }, 500); // Check every 500ms.

    // This listener correctly removes the blur when you press the Escape key.
    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Escape" || event.key === "Esc") {
                handleEscape();
            }
        },
        true
    );

    /**
     * This function creates and applies the blur overlay.
     */
    function runMyScript() {
        const targetDiv = document.querySelector(".monaco-workbench");

        // Prevent multiple overlays from being added.
        const existingElement = document.getElementById("command-blur");
        if (existingElement) {
            return;
        }

        const newElement = document.createElement("div");
        newElement.setAttribute("id", "command-blur");

        // Also remove the blur if the overlay itself is clicked.
        newElement.addEventListener("click", function () {
            newElement.remove();
        });

        targetDiv.appendChild(newElement);
    }

    /**
     * This function removes the blur overlay.
     */
    function handleEscape() {
        const element = document.getElementById("command-blur");
        // A simple click() triggers the remove event listener we added in runMyScript.
        if (element) {
            element.click();
        }
    }
});
