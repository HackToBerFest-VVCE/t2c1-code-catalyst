use anchor_lang::prelude::*;

// Replace with the deployed program address before Devnet deployment.
declare_id!("11111111111111111111111111111111");

#[program]
pub mod tourism_registry {
    use super::*;

    pub fn commit_itinerary(
        ctx: Context<CommitItinerary>,
        agent_asset: Pubkey,
        itinerary_hash: [u8; 32],
        destination: String,
    ) -> Result<()> {
        require!(destination.as_bytes().len() <= 64, TourismError::DestinationTooLong);

        let commitment = &mut ctx.accounts.commitment;
        commitment.traveler = ctx.accounts.traveler.key();
        commitment.agent_asset = agent_asset;
        commitment.itinerary_hash = itinerary_hash;
        commitment.destination = destination;
        commitment.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CommitItinerary<'info> {
    #[account(
        init,
        payer = traveler,
        space = 8 + TripCommitment::INIT_SPACE
    )]
    pub commitment: Account<'info, TripCommitment>,
    #[account(mut)]
    pub traveler: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct TripCommitment {
    pub traveler: Pubkey,
    pub agent_asset: Pubkey,
    pub itinerary_hash: [u8; 32],
    #[max_len(64)]
    pub destination: String,
    pub created_at: i64,
}

#[error_code]
pub enum TourismError {
    #[msg("Destination label must be 64 bytes or fewer")]
    DestinationTooLong,
}
