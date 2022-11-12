const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
var dropzones = document.querySelectorAll('.tab-area');
var draggables = document.querySelectorAll('.tab');
var views = document.querySelectorAll('.view');
let previousTabBar;


function reorderTabs(tabList) {

    tabList.sort((a, b) => {
        const abox = a.getBoundingClientRect();
        const bbox = b.getBoundingClientRect();

        const amid = abox.left + .5 * abox.width;
        const bmid = bbox.right - .5 * bbox.width;

        return amid - bmid;
    });
    let n = 0;
    tabList.map((t) => {
        t.style.left = `${n * t.getBoundingClientRect().width}px`;
        n += 1;
        return t;
    })
}
dropzones.forEach((elem) => {
    elem.addEventListener('dragover', function (event) {
        
        event.preventDefault();
        return;

        
    });

    elem.addEventListener('drop', function (event) {
        
        const tabBar = elem;
        if (tabBar === previousTabBar || !tabBar.classList.contains('tab-area')) { return; }
        const data = JSON.parse(event.dataTransfer.getData("text"));

        if (data.type !== "tab") { return; }
        const id = data.id;
        const content = data.content ? document.getElementById(data.content) : null;

        const element = document.getElementById(id);
        var previousBarTabs = previousTabBar ? [].slice.call(previousTabBar.getElementsByClassName('tab')) : [];
        var tabBarTabs = tabBar.querySelectorAll('.tab');
        previousBarTabs.splice(previousBarTabs.indexOf(element), 1);
        for (const tab of previousBarTabs) {

            tab.classList.remove('active');
        }
        if (previousBarTabs[0]) {
            previousBarTabs[0].classList.add('active');
            LoadContent(document.getElementById(previousBarTabs[0].getAttribute('content')));
        }
        for (const tab of tabBarTabs) {
            if (tab.classList.contains('active')) {
                UnloadContent(document.getElementById(tab.getAttribute('content')))
                tab.classList.remove('active');
            }
        }
        reorderTabs(previousBarTabs);

        element.classList.add('active');
        //element.style.left = `0px`;
        tabBar.appendChild(element);
        tabBar.parentNode.appendChild(content);
        LoadContent(content);
        const tabmoveevent = new CustomEvent("tabmoved", {
            detail: {
                tab: element,
                content: content,
                parentNode: tabBar.parentNode
            }
        });
        document.dispatchEvent(tabmoveevent);
        //reorderTabs(tabBar.querySelectorAll('.tab'));
        previousTabBar = undefined;

    });
    let k = [].slice.call(elem.getElementsByClassName('tab'));
    reorderTabs(k);
})
function delta(event) {
    const targetRect = event.target.getBoundingClientRect();
    const targetX = event.layerX;
    if (targetX < targetRect.width + 10 && targetX > -10) {
        event.target.style.left = `${clamp(targetX, 0, targetRect.width)}px`;
        return;
    }
}
let targ;
draggables.forEach((elem) => {
    elem.addEventListener('dragstart', function (event) {
        event.dataTransfer.clearData();

        targ = elem;
        previousTabBar = elem.parentElement;
        var tabs = [].slice.call(previousTabBar.getElementsByClassName('tab'));
        for (const tab of tabs) {
            if (tab.classList.contains("active")) {
                UnloadContent(document.getElementById(tab.getAttribute('content')));
                tab.classList.remove("active");
            }

        }
        LoadContent(document.getElementById(elem.getAttribute('content')));
        elem.classList.add('active');
        event.dataTransfer.setData('text/plain', JSON.stringify({
            id: elem.id,
            content: elem.getAttribute('content'),
            type: "tab"
        }));
    });
    elem.addEventListener('dragend', function (event) {
        targ = undefined;
        reorderTabs([].slice.call(event.target.parentElement.getElementsByClassName('tab')));
    });
    elem.addEventListener('click', function (event) {
        var tabs = [].slice.call(elem.parentElement.getElementsByClassName('tab'));
        for (const tab of tabs) {
            if (tab.classList.contains("active")) {
                UnloadContent(document.getElementById(tab.getAttribute('content')));
                tab.classList.remove("active");
            }

        }
        LoadContent(document.getElementById(elem.getAttribute('content')));
        elem.classList.add('active');

    })
});

document.ondragover = function (evt) {
    evt = evt || window.event;
    var x = evt.pageX,
        y = evt.pageY;
    if (evt.target.classList.contains('tab')) {
        const targetRect = evt.target.parentElement.getBoundingClientRect();
        const targetX = x - targetRect.left;
        if (targetX < targetRect.width + 10 && targetX > -10) {

            targ.style.left = `${clamp(targetX - .5 * targ.getBoundingClientRect().width, 0, targetRect.width)}px`;
            let tabs = [].slice.call(evt.target.parentElement.getElementsByClassName('tab'));
            //tabs = tabs.slice(tabs.indexOf(evt.target), 1);
            tabs.splice(tabs.indexOf(evt.target), 1);
            reorderTabs(tabs);
        }
    }

}
