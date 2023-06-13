/*
{
    stakingPrograms {
        stakingProgramId
        stakingLevel
        stakingTimeDuration
        rewardId
        rewardName
    }
  }
 */

import {gql} from "@apollo/client";

export const GET_STAKING_PROGRAMS = gql`
    query GetStakingPrograms {
        stakingPrograms {
            stakingProgramId
            stakingLevel
            stakingTimeDuration
            rewardId
            rewardName
        }
    }
`
