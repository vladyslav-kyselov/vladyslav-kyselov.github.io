import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import {Button} from "@mui/material";
import Masonry from '@mui/lab/Masonry';

import './index.scss';
import {db} from "../../../../../firebase/firebase.ts";
import {onValue, ref, set} from "firebase/database";

type User = {
    name: string,
    score: number
};

type Props = {
    users: User[],
    changeStage: () => void
}

const StageFirst = ({users, changeStage}: Props) => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);



    useEffect(() => {
        const isAuth = sessionStorage.getItem("isAuth");
        if (isAuth) {
            setIsAdmin(true);
        }

        const gameRef = ref(db, '/game/quizId');

        onValue(gameRef, (snapshot) => {
            const data = snapshot.val();
            if (!data && isAuth) {
                navigate('/quizzes');
            } else if (!data && !isAuth) {
                navigate('/');
            }
        }, {onlyOnce: true});


    }, []);
    const onStartGame = () => {
        changeStage();

        const gameRef = ref(db, '/game/startedGame');
        set(gameRef, true);
    }
    return (
        <>
            <div className="game__header">
                <Paper elevation={3} className="game__info-wrapper">
                    <div>
                        Приєднатись до гри
                        <div className="game__url">
                            {
                                window.location.origin
                            }
                        </div>
                    </div>
                </Paper>
                {isAdmin ? <Button variant="outlined" color="success" className="game__start-game" onClick={onStartGame}
                                   disabled={!users.length}>
                    Розпочати
                </Button> : null}
            </div>
            <div className="game__title">
                <span>ВІКТОРИНА</span>
            </div>
            <div className="game__body-wrapper">
                <div className="game__activity">
                    <div className="quantity__text">Кі-ть гравців:</div>
                    <div className="quantity">{users.length > 0 ? users.length : 0}</div>
                </div>
                <div className="game__players">
                    <Masonry columns={4} spacing={2}>
                        {users.map((player, index) => (
                            <Card key={index} className="game__player">
                                {player.name}
                            </Card>
                        ))}
                    </Masonry>
                </div>
            </div>

            <div className="game__qr">
                <img
                    src='/qr.png'
                    alt='QR code'
                />
            </div>
        </>
    );
};

export default StageFirst;
