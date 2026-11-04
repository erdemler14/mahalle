-- Retire 70,000 TL beta-test credit feature.
-- Preserve existing accounting and transaction history; do not silently
-- subtract cash from players who may have spent money after receiving it.
begin;
revoke execute on function public.claim_beta_test_fund_20261104(text) from authenticated;
drop function if exists public.claim_beta_test_fund_20261104(text);
drop function if exists public.claim_beta_test_fund_20261104();
drop table if exists public.beta_fund_invites;
-- Keep player_beta_funds as a closed audit ledger with RLS and no client grants.
revoke all on public.player_beta_funds from public,anon,authenticated;
update public.player_saves
set state=state-'betaTestFundClaimed',updated_at=now()
where state ? 'betaTestFundClaimed';
commit;
