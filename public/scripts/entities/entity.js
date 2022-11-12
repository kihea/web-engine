class Component {
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
    }
    setParent(p) {
        this.parent = p;
    }
}
class Entity {
    constructor(name) {
        this.name = name;
        this.components = {};
        this.handlers = {};
        
    }
}
