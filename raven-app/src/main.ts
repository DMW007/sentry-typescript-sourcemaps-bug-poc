const path = require('path')
const root = __dirname || process.cwd();
console.log(`root dir: ${root}`)

var Raven = require('raven');
let ravenOptions = {
    release: process.env.RELEASE,
    dataCallback: function (data: any) {
        var stacktrace = data.exception && data.exception[0].stacktrace;

        if (stacktrace && stacktrace.frames) {
            stacktrace.frames.forEach(function (frame: any) {
                if (frame.filename.startsWith('/')) {
                    frame.filename = "app:///" + path.relative(root, frame.filename);
                    console.log(frame.filename)
                }
            });
        }

        return data;
    }
}
Raven.config('http://66ab0e7357f34913818f5f136fe4b46b:b1d57ecaeb144e2cb6cadb71ffd7c7af@localhost:9000/2', ravenOptions).install();
console.log(`release: ${ravenOptions.release}`)

class Foo {
    bar(name: string): boolean {
        console.log(name)
        return true
    }
}

let x = new Foo()
let result: boolean = x.bar('Test123')

throw Error('Test')