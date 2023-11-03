#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult ,IbcMsg};
use cw2::set_contract_version;
use crate::contract::execute::execute_calling_swaps;
use crate::contract::execute::execute_osmosis_swaps;
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{State, STATE};
use crate::proto;

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:cosmo-aggr";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
    )
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::SwapExactIn { call, token_in, min_token_out } => execute::swapExactIn(deps, info, call, token_in, min_token_out ),
        // ExecuteMsg::CallOsmosisSwaps { swap_calls} => execute_osmosis_swaps(deps,_env, info, swap_calls),
        ExecuteMsg::CallSwaps { swap_calls } => execute_calling_swaps(deps, _env, info, swap_calls),
    }
}



pub mod execute {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    // use std::mem::swap;
    // use std::str::FromStr;
    use cosmwasm_std::{Addr, Coin, CosmosMsg, from_slice, StdError, to_binary, Uint128, WasmMsg, IbcMsg};
    use osmosis_std::types::osmosis::gamm::v1beta1::MsgSwapExactAmountIn;
    use crate::ContractError::Std;
    use crate::msg::{SwapCall, SwapOsmosisCall};
    use super::*;

    // for call to others
    pub fn swapExactIn(deps: DepsMut, info: MessageInfo, call: Binary, tokenIn: Coin, min_token_out: Coin) -> Result<Response, ContractError> {
        let msg_swap: MsgSwapExactAmountIn = build_exact_in_validate(call)?;
        let cosmos_msg_swap: CosmosMsg = msg_swap.clone().into();
        check_sufficient_funds(&info, tokenIn)?;
        let minimum_token_out = msg_swap.token_out_min_amount; // when IBC implemented after swap this amount will be sent back to M1 src chain
        Ok(Response::new()
            .add_message(cosmos_msg_swap))
    }

    fn check_sufficient_funds(info: &MessageInfo, token_in: Coin) -> Result<(), ContractError> {
        for coin in info.funds.iter() {
            if coin.denom == token_in.denom && coin.amount >= token_in.amount {
                return Ok(());
            }
        }
        Err(Std(StdError::generic_err("Insufficient funds")))
    }

    pub fn build_exact_in_validate(call: Binary) -> Result<MsgSwapExactAmountIn, ContractError> {
        let msg_swap_in: MsgSwapExactAmountIn = from_slice(&call).map_err(|_| Std(StdError::generic_err("Invalid Decoding")))?;
        Ok(msg_swap_in)
    }

    pub fn execute_calling_swaps(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        swap_calls: Vec<SwapCall>,
    ) -> Result<Response, ContractError> {
        let mut res = Response::new();

        for swap_call in swap_calls {
            if swap_call.chain_id == "osmosis" {
                let x = execute_osmosis_swaps(
                    deps,
                    env.clone(),
                    info.clone(),
                    swap_call.osmo_call.unwrap()
                );
                return x;
            } else {
                // handle cases for non osmosis based on dex_helpers
                let cosmos_msg = CosmosMsg::Wasm(WasmMsg::Execute {
                    contract_addr: swap_call.contract_address.to_string(),
                    msg: swap_call.swap_binary,
                    funds: swap_call.funds.clone(),
                });
                res = res.add_message(cosmos_msg);
            }
        }
        Ok(res)
    }

    pub fn execute_osmosis_swaps(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        osmo_calls: SwapOsmosisCall,
    ) -> Result<Response, ContractError> {
        let mut res = Response::new();

        let ibc_msg= proto::MsgTransfer{
            source_port: osmo_calls.TRANSFER_PORT.to_string(),
            source_channel: osmo_calls.TRANSFER_CHANNEL.to_string(),
            token: Some(osmo_calls.funds.into()),
            sender: env.contract.address.clone().into(),
            receiver: osmo_calls.contract_address.into(),
            timeout_height: None,
            timeout_timestamp: None,
            memo:osmo_calls.memo,
        };

        res = res.add_message(ibc_msg);
        Ok(res)
    }

}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary, Uint128, to_binary, Uint64, Addr, StdError, Coin as StdCoin, coin, CosmosMsg, WasmMsg};
    use osmosis_std::types::cosmos::base::v1beta1::Coin;
    use osmosis_std::types::osmosis::gamm::v1beta1::{MsgSwapExactAmountIn, SwapAmountInRoute};
    use schemars::_serde_json::json;
    use crate::msg::{SwapCall, SwapOsmosisCall};
    use cosmwasm_schema::{cw_serde};

    #[test]
    fn test_swap_exact_in_success() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let msg = InstantiateMsg {};
        let info = mock_info("owner", &[]);
        instantiate(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();
        let call = create_call_data(&env.contract.address);
        let token_in = cosmwasm_std::Coin { denom: "uosmo".to_string(), amount: Uint128::from(100000u128) };
        let min_token_out = cosmwasm_std::Coin { denom: "ibc-token".to_string(), amount: Uint128::from(500u128) };
        let info = mock_info("sender", &coins(100000, "uosmo"));
        let msg = ExecuteMsg::SwapExactIn { call: call.clone(), token_in: token_in.clone(), min_token_out: min_token_out.clone() };
        let res = execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();

        // Check if the swap message was created correctly
        assert_eq!(res.messages.len(), 1);
        // Add more assertions to verify the created message

    }

    #[test]
    fn test_execute_calling_swaps() {
        let mut deps = mock_dependencies();

        let info = mock_info("creator", &[]);
        let env = mock_env();
        instantiate(deps.as_mut(), env.clone(), info.clone(), InstantiateMsg {}).unwrap();

        let swap_msg_binary = encode_swap_msg("pool_1", Uint128::from(100u32), Uint128::from(50u32), true).unwrap();

        let msg = ExecuteMsg::CallSwaps {
            swap_calls: vec![SwapCall {
                contract_address: Addr::unchecked("dex_contract"),
                swap_binary: swap_msg_binary,
                funds: vec![StdCoin {
                    denom: "coin_a".to_string(),
                    amount: Uint128::from(100u32),
                }],
                chain_id: "".to_string(),
                osmo_call: None,
                start_index: 0,
            }],
        };

        let res = execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();
        assert_eq!(res.messages.len(), 1);
    }

    #[test]
    fn test_execute_osmo_calling_swaps() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("sender", &coins(1000, "uatom"));

        let swap_call_osmosis = SwapCall {
            contract_address: Addr::unchecked("osmo_contract"),
            swap_binary: Binary::from(vec![1]),
            funds: vec![coin(100, "uatom")],
            chain_id: "osmosis".to_string(),
            osmo_call: Some(SwapOsmosisCall {
                contract_address: Addr::unchecked("osmo_receiver"),
                TRANSFER_PORT: "transfer_port".to_string(),
                TRANSFER_CHANNEL: "transfer_channel".to_string(),
                memo: "memo".to_string(),
                funds: coin(100, "uatom"),
            }),
            start_index: 0,
        };

        let swap_call_juno = SwapCall {
            contract_address: Addr::unchecked("juno_contract"),
            swap_binary: Binary::from(vec![1]),
            funds: vec![coin(100, "uatom")],
            chain_id: "juno".to_string(),
            osmo_call: None,
            start_index: 0,
        };

        let swap_calls = vec![swap_call_osmosis, swap_call_juno];

        let res = execute_calling_swaps(deps.as_mut(), env, info, swap_calls).unwrap();
        let messages = res.messages;
        assert_eq!(messages.len(), 1);

        if let CosmosMsg::Stargate { type_url, .. } = &messages[0].msg {
            assert_eq!(type_url, "/ibc.applications.transfer.v1.MsgTransfer");
        } else {
            panic!("Unexpected message type for the first message");
        }
    }


    #[cw_serde]
    pub struct Swap {
        pub pool_id: String,
        pub sent_amount: Uint128,
        pub min_received_amount: Uint128,
        pub is_a_to_b: bool,
    }

    fn create_call_data(contract_addr: &Addr) -> Binary {
        let sender = contract_addr.to_string();
        let routes = vec![SwapAmountInRoute {
            pool_id: 1u64,
            token_out_denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2".to_string(),
        }];
        let token_in = Some(Coin {
            denom: "uosmo".to_string(),
            amount: "100000".to_string(),
        });
        let token_out_min_amount = "77961000".to_string();

        let msg_swap_in = MsgSwapExactAmountIn {
            sender,
            routes,
            token_in,
            token_out_min_amount,
        };
        to_binary(&msg_swap_in).unwrap()
    }

    pub fn encode_swap_msg(pool_id: &str, sent_amount: Uint128, min_received_amount: Uint128, is_a_to_b: bool) -> Result<Binary, StdError> {

        let swap_msg = Swap {
            pool_id: pool_id.to_string(),
            sent_amount,
            min_received_amount,
            is_a_to_b,
        };

        to_binary(&swap_msg)
    }


}
