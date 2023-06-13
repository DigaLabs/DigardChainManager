import { DigardChainExtendedInformation } from "../DigardChainManager";

export interface WatchBalance extends DigardChainExtendedInformation {
    balance: string;
}