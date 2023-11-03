use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{BankMsg, Binary, Coin, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Storage, to_binary, Uint128};
use cosmwasm_storage::{Bucket, ReadonlyBucket};
use crate::ContractError::Std;
// use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, GetPoolResponse, InstantiateMsg, Pool, QueryMsg};

/*
// version info for migration info
const CONTRACT_NAME: &str = "crates.io:neuton-dex";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
*/
const POOLS_KEY: &[u8] = b"pools";

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: ExecuteMsg,
) -> Result<Response, ContractError> {

    match _msg {
        ExecuteMsg::CreatePool {
            coin_a,
            coin_b,
            coin_a_reserve,
            coin_b_reserve,
        } => create_pool(_deps, _env, _info, coin_a, coin_b, coin_a_reserve, coin_b_reserve),
        ExecuteMsg::Swap {
            pool_id,
            sent_amount,
            min_received_amount,
            is_a_to_b,
        } => swap(_deps, _env, _info, pool_id, sent_amount, min_received_amount, is_a_to_b),
    }
}

fn create_pool(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    coin_a: String,
    coin_b: String,
    coin_a_reserve: Uint128,
    coin_b_reserve: Uint128,
) -> Result<Response, ContractError> {
    let pool_id = generate_pool_id(&coin_a, &coin_b);
    let pool = Pool {
        id: pool_id.clone(),
        coin_a: coin_a.clone(),
        coin_b: coin_b.clone(),
        coin_a_reserve,
        coin_b_reserve,
    };

    let mut pools_bucket = Bucket::new(deps.storage, POOLS_KEY);
    pools_bucket.save(pool.id.as_bytes(), &pool)?;

    let sent_funds = info.funds;

    let sent_coin_a = sent_funds
        .iter()
        .find(|coin| coin.denom == coin_a)
        .ok_or(Std(StdError::generic_err(
            "Insufficient Funds1",
        )))?;
    let sent_coin_b = sent_funds
        .iter()
        .find(|coin| coin.denom == coin_b)
        .ok_or(Std(StdError::generic_err(
            "Insufficient Funds2",
        )))?;

    if sent_coin_a.amount != coin_a_reserve || sent_coin_b.amount != coin_b_reserve {
        return Err(Std(StdError::generic_err(
            "Insufficient Funds3",
        )));
    }

    Ok(Response::default())
}

fn generate_pool_id(token_a: &str, token_b: &str) -> String {
    let sorted_tokens = if token_a < token_b {
        (token_a, token_b)
    } else {
        (token_b, token_a)
    };

    let mut hasher = DefaultHasher::new();
    sorted_tokens.hash(&mut hasher);
    format!("pool_{}", hasher.finish())
}



fn swap(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    pool_id: String,
    sent_amount: Uint128,
    min_received_amount: Uint128,
    is_a_to_b: bool,
) -> Result<Response, ContractError> {
    let mut pools_bucket = Bucket::new(deps.storage, POOLS_KEY);
    let mut pool: Pool = pools_bucket.load(pool_id.as_bytes())?;

    let (received_amount, new_pool) = if is_a_to_b {
        let received_amount =
            calculate_outgoing_amount(sent_amount, pool.coin_a_reserve, pool.coin_b_reserve)?;

        if received_amount < min_received_amount {
            return Err(Std(StdError::generic_err(
                "Received amount is less than the minimum specified amount",
            )));
        }

        pool.coin_a_reserve += sent_amount;
        pool.coin_b_reserve -= received_amount;

        (received_amount, pool)
    } else {
        let received_amount =
            calculate_outgoing_amount(sent_amount, pool.coin_b_reserve, pool.coin_a_reserve)?;

        if received_amount < min_received_amount {
            return Err(Std(StdError::generic_err(
                "Received amount is less than the minimum specified amount",
            )));
        }

        pool.coin_b_reserve += sent_amount;
        pool.coin_a_reserve -= received_amount;

        (received_amount, pool)
    };

    pools_bucket.save(pool_id.as_bytes(), &new_pool)?;

    let send_coin = if is_a_to_b {
        Coin {
            denom: new_pool.coin_b.clone(),
            amount: received_amount,
        }
    } else {
        Coin {
            denom: new_pool.coin_a.clone(),
            amount: received_amount,
        }
    };

    let swap_msg = BankMsg::Send {
        to_address: info.sender.to_string(),
        amount: vec![send_coin],
    };

    Ok(Response::new().add_message(swap_msg))
}

fn calculate_outgoing_amount(
    input_amount: Uint128,
    input_reserve: Uint128,
    output_reserve: Uint128,
) -> StdResult<Uint128> {
    let input_amount_with_fee = input_amount * Uint128::from(997u32);
    let numerator = input_amount_with_fee * output_reserve;
    let denominator = input_reserve * Uint128::from(1000u32) + input_amount_with_fee;

    Ok(numerator / denominator)
}


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_deps: Deps, _env: Env, _msg: QueryMsg) -> StdResult<Binary> {
    match _msg {
        QueryMsg::GetPool { id } => {
            let pool = query_pool(_deps, id)?;
            to_binary(&GetPoolResponse { pool })
        },
    }
}

fn query_pool(deps: Deps, id: String) -> StdResult<Pool> {
    let pools_bucket =  ReadonlyBucket::new(deps.storage, POOLS_KEY);
    pools_bucket.load(id.as_bytes())
}

#[cfg(test)]
mod tests {
    use cosmwasm_std::{Coin, coin, coins, from_binary, MessageInfo, Uint128};
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use crate::contract::{calculate_outgoing_amount, execute, generate_pool_id, instantiate, query};
    use crate::msg::{ExecuteMsg, GetPoolResponse, InstantiateMsg, Pool, QueryMsg};

    #[test]
    fn test_create_pool_and_query() {
        let mut deps = mock_dependencies();

        let info = mock_info("creator", &[]);
        let env = mock_env();
        instantiate(deps.as_mut(), env.clone(), info.clone(), InstantiateMsg{} ).unwrap();

        let msg = ExecuteMsg::CreatePool {
            coin_a: "coin_a".to_string(),
            coin_b: "coin_b".to_string(),
            coin_a_reserve: Uint128::from(1000u32),
            coin_b_reserve: Uint128::from(2000u32),
        };

        let sent_funds = [(coin(1000, "coin_a")),(coin(2000, "coin_b"))];
        let info_with_funds = mock_info_with_funds("creator", &sent_funds);
        execute(deps.as_mut(), env.clone(), info_with_funds, msg).unwrap();
        let id = generate_pool_id("coin_a","coin_b");
        let query_msg = QueryMsg::GetPool {
            id: id.clone(),
        };
        let pool_bin = query(deps.as_ref(), env.clone(), query_msg).unwrap();
        let response: GetPoolResponse = from_binary(&pool_bin).unwrap();
        let pool = response.pool;
        assert_eq!(pool.id, id);
        assert_eq!(pool.coin_a, "coin_a");
        assert_eq!(pool.coin_b, "coin_b");
        assert_eq!(pool.coin_a_reserve, Uint128::from(1000u32));
        assert_eq!(pool.coin_b_reserve, Uint128::from(2000u32));
    }

    fn mock_info_with_funds(sender: &str, funds: &[Coin]) -> MessageInfo {
        let mut info = mock_info(sender, funds);
        info.funds = funds.to_vec();
        info
    }

    #[test]
    #[test]
    fn test_swap_a_to_b() {
        let mut deps = mock_dependencies();

        let info = mock_info("creator", &[]);
        let env = mock_env();
        instantiate(deps.as_mut(), env.clone(), info.clone(), InstantiateMsg{}).unwrap();

        let msg = ExecuteMsg::CreatePool {
            coin_a: "coin_a".to_string(),
            coin_b: "coin_b".to_string(),
            coin_a_reserve: Uint128::from(1000u32),
            coin_b_reserve: Uint128::from(2000u32),
        };
        let sent_funds = [(coin(1000, "coin_a")),(coin(2000, "coin_b"))];
        let info_with_funds = mock_info_with_funds("creator", &sent_funds);
        execute(deps.as_mut(), env.clone(), info_with_funds, msg).unwrap();

        let pool_id = generate_pool_id("coin_a", "coin_b");

        let sent_amount = Uint128::from(100u32);
        let expected_received_amount = calculate_outgoing_amount(
            sent_amount,
            Uint128::from(1000u32), // Initial coin_a_reserve
            Uint128::from(2000u32), // Initial coin_b_reserve
        )
            .unwrap();

        let msg = ExecuteMsg::Swap {
            pool_id: pool_id.clone(),
            sent_amount,
            min_received_amount: Uint128::from(50u32),
            is_a_to_b: true,
        };
        let res = execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();
        assert_eq!(res.messages.len(), 1);

        let query_msg = QueryMsg::GetPool {
            id: pool_id,
        };
        let pool_bin = query(deps.as_ref(), env.clone(), query_msg).unwrap();
        let response: GetPoolResponse = from_binary(&pool_bin).unwrap();
        let pool = response.pool;
        assert_eq!(pool.coin_a_reserve, Uint128::from(1100u32));
        assert_eq!(pool.coin_b_reserve, Uint128::from(2000u32) - expected_received_amount);
    }

}
