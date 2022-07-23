import { ReadableStream} from "stream/web";

export class ArtMakerService {
    private readonly module: any;

    private constructor(module: any) {
        this.module = module;
    }

    public static async createInstance() {
        // Cannot use 'import' statement cause of emscripten handling esmodule issue
        // https://github.com/emscripten-core/emscripten/issues/11792
        const Module = require("./art-maker.wrapper");
        const module = await Module();
        return new ArtMakerService(module);
    }

    public async formatToAscii(file: File) {
        const inputFileName = "tmpFileName.jpeg";
        const outputFileName = "tmpFileName.output.txt";

        const stream =  this.module.FS.open(inputFileName, 'w');
        const fileStream = file.stream() as unknown as ReadableStream<Uint8Array>;
        const reader = fileStream.getReader()

        let offset = 0;
        while (true) {
            const chunk = await reader.read();
            if (chunk.done) {
                break;
            }

            this.module.FS.write(stream, chunk.value, offset, chunk.value.length);
            offset = chunk.value.length + 1;
        }

        this.module.FS.close(stream);

        // This method is defined in cpp EMSCRIPTEN_BINDINGS section
        this.module.smthFile(inputFileName, outputFileName);
    }
}
