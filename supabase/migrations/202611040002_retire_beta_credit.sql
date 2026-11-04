-- Retire 70,000 TL beta-test credit feature.
-- Preserve existing accounting and transaction history; do not silently
-- subtract cash from players who may have spent money after receiving it.
begin;
drop function if exists public.claim_beta_test_fund_20261104(text);
drop function if exists public.claim_beta_test_fund_20261104();
drop table if exists public.beta_fund_invites;
-- Keep player_beta_funds as a closed audit ledger with RLS and no client grants.
do $
begin
  if to_regclass('public.player_beta_funds') is not null then
    revoke all on public.player_beta_funds from public,anon,authenticated;
  end if;
  if to_regclass('public.player_saves') is not null then
    update public.player_saves
    set state=state-'betaTestFundClaimed',updated_at=now()
    where state ? 'betaTestFundClaimed';
  end if;
end $;
commit;
