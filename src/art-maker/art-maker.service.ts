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

    public async formatToAscii(file: File, scale: number) {
        const inputFileName = "art-input";
        const outputFileName = "art-output";
        await this.storeInputFile(inputFileName, file);
        this.runImageConverter(inputFileName, outputFileName, scale);

        const data = this.module.FS.readFile(outputFileName, { encoding: 'utf8' });
        this.module.FS.unlink(inputFileName);
        this.module.FS.unlink(outputFileName);

        return data;
    }

    // TODO add error popup
    private runImageConverter(inputFileName: string, outputFileName: string, scale: number) {
        try {
            // This method is defined in cpp EMSCRIPTEN_BINDINGS section
            this.module.run(inputFileName, outputFileName, scale);
        } catch (errorPtr) {
            const message = this.module.extractExceptionMessage(errorPtr);
            throw new Error(message);
        }
    }

    private async storeInputFile(inputFileName: string, file: File) {
        const stream = this.module.FS.open(inputFileName, 'w');
        const fileStream = file.stream() as unknown as ReadableStream<Uint8Array>;
        const reader = fileStream.getReader()

        while (true) {
            const chunk = await reader.read();
            if (chunk.done) {
                break;
            }

            this.module.FS.write(stream, chunk.value, 0, chunk.value.length);
        }
        this.module.FS.close(stream);
    }
}
