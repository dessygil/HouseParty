import React, { Component } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';
import Info from './Info';
import { Button, Grid, ButtonGroup, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Link, Navigate, Routes } from 'react-router-dom'



export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this);
    }

    async componentDidMount() {
        fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    roomCode: data.code,
                });
            });
    }

    renderHomePage() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join A Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create A Room
                        </Button>
                        <Button color="info" to="/info" component={Link}>
                            Info
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    clearRoomCode() {
        this.setState({
            roomCode: null,
        });
    }


    render() {
        return (
            < Router >
                <Routes>
                    <Route exact path="/" element={this.state.roomCode ? (<Navigate replace to={`/room/${this.state.roomCode}`} />) : this.renderHomePage()} />
                    <Route exact path="/join" element={<RoomJoinPage />} />
                    <Route exact path="/create" element={<CreateRoomPage />} />
                    <Route exact path='/room/:roomCode' element={<Room clearRoomCodeCallback={this.clearRoomCode} />} />
                    <Route exact path='/info' element={<Info />} />
                </Routes>
            </Router >
        );
    };
}
