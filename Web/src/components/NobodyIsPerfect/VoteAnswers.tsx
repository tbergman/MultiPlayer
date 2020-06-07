import React from "react";
import styled from "styled-components";

import InputText from "./InputText";
import { GroupContainer, Button } from "../style";
import PlayerNames from "./PlayerNames";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  margin-top: 15px;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

type Props = {
  question: string;
  answers: { text: string; color: string }[];
  players: { name: string; color: string; id: string; vote: number }[];
  onSet?: (vote: number) => void;
};
const VoteAnswers: React.FC<Props> = ({
  question,
  answers,
  players,
  onSet,
}) => {
  return (
    <GroupContainer>
      <InputText label="Question" text={question} />
      {answers.map((answer, idx) => {
        return (
          <Container key={idx}>
            <InputText text={answer.text} color={answer.color} />
            <BottomContainer>
              {onSet && <Button onClick={() => onSet(idx)}>Vote</Button>}
              <PlayerNames
                players={players.filter((player) => player.vote === idx)}
              />
            </BottomContainer>
          </Container>
        );
      })}
    </GroupContainer>
  );
};

export default VoteAnswers;
