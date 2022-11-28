import React, { Component } from 'react'
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio, Collapse } from "@mui/material";
import { withRouter } from './withRouter';
import { Link } from 'react-router-dom';
import Alert from "@mui/lab/Alert"


CreateRoomPage.defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => { },
};

function CreateRoomPage(props) {

    const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, SetSuccessMsg] = useState("");


    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === "true" ? true : false);
    }

    const handleRoomButtonPressed = () => {
        
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
            }),
        };

        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => props.navigate("/room/" + data.code));
    };

    const handleUpdateButtonPressed = () => {
        
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: props.roomCode,
            }),
        };

        fetch("/api/update-room", requestOptions).then((response) => {
            if (response.ok) {
                SetSuccessMsg("Room updated successfully!");
            } else {
                setErrorMsg("Error updating room...");
            }
            props.updateCallback();
        });
    }

    const renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleRoomButtonPressed}
                    >
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const enderUpdateButtons = () => {
        return (
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleUpdateButtonPressed}
                >
                    Update Room
                </Button>
            </Grid>
        );
    };
    
    const title = props.update ? "Update Room" : "Create a Room";

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse
                    in={errorMsg != "" || successMsg != ""}
                >
                    {successMsg != "" ? (
                        <Alert
                            severity="success"
                            onClose={() => {
                                SetSuccessMsg("");
                            }}
                        >
                            {successMsg}
                        </Alert>
                    ) : (
                            <Alert
                                severity="error"
                                onClose={() => {
                                    setErrorMsg("");
                                }}
                            >
                                {errorMsg}
                            </Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText component={"div"}>
                        Guest Control of Playback State
                    </FormHelperText>
                    <RadioGroup row defaultValue={props.guestCanPause.toString()}
                        onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel value="true" control={<Radio color="primary" />} label="Play/Pause" labelPlacement="bottom" />
                        <FormControlLabel value="false" control={<Radio color="secondary" />} label="No Control" labelPlacement="bottom" />
                    </RadioGroup>
                </FormControl>
            </Grid>

            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField required={true} type="number"
                        onChange={handleVotesChange}
                        defaultValue={state.votesToSkip}
                        inputProps={{ min: 1, style: { textAlign: "center" }, }}
                    />
                    <FormHelperText component={"div"}>
                        Votes Required To Skip Song
                    </FormHelperText>
                </FormControl>
            </Grid>
            {props.update
                ? renderUpdateButtons()
                : renderCreateButtons()}
        </Grid>

    );
}
export default withRouter(CreateRoomPage);


/*
class CreateRoomPage extends Component {

    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => { },
    };

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: "",
        };

        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
    }

    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    handleGuestCanPauseChange(e) {
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        });
    }

    handleRoomButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),
        };
        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => this.props.navigate("/room/" + data.code));
    }

    handleUpdateButtonPressed() {
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
            }),
        };
        fetch("/api/update-room", requestOptions).then((response) => {
            if (response.ok) {
                this.setState({
                    successMsg: "Room updated successfully!",
                });
            } else {
                this.setState({
                    errorMsg: "Error updating room...",
                });
            }
            this.props.updateCallback();
        });
    }

    renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={this.handleRoomButtonPressed}
                    >
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }

    renderUpdateButtons() {
        return (
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={this.handleUpdateButtonPressed}
                >
                    Update Room
                </Button>
            </Grid>
        );
    }

    render() {
        const title = this.props.update ? "Update Room" : "Create a Room"

        return (<Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse
                    in={this.state.errorMsg != '' || this.state.successMsg != ''}
                >
                    {this.state.successMsg = ! "" ? (
                        <Alert
                            severity="success"
                            onClose={() => {
                                this.setState({ successMsg: "" });
                            }}
                        >
                            {this.state.successMsg}
                        </Alert>
                    ) : (
                            <Alert
                                severity="error"
                                onClose={() => {
                                    this.setState({ errorMsg: "" });
                                }}
                            >
                                {this.state.errorMsg}
                            </Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText component={"div"}>
                        Guest Control of Playback State
                    </FormHelperText>
                    <RadioGroup row defaultValue={this.props.guestCanPause.toString()}
                        onChange={this.handleGuestCanPauseChange}
                    >
                        <FormControlLabel value="true" control={<Radio color="primary" />} label="Play/Pause" labelPlacement="bottom" />
                        <FormControlLabel value="false" control={<Radio color="secondary" />} label="No Control" labelPlacement="bottom" />
                    </RadioGroup>
                </FormControl>
            </Grid>

            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField required={true} type="number"
                        onChange={this.handleVotesChange}
                        defaultValue={this.state.votesToSkip}
                        inputProps={{ min: 1, style: { textAlign: "center" }, }}
                    />
                    <FormHelperText component={"div"}>
                        Votes Required To Skip Song
                    </FormHelperText>
                </FormControl>
            </Grid>
            {this.props.update
                ? this.renderUpdateButtons()
                : this.renderCreateButtons()}
        </Grid>
        );
    }
} */

