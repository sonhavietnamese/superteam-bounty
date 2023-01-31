use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token;
use anchor_spl::token::{MintTo, Token, Transfer};
use mpl_token_metadata::instruction::{create_master_edition_v3, create_metadata_accounts_v2};

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

    pub fn mint_nft(
      ctx: Context<MintNFT>,
      creator_key: Pubkey,
      uri: String,
      title: String,
  ) -> Result<()> {
      msg!("Initializing Mint Ticket");
      let cpi_accounts = MintTo {
          mint: ctx.accounts.mint.to_account_info(),
          to: ctx.accounts.token_account.to_account_info(),
          authority: ctx.accounts.payer.to_account_info(),
      };
      msg!("CPI Accounts Assigned");
      let cpi_program = ctx.accounts.token_program.to_account_info();
      msg!("CPI Program Assigned");
      let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
      msg!("CPI Context Assigned");
      token::mint_to(cpi_ctx, 1)?;
      msg!("Token Minted !!!");
      let account_info = vec![
          ctx.accounts.metadata.to_account_info(),
          ctx.accounts.mint.to_account_info(),
          ctx.accounts.mint_authority.to_account_info(),
          ctx.accounts.payer.to_account_info(),
          ctx.accounts.token_metadata_program.to_account_info(),
          ctx.accounts.token_program.to_account_info(),
          ctx.accounts.system_program.to_account_info(),
          ctx.accounts.rent.to_account_info(),
      ];
      msg!("Account Info Assigned");
      let creator = vec![
          mpl_token_metadata::state::Creator {
              address: creator_key,
              verified: false,
              share: 100,
          },
          mpl_token_metadata::state::Creator {
              address: ctx.accounts.mint_authority.key(),
              verified: false,
              share: 0,
          },
      ];
      msg!("Creator Assigned");
      let symbol = std::string::ToString::to_string("symb");
      invoke(
          &create_metadata_accounts_v2(
              ctx.accounts.token_metadata_program.key(),
              ctx.accounts.metadata.key(),
              ctx.accounts.mint.key(),
              ctx.accounts.mint_authority.key(),
              ctx.accounts.payer.key(),
              ctx.accounts.payer.key(),
              title,
              symbol,
              uri,
              Some(creator),
              1,
              true,
              false,
              None,
              None,
          ),
          account_info.as_slice(),
      )?;
      msg!("Metadata Account Created !!!");
      let master_edition_infos = vec![
          ctx.accounts.master_edition.to_account_info(),
          ctx.accounts.mint.to_account_info(),
          ctx.accounts.mint_authority.to_account_info(),
          ctx.accounts.payer.to_account_info(),
          ctx.accounts.metadata.to_account_info(),
          ctx.accounts.token_metadata_program.to_account_info(),
          ctx.accounts.token_program.to_account_info(),
          ctx.accounts.system_program.to_account_info(),
          ctx.accounts.rent.to_account_info(),
      ];
      msg!("Master Edition Account Infos Assigned");
      invoke(
          &create_master_edition_v3(
              ctx.accounts.token_metadata_program.key(),
              ctx.accounts.master_edition.key(),
              ctx.accounts.mint.key(),
              ctx.accounts.payer.key(),
              ctx.accounts.mint_authority.key(),
              ctx.accounts.metadata.key(),
              ctx.accounts.payer.key(),
              Some(0),
          ),
          master_edition_infos.as_slice(),
      )?;
      msg!("Master Edition Nft Minted !!!");

      Ok(())
  }

  pub fn transfer_token(ctx: Context<TransferToken>) -> Result<()> {
      // Create the Transfer struct for our context
      let transfer_instruction = Transfer {
          from: ctx.accounts.from.to_account_info(),
          to: ctx.accounts.to.to_account_info(),
          authority: ctx.accounts.from_authority.to_account_info(),
      };

      let cpi_program = ctx.accounts.token_program.to_account_info();
      // Create the Context for our Transfer request
      let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction);

      // Execute anchor's helper function to transfer tokens
      anchor_spl::token::transfer(cpi_ctx, 1)?;

      Ok(())
  }

  pub fn log_reward(
    ctx: Context<LogRewards>,
    title: String,
    external_link: String,
    winner: String,
    amount: u16,
    be_long_to: String,
) -> Result<()> {
    let reward = &mut ctx.accounts.reward;

    reward.title = title;
    reward.external_link = external_link;
    reward.winner = winner;
    reward.amount = amount;
    reward.be_long_to = be_long_to;

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


#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(mut)]
    pub mint_authority: Signer<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub mint: UncheckedAccount<'info>,
    // #[account(mut)]
    pub token_program: Program<'info, Token>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_metadata_program: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub payer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub rent: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct TransferToken<'info> {
    pub token_program: Program<'info, Token>,
    /// CHECK: The associated token account that we are transferring the token from
    #[account(mut)]
    pub from: UncheckedAccount<'info>,
    /// CHECK: The associated token account that we are transferring the token to
    #[account(mut)]
    pub to: AccountInfo<'info>,
    // the authority of the from account
    pub from_authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct LogRewards<'info> {
    #[account(
    init, 
    payer = signer, 
        seeds=[LOG_REWARD_TAG, signer.key().as_ref()], 
      bump, 
    space = std::mem::size_of::<Reward>() + 8)]
    pub reward: Box<Account<'info, Reward>>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
