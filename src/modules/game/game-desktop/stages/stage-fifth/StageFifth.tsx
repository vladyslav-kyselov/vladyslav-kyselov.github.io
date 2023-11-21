import React, {useEffect, useState} from 'react';
import SquareIcon from "@mui/icons-material/CropSquare";
import CircleIcon from "@mui/icons-material/PanoramaFishEye";
import TriangleIcon from "@mui/icons-material/ChangeHistory";
import StarIcon from "@mui/icons-material/StarBorderOutlined";
import CheckIcon from '@mui/icons-material/Check';

import {QuestionType} from "../../../../../components/card/Card.tsx";
import './index.scss';

import {Button, Zoom} from "@mui/material";
import {db} from "../../../../../firebase/firebase.ts";
import {onValue, ref} from "firebase/database";
import {User} from "../../../types.ts";

type Props = {
    changeStage: () => void,
    currentQuestion: QuestionType | null
};

type Accumulator = {
    A: number,
    B: number,
    C: number,
    D: number
};

const StageFifth = ({changeStage, currentQuestion}: Props) => {
    const [playersAnswered, setPlayersAnswered] = useState({A: 0, B: 0, C: 0, D: 0});
    const [players, setPlayers] = useState<User[]>([]);
    useEffect(() => {
        const playersRef = ref(db, `/game/players`);

        onValue(playersRef, (snapshot) => {
            const players = snapshot.val();
            const answers = Object.values(players) as User[];

            setPlayers(answers);
            const mappedAnswers = answers.length > 0 && answers.reduce((acc: Accumulator, player: User) => {
                const lastAnswer = player.lastAnswer.answer as keyof Accumulator;
                if (player.lastAnswer.answer) {
                    return {...acc, [lastAnswer]: acc[lastAnswer] + 1}
                }
                return acc;
            }, {A: 0, B: 0, C: 0, D: 0})
            if (mappedAnswers) {
                setPlayersAnswered(mappedAnswers);
            }
        }, {onlyOnce: true});
    }, []);

    const onClick = () => {
        changeStage();
    };

    return (
        <div className="stage-fourth stage-fifth">
            <div className="stage-fourth__header">
                {currentQuestion?.title}
            </div>

            <div className="stage-fifth__body">
                <Button variant="outlined" color="success" onClick={onClick} className="stage-fourth__next-button">
                    NEXT
                </Button>

                <div className="stage-fourth__img stage-fifth__charts">
                    <Zoom in={true} timeout={2000}>
                        <div className="stage-fifth__first-result">
                            <div className="number">
                                {currentQuestion?.correctVariant === 'A' && <CheckIcon className="check-icon"/>}
                                {playersAnswered.A}
                            </div>

                            <div className="chart" style={{height: `${100 * playersAnswered.A / players.length}%`}}>
                            </div>
                            <div className="icon-wrapper">
                                <SquareIcon className="icon"/>
                            </div>
                        </div>
                    </Zoom>

                    <Zoom in={true} timeout={2000}>
                        <div className="stage-fifth__second-result">
                            <div className="number">
                                {currentQuestion?.correctVariant === 'B' && <CheckIcon className="check-icon"/>}
                                {playersAnswered.B}
                            </div>

                            <div className="chart" style={{height: `${100 * playersAnswered.B / players.length}%`}}>

                            </div>
                            <div className="icon-wrapper">
                                <CircleIcon className="icon"/>
                            </div>
                        </div>
                    </Zoom>

                    <Zoom in={true} timeout={2000}>
                        <div className="stage-fifth__third-result">
                            <div className="number">
                                {currentQuestion?.correctVariant === 'C' && <CheckIcon className="check-icon"/>}
                                {playersAnswered.C}
                            </div>

                            <div className="chart" style={{height: `${100 * playersAnswered.C / players.length}%`}}>
                            </div>
                            <div className="icon-wrapper">
                                <TriangleIcon className="icon"/>
                            </div>
                        </div>
                    </Zoom>


                    <Zoom in={true} timeout={2000}>
                        <div className="stage-fifth__fourth-result">
                            <div className="number">
                                {currentQuestion?.correctVariant === 'D' && <CheckIcon className="check-icon"/>}
                                {playersAnswered.D}
                            </div>

                            <div className="chart" style={{height: `${100 * playersAnswered.D / players.length}%`}}>
                            </div>
                            <div className="icon-wrapper">
                                <StarIcon className="icon"/>
                            </div>
                        </div>
                    </Zoom>
                </div>
            </div>

            <div className="stage-fourth__footer">
                {currentQuestion?.variantA && <div className="first-button">
                    <SquareIcon className="icon"/>
                    {currentQuestion?.variantA}
                </div>}

                {currentQuestion?.variantB && <div className="second-button">
                    <CircleIcon className="icon"/>
                    {currentQuestion?.variantB}
                </div>}

                {currentQuestion?.variantC && <div className="third-button">
                    <TriangleIcon className="icon"/>
                    {currentQuestion?.variantC}
                </div>}

                {currentQuestion?.variantD && <div className="fourth-button">
                    <StarIcon className="icon"/>
                    {currentQuestion?.variantD}
                </div>}
            </div>
        </div>
    );
};

export default StageFifth;