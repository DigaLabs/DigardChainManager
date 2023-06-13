import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client"

const digardNftListLink = createHttpLink({
    uri: process.env.REACT_APP_NFT_GRAPH_URL
});


export const client = new ApolloClient({
    link: digardNftListLink,
    cache: new InMemoryCache()
});

