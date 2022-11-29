import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from './MusicPlayer';




export default function Room(props) {

    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false)
    const navigate = useNavigate();
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false)
    const [song, setSong] = useState({})

    const { roomCode } = useParams();

    // new code for trying to play music from the browser
    const [player, setPlayer] = useState(undefined);

    useEffect(() => {
        
        window.onSpotifyWebPlaybackSDKReady = () => {
            
            const token = '[My access token]'; //TODO fetch for the access token
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK Quick Start Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('initialization_error', ({ message }) => {
                console.error(message);
            });

            player.addListener('authentication_error', ({ message }) => {
                console.error(message);
            });

            player.addListener('account_error', ({ message }) => {
                console.error(message);
            });

            document.getElementById('togglePlay').onclick = function () {
                player.togglePlay();
            };

            player.connect();
        }
    });



    React.useEffect(() => {

        fetch(`/api/get-room?code=${roomCode}`)
            .then(response => {
                if (!response.ok) {
                    props.clearRoomCodeCallback(); // clears roomCode state in HomePage
                    navigate("/");
                } else {
                    return response.json();
                }
            })
            .then(data => {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
                if (data.is_host) {
                    authenticateSpotify();
                };
            });
    }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            getCurrentSong();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getCurrentSong = () => {
        fetch('/spotify/current-song').then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json();
            };
        }).then((data) => {
            setSong({ data });
        })
    }

    const authenticateSpotify = () => {
        fetch("/spotify/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                setSpotifyAuthenticated(data.status);
                console.log(`Spotify Authentication = ${data.status}`);
                if (!data.status) {
                    fetch("/spotify/get-auth-url")
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            });
    };

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        };
        fetch(`/api/leave-room`, requestOptions)
            .then(_response => {
                props.clearRoomCodeCallback(); // clears roomCode state in HomePage
                navigate("/");
            });
    };

    const updateShowSettings = (value) => {
        setShowSettings(value)
    };

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    };

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage update={true}
                        votesToSkip={votesToSkip}
                        guestCanPause={guestCanPause}
                        roomCode={roomCode}
                        updateCallBack={() => { }}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderRoomPage = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer {...song} />
                {isHost ? renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                        Leave Room
                </Button>
                </Grid>
            </Grid>
        );
    };

    return (
        showSettings ? renderSettings() : renderRoomPage()
    );
}
