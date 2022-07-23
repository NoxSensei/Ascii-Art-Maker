export class ImageConverterService {
    private readonly module: any;

    private constructor(module: any) {
        this.module = module;
    }

    public static async createInstance() {
        // Cannot use 'import' statement cause of emscripten handling esmodule issue
        // https://github.com/emscripten-core/emscripten/issues/11792
        const Module = require("./hello_world");
        const module = await Module();
        return new ImageConverterService(module);
    }

    public async formatToAscii(file: File) {
        const fileName = "tmpFileName.jpeg";

        const module = this.module;
        let stream = module.FS.open(fileName, 'w+');
        module.FS.write(stream, file, 0, file.size, 0);
        module.FS.close(stream);

        // This method is defined in cpp EMSCRIPTEN_BINDINGS section
        module.smthFile(fileName);
    }
}
