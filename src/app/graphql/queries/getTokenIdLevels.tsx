/**
 {
    tokenIdLevels(
      where: {
        and: [
          {
            nft_: {
          		owner: "0xab32a8c18508d16c4ced8495ed171c5939d03f8a"
        		}
          }
          {
            itemLevel: 1
          }
        ]

      }
    ) {
      nft {
        tokenID
        owner
        tokenURI
      }
    }
  }
 */

import {gql} from "@apollo/client";

export const GET_TOKEN_ID_LEVELS = gql`
    query GetTokenIdLevels($owner: String!, $itemLevel: Int!, $first: Int!, $skip: Int!) {
        tokenIdLevels(
            where: {
                and: [
                    {
                        nft_: {
                            owner: $owner
                        }
                    }
                    {
                        itemLevel: $itemLevel
                    }
                ]
            }
            first: $first
            skip: $skip
        ) {
            nft {
                tokenID
                owner
                tokenURI
                tokenContract
            }
        }
    }
`
