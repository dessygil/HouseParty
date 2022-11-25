import React, { Component } from 'react';
import { Button, Grid, Typography, Card, IconButton, LinearProgress } from "@mui/material";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function MusicPlayer(props) {

    const pauseSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
        };

        fetch("/spotify/pause", requestOptions);
    }

    const playSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: { "Content-Type" : "application/json" },
        };

        fetch("/spotify/play", requestOptions);
    }

    const skipSong = () => {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type" : "application/json" },
        };

        fetch("/spotify/skip", requestOptions);
    };

    if (Object.keys(props).length === 0 && props.constructor === Object) {
        return (
            <p>Loading...</p>
        );
    } else {
        const songProgress = (props.data.time / props.data.duration) * 100;

        return (
            <Card>
                <Grid container alignItems="center">
                    <Grid item align="center" xs={4}>
                        <img src={props.data.image_url} height="100%" width="100%" />
                    </Grid>
                    <Grid item align="center" xs={8}>
                        <Typography component="h5" variant="h5">
                            {props.data.title}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            {props.data.artist}
                        </Typography>
                        <div>
                            <IconButton onClick={() => {
                                props.data.is_playing ? pauseSong() : playSong()
                            }}
                            >
                                {props.data.is_playing ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
                            </IconButton>
                                <IconButton onClick={() => skipSong()}>
                                {props.data.votes} / { props.data.votes_required} {" "} <SkipNextIcon /> 
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>
                <LinearProgress variant="determinate" value={songProgress} />
            </Card>
        );
    };



}
