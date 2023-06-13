/**
 *   {
 *     nfts(where: {owner: "0xab32a8c18508d16c4ced8495ed171c5939d03f8a"} first:10, skip: 30) {
 *       tokenID,
 *       tokenContract,
 *       owner,
 *       tokenURI
 *     }
 *   }
 */
import {gql} from "@apollo/client";

export const GET_NFTS = gql`
    query GetNfts($owner: String!, $first: Int!, $skip: Int!) {
        nfts(where: {owner: $owner}, first: $first, skip: $skip) {
            tokenID,
            tokenContract,
            owner,
            tokenURI
        }
    }
`;
