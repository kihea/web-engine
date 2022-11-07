const tabs = document.querySelectorAll('.tab');
function getActiveTab(tabbar) {
    return tabbar.getElementByClassName('active');
}
function LoadContent(content) {
    if (!content) { return; }
    content.style.display = "block";
}
function UnloadContent(content) {
    if (!content) { return; }
    content.style.display = "none";
}
window.addEventListener('DOMContentLoaded', function () {
    tabs.forEach((node) => {
        const id = node.getAttribute('content');
        const contentDiv = document.getElementById(id);
        if (!contentDiv) {
            return;
        }
        const loadEvent = new CustomEvent(id + "load", { content: contentDiv });
        if (node.classList.contains("active")) {
            console.log("what")
            LoadContent(contentDiv);
            document.dispatchEvent(loadEvent);
        } else {
            UnloadContent(contentDiv);
        }
    })
})
