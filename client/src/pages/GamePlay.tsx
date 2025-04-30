import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SinglePlayer from './SinglePlayer';
import CoOp from './Coop';
import Duel from './Duel';

interface QueryParams {
  gameType: string;
}


export default function GamePlay() {

  const [queryParams] = useSearchParams();

  let params: QueryParams = { gameType: '' }

  queryParams.forEach((value: string, key: string) => {
    params[key as keyof QueryParams] = value;
  })

  return (
    <>
      {params.gameType === 'singleplayer'
        ? <SinglePlayer />
        : params.gameType === 'coop'
          ? <CoOp />
          : <Duel />
      }
    </>
  );
}