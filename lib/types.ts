export interface BitunixResponse<T> {
    code: number;
    msg: string;
    data: T;
}

export interface Balance {
    currency: string;
    available: string;
    frozen: string;
    btcValue: string;
    usdtValue: string;
}

export interface UserAccount {
    uid: string;
    assets: Balance[];
}

export interface WithdrawalRequest {
    currency: string;
    amount: string;
    address: string;
    chain: string; // e.g., 'TRC20'
}

export interface TransferRequest {
    amount: string;
    currency: string;
    fromAccountType: 'SPOT' | 'FUTURES';
    toAccountType: 'SPOT' | 'FUTURES';
}
