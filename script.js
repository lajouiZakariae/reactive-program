function MakeReactive(data) {
    this.data = data;
    this.observers = {};

    /* MAKING ALL THE PROPERTIES REACTIVE */
    for (let key in data) {
        let val = data[key];
        Object.defineProperty(this.data, key, {
            get() {
                return val;
            },
            set: (newVal) => {
                val = newVal;
                this.notify(key);
            },
        });
    }

    /* BIND DATA TO THE DOM */
    syncDOM = (prop) => {
        document.querySelectorAll(`[app-bind=${prop}]`).forEach((el) => {
            this.subscribe(prop, (val) => {
                el.textContent = val;
            });
        });
    };

    for (let key in this.data) {
        syncDOM(key); // Subsribing
        this.notify(key); // Notifying When instantiation
    }
}

MakeReactive.prototype.subscribe = function (prop, _observer) {
    // Assigning an empty array if the property doesn't exist
    if (!this.observers[prop]) this.observers[prop] = [];
    this.observers[prop].push(_observer);
};

MakeReactive.prototype.unsubscribe = function (_observer) {
    this.observers = this.observers.filter(_observer);
};

MakeReactive.prototype.notify = function (key) {
    // for (let key in this.observers) {
    this.observers[key].forEach((o) => {
        o(this.data[key]);
    });
    // }
};

const app = new MakeReactive({
    title: "My First Reactive System",
    body: "Lorem ipsum dolor sit amet.",
});

// console.log(app);
app.subscribe("title", console.log);
app.subscribe("body", console.log);
console.log(app);

document.querySelector("button").onclick = function (ev) {
    ev.preventDefault();
    app.data.title = document.querySelector("#title").value;
    app.data.body = document.querySelector("#body").value;
};
