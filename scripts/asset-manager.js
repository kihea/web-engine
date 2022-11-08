class Object {
    constructor(name, children, parent) {
        this.name = name;
        this.parent = parent;
        this.children = children;
    }
    get html() {
        return 
        `<div>
            <span class="caret"></span>
            <button>${this.name}
        </div>`
    }
}