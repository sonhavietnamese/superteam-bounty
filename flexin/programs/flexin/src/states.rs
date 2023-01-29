use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Profile {
    pub username: String,
    pub twitter: String,
    pub telegram: String,
    pub discord: String,
    pub github: String,
    pub linkedin: String,
    pub wallet_address: String,
}
