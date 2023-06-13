/**
 *
 *   {
 *     nfttransactionHistories(
 *       where: {
 *         or: [
 *           {to: ""}
 *           {from: ""}
 *         ]
 *       }
 *     ) {
 *       eventName
 *       tokenId
 *       transactionHash
 *       blockExplorerUrl
 *     }
 *   }
 *
 */

import {gql} from "@apollo/client";
export const GET_HISTORIES = gql`
    query GetHistories($to: String!, $from: String!) {
        nfttransactionHistories(
            where: {
                or: [
                    {to: $to}
                    {from: $from}
                ]
            },
            orderBy: blockTimestamp
        ) {
            to
            from
            eventName
            tokenId
            transactionHash
            blockExplorerUrl
        }
    }
`;
