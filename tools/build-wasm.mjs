import {execSync} from "child_process";
import fs from "fs";

class WasmBuilder {
    run() {
        const fileName = "art-maker.wrapper";
        console.log("Starting build")
        this.#buildWasm(fileName);
        this.#eslintIgnoreGeneratedJs(fileName);
        this.#moveWasmToPublic(fileName);
        console.log("Build completed");
    }

    #buildWasm(fileName) {
        const parameters = [
            // Invokes emcc bind option - required by EMSCRIPTEN_BINDINGS C++ section
            "-lembind",

            // Optimize output file
            "-O2",

            // Modularize output JavaScript file containing only web specific methods
            // These 2 options are required for proper module import in React component
            "-s MODULARIZE=1",
            "-s ENVIRONMENT='web'",

            // Allow using virtual file system in JavaScript code
            "-s EXPORTED_RUNTIME_METHODS=FS",

            // Import SDL2 library from common emscripten ports
            "-s USE_SDL=2",
            "-s USE_SDL_IMAGE=2",
            `-s SDL2_IMAGE_FORMATS="["bmp", "png"]"`,

            // Required for handling large files - can be improved by implementing streaming
            "-s ALLOW_MEMORY_GROWTH=1",

            // Specify C++17 mode
            "-std=c++1z",

            // Source file
            `src/art-maker/art-maker.cpp`,
            `src/art-maker/color-hsl.cpp`,
            `src/art-maker/sdl-helper.cpp`,

            // Output file name (will create .js and .wasm)
            `-o src/art-maker/${fileName}.js`
        ];

        const parametersString = parameters.join(" ");
        execSync(`emcc ${parametersString}`);
    }

    #eslintIgnoreGeneratedJs(fileName) {
        const fileToChange = `src/art-maker/${fileName}.js`;
        const text = "/* eslint-disable */\n";
        const data = fs.readFileSync(fileToChange);

        const fd = fs.openSync(fileToChange, 'w+');
        fs.writeSync(fd, Buffer.from(text), 0, text.length, 0);
        fs.writeSync(fd, data, 0, data.length, text.length);
        fs.closeSync(fd);
    }

    #moveWasmToPublic(fileName) {
        fs.renameSync(`src/art-maker/${fileName}.wasm`, `public/${fileName}.wasm`);
    }
}

new WasmBuilder().run();
