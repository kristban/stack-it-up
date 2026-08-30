-- StackItUp — Featured Stacks schema + seed data
--
-- Curated collections of existing supplements (e.g. "Better Sleep",
-- "Longevity") shown on the homepage and given their own page at
-- /stacks/[key]. featured_stacks holds the collection itself;
-- featured_stack_items is the join table pointing at existing rows in
-- public.supplements.
--
-- No admin UI manages these yet — rows are authored directly in this file
-- and applied by hand, the same way the initial supplement library was
-- seeded before the admin panel existed.
--
-- Prereq: public.supplements must already exist (see
-- docs/supabase-auth-setup.sql through section 9, and
-- docs/supabase-supplements-seed.sql for its data).
--
-- Idempotent: safe to run repeatedly. Schema statements use
-- if not exists / drop-then-create; the seed block upserts by key.

-- 1. Tables ---------------------------------------------------------------

create table if not exists public.featured_stacks (
  key text primary key,
  name text not null,
  emoji text not null,
  tagline text not null,
  description text not null,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.featured_stack_items (
  stack_key text not null references public.featured_stacks (key) on delete cascade,
  supplement_key text not null references public.supplements (key) on delete cascade,
  sort_order integer not null default 100,
  primary key (stack_key, supplement_key)
);

create index if not exists featured_stack_items_stack_key_idx
  on public.featured_stack_items (stack_key);

-- 2. Row level security — public read only. No write policies yet since
--    there's no admin UI for this table; rows are managed via this file.
alter table public.featured_stacks enable row level security;
alter table public.featured_stack_items enable row level security;

drop policy if exists "featured_stacks public read" on public.featured_stacks;
create policy "featured_stacks public read"
  on public.featured_stacks for select
  using (is_active = true);

drop policy if exists "featured_stack_items public read" on public.featured_stack_items;
create policy "featured_stack_items public read"
  on public.featured_stack_items for select
  using (true);

grant select on public.featured_stacks to anon, authenticated;
grant select on public.featured_stack_items to anon, authenticated;

-- 3. Seed data --------------------------------------------------------------

begin;

insert into public.featured_stacks (key, name, emoji, tagline, description, sort_order, is_active) values
('better_sleep', 'Better Sleep Stack', '💤', 'Four well-evidenced picks for falling asleep faster and waking up rested.', 'Sleep problems usually come from two different places — an overactive nervous system, or a body clock that''s drifted out of sync. This stack covers both: magnesium and L-theanine calm you down, while melatonin and glycine work directly on sleep onset.', 10, true),
('longevity', 'Longevity Stack', '🧬', 'A foundational stack built around the supplements with the strongest long-term health evidence.', 'This isn''t about any single outcome — it''s the small set of supplements with genuinely strong, repeated evidence for long-term health: heart, muscle, and cellular aging markers. Think of it as a baseline worth maintaining for years, not a short-term fix.', 20, true),
('fitness_recovery', 'Fitness Recovery Stack', '🔄', 'Bounce back faster between hard training sessions.', 'Training breaks you down; recovery is where the adaptation actually happens. This stack pairs fast electrolyte and protein replenishment with tart cherry''s anti-inflammatory effect, so you''re ready for the next session sooner.', 30, true),
('muscle_strength', 'Muscle & Strength Stack', '💪', 'The core, well-researched picks for building strength and lean mass.', 'Four of the most consistently evidenced supplements for strength training — nothing exotic, just the ones with genuine trial data behind them for building muscle and power output.', 40, true),
('stress_relief', 'Stress & Anxiety Relief Stack', '🧘', 'Calm an overactive nervous system without sedation.', 'Chronic stress quietly affects sleep, digestion, and mood. This stack combines a slow-acting adaptogen with two faster-acting calming tools, so you''re covered whether the stress is a rough week or a rough day.', 50, true),
('gut_reset', 'Gut Health Reset Stack', '🦠', 'Ease digestion, cramping, and irregularity with the best-evidenced gut tools.', 'Different gut symptoms call for different tools — this stack covers the main ones: a multi-strain probiotic for general gut support, fibre for regularity, and peppermint oil specifically for IBS-type cramping.', 60, true),
('immune_defense', 'Immune Defense Stack', '🛡️', 'Daily baseline defense, plus an acute tool for when you''re already getting sick.', 'Vitamin D and C build a steady baseline of immune resilience over months. Zinc lozenges are the outlier here — the one item in this stack meant only for the first day or two of a cold, not daily use.', 70, true),
('vegan_essentials', 'Vegan Essentials Stack', '🌱', 'Close the nutrient gaps a plant-based diet leaves behind.', 'A handful of nutrients are genuinely harder to get enough of on a vegan diet — B12, iodine, and bioavailable iron chief among them. Algal oil covers the omega-3s that would otherwise come from fish.', 80, true),
('focus_cognitive', 'Focus & Cognitive Performance Stack', '🧠', 'Sharper, sustained focus without relying purely on stimulants.', 'Caffeine paired with L-theanine covers acute focus without the jitters. Citicoline and bacopa work on the slower, cumulative side — supporting attention and memory over weeks rather than minutes.', 90, true),
('joint_mobility', 'Joint & Mobility Stack', '🦴', 'Support cartilage and calm joint inflammation for long-term mobility.', 'Omega-3s and collagen support the underlying tissue, while curcumin and boswellia work faster on inflammation itself — a combination that covers both the slow-building and the acute side of joint discomfort.', 100, true)
on conflict (key) do update set name=excluded.name, emoji=excluded.emoji, tagline=excluded.tagline, description=excluded.description, sort_order=excluded.sort_order, is_active=excluded.is_active;

insert into public.featured_stack_items (stack_key, supplement_key, sort_order) values
('better_sleep', 'magnesium', 10),
('better_sleep', 'melatonin', 20),
('better_sleep', 'glycine', 30),
('better_sleep', 'l_theanine', 40),
('longevity', 'vitd3', 10),
('longevity', 'omega3', 20),
('longevity', 'coq10', 30),
('longevity', 'creatine', 40),
('longevity', 'nac', 50),
('fitness_recovery', 'protein', 10),
('fitness_recovery', 'electrolytes', 20),
('fitness_recovery', 'tart_cherry', 30),
('fitness_recovery', 'magnesium', 40),
('muscle_strength', 'creatine', 10),
('muscle_strength', 'protein', 20),
('muscle_strength', 'beta_alanine', 30),
('muscle_strength', 'citrulline', 40),
('stress_relief', 'ashwagandha', 10),
('stress_relief', 'l_theanine', 20),
('stress_relief', 'magnesium', 30),
('stress_relief', 'rhodiola', 40),
('gut_reset', 'probiotic', 10),
('gut_reset', 'fibre', 20),
('gut_reset', 'peppermint_oil', 30),
('immune_defense', 'vitd3', 10),
('immune_defense', 'vitamin_c', 20),
('immune_defense', 'zinc_lozenge', 30),
('vegan_essentials', 'b12', 10),
('vegan_essentials', 'algal_oil', 20),
('vegan_essentials', 'iron', 30),
('vegan_essentials', 'iodine', 40),
('focus_cognitive', 'caffeine_ltheanine', 10),
('focus_cognitive', 'citicoline', 20),
('focus_cognitive', 'bacopa', 30),
('joint_mobility', 'omega3', 10),
('joint_mobility', 'collagen', 20),
('joint_mobility', 'curcumin', 30),
('joint_mobility', 'boswellia', 40)
on conflict (stack_key, supplement_key) do update set sort_order = excluded.sort_order;

commit;
