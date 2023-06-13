/**
 * {
 *   stakingSubscribes(orderBy: stakingProgramId, where: {stakerAddress: "0x29ff4fd679124c025189aecc552d0c1b32214bb4", active: true}) {
 *         tokenId
 *         stakingStartDate
 *         stakingEndDate
 *         stakingProgramId
 *         stakingSubscribeId
 *
 *         stakingProgram {
 *             stakingProgramId
 *             stakingLevel
 *             stakingTimeDuration
 *             rewardId
 *             rewardName
 *         }
 *     }
 *   }
 */

import { gql } from "@apollo/client";

export const GET_ACTIVE_STAKING = gql`
    query GetActiveStaking($stakerAddress: String!) {
        stakingSubscribes(orderBy: stakingProgramId, where: {stakerAddress: $stakerAddress, active: true}) {
            tokenId
            stakingStartDate
            stakingEndDate
            stakingProgramId
            stakingSubscribeId
            stakingProgram { 
                stakingProgramId
                stakingLevel
                stakingTimeDuration
                rewardId
                rewardName
            }
        }
    }
`
