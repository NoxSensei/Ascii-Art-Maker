import 'bootstrap/dist/css/bootstrap.min.css';
import {ChangeEvent, Component} from "react";
import {ArtMakerService} from "./art-maker/art-maker.service";
import Form from 'react-bootstrap/Form';
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

interface AppState {
    asciiArt?: string,
    errorMessage?: string,
    scale: number
}

export class App extends Component<unknown, AppState> {
    private artMakerService!: ArtMakerService;

    constructor(props: unknown) {
        super(props);
        this.state = {
            scale: 1
        };
    }

    public async componentDidMount() {
        this.artMakerService = await ArtMakerService.createInstance();
    }

    private fileInputChangedHandler = async (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({asciiArt: undefined, errorMessage: undefined});

        const files = event.target.files;
        if (!files) {
            return;
        }

        const file = files[0] as File;
        try {
            const data = await this.artMakerService.formatToAscii(file, this.state.scale);
            this.setState({asciiArt: data});
        } catch (error: unknown) {
            const message = this.getErrorMessage(error);
            this.setState({errorMessage: message});
        }

        // Clear file input
        event.target.value = "";
    }

    private scaleInputChangedHandler = (event: ChangeEvent<HTMLInputElement>) => {
        let value = Number(event.target.value);
        value = Math.round(value);
        value = value < 1 ? 1 : value;
        this.setState({scale: value});
    }

    private getErrorMessage(error: unknown) {
        if (error instanceof Error) {
            return error.message;
        } else {
            return "An unknown error occurred";
        }
    }

    render() {
        return <Container fluid>
            <Row>
                <Col/>
                <Col align="center">
                    <h1> Ascii Art Maker</h1>

                    {this.renderAlert()}

                    <InputGroup className="mb-3">
                        <InputGroup.Text>Reduce image N times</InputGroup.Text>
                        <Form.Control type="number" min="1" step="1" onChange={this.scaleInputChangedHandler}
                                      value={this.state.scale}/>
                    </InputGroup>

                    <Form.Label>Only png and bmp formats are supported</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control type="file" accept=".png, .bmp" onChange={this.fileInputChangedHandler}/>
                    </InputGroup>
                </Col>
                <Col/>
            </Row>
            <Row align="center">
                {this.renderAsciiArt()}
            </Row>
        </Container>
    }

    private renderAsciiArt() {
        if (!this.state.asciiArt) {
            return <></>
        }

        return <Card className="bg-light">
            <Card.Body style={{
                whiteSpace: "pre-line",
                fontFamily: "monospace"
            }}>
                {this.state.asciiArt}
            </Card.Body>
        </Card>
    }

    private renderAlert() {
        if (!this.state.errorMessage) {
            return <></>
        }

        return <Alert variant={'danger'}>
            {this.state.errorMessage}
        </Alert>
    }
}
