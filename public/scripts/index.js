const tabs = document.querySelectorAll('.tab');
function getActiveTab(tabbar) {
    return tabbar.getElementByClassName('active');
}
function LoadContent(content, eventName) {
    if (!content) { return; }
    eventName = eventName || content.id + "load";
    content.style.display = "block";
    const loadEvent = new CustomEvent(eventName, { content: content });
    document.dispatchEvent(loadEvent);
}
function UnloadContent(content, eventName) {
    if (!content) { return; }
    eventName = eventName || content.id + "unload";
    content.style.display = "none";
    const unloadEvent = new CustomEvent(eventName, { content: content });
    document.dispatchEvent(unloadEvent);
}
window.addEventListener('DOMContentLoaded', function () {
    tabs.forEach((node) => {
        const id = node.getAttribute('content');
        const contentDiv = document.getElementById(id);
        if (!contentDiv) {
            return;
        }
        if (node.classList.contains("active")) {
            LoadContent(contentDiv, `Initial${id}load`);
        } else {
            UnloadContent(contentDiv);
        }
    })
});
