// constants.js

// API endpoints
export const API_BASE = "http://192.168.3.1:8000/api";
export const API_DEP_ALL_STATUSES = `${API_BASE}/dep/allstatuses`;
export const API_STM32_SEND = `${API_BASE}/stm32/send`;

// Добавляем новые константы
export const API_ALL_STATUSES = API_DEP_ALL_STATUSES;
export const API_SEND = API_STM32_SEND;

// LocalStorage keys
export const LS_KEYS = {
    ALL_STATUSES: "allStatusesSendingMessages",
    POS: "pos",
    BRUKER: "bruker",
    RCSIG: "RCSIG",
    BLOCK_MSG_STATE: "blockMsgState",
    BLOCK_B: "blockB",
};

// Fixed values for DCA messages
export const DCA_TM = "DCA";
export const DCA_AD = "NOR";

// Static block A options (для Loop1)
export const ONLY_BLOCK_A = [
    { code: "STE", name: "Stimer" },
    { code: "TRX", name: "Omlasting" },
    { code: "SET", name: "Setting av redskap" },
    { code: "ANC", name: "Ankring" },
    { code: "DRI", name: "Driving" },
    { code: "GUD", name: "Vaktskip" },
    { code: "HAU", name: "Transport" },
    { code: "PRO", name: "Produksjon" },
    { code: "INW", name: "Ingen aktivitet" },
    { code: "SEF", name: "Leting etter fisk" },
    { code: "OTH", name: "Annet" },
];

// Delay constants
export const DEFAULT_DELAY_MS = 2000;

// Regex for positions
export const LATITUDE_REGEX = /([NS]{1})([0-8][0-9]\.\d{2})/;
export const LONGITUDE_REGEX = /([EW]{1})(0[0-9]{2}|1[0-7][0-9])\.\d{2}/;
