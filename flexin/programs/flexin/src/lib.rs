use anchor_lang::prelude::*;

pub mod constant;
pub mod states;

use crate::{constant::*, states::*};

declare_id!("39UciAEyv3unkrHmNBhAqgwU9LPdvtdGhHnoofCKcb3h");

#[program]
pub mod flexin {
    use super::*;

    pub fn create_profile(
        ctx: Context<CreateProfile>,
        username: String,
        twitter: String,
        telegram: String,
        discord: String,
        github: String,
        linkedin: String,
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;

        // profile.username = ctx.accounts.signer.key().to_string();
        profile.wallet_address = ctx.accounts.signer.key().to_string();

        let profile = &mut ctx.accounts.profile;

        if !username.eq(&EMPTY_STRING) {
            profile.username = username
        }

        if !twitter.eq(&EMPTY_STRING) {
            profile.twitter = twitter
        }

        if !discord.eq(&EMPTY_STRING) {
            profile.discord = discord
        }

        if !telegram.eq(&EMPTY_STRING) {
            profile.telegram = telegram
        }

        if !github.eq(&EMPTY_STRING) {
          profile.github = github
        }

        if !linkedin.eq(&EMPTY_STRING) {
            profile.linkedin = linkedin
        }

        Ok(())
    }

    pub fn update_profile(
        ctx: Context<UpdateProfile>,
        username: String,
        twitter: String,
        telegram: String,
        linkedin: String,
        discord: String,
        github: String,
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;

        if !username.eq(&EMPTY_STRING) {
            profile.username = username
        }

        if !twitter.eq(&EMPTY_STRING) {
            profile.twitter = twitter
        }

        if !discord.eq(&EMPTY_STRING) {
            profile.discord = discord
        }

        if !telegram.eq(&EMPTY_STRING) {
            profile.telegram = telegram
        }

        if !github.eq(&EMPTY_STRING) {
            profile.github = github
        }

        if !linkedin.eq(&EMPTY_STRING) {
            profile.linkedin = linkedin
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(
      init, 
      payer = signer, 
      seeds=[PROFILE_TAG, signer.key().as_ref()], 
      bump, 
      space = std::mem::size_of::<Profile>() + 8
    )]
    pub profile: Box<Account<'info, Profile>>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(
    mut,
    seeds = [PROFILE_TAG, signer.key().as_ref()],
    bump,
  )]
    pub profile: Box<Account<'info, Profile>>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
