import {Component, ChangeEvent} from "react";
import {ImageConverterService} from "./image-converter/image-converter.service";

export class Test extends Component {
    private imageConverterService?: ImageConverterService;

    public async componentDidMount() {
        this.imageConverterService = await ImageConverterService.createInstance();
        this.setState({module});
    }

    private fileInputChangedHandler = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) {
            return;
        }

        // TODO handle multiple files
        const file = files[0] as any;
        await this.imageConverterService?.formatToAscii(file);
    }

    render() {
        return <div>
            <input type="file" onChange={this.fileInputChangedHandler}/>
        </div>
    }
}
