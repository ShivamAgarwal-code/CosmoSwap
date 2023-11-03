use std::hash::{Hash, Hasher};
use std::string;

use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Binary, Coin, Uint128};

#[cw_serde]
pub struct InstantiateMsg {
}

#[cw_serde]
pub enum ExecuteMsg {
    SwapExactIn { call: Binary, token_in: Coin, min_token_out: Coin },
    CallSwaps {
        swap_calls: Vec<SwapCall>,
    }
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    // #[returns(GetCountResponse)]
    // GetCount {},
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetCountResponse {
    pub count: i32,
}

#[cw_serde]
pub struct SwapCall {
    pub contract_address: Addr,
    pub swap_binary: Binary,
    pub funds: Vec<Coin>,
    // add additional params for interchain calls here
    pub chain_id: String,
    pub osmo_call: Option<SwapOsmosisCall>, // optional only for osmosis
    pub start_index: u64 // defines the number of swaps that already have been executed
}

#[cw_serde]
pub struct SwapOsmosisCall {
    pub contract_address: Addr,
    pub TRANSFER_PORT: String,
    pub TRANSFER_CHANNEL: String,
    pub memo: String,
    pub funds: Coin,
    // add additional params for interchain calls here
}
