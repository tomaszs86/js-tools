class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello2, " + this.greeting;
    }
}

let greeter = new Greeter("test1");