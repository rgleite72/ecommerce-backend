import { MemoryRefreshStore } from "./memory";
import { IRefreshStore } from "./types";


export const refreshStore: IRefreshStore = new MemoryRefreshStore();


