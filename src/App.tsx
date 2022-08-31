import {ChangeEvent, Component} from "react";
import {ArtMakerService} from "./art-maker/art-maker.service";

export class App extends Component<unknown, { data?: string }> {
    private artMakerService!: ArtMakerService;

    constructor(props: unknown) {
        super(props);
        this.state = {};
    }

    public async componentDidMount() {
        this.artMakerService = await ArtMakerService.createInstance();
    }

    private fileInputChangedHandler = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) {
            return;
        }

        const file = files[0] as File;
        const data = await this.artMakerService.formatToAscii(file, 5); // TODO allow sending ints
        this.setState({data});

        // Clear file input selection
        event.target.value = "";
    }

    render() {
        return <>
            <input type="file" onChange={this.fileInputChangedHandler}/>
            <br/>
            <span style={{
                whiteSpace: "pre-line",
                fontFamily: "monospace"
            }}>
                {this.state.data}
            </span>
        </>
    }
}
