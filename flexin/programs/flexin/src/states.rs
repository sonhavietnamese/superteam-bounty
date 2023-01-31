use anchor_lang::prelude::*;

#[account]
pub struct Profile {
    pub username: String,
    pub twitter: String,
    pub telegram: String,
    pub discord: String,
    pub github: String,
    pub linkedin: String,
    pub wallet_address: String,
}

#[account]
pub struct Reward {
    pub title: String,
    pub external_link: String,
    pub winner: String,
    pub amount: u16,
    pub be_long_to: String,
}
