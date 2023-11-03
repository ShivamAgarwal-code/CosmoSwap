use cosmwasm_schema::{cw_serde, QueryResponses};
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;
use cosmwasm_std::Uint128;

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    CreatePool {
        coin_a: String,
        coin_b: String,
        coin_a_reserve: Uint128,
        coin_b_reserve: Uint128,
    },
    Swap {
        pool_id: String,
        sent_amount: Uint128,
        min_received_amount: Uint128,
        is_a_to_b: bool,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Pool {
    pub id: String,
    pub coin_a: String,
    pub coin_b: String,
    pub coin_a_reserve: Uint128,
    pub coin_b_reserve: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(GetPoolResponse)]
    GetPool {
        id: String,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GetPoolResponse {
    pub pool: Pool,
}
