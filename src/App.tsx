import {Component, ChangeEvent} from "react";
import {ArtMakerService} from "./art-maker/art-maker.service";

export class App extends Component {
    private imageConverterService?: ArtMakerService;

    public async componentDidMount() {
        this.imageConverterService = await ArtMakerService.createInstance();
        this.setState({module});
    }

    private fileInputChangedHandler = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) {
            return;
        }

        // TODO handle multiple files
        const file = files[0] as File;
        await this.imageConverterService?.formatToAscii(file);
    }

    render() {
        return <div>
            <input type="file" onChange={this.fileInputChangedHandler}/>
        </div>
    }
}
